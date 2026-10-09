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
  confirmUrl,
  deactivate,
  subsKey,
  verifyToken,
} from "@/lib/priceAlerts";

// Registro de alertas de precio: un set de emails por producto en Redis
// que lee scripts/check_price_alerts.mts (cron semanal, fuera del proceso
// web) para saber a quién avisar.
//
// - Con sesión iniciada (favoritos) el alta es directa: el correo ya está
//   verificado por el propio login (Google o enlace mágico).
// - Sin sesión, doble opt-in: se manda un correo con un enlace firmado y la
//   alerta solo se activa al pulsarlo. Antes se activaba al instante, así
//   que cualquiera podía apuntar el correo de otro.
// - La baja sin sesión solo se hace con el enlace firmado de cada aviso
//   (GET, o POST "one-click" de la cabecera List-Unsubscribe, RFC 8058).
//   Antes cualquiera podía dar de baja cualquier correo con subscribe:false.
const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/;
const CONFIRMS_PER_DAY = 5;

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
// Location relativo: detrás del túnel req.url trae 127.0.0.1:3100 (ver /go/).
function redirect(dest: string) {
  return new Response(null, { status: 303, headers: { ...NOINDEX, Location: dest } });
}

export async function GET(req: NextRequest) {
  const tok = verifyToken(req.nextUrl.searchParams.get("t"));
  const locale = tok?.l ?? "es";
  if (!tok || !isRedisConfigured()) return redirect(`/${locale}/alerta-precio?r=invalid`);
  try {
    const redis = await getRedis();
    if (tok.a === "c") await activate(redis, tok.e, tok.p, tok.l);
    else await deactivate(redis, tok.e, tok.p);
  } catch (err) {
    console.error("price-alerts link", err);
    return redirect(`/${locale}/alerta-precio?r=error`);
  }
  return redirect(`/${locale}/alerta-precio?r=${tok.a === "c" ? "confirmed" : "unsubscribed"}`);
}

export async function POST(req: NextRequest) {
  // Baja "one-click" desde el cliente de correo (List-Unsubscribe-Post).
  const t = req.nextUrl.searchParams.get("t");
  if (t) {
    const tok = verifyToken(t);
    if (!tok || tok.a !== "u") return NextResponse.json({ error: "invalid_token" }, { status: 400 });
    if (!isRedisConfigured()) return NextResponse.json({ error: "unavailable" }, { status: 503 });
    try {
      await deactivate(await getRedis(), tok.e, tok.p);
    } catch {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
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

  const link = confirmUrl(email, productId, locale);
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
