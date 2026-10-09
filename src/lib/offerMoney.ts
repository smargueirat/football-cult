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
import { previousPriceOf } from "@/lib/priceDrops";

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
  // El euro es la excepción: "€" no es ambiguo, y así /es lee "1.234,56 €".
  return new Intl.NumberFormat(OFFER_CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    currencyDisplay: currency === "EUR" ? "symbol" : "code",
    maximumFractionDigits,
  }).format(amount);
}

// Tasas aproximadas de cada moneda respecto al EUR, usadas ÚNICAMENTE
// para poder comparar/ordenar ofertas de distinta moneda entre sí y para el
// "≈" orientativo de approxPriceLabel (nunca en lugar del precio real).
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

// Equivalente aproximado ("≈ 54 EUR") de un importe en otra moneda, con las
// mismas tasas fijas del orden. Va SIEMPRE junto al precio real de la tienda,
// nunca en su lugar. `to` es la moneda del país del visitante; si no la
// soportamos (CHF, MXN...) se usa EUR. null si ya está en esa moneda.
export function approxPriceLabel(amount: number, from: OfferCurrencyCode, to: string): string | null {
  const target: OfferCurrencyCode = to in OFFER_CURRENCY_TO_EUR ? (to as OfferCurrencyCode) : "EUR";
  if (target === from) return null;
  const value = (amount / OFFER_CURRENCY_TO_EUR[from]) * OFFER_CURRENCY_TO_EUR[target];
  return `≈ ${new Intl.NumberFormat(OFFER_CURRENCY_LOCALE[target], {
    style: "currency",
    currency: target,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function offerTotal(offer: { price: number; shipping: number }): number {
  return offer.price + offer.shipping;
}

// Todas las variantes de eBay (eBay, eBay GB/ES/IT): el envío real depende del
// país del comprador y se consulta en vivo (/api/ebay-shipping).
export function isEbayStore(store: string): boolean {
  return store.startsWith("eBay");
}

// El `shipping` de una oferta es lo que cobra la tienda en SU país (el del
// feed). Al abrir tiendas a otros países, ese número no vale para el resto:
// Futbol Emotion "+0 € envío" a un visitante de Argentina era falso. Aquí,
// por tienda, los países para los que el dato es el coste real; fuera de
// ellos el envío es "a calcular en la tienda" (nunca 0 €/gratis) y no cuenta
// como 0 para elegir la mejor oferta (ver shippingNotMeasured).
//   []    = ningún país: la minería guarda 0 porque la tienda no lo publica
//           (adidas CL, Decathlon IE, Clovis: ver mine_boots.py; Nike/Puma
//           minadas a mano; Como FC lo calcula en el checkout).
//   "all" = vale en todos (FansJerseyHub: "FREE Shipping Worldwide!", 2026-10-09).
// Tienda que no está aquí (y no es eBay): desconocido en todos los países.
export const SHIPPING_KNOWN_FOR: Record<string, readonly string[] | "all"> = {
  FansJerseyHub: "all",
  FootStoreES: ["ES"],
  SportIsGoodES: ["ES"],
  AdidasES: ["ES"],
  "Futbol Emotion": ["ES"],
  FutbolEmotion: ["ES"],
  ForumSport: ["ES"],
  DeporteOutlet: ["ES"],
  "Futbol Factory": ["ES"],
  "Shop Real Betis": ["ES"],
  FootStoreFR: ["FR"],
  SportIsGoodFR: ["FR"],
  PlanetFoot: ["FR"], // "Livraison Gratuite après 30€" (Francia)
  GigasportFR: ["FR"],
  GigasportDE: ["DE"],
  GigasportCH: ["CH"],
  AdidasPT: ["PT"],
  "Pro:Direct Soccer": ["GB"],
  BSTNUK: ["GB"],
  "UK Soccer Shop": ["GB"],
  "Classic Football Shirts": ["GB"],
  // Medido con el estimador de la tienda (productMeta.ts).
  "Pro:Direct ES": ["ES", "IT", "FR", "DE"],
  // reebok.eu: 5,99 EUR / gratis desde 50 en la UE; CZ y CH pagan 9,95, GB en GBP.
  "Reebok DE": ["DE", "AT", "BE", "BG", "DK", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "NL", "NO", "PL", "PT", "RO", "SE", "SK"],
  // El feed IT (EUR) es la tarifa de la UE.
  BSTNIT: ["ES", "FR", "DE", "IT", "PT", "NL", "BE", "AT", "IE", "GR", "FI", "SE", "DK", "PL", "CZ", "HU", "RO", "BG", "HR", "SK", "SI"],
  AdidasCL: [],
  DecathlonIE: [],
  ClovisCalcadosBR: [],
  ComoFCShop: [],
  NikeCL: [],
  NikeAR: [],
  PumaAR: [],
  SantosStore: [],
  InterStore: [],
  CruzeiroStore: [],
  ShopTimao: [],
  LojaPST: [],
};

// Amazon: cada oferta es de un marketplace; su envío vale para ese país.
const AMAZON_TLD: Record<string, string> = { es: "ES", de: "DE", it: "IT", fr: "FR", "co.uk": "GB" };

/** El envío guardado NO es el coste real a `country` (tienda+país sin dato).
 *  eBay queda fuera: su envío se consulta en vivo (ver shippingUnknown). */
export function shippingNotMeasured(offer: { store: string; url?: string }, country: string): boolean {
  if (isEbayStore(offer.store)) return false;
  if (offer.store === "Amazon") {
    const tld = offer.url?.match(/^https:\/\/www\.amazon\.([a-z.]+)\//)?.[1];
    return !tld || AMAZON_TLD[tld] !== country;
  }
  const known = SHIPPING_KNOWN_FOR[offer.store];
  return !known || (known !== "all" && !known.includes(country));
}

// En eBay `shipping: 0` en el catálogo NO significa gratis: la minería guarda
// 0.0 cuando eBay no pudo calcular el envío (ebay_mine_full.py). Es "desconocido"
// hasta que el chequeo en vivo confirme un valor. El resto: ver SHIPPING_KNOWN_FOR.
export function shippingUnknown(offer: { store: string; shipping: number; url?: string }, country: string): boolean {
  return (isEbayStore(offer.store) && offer.shipping === 0) || shippingNotMeasured(offer, country);
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
  offer: { url: string; price: number },
  currentTotal: number
): number {
  return (previousPriceOf(offer) ?? offer.price) + (currentTotal - offer.price);
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

// Football TicketNet UK y US son la MISMA tienda: el precio US es el UK x 1,33
// en 2587 de 2588 partidos (medido 2026-10-02), o sea una oferta en dos
// monedas, no dos tiendas. Una comparación real de entradas necesita al menos
// DOS vendedores distintos (hoy: Football TicketNet y Gigsberg), y eso es lo
// que decide si la UI puede hablar de "mejor precio" o no.
const TICKET_SELLER: Record<string, string> = {
  FootballTicketNetUK: "Football TicketNet",
  FootballTicketNetUS: "Football TicketNet",
  Gigsberg: "Gigsberg",
};
const TICKET_STORE_LABEL: Record<string, string> = {
  FootballTicketNetUK: "Football TicketNet (UK)",
  FootballTicketNetUS: "Football TicketNet (US)",
  Gigsberg: "Gigsberg",
};

export function ticketSeller(store: string): string {
  return TICKET_SELLER[store] ?? store;
}

export function ticketStoreLabel(store: string): string {
  return TICKET_STORE_LABEL[store] ?? store;
}

export function ticketSellers(offers: { store: string }[]): string[] {
  return [...new Set(offers.map((o) => ticketSeller(o.store)))];
}

// Precios "de relleno" de las entradas: Football TicketNet repite el mismo
// importe en decenas de partidos (423,17 GBP en 128 partidos distintos el
// 2026-10-09), es una tarifa de plantilla, no el precio de ese partido. Un
// salto entre dos de esas plantillas no es una bajada. Clave: tienda|precio.
export function ticketTemplatePrices(
  tickets: readonly { offers: readonly { store: string; price: number }[] }[],
  minEvents = 3,
): Set<string> {
  const count = new Map<string, number>();
  for (const t of tickets)
    for (const k of new Set(t.offers.map((o) => `${o.store}|${o.price}`))) count.set(k, (count.get(k) ?? 0) + 1);
  return new Set([...count].filter(([, n]) => n >= minEvents).map(([k]) => k));
}

export function ticketHasRealComparison(offers: { store: string }[]): boolean {
  return ticketSellers(offers).length > 1;
}
