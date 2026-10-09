import { products, type Product } from "@/data/products";
import type { HubLocale } from "@/data/teamMeta";
import { ADULT_SIZES, kitOf, offerShipsTo, seasonSortValue, teamCategory, teamNames } from "@/lib/productMeta";
import { offerSleeve, offerVersion } from "@/lib/jerseyVersion";
import { isComparableStore } from "@/lib/officialStores";
import { countDistinctRetailers } from "@/lib/retailerFamily";
import { archive, massDropDays, offerKey } from "@/lib/priceArchive";
import { MARKET, gearHubFrom, jerseyBrand } from "@/lib/seoMeta";
import { gearItems, groundFacets } from "@/lib/gearHubs";
import { bootLinesOf } from "@/lib/bootLines";
import { lineFacets } from "@/lib/extraHubs";

// Datos de las guías (2026-10-09): todo sale del catálogo de hoy y del
// archivo de precios; si un dato no existe, la guía no lo dibuja. SOLO
// servidor. Comprobación: scripts/check_guide_data.mts.
//
// Criterio común de "precio comparable": tienda oficial o minorista (no eBay,
// Amazon ni réplicas), en EUR, en stock, versión aficionado de manga corta,
// con envío al mercado del idioma (MARKET en seoMeta.ts) y precio + envío.

const quantile = (xs: number[], q: number) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
};
export const median = (xs: number[]) => quantile(xs, 0.5);

type JOffer = Product["offers"][number];
const total = (o: JOffer) => o.price + (o.shipping ?? 0);

function comparable(p: Product, country: string, version: "fan" | "player" = "fan"): JOffer[] {
  return p.offers.filter(
    (o) =>
      o.currency === "EUR" &&
      o.price > 0 &&
      o.inStock !== false &&
      isComparableStore(o.store) &&
      offerShipsTo(o.store, country as never) &&
      offerVersion(o) === version &&
      offerSleeve(o) === "short",
  );
}

const cheapest = (os: JOffer[]) => os.reduce<JOffer | undefined>((b, o) => (!b || total(o) < total(b) ? o : b), undefined);
const isAdult = (p: Product) => p.ageGroup !== "kids" && p.ageGroup !== "women";
const MAIN_KITS = ["home", "away", "third"] as const;

// ------------------------------------------------------- Mundial 2026

export interface WcRow {
  product: Product;
  team: string;
  kit: (typeof MAIN_KITS)[number];
  price: number;
  store: string;
  stores: number;
  sizes: string[];
  player?: number;
}

/** Camisetas de selección de la temporada "2026" (las del Mundial), adulto,
 *  primera/segunda/tercera, con al menos una oferta comparable que envía al
 *  mercado del idioma. Ordenadas por selección y equipación. */
export function worldCupRows(locale: HubLocale): { rows: WcRow[]; teams: number } {
  const country = MARKET[locale];
  const rows: WcRow[] = [];
  for (const p of products) {
    if (teamCategory[p.teamKey] !== "national" || p.season !== "2026" || p.typeKey === "retro" || !isAdult(p)) continue;
    const kit = kitOf(p);
    if (!kit || !(MAIN_KITS as readonly string[]).includes(kit)) continue;
    const fan = comparable(p, country);
    const best = cheapest(fan);
    if (!best) continue;
    const pl = cheapest(comparable(p, country, "player"));
    rows.push({
      product: p,
      team: teamNames[p.teamKey]?.[locale] ?? p.teamKey,
      kit: kit as WcRow["kit"],
      price: total(best),
      store: best.store,
      stores: countDistinctRetailers(fan),
      sizes: ADULT_SIZES.filter((s) => best.sizes.includes(s)),
      ...(pl ? { player: total(pl) } : {}),
    });
  }
  rows.sort((a, b) => a.team.localeCompare(b.team, locale) || MAIN_KITS.indexOf(a.kit) - MAIN_KITS.indexOf(b.kit));
  return { rows, teams: new Set(rows.map((r) => r.product.teamKey)).size };
}

// ------------------------------------------------ aficionado vs jugador

