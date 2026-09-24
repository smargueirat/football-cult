import { NextRequest, NextResponse } from "next/server";
import { MAIL_FROM } from "@/lib/mailFrom";
import { gunzipSync } from "zlib";
import { parse } from "csv-parse/sync";
import { Resend } from "resend";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { formatOfferMoney, type OfferCurrencyCode } from "@/lib/offerMoney";
import { products, teamNames, typeNames } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { ticketProducts } from "@/data/tickets";

const SITE_URL = "https://football-cult.com";

// Antes solo camisetas (6-7 tiendas, un puñado de miles de ofertas). Ahora
// se suman botas/guantes/pelotas/ropa/tickets -- mucho más volumen contra
// los MISMOS feeds gigantes (FootStoreES ronda 167K filas). 60s alcanzaba
// para el volumen viejo; con más categorías cruzando los mismos feeds
// conviene margen.
export const maxDuration = 120;

const FEED_URLS: Record<string, string | undefined> = {
  PlanetFoot: process.env.AWIN_FEED_URL_PLANETFOOT,
  FansJerseyHub: process.env.AWIN_FEED_URL_FANSJERSEYHUB,
  ComoFCShop: process.env.AWIN_FEED_URL_COMOFC,
  DeporteOutletES: process.env.AWIN_FEED_URL_DEPORTEOUTLET,
  DeporteOutlet: process.env.AWIN_FEED_URL_DEPORTEOUTLET,
  FootStoreES: process.env.AWIN_FEED_URL_FOOTSTORE_ES,
  FootStoreFR: process.env.AWIN_FEED_URL_FOOTSTORE_FR,
  SportIsGoodES: process.env.AWIN_FEED_URL_SPORTISGOOD_ES,
  SportIsGoodFR: process.env.AWIN_FEED_URL_SPORTISGOOD_FR,
  AdidasES: process.env.AWIN_FEED_URL_ADIDAS_ES,
  AdidasPT: process.env.AWIN_FEED_URL_ADIDAS_PT,
  BSTNIT: process.env.AWIN_FEED_URL_BSTN_IT,
  BSTNUK: process.env.AWIN_FEED_URL_BSTN_UK,
  DecathlonIE: process.env.AWIN_FEED_URL_DECATHLONIE,
  // Nuevos (09-23, extensión a botas/guantes/pelotas/ropa/tickets) -- las
  // env vars ya existían (usadas por el mining nocturno), esta era la
  // única sección del sitio que todavía no las conocía.
  ForumSport: process.env.AWIN_FEED_URL_FORUMSPORT,
  ClovisCalcadosBR: process.env.AWIN_FEED_URL_CLOVIS_BR,
  GigasportDE: process.env.AWIN_FEED_URL_GIGASPORT_DE,
  GigasportCH: process.env.AWIN_FEED_URL_GIGASPORT_CH,
  GigasportFR: process.env.AWIN_FEED_URL_GIGASPORT_FR,
  FootballTicketNetDE: process.env.AWIN_FEED_URL_TICKETNET_DE,
  FootballTicketNetUK: process.env.AWIN_FEED_URL_TICKETNET_UK,
  FootballTicketNetUS: process.env.AWIN_FEED_URL_TICKETNET_US,
};

// Tiendas de botas SIN feed real: FutbolEmotion (se descarga aparte, esquema
// TradeTracker distinto), ProSoccer (scrape por talla, sin CSV), NikeCL/
// NikeAR/PumaAR (minadas a mano por sesión de Chrome, Cloudflare bloquea
// fetch headless -- ver boots-mining/README.md). Sus ofertas ya se
// saltean hoy mismo para camisetas (cualquier store fuera de FEED_URLS),
// este comentario solo documenta que la ausencia es a propósito, no un
// olvido.

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

// Antes: `rows.find(r => r.aw_deep_link === offer.url)` -- O(filas) por
// CADA oferta. Con solo camisetas ya rozaba el límite; sumar botas/
// guantes/pelotas/ropa/tickets multiplica la cantidad de ofertas contra
// los MISMOS feeds de cientos de miles de filas (FootStoreES ~167K) sin
// achicar los feeds -- un índice por aw_deep_link lo vuelve O(1) por
// oferta, la diferencia entre terminar en segundos o pasarse de
// maxDuration.
function indexFeed(rows: FeedRow[]): Map<string, FeedRow> {
  const index = new Map<string, FeedRow>();
  for (const row of rows) {
    if (row.aw_deep_link) index.set(row.aw_deep_link, row);
  }
  return index;
}

interface CatalogOffer {
  store: string;
  price: number;
  currency: OfferCurrencyCode;
  url: string;
}
interface CatalogItem {
  id: string;
  offers: CatalogOffer[];
}
interface Drop {
  category: string;
  productId: string;
  store: string;
  from: number;
  to: number;
  currency: OfferCurrencyCode;
}

async function checkCatalog(
  category: string,
  items: CatalogItem[],
  feedIndexCache: Map<string, Map<string, FeedRow>>,
  redis: Awaited<ReturnType<typeof getRedis>>,
  errors: string[]
): Promise<Drop[]> {
  const drops: Drop[] = [];
  for (const item of items) {
    for (const offer of item.offers) {
      const feedUrl = FEED_URLS[offer.store];
      const shopifyStore = SHOPIFY_STORES[offer.store];
      if (!feedUrl && !shopifyStore) continue;

      try {
        if (!feedIndexCache.has(offer.store)) {
          const rows = shopifyStore
            ? await fetchShopifyFeed(shopifyStore.domain, shopifyStore.awinmid)
            : await fetchFeed(feedUrl!);
          feedIndexCache.set(offer.store, indexFeed(rows));
        }
        const match = feedIndexCache.get(offer.store)!.get(offer.url);
        if (!match) continue;

        const currentPrice = parsePrice(match.sale_price ?? match.price ?? match.search_price);
        if (currentPrice == null) continue;

        const priceKey = `lastPrice:${category}:${item.id}:${offer.store}`;
        const storedRaw = await redis.get(priceKey);
        const lastKnownPrice = storedRaw ? parseFloat(storedRaw) : offer.price;

        if (currentPrice < lastKnownPrice) {
          drops.push({
            category,
            productId: item.id,
            store: offer.store,
            from: lastKnownPrice,
            to: currentPrice,
            currency: offer.currency,
          });
        }

        await redis.set(priceKey, currentPrice.toString());
      } catch (err) {
        errors.push(`${category}/${item.id}/${offer.store}: ${(err as Error).message}`);
      }
    }
  }
  return drops;
}

