import { AgeGroup, Brand, TeamKey, TypeKey, products } from "@/data/products";

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
// generarían ruido, mismo criterio que Quick Picks).
export const BRAND_FILTERS: Brand[] = (
  ["adidas", "nike", "puma", "kappa", "hummel", "umbro", "newbalance", "macron"] as Brand[]
).filter((key) => products.some((p) => p.brand === key));

// Selecciones/clubes más buscados: son un atajo, no un listado completo
// (para eso ya está el buscador de texto), así que se mantiene corta a
// propósito en vez de mostrar los ~90 equipos del catálogo.
export const QUICK_PICK_TEAMS: TeamKey[] = (
  [
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
  ] as TeamKey[]
).filter((key) => products.some((p) => p.teamKey === key));
