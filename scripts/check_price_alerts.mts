// Alertas de precio por email (semanal; lo lanza scripts/cron_check_prices.sh).
//
//   npx tsx scripts/check_price_alerts.mts --dry-run [--out=DIR]  # HTML/TXT de ejemplo en DIR (/tmp/fc-price-alert-preview), datos simulados, sin Redis ni envío
//   npx tsx scripts/check_price_alerts.mts --dry-run --live       # igual con las suscripciones reales de Redis (solo lectura, no envía)
//   npx tsx scripts/check_price_alerts.mts                        # envía y guarda los precios de referencia
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
// precio de referencia guardado (hash priceAlertLast:{id}); la primera vez
// de cada oferta solo guarda la referencia. Se avisa si la bajada llega a un
// 5 % o a 5 EUR (priceAlertEmail.ts); la referencia solo baja cuando se avisa,
// así que las bajadas pequeñas se acumulan. Un correo por persona (hasta 5
// productos) con HTML + texto, y la referencia se guarda tras enviarlo.
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
import { offerTotalInEUR, shippingUnknown, type OfferCurrencyCode } from "../src/lib/offerMoney";
import { nextReference, pickDigest, renderAlertEmail, type AlertItem, type RelatedItem } from "../src/lib/priceAlertEmail";
import { isLocale } from "../src/lib/i18n/locales";
import type { Locale } from "../src/lib/i18n/translations";
import { SITE_URL, lastKey, localeKey, oneClickUrl, pageUrl, subsKey, unsubscribeToken } from "../src/lib/priceAlerts";

const DRY = process.argv.includes("--dry-run");
/** --dry-run sin --live: datos simulados, sin Redis ni envío; deja los correos en OUT. */
const SIM = DRY && !process.argv.includes("--live");
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "/tmp/fc-price-alert-preview";
/** País con el que se mira si el envío es dato real (el suscriptor solo deja su idioma). */
const COUNTRY: Record<Locale, string> = { es: "ES", en: "GB", pt: "PT", fr: "FR", it: "IT" };

