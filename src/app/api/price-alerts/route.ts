import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/auth";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { MAIL_FROM } from "@/lib/mailFrom";
import { isLocale } from "@/lib/i18n/locales";
import {
  EMAIL_COPY,
  PRODUCT_ID_RE,
  activate,
  applyToken,
  createConfirmToken,
  deactivate,
  pageUrl,
  readToken,
  subsKey,
} from "@/lib/priceAlerts";

// Registro de alertas de precio: un set de emails por producto en Redis
// que lee scripts/check_price_alerts.mts (cron semanal, fuera del proceso
// web) para saber a quién avisar.
//
// - Con sesión iniciada (favoritos) el alta es directa: el correo ya está
//   verificado por el propio login (Google o enlace mágico).
// - Sin sesión, doble opt-in: se manda un correo con un enlace (token
//   aleatorio en Redis) y la alerta solo se activa al confirmar. Antes se
//   activaba al instante, así que cualquiera podía apuntar el correo de otro.
// - La baja sin sesión solo se hace con el token de cada aviso. Antes
//   cualquiera podía dar de baja cualquier correo con subscribe:false.
// - Los enlaces de los correos abren /[locale]/alerta-precio, que muestra
//   un botón; la acción llega aquí por POST (?t=). Un GET nunca cambia nada:
//   los escáneres de correo abren los enlaces solos.
const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/;
const CONFIRMS_PER_DAY = 5;

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
// Location relativo: detrás del túnel req.url trae 127.0.0.1:3100 (ver /go/).
function redirect(dest: string) {
  return new Response(null, { status: 303, headers: { ...NOINDEX, Location: dest } });
}

// GET ?t= (p. ej. un cliente de correo que abre la URL de List-Unsubscribe
// en el navegador): solo lleva a la página del botón, no hace nada.
export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get("t") ?? "";
  let locale = "es";
  try {
    if (isRedisConfigured()) locale = (await readToken(await getRedis(), t))?.l ?? "es";
  } catch {}
  return redirect(`/${locale}/alerta-precio?t=${encodeURIComponent(t)}`);
}

export async function POST(req: NextRequest) {
  // POST ?t=: el botón de /[locale]/alerta-precio (formulario HTML, se
  // responde con redirección a la página de resultado) o la baja one-click
  // del cliente de correo (cuerpo "List-Unsubscribe=One-Click", RFC 8058;
  // se responde 200 sin redirección).
  const t = req.nextUrl.searchParams.get("t");
  if (t !== null) {
    const form = await req.formData().catch(() => null);
    const oneClick = form?.get("List-Unsubscribe") === "One-Click";
    let done: Awaited<ReturnType<typeof applyToken>> = null;
    try {
      if (isRedisConfigured()) {
        const redis = await getRedis();
        // One-click solo puede dar de baja, nunca confirmar un alta.
        if (!oneClick || (await readToken(redis, t))?.a === "u") done = await applyToken(redis, t);
      }
    } catch (err) {
      console.error("price-alerts token", err);
      if (oneClick) return NextResponse.json({ error: "unavailable" }, { status: 503 });
      return redirect(`/es/alerta-precio?r=error`);
    }
    if (oneClick) return NextResponse.json(done ? { ok: true } : { error: "invalid_token" }, { status: done ? 200 : 400 });
    if (!done) return redirect(`/es/alerta-precio?r=invalid`);
    return redirect(`/${done.l}/alerta-precio?r=${done.a === "c" ? "confirmed" : "unsubscribed"}`);
  }

  if (Number(req.headers.get("content-length") ?? 0) > 2000) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  let body: { productId?: string; subscribe?: boolean; email?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { productId, subscribe } = body;
  if (!productId || !PRODUCT_ID_RE.test(productId) || typeof subscribe !== "boolean") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : "es";

  // Degrada en silencio si Redis no está configurado en este entorno: el
  // favorito ya se guardó igual, esto es solo el registro para avisar.
  if (!isRedisConfigured()) return NextResponse.json({ ok: true });

  const session = await auth();
  let redis;
  try {
    redis = await getRedis();
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const sessionEmail = session?.user?.email?.toLowerCase();
  if (sessionEmail) {
    if (subscribe) await activate(redis, sessionEmail, productId, locale);
    else await deactivate(redis, sessionEmail, productId);
    return NextResponse.json({ ok: true, pending: false });
  }
  if (!subscribe) return NextResponse.json({ error: "session_required" }, { status: 401 });

  const email = body.email?.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }
  if (await redis.sIsMember(subsKey(productId), email)) {
    return NextResponse.json({ ok: true, pending: false });
  }

  // Tope de correos de confirmación por dirección: que el formulario no
  // sirva para bombardear el buzón de otro (ni gastar la cuota de Resend).
  const counter = `priceAlertConfirmSent:${email}`;
  const sent = await redis.incr(counter);
  if (sent === 1) await redis.expire(counter, 24 * 3600);
  if (sent > CONFIRMS_PER_DAY) return NextResponse.json({ error: "too_many" }, { status: 429 });

  const link = pageUrl(await createConfirmToken(redis, email, productId, locale), locale);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[price-alerts] sin RESEND_API_KEY; enlace de confirmación:", link);
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const copy = EMAIL_COPY[locale];
  // El SDK de Resend no lanza en errores de la API: los devuelve en `error`.
  const { error } = await new Resend(apiKey).emails.send({
    from: MAIL_FROM,
    to: email,
    subject: copy.confirmSubject,
    text: copy.confirmBody(link, productId),
  });
  if (error) {
    console.error("price-alerts confirm email", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, pending: true });
}
