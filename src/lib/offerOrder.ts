import { commissionRate } from "@/lib/commissionRates";

// Orden de ofertas de una ficha:
// 1. primero las que envían al país del visitante (las otras van al final);
// 2. luego por precio total en EUR (con envío), el más barato primero;
// 3. solo dentro de un empate de precio (hasta TIE_WINDOW por encima del más
//    barato de ese grupo) gana la de mayor comisión estimada. Nunca sube una
//    oferta por encima de otra que sea más barata fuera de esa ventana.
export const TIE_WINDOW = 0.01;

export function rankOffers<T extends { store: string }>(
  offers: readonly T[],
  totalEUR: (o: T) => number,
  ships: (o: T) => boolean = () => true,
): T[] {
  const byPrice = [...offers].sort(
    (a, b) => Number(ships(b)) - Number(ships(a)) || totalEUR(a) - totalEUR(b),
  );
  const out: T[] = [];
  for (let i = 0; i < byPrice.length; ) {
    const head = byPrice[i];
    const limit = totalEUR(head) * (1 + TIE_WINDOW);
    let j = i + 1;
    while (j < byPrice.length && ships(byPrice[j]) === ships(head) && totalEUR(byPrice[j]) <= limit) j++;
    // sort es estable: a igual comisión se mantiene el orden por precio.
    out.push(...byPrice.slice(i, j).sort((a, b) => commissionRate(b.store) - commissionRate(a.store)));
    i = j;
  }
  return out;
}
