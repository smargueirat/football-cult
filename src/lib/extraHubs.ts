import { products, bestOffer, teamNames } from "@/data/products";
import type { TeamKey } from "@/data/products";
import { ticketProducts, type TicketProduct } from "@/data/tickets";
import { BOOT_LINES, bootLinesOf } from "@/lib/bootLines";
import { MIN_HUB_ITEMS, gearItems, kidsBootItems, slugify, type GearItem } from "@/lib/gearHubs";
import type { HubItem } from "@/lib/hubs";
import { offerTotalInEUR, ticketOfferTotalInEUR, ticketSellers } from "@/lib/offerMoney";
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

// ---------- entradas ----------

export const TICKET_MIN = MIN_HUB_ITEMS;
export const ticketTeams = (event: string) => event.split(/\s+vs\s+/i).map((s) => s.trim()).filter(Boolean);

// Nombre del feed ("Inter Milan", "FC Barcelona") -> clave de equipo del
// catálogo de camisetas, para enlazar entradas <-> camisetas del mismo club.
// Sin coincidencia exacta tras quitar siglas, no se enlaza: mejor nada que
// mandar al Sporting de Gijón desde el Sporting de Lisboa.
const normTeam = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\b(fc|cf|afc|sc|ac|as|ssc|club|de|cd|rcd|ud|sd|ca|sl|vfb|vfl|tsg|bv|rb)\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
let teamIndex: Map<string, TeamKey> | null = null;
export function teamKeyForTicketName(name: string): TeamKey | undefined {
  if (!teamIndex) {
    teamIndex = new Map();
    for (const [k, v] of Object.entries(teamNames) as [TeamKey, Record<string, string>][]) {
      for (const n of Object.values(v)) if (!teamIndex.has(normTeam(n))) teamIndex.set(normTeam(n), k);
    }
  }
  return teamIndex.get(normTeam(name));
}

function ticketFacets(key: (t: TicketProduct) => string[]) {
  const m = new Map<string, { slug: string; name: string; count: number }>();
  for (const t of ticketProducts) {
    for (const name of key(t)) {
      const slug = slugify(name);
      if (!slug) continue;
      const f = m.get(slug) ?? { slug, name, count: 0 };
      f.count++;
      m.set(slug, f);
    }
  }
  return [...m.values()].filter((f) => f.count >= TICKET_MIN).sort((a, b) => b.count - a.count);
}
let teamFacetCache: ReturnType<typeof ticketFacets> | null = null;
let compFacetCache: ReturnType<typeof ticketFacets> | null = null;
export const ticketTeamFacets = () => (teamFacetCache ??= ticketFacets((t) => ticketTeams(t.event)));
export const ticketCompetitionFacets = () => (compFacetCache ??= ticketFacets((t) => [t.competition]));

const byDate = (a: TicketProduct, b: TicketProduct) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
export const ticketTeamItems = (slug: string) => ticketProducts.filter((t) => ticketTeams(t.event).some((n) => slugify(n) === slug)).sort(byDate);
export const ticketCompetitionItems = (slug: string) => ticketProducts.filter((t) => slugify(t.competition) === slug).sort(byDate);

export function ticketTeamSlugForKey(key: string): string | undefined {
  return ticketTeamFacets().find((f) => teamKeyForTicketName(f.name) === key)?.slug;
}

/** Datos del hub de entradas: nº de partidos, primera/última fecha, vendedores
 *  distintos y el precio más bajo (EUR, el que compara el resto del sitio). */
export function ticketStats(items: TicketProduct[]) {
  let min = Infinity;
  const sellers = new Set<string>();
  for (const t of items) {
    for (const s of ticketSellers(t.offers)) sellers.add(s);
    for (const o of t.offers) min = Math.min(min, ticketOfferTotalInEUR(o));
  }
  return { n: items.length, first: items[0]?.date ?? "", last: items[items.length - 1]?.date ?? "", sellers: sellers.size, minEur: min };
}

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