// Credenciales desde .env.local si no vienen exportadas (cron = env vacío),
// igual que broadcast_price_drops.mts.
const ENV = path.join(import.meta.dirname, "../.env.local");
for (const line of fs.existsSync(ENV) ? fs.readFileSync(ENV, "utf-8").split("\n") : []) {
  const m = /^(REDIS_URL|RESEND_API_KEY|RESEND_FROM)=(.+)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
// Después de cargar el entorno: mailFrom lee RESEND_FROM al importarse.
const { MAIL_FROM } = await import("../src/lib/mailFrom");

interface Offerish { store: string; price: number; shipping: number; currency: string; url: string; inStock?: boolean; imageUrl?: string }
interface Section {
  path: string;
  items: { id: string; offers: Offerish[] }[];
  name: (item: never, l: Locale) => string;
  /** Mismo equipo / misma marca, para "Otras ofertas parecidas" (sin esto, no hay bloque). */
  group?: (item: never) => string;
}
const SECTIONS: Section[] = [
  {
    path: "camiseta",
    items: products,
    name: (p: (typeof products)[number], l: Locale) => `${teamNames[p.teamKey][l]} ${typeNames[p.typeKey][l]} ${p.season}`,
    group: (p: (typeof products)[number]) => p.teamKey,
  },
  { path: "botas", group: (p: { brand: string }) => p.brand, items: bootProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "guantes", group: (p: { brand: string }) => p.brand, items: gloveProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "pelotas", group: (p: { brand: string }) => p.brand, items: ballProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "ropa", group: (p: { brand: string }) => p.brand, items: apparelProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
  { path: "entrenamiento", group: (p: { brand: string }) => p.brand, items: trainingProducts, name: (p: { brand: string; model: string }) => `${p.brand} ${p.model}` },
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


type Hit = { section: Section; item: Section["items"][number] };
/** Una bajada con aviso: la oferta que más bajó y las referencias a guardar si el correo sale. */
interface Drop { productId: string; hit: Hit; offer: Offerish; from: number; pct: number; newRefs: Record<string, string>; delivered: boolean }

const eur = (o: Offerish) => offerTotalInEUR({ price: o.price, shipping: 0, currency: o.currency as OfferCurrencyCode });
const cheapest = (item: Hit["item"]) => item.offers.filter((o) => o.inStock !== false && o.price > 0).sort((a, b) => eur(a) - eur(b))[0];

// "Otras ofertas parecidas": mismo equipo (camisetas, misma temporada primero)
// o misma marca, con stock, de precio parecido. Índice por grupo, una vez por sección.
const groupIndex = new Map<Section, Map<string, Section["items"]>>();
function related(hit: Hit, offer: Offerish, l: Locale): RelatedItem[] {
  const { section, item } = hit;
  if (!section.group) return [];
  let idx = groupIndex.get(section);
  if (!idx) {
    idx = new Map();
    for (const it of section.items) {
      const g = section.group(it as never);
      idx.set(g, [...(idx.get(g) ?? []), it]);
    }
    groupIndex.set(section, idx);
  }
  const season = (x: unknown) => (x as { season?: string }).season;
  return (idx.get(section.group(item as never)) ?? [])
    .filter((c) => c.id !== item.id)
    .map((c) => ({ c, o: cheapest(c) }))
    .filter((x) => x.o)
    .map(({ c, o }) => ({ c, o, rank: (season(c) !== season(item) ? 10 : 0) + Math.abs(eur(o) - eur(offer)) / eur(offer) }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)
    .map(({ c, o }) => ({
      name: section.name(c as never, l),
      price: o.price,
      currency: o.currency as OfferCurrencyCode,
      url: `${SITE_URL}/${l}/${section.path}/${c.id}`,
      image: o.imageUrl,
    }));
}

const summary = { dryRun: DRY, simulated: SIM, products: 0, subscriptions: 0, seeded: 0, drops: 0, emails: 0, sent: 0, missing: 0, errors: [] as string[] };
const resend = !DRY && process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
if (!DRY && !resend) summary.errors.push("RESEND_API_KEY no configurada");

const redis = SIM ? null : (createClient({ url: process.env.REDIS_URL }) as RedisClientType);
if (redis) {
  redis.on("error", (err) => summary.errors.push(`redis: ${err.message}`));
  await redis.connect();
}

// email -> sus bajadas de esta corrida (con el idioma de cada suscripción)
const byEmail = new Map<string, { l: Locale; drop: Drop }[]>();

if (SIM) {
  // Datos de ejemplo del propio catálogo: referencias ficticias por encima del precio. Sin Redis.
  const pick = (s: Section, n: number, skip = 0) =>
    s.items.filter((it) => it.offers.some((o) => o.inStock !== false && o.price > 20 && o.imageUrl)).slice(skip, skip + n);
  const mk = (section: Section, item: Hit["item"], k: number): Drop => {
    const offer = cheapest(item);
    const from = Math.round(offer.price * (1.06 + k * 0.04) * 100) / 100;
    return { productId: item.id, hit: { section, item }, offer, from, pct: (from - offer.price) / from, newRefs: {}, delivered: false };
  };
  const camis = pick(SECTIONS[0], 8, 40);
  const botas = pick(SECTIONS[1], 2, 10);
  const L: Locale[] = ["es", "en", "pt", "fr", "it"];
  L.forEach((l, k) => byEmail.set(`ejemplo-${l}@example.com`, [{ l, drop: mk(SECTIONS[0], camis[k], k) }]));
  // Resumen con 6 bajadas (el correo debe recortar a 5) y uno con una bota.
  byEmail.set("resumen@example.com", camis.slice(0, 6).map((it, k) => ({ l: "es" as Locale, drop: mk(SECTIONS[0], it, k) })));
  byEmail.set("bota@example.com", [{ l: "es", drop: mk(SECTIONS[1], botas[0], 1) }]);
} else {
  const PREFIX = subsKey("");
  const keys: string[] = [];
  for await (const batch of redis!.scanIterator({ MATCH: `${PREFIX}*`, COUNT: 500 })) keys.push(...([] as string[]).concat(batch));

  for (const key of keys) {
    const productId = key.slice(PREFIX.length);
    try {
      const emails = await redis!.sMembers(key);
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
      const last = await redis!.hGetAll(lastKey(productId));
      if (Object.keys(last).length === 0) summary.seeded++;

      // Cada oferta contra su propia referencia (misma URL y moneda). Se avisa
      // por la que más bajó; la referencia solo se mueve al avisar (o al verla
      // por primera vez), nunca por una bajada pequeña ni por una subida.
      const toSet: Record<string, string> = {};
      const alerting: Record<string, string> = {};
      let best: Drop | null = null;
      for (const offer of offers) {
        const ref = Number(last[offer.url]) || undefined;
        const next = nextReference(ref, offer.price, offer.currency as OfferCurrencyCode);
        if (!ref) toSet[offer.url] = String(offer.price);
        if (!next.alert) continue;
        alerting[offer.url] = String(offer.price);
        const pct = (ref! - offer.price) / ref!;
        if (!best || pct > best.pct) best = { productId, hit, offer, from: ref!, pct, newRefs: alerting, delivered: false };
      }
      // Ofertas que ya no están en la ficha: fuera de la referencia.
      const gone = Object.keys(last).filter((u) => !hit.item.offers.some((o) => o.url === u));
      if (!DRY && (Object.keys(toSet).length > 0 || gone.length > 0)) {
        const m = redis!.multi();
        if (Object.keys(toSet).length > 0) m.hSet(lastKey(productId), toSet);
        if (gone.length > 0) m.hDel(lastKey(productId), gone);
        await m.exec();
      }
      if (!best) continue;
      summary.drops++;

      const locales = await redis!.hGetAll(localeKey(productId));
      for (const email of emails) {
        const l: Locale = isLocale(locales[email] ?? "") ? (locales[email] as Locale) : "es";
        byEmail.set(email, [...(byEmail.get(email) ?? []), { l, drop: best }]);
      }
    } catch (err) {
      summary.errors.push(`${productId}: ${(err as Error).message}`);
    }
  }
}

if (DRY) fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const [email, entries] of byEmail) {
  try {
    const picked = pickDigest(entries.map((e) => ({ ...e, pct: e.drop.pct })));
    const l = picked[0].l;
    const tokens: string[] = [];
    const items: AlertItem[] = [];
    for (const { l: pl, drop } of picked) {
      // Token de baja aleatorio, uno por suscripción (se crea la primera vez
      // que se envía; en el ensayo no se escribe nada en Redis).
      const token = DRY ? `ensayo${tokens.length}`.padEnd(24, "x") : await unsubscribeToken(redis!, email, drop.productId, pl);
      tokens.push(token);
      const { section, item } = drop.hit;
      const o = drop.offer;
      items.push({
        name: section.name(item as never, l),
        store: o.store,
        currency: o.currency as OfferCurrencyCode,
        from: drop.from,
        to: o.price,
        url: `${SITE_URL}/${l}/${section.path}/${item.id}`,
        image: o.imageUrl,
        shipping: shippingUnknown(o, COUNTRY[l]) ? "check" : o.shipping > 0 ? o.shipping : "free",
        unsub: pageUrl(token, pl),
        related: picked.length === 1 ? related(drop.hit, o, l) : undefined,
      });
    }
    const { subject, html, text } = renderAlertEmail(l, items);
    summary.emails++;
    const msg = {
      from: MAIL_FROM,
      to: email,
      subject,
      html,
      text,
      // Un correo por destinatario (nadie ve los correos de los demás). Con
      // varios productos hay una baja por cada uno; el one-click usa la primera.
      headers: {
        "List-Unsubscribe": tokens.map((t) => `<${oneClickUrl(t)}>`).join(", "),
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };
    if (DRY) {
      const base = path.join(OUT, `${String(++n).padStart(2, "0")}-${l}-${items.length}x`);
      fs.writeFileSync(`${base}.html`, html);
      fs.writeFileSync(`${base}.txt`, `Subject: ${subject}\n${JSON.stringify(msg.headers)}\n\n${text}\n`);
      console.log(`[ensayo] ${path.basename(base)}: ${subject}`);
      continue;
    }
    if (!resend) continue;
    const { error } = await resend.emails.send(msg);
    if (error) {
      summary.errors.push(`envío ${email}: ${error.message}`);
      continue;
    }
    summary.sent++;
    // Referencia nueva solo de lo que sí fue en el correo; el resto (más de 5) se avisa la semana que viene.
    for (const { drop } of picked) {
      if (drop.delivered) continue;
      drop.delivered = true;
      await redis!.hSet(lastKey(drop.productId), drop.newRefs);
    }
  } catch (err) {
    summary.errors.push(`${email}: ${(err as Error).message}`);
  }
}

await redis?.quit();
console.log(`[${new Date().toISOString()}] alertas de precio ${JSON.stringify(summary)}`);
process.exit(summary.errors.length > 0 ? 1 : 0);
