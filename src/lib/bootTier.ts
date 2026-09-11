import bootTierData from "@/data/bootTierData.json";

// Clasificación real de gama/calidad por bota (Tier 1+ a Tier 4) más
// ajuste de horma, pedido explícito del usuario a partir de una planilla
// de referencia real (equivalencia de nomenclatura Elite/Pro/League/Club
// por marca -- adidas, Nike, Puma, Mizuno, New Balance, Skechers, Joma,
// Kipsta/Decathlon -- cruzada con guía de hormas por marca). Precalculado
// en scripts/catalog-mining (clasifica por la palabra real de gama en el
// nombre del modelo, ej. "Predator Elite" -> Tier 1, "F50 League" -> Tier
// 3) y guardado en bootTierData.json, mismo patrón que
// productDominantColors.json para no tocar los miles de objetos de
// boots.ts. No cubre el 100% del catálogo -- líneas clásicas/heritage
// (adidas Copa Mundial, Kaiser, Samba; Puma King; Nike Premier; etc.) y
// marcas fuera de la planilla de referencia (Joma con su nomenclatura
// real actual, Under Armour, Hummel, Kappa...) quedan sin clasificar en
// vez de inventar un tier sin base real.
export type BootTier = "1+" | "1" | "2" | "3" | "4";

export const BOOT_TIER_ORDER: BootTier[] = ["1+", "1", "2", "3", "4"];

export const BOOT_TIER_LABEL: Record<BootTier, string> = {
  "1+": "Tier 1+ (Súper Élite)",
  "1": "Tier 1 (Élite)",
  "2": "Tier 2 (Semipro)",
  "3": "Tier 3 (Amateur)",
  "4": "Tier 4 (Iniciación)",
};

const DATA = bootTierData as Record<string, { tier: BootTier; horma: string | null }>;

export function bootTierInfo(bootId: string): { tier: BootTier; horma: string | null } | null {
  return DATA[bootId] ?? null;
}
