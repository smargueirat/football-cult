import type { HubItem } from "@/lib/hubs";
import { isComparableStore } from "@/lib/officialStores";
import { offerTotalInEUR } from "@/lib/offerMoney";
import { seasonSortValue } from "@/lib/productMeta";

import { bestPerRetailer, getRetailerFamily } from "@/lib/retailerFamily";
// Datos para el bloque de preguntas frecuentes de los hubs.
//
// Por qué existe: Search Console dice que 46.770 URLs estan en
// "descubierta: actualmente sin indexar" y 242 fueron rastreadas y
// descartadas -- 9 de los 10 ejemplos son hubs y fichas en idiomas
// distintos del castellano. Lo que Google (y los buscadores de IA) citan
// no es un listado de productos: es una pregunta respondida con un numero
// que cambia. Eso lo tenemos y las tiendas no, porque comparamos 32
// tiendas y ellas venden una.
//
// TODO lo de aca sale del catalogo en vivo. Si un dato no existe, el campo
// viene undefined y la pregunta no se muestra -- nunca se rellena con un
// texto generico, que es justo lo que hace que una pagina sea descartada.
export interface HubFacts {
  count: number;
  stores: number;
  /** La oferta mas barata de todo el hub. */
  cheapest?: { store: string; eur: number; productId: string };
  /** Mayor diferencia real entre minoristas comparables de un mismo producto. */
  spread?: { abs: number; pct: number; cheapStore: string; dearStore: string; productId: string };
  seasons?: { oldest: string; newest: string };
}

export function hubFacts(items: HubItem[]): HubFacts {
  const stores = new Set<string>();
  let cheapest: HubFacts["cheapest"];
  let spread: HubFacts["spread"];
  let oldest: string | undefined;
  let newest: string | undefined;

  for (const it of items) {
    for (const o of it.product.offers) if (o.inStock) stores.add(getRetailerFamily(o.store));

    // El precio del titular se mide SOLO entre minoristas oficiales, por
    // el mismo motivo que el ahorro: la oferta mas barata de Boca es un
    // eBay a 20,32 EUR, y responder "una camiseta de Boca cuesta desde
    // 20,32" con un usado de vendedor desconocido es enganoso. Las ofertas
    // de marketplace se siguen listando en la ficha; lo que no se hace es
    // apoyar una respuesta en ellas.
    for (const o of it.product.offers) {
      if (!o.inStock || !isComparableStore(o.store)) continue;
      const eur = offerTotalInEUR(o);
      if (!cheapest || eur < cheapest.eur) {
        cheapest = { store: o.store, eur, productId: it.product.id };
      }
    }

    const season = it.product.season;
    if (!oldest || seasonSortValue(season) < seasonSortValue(oldest)) oldest = season;
    if (!newest || seasonSortValue(season) > seasonSortValue(newest)) newest = season;

    // El ahorro se mide SOLO entre minoristas oficiales de la misma
    // ficha. Con marketplaces o tiendas de replicas dentro, la ficha llego
    // a anunciar "Ahorras 90,21 EUR (76%)" comparando una replica de 27,77
    // contra una camiseta oficial de 117,98 (ver officialStores.ts). Aca
    // el numero es todavia mas visible, asi que aplica igual.
    // Una cifra por tienda (la más barata): FootStoreES contra su espejo
    // FootStoreFR no es un ahorro entre minoristas.
    const comparable = bestPerRetailer(
      it.product.offers
        .filter((o) => o.inStock && isComparableStore(o.store))
        .map((o) => ({ store: o.store, eur: offerTotalInEUR(o) })),
      (a, b) => a.eur < b.eur,
    ).sort((a, b) => a.eur - b.eur);
    if (comparable.length < 2) continue;
    const lo = comparable[0];
    const hi = comparable[comparable.length - 1];
    const abs = hi.eur - lo.eur;
    // Un euro de diferencia no es una historia: por debajo de eso el
    // titular seria ruido.
    if (abs < 1 || (spread && abs <= spread.abs)) continue;
    spread = {
      abs,
      pct: Math.round((abs / hi.eur) * 100),
      cheapStore: lo.store,
      dearStore: hi.store,
      productId: it.product.id,
    };
  }

  return {
    count: items.length,
    stores: stores.size,
    cheapest,
    spread,
    seasons: oldest && newest && oldest !== newest ? { oldest, newest } : undefined,
  };
}
