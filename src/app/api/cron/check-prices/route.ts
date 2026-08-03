import { NextRequest, NextResponse } from "next/server";
import { gunzipSync } from "zlib";
import { parse } from "csv-parse/sync";
import { kv } from "@vercel/kv";
import { Resend } from "resend";
import { products } from "@/data/products";

export const maxDuration = 60;

const FEED_URLS: Record<string, string | undefined> = {
  PlanetFoot: process.env.AWIN_FEED_URL_PLANETFOOT,
  FansJerseyHub: process.env.AWIN_FEED_URL_FANSJERSEYHUB,
};

interface FeedRow {
  aw_deep_link?: string;
  price?: string;
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
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ error: "KV not configured yet" }, { status: 503 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;

  const feedCache = new Map<string, FeedRow[]>();
  const summary: { productId: string; store: string; from: number; to: number; notified: number }[] = [];
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

        const currentPrice = parsePrice(match.price);
        if (currentPrice == null) continue;

        const priceKey = `lastPrice:${product.id}:${offer.store}`;
        const storedRaw = await kv.get<number>(priceKey);
        const lastKnownPrice = storedRaw ?? offer.price;

        if (currentPrice < lastKnownPrice) {
          const subscribers = await kv.smembers(`alerts:${product.id}`);
          let notified = 0;

          if (resend && subscribers.length > 0) {
            for (const email of subscribers) {
              await resend.emails.send({
                from: "Football Cult <onboarding@resend.dev>",
                to: email,
                subject: `¡Bajó de precio! ${product.teamKey} ${product.typeKey}`,
                html: `<p>El precio en ${offer.store} bajó de ${lastKnownPrice} a ${currentPrice} ${offer.currency}.</p><p><a href="https://football-cult.com/camiseta/${product.id}">Ver camiseta</a></p>`,
              });
              notified++;
            }
          }

          summary.push({
            productId: product.id,
            store: offer.store,
            from: lastKnownPrice,
            to: currentPrice,
            notified,
          });
        }

        await kv.set(priceKey, currentPrice);
      } catch (err) {
        errors.push(`${product.id}/${offer.store}: ${(err as Error).message}`);
      }
    }
  }

  return NextResponse.json({ checked: products.length, drops: summary, errors });
}
