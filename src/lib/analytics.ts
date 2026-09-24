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
  /** Sin estos tres no se puede saber QUÉ convierte: solo que hubo
   *  clicks. `position` e `isBest` juntos responden la pregunta que
   *  valida el sitio entero -- si la gente hace clic en la más barata. */
  productId?: string;
  position?: number;
  isBest?: boolean;
  version?: "player" | "fan";
}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "click_offer", {
    store: params.store,
    link_url: params.url,
    value: params.price,
    currency: params.currency,
    product_id: params.productId,
    position: params.position,
    is_best: params.isBest,
    jersey_version: params.version,
  });
}

// Los eventos que faltaban para poder responder las preguntas que
// importan. Hasta acá solo existía click_offer y sin el id del producto,
// así que en GA4 se veía "hubo clicks" pero no QUÉ convierte: ni el
// producto, ni si la gente elige la oferta más barata, ni si la versión
// jugador vende. Sin eso no se puede decidir en qué tienda insistir.
export function trackPriceAlertSignup(params: {
  productId: string;
  loggedIn: boolean;
}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "price_alert_signup", {
    product_id: params.productId,
    logged_in: params.loggedIn,
  });
}

export function trackFilterApplied(params: {
  section: string;
  filter: string;
  value: string;
}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "filter_applied", {
    section: params.section,
    filter_name: params.filter,
    filter_value: params.value,
  });
}
