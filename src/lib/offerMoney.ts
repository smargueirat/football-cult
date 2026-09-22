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
export type BootCurrencyCode = "EUR" | "USD" | "CLP" | "ARS" | "BRL";

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

// Total "anterior" para el par tachado/actual de una tarjeta con badge de
// baja de precio. `currentTotal` puede no ser simplemente price+shipping
// del offer -- para eBay puede ser un total EN VIVO (useLiveOfferTotal)
// que ya suma envío/impuestos reales, distintos del envío placeholder
// guardado en el catálogo. Si el tachado sumara ese envío placeholder en
// vez del mismo componente ya aplicado al actual, el par mostrado
// quedaría en dos bases distintas (uno con envío real, el otro sin) y
// podía verse el precio "actual" MÁS ALTO que el "anterior" aunque el
// precio de la tienda bajó de verdad -- bug real reportado (camiseta con
// badge "Bajó 10%" pero USD 86.99 tachado -> USD 88.28 actual, un alza).
// Invariante: previousOfferTotal y currentTotal siempre comparten la
// misma base de envío/extras, sea cual sea (estática o en vivo).
export function previousOfferTotal(
  offer: { price: number; previousPrice?: number },
  currentTotal: number
): number {
  return (offer.previousPrice ?? offer.price) + (currentTotal - offer.price);
}

const BOOT_CURRENCY_TO_EUR: Record<BootCurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  CLP: 1076.5,
  ARS: 1754.6,
  BRL: 6.05,
};

export function bootOfferTotalInEUR(offer: { price: number; shipping: number; currency: BootCurrencyCode }): number {
  return (offer.price + offer.shipping) / BOOT_CURRENCY_TO_EUR[offer.currency];
}

// Entradas de partidos (tickets.ts): mismo motivo que bootOfferTotalInEUR
// (Pro Soccer en USD) -- acá el mismo evento real vale un precio
// genuinamente distinto en EUR/GBP/USD según la tienda regional, y esto
// es lo único que permite comparar "más barato" entre monedas. Reusa
// OFFER_CURRENCY_TO_EUR (ya tiene EUR/GBP/USD) en vez de una tabla nueva.
export function ticketOfferTotalInEUR(offer: { price: number; currency: OfferCurrencyCode }): number {
  return offer.price / OFFER_CURRENCY_TO_EUR[offer.currency];
}
