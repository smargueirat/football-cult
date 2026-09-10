"use client";

import { useMemo } from "react";
import {
  CountryCode,
  Offer,
  Product,
  offerShipsTo,
  offerTotal,
  offerTotalInEUR,
} from "@/data/products";
import { useLiveOfferTotal } from "./useLiveOfferTotal";

interface BestOfferResult {
  offer: Offer | undefined;
  total: number;
}

// bestOfferForCountry() (products.ts) elige la "mejor oferta" comparando
// el envío que ya está cargado en el catálogo -- para eBay ese número es
// un placeholder/estimación, no lo que el comprador termina pagando
// (ver useLiveOfferTotal). Sin esto, una oferta de eBay puede quedar
// marcada como "mejor precio" en el catálogo cuando, sumado el envío
// real a tu país, en realidad sale más cara que otra tienda.
//
// Importante para performance: el dato real solo se pide cuando eBay YA
// es el líder según el precio estático (placeholder) -- si otra tienda
// ya le gana sin ese chequeo, el envío real de eBay (nunca negativo)
// jamás puede hacerla ganar, así que no hay nada que verificar. Antes se
// pedía el dato en vivo para CUALQUIER producto que tuviera una oferta
// de eBay, sea o no la más barata -- en una grilla de 24 tarjetas eso
// disparaba decenas de pedidos en vivo simultáneos (bug real reportado:
// "está lento, tarda en entrar a la camiseta"), saturando la conexión
// del navegador justo cuando también tiene que cargar la navegación y
// las fotos. Este chequeo reduce los pedidos a solo los productos donde
// el resultado realmente puede cambiar.
//
// Segunda vuelta del mismo problema, medida en vivo (no a ojo) con
// performance.getEntriesByType en el home real: incluso con ese chequeo,
// un home con varias filas de tarjetas todavía monta 14+ cards con eBay
// líder AL MISMO TIEMPO -- carrusel horizontal, la mayoría fuera de
// pantalla -- y cada una dispara su propio pedido en vivo apenas el
// navegador queda idle. 14 pedidos simultáneos, 947ms-2357ms cada uno:
// eso es lo que se sentía como "lento, tarda en cargar las cards". El
// parámetro `inView` (que pasa cada ProductCard/ProductCard3D con
// useInView) reparte esos pedidos en el tiempo: recién se pide cuando la
// card entra de verdad al viewport, no al montar.
export function useBestOfferForCountry(
  product: Product,
  countryCode: CountryCode,
  inView = true
): BestOfferResult {
  const eligible = useMemo(
    () => product.offers.filter((o) => o.inStock && offerShipsTo(o.store, countryCode)),
    [product.offers, countryCode]
  );

  const sortedByStatic = useMemo(
    () => [...eligible].sort((a, b) => offerTotalInEUR(a) - offerTotalInEUR(b)),
    [eligible]
  );
  const staticBest = sortedByStatic[0];
  const ebayToVerify = staticBest?.store === "eBay" ? staticBest : undefined;

  const liveEbayTotal = useLiveOfferTotal(ebayToVerify, countryCode, inView);

  return useMemo(() => {
    if (!staticBest) return { offer: undefined, total: 0 };
    if (!ebayToVerify) return { offer: staticBest, total: offerTotal(staticBest) };

    const liveEbayEUR = offerTotalInEUR({ ...ebayToVerify, price: liveEbayTotal, shipping: 0 });
    const runnerUp = sortedByStatic[1];
    if (runnerUp && offerTotalInEUR(runnerUp) < liveEbayEUR) {
      return { offer: runnerUp, total: offerTotal(runnerUp) };
    }
    return { offer: ebayToVerify, total: liveEbayTotal };
  }, [staticBest, ebayToVerify, liveEbayTotal, sortedByStatic]);
}
