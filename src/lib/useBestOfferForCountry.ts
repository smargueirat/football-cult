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
export function useBestOfferForCountry(
  product: Product,
  countryCode: CountryCode
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

  const liveEbayTotal = useLiveOfferTotal(ebayToVerify, countryCode);

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
