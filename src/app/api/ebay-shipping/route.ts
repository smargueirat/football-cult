import { NextRequest, NextResponse } from "next/server";

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

// eBay item URLs look like https://www.ebay.com/itm/158171810957?... --
// the Browse API's own itemId format for a non-variation listing is
// just that legacy numeric id wrapped as "v1|<id>|0".
function extractItemId(ebayUrl: string): string | null {
  const match = ebayUrl.match(/\/itm\/(\d+)/);
  return match ? `v1|${match[1]}|0` : null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const country = req.nextUrl.searchParams.get("country");
  if (!url || !country) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const itemId = extractItemId(url);
  if (!itemId) {
    return NextResponse.json({ error: "not_ebay_item" }, { status: 400 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${ITEM_URL}${encodeURIComponent(itemId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        "X-EBAY-C-ENDUSERCTX": `contextualLocation=country=${encodeURIComponent(country)}`,
      },
      // Los cargos son estimaciones del lado de eBay, no cambian minuto a
      // minuto -- cachear una hora reduce el uso de la cuota diaria de la
      // API sin mostrar datos viejos de verdad.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "ebay_error" }, { status: 502 });
    }
    const data = await res.json();
    const option = data.shippingOptions?.[0];
    if (!option?.shippingCost) {
      return NextResponse.json({ shipping: null, importCharges: null, currency: null });
    }
    return NextResponse.json({
      shipping: Number(option.shippingCost.value),
      currency: option.shippingCost.currency ?? null,
      importCharges: option.importCharges ? Number(option.importCharges.value) : null,
    });
  } catch {
    return NextResponse.json({ error: "request_failed" }, { status: 502 });
  }
}
