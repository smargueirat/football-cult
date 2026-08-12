"use client";

import { useEffect, useState } from "react";
import { Offer, offerTotal } from "@/data/products";

// Misma lógica que ya se usa en la ficha de la camiseta (JerseyDetailClient):
// el envío cargado en el catálogo para ofertas de eBay es un placeholder en
// 0, porque el costo real depende del país del comprador y eBay sólo lo
// calcula bajo pedido. Acá se pide ese dato real para la mejor oferta que
// se muestra en la card del catálogo, para que el precio de ahí y el de la
// ficha coincidan. Si la oferta no es de eBay, o todavía no llegó el dato
// real, o la moneda que devuelve eBay no coincide con la de la oferta (no
// se mezclan monedas en un total), se devuelve el total estático de
// siempre.
export function useLiveOfferTotal(offer: Offer | undefined, countryCode: string): number {
  const [liveTotal, setLiveTotal] = useState<number | null>(null);
  const staticTotal = offer ? offerTotal(offer) : 0;

  useEffect(() => {
    setLiveTotal(null);
    if (!offer || offer.store !== "eBay") return;
    let cancelled = false;
    fetch(`/api/ebay-shipping?url=${encodeURIComponent(offer.url)}&country=${countryCode}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || data.shipping == null) return;
        const currency = data.currency ?? offer.currency;
        if (currency !== offer.currency) return;
        setLiveTotal(offer.price + data.shipping + (data.importCharges ?? 0));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [offer, countryCode]);

  return liveTotal ?? staticTotal;
}
