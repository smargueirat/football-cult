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

    // El catálogo monta las ~24 cards de una sola vez (no son lazy como
    // las fotos), así que sin esto todas piden su envío real de eBay en
    // el mismo instante -- una ráfaga de fetches simultáneos compitiendo
    // por ancho de banda justo cuando las fotos también están cargando.
    // requestIdleCallback corre esto recién cuando el navegador ya
    // terminó lo urgente (pintar/cargar lo visible), en vez de a la
    // fuerza en el mismo tick que el mount.
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    const handle = idle(() => {
      if (cancelled) return;
      fetch(`/api/ebay-shipping?url=${encodeURIComponent(offer.url)}&country=${countryCode}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled || !data || data.shipping == null) return;
          const currency = data.currency ?? offer.currency;
          if (currency !== offer.currency) return;
          setLiveTotal(offer.price + data.shipping + (data.importCharges ?? 0));
        })
        .catch(() => {});
    }, { timeout: 2000 });

    return () => {
      cancelled = true;
      cancelIdle(handle as number);
    };
  }, [offer, countryCode]);

  return liveTotal ?? staticTotal;
}
