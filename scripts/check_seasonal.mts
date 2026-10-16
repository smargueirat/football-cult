// Comprobación de /black-friday, /regalos-futbol y del aviso estacional
// (2026-10-16):
//   npx tsx scripts/check_seasonal.mts
// Falla (exit 1) si una página estacional muestra una oferta agotada, que no
// está en el catálogo, con otro precio que el del catálogo, con precio de
// relleno (0, 9.999..., tarifa de plantilla de la reventa), de una tienda que
// no envía al mercado del idioma, o si un texto promete un descuento sin dato.
import { products } from "../src/data/products";
import { bootProducts } from "../src/data/boots";
import { ticketProducts } from "../src/data/tickets";
import { apparelProducts } from "../src/data/apparel";
import { gloveProducts } from "../src/data/gloves";
import { ballProducts } from "../src/data/balls";
import { trainingProducts } from "../src/data/training";
import { MAX_EUR, MIN_PCT, type DealRow, type DealSection } from "../src/lib/dealsData";
import { bfBands, bfDrops, bfLows, bfReference, giftPage } from "../src/lib/seasonalData";
import { SEASONAL } from "../src/lib/seasonalStrings";
import { activeSeasonal, bannerText, blackFriday, currentBlackFriday, currentGiftSeason, todayIso } from "../src/lib/seasonal";
import { MARKET } from "../src/lib/seoMeta";
import { isVintageRetro, offerShipsTo, seasonSortValue, teamCategory } from "../src/lib/productMeta";
import { shippingUnknown, ticketTemplatePrices } from "../src/lib/offerMoney";
import { LOCALES } from "../src/lib/i18n/locales";
import * as sm from "../src/app/sitemap";

