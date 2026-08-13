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
// real a tu país, en realidad sale más cara que otra tienda. Acá se pide
// el dato real solo para la oferta de eBay más barata según el
// catálogo (si el producto tuviera más de una -- caso raro de datos
// duplicados en la minería -- alcanza con esa para decidir si eBay le
// gana o le pierde al resto, que ya tiene envío real cargado).
export function useBestOfferForCountry(
  product: Product,
  countryCode: CountryCode
): BestOfferResult {
  const eligible = useMemo(
    () => product.offers.filter((o) => o.inStock && offerShipsTo(o.store, countryCode)),
    [product.offers, countryCode]
  );

  const cheapestEbay = useMemo(() => {
    const ebayOffers = eligible.filter((o) => o.store === "eBay");
    if (ebayOffers.length === 0) return undefined;
    return [...ebayOffers].sort((a, b) => offerTotalInEUR(a) - offerTotalInEUR(b))[0];
  }, [eligible]);

  const liveEbayTotal = useLiveOfferTotal(cheapestEbay, countryCode);

  return useMemo(() => {
    if (eligible.length === 0) return { offer: undefined, total: 0 };

    const comparisonTotalEUR = (o: Offer): number =>
      o === cheapestEbay
        ? offerTotalInEUR({ ...o, price: liveEbayTotal, shipping: 0 })
        : offerTotalInEUR(o);

    let best = eligible[0];
    let bestEUR = comparisonTotalEUR(eligible[0]);
    for (let i = 1; i < eligible.length; i++) {
      const eur = comparisonTotalEUR(eligible[i]);
      if (eur < bestEUR) {
        best = eligible[i];
        bestEUR = eur;
      }
    }
    const total = best === cheapestEbay ? liveEbayTotal : offerTotal(best);
    return { offer: best, total };
  }, [eligible, cheapestEbay, liveEbayTotal]);
}
