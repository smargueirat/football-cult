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

// Tiendas que ponen marca de agua en sus fotos. FansJerseyHub estampa
// "Fanjerseyhub" + su logo varias veces sobre la camiseta (visto 2026-10-08
// en manutd-home-202627, que salía así en og:image y Product.image por ser
// la oferta más barata). Es una tienda de réplicas: su foto solo sirve de
// principal si ninguna otra oferta de la ficha trae foto. La detección es
// por tienda y no por dominio: su CDN (cdn.shopify.com) es el mismo que el
// de PlanetFoot, Pro:Direct o el Betis, que no marcan nada.
const WATERMARKED_PHOTO_STORES = new Set(["FansJerseyHub"]);

export function hasWatermarkedPhotos(store: string): boolean {
  return WATERMARKED_PHOTO_STORES.has(store);
}

type PhotoOffer = { store: string; imageUrl?: string; inStock?: boolean };

/** Ofertas con foto, la de `preferred` primero y las de tiendas con marca de agua al final. */
export function photoOrder<T extends PhotoOffer>(preferred: T | undefined, offers: T[]): T[] {
  const pool = [...(preferred ? [preferred] : []), ...offers.filter((o) => o !== preferred && o.inStock !== false),
    ...offers.filter((o) => o !== preferred && o.inStock === false)].filter((o) => o.imageUrl);
  return [...pool.filter((o) => !hasWatermarkedPhotos(o.store)), ...pool.filter((o) => hasWatermarkedPhotos(o.store))];
}

/** Foto principal (tarjeta, ficha, og:image, Product.image): la de la oferta elegida salvo que lleve marca de agua y otra oferta tenga foto limpia. */
export function mainPhoto<T extends PhotoOffer>(preferred: T | undefined, offers: T[]): string | undefined {
  return photoOrder(preferred, offers)[0]?.imageUrl;
}
