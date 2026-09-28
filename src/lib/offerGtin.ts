import gtins from "@/data/offerGtins.json";
import mpns from "@/data/offerMpns.json";

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

const MPN = mpns as Record<string, string>;

/** Código del fabricante de esa oferta ("KC3993"), o undefined. */
export function mpnFor(url: string): string | undefined {
  return MPN[url];
}

/**
 * El código del fabricante de una FICHA: el que más se repite entre sus
 * ofertas. A diferencia del EAN, no depende de la talla, así que es el
 * identificador correcto para una ficha que agrupa todas las tallas.
 */
export function productMpn(offers: { url: string }[]): string | undefined {
  const count = new Map<string, number>();
  for (const o of offers) {
    const m = MPN[o.url];
    if (m) count.set(m, (count.get(m) ?? 0) + 1);
  }
  let best: string | undefined;
  let n = 0;
  for (const [k, v] of count) if (v > n) [best, n] = [k, v];
  return best;
}
