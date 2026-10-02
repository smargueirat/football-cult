import { after, type NextRequest } from "next/server";
import { GO_KINDS, offerHash, type GoKind } from "@/lib/go";
import { isLocale } from "@/lib/i18n/locales";
import { logClick, summarizeUserAgent } from "@/lib/clickLog";

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
  after(() =>
    logClick({
      t: new Date().toISOString(),
      ok: !!url,
      k: valid ? kind : "?",
      p: valid ? productId : "?",
      s: offer?.store,
      u: url,
      l: locale,
      o: (q.get("o") ?? "").replace(/[^a-z-]/g, "").slice(0, 16) || "?",
      n: Number.isInteger(n) && n > 0 && n < 100 ? n : undefined,
      b: q.get("b") === "1" || undefined,
      ua: summarizeUserAgent(req.headers.get("user-agent")),
    }),
  );

  if (url && /^https?:\/\//.test(url)) return redirect(url);
  if (valid && known) return redirect(`/${locale}/${GO_KINDS[kind]}/${productId}`);
  return redirect(`/${locale}`);
}

// HEAD (previsualizadores, chequeos de enlaces) no es un clic: no se anota.
export function HEAD() {
  return new Response(null, { status: 204, headers: NOINDEX });
}
