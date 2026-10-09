import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { ticketProducts } from "@/data/tickets";
import { apparelProducts } from "@/data/apparel";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { trainingProducts } from "@/data/training";
import type { HubLocale } from "@/data/teamMeta";
import { previousPriceOf } from "@/lib/priceDrops";
import { archive, lastChangeDate, massDropDays, offerPriceStats } from "@/lib/priceArchive";
import { bootOfferTotalInEUR, offerTotalInEUR, ticketOfferTotalInEUR, type BootCurrencyCode, type OfferCurrencyCode } from "@/lib/offerMoney";
import { gearName, jerseyName, ticketName, type GearLike } from "@/lib/seoMeta";
import { productImage } from "@/lib/productPhoto";

// Filas de las páginas /bajadas-de-precio, /ofertas-de-la-semana,
// /minimos-historicos y del feed Atom. SOLO servidor (importa los siete
// catálogos). Nada se calcula con el "precio tachado" de las tiendas: las
// bajadas son las VERIFICADAS de priceDrops.json (precio anterior vigente
// 5+ días en nuestro archivo, actual el más bajo de 30 días, sin los días en
// que media tienda cambió a la vez; ver track_price_drops.mts) y los mínimos
// salen del archivo durable data/price-history (priceArchive.ts).

export type DealSection = "camiseta" | "botas" | "tickets" | "ropa" | "guantes" | "pelotas" | "entrenamiento";
export const DEAL_SECTIONS: DealSection[] = ["camiseta", "botas", "tickets", "ropa", "guantes", "pelotas", "entrenamiento"];

type AnyOffer = { store: string; price: number; shipping?: number; currency: string; url: string; inStock?: boolean; imageUrl?: string };
type AnyItem = { id: string; imageUrl?: string; offers: readonly AnyOffer[] };

const LISTS: Record<DealSection, readonly AnyItem[]> = {
  camiseta: products as unknown as AnyItem[],
  botas: bootProducts as unknown as AnyItem[],
  tickets: ticketProducts as unknown as AnyItem[],
  ropa: apparelProducts as unknown as AnyItem[],
  guantes: gloveProducts as unknown as AnyItem[],
  pelotas: ballProducts as unknown as AnyItem[],
  entrenamiento: trainingProducts as unknown as AnyItem[],
};

/** Total en EUR (precio + envío; las entradas no tienen envío) para ordenar y
 *  para los topes de cordura. El precio que se MUESTRA es siempre el real. */
function eurOf(section: DealSection, o: AnyOffer): number {
  if (section === "tickets") return ticketOfferTotalInEUR({ price: o.price, currency: o.currency as OfferCurrencyCode });
  if (section === "camiseta") return offerTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as OfferCurrencyCode });
  return bootOfferTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as BootCurrencyCode });
}

export interface DealRow {
  section: DealSection;
  item: AnyItem;
  store: string;
  /** Precio real de hoy, en la moneda de la tienda, sin envío. */
  price: number;
  /** Precio anterior (bajadas) o precio habitual -- mediana por días (mínimos). */
  before: number;
  currency: OfferCurrencyCode;
  pct: number;
  /** Fecha desde la que rige el precio de hoy. */
  since: string;
  /** Mínimos: días de registro de esa oferta. */
  days?: number;
  eur: number;
  offerUrl: string;
}

export const dealHref = (r: DealRow, locale: HubLocale) => `/${locale}/${r.section}/${r.item.id}`;

export function dealName(r: DealRow, locale: HubLocale): string {
  if (r.section === "camiseta") return jerseyName(r.item as never, locale);
  if (r.section === "tickets") return ticketName(r.item as never, locale);
  return gearName(r.section, r.item as unknown as GearLike, locale);
}

export function dealImage(r: DealRow): string {
  if (r.section === "camiseta") return productImage(r.item as never) ?? "";
  return r.item.imageUrl ?? r.item.offers.find((o) => o.imageUrl)?.imageUrl ?? "";
}