let failed = 0;
const ok = (cond: unknown, msg: string) => {
  if (!cond) {
    failed++;
    if (failed <= 40) console.error("FALLA:", msg);
  }
};
const eq = (a: unknown, b: unknown, msg: string) => ok(JSON.stringify(a) === JSON.stringify(b), `${msg}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);

// ---------------------------------------------------------------- fechas
eq(blackFriday(2026), { bf: "2026-11-27", cm: "2026-11-30" }, "BF 2026");
eq(blackFriday(2027), { bf: "2027-11-26", cm: "2027-11-29" }, "BF 2027");
eq(blackFriday(2025), { bf: "2025-11-28", cm: "2025-12-01" }, "BF 2025");
const ids = (d: string) => activeSeasonal(d).map((e) => `${e.id}${e.year}`);
eq(ids("2026-10-16"), [], "hoy (16-oct) sin aviso");
eq(ids("2026-10-29"), [], "29-oct: aún no (4 semanas antes = 30-oct)");
eq(ids("2026-10-30"), ["black-friday2026"], "30-oct: empieza el aviso de BF");
eq(ids("2026-11-27"), ["black-friday2026", "regalos2026"], "27-nov: BF y, 4 semanas antes de Navidad, regalos");
eq(ids("2026-12-01"), ["black-friday2026", "regalos2026"], "1-dic: día después del Cyber Monday");
eq(ids("2026-12-02"), ["regalos2026"], "2-dic: BF caducado");
eq(ids("2027-01-07"), ["regalos2026"], "7-ene: día después de Reyes");
eq(ids("2027-01-08"), [], "8-ene: regalos caducado");
eq(ids("2027-10-29"), ["black-friday2027"], "el año siguiente se calcula solo");
eq(currentBlackFriday("2026-12-01").year, 2026, "página BF: 1-dic sigue en 2026");
eq(currentBlackFriday("2026-12-02").year, 2027, "página BF: 2-dic pasa a 2027");
eq(currentGiftSeason("2027-01-07").year, 2026, "regalos: 7-ene sigue en 2026");
eq(currentGiftSeason("2027-01-08").year, 2027, "regalos: 8-ene pasa a 2027");

// ---------------------------------------------------------------- textos
const BAD = /NaN|undefined|Infinity|\[object/;
const FAKE = /(hasta|up to|até|jusqu'à|fino al)\s*(un\s*|il\s*)?-?\s*\d+\s*%/i;
for (const l of LOCALES) {
  const s = SEASONAL[l];
  const sample = [
    s.bf.intro({ year: 2026, bf: "27 nov 2026", cm: "30 nov 2026", during: false, drops: 12, lows: 3, last: "16 oct 2026" }),
    s.bf.intro({ year: 2026, bf: "27 nov 2026", cm: "30 nov 2026", during: true, drops: 12, lows: 3, last: "16 oct 2026" }),
    s.gifts.intro({ xmas: "25 dic 2026", kings: "6 ene 2027", n: 40 }),
    ...activeSeasonal("2026-11-27").map((e) => bannerText(e, l)),
  ];
  const all = JSON.stringify(s) + sample.join(" ");
  ok(!BAD.test(all), `textos ${l}: ${all.match(BAD)?.[0]}`);
  ok(!FAKE.test(all), `textos ${l}: descuento sin dato "${all.match(FAKE)?.[0]}"`);
  ok(s.bf.title.length <= 75 && s.gifts.title.length <= 60, `títulos ${l} demasiado largos`);
}
eq(SEASONAL.es.bf.title, "Black Friday camisetas de fútbol y botas: ofertas reales verificadas", "título /es");

// ------------------------------------------------------------- ofertas
const LISTS: Record<DealSection, readonly { id: string; offers: readonly { url: string; price: number; currency: string; store: string; inStock?: boolean; shipping?: number }[] }[]> = {
  camiseta: products, botas: bootProducts, tickets: ticketProducts, ropa: apparelProducts, guantes: gloveProducts, pelotas: ballProducts, entrenamiento: trainingProducts,
};
const index = new Map<string, Map<string, (typeof LISTS)["camiseta"][number]>>();
for (const [sec, list] of Object.entries(LISTS)) index.set(sec, new Map(list.map((i) => [i.id, i])));
const templates = ticketTemplatePrices(ticketProducts);
const filler = (p: number) => !(p >= 1) || !Number.isFinite(p) || /^9{3,}(\.9+)?$/.test(String(p));

/** La oferta mostrada existe en el catálogo de hoy, en stock y con ese precio. */
function liveOffer(where: string, section: DealSection, id: string, url: string, price: number, country: string) {
  const item = index.get(section)?.get(id);
  const o = item?.offers.find((x) => x.url === url);
  ok(o, `${where}: ${section}/${id} no está en el catálogo con esa oferta`);
  if (!o) return undefined;
  ok(o.inStock !== false, `${where}: ${section}/${id} AGOTADA (${o.store})`);
  ok(o.price === price, `${where}: ${section}/${id} precio ${price} != catálogo ${o.price}`);
  ok(!filler(price), `${where}: ${section}/${id} precio de relleno ${price}`);
  ok(!templates.has(`${o.store}|${o.price}`) || section !== "tickets", `${where}: ${section}/${id} tarifa de plantilla`);
  ok(section === "tickets" || offerShipsTo(o.store, country as never), `${where}: ${section}/${id} ${o.store} no envía a ${country}`);
  return o;
}
const checkRows = (where: string, rows: DealRow[], country: string, mode: "drop" | "low") => {
  for (const r of rows) {
    liveOffer(where, r.section, r.item.id, r.offerUrl, r.price, country);
    ok(r.section !== "tickets", `${where}: entrada en Black Friday`);
    ok(r.price < r.before && r.eur <= MAX_EUR, `${where}: ${r.item.id} antes ${r.before} hoy ${r.price}`);
    if (mode === "drop") ok(r.pct >= MIN_PCT, `${where}: ${r.item.id} bajada ${r.pct} % < ${MIN_PCT}`);
  }
};

// La comprobación misma detecta una agotada y un precio distinto (si no, un
// "ok" no diría nada).
{
  const sold = products.find((p) => p.offers.some((o) => o.inStock === false));
  const o = sold?.offers.find((x) => x.inStock === false);
  const before = failed;
  if (sold && o) {
    const log = console.error;
    console.error = () => {};
    liveOffer("autoprueba", "camiseta", sold.id, o.url, o.price, "ES");
    liveOffer("autoprueba", "camiseta", sold.id, o.url, o.price + 1, "ES");
    console.error = log;
  }
  ok(failed - before >= 2, "autoprueba: la comprobación no detecta una oferta agotada / precio distinto");
  failed = before + (failed - before >= 2 ? 0 : 1);
}

const today = todayIso();
for (const l of LOCALES) {
  const country = MARKET[l];
  const drops = bfDrops(l);
  const lows = bfLows(l);
  checkRows(`bf ${l} bajadas`, drops, country, "drop");
  checkRows(`bf ${l} mínimos`, lows, country, "low");
  const bands = bfBands(l, 8);
  for (const b of bands) {
    checkRows(`bf ${l} tramo ${b.band.key}`, b.rows, country, "drop");
    for (const r of b.rows) ok(r.eur >= b.band.min && r.eur < b.band.max, `bf ${l}: ${r.item.id} fuera del tramo ${b.band.key}`);
  }
  const ref = [...bfReference(l, "botas", 15), ...bfReference(l, "camiseta", 15)];
  for (const r of ref) {
    liveOffer(`bf ${l} referencia`, r.section, r.item.id, r.offerUrl, r.price, country);
    ok(r.min > 0 && r.min <= r.price && r.days >= 14 && r.minDate <= today, `bf ${l} referencia ${r.item.id}: mínimo ${r.min} hoy ${r.price}`);
  }

  const { budget, types } = giftPage(l);
  let n = 0;
  for (const g of [...budget.map((b) => ({ k: b.band.key, cards: b.cards, band: b.band })), ...types.map((t) => ({ k: t.type, cards: t.cards, band: undefined }))]) {
    for (const c of g.cards) {
      n++;
      const o = liveOffer(`regalos ${l} ${g.k}`, c.section, c.id, c.offerUrl, c.price, country);
      ok(c.total === c.price + c.shipping && c.image.trim() !== "", `regalos ${l}: ${c.id} total/foto`);
      if (g.band) {
        const eurOk = c.currency !== "EUR" || (c.total >= g.band.min && c.total < g.band.max);
        ok(eurOk, `regalos ${l}: ${c.id} ${c.total} fuera del tramo ${g.k}`);
      }
      if (c.section !== "tickets" && o) ok(!shippingUnknown({ store: o.store, shipping: o.shipping ?? 0, url: o.url }, country), `regalos ${l}: ${c.id} envío sin medir (${o.store})`);
      const item = index.get(c.section)?.get(c.id) as unknown as { date?: string; season?: string; teamKey?: string; typeKey?: string };
      if (c.type === "tickets") ok((item.date ?? "") > today && (item.date ?? "") > currentGiftSeason(today).xmas, `regalos ${l}: entrada ${c.id} de un partido antes de Navidad`);
      if (c.type === "retro") ok(isVintageRetro(item as never), `regalos ${l}: ${c.id} no es retro (<=2006)`);
      if (c.type === "seleccion") ok(teamCategory[item.teamKey as never] === "national" && item.season === "2026", `regalos ${l}: ${c.id} no es del Mundial 2026`);
      if (c.type === "club") ok(teamCategory[item.teamKey as never] === "club" && seasonSortValue(item.season ?? "") >= 2025, `regalos ${l}: ${c.id} no es de club actual`);
    }
  }
  console.log(
    `${l}: bajadas ${drops.length}, mínimos ${lows.length}, tramos ${bands.map((b) => `${b.band.key}:${b.rows.length}`).join(" ")}, referencia ${ref.length}; ` +
      `regalos ${n} tarjetas (${types.map((t) => `${t.type}:${t.cards.length}`).join(" ")})`,
  );
}

// ------------------------------------------------------------- sitemap
const sitemap = (sm.default as unknown as { default?: typeof sm.default }).default ?? sm.default;
const urls = new Set<string>();
for (const { id } of await sm.generateSitemaps()) for (const { url } of await sitemap({ id: Promise.resolve(String(id)) })) urls.add(url);
ok(urls.has("https://football-cult.com/es/black-friday") && urls.has("https://football-cult.com/es/regalos-futbol"), "sitemap sin las páginas estacionales");
ok(!urls.has("https://football-cult.com/es/regalos"), "sitemap todavía lista /regalos (redirige)");

if (failed) {
  console.error(`${failed} comprobaciones fallidas`);
  process.exit(1);
}
console.log("ok");
