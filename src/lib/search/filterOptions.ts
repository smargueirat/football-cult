import type { AgeGroup, Brand, TeamKey, TypeKey } from "@/data/products";

// Compartido entre SearchExplorer (panel completo) y FloatingFilterButton
// (panel flotante) -- antes cada uno tenía su propia lista y terminaban
// desincronizadas (el flotante mostraba un subconjunto reducido). Una sola
// fuente de verdad para que ambos ofrezcan siempre los mismos filtros.
export const TYPE_FILTERS: TypeKey[] = [
  "home",
  "away",
  "third",
  "goalkeeper",
  "training",
  "prematch",
  "retro",
];
export const AGE_GROUP_FILTERS: AgeGroup[] = ["men", "women", "kids"];

// Marcas más relevantes del catálogo: un atajo curado, no el listado
// completo de valores de Brand (varios tienen apenas 1-2 productos y solo
// generarían ruido, mismo criterio que Quick Picks). Antes se filtraba
// en vivo contra `products` (¿existe algún producto de esta marca?), pero
// este archivo lo importa TANTO SearchExplorer como FloatingFilterButton
// ("use client"), y ese chequeo arrastraba el catálogo completo
// (5.9MB/76 mil líneas) al segundo, que no lo necesita para nada más --
// mismo bug que src/lib/offerMoney.ts. Las 8 marcas de acá están
// verificadas a mano contra el catálogo actual (2026-09-22, todas con
// productos reales); si alguna deja de tener stock algún día, el peor
// caso es un chip que no devuelve resultados, no un dato incorrecto.
export const BRAND_FILTERS: Brand[] = [
  "adidas",
  "nike",
  "puma",
  "kappa",
  "hummel",
  "umbro",
  "newbalance",
  "macron",
];

// Talles reales de bota (numeración EU de calzado, ej. "36", "40 2/3")
// presentes en el catálogo -- ordenados numéricamente incluyendo los
// "tercios" reales que usa adidas (36, 36⅔, 37⅓, 38...), no alfabético.
// Antes se derivaba en vivo de `bootProducts` (4.7MB/101 mil líneas),
// mismo motivo que BRAND_FILTERS arriba -- lista estática, calculada una
// vez contra el catálogo real (2026-09-22, 4942 botas) y pegada acá,
// mismo criterio que ADULT_SIZES/KIDS_SIZES en productMeta.ts.
export const BOOT_SIZES: string[] = [
  "35", "35 1/2", "35.5", "36", "36.5", "36 2/3", "37", "37 1/3", "37.5",
  "38", "38.5", "38 1/2", "38 2/3", "39", "39 1/3", "39.5", "40", "40.5",
  "40 1/2", "40 2/3", "41", "41 1", "41 1/3", "41.5", "42", "42.5",
  "42 1/2", "42 2/3", "43", "43 1", "43 1/3", "43.5", "44", "44.5",
  "44 1/2", "44 2/3", "45", "45 1", "45 1/3", "45.5", "46", "46.5",
  "46 2/3", "47", "47 1/3", "47.5", "48", "48.5", "48 2/3",
];

// Selecciones/clubes más buscados: son un atajo, no un listado completo
// (para eso ya está el buscador de texto), así que se mantiene corta a
// propósito en vez de mostrar los ~90 equipos del catálogo. Mismo motivo
// que BRAND_FILTERS arriba: sin el chequeo en vivo contra `products`,
// verificado a mano (2026-09-22, los 12 tienen productos reales).
export const QUICK_PICK_TEAMS: TeamKey[] = [
  "argentina",
  "brasil",
  "espana",
  "francia",
  "realmadrid",
  "barcelona",
  "manutd",
  "liverpool",
  "psg",
  "bayern",
  "boca",
  "riverplate",
];
