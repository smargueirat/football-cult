import { after, type NextRequest } from "next/server";
import { GO_KINDS, offerHash, type GoKind } from "@/lib/go";
import { isLocale } from "@/lib/i18n/locales";
import { logClick, summarizeUserAgent } from "@/lib/clickLog";
import { AFFILIATE_COOKIE, SKIMLINKS_PUB_ID } from "@/lib/consent";
import { botReason, untracked, withSubId } from "@/lib/goOut";

// Redirect de salida: /go/<hash de la URL de la oferta>?k=<tipo>&p=<producto>
// Ver src/lib/go.ts. Resuelve la oferta contra el catálogo (el destino
// nunca viene en la URL), anota el clic sin bloquear y responde 302.
// Si no encuentra la oferta manda a la ficha o al home: nunca un 5xx.

type Offerish = { url: string; store: string; sizePrices?: { url: string }[] };
type Productish = { id: string; offers: Offerish[] };

// Un import dinámico por tipo: cada catálogo pesa entre 1 y 12 MB y casi
// todos los clics son de camisetas.
async function catalog(kind: GoKind): Promise<Productish[]> {
  switch (kind) {
    case "j": return (await import("@/data/products")).products;
    case "b": return (await import("@/data/boots")).bootProducts;
    case "g": return (await import("@/data/gloves")).gloveProducts;
    case "p": return (await import("@/data/balls")).ballProducts;
    case "a": return (await import("@/data/apparel")).apparelProducts;
    case "e": return (await import("@/data/training")).trainingProducts;
    case "t": return (await import("@/data/tickets")).ticketProducts;
  }
}

// Tiendas sin etiqueta propia en la URL: solo las monetiza Skimlinks, que en
// un enlace /go/ ya no puede reescribirlo en el navegador. Se envuelven en el
// servidor, y solo si la persona aceptó la afiliación.
const SKIM_HOSTS = /^https?:\/\/(www\.prodirectsport\.(es|com)|ar\.puma\.com|www\.nike\.(cl|com\.ar))\//;

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

// Location relativo para los destinos internos: detrás del túnel,
// req.url trae el host interno (127.0.0.1:3100), no football-cult.com.
function redirect(dest: string) {
  return new Response(null, { status: 302, headers: { ...NOINDEX, Location: dest } });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const q = req.nextUrl.searchParams;
  const locale = isLocale(q.get("l") ?? "") ? (q.get("l") as string) : "es";
  const kind = q.get("k") as GoKind | null;
  const productId = q.get("p") ?? "";
  const valid = kind && kind in GO_KINDS && /^[\w.-]{1,160}$/.test(productId);

  let offer: Offerish | undefined;
  let url: string | undefined;
  let known = false;
  if (valid) {
    try {
      const product = (await catalog(kind)).find((p) => p.id === productId);
      known = !!product;
      for (const o of product?.offers ?? []) {
        if (offerHash(o.url) === id) { offer = o; url = o.url; break; }
        const sp = o.sizePrices?.find((s) => offerHash(s.url) === id);
        if (sp) { offer = o; url = sp.url; break; }
      }
    } catch (err) {
      console.error("go:", err instanceof Error ? err.message : err);
    }
  }

  const n = Number(q.get("n"));
  const pos = Number.isInteger(n) && n > 0 && n < 100 ? n : undefined;
  const origin = (q.get("o") ?? "").replace(/[^a-z-]/g, "").slice(0, 16) || "?";
  const js = q.get("j") === "1";
  const bot = botReason(req.headers, js);
  const cc = (req.headers.get("cf-ipcountry") ?? "").replace(/[^A-Z0-9]/g, "").slice(0, 2) || "XX";
  // Precarga: el navegador nunca debe recibir un 2xx que luego reutilice
  // como respuesta al clic de verdad. No es un clic: no se anota.
  if (bot === "prefetch") return new Response(null, { status: 403, headers: NOINDEX });

  after(() =>
    logClick({
      t: new Date().toISOString(),
      ok: !!url,
      k: valid ? kind : "?",
      p: valid ? productId : "?",
      s: offer?.store,
      u: url,
      l: locale,
      o: origin,
      n: pos,
      b: q.get("b") === "1" || undefined,
      ua: summarizeUserAgent(req.headers.get("user-agent")),
      h: !bot,
      bot,
      cc,
      sf: (req.headers.get("sec-fetch-site") ?? "-").slice(0, 12),
      j: js || undefined,
    }),
  );

  const page = valid && known ? `/${locale}/${GO_KINDS[kind]}/${productId}` : `/${locale}`;
  if (url && /^https?:\/\//.test(url)) {
    // Robot: la tienda sin nuestro id (o la ficha si el destino solo lo
    // conoce la red). Un UA que se declara robot no recibe nada.
    if (bot) {
      const clean = untracked(url) ?? (bot === "ua" ? null : page);
      return clean ? redirect(clean) : new Response(null, { status: 403, headers: NOINDEX });
    }
    const src = { section: GO_KINDS[kind!], locale, country: cc, origin: `${origin}${pos ?? ""}${q.get("b") === "1" ? "b" : ""}`, productId };
    if (SKIM_HOSTS.test(url) && req.cookies.get(AFFILIATE_COOKIE)?.value === "1")
      return redirect(withSubId(`https://go.skimresources.com/?id=${SKIMLINKS_PUB_ID}&xs=1&url=${encodeURIComponent(url)}`, src));
    return redirect(withSubId(url, src));
  }
  return redirect(page);
}

// HEAD (previsualizadores, chequeos de enlaces) no es un clic: no se anota.
export function HEAD() {
  return new Response(null, { status: 204, headers: NOINDEX });
}
