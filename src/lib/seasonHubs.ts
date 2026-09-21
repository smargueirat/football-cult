import { teamKeysWithItems, teamItems, type HubItem } from "@/lib/hubs";
import { seasonSortValue, isPriceDropped, priceDropPercent } from "@/lib/productMeta";
import type { TypeKey } from "@/data/products";

// Hubs por temporada (/temporada/2026-27, /temporada/2026-27/home) y de
// ofertas (/ofertas). SOLO servidor.

export const SEASON_TYPES: TypeKey[] = ["home", "away", "third", "goalkeeper"];
const MIN_SEASON_ITEMS = 20;
const MIN_TYPE_ITEMS = 6;
const FIRST_SEASON_YEAR = 2024;

export const seasonSlug = (season: string) => season.replace("/", "-");

let cache: Map<string, HubItem[]> | null = null;
function bySeason(): Map<string, HubItem[]> {
  if (cache) return cache;
  const m = new Map<string, HubItem[]>();
  for (const team of teamKeysWithItems()) {
    for (const it of teamItems(team)) {
      const list = m.get(it.product.season) ?? [];
      list.push(it);
      m.set(it.product.season, list);
    }
  }
  cache = m;
  return m;
}

export function seasonList(): string[] {
  return [...bySeason().entries()]
    .filter(([season, items]) => seasonSortValue(season) >= FIRST_SEASON_YEAR && items.length >= MIN_SEASON_ITEMS)
    .map(([season]) => season)
    .sort((a, b) => seasonSortValue(b) - seasonSortValue(a) || b.localeCompare(a));
}

export function seasonFromSlug(slug: string): string | undefined {
  return seasonList().find((s) => seasonSlug(s) === slug);
}

export const seasonItems = (season: string) => bySeason().get(season) ?? [];

export function seasonTypeItems(season: string, type: TypeKey): HubItem[] {
  return seasonItems(season).filter((i) => i.product.typeKey === type && (i.product.ageGroup ?? "men") === "men");
}

export function seasonTypes(season: string): { type: TypeKey; count: number }[] {
  return SEASON_TYPES.map((type) => ({ type, count: seasonTypeItems(season, type).length })).filter((t) => t.count >= MIN_TYPE_ITEMS);
}

export function seasonTeams(season: string): { team: string; count: number }[] {
  const m = new Map<string, number>();
  for (const it of seasonItems(season)) m.set(it.product.teamKey, (m.get(it.product.teamKey) ?? 0) + 1);
  return [...m.entries()].map(([team, count]) => ({ team, count })).sort((a, b) => b.count - a.count);
}

// Productos con al menos una oferta en stock que bajó de precio desde el
// último snapshot diario (previousPrice > price), con el % de baja.
export function priceDrops(): (HubItem & { pct: number })[] {
  const out: (HubItem & { pct: number })[] = [];
  for (const team of teamKeysWithItems()) {
    for (const it of teamItems(team)) {
      const dropped = it.product.offers.filter((o) => o.inStock && isPriceDropped(o));
      if (!dropped.length) continue;
      const best = dropped.reduce((a, b) => (priceDropPercent(b) > priceDropPercent(a) ? b : a));
      out.push({ ...it, offer: best, pct: priceDropPercent(best) });
    }
  }
  return out.sort((a, b) => b.pct - a.pct);
}
