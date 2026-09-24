import { products, teamNames, type TeamKey } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { isVintageRetro } from "@/lib/productMeta";
import type { HubLocale } from "@/data/teamMeta";

// Atajos del buscador del hero, SACADOS DEL CATÁLOGO, no escritos a mano.
//
// Escribirlos a mano ("Real Madrid 2002", "Boca 1998") parece más
// prolijo, pero envejece solo: el scan nocturno cambia el catálogo todas
// las noches y en unas semanas alguno de esos atajos no devuelve nada,
// que es la peor primera impresión posible en un buscador.
//
// Se eligen por volumen real: los equipos con más productos, una época
// retro que de verdad tenga stock y la marca de botas más presente. Todos
// devuelven resultados por construcción.

export interface HeroSuggestion {
  /** Lo que se escribe en el buscador al tocarlo. */
  query: string;
  /** Lo que se muestra. */
  label: string;
}

let cached: Map<HubLocale, HeroSuggestion[]> | null = null;

function topTeams(n: number): TeamKey[] {
  const count = new Map<TeamKey, number>();
  for (const p of products) {
    // Solo cuentan los que comparan: un atajo que lleva a una ficha de
    // una sola tienda no muestra lo que el sitio sabe hacer.
    if (new Set(p.offers.map((o) => o.store)).size < 2) continue;
    count.set(p.teamKey, (count.get(p.teamKey) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
}

function topBootBrand(): string | undefined {
  const count = new Map<string, number>();
  for (const b of bootProducts) {
    if (!b.brand) continue;
    count.set(b.brand, (count.get(b.brand) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

function topRetroSeason(): string | undefined {
  const count = new Map<string, number>();
  for (const p of products) {
    if (!isVintageRetro(p)) continue;
    count.set(p.season, (count.get(p.season) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

export function heroSuggestions(locale: HubLocale): HeroSuggestion[] {
  if (!cached) cached = new Map();
  const hit = cached.get(locale);
  if (hit) return hit;

  const list: HeroSuggestion[] = [];
  for (const team of topTeams(3)) {
    const name = teamNames[team]?.[locale] ?? team;
    list.push({ query: name, label: name });
  }
  const season = topRetroSeason();
  if (season) list.push({ query: season, label: season });
  const brand = topBootBrand();
  if (brand) list.push({ query: brand, label: brand });

  cached.set(locale, list);
  return list;
}
