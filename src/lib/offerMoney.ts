// Helpers de moneda/precio para ofertas (camisetas y botas), separados
// de src/data/products.ts y src/data/boots.ts a propósito: esos dos
// archivos son el catálogo entero (14000+ productos, varios MB) -- un
// componente "use client" que importa CUALQUIER cosa de esos módulos
// (aunque sea una función de 3 líneas como formatOfferMoney) arrastra
// el array gigante entero al bundle del cliente, porque Turbopack
// bundlea el módulo completo, no solo el símbolo usado (mismo bug ya
// encontrado y arreglado una vez para src/data/countries.ts -- ver
// [[project_performance_fixes_2026_09]] en la memoria del usuario).
// Confirmado en vivo 2026-09-15: la ficha de UNA sola bota cargaba
// ~1.47MB comprimidos (~10MB sin comprimir) de JS -- el catálogo
// entero de camisetas Y botas -- solo porque BootDetailClient.tsx
// importaba bootOfferTotalInEUR desde "@/data/boots" y formatOfferMoney
// desde "@/data/products".
//
// Los tipos de moneda quedan como uniones estructurales locales (no se
// importa Offer/BootOffer desde los archivos grandes) para que este
// archivo no dependa de ellos en ningún sentido.
export type OfferCurrencyCode = "EUR" | "USD" | "GBP" | "BRL" | "CLP" | "ARS";
export type BootCurrencyCode = "EUR" | "USD" | "CLP" | "ARS";

// Formatea un monto en SU propia moneda real (la de la tienda), sin
// convertir a la moneda del país seleccionado. Así el precio mostrado
// siempre coincide con el que la tienda cobra de verdad.
const OFFER_CURRENCY_LOCALE: Record<OfferCurrencyCode, string> = {
  EUR: "de-DE",
  USD: "en-US",
  GBP: "en-GB",
  BRL: "pt-BR",
  CLP: "es-CL",
  ARS: "es-AR",
};

export function formatOfferMoney(amount: number, currency: OfferCurrencyCode): string {
  const maximumFractionDigits = amount >= 100 ? 0 : 2;
  // currencyDisplay: "code" muestra "USD"/"EUR" en vez del símbolo ($/€),
  // porque la tienda de destino puede mostrarle al usuario un precio
  // convertido a SU propia moneda (ej. Shopify detecta la ubicación y
  // muestra euros en vez de dólares), y un símbolo ambiguo hace parecer
  // que el precio no coincide cuando en realidad es el mismo precio real.
  return new Intl.NumberFormat(OFFER_CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits,
  }).format(amount);
}

// Tasas aproximadas de cada moneda respecto al EUR, usadas ÚNICAMENTE
// para poder comparar/ordenar ofertas de distinta moneda entre sí
// (nunca para mostrarle un precio convertido al usuario).
const OFFER_CURRENCY_TO_EUR: Record<OfferCurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  BRL: 6.05,
  CLP: 1076.5,
  ARS: 1754.6,
};

export function offerTotalInEUR(offer: { price: number; shipping: number; currency: OfferCurrencyCode }): number {
  return (offer.price + offer.shipping) / OFFER_CURRENCY_TO_EUR[offer.currency];
}

export function offerTotal(offer: { price: number; shipping: number }): number {
  return offer.price + offer.shipping;
}

const BOOT_CURRENCY_TO_EUR: Record<BootCurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  CLP: 1076.5,
  ARS: 1754.6,
};

export function bootOfferTotalInEUR(offer: { price: number; shipping: number; currency: BootCurrencyCode }): number {
  return (offer.price + offer.shipping) / BOOT_CURRENCY_TO_EUR[offer.currency];
}