// Un lugar por categoría: cómo arma el link y el nombre legible que va en
// el mail. Todo dato real (marca/modelo/evento ya vienen del feed en cada
// data file), nada inventado acá.
const CATALOG_CONFIGS: {
  category: string;
  items: CatalogItem[];
  urlPath: (id: string) => string;
  nameOf: (id: string) => string | null;
}[] = [
  {
    category: "jersey",
    items: products,
    urlPath: (id) => `camiseta/${id}`,
    nameOf: (id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return null;
      return `${teamNames[p.teamKey].es} ${typeNames[p.typeKey].es} ${p.season}`;
    },
  },
  {
    category: "boot",
    items: bootProducts,
    urlPath: (id) => `botas/${id}`,
    nameOf: (id) => {
      const p = bootProducts.find((x) => x.id === id);
      return p ? `${p.brand} ${p.model}` : null;
    },
  },
  {
    category: "glove",
    items: gloveProducts,
    urlPath: (id) => `guantes/${id}`,
    nameOf: (id) => {
      const p = gloveProducts.find((x) => x.id === id);
      return p ? `${p.brand} ${p.model}` : null;
    },
  },
  {
    category: "ball",
    items: ballProducts,
    urlPath: (id) => `pelotas/${id}`,
    nameOf: (id) => {
      const p = ballProducts.find((x) => x.id === id);
      return p ? `${p.brand} ${p.model}` : null;
    },
  },
  {
    category: "apparel",
    items: apparelProducts,
    urlPath: (id) => `ropa/${id}`,
    nameOf: (id) => {
      const p = apparelProducts.find((x) => x.id === id);
      return p ? `${p.brand} ${p.model}` : null;
    },
  },
  {
    category: "ticket",
    items: ticketProducts,
    urlPath: (id) => `tickets/${id}`,
    nameOf: (id) => {
      const p = ticketProducts.find((x) => x.id === id);
      return p ? p.event : null;
    },
  },
];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "Redis not configured yet" }, { status: 503 });
  }
  const redis = await getRedis();

  // Un solo cache de feeds indexados COMPARTIDO entre las 6 categorías --
  // FootStoreES/FR, SportIsGoodES/FR y DeporteOutlet los usan varias
  // categorías a la vez, así que cada feed se descarga/indexa UNA sola
  // vez por corrida, no una vez por categoría.
  const feedIndexCache = new Map<string, Map<string, FeedRow>>();
  const errors: string[] = [];

  const allDrops: Drop[] = [];
  let totalChecked = 0;
  for (const cfg of CATALOG_CONFIGS) {
    totalChecked += cfg.items.length;
    const drops = await checkCatalog(cfg.category, cfg.items, feedIndexCache, redis, errors);
    allDrops.push(...drops);
  }

  // Un mail por producto, no por oferta -- si dos tiendas del mismo
  // producto bajaron en la misma corrida, se avisa una sola vez con la
  // mejor de las dos (menor precio nuevo). Los suscriptores son el
  // registro que /api/price-alerts arma cuando alguien marca un
  // favorito estando logueado (ver comentario en FavoritesContext.tsx) --
  // esa suscripción se guarda por id "pelado", sin categoría, así que
  // acá alcanza con `priceAlertSubscribers:{id}` sea cual sea la
  // categoría real del producto.
  let alertsSent = 0;
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && allDrops.length > 0) {
    const resend = new Resend(apiKey);
    const dropsByKey = new Map<string, Drop>();
    for (const drop of allDrops) {
      const key = `${drop.category}:${drop.productId}`;
      const existing = dropsByKey.get(key);
      if (!existing || drop.to < existing.to) dropsByKey.set(key, drop);
    }

    for (const [, drop] of dropsByKey) {
      const subscribers = await redis.sMembers(`priceAlertSubscribers:${drop.productId}`);
      if (subscribers.length === 0) continue;

      const cfg = CATALOG_CONFIGS.find((c) => c.category === drop.category)!;
      const name = cfg.nameOf(drop.productId);
      if (!name) continue;
      const url = `${SITE_URL}/es/${cfg.urlPath(drop.productId)}`;
      const fromMoney = formatOfferMoney(drop.from, drop.currency);
      const toMoney = formatOfferMoney(drop.to, drop.currency);

      try {
        await resend.emails.send({
          from: MAIL_FROM,
          // Resend permite varios destinatarios en un mismo envío -- un
          // mail por corrida por producto, no uno por suscriptor.
          to: subscribers,
          subject: `Bajó de precio: ${name}`,
          text: `${name} bajó de ${fromMoney} a ${toMoney} en ${drop.store}.\n\nVerla: ${url}`,
        });
        alertsSent += subscribers.length;
      } catch (err) {
        errors.push(`alert email ${drop.category}/${drop.productId}: ${(err as Error).message}`);
      }
    }
  }

  return NextResponse.json({ checked: totalChecked, drops: allDrops, alertsSent, errors });
}
