import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { ticketProducts } from "@/data/tickets";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import type { HubLocale } from "@/data/teamMeta";
import { MAX_EUR, MIN_PCT, eurOf, historicLowRows, itemName, verifiedDropRows, type AnyItem, type DealRow, type DealSection } from "@/lib/dealsData";
import { GIFT_BANDS, giftPicks, type GiftBand, type GiftOffer, type Giftable } from "@/lib/giftPicks";
import { archive, offerPriceStats } from "@/lib/priceArchive";
import { isVintageRetro, offerShipsTo, seasonSortValue, teamCategory } from "@/lib/productMeta";
import { shippingUnknown, ticketTemplatePrices } from "@/lib/offerMoney";
import { countDistinctRetailers } from "@/lib/retailerFamily";
import { MARKET } from "@/lib/seoMeta";
import { bootLinesOf } from "@/lib/bootLines";
import { currentGiftSeason, todayIso } from "@/lib/seasonal";

// Datos de /black-friday y /regalos-futbol. SOLO servidor. Todo sale de lo
// que ya usan /bajadas-de-precio y /minimos-historicos (dealsData.ts) y del
// archivo de precios: ningún descuento se calcula con el precio tachado de
// la tienda y ninguna cifra se escribe a mano. Encima de eso, cada fila tiene
// que poder comprarse en el mercado del idioma (/es = España): una bajada de
// Nike Chile no le sirve a quien compra en Madrid.

export type BfGroup = "botas" | "camiseta" | "equipamiento";
export const BF_GROUPS: BfGroup[] = ["botas", "camiseta", "equipamiento"];
export const bfGroupOf = (s: DealSection): BfGroup | null => (s === "tickets" ? null : s === "botas" || s === "camiseta" ? s : "equipamiento");

const forMarket = (rows: DealRow[], locale: HubLocale) =>
  rows.filter((r) => r.section !== "tickets" && r.eur <= MAX_EUR && offerShipsTo(r.store, MARKET[locale]));

/** Bajadas verificadas (5 %+), sin entradas, que envían al mercado. */
export const bfDrops = (locale: HubLocale) => forMarket(verifiedDropRows(), locale).filter((r) => r.pct >= MIN_PCT);
/** Mínimos registrados, sin entradas, que envían al mercado. */
export const bfLows = (locale: HubLocale) => forMarket(historicLowRows(), locale);

/** Bajadas por tramo de precio (total en EUR con envío), las mayores primero. */
export function bfBands(locale: HubLocale, perBand: number): { band: GiftBand; rows: DealRow[] }[] {
  const drops = bfDrops(locale);
  return GIFT_BANDS.map((band) => ({ band, rows: drops.filter((r) => r.eur >= band.min && r.eur < band.max).slice(0, perBand) })).filter((b) => b.rows.length);
}

export interface RefRow {
  section: "botas" | "camiseta";
  item: AnyItem;
  store: string;
  price: number;
  currency: string;
  offerUrl: string;
  /** Mínimo que registramos para ESA oferta, su fecha y los días de registro. */
  min: number;
  minDate: string;
  days: number;
  stores: number;
}

/**
 * "Precio de hoy frente al mínimo registrado": la referencia para juzgar una
 * oferta de Black Friday antes de que llegue. Las fichas más comparadas (más
 * tiendas distintas que envían al mercado), con la oferta más barata de hoy y
 * el mínimo que tiene NUESTRO archivo para esa misma oferta (14+ días).
 */
