import { NextRequest, NextResponse } from "next/server";
import { gunzipSync } from "zlib";
import { parse } from "csv-parse/sync";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { products } from "@/data/products";

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
  const summary: { productId: string; store: string; from: number; to: number }[] = [];
  const errors: string[] = [];

  for (const product of products) {
    for (const offer of product.offers) {
      const feedUrl = FEED_URLS[offer.store];
      if (!feedUrl) continue;

      try {
        if (!feedCache.has(offer.store)) {
          feedCache.set(offer.store, await fetchFeed(feedUrl));
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
          });
        }

        await redis.set(priceKey, currentPrice.toString());
      } catch (err) {
        errors.push(`${product.id}/${offer.store}: ${(err as Error).message}`);
      }
    }
  }

  return NextResponse.json({ checked: products.length, drops: summary, errors });
}
