// Tiendas cuyo precio NO es comparable como "el mismo producto".
//
// Dos motivos distintos, los dos reales:
//  - Marketplaces (eBay, Amazon): el precio depende del vendedor y del
//    estado del artículo, no de la tienda. Un usado a mitad de precio no
//    dice nada sobre lo que cuesta la prenda nueva.
//  - Tiendas de réplicas no licenciadas (FansJerseyHub): directamente no
//    es el mismo producto que una camiseta oficial.
//
// Vivía solo dentro de priceStudy.ts. Se sacó acá el 2026-09-24 cuando el
// cálculo del ahorro de la ficha, recién añadido, empezó a anunciar
// "Ahorrás 90,21 EUR (76%)" comparando FansJerseyHub (27,77 EUR) contra
// FootStoreES (117,98 EUR): exactamente el mismo error de categoría que
// mezclar versión jugador con versión hincha, pero en el titular que más
// se ve. Las ofertas se siguen mostrando todas; lo que no se hace es
// anclar en ellas una promesa de ahorro.
export const NON_COMPARABLE_STORES = new Set([
  "eBay",
  "eBay ES",
  "eBay IT",
  "eBay GB",
  "eBay US",
  "Amazon",
  "FansJerseyHub",
]);

export function isComparableStore(store: string): boolean {
  return !NON_COMPARABLE_STORES.has(store);
}

// Marketplaces: el precio lo pone cada vendedor independiente, no la
// tienda. Se marca en cada oferta con su propia chapa (2026-09-28), igual
// que ya se marcaban las réplicas: un comprador no tiene por qué saber que
// "eBay GB" no es una tienda sino miles de vendedores. FansJerseyHub NO va
// acá -- no es un marketplace sino una tienda de réplicas, y ya tiene su
// propia chapa.
const MARKETPLACE_STORES = new Set(["eBay", "eBay ES", "eBay IT", "eBay US", "eBay GB", "Amazon"]);

export function isMarketplace(store: string): boolean {
  return MARKETPLACE_STORES.has(store);
}
