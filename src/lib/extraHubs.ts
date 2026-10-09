import { products, bestOffer } from "@/data/products";
import { BOOT_LINES, bootLinesOf } from "@/lib/bootLines";
import { MIN_HUB_ITEMS, gearItems, kidsBootItems, type GearItem } from "@/lib/gearHubs";
import type { HubItem } from "@/lib/hubs";
import { offerTotalInEUR } from "@/lib/offerMoney";
import { ticketCompetitionFacets, ticketTeamFacets } from "@/lib/ticketHubs";
import { isVintageRetro, seasonSortValue } from "@/lib/productMeta";

// Hubs nuevos del 2026-10-09: botas por línea de modelo, de niño y de sala;
// retro por equipo y por década; entradas por equipo y por competición.
// SOLO servidor (importa los catálogos). Todo sale del catálogo de hoy: si
// un hub baja de MIN_HUB_ITEMS deja de existir (404) y sale del sitemap.

// ---------- botas ----------

const lineOf = (i: GearItem) => bootLinesOf({ brand: i.brand, model: i.model });

export const lineItems = (slug: string) => gearItems("botas").filter((i) => lineOf(i).includes(slug));
export const lineKidsCount = (slug: string) => kidsBootItems().filter((i) => lineOf(i).includes(slug)).length;

/** Líneas con hub (adulto, MIN_HUB_ITEMS o más), opcionalmente de una marca. */
export function lineFacets(brandSlug?: string) {
  return BOOT_LINES.filter((l) => !brandSlug || l.brand === brandSlug)
    .map((l) => ({ ...l, count: lineItems(l.slug).length }))
    .filter((l) => l.count >= MIN_HUB_ITEMS);
}

export const futsalItems = () => gearItems("botas").filter((i) => i.ground === "IC");
export { kidsBootItems };

// ---------- retro (temporada <= 2006, isVintageRetro) ----------

export const RETRO_MIN = 5;
export const decadeOf = (season: string) => Math.floor(seasonSortValue(season) / 10) * 10;

let vintageCache: HubItem[] | null = null;
function vintage(): HubItem[] {
  if (vintageCache) return vintageCache;
  const out: HubItem[] = [];
  for (const product of products) {
    if (!isVintageRetro(product) || seasonSortValue(product.season) === 0) continue;
    const offer = bestOffer(product);
    if (offer) out.push({ product, offer, eur: offerTotalInEUR(offer) });
  }
  return (vintageCache = out.sort((a, b) => seasonSortValue(a.product.season) - seasonSortValue(b.product.season) || a.eur - b.eur));
}

export const retroTeamItems = (team: string) => vintage().filter((i) => i.product.teamKey === team);
export const retroDecadeItems = (decade: number) => vintage().filter((i) => decadeOf(i.product.season) === decade);

function countBy<K>(items: HubItem[], key: (i: HubItem) => K) {
  const m = new Map<K, number>();
  for (const i of items) m.set(key(i), (m.get(key(i)) ?? 0) + 1);
  return [...m.entries()].filter(([, n]) => n >= RETRO_MIN).sort((a, b) => b[1] - a[1]);
}
export const retroTeamFacets = () => countBy(vintage(), (i) => i.product.teamKey).map(([team, count]) => ({ team, count }));
export const retroDecadeFacets = () =>
  countBy(vintage(), (i) => decadeOf(i.product.season))
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade - b.decade);

// ---------- sitemap ----------

/** Rutas (sin locale) de todos los hubs de este archivo que existen hoy. */
export function extraHubPaths(): { kind: string; path: string }[] {
  return [
    ...lineFacets().map((l) => ({ kind: "botas-linea", path: `/botas/linea/${l.slug}` })),
    ...(kidsBootItems().length >= MIN_HUB_ITEMS ? [{ kind: "botas-ninos", path: "/botas/ninos" }] : []),
    ...(futsalItems().length >= MIN_HUB_ITEMS ? [{ kind: "botas-sala", path: "/botas/futbol-sala" }] : []),
    ...retroTeamFacets().map((f) => ({ kind: "retro-equipo", path: `/retro/${f.team}` })),
    ...retroDecadeFacets().map((f) => ({ kind: "retro-decada", path: `/retro/decada/${f.decade}` })),
    ...ticketTeamFacets().map((f) => ({ kind: "entradas-equipo", path: `/tickets/equipo/${f.slug}` })),
    ...ticketCompetitionFacets().map((f) => ({ kind: "entradas-competicion", path: `/tickets/competicion/${f.slug}` })),
  ];
}
