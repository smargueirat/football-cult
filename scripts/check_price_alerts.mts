// Alertas de precio por email (semanal; lo lanza scripts/cron_check_prices.sh).
//
//   npx tsx scripts/check_price_alerts.mts --dry-run   # imprime los correos, no envía ni escribe en Redis
//   npx tsx scripts/check_price_alerts.mts             # envía y guarda los precios de referencia
//
// Sustituye a /api/cron/check-prices, que nunca llegó a terminar: bajaba
// ~25 feeds de Awin enteros (Foot-Store ES ≈ 300 MB descomprimido), los
// parseaba en memoria DENTRO del proceso que sirve la web (pico de 4,8 GB)
// y recorría las ~52.000 ofertas del catálogo con un GET+SET a Redis cada
// una, para luego avisar solo a los productos con suscriptores (9). El
// curl del cron se cortaba a los 300 s y el log quedaba vacío.
//
// Ahora: solo los productos que tienen suscriptores, con los precios del
// propio catálogo (src/data/*.ts, que el escaneo diario ya refresca contra
// esos mismos feeds), en un proceso aparte. Compara cada oferta con el
// precio que tenía en la corrida anterior (hash priceAlertLast:{id}); la
// primera corrida de cada producto solo guarda la referencia.
import fs from "node:fs";
import path from "node:path";
import { createClient, type RedisClientType } from "redis";
import { Resend } from "resend";
import { products, teamNames, typeNames } from "../src/data/products";
import { bootProducts } from "../src/data/boots";
import { gloveProducts } from "../src/data/gloves";
import { ballProducts } from "../src/data/balls";
import { apparelProducts } from "../src/data/apparel";
import { trainingProducts } from "../src/data/training";
import { ticketProducts } from "../src/data/tickets";
import { PRODUCT_ID_ALIASES } from "../src/data/productAliases";
import bootAliases from "../src/data/bootAliases.json";
import gearAliases from "../src/data/gearAliases.json";
import { formatOfferMoney, type OfferCurrencyCode } from "../src/lib/offerMoney";
import { isLocale } from "../src/lib/i18n/locales";
import type { Locale } from "../src/lib/i18n/translations";
import { EMAIL_COPY, SITE_URL, lastKey, localeKey, subsKey, unsubscribeUrl } from "../src/lib/priceAlerts";

const DRY = process.argv.includes("--dry-run");
/** Mismo mínimo que el sello "bajó" del sitio (src/lib/priceDrops.ts). */
const MIN_DROP = 0.005;

