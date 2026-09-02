import { NextRequest, NextResponse } from "next/server";
import { gunzipSync } from "zlib";
import { parse } from "csv-parse/sync";
import { Resend } from "resend";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { Offer, formatOfferMoney, products, teamNames, typeNames } from "@/data/products";

const SITE_URL = "https://football-cult.com";

export const maxDuration = 60;

const FEED_URLS: Record<string, string | undefined> = {
  PlanetFoot: process.env.AWIN_FEED_URL_PLANETFOOT,
  FansJerseyHub: process.env.AWIN_FEED_URL_FANSJERSEYHUB,
  ComoFCShop: process.env.AWIN_FEED_URL_COMOFC,
  DeporteOutletES: process.env.AWIN_FEED_URL_DEPORTEOUTLET,
  FootStoreES: process.env.AWIN_FEED_URL_FOOTSTORE_ES,
  FootStoreFR: process.env.AWIN_FEED_URL_FOOTSTORE_FR,
  SportIsGoodES: process.env.AWIN_FEED_URL_SPORTISGOOD_ES,
  SportIsGoodFR: process.env.AWIN_FEED_URL_SPORTISGOOD_FR,
  AdidasES: process.env.AWIN_FEED_URL_ADIDAS_ES,
  AdidasPT: process.env.AWIN_FEED_URL_ADIDAS_PT,
  BSTNIT: process.env.AWIN_FEED_URL_BSTN_IT,
};

// Mystery Shirt Club isn't onboarded via an Awin datafeed CSV — it has none
// registered — so we mine/re-price it straight from its public Shopify
// storefront JSON API instead, building the same Awin cread.php deep link
// (awinmid=124324, our publisher id 3013769) the datafeed would have used.
const SHOPIFY_STORES: Record<string, { domain: string; awinmid: string } | undefined> = {
  MysteryShirtClub: { domain: "mysteryshirtclub.com", awinmid: "124324" },
};

interface FeedRow {
  aw_deep_link?: string;
  // Los feeds formato "Google" traen el precio de lista en "price" y el
  // precio real (con descuento) en "sale_price" cuando existe. Los feeds
  // formato "Awin" lo traen directamente en "search_price".
  price?: string;
  sale_price?: string;
  search_price?: string;
  [key: string]: string | undefined;
}

async function fetchFeed(url: string): Promise<FeedRow[]> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const csv = gunzipSync(buffer).toString("utf-8");
  return parse(csv, { columns: true, skip_empty_lines: true, bom: true });
}

interface ShopifyVariant {
  price: string;
  available: boolean;
}

interface ShopifyProduct {
  handle: string;
  variants: ShopifyVariant[];
}

async function fetchShopifyFeed(domain: string, awinmid: string): Promise<FeedRow[]> {
  const rows: FeedRow[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(`https://${domain}/products.json?limit=250&page=${page}`);
    const data = (await res.json()) as { products?: ShopifyProduct[] };
    const items = data.products ?? [];
    if (items.length === 0) break;
    for (const p of items) {
      const variant = p.variants.find((v) => v.available) ?? p.variants[0];
      if (!variant) continue;
      const productUrl = `https://${domain}/products/${p.handle}`;
      const deepLink = `https://www.awin1.com/cread.php?awinmid=${awinmid}&awinaffid=3013769&ued=${encodeURIComponent(productUrl)}`;
      rows.push({ aw_deep_link: deepLink, price: variant.price });
    }
    if (items.length < 250) break;
  }
  return rows;
}

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "Redis not configured yet" }, { status: 503 });
  }
  const redis = await getRedis();

  const feedCache = new Map<string, FeedRow[]>();
  const summary: { productId: string; store: string; from: number; to: number; currency: Offer["currency"] }[] =
    [];
  const errors: string[] = [];

  for (const product of products) {
    for (const offer of product.offers) {
      const feedUrl = FEED_URLS[offer.store];
      const shopifyStore = SHOPIFY_STORES[offer.store];
      if (!feedUrl && !shopifyStore) continue;

      try {
        if (!feedCache.has(offer.store)) {
          feedCache.set(
            offer.store,
            shopifyStore
              ? await fetchShopifyFeed(shopifyStore.domain, shopifyStore.awinmid)
              : await fetchFeed(feedUrl!)
          );
        }
        const rows = feedCache.get(offer.store)!;
        const match = rows.find((r) => r.aw_deep_link === offer.url);
        if (!match) continue;

        const currentPrice = parsePrice(match.sale_price ?? match.price ?? match.search_price);
        if (currentPrice == null) continue;

        const priceKey = `lastPrice:${product.id}:${offer.store}`;
        const storedRaw = await redis.get(priceKey);
        const lastKnownPrice = storedRaw ? parseFloat(storedRaw) : offer.price;

        if (currentPrice < lastKnownPrice) {
          summary.push({
            productId: product.id,
            store: offer.store,
            from: lastKnownPrice,
            to: currentPrice,
            currency: offer.currency,
          });
        }

        await redis.set(priceKey, currentPrice.toString());
      } catch (err) {
        errors.push(`${product.id}/${offer.store}: ${(err as Error).message}`);
      }
    }
  }

  // Un mail por producto, no por oferta -- si dos tiendas del mismo
  // producto bajaron en la misma corrida, se avisa una sola vez con la
  // mejor de las dos (menor precio nuevo). Los suscriptores son el
  // registro que /api/price-alerts arma cuando alguien marca un
  // favorito estando logueado (ver comentario en FavoritesContext.tsx).
  let alertsSent = 0;
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && summary.length > 0) {
    const resend = new Resend(apiKey);
    const dropsByProduct = new Map<string, (typeof summary)[number]>();
    for (const drop of summary) {
      const existing = dropsByProduct.get(drop.productId);
      if (!existing || drop.to < existing.to) dropsByProduct.set(drop.productId, drop);
    }

    for (const [productId, drop] of dropsByProduct) {
      const subscribers = await redis.sMembers(`priceAlertSubscribers:${productId}`);
      if (subscribers.length === 0) continue;

      const product = products.find((p) => p.id === productId);
      if (!product) continue;
      const name = `${teamNames[product.teamKey].es} ${typeNames[product.typeKey].es} ${product.season}`;
      const url = `${SITE_URL}/camiseta/${productId}`;
      const fromMoney = formatOfferMoney(drop.from, drop.currency);
      const toMoney = formatOfferMoney(drop.to, drop.currency);

      try {
        await resend.emails.send({
          from: "Football Cult <onboarding@resend.dev>",
          // Resend permite varios destinatarios en un mismo envío -- un
          // mail por corrida por producto, no uno por suscriptor.
          to: subscribers,
          subject: `Bajó de precio: ${name}`,
          text: `${name} bajó de ${fromMoney} a ${toMoney} en ${drop.store}.\n\nVerla: ${url}`,
        });
        alertsSent += subscribers.length;
      } catch (err) {
        errors.push(`alert email ${productId}: ${(err as Error).message}`);
      }
    }
  }

  return NextResponse.json({ checked: products.length, drops: summary, alertsSent, errors });
}
