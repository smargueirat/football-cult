// Único punto de tracking para clicks en "Ver oferta" (el evento que de
// verdad importa: sin esto no hay forma de saber, en GA4, qué páginas/
// tiendas/productos generan clicks reales hacia las tiendas afiliadas --
// confirmado 2026-09-17 que este evento no existía en absoluto (GA4
// mostraba "Eventos clave: 0"). gtag ya se carga condicionalmente en
// layout.tsx vía NEXT_PUBLIC_GA_MEASUREMENT_ID -- esto no rompe nada si
// esa env var no está seteada (ej. en dev), simplemente no manda nada.
export function trackOfferClick(params: {
  store: string;
  url: string;
  price: number;
  currency: string;
}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "click_offer", {
    store: params.store,
    link_url: params.url,
    value: params.price,
    currency: params.currency,
  });
}