export interface FanPlayerRow {
  brand: string;
  n: number;
  /** Mediana de (jugador / aficionado). */
  ratio: number;
  /** Mediana de la diferencia en EUR. */
  diff: number;
}

/** Fichas de temporada actual (2025 en adelante, sin retro) que tienen las
 *  DOS versiones en tiendas comparables en EUR: cuánto más cuesta la de
 *  jugador. Precio sin envío (es la diferencia de producto). */
export function fanVsPlayer(): { rows: FanPlayerRow[]; n: number; ratio: number; diff: number; examples: { product: Product; fan: number; player: number }[] } {
  const byBrand = new Map<string, { r: number[]; d: number[] }>();
  const all: { product: Product; fan: number; player: number }[] = [];
  for (const p of products) {
    if (p.typeKey === "retro" || seasonSortValue(p.season) < 2025) continue;
    const os = p.offers.filter((o) => o.currency === "EUR" && o.price > 0 && isComparableStore(o.store) && offerSleeve(o) === "short");
    const fan = os.filter((o) => offerVersion(o) === "fan").map((o) => o.price);
    const pl = os.filter((o) => offerVersion(o) === "player").map((o) => o.price);
    if (!fan.length || !pl.length) continue;
    const f = Math.min(...fan);
    const j = Math.min(...pl);
    if (j <= f) continue; // una "jugador" más barata es un título mal clasificado, no un dato
    const brand = jerseyBrand(p) ?? "";
    if (!brand) continue;
    const e = byBrand.get(brand) ?? { r: [], d: [] };
    e.r.push(j / f);
    e.d.push(j - f);
    byBrand.set(brand, e);
    all.push({ product: p, fan: f, player: j });
  }
  const rows = [...byBrand.entries()]
    .map(([brand, e]) => ({ brand, n: e.r.length, ratio: median(e.r), diff: median(e.d) }))
    .sort((a, b) => b.n - a.n);
  return {
    rows,
    n: all.length,
    ratio: median(all.map((x) => x.player / x.fan)),
    diff: median(all.map((x) => x.player - x.fan)),
    examples: [...all].sort((a, b) => countDistinctRetailers(b.product.offers) - countDistinctRetailers(a.product.offers)).slice(0, 6),
  };
}

// ------------------------------------- temporada anterior vs temporada actual

export interface SeasonPair {
  team: string;
  kit: string;
  prev: Product;
  cur: Product;
  prevPrice: number;
  curPrice: number;
}

/** Misma selección/club y misma equipación (adulto, aficionado): el precio
 *  mínimo comparable de la temporada anterior frente al de la más nueva que
 *  tenemos. No es "cuánto baja una camiseta con el tiempo" medido sobre la
 *  misma prenda: es lo que cuesta HOY cada una. */
export function seasonGap(locale: HubLocale): { pairs: SeasonPair[]; median: number; p25: number; p75: number } {
  const country = MARKET[locale];
  const groups = new Map<string, { p: Product; price: number }[]>();
  for (const p of products) {
    const kit = kitOf(p);
    if (p.typeKey === "retro" || !isAdult(p) || !kit || !(MAIN_KITS as readonly string[]).includes(kit)) continue;
    const best = cheapest(comparable(p, country));
    if (!best) continue;
    const k = `${p.teamKey}|${kit}`;
    groups.set(k, [...(groups.get(k) ?? []), { p, price: total(best) }]);
  }
  const pairs: SeasonPair[] = [];
  for (const [k, g] of groups) {
    const bySeason = new Map<number, { p: Product; price: number }>();
    for (const x of g) {
      const s = seasonSortValue(x.p.season);
      const cur = bySeason.get(s);
      if (!cur || x.price < cur.price) bySeason.set(s, x);
    }
    const seasons = [...bySeason.keys()].sort((a, b) => b - a);
    if (seasons.length < 2) continue;
    const cur = bySeason.get(seasons[0])!;
    const prev = bySeason.get(seasons[1])!;
    const [teamKey, kit] = k.split("|");
    pairs.push({ team: teamNames[teamKey as keyof typeof teamNames]?.[locale] ?? teamKey, kit, prev: prev.p, cur: cur.p, prevPrice: prev.price, curPrice: cur.price });
  }
  const pct = pairs.map((x) => (x.prevPrice / x.curPrice - 1) * 100);
  // Los ejemplos que se muestran: los equipos con más tiendas primero (los más
  // buscados), no los de mayor diferencia, que suelen ser los casos raros.
  const reach = (p: Product) => countDistinctRetailers(p.offers);
  pairs.sort((a, b) => reach(b.cur) + reach(b.prev) - reach(a.cur) - reach(a.prev));
  return { pairs, median: median(pct), p25: quantile(pct, 0.25), p75: quantile(pct, 0.75) };
}