let dropsCache: DealRow[] | null = null;
/** Una fila por ficha (la oferta en stock con mayor bajada), de mayor a menor %. */
export function verifiedDropRows(): DealRow[] {
  if (dropsCache) return dropsCache;
  const a = archive();
  const out: DealRow[] = [];
  for (const section of DEAL_SECTIONS) {
    for (const item of LISTS[section]) {
      let best: DealRow | null = null;
      for (const o of item.offers) {
        if (o.inStock === false || !(o.price > 0)) continue;
        const prev = previousPriceOf(o);
        if (prev === undefined) continue;
        const pct = ((prev - o.price) / prev) * 100;
        if (best && pct <= best.pct) continue;
        best = {
          section,
          item,
          store: o.store,
          price: o.price,
          before: prev,
          currency: o.currency as OfferCurrencyCode,
          pct,
          since: lastChangeDate(o.url, a) ?? a.lastDate,
          eur: eurOf(section, o),
          offerUrl: o.url,
        };
      }
      if (best) out.push(best);
    }
  }
  return (dropsCache = out.sort((x, y) => y.pct - x.pct));
}

/** Tope de cordura para las listas "destacadas": una entrada de reventa de
 *  40.000 GBP o un -2 % no son una oferta de la semana (crecimiento.md F2). */
const MAX_EUR = 1000;
const MIN_PCT = 5;
const PER_SECTION_WEEK = 12;

/** Bajadas verificadas de los últimos 7 días del archivo, máx. 12 por sección. */
export function weeklyRows(): DealRow[] {
  const last = archive().lastDate;
  if (!last) return [];
  const from = new Date(Date.parse(last + "T00:00:00Z") - 6 * 86_400_000).toISOString().slice(0, 10);
  const per = new Map<DealSection, number>();
  return verifiedDropRows().filter((r) => {
    if (r.since < from || r.pct < MIN_PCT || r.eur > MAX_EUR) return false;
    const n = per.get(r.section) ?? 0;
    if (n >= PER_SECTION_WEEK) return false;
    per.set(r.section, n + 1);
    return true;
  });
}

/** Días de archivo que exigimos antes de llamar "mínimo" a un precio. */
export const LOW_MIN_DAYS = 21;

let lowsCache: DealRow[] | null = null;
/**
 * Ofertas cuyo precio de hoy es el MÁS BAJO que registramos para ellas en al
 * menos LOW_MIN_DAYS días y queda 3 %+ por debajo de su precio habitual. Sin
 * entradas: la reventa cambia cada día y su "mínimo" es ruido. Se descarta el
 * día en que media tienda cambió de precio a la vez (cambio de feed).
 */
export function historicLowRows(): DealRow[] {
  if (lowsCache) return lowsCache;
  const a = archive();
  const out: DealRow[] = [];
  for (const section of DEAL_SECTIONS) {
    if (section === "tickets") continue;
    const list = LISTS[section];
    const mass = massDropDays(list.flatMap((i) => i.offers), a);
    for (const item of list) {
      let best: DealRow | null = null;
      for (const o of item.offers) {
        if (o.inStock === false || !(o.price > 0)) continue;
        const s = offerPriceStats(o.url, a, LOW_MIN_DAYS);
        if (!s || s.current !== o.price || s.currency !== o.currency || s.distinct < 2) continue;
        if (s.current !== s.min || s.current > s.median * 0.97) continue;
        const since = lastChangeDate(o.url, a) ?? s.minDate;
        if (mass.has(`${o.store}|${since}`)) continue;
        const pct = ((s.median - s.current) / s.median) * 100;
        if (best && pct <= best.pct) continue;
        best = { section, item, store: o.store, price: o.price, before: s.median, currency: o.currency as OfferCurrencyCode, pct, since, days: s.coverageDays, eur: eurOf(section, o), offerUrl: o.url };
      }
      if (best) out.push(best);
    }
  }
  return (lowsCache = out.sort((x, y) => y.pct - x.pct));
}

/** Para textos y llms.txt: fecha de la última corrida y del primer registro. */
export const archiveDates = () => ({ first: archive().firstDate, last: archive().lastDate });
