import { isPriceDropped, priceDropPercent } from "@/lib/priceDrops";

// Fichas en baja de las secciones que NO son camisetas.
//
// Hasta el 2026-09-27 /ofertas mostraba solo camisetas, porque el rastreo
// de bajadas tambien cubria solo camisetas. Desde que cubre las siete
// secciones hay 496 fichas en baja y solo 99 son camisetas: la pagina
// estaba dejando afuera 397, entre ellas 33 botas (hasta -55%) y 60
// entradas (hasta -56%), que son justamente las dos secciones que mas
// comision pagan -- una bota deja del orden de cuatro veces lo que deja
// una camiseta de eBay.
//
// Se ordena por descuento, no por lo que nos paga a nosotros: en una
// pagina de ofertas el visitante espera ver primero la rebaja mas grande,
// y reordenarla por comision seria poner un 10% arriba de un 55%.

/** Lo minimo que necesita esta funcion de cualquier seccion. */
interface DroppableProduct {
  offers: { url: string; price: number; inStock?: boolean }[];
}

/**
 * Las fichas de `list` con alguna oferta en stock que bajo de precio,
 * ordenadas de mayor a menor descuento, con el porcentaje ya calculado.
 */
export function sectionDrops<T extends DroppableProduct>(
  list: readonly T[],
  max: number
): (T & { pct: number })[] {
  const out: (T & { pct: number })[] = [];
  for (const item of list) {
    // inStock solo cuenta cuando la seccion lo trae: en varias el feed no
    // da disponibilidad fiable y exigirlo las dejaria fuera enteras.
    const dropped = item.offers.filter((o) => o.inStock !== false && isPriceDropped(o));
    if (!dropped.length) continue;
    const pct = Math.max(...dropped.map(priceDropPercent));
    out.push({ ...item, pct });
  }
  return out.sort((a, b) => b.pct - a.pct).slice(0, max);
}
