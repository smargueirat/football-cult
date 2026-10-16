import { products, bestOffer, type TeamKey } from "@/data/products";
import type { HubLocale } from "@/data/teamMeta";
import { BOOT_LINES, bootLinesOf } from "@/lib/bootLines";
import { MIN_HUB_ITEMS, gearItems, kidsBootItems, type GearItem } from "@/lib/gearHubs";
import { teamName, type HubItem } from "@/lib/hubs";
import { formatOfferMoney, offerTotalInEUR } from "@/lib/offerMoney";
import { ticketCompetitionFacets, ticketTeamFacets } from "@/lib/ticketHubs";
import { isVintageRetro, seasonSortValue, teamCategory } from "@/lib/productMeta";
import { distinctRetailerLabels } from "@/lib/retailerFamily";
import { EXTRA } from "@/lib/extraHubStrings";
import { withBrand } from "@/lib/seoMeta";

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

// 3 (antes 5, 2026-10-16): las consultas retro que ya salen en página 1-2 son
// de clubes medianos con pocas camisetas; un hub de 3 reales ya compara.
export const RETRO_MIN = 3;
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

// Equipo + década (/retro/manutd/1990): solo para equipos con AL MENOS DOS
// décadas de RETRO_MIN+ camisetas cada una. Con una sola, el hub de década
// sería casi el del equipo con otra URL (contenido duplicado).
export const retroTeamDecadeItems = (team: string, decade: number) => retroTeamItems(team).filter((i) => decadeOf(i.product.season) === decade);
export function retroTeamDecadeFacets(team?: string) {
  const raw = countBy(team ? retroTeamItems(team) : vintage(), (i) => `${i.product.teamKey}|${decadeOf(i.product.season)}`).map(([k, count]) => ({
    team: k.split("|")[0],
    decade: Number(k.split("|")[1]),
    count,
  }));
  const perTeam = new Map<string, number>();
  for (const f of raw) perTeam.set(f.team, (perTeam.get(f.team) ?? 0) + 1);
  return raw.filter((f) => perTeam.get(f.team)! >= 2).sort((a, b) => a.team.localeCompare(b.team) || a.decade - b.decade);
}

// Datos de un hub retro (equipo, década o equipo+década) para la página, el
// <title> y scripts/check_query_patterns.mts. null = no existe (404).
export type RetroSpec = { team: string; decade?: string } | { decade: string };

export function retroHub(spec: RetroSpec, locale: HubLocale) {
  const x = EXTRA[locale];
  const team = "team" in spec ? spec.team : undefined;
  const decade = spec.decade === undefined ? undefined : Number(spec.decade);
  if (spec.decade !== undefined && (!/^\d{4}$/.test(spec.decade) || decade! % 10)) return null;
  let items: HubItem[];
  let headline: string;
  let path: string;
  const name = team ? teamName(team, locale) : x.decadeName(decade!);
  const national = !!team && teamCategory[team as TeamKey] === "national";
  if (team && decade !== undefined) {
    if (!retroTeamDecadeFacets(team).some((f) => f.decade === decade)) return null;
    items = retroTeamDecadeItems(team, decade);
    headline = x.retroTeamDecadeH1(name, national, decade);
    path = `/retro/${team}/${decade}`;
  } else if (team) {
    items = retroTeamItems(team);
    headline = x.retroTeamH1(name, national);
    path = `/retro/${team}`;
  } else {
    items = retroDecadeItems(decade!);
    headline = x.retroDecadeH1(decade!);
    path = `/retro/decada/${decade}`;
  }
  if (items.length < RETRO_MIN) return null;
  const seasons = [...new Set(items.map((i) => i.product.season))].sort((a, b) => seasonSortValue(a) - seasonSortValue(b) || a.localeCompare(b));
  const stores = distinctRetailerLabels(items.flatMap((i) => i.product.offers.filter((o) => o.inStock !== false)));
  const eurs = items.map((i) => i.eur);
  const lo = formatOfferMoney(Math.min(...eurs), "EUR");
  const hi = formatOfferMoney(Math.max(...eurs), "EUR");
  const y0 = seasonSortValue(seasons[0]);
  const y1 = seasonSortValue(seasons[seasons.length - 1]);
  const range = y0 === y1 ? String(y0) : `${y0}-${y1}`;
  return {
    items,
    team: team as TeamKey | undefined,
    decade,
    name,
    headline,
    path,
    title: withBrand(x.retroTitle(headline, range)),
    description: x.retroMeta({ subject: headline, n: items.length, price: lo, range }),
    intro: x.retroIntro({ subject: headline, n: items.length, seasons, stores, price: lo === hi ? lo : `${lo} – ${hi}` }),
  };
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
    ...retroTeamDecadeFacets().map((f) => ({ kind: "retro-equipo-decada", path: `/retro/${f.team}/${f.decade}` })),
    ...ticketTeamFacets().map((f) => ({ kind: "entradas-equipo", path: `/tickets/equipo/${f.slug}` })),
    ...ticketCompetitionFacets().map((f) => ({ kind: "entradas-competicion", path: `/tickets/competicion/${f.slug}` })),
  ];
}
