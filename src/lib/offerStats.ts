import { getRetailerFamily } from "./retailerFamily";

export interface MedianSavings {
  /** Cuánto menos que la mediana cuesta la mejor oferta, en EUR. */
  abs: number;
  pct: number;
  /** Cuántas tiendas distintas (familias) entran en la mediana. */
  stores: number;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Ahorro de la mejor oferta frente a la MEDIANA de las tiendas, no frente a
 * la más cara: la más cara suele ser un valor atípico y "ahorrás 40%"
 * contra ella es el número que menos se sostiene. Una tienda con espejos
 * (FootStoreES/FootStoreFR) cuenta una vez, con su precio más bajo. Con
 * menos de 3 tiendas la "mediana" es el punto medio de dos precios y no
 * dice nada: devuelve undefined y la ficha cae al ahorro simple.
 */
export function savingsVsMedian(offers: readonly { store: string; total: number }[]): MedianSavings | undefined {
  const byFamily = new Map<string, number>();
  for (const o of offers) {
    if (!(o.total > 0)) continue;
    const f = getRetailerFamily(o.store);
    byFamily.set(f, Math.min(byFamily.get(f) ?? Infinity, o.total));
  }
  if (byFamily.size < 3) return undefined;
  const totals = [...byFamily.values()];
  const med = median(totals);
  const best = Math.min(...totals);
  const abs = med - best;
  return { abs, pct: Math.round((abs / med) * 100), stores: byFamily.size };
}
