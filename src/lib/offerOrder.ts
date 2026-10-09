import { commissionRate } from "@/lib/commissionRates";

// Orden de ofertas de una ficha:
// 1. primero las que envían al país del visitante (las otras van al final);
// 2. luego las que tienen envío MEDIDO para ese país (`measured`): un envío
//    "a calcular en la tienda" no puede contar como 0 € para ganar;
// 3. luego por precio total en EUR (con envío), el más barato primero;
// 4. solo dentro de un empate de precio (hasta TIE_WINDOW por encima del más
//    barato de ese grupo) gana la de mayor comisión estimada. Nunca sube una
//    oferta por encima de otra que sea más barata fuera de esa ventana.
export const TIE_WINDOW = 0.01;

export function rankOffers<T extends { store: string }>(
  offers: readonly T[],
  totalEUR: (o: T) => number,
  ships: (o: T) => boolean = () => true,
  measured: (o: T) => boolean = () => true,
): T[] {
  const tier = (o: T) => Number(ships(o)) * 2 + Number(measured(o));
  const byPrice = [...offers].sort((a, b) => tier(b) - tier(a) || totalEUR(a) - totalEUR(b));
  const out: T[] = [];
  for (let i = 0; i < byPrice.length; ) {
    const head = byPrice[i];
    const limit = totalEUR(head) * (1 + TIE_WINDOW);
    let j = i + 1;
    while (j < byPrice.length && tier(byPrice[j]) === tier(head) && totalEUR(byPrice[j]) <= limit) j++;
    // sort es estable: a igual comisión se mantiene el orden por precio.
    out.push(...byPrice.slice(i, j).sort((a, b) => commissionRate(b.store) - commissionRate(a.store)));
    i = j;
  }
  return out;
}
