import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { bootOfferTotalInEUR } from "@/lib/offerMoney";
import { isComparableStore } from "@/lib/officialStores";
import type { HubFacts } from "@/lib/hubFaq";

import { bestPerRetailer, countDistinctRetailers, distinctRetailerLabels } from "@/lib/retailerFamily";
// Datos de los hubs de botas / guantes / pelotas / ropa (marca, terreno,
// tipo). SOLO servidor -- importa los catálogos enteros (ver el comentario
// largo en src/lib/offerMoney.ts sobre por qué no desde componentes de
// cliente).

export type GearSection = "botas" | "guantes" | "pelotas" | "ropa" | "entrenamiento";
export const MIN_HUB_ITEMS = 6; // menos que esto es una página delgada: no se genera

export interface GearItem {
  id: string;
  section: GearSection;
  brand: string; // ya canonicalizada (Adidas/adidas -> la grafía más común)
  brandSlug: string;
  model: string;
  image: string;
  price: number;
  shipping: number;
  currency: "EUR" | "USD" | "CLP" | "ARS";
  eur: number;
  stores: number;
  storeNames: string[];
  /** Tienda de la oferta más barata: hace falta para responder "¿qué
   *  tienda tiene el precio más bajo?" en el bloque de preguntas del hub. */
  bestStore: string;
  /** Diferencia real entre la tienda más barata y la más cara de ESTA
   *  ficha, solo entre minoristas comparables (ver officialStores.ts). */
  spread?: { abs: number; pct: number; cheapStore: string; dearStore: string };
  ground?: string; // botas
  /** Bota de niño (ver src/lib/bootLines.ts). */
  kids?: boolean;
  type?: string; // ropa / entrenamiento
}

export function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface RawOffer {
  price: number;
  shipping: number;
  currency: "EUR" | "USD" | "CLP" | "ARS";
  imageUrl: string;
  store: string;
}
interface Raw {
  id: string;
  brand: string;
  model: string;
  offers: RawOffer[];
  groundType?: string;
  ageGroup?: string;
  type?: string;
}

const cache: Partial<Record<GearSection, GearItem[]>> = {};

// Igual que en las fichas y en los hubs de camiseta: el ahorro se mide
// SOLO entre minoristas comparables. Con marketplaces o tiendas de
// réplicas dentro, el número se dispara comparando cosas distintas (ver
// el comentario largo de officialStores.ts).
function spreadOf(offers: Raw["offers"]): GearItem["spread"] {
  // Una cifra por tienda: el espejo ES/FR de un mismo minorista no cuenta.
  const comp = bestPerRetailer(
    offers
      .filter((o) => isComparableStore(o.store))
      .map((o) => ({ store: o.store, eur: bootOfferTotalInEUR(o) })),
    (a, b) => a.eur < b.eur,
  ).sort((a, b) => a.eur - b.eur);
  if (comp.length < 2) return undefined;
  const lo = comp[0];
  const hi = comp[comp.length - 1];
  const abs = hi.eur - lo.eur;
  // Menos de un euro no es una historia que valga la pena contar.
  if (abs < 1) return undefined;
  return { abs, pct: Math.round((abs / hi.eur) * 100), cheapStore: lo.store, dearStore: hi.store };
}

function build(section: GearSection, raws: Raw[]): GearItem[] {
  // La grafía de marca más frecuente gana ("Adidas" 992 vs "adidas" 868).
  const spellings = new Map<string, Map<string, number>>();
  for (const r of raws) {
    const k = slugify(r.brand);
    const m = spellings.get(k) ?? new Map<string, number>();
    m.set(r.brand, (m.get(r.brand) ?? 0) + 1);
    spellings.set(k, m);
  }
  const display = new Map<string, string>();
  for (const [k, m] of spellings) display.set(k, [...m.entries()].sort((a, b) => b[1] - a[1])[0][0]);

  const out: GearItem[] = [];
  for (const r of raws) {
    const offers = r.offers.filter((o) => o.imageUrl);
    if (!r.offers.length || !offers.length) continue;
    const best = [...r.offers].sort((a, b) => bootOfferTotalInEUR(a) - bootOfferTotalInEUR(b))[0];
    const brandSlug = slugify(r.brand);
    if (!brandSlug || r.brand === "N/D") continue;
    out.push({
      id: r.id,
      section,
      brand: display.get(brandSlug) ?? r.brand,
      brandSlug,
      model: r.model,
      image: offers[0].imageUrl,
      price: best.price,
      shipping: best.shipping,
      currency: best.currency,
      eur: bootOfferTotalInEUR(best),
      stores: countDistinctRetailers(r.offers),
      storeNames: distinctRetailerLabels(r.offers),
      bestStore: best.store,
      spread: spreadOf(r.offers),
      ground: r.groundType || undefined,
      ...(r.ageGroup === "kids" ? { kids: true } : {}),
      type: r.type,
    });
  }
  return out;
}

