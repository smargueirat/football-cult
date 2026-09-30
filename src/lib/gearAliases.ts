import aliases from "@/data/gearAliases.json";

export type GearSection = "guantes" | "pelotas" | "ropa" | "entrenamiento";

// Ficha de equipamiento fundida con otra (el mismo artículo en otra tienda,
// ver merge_by_ean en scripts/gear-mining/mine_gear.py): id viejo -> id que
// la absorbió. La página redirige en vez de dar 404. Lo mantiene
// refresh_gear.py.
export function gearAlias(section: GearSection, id: string): string | undefined {
  return (aliases as Record<string, Record<string, string>>)[section]?.[id];
}