export function bfReference(locale: HubLocale, section: RefRow["section"], n: number): RefRow[] {
  const country = MARKET[locale];
  const a = archive();
  const list = (section === "botas" ? bootProducts : products) as unknown as (AnyItem & { teamKey?: string })[];
  const rows: RefRow[] = [];
  for (const item of list) {
    const live = item.offers.filter((o) => o.inStock !== false && o.price > 0 && offerShipsTo(o.store, country));
    const stores = countDistinctRetailers(live);
    if (stores < 2) continue;
    const o = live.reduce((b, x) => (eurOf(section, x) < eurOf(section, b) ? x : b));
    const s = offerPriceStats(o.url, a);
    if (!s || s.current !== o.price || s.currency !== o.currency) continue;
    rows.push({ section, item, store: o.store, price: o.price, currency: o.currency, offerUrl: o.url, min: s.min, minDate: s.minDate, days: s.coverageDays, stores });
  }
  rows.sort((x, y) => y.stores - x.stores || x.item.id.localeCompare(y.item.id));
  // Una por equipo (camisetas) o por línea (botas): si no, las quince
  // primeras son del mismo club o todas Predator.
  const seen = new Set<string>();
  return rows.filter((r) => {
    const b = r.item as unknown as { teamKey?: string; brand?: string; model?: string };
    const k = b.teamKey ?? (b.brand && b.model ? bootLinesOf({ brand: b.brand, model: b.model })[0] ?? b.brand : r.item.id);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, n);
}

// ------------------------------------------------------------ regalos

export type GiftType = "club" | "seleccion" | "retro" | "botas" | "pelotas" | "guantes" | "tickets";
export const GIFT_TYPES: GiftType[] = ["club", "seleccion", "retro", "botas", "pelotas", "guantes", "tickets"];
const SECTION_OF: Record<GiftType, DealSection> = { club: "camiseta", seleccion: "camiseta", retro: "camiseta", botas: "botas", pelotas: "pelotas", guantes: "guantes", tickets: "tickets" };

export interface GiftCard {
  type: GiftType;
  section: DealSection;
  id: string;
  href: string;
  title: string;
  image: string;
  /** Precio + envío al mercado, en la moneda de la tienda. */
  total: number;
  price: number;
  shipping: number;
  currency: string;
  store: string;
  offerUrl: string;
}

type Item = Giftable & { teamKey?: string; brand?: string; competition?: string; date?: string };

let tplCache: Set<string> | null = null;
const templates = () => (tplCache ??= ticketTemplatePrices(ticketProducts));

/** Ofertas que de verdad se pueden regalar hoy en ese mercado: en stock, con
 *  precio, que envían allí y con el envío medido (sin "envío a verificar"),
 *  para que el total que se muestra sea el que se paga. En entradas, sin las
 *  tarifas de plantilla de la reventa (offerMoney.ticketTemplatePrices). */
function giftable(type: GiftType, o: GiftOffer, country: string): boolean {
  if (o.inStock === false || !(o.price > 0)) return false;
  if (type === "tickets") return !templates().has(`${o.store}|${o.price}`);
  return offerShipsTo(o.store, country as never) && !shippingUnknown({ store: o.store, shipping: o.shipping ?? 0, url: o.url }, country);
}

const listCache = new Map<string, Item[]>();
function giftList(type: GiftType, locale: HubLocale): Item[] {
  const key = `${type}|${locale}`;
  const hit = listCache.get(key);
  if (hit) return hit;
  // Entradas: solo partidos después de Navidad (regalar en diciembre una
  // entrada de octubre no tiene sentido).
  const today = todayIso();
  const after = [today, currentGiftSeason(today).xmas].sort()[1];
  const base: Item[] =
    type === "botas" ? (bootProducts as unknown as Item[])
    : type === "pelotas" ? (ballProducts as unknown as Item[])
    : type === "guantes" ? (gloveProducts as unknown as Item[])
    : type === "tickets" ? (ticketProducts as unknown as Item[]).filter((t) => (t.date ?? "") > after)
    : (products.filter((p) =>
        type === "retro" ? isVintageRetro(p)
        : type === "seleccion" ? teamCategory[p.teamKey] === "national" && p.season === "2026" && p.typeKey !== "retro"
        : teamCategory[p.teamKey] === "club" && p.typeKey !== "retro" && seasonSortValue(p.season) >= 2025,
      ) as unknown as Item[]);
  const out = base
    .map((i) => ({ ...i, offers: i.offers.filter((o) => giftable(type, o, MARKET[locale])) }))
    .filter((i) => i.offers.length);
  listCache.set(key, out);
  return out;
}

const groupKey = (type: GiftType) => (i: Item) => (type === "tickets" ? i.competition : type === "club" || type === "seleccion" || type === "retro" ? i.teamKey : i.brand) ?? i.id;

export function giftCards(type: GiftType, locale: HubLocale, band: GiftBand, max: number, perGroup = 2): GiftCard[] {
  const section = SECTION_OF[type];
  return giftPicks(giftList(type, locale), band, max, groupKey(type), perGroup).map((x) => ({
    type,
    section,
    id: x.id,
    href: `/${locale}/${section}/${x.id}`,
    title: itemName(section, x as unknown as AnyItem, locale),
    image: x.pick.imageUrl ?? x.imageUrl ?? "",
    total: x.pick.price + (x.pick.shipping ?? 0),
    price: x.pick.price,
    shipping: x.pick.shipping ?? 0,
    currency: x.pick.currency,
    store: x.pick.store,
    offerUrl: x.pick.url,
  }));
}

export const ALL_PRICES: GiftBand = { key: "over100", min: 0, max: Infinity };

const PER_TYPE = 8;

/** Lo que pinta /regalos-futbol (y lo que revisa scripts/check_seasonal.mts):
 *  por presupuesto, una por tipo y tramo; por tipo, las 8 más comparadas. */
export function giftPage(locale: HubLocale) {
  const budget = GIFT_BANDS.map((band) => ({ band, cards: GIFT_TYPES.flatMap((t) => giftCards(t, locale, band, 2, 1)) })).filter((b) => b.cards.length);
  const types = GIFT_TYPES.map((type) => ({ type, cards: giftCards(type, locale, ALL_PRICES, PER_TYPE) })).filter((t) => t.cards.length);
  return { budget, types };
}
