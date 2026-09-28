import gtins from "@/data/offerGtins.json";

// EAN/GTIN real de cada oferta, indexado por su URL.
//
// Vive FUERA de products.ts a propósito: ese archivo está al borde del límite
// de complejidad de tipos de TypeScript y sumarle un campo opcional más a las
// ofertas lo revienta con "Expression produces a union type that is too
// complex to represent" (probado el 2026-09-28). Mismo motivo y mismo patrón
// que las bajadas de precio en priceDrops.ts.
//
// El dato lo genera scripts/catalog-mining/update_gtins.py cruzando las URLs
// del catálogo con la columna de EAN de cada feed. Nunca se deriva ni se
// inventa: si la tienda no lo publica, la oferta simplemente no está acá.
const MAP = gtins as Record<string, string>;

/** El GTIN de esa oferta, o undefined si su tienda no lo publica. */
export function gtinFor(url: string): string | undefined {
  return MAP[url];
}
