import { products, teamNames, type TeamKey } from "@/data/products";
import type { HubLocale } from "@/data/teamMeta";
import { countDistinctRetailers } from "@/lib/retailerFamily";

// Atajos del buscador del hero: SOLO equipos y selecciones, los más buscados
// en cada idioma (2026-10-17). Antes mezclaba tipos (tres clubes + "2002" +
// "Nike") y eran los mismos en los cinco idiomas; el dueño lo vio
// desordenado.
//
// La lista es a mano (lo que busca la gente de cada idioma) pero se FILTRA
// contra el catálogo: un equipo con menos de MIN_COMPARABLE productos que
// comparen en 2+ tiendas no sale, y se rellena con los de más volumen. Así
// ningún atajo devuelve una lista vacía aunque el scan nocturno cambie el
// catálogo.
const POPULAR: Record<HubLocale, TeamKey[]> = {
  es: ["realmadrid", "barcelona", "atleticomadrid", "espana", "argentina"],
  en: ["manutd", "liverpool", "arsenal", "chelsea", "inglaterra"],
  pt: ["benfica", "porto", "sportingcp", "portugal", "brasil", "realmadrid"],
  fr: ["psg", "marseille", "lyon", "francia", "monaco"],
  it: ["juventus", "intermilan", "acmilan", "roma", "italia"],
};
const MIN_COMPARABLE = 3;
const SHOWN = 5;

export interface HeroSuggestion {
  /** Lo que se escribe en el buscador al tocarlo. */
  query: string;
  /** Lo que se muestra. */
  label: string;
}

let cached: Map<HubLocale, HeroSuggestion[]> | null = null;

function comparableByTeam(): Map<TeamKey, number> {
  const count = new Map<TeamKey, number>();
  for (const p of products) {
    // Solo cuentan los que comparan: un atajo que lleva a una ficha de
    // una sola tienda no muestra lo que el sitio sabe hacer.
    if (countDistinctRetailers(p.offers) < 2) continue;
    count.set(p.teamKey, (count.get(p.teamKey) ?? 0) + 1);
  }
  return count;
}

export function heroSuggestions(locale: HubLocale): HeroSuggestion[] {
  if (!cached) cached = new Map();
  const hit = cached.get(locale);
  if (hit) return hit;

  const count = comparableByTeam();
  const byVolume = [...count.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const teams = [...new Set([...POPULAR[locale], ...byVolume])]
    .filter((k) => (count.get(k) ?? 0) >= MIN_COMPARABLE)
    .slice(0, SHOWN);
  const list = teams.map((team) => {
    const name = teamNames[team]?.[locale] ?? team;
    return { query: name, label: name };
  });

  cached.set(locale, list);
  return list;
}