// --------------------------------------- bajadas medidas en nuestro archivo

export interface DropStats {
  first: string;
  last: string;
  offers: number;
  withDrop: number;
  events: number;
  medianDrop: number;
  p75Drop: number;
  stores: { store: string; offers: number; withDrop: number }[];
}

/** Camisetas en tiendas comparables: cuántas ofertas bajaron de precio al
 *  menos una vez desde que las seguimos y cuánto. Sin los días en que media
 *  tienda cambió de precio a la vez (cambio de feed, no rebaja). */
export function jerseyDropStats(): DropStats {
  const a = archive();
  const offers = products.flatMap((p) => p.offers).filter((o) => isComparableStore(o.store));
  const mass = massDropDays(offers, a);
  const drops: number[] = [];
  const byStore = new Map<string, { store: string; offers: number; withDrop: number }>();
  let tracked = 0;
  let withDrop = 0;
  for (const o of offers) {
    const arr = a.byKey.get(offerKey(o.url));
    if (!arr) continue;
    tracked++;
    let dropped = false;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].c !== arr[i - 1].c || arr[i].p >= arr[i - 1].p || mass.has(`${o.store}|${arr[i].d}`)) continue;
      const pct = (1 - arr[i].p / arr[i - 1].p) * 100;
      if (pct < 0.5) continue;
      drops.push(pct);
      dropped = true;
    }
    if (dropped) withDrop++;
    const s = byStore.get(o.store) ?? { store: o.store, offers: 0, withDrop: 0 };
    s.offers++;
    if (dropped) s.withDrop++;
    byStore.set(o.store, s);
  }
  return {
    first: a.firstDate,
    last: a.lastDate,
    offers: tracked,
    withDrop,
    events: drops.length,
    medianDrop: median(drops),
    p75Drop: quantile(drops, 0.75),
    stores: [...byStore.values()].filter((s) => s.offers >= 30).sort((x, y) => y.withDrop / y.offers - x.withDrop / x.offers),
  };
}

// -------------------------------------------------- botas por terreno

export interface GroundRow {
  code: string;
  slug: string;
  count: number;
  from: string;
  median: number;
  lines: { slug: string; name: string; count: number }[];
}

/** Botas de adulto por tipo de suela: cuántos modelos, desde cuánto (EUR con
 *  envío al mercado del idioma), precio mediano y las líneas con más modelos. */
export function bootsByGround(locale: HubLocale): GroundRow[] {
  const hubs = new Set(lineFacets().map((l) => l.slug));
  return groundFacets().map((g) => {
    const items = gearItems("botas").filter((i) => i.ground === g.name);
    const lines = new Map<string, number>();
    for (const i of items) for (const l of bootLinesOf(i)) if (hubs.has(l)) lines.set(l, (lines.get(l) ?? 0) + 1);
    const names = new Map(lineFacets().map((l) => [l.slug, l.name]));
    return {
      code: g.name,
      slug: g.slug,
      count: items.length,
      from: gearHubFrom("botas", items.map((i) => i.id), locale),
      median: median(items.filter((i) => i.currency === "EUR").map((i) => i.eur)),
      lines: [...lines.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([slug, count]) => ({ slug, name: names.get(slug) ?? slug, count })),
    };
  });
}
