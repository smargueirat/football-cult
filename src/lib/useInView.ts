"use client";

import { RefObject, useEffect, useState } from "react";

// Bug real, medido en vivo (no a ojo): en el home, useBestOfferForCountry
// ya evita pedir el envío real de eBay salvo que eBay sea el líder por
// precio estático -- pero incluso así, un catálogo con varias filas de
// tarjetas monta 14+ cards con eBay líder al mismo tiempo (fuera de
// pantalla incluidas, en carruseles horizontales o más abajo del scroll),
// y cada una dispara su propio fetch en vivo a la API de eBay apenas el
// navegador queda idle. Medido con performance.getEntriesByType: 14
// pedidos simultáneos, 947ms-2357ms cada uno -- eso es lo que se sentía
// como "lento, tarda en cargar las cards". Este hook devuelve `true`
// recién cuando el elemento entra de verdad al viewport (con un margen
// para adelantarse un poco al scroll), así el pedido en vivo de cada
// card se reparte en el tiempo en vez de dispararse todos juntos al
// montar. rootMargin generoso porque el dato tarda 1-2s en llegar --
// mejor pedirlo un poco antes de que se vea, no en el instante exacto.
// Recibe un ref YA existente (ProductCard3D ya tiene uno para el efecto
// de inclinación 3D -- reusarlo en vez de crear uno nuevo) en lugar de
// crear/devolver el suyo propio, así una card puede compartir el mismo
// nodo del DOM entre varios hooks sin pisarse.
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = "400px"
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin, ref]);

  return inView;
}
