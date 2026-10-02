import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/data/countries";

// eBay's Browse API can't compute a shipping estimate at all without a
// destination -- calling /item/{id} with no X-EBAY-C-ENDUSERCTX header
// returns shippingOptions: null plus a warning ("There was a problem
// calculating the shipping cost"), confirmed live. Passing
// contextualLocation=country=<ISO> (no zip needed) makes eBay return a
// real "eBay International Shipping" estimate, including importCharges
// when the destination has them -- this is genuinely per-destination
// data, not something safe to pre-mine for all 74 countries we support
// (that's ~74x the API calls for the whole catalog). Instead this route
// is called live, per jersey-detail-page view, only for the eBay
// offer(s) actually shown on that page.
const OAUTH_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const ITEM_URL = "https://api.ebay.com/buy/browse/v1/item/";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in ?? 7200) - 60) * 1000,
  };
  return cachedToken.token;
}

// Solo los cuatro sitios de eBay que tiene el catálogo; el marketplace de la
// consulta sigue al sitio de la oferta para que la moneda coincida (si no,
// una oferta de ebay.es en EUR recibiría USD y el cliente la descartaría).
const MARKETPLACE: Record<string, string> = {
  "www.ebay.com": "EBAY_US",
  "www.ebay.co.uk": "EBAY_GB",
  "www.ebay.es": "EBAY_ES",
  "www.ebay.it": "EBAY_IT",
};
const COUNTRY_CODES = new Set<string>(countries.map((c) => c.code));

// eBay item URLs look like https://www.ebay.com/itm/158171810957?... --
// the Browse API's own itemId format for a non-variation listing is
// just that legacy numeric id wrapped as "v1|<id>|0".
function parseItem(ebayUrl: string): { itemId: string; marketplace: string } | null {
  let u: URL;
  try {
    u = new URL(ebayUrl);
  } catch {
    return null;
  }
  const marketplace = MARKETPLACE[u.hostname];
  const match = u.protocol === "https:" ? u.pathname.match(/^\/itm\/(\d{9,15})(?:\/|$)/) : null;
  return marketplace && match ? { itemId: `v1|${match[1]}|0`, marketplace } : null;
}

// TOPE: 1.500 llamadas a eBay por día (de las 5.000 de la cuota Browse, que se
// reinicia 07:00 UTC; el resto queda para la minería nocturna) y 30 por IP por minuto.
const DAILY_CAP = 1500;
const IP_LIMIT = 30;
const OK_TTL = 24 * 3600_000;
const MISS_TTL = 3600_000; // sin dato / error / ítem inexistente: no reintentar enseguida
const CACHE_MAX = 20000;

type Result = { status: number; body: Record<string, unknown> };
const cache = new Map<string, { expires: number; result: Result }>();
const ipHits = new Map<string, { n: number; resetAt: number }>();
let quota = { day: -1, used: 0 };

function overQuota(): boolean {
  const day = Math.floor((Date.now() - 7 * 3600_000) / 86400_000);
  if (quota.day !== day) quota = { day, used: 0 };
  return quota.used >= DAILY_CAP;
}

function ipLimited(ip: string): boolean {
  const now = Date.now();
  if (ipHits.size > 10000) for (const [k, v] of ipHits) if (v.resetAt < now) ipHits.delete(k);
  const hit = ipHits.get(ip);
  if (!hit || hit.resetAt < now) {
    ipHits.set(ip, { n: 1, resetAt: now + 60_000 });
    return false;
  }
  return ++hit.n > IP_LIMIT;
}

function reply({ status, body }: Result) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "public, max-age=3600" } });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const country = req.nextUrl.searchParams.get("country");
  if (!url || !country) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }
  if (!COUNTRY_CODES.has(country)) {
    return NextResponse.json({ error: "bad_country" }, { status: 400 });
  }

  const item = parseItem(url);
  if (!item) {
    return NextResponse.json({ error: "not_ebay_item" }, { status: 400 });
  }

  const key = `${item.marketplace}|${item.itemId}|${country}`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return reply(hit.result);

  // Solo los pedidos que llegarían a eBay cuentan para el límite por IP.
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (ipLimited(ip) || overQuota()) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  quota.used++;
  let result: Result;
  let ttl = MISS_TTL;
  try {
    const res = await fetch(`${ITEM_URL}${encodeURIComponent(item.itemId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": item.marketplace,
        "X-EBAY-C-ENDUSERCTX": `contextualLocation=country=${country}`,
      },
      // La caché en memoria de arriba es la que manda (cuenta las llamadas
      // reales); esta además sobrevive a un reinicio del servidor.
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      result = { status: 502, body: { error: "ebay_error" } };
    } else {
      const data = await res.json();
      const option = data.shippingOptions?.[0];
      if (!option?.shippingCost) {
        result = { status: 200, body: { shipping: null, importCharges: null, currency: null } };
      } else {
        ttl = OK_TTL;
        result = {
          status: 200,
          body: {
            shipping: Number(option.shippingCost.value),
            currency: option.shippingCost.currency ?? null,
            importCharges: option.importCharges ? Number(option.importCharges.value) : null,
          },
        };
      }
    }
  } catch {
    result = { status: 502, body: { error: "request_failed" } };
  }
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
  cache.set(key, { expires: Date.now() + ttl, result });
  return reply(result);
}