// Las botas de niño (2026-10-09) tienen su propio hub (/botas/ninos): los de
// marca/terreno/línea son de adulto, como el listado por defecto de /botas.
// Sin esto "los más baratos" de cada hub abría con botas de niño a 20 EUR.
const adultCache: Partial<Record<GearSection, GearItem[]>> = {};
export function gearItems(section: GearSection): GearItem[] {
  return (adultCache[section] ??= allGearItems(section).filter((i) => !i.kids));
}
export const kidsBootItems = () => allGearItems("botas").filter((i) => i.kids);

function allGearItems(section: GearSection): GearItem[] {
  const hit = cache[section];
  if (hit) return hit;
  const raws: Raw[] =
    section === "botas"
      ? (bootProducts as unknown as Raw[])
      : section === "guantes"
        ? (gloveProducts as unknown as Raw[])
        : section === "pelotas"
          ? (ballProducts as unknown as Raw[])
          : section === "entrenamiento"
            ? (trainingProducts as unknown as Raw[])
            : (apparelProducts as unknown as Raw[]);
  return (cache[section] = build(section, raws));
}

export interface Facet {
  slug: string;
  name: string;
  count: number;
}

function facets(items: GearItem[], key: (i: GearItem) => [string, string] | null): Facet[] {
  const m = new Map<string, Facet>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    const f = m.get(k[0]) ?? { slug: k[0], name: k[1], count: 0 };
    f.count++;
    m.set(k[0], f);
  }
  return [...m.values()].filter((f) => f.count >= MIN_HUB_ITEMS).sort((a, b) => b.count - a.count);
}

export const brandFacets = (s: GearSection) => facets(gearItems(s), (i) => [i.brandSlug, i.brand]);

// Terrenos de botas. FG/AG etc. pasan a slug "fg-ag".
export const GROUND_CODES = ["FG", "AG", "SG", "MG", "TF", "FG/AG"] as const;
export const groundSlug = (g: string) => g.toLowerCase().replace("/", "-");
export const groundFromSlug = (slug: string) => GROUND_CODES.find((g) => groundSlug(g) === slug);

export const groundFacets = () =>
  facets(gearItems("botas"), (i) => (i.ground && (GROUND_CODES as readonly string[]).includes(i.ground) ? [groundSlug(i.ground), i.ground] : null));

export const typeFacets = (section: GearSection = "ropa") =>
  facets(gearItems(section), (i) => (i.type ? [i.type, i.type] : null));

export const byBrand = (s: GearSection, brandSlug: string) => gearItems(s).filter((i) => i.brandSlug === brandSlug);
export const byGround = (ground: string) => gearItems("botas").filter((i) => i.ground === ground);
export const byBrandGround = (brandSlug: string, ground: string) => byBrand("botas", brandSlug).filter((i) => i.ground === ground);
export const byType = (type: string, section: GearSection = "ropa") =>
  gearItems(section).filter((i) => i.type === type);

// Combinaciones marca x terreno con suficiente producto (las de mayor
// intención de búsqueda: "botas nike césped artificial").
export function brandGroundCombos(): { brandSlug: string; brand: string; ground: string; count: number }[] {
  const m = new Map<string, { brandSlug: string; brand: string; ground: string; count: number }>();
  for (const it of gearItems("botas")) {
    if (!it.ground || !(GROUND_CODES as readonly string[]).includes(it.ground)) continue;
    const k = `${it.brandSlug}|${it.ground}`;
    const e = m.get(k) ?? { brandSlug: it.brandSlug, brand: it.brand, ground: it.ground, count: 0 };
    e.count++;
    m.set(k, e);
  }
  return [...m.values()].filter((e) => e.count >= MIN_HUB_ITEMS).sort((a, b) => b.count - a.count);
}

export function cheapestFirst(items: GearItem[]): GearItem[] {
  return [...items].sort((a, b) => a.eur - b.eur);
}


// Los mismos hechos que hubFaq() calcula para los hubs de camiseta, pero
// desde GearItem (que es una vista aplanada: ya no tiene las ofertas
// crudas, por eso bestStore y spread se calculan al construirla).
export function gearFacts(items: GearItem[]): HubFacts {
  const stores = new Set<string>();
  let cheapest: HubFacts["cheapest"];
  let spread: HubFacts["spread"];
  for (const it of items) {
    for (const s of it.storeNames) stores.add(s);
    if (!cheapest || it.eur < cheapest.eur) {
      cheapest = { store: it.bestStore, eur: it.eur, productId: it.id };
    }
    if (it.spread && (!spread || it.spread.abs > spread.abs)) {
      spread = { ...it.spread, productId: it.id };
    }
  }
  // Sin temporadas: no aplican al equipamiento, así que esa pregunta no se
  // dibuja (HubFaq omite las que no tienen dato).
  return { count: items.length, stores: stores.size, cheapest, spread };
}
