import { AgeGroup, Brand, TeamKey, TypeKey, products } from "@/data/products";
import { bootProducts } from "@/data/boots";

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

// Todas las tiendas presentes en el catálogo de camisetas (solo ~29
// valores distintos, a diferencia de marca/equipo no hace falta curar un
// subconjunto). Ya NO incluye tiendas de botas -- pedido explícito del
// usuario: "en el filtro de las botas no me interesa el local", así que
// ese filtro directamente no existe en la sección de botas (ver
// SearchExplorer.tsx/FloatingFilterButton.tsx, effectiveSection ===
// "boots" oculta todo el grupo "Tienda").
export const STORE_FILTERS: string[] = Array.from(
  new Set(products.flatMap((p) => p.offers.map((o) => o.store)))
).sort((a, b) => a.localeCompare(b));

// Talles reales de bota (numeración EU de calzado, ej. "36", "40 2/3")
// presentes en el catálogo -- ordenados numéricamente incluyendo los
// "tercios" reales que usa adidas (36, 36⅔, 37⅓, 38...), no alfabético.
function bootSizeSortKey(s: string): number {
  const m = s.match(/^(\d+(?:\.\d+)?)(?:\s+(\d)\/(\d))?/);
  if (!m) return 0;
  let v = parseFloat(m[1]);
  if (m[2]) v += parseFloat(m[2]) / parseFloat(m[3]);
  return v;
}
export const BOOT_SIZES: string[] = Array.from(
  new Set(bootProducts.flatMap((b) => b.offers.flatMap((o) => o.sizes)))
).sort((a, b) => bootSizeSortKey(a) - bootSizeSortKey(b));

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
