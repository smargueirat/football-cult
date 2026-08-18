"use client";

import { useEffect, useState } from "react";
import { Offer } from "@/data/products";

interface LiveCosts {
  shipping: number;
  importCharges: number;
  isLive: boolean;
}

// Misma fuente que useLiveOfferTotal (el envío cargado en el catálogo para
// ofertas de eBay es un placeholder en 0, el costo real depende del país
// del comprador), pero acá devolvemos envío e impuestos por separado en vez
// de un total ya sumado -- lo necesita la vista de comparar vendedores,
// que muestra cada línea (precio / impuestos / envío) por separado.
export function useLiveOfferCosts(offer: Offer, countryCode: string): LiveCosts {
  const [live, setLive] = useState<{ shipping: number; importCharges: number } | null>(null);

  useEffect(() => {
    setLive(null);
    if (offer.store !== "eBay") return;
    let cancelled = false;
    fetch(`/api/ebay-shipping?url=${encodeURIComponent(offer.url)}&country=${countryCode}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || data.shipping == null) return;
        const currency = data.currency ?? offer.currency;
        if (currency !== offer.currency) return;
        setLive({ shipping: data.shipping, importCharges: data.importCharges ?? 0 });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [offer, countryCode]);

  if (live) {
    return { shipping: live.shipping, importCharges: live.importCharges, isLive: true };
  }
  return { shipping: offer.shipping, importCharges: 0, isLive: false };
}