// Credenciales desde .env.local si no vienen exportadas (cron = env vacío),
// igual que broadcast_price_drops.mts.
const ENV = path.join(import.meta.dirname, "../.env.local");
for (const line of fs.existsSync(ENV) ? fs.readFileSync(ENV, "utf-8").split("\n") : []) {
  const m = /^(REDIS_URL|RESEND_API_KEY|RESEND_FROM|AUTH_SECRET)=(.+)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
// Después de cargar el entorno: mailFrom lee RESEND_FROM al importarse.
const { MAIL_FROM } = await import("../src/lib/mailFrom");

interface Offerish { store: string; price: number; currency: string; url: string; inStock?: boolean }
interface Section {
  path: string;
  items: { id: string; offers: Offerish[] }[];
  name: (item: never, l: Locale) => string;
}
const SECTIONS: Section[] = [
  {
    path: "camiseta",
    items: products,
    name: (p: (typeof products)[number], l: Locale) => `${teamNames[p.teamKey][l]} ${typeNames[p.typeKey][l]} ${p.season}`,
  },
  { path: "botas", items: bootProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "guantes", items: gloveProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "pelotas", items: ballProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "ropa", items: apparelProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "entrenamiento", items: trainingProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "tickets", items: ticketProducts, name: (p: { event: string }) => p.event },
] as Section[];

const byId = new Map<string, { section: Section; item: Section["items"][number] }>();
for (const section of SECTIONS) for (const item of section.items) byId.set(item.id, { section, item });
const ALIASES: Record<string, string> = Object.assign(
  {},
  PRODUCT_ID_ALIASES,
  bootAliases,
  ...Object.values(gearAliases as Record<string, Record<string, string>>)
);

const summary = { dryRun: DRY, products: 0, subscriptions: 0, seeded: 0, drops: 0, sent: 0, missing: 0, errors: [] as string[] };
const resend = !DRY && process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
if (!DRY && !resend) summary.errors.push("RESEND_API_KEY no configurada");

const redis = createClient({ url: process.env.REDIS_URL }) as RedisClientType;
redis.on("error", (err) => summary.errors.push(`redis: ${err.message}`));
await redis.connect();

const PREFIX = subsKey("");
const keys: string[] = [];
for await (const batch of redis.scanIterator({ MATCH: `${PREFIX}*`, COUNT: 500 })) keys.push(...([] as string[]).concat(batch));

for (const key of keys) {
  const productId = key.slice(PREFIX.length);
  try {
    const emails = await redis.sMembers(key);
    if (emails.length === 0) continue;
    summary.products++;
    summary.subscriptions += emails.length;

    const hit = byId.get(productId) ?? byId.get(ALIASES[productId] ?? "");
    if (!hit) {
      summary.missing++;
      console.log(`sin ficha en el catálogo (retirada o renombrada): ${productId}`);
      continue;
    }
    const offers = hit.item.offers.filter((o) => o.inStock !== false && o.price > 0);
    const last = await redis.hGetAll(lastKey(productId));
    if (Object.keys(last).length === 0) summary.seeded++;

    // La oferta que más bajó (en %), comparada consigo misma: misma URL,
    // misma moneda, la semana anterior.
    let best: { offer: Offerish; from: number; pct: number } | null = null;
    for (const offer of offers) {
      const from = Number(last[offer.url]);
      if (!from) continue;
      const pct = (from - offer.price) / from;
      if (pct >= MIN_DROP && (!best || pct > best.pct)) best = { offer, from, pct };
    }

    if (!DRY && offers.length > 0) {
      await redis.multi().del(lastKey(productId)).hSet(lastKey(productId), Object.fromEntries(offers.map((o) => [o.url, String(o.price)]))).exec();
    }
    if (!best) continue;
    summary.drops++;

    const locales = await redis.hGetAll(localeKey(productId));
    for (const email of emails) {
      const l: Locale = isLocale(locales[email] ?? "") ? (locales[email] as Locale) : "es";
      const copy = EMAIL_COPY[l];
      const name = hit.section.name(hit.item as never, l);
      const unsub = unsubscribeUrl(email, productId, l);
      const msg = {
        from: MAIL_FROM,
        to: email,
        subject: copy.alertSubject(name),
        text: copy.alertBody({
          name,
          from: formatOfferMoney(best.from, best.offer.currency as OfferCurrencyCode),
          to: formatOfferMoney(best.offer.price, best.offer.currency as OfferCurrencyCode),
          store: best.offer.store,
          url: `${SITE_URL}/${l}/${hit.section.path}/${hit.item.id}`,
          unsub,
        }),
        // Un correo por destinatario (antes iban todos juntos en "to" y
        // cada uno veía los correos de los demás) con su baja de un clic.
        headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      };
      if (DRY) {
        console.log(`--- [ensayo] para ${email} (${l})\n${JSON.stringify(msg.headers)}\n${msg.subject}\n${msg.text}\n`);
        continue;
      }
      if (!resend) continue;
      const { error } = await resend.emails.send(msg);
      if (error) summary.errors.push(`envío ${productId}: ${error.message}`);
      else summary.sent++;
    }
  } catch (err) {
    summary.errors.push(`${productId}: ${(err as Error).message}`);
  }
}

await redis.quit();
console.log(`[${new Date().toISOString()}] alertas de precio ${JSON.stringify(summary)}`);
process.exit(summary.errors.length > 0 ? 1 : 0);
