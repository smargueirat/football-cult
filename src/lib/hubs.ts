import { bestOffer, products, teamNames, typeNames } from "@/data/products";
import type { Offer, Product, TeamKey, TypeKey } from "@/data/products";
import { getAgeGroup, seasonSortValue } from "@/lib/productMeta";
import { offerTotalInEUR } from "@/lib/offerMoney";
import { LEAGUES, TEAM_LEAGUE, leaguesOfCountry } from "@/data/teamMeta";

// Datos de las páginas hub (equipo / liga / país). SOLO servidor: importa
// el catálogo entero, no usar desde componentes "use client" (ver el
// comentario largo en src/lib/offerMoney.ts sobre por qué).

export interface HubItem {
  product: Product;
  offer: Offer;
  eur: number;
}

const TYPE_ORDER: TypeKey[] = ["home", "away", "third", "goalkeeper", "training", "prematch", "retro"];

let cache: Map<string, HubItem[]> | null = null;

function byTeam(): Map<string, HubItem[]> {
  if (cache) return cache;
  const m = new Map<string, HubItem[]>();
  for (const product of products) {
    const offer = bestOffer(product);
    if (!offer) continue;
    const list = m.get(product.teamKey) ?? [];
    list.push({ product, offer, eur: offerTotalInEUR(offer) });
    m.set(product.teamKey, list);
  }
  for (const list of m.values()) {
    list.sort(
      (a, b) =>
        seasonSortValue(b.product.season) - seasonSortValue(a.product.season) ||
        TYPE_ORDER.indexOf(a.product.typeKey) - TYPE_ORDER.indexOf(b.product.typeKey) ||
        a.eur - b.eur
    );
  }
  cache = m;
  return m;
}

export function teamItems(team: string): HubItem[] {
  return byTeam().get(team) ?? [];
}

export function teamKeysWithItems(): string[] {
  return [...byTeam().keys()];
}

export function leagueTeams(leagueSlug: string): string[] {
  return Object.keys(TEAM_LEAGUE).filter((k) => TEAM_LEAGUE[k] === leagueSlug && teamItems(k).length > 0);
}

export function countryTeams(country: string): string[] {
  const clubs = leaguesOfCountry(country).flatMap((l) => leagueTeams(l.slug));
  return teamItems(country).length > 0 ? [country, ...clubs] : clubs;
}

export interface HubStats {
  count: number;
  stores: number;
  minEur: number;
  minOffer: Offer | undefined;
}

export function statsOf(items: HubItem[]): HubStats {
  const stores = new Set<string>();
  let min: HubItem | undefined;
  for (const it of items) {
    for (const o of it.product.offers) if (o.inStock) stores.add(o.store);
    if (!min || it.eur < min.eur) min = it;
  }
  return { count: items.length, stores: stores.size, minEur: min?.eur ?? 0, minOffer: min?.offer };
}

export function cheapest(items: HubItem[], n: number): HubItem[] {
  return [...items].sort((a, b) => a.eur - b.eur).slice(0, n);
}

export function teamName(team: string, locale: "es" | "en" | "pt" | "fr" | "it"): string {
  return teamNames[team as TeamKey]?.[locale] ?? team;
}

export function kindsLabel(items: HubItem[], locale: "es" | "en" | "pt" | "fr" | "it"): string {
  const seen = new Set<TypeKey>();
  for (const it of items) if (getAgeGroup(it.product) === "men") seen.add(it.product.typeKey);
  return TYPE_ORDER.filter((t) => seen.has(t))
    .map((t) => typeNames[t][locale].toLowerCase())
    .join(", ");
}

export { LEAGUES };
