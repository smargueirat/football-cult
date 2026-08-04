import { Locale } from "@/lib/i18n/translations";

export type TeamKey =
  | "argentina"
  | "brasil"
  | "espana"
  | "francia"
  | "alemania"
  | "italia"
  | "inglaterra"
  | "portugal"
  | "uruguay"
  | "colombia"
  | "paisesbajos"
  | "croacia"
  | "realmadrid"
  | "boca"
  | "manutd"
  | "barcelona"
  | "liverpool"
  | "bayern"
  | "psg"
  | "juventus"
  | "riverplate"
  | "chelsea"
  | "independiente"
  | "como";

export type TypeKey = "home" | "away" | "third" | "goalkeeper";
export type CategoryKey = "national" | "club";
export type AgeGroup = "adult" | "kids";
export type Size =
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "5-6"
  | "6-7"
  | "7-8"
  | "8-9"
  | "8-10"
  | "9-10"
  | "10-11"
  | "10-12"
  | "11-12"
  | "12-13"
  | "13-14"
  | "13-15"
  | "14-15"
  | "15-16";

export const ADULT_SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];
// Distintas marcas usan distintas escalas de talles por edad (Nike, adidas,
// Puma no coinciden), así que se muestra el talle real de cada oferta en
// vez de forzarlo a una única escala "canónica".
export const KIDS_SIZES: Size[] = [
  "5-6", "6-7", "7-8", "8-9", "8-10", "9-10", "10-11", "10-12",
  "11-12", "12-13", "13-14", "13-15", "14-15", "15-16",
];
export const SIZES: Size[] = [...ADULT_SIZES, ...KIDS_SIZES];

export function getAgeGroup(product: { ageGroup?: AgeGroup }): AgeGroup {
  return product.ageGroup ?? "adult";
}

export const teamCategory: Record<TeamKey, CategoryKey> = {
  argentina: "national",
  brasil: "national",
  espana: "national",
  francia: "national",
  alemania: "national",
  italia: "national",
  inglaterra: "national",
  portugal: "national",
  uruguay: "national",
  colombia: "national",
  paisesbajos: "national",
  croacia: "national",
  realmadrid: "club",
  boca: "club",
  manutd: "club",
  barcelona: "club",
  liverpool: "club",
  bayern: "club",
  psg: "club",
  juventus: "club",
  riverplate: "club",
  chelsea: "club",
  independiente: "club",
  como: "club",
};

export const teamNames: Record<TeamKey, Record<Locale, string>> = {
  argentina: { es: "Argentina", en: "Argentina", pt: "Argentina" },
  brasil: { es: "Brasil", en: "Brazil", pt: "Brasil" },
  espana: { es: "España", en: "Spain", pt: "Espanha" },
  francia: { es: "Francia", en: "France", pt: "França" },
  alemania: { es: "Alemania", en: "Germany", pt: "Alemanha" },
  italia: { es: "Italia", en: "Italy", pt: "Itália" },
  inglaterra: { es: "Inglaterra", en: "England", pt: "Inglaterra" },
  portugal: { es: "Portugal", en: "Portugal", pt: "Portugal" },
  uruguay: { es: "Uruguay", en: "Uruguay", pt: "Uruguai" },
  colombia: { es: "Colombia", en: "Colombia", pt: "Colômbia" },
  paisesbajos: { es: "Países Bajos", en: "Netherlands", pt: "Países Baixos" },
  croacia: { es: "Croacia", en: "Croatia", pt: "Croácia" },
  realmadrid: { es: "Real Madrid", en: "Real Madrid", pt: "Real Madrid" },
  boca: { es: "Boca Juniors", en: "Boca Juniors", pt: "Boca Juniors" },
  manutd: { es: "Manchester United", en: "Manchester United", pt: "Manchester United" },
  barcelona: { es: "FC Barcelona", en: "FC Barcelona", pt: "FC Barcelona" },
  liverpool: { es: "Liverpool", en: "Liverpool", pt: "Liverpool" },
  bayern: { es: "Bayern Múnich", en: "Bayern Munich", pt: "Bayern de Munique" },
  psg: { es: "Paris Saint-Germain", en: "Paris Saint-Germain", pt: "Paris Saint-Germain" },
  juventus: { es: "Juventus", en: "Juventus", pt: "Juventus" },
  riverplate: { es: "River Plate", en: "River Plate", pt: "River Plate" },
  chelsea: { es: "Chelsea", en: "Chelsea", pt: "Chelsea" },
  independiente: { es: "Independiente", en: "Independiente", pt: "Independiente" },
  como: { es: "Como 1907", en: "Como 1907", pt: "Como 1907" },
};

export const teamFlags: Record<TeamKey, string> = {
  argentina: "🇦🇷",
  brasil: "🇧🇷",
  espana: "🇪🇸",
  francia: "🇫🇷",
  alemania: "🇩🇪",
  italia: "🇮🇹",
  inglaterra: "🏴",
  portugal: "🇵🇹",
  uruguay: "🇺🇾",
  colombia: "🇨🇴",
  paisesbajos: "🇳🇱",
  croacia: "🇭🇷",
  realmadrid: "⚪",
  boca: "💙",
  manutd: "🔴",
  barcelona: "🔵",
  liverpool: "🔴",
  bayern: "🔴",
  psg: "🔵",
  juventus: "⚫",
  riverplate: "⚪",
  chelsea: "🔵",
  independiente: "🔴",
  como: "🔵",
};

// Colores icónicos por equipo, usados en los accesos rápidos y avatares.
export const teamColors: Record<TeamKey, [string, string]> = {
  argentina: ["#75AADB", "#FFFFFF"],
  brasil: ["#FFCC29", "#0F5A2E"],
  espana: ["#C60B1E", "#F5B942"],
  francia: ["#0055A4", "#EF4135"],
  alemania: ["#F5F5F5", "#000000"],
  italia: ["#003D7C", "#FFFFFF"],
  inglaterra: ["#F5F5F5", "#1B3A6B"],
  portugal: ["#A5001E", "#046A38"],
  uruguay: ["#75C6E8", "#000000"],
  colombia: ["#FCD116", "#003893"],
  paisesbajos: ["#FF6600", "#1B3A6B"],
  croacia: ["#ED1C24", "#FFFFFF"],
  realmadrid: ["#FEBE10", "#FFFFFF"],
  boca: ["#1B3A6B", "#FFD400"],
  manutd: ["#DA020E", "#000000"],
  barcelona: ["#004D98", "#A50044"],
  liverpool: ["#C8102E", "#F6EB61"],
  bayern: ["#DC052D", "#FFFFFF"],
  psg: ["#001E62", "#DA291C"],
  juventus: ["#000000", "#FFFFFF"],
  riverplate: ["#F5F5F5", "#E30613"],
  chelsea: ["#034694", "#FFFFFF"],
  independiente: ["#D2001C", "#FFFFFF"],
  como: ["#0F3460", "#FFFFFF"],
};

export type JerseyPattern = "solid" | "stripes" | "band";

export type CountryCode =
  // América
  | "AR"
  | "MX"
  | "BR"
  | "CL"
  | "US"
  | "CA"
  | "CO"
  | "PE"
  | "UY"
  | "PY"
  | "BO"
  | "VE"
  | "EC"
  | "CR"
  | "PA"
  | "GT"
  | "HN"
  | "NI"
  | "DO"
  | "CU"
  // Europa
  | "ES"
  | "GB"
  | "FR"
  | "DE"
  | "IT"
  | "PT"
  | "NL"
  | "BE"
  | "AT"
  | "IE"
  | "GR"
  | "FI"
  | "SE"
  | "NO"
  | "DK"
  | "CH"
  | "PL"
  | "CZ"
  | "HU"
  | "RO"
  | "BG"
  | "HR"
  | "SK"
  | "SI"
  | "UA"
  | "IS"
  // Asia
  | "JP"
  | "CN"
  | "KR"
  | "IN"
  | "ID"
  | "SG"
  | "TH"
  | "MY"
  | "PH"
  | "VN"
  | "AE"
  | "SA"
  | "QA"
  | "IL"
  | "TR"
  | "HK"
  | "TW"
  | "PK"
  // Oceanía
  | "AU"
  | "NZ"
  // África
  | "ZA"
  | "NG"
  | "EG"
  | "MA"
  | "KE"
  | "GH"
  | "TN"
  | "DZ";

export interface Country {
  code: CountryCode;
  name: Record<Locale, string>;
  flag: string;
  // Moneda propia del país (informativa). Los precios que se muestran
  // en el sitio son siempre los reales de cada oferta (ver
  // formatOfferMoney), no una conversión a la moneda de este país.
  currency: string;
}

export const countries: Country[] = [
  // --- América ---
  { code: "AR", name: { es: "Argentina", en: "Argentina", pt: "Argentina" }, flag: "🇦🇷", currency: "ARS" },
  { code: "MX", name: { es: "México", en: "Mexico", pt: "México" }, flag: "🇲🇽", currency: "MXN" },
  { code: "BR", name: { es: "Brasil", en: "Brazil", pt: "Brasil" }, flag: "🇧🇷", currency: "BRL" },
  { code: "CL", name: { es: "Chile", en: "Chile", pt: "Chile" }, flag: "🇨🇱", currency: "CLP" },
  { code: "US", name: { es: "Estados Unidos", en: "United States", pt: "Estados Unidos" }, flag: "🇺🇸", currency: "USD" },
  { code: "CA", name: { es: "Canadá", en: "Canada", pt: "Canadá" }, flag: "🇨🇦", currency: "CAD" },
  { code: "CO", name: { es: "Colombia", en: "Colombia", pt: "Colômbia" }, flag: "🇨🇴", currency: "COP" },
  { code: "PE", name: { es: "Perú", en: "Peru", pt: "Peru" }, flag: "🇵🇪", currency: "PEN" },
  { code: "UY", name: { es: "Uruguay", en: "Uruguay", pt: "Uruguai" }, flag: "🇺🇾", currency: "UYU" },
  { code: "PY", name: { es: "Paraguay", en: "Paraguay", pt: "Paraguai" }, flag: "🇵🇾", currency: "PYG" },
  { code: "BO", name: { es: "Bolivia", en: "Bolivia", pt: "Bolívia" }, flag: "🇧🇴", currency: "BOB" },
  { code: "VE", name: { es: "Venezuela", en: "Venezuela", pt: "Venezuela" }, flag: "🇻🇪", currency: "VES" },
  { code: "EC", name: { es: "Ecuador", en: "Ecuador", pt: "Equador" }, flag: "🇪🇨", currency: "USD" },
  { code: "CR", name: { es: "Costa Rica", en: "Costa Rica", pt: "Costa Rica" }, flag: "🇨🇷", currency: "CRC" },
  { code: "PA", name: { es: "Panamá", en: "Panama", pt: "Panamá" }, flag: "🇵🇦", currency: "USD" },
  { code: "GT", name: { es: "Guatemala", en: "Guatemala", pt: "Guatemala" }, flag: "🇬🇹", currency: "GTQ" },
  { code: "HN", name: { es: "Honduras", en: "Honduras", pt: "Honduras" }, flag: "🇭🇳", currency: "HNL" },
  { code: "NI", name: { es: "Nicaragua", en: "Nicaragua", pt: "Nicarágua" }, flag: "🇳🇮", currency: "NIO" },
  { code: "DO", name: { es: "República Dominicana", en: "Dominican Republic", pt: "República Dominicana" }, flag: "🇩🇴", currency: "DOP" },
  { code: "CU", name: { es: "Cuba", en: "Cuba", pt: "Cuba" }, flag: "🇨🇺", currency: "CUP" },

  // --- Europa ---
  { code: "ES", name: { es: "España", en: "Spain", pt: "Espanha" }, flag: "🇪🇸", currency: "EUR" },
  { code: "GB", name: { es: "Reino Unido", en: "United Kingdom", pt: "Reino Unido" }, flag: "🇬🇧", currency: "GBP" },
  { code: "FR", name: { es: "Francia", en: "France", pt: "França" }, flag: "🇫🇷", currency: "EUR" },
  { code: "DE", name: { es: "Alemania", en: "Germany", pt: "Alemanha" }, flag: "🇩🇪", currency: "EUR" },
  { code: "IT", name: { es: "Italia", en: "Italy", pt: "Itália" }, flag: "🇮🇹", currency: "EUR" },
  { code: "PT", name: { es: "Portugal", en: "Portugal", pt: "Portugal" }, flag: "🇵🇹", currency: "EUR" },
  { code: "NL", name: { es: "Países Bajos", en: "Netherlands", pt: "Países Baixos" }, flag: "🇳🇱", currency: "EUR" },
  { code: "BE", name: { es: "Bélgica", en: "Belgium", pt: "Bélgica" }, flag: "🇧🇪", currency: "EUR" },
  { code: "AT", name: { es: "Austria", en: "Austria", pt: "Áustria" }, flag: "🇦🇹", currency: "EUR" },
  { code: "IE", name: { es: "Irlanda", en: "Ireland", pt: "Irlanda" }, flag: "🇮🇪", currency: "EUR" },
  { code: "GR", name: { es: "Grecia", en: "Greece", pt: "Grécia" }, flag: "🇬🇷", currency: "EUR" },
  { code: "FI", name: { es: "Finlandia", en: "Finland", pt: "Finlândia" }, flag: "🇫🇮", currency: "EUR" },
  { code: "SE", name: { es: "Suecia", en: "Sweden", pt: "Suécia" }, flag: "🇸🇪", currency: "SEK" },
  { code: "NO", name: { es: "Noruega", en: "Norway", pt: "Noruega" }, flag: "🇳🇴", currency: "NOK" },
  { code: "DK", name: { es: "Dinamarca", en: "Denmark", pt: "Dinamarca" }, flag: "🇩🇰", currency: "DKK" },
  { code: "CH", name: { es: "Suiza", en: "Switzerland", pt: "Suíça" }, flag: "🇨🇭", currency: "CHF" },
  { code: "PL", name: { es: "Polonia", en: "Poland", pt: "Polônia" }, flag: "🇵🇱", currency: "PLN" },
  { code: "CZ", name: { es: "República Checa", en: "Czech Republic", pt: "República Tcheca" }, flag: "🇨🇿", currency: "CZK" },
  { code: "HU", name: { es: "Hungría", en: "Hungary", pt: "Hungria" }, flag: "🇭🇺", currency: "HUF" },
  { code: "RO", name: { es: "Rumania", en: "Romania", pt: "Romênia" }, flag: "🇷🇴", currency: "RON" },
  { code: "BG", name: { es: "Bulgaria", en: "Bulgaria", pt: "Bulgária" }, flag: "🇧🇬", currency: "BGN" },
  { code: "HR", name: { es: "Croacia", en: "Croatia", pt: "Croácia" }, flag: "🇭🇷", currency: "EUR" },
  { code: "SK", name: { es: "Eslovaquia", en: "Slovakia", pt: "Eslováquia" }, flag: "🇸🇰", currency: "EUR" },
  { code: "SI", name: { es: "Eslovenia", en: "Slovenia", pt: "Eslovênia" }, flag: "🇸🇮", currency: "EUR" },
  { code: "UA", name: { es: "Ucrania", en: "Ukraine", pt: "Ucrânia" }, flag: "🇺🇦", currency: "UAH" },
  { code: "IS", name: { es: "Islandia", en: "Iceland", pt: "Islândia" }, flag: "🇮🇸", currency: "ISK" },

  // --- Asia ---
  { code: "JP", name: { es: "Japón", en: "Japan", pt: "Japão" }, flag: "🇯🇵", currency: "JPY" },
  { code: "CN", name: { es: "China", en: "China", pt: "China" }, flag: "🇨🇳", currency: "CNY" },
  { code: "KR", name: { es: "Corea del Sur", en: "South Korea", pt: "Coreia do Sul" }, flag: "🇰🇷", currency: "KRW" },
  { code: "IN", name: { es: "India", en: "India", pt: "Índia" }, flag: "🇮🇳", currency: "INR" },
  { code: "ID", name: { es: "Indonesia", en: "Indonesia", pt: "Indonésia" }, flag: "🇮🇩", currency: "IDR" },
  { code: "SG", name: { es: "Singapur", en: "Singapore", pt: "Singapura" }, flag: "🇸🇬", currency: "SGD" },
  { code: "TH", name: { es: "Tailandia", en: "Thailand", pt: "Tailândia" }, flag: "🇹🇭", currency: "THB" },
  { code: "MY", name: { es: "Malasia", en: "Malaysia", pt: "Malásia" }, flag: "🇲🇾", currency: "MYR" },
  { code: "PH", name: { es: "Filipinas", en: "Philippines", pt: "Filipinas" }, flag: "🇵🇭", currency: "PHP" },
  { code: "VN", name: { es: "Vietnam", en: "Vietnam", pt: "Vietnã" }, flag: "🇻🇳", currency: "VND" },
  { code: "AE", name: { es: "Emiratos Árabes Unidos", en: "United Arab Emirates", pt: "Emirados Árabes Unidos" }, flag: "🇦🇪", currency: "AED" },
  { code: "SA", name: { es: "Arabia Saudita", en: "Saudi Arabia", pt: "Arábia Saudita" }, flag: "🇸🇦", currency: "SAR" },
  { code: "QA", name: { es: "Catar", en: "Qatar", pt: "Catar" }, flag: "🇶🇦", currency: "QAR" },
  { code: "IL", name: { es: "Israel", en: "Israel", pt: "Israel" }, flag: "🇮🇱", currency: "ILS" },
  { code: "TR", name: { es: "Turquía", en: "Turkey", pt: "Turquia" }, flag: "🇹🇷", currency: "TRY" },
  { code: "HK", name: { es: "Hong Kong", en: "Hong Kong", pt: "Hong Kong" }, flag: "🇭🇰", currency: "HKD" },
  { code: "TW", name: { es: "Taiwán", en: "Taiwan", pt: "Taiwan" }, flag: "🇹🇼", currency: "TWD" },
  { code: "PK", name: { es: "Pakistán", en: "Pakistan", pt: "Paquistão" }, flag: "🇵🇰", currency: "PKR" },

  // --- Oceanía ---
  { code: "AU", name: { es: "Australia", en: "Australia", pt: "Austrália" }, flag: "🇦🇺", currency: "AUD" },
  { code: "NZ", name: { es: "Nueva Zelanda", en: "New Zealand", pt: "Nova Zelândia" }, flag: "🇳🇿", currency: "NZD" },

  // --- África ---
  { code: "ZA", name: { es: "Sudáfrica", en: "South Africa", pt: "África do Sul" }, flag: "🇿🇦", currency: "ZAR" },
  { code: "NG", name: { es: "Nigeria", en: "Nigeria", pt: "Nigéria" }, flag: "🇳🇬", currency: "NGN" },
  { code: "EG", name: { es: "Egipto", en: "Egypt", pt: "Egito" }, flag: "🇪🇬", currency: "EGP" },
  { code: "MA", name: { es: "Marruecos", en: "Morocco", pt: "Marrocos" }, flag: "🇲🇦", currency: "MAD" },
  { code: "KE", name: { es: "Kenia", en: "Kenya", pt: "Quênia" }, flag: "🇰🇪", currency: "KES" },
  { code: "GH", name: { es: "Ghana", en: "Ghana", pt: "Gana" }, flag: "🇬🇭", currency: "GHS" },
  { code: "TN", name: { es: "Túnez", en: "Tunisia", pt: "Tunísia" }, flag: "🇹🇳", currency: "TND" },
  { code: "DZ", name: { es: "Argelia", en: "Algeria", pt: "Argélia" }, flag: "🇩🇿", currency: "DZD" },
];

export function findCountry(code: CountryCode): Country {
  return countries.find((c) => c.code === code) ?? countries[0];
}

// Formatea un monto en SU propia moneda real (la de la tienda), sin
// convertir a la moneda del país seleccionado. Así el precio mostrado
// siempre coincide con el que la tienda cobra de verdad.
const OFFER_CURRENCY_LOCALE: Record<Offer["currency"], string> = {
  EUR: "de-DE",
  USD: "en-US",
};

export function formatOfferMoney(amount: number, currency: Offer["currency"]): string {
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

// Tasa aproximada de cada moneda de oferta respecto al EUR, usada
// ÚNICAMENTE para poder comparar/ordenar ofertas de distinta moneda
// entre sí (nunca para mostrarle un precio convertido al usuario).
const OFFER_CURRENCY_TO_EUR: Record<Offer["currency"], number> = {
  EUR: 1,
  USD: 1.08,
};

export function offerTotalInEUR(offer: Offer): number {
  return (offer.price + offer.shipping) / OFFER_CURRENCY_TO_EUR[offer.currency];
}

// A qué países envía cada tienda. "all" = envío global.
// El feed de producto (Awin) no trae este dato (columnas "shipping" y
// "ships_from_country" vacías para las dos tiendas), así que se verificó
// a mano en la política de envío publicada por cada tienda:
// - FansJerseyHub: "FREE Shipping Worldwide" (fansjerseyhub1.com/policies/shipping-policy)
// - PlanetFoot: tiene tarifa específica para "Reste du monde" / resto del
//   mundo, además de sus zonas de Europa (planetfoot.com/policies/shipping-policy)
// Un store que no está en este mapa cae al default "envía a todos lados"
// en offerShipsTo, así que agregarlas acá es solo para dejar documentado
// que es un hecho verificado y no una suposición.
export const storeShipping: Record<string, CountryCode[] | "all"> = {
  FansJerseyHub: "all",
  PlanetFoot: "all",
  // Verificado a mano en el selector de país de la propia tienda
  // (shop.comofootball.com/policies/shipping-policy): a diferencia de
  // FansJerseyHub/PlanetFoot, esta tienda NO envía a todos lados. El
  // selector solo ofrece esta lista fija de países (no incluye África
  // ni la mayoría de Latinoamérica, por ejemplo).
  ComoFCShop: [
    "AT", "BE", "BG", "CZ", "HR", "DK", "FI", "FR", "DE", "GR", "IE", "IT",
    "NO", "NL", "PL", "PT", "GB", "RO", "SK", "SI", "ES", "SE", "CH", "UA", "HU",
    "CN", "KR", "JP", "IN", "ID", "MY", "HK", "SG", "TR",
    "AU", "NZ",
    "AR", "BR", "CA", "CL", "MX", "US",
  ],
  // Verificado en foot-store.es/tarifas-y-opciones-de-envio (tabla real de
  // tarifas por país). Cubre prácticamente toda Europa + Turquía + EE.UU.
  // continental, pero no Norteamérica/Latam/Asia/África/Oceanía.
  FootStoreES: [
    "DE", "AT", "BG", "BE", "HR", "DK", "SK", "SI", "ES", "US", "FR", "GR",
    "HU", "IE", "IS", "IT", "NL", "PL", "PT", "GB", "CZ", "RO", "SE", "CH", "TR",
  ],
  // Mismo grupo/red logística que FootStoreES (foot-store.fr/tarifs-et-options-de-livraison
  // lista exactamente los mismos países y tarifas).
  FootStoreFR: [
    "DE", "AT", "BG", "BE", "HR", "DK", "SK", "SI", "ES", "US", "FR", "GR",
    "HU", "IE", "IS", "IT", "NL", "PL", "PT", "GB", "CZ", "RO", "SE", "CH", "TR",
  ],
  // Mismo grupo/red logística (sportisgood.es/tarifas-y-opciones-de-envio
  // lista los mismos países y tarifas que FootStoreES/FR).
  SportIsGoodES: [
    "DE", "AT", "BG", "BE", "HR", "DK", "SK", "SI", "ES", "US", "FR", "GR",
    "HU", "IE", "IS", "IT", "NL", "PL", "PT", "GB", "CZ", "RO", "SE", "CH", "TR",
  ],
  SportIsGoodFR: [
    "DE", "AT", "BG", "BE", "HR", "DK", "SK", "SI", "ES", "US", "FR", "GR",
    "HU", "IE", "IS", "IT", "NL", "PL", "PT", "GB", "CZ", "RO", "SE", "CH", "TR",
  ],
};

export function offerShipsTo(store: string, country: CountryCode): boolean {
  const shipping = storeShipping[store];
  if (!shipping) return true;
  return shipping === "all" || shipping.includes(country);
}

export const typeNames: Record<TypeKey, Record<Locale, string>> = {
  home: { es: "Titular", en: "Home", pt: "Titular" },
  away: { es: "Suplente", en: "Away", pt: "Reserva" },
  third: { es: "Tercera", en: "Third", pt: "Terceira" },
  goalkeeper: { es: "Arquero", en: "Goalkeeper", pt: "Goleiro" },
};

export interface Offer {
  store: string;
  price: number;
  shipping: number;
  currency: "EUR" | "USD";
  url: string;
  inStock: boolean;
  sizes: Size[];
  // Foto real del producto provista por la tienda en su feed de Awin.
  // Ausente para ofertas de ejemplo (placeholder).
  imageUrl?: string;
  // Nombre real del producto tal como aparece en la página de esa tienda
  // (nunca inventado). Ausente = todavía no se cargó.
  title?: string;
}

export interface Product {
  id: string;
  teamKey: TeamKey;
  season: string;
  typeKey: TypeKey;
  colorHex: string;
  colorHexSecondary: string;
  jerseyPattern: JerseyPattern;
  offers: Offer[];
  // Ausente = "adult" (así no hay que tocar los productos ya existentes).
  ageGroup?: AgeGroup;
}

// NOTA: datos de ejemplo (placeholder) para poder mostrar la interfaz
// mientras se gestionan las afiliaciones reales (Awin, CJ, Rakuten, etc).
// Una vez aprobadas, este archivo se reemplaza por datos que vienen
// de los feeds de producto de cada red. Los nombres de tienda son
// ficticios a propósito.
// Catálogo con ofertas reales de los programas de afiliados ya aprobados en Awin
// (FansJerseyHub, PlanetFoot) para las camisetas que matchean nuestros equipos
// curados. Donde todavía no hay una tienda aprobada que venda esa camiseta,
// se mantienen datos de ejemplo (placeholder) hasta conseguir esa afiliación.
// Nota: "shipping" real no viene en el feed usado (Google Shopping format),
// se asume 0 hasta tener ese dato. FansJerseyHub reporta "out_of_stock" para
// TODO su catálogo en el feed (bug de su lado) por lo que inStock se fuerza
// a true para esa tienda; PlanetFoot sí usa su disponibilidad real.
export const products: Product[] = [
{
    id: "arg-home-2026",
    teamKey: "argentina",
    season: "2026",
    typeKey: "home",
    colorHex: "#75AADB",
    colorHexSecondary: "#F4F7FA",
    jerseyPattern: "stripes",
    offers: [
      { store: "FansJerseyHub", price: 43.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fargentina-home-soccer-jersey-kit-2026-world-cup%3Fvariant%3D42724229021801", title: "Argentina Home Soccer Jersey Kit 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/ArgentinaHomeWorldCupJerseysKit2026_1.png?v=1764764397" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831938&a=3013769&m=65912", title: "Camiseta Local Argentina Coupe du Monde 2026", inStock: true, sizes: ["M", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm8396_4_apparel_on_model_standard_view_white.webp&feedId=89032&k=a4b8fa91b7231e735c623310893c709382a2bbad" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932798&a=3013769&m=65906", title: "Camiseta Local Argentina Coupe du Monde 2026", inStock: true, sizes: ["XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm8396_4_apparel_on_model_standard_view_white.webp&feedId=89044&k=a4b8fa91b7231e735c623310893c709382a2bbad" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094299504&a=3013769&m=77008", title: "Camiseta primera equipación Argentina 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F841749a208934f2ab4a0cfa1a8ae237d_9366%2FCamiseta_primera_equipacion_Argentina_26_Blanco_JM8396_21_model.jpg&feedId=92152&k=a338c7e80a6aefec58ce63631c6945faaea0b545" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096967179&a=3013769&m=77026", title: "Camisola Principal 26 da Argentina", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F841749a208934f2ab4a0cfa1a8ae237d_9366%2FCamisola_Principal_26_da_Argentina_Branco_JM8396_21_model.jpg&feedId=92150&k=9eed40cd2ecd528e3ed1bd8ff0c51de38b0c4198" },
    ],
  },
{
    id: "arg-away-2026",
    teamKey: "argentina",
    season: "2026",
    typeKey: "away",
    colorHex: "#1A1A2E",
    colorHexSecondary: "#75AADB",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 42.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fl-martinez-22-argentina-away-soccer-jersey-2026-world-cup%3Fvariant%3D47752567292009", title: "L.Martinez #22 Argentina Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/argentinaawayfan_222026_1.webp?v=1783224447" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265206984&a=3013769&m=77008", title: "Camiseta segunda equipación Argentina 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F8379c4f319d34f948399a95e6f4b28ac_9366%2FCamiseta_segunda_equipacion_Argentina_26_Negro_JM8395_21_model.jpg&feedId=92152&k=40b92245b9cceb5fddba33f29e9fa302c14b2ad4" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43692242689&a=3013769&m=77026", title: "Camisola Alternativa 26 da Argentina", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fe1aababf51c948d68cdf4491cc33acba_9366%2FCamisola_Alternativa_26_da_Argentina_Azul_KF0321_HM1.jpg&feedId=92150&k=21ce26e766700c99e6179587121adb55e9e29557" },
    ],
  },
{
    id: "bra-home-2026",
    teamKey: "brasil",
    season: "2026",
    typeKey: "home",
    colorHex: "#FFCC29",
    colorHexSecondary: "#0F5A2E",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-home-soccer-jersey-2026-world-cup%3Fvariant%3D42706934857833", title: "Brazil Home Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/BrazilHomeSoccerJersey2026WorldCup_2.webp?v=1778049344" },
      { store: "FootStoreES", price: 86.71, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44374081627&a=3013769&m=65912", title: "Maillot Domicile Brasil Coupe du monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_if7054-724_01.webp&feedId=89032&k=72daf3c8a34828a58f79061845a8e0bfeb776364" },
    ],
  },
{
    id: "esp-home-2026",
    teamKey: "espana",
    season: "2026",
    typeKey: "home",
    colorHex: "#C60B1E",
    colorHexSecondary: "#F5B942",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 54.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000086793%3Fvariant%3D53957404787029", title: "Spain 26 Home Kids Fan Jersey FEF JZ5755", inStock: true, sizes: ["M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8679-1.jpg?v=1779201425" },
      { store: "FansJerseyHub", price: 46.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Folmo-10-spain-home-winner-jersey-2026-world-cup%3Fvariant%3D47816162508905", title: "OLMO #10 Spain Home Winner Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/spainhome2starsfan_102026_2.webp?v=1784553357" },
      { store: "FootStoreES", price: 110.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831917&a=3013769&m=65912", title: "Camiseta local de manga larga España Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz5786_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=c0d2d1b4e5d6cb247c9816817d418187725468f6" },
      { store: "FootStoreFR", price: 100.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn4390-maillot-domicile-espagne-coupe-du-monde-2026-vivred", title: "Maillot Domicile Espagne Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jn4390_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 110.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932743&a=3013769&m=65906", title: "Camiseta local de manga larga España Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz5786_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=c0d2d1b4e5d6cb247c9816817d418187725468f6" },
      { store: "SportIsGoodFR", price: 100.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjn4390-maillot-domicile-espagne-coupe-du-monde-2026-vivred", title: "Maillot Domicile Espagne Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jn4390_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094299250&a=3013769&m=77008", title: "Camiseta primera equipación España 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F866664f412bb4443bca790fed9c9f0a3_9366%2FCamiseta_primera_equipacion_Espana_26_Rojo_JN4390_21_model.jpg&feedId=92152&k=3147fbc911758b33b863018c56285f93ba4baca0" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096966931&a=3013769&m=77026", title: "Camisola Principal 26 da Espanha", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F866664f412bb4443bca790fed9c9f0a3_9366%2FCamisola_Principal_26_da_Espanha_Vermelho_JN4390_21_model.jpg&feedId=92150&k=62e9e3c30e8bcdcb3ade8efee634bb03d13b28fe" },
    ],
  },
{
    id: "fra-home-2026",
    teamKey: "francia",
    season: "2026",
    typeKey: "home",
    colorHex: "#0055A4",
    colorHexSecondary: "#E8EDF5",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 24.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-france-dkali-adulte-2025-26-bleu%3Fvariant%3D50991716663637", title: "Maillot France Dkali Adulte 2025/26 Bleu", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/Maillot-France-Dkali-Adulte-2025_26-Bleu2.webp?v=1752613610" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634036969577", title: "France Home Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/France_Home_Jersey_World_Cup_2026_2.webp?v=1766144118" },
      { store: "FootStoreES", price: 86.71, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44992302561&a=3013769&m=65912", title: "Camiseta Local Francia Coupe du monde 2026", inStock: true, sizes: ["S", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5300-480_01.webp&feedId=89032&k=29768505a38d91ac3ab2fa3e2f164bb1ae8d9a1c" },
      { store: "FootStoreFR", price: 85.72, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5300-480-maillot-domicile-france-coupe-du-monde-2026-game-royal-metallic-copper", title: "Maillot Domicile France Coupe du Monde 2026", inStock: true, sizes: ["S", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5300-480_01.webp" },
      { store: "SportIsGoodES", price: 67.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43574015741&a=3013769&m=65906", title: "Camiseta Local Francia 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_12_adidas_kf1712_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=9a9425f3ee590c3d0e42a6ae50a407326e681e29" },
      { store: "SportIsGoodFR", price: 66.56, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkf1712-maillot-domicile-france-2025-26-semid-lucid-blue", title: "Maillot Domicile France 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_12_adidas_kf1712_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570682104&a=3013769&m=77008", title: "Camiseta primera equipación Francia", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7a998a6cdd5e4b91a6c834352367cb84_9366%2FCamiseta_primera_equipacion_Francia_Azul_JM6958_21_model.jpg&feedId=92152&k=96fd22295283f412b714c6c0899721d54339a9c0" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570678463&a=3013769&m=77026", title: "Camisola Principal da França", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7a998a6cdd5e4b91a6c834352367cb84_9366%2FCamisola_Principal_da_Franca_Azul_JM6958_21_model.jpg&feedId=92150&k=801684a1cc61304cee4e15bb5ecd26817862a6f7" },
    ],
  },
{
    id: "rma-home-2025",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#8FB8E8",
    jerseyPattern: "solid",
    offers: [
      { store: "DeporteOutletES", price: 37.99, shipping: 8.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44919264258&a=3013769&m=19598", title: "Real Madrid C.F. adidas primera equipación AUTHENTIC Hombre Camiseta IX8095", inStock: true, sizes: ["S", "M"], imageUrl: "https://www.sportspar.de/media/image/29/34/fc/IX8095-1_600x600.jpg" },
      { store: "FootStoreES", price: 63.36, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41646236240&a=3013769&m=65912", title: "Camiseta Local Real Madrid 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8884_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=4be16423ba80eb06a0d89667afc592329abcf6d4" },
      { store: "FootStoreFR", price: 61.93, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjj1931-maillot-domicile-real-madrid-2025-26-white", title: "Maillot Domicile Real Madrid 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jj1931_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 63.09, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845393&a=3013769&m=65906", title: "Camiseta Local Real Madrid 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8884_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=4be16423ba80eb06a0d89667afc592329abcf6d4" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41530602511&a=3013769&m=77008", title: "Camiseta primera equipación Real Madrid 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F0b3e6a5ef6cf471db6b0e17f0c22cc5c_9366%2FCamiseta_primera_equipacion_Real_Madrid_25-26_Blanco_JN8869_21_model.jpg&feedId=92152&k=2ca473787bb5b8b35a3fad1a6ac9e165e51d2e7e" },
    ],
  },
{
    id: "boca-home-2025",
    teamKey: "boca",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#1B3A6B",
    colorHexSecondary: "#F5C742",
    jerseyPattern: "band",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-home-soccer-jersey-2025-26%3Fvariant%3D42557169860713", title: "Boca Juniors Home Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/86c6d74da59cbd7b06e351d6fda018dc.png?v=1758073956" },
    ],
  },
{
    // Producto de estilo "terrace" (casual, no es la réplica de partido
    // oficial), listado aparte de boca-home-2025 a propósito para no
    // repetir el mismo problema de mezclar dos diseños distintos como si
    // fueran ofertas del mismo producto.
    id: "boca-terrace-icon-2025",
    teamKey: "boca",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#1B3A6B",
    colorHexSecondary: "#F5C742",
    jerseyPattern: "band",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-terrace-icon-jersey-2025-26%3Fvariant%3D42660270604393", title: "Boca Juniors Terrace Icon Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Boca_Juniors_Icon_Jersey_202526.png?v=1762224920" },
    ],
  },
{
    id: "manutd-home-2025",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#DA020E",
    colorHexSecondary: "#F5D142",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 89.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-domicile-homme-rouge%3Fvariant%3D49228463079765", title: "Maillot Manchester United Domicile Homme Rouge", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/IU1397_b2b012_plp.webp?v=1722949779" },
      { store: "FootStoreFR", price: 58.61, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fji7428-maillot-domicile-manchester-united-2025-26-mufred", title: "Maillot Domicile Manchester United 2025/26", inStock: true, sizes: ["M"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_ji7428_1_apparel_photography_front_center_view_white.jpg" },
      { store: "SportIsGoodFR", price: 59.95, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fji7428-maillot-domicile-manchester-united-2025-26-mufred", title: "Maillot Domicile Manchester United 2025/26", inStock: true, sizes: ["M"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_ji7428_1_apparel_photography_front_center_view_white.jpg" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41581831846&a=3013769&m=77008", title: "Camiseta primera equipación Manchester United 25/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9ae59d2a8c6249c9a3b1fefc31a9d595_9366%2FCamiseta_primera_equipacion_Manchester_United_25-26_Rojo_JI7428_21_model.jpg&feedId=92152&k=f644496248d2c1861b200bde48a29fdbec89637b" },
      { store: "FansJerseyHub", price: 40.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcunha-10-manchester-united-home-soccer-jersey-2025-26%3Fvariant%3D42861871792233", title: "Cunha #10 Manchester United Home Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Cunha10ManchesterUnitedHomeJersey202526.webp?v=1769590620" },
    ],
  },
{
    id: "ale-home-2026",
    teamKey: "alemania",
    season: "2026",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 59.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000087110%3Fvariant%3D53957425398101", title: "Germany 26 Home Fan Jersey DFB JZ4556", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8711-1.jpg?v=1779201517" },
      { store: "FootStoreES", price: 66.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831994&a=3013769&m=65912", title: "Camiseta local de manga larga Alemania Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm1380_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=1a9f3bc0e70afe7c2f888b91700182a560e0a9c5" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd8363-maillot-domicile-allemagne-coupe-du-monde-2026-white", title: "Maillot Domicile Allemagne Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_kd8363_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 66.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932843&a=3013769&m=65906", title: "Camiseta local de manga larga Alemania Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm1380_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=1a9f3bc0e70afe7c2f888b91700182a560e0a9c5" },
      { store: "SportIsGoodFR", price: 66.1, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd8363-maillot-domicile-allemagne-coupe-du-monde-2026-white", title: "Maillot Domicile Allemagne Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_kd8363_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094300482&a=3013769&m=77008", title: "Camiseta primera equipación Alemania 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fad8d788b983145b9913d29c68367ecd6_9366%2FCamiseta_primera_equipacion_Alemania_26_Blanco_KD8363_21_model.jpg&feedId=92152&k=1193b6882b1631f4c4f794a0dd29ac312720f6e8" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096966058&a=3013769&m=77026", title: "Camisola Principal 26 da Alemanha", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fad8d788b983145b9913d29c68367ecd6_9366%2FCamisola_Principal_26_da_Alemanha_Branco_KD8363_21_model.jpg&feedId=92150&k=e41795945f0b568908bcb62ce17594875b4c174a" },
      { store: "FansJerseyHub", price: 41.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fgermany-home-soccer-jersey-kit-2026-world-cup%3Fvariant%3D42748815573097", title: "Germany Home Soccer Jersey Kit 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Germany_Home_Jersey_Kit_World_Cup_2026_1.webp?v=1765780768" },
    ],
  },
{
    id: "ita-home-2026",
    teamKey: "italia",
    season: "2026",
    typeKey: "home",
    colorHex: "#003D7C",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fitaly-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634053812329", title: "Italy Home Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Italy_Home_Jersey_World_Cup_2026_2.webp?v=1765781283" },
      { store: "FootStoreES", price: 90.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831506&a=3013769&m=65912", title: "Camiseta Local Auténtica Italia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6934_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=479064e2772ed5d7f282bddb21cfcae15e800534" },
      { store: "FootStoreFR", price: 45.64, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjy5633-maillot-domicile-italie-2026-white", title: "Maillot Domicile Italie 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jy5633_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 90.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301927913&a=3013769&m=65906", title: "Camiseta Local Auténtica Italia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6934_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=479064e2772ed5d7f282bddb21cfcae15e800534" },
      { store: "SportIsGoodFR", price: 47.09, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjy5633-maillot-domicile-italie-2026-white", title: "Maillot Domicile Italie 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jy5633_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094295102&a=3013769&m=77008", title: "Camiseta primera equipación Italia 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9716cb1d4ca14ca8a3ee4af6a3e2c31f_9366%2FCamiseta_primera_equipacion_Italia_26_Azul_JY7586_21_model.jpg&feedId=92152&k=c90c1da5c2652fadfa28bad5f4448c941d356d88" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096965381&a=3013769&m=77026", title: "Camisola Principal 26 da Itália", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9716cb1d4ca14ca8a3ee4af6a3e2c31f_9366%2FCamisola_Principal_26_da_Italia_Azul_JY7586_21_model.jpg&feedId=92150&k=0946f5470c32292679753de0c7f6d65ed2941ed7" },
    ],
  },
{
    id: "ing-home-2026",
    teamKey: "inglaterra",
    season: "2026",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#1B3A6B",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-2026-world-cup-home-football-jersey%3Fvariant%3D42742727901289", title: "England 2026 World Cup Home Football Jersey", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/englandhome2026_2.webp?v=1776585726" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44374081613&a=3013769&m=65912", title: "Camiseta Local Inglaterra Coupe du monde 2026", inStock: true, sizes: ["S", "M", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5290-100_01.webp&feedId=89032&k=5bdb8ae4497cc5f7f438c91d9e656c4d86364915" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5290-100-maillot-domicile-angleterre-coupe-du-monde-2026-white-speed-red-obsidian-obsidian", title: "Maillot Domicile Angleterre Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5290-100_01.webp" },
    ],
  },
{
    id: "por-home-2026",
    teamKey: "portugal",
    season: "2026",
    typeKey: "home",
    colorHex: "#A5001E",
    colorHexSecondary: "#046A38",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 44.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Ft-shirt-portugal-pumatech-homme-bleu-seafoam-coupe-du-monde%3Fvariant%3D53556155842901", title: "T-shirt avec Poche Portugal PumaTech Homme 2026 Bleu - Coupe du Monde", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/t-shirt-portugal-pumatech-homme-coupe-du-monde-bleu-seafoam2.webp?v=1776701516" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fportugal-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634047193193", title: "Portugal Home Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Portugal_Home_Jersey_2026_2_ed666cd9-f9bb-4c0e-9d7b-f92dcbd5bba2.jpg?v=1764817208" },
      { store: "FootStoreES", price: 82.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43429697292&a=3013769&m=65912", title: "Camiseta local de manga larga Portugal Coupe du Monde 2026", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783279-01-club-red-green-lagoon-1.webp&feedId=89032&k=f1cee1fc4b6a6df89fa403cdaa4b04326a064609" },
      { store: "SportIsGoodES", price: 82.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43430682902&a=3013769&m=65906", title: "Camiseta local de manga larga Portugal Coupe du Monde 2026", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783279-01-club-red-green-lagoon-1.webp&feedId=89044&k=f1cee1fc4b6a6df89fa403cdaa4b04326a064609" },
    ],
  },
{
    id: "uru-home-2026",
    teamKey: "uruguay",
    season: "2026",
    typeKey: "home",
    colorHex: "#75C6E8",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Furuguay-home-football-jersey-world-cup-2026%3Fvariant%3D42735948333161", title: "Uruguay Home Football Jersey World Cup 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Uruguay_Home_Football_Jersey_World_Cup_2026_1.webp?v=1777537855" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926288&a=3013769&m=65912", title: "Camiseta Local Uruguay Coupe du monde 2026", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io4680-425-royal-tint-obsidian-69ca9a902cd7b-1.webp&feedId=89032&k=4780a54f0874bb05eb7125178c79fd8c99232289" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio4680-425-maillot-domicile-uruguay-coupe-du-monde-2026-royal-tint-obsidian", title: "Maillot Domicile Uruguay Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io4680-425-royal-tint-obsidian-69ca9a902cd7b-1.webp" },
    ],
  },
{
    id: "col-home-2026",
    teamKey: "colombia",
    season: "2026",
    typeKey: "home",
    colorHex: "#FCD116",
    colorHexSecondary: "#003893",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcolombia-home-soccer-jersey-2026-world-cup%3Fvariant%3D42632125710441", title: "Colombia Home Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/colombia_home_2026.png?v=1762398867" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43125141962&a=3013769&m=65912", title: "Camiseta Local Colombia Coupe du Monde 2026", inStock: true, sizes: ["S", "L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6972_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=929a0badd905569e5c89c9b31015f256e9e743a1" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45376303136&a=3013769&m=65906", title: "Camiseta Local Colombia Coupe du Monde 2026", inStock: true, sizes: ["L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6972_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=929a0badd905569e5c89c9b31015f256e9e743a1" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094291634&a=3013769&m=77008", title: "Camiseta primera equipación Colombia 26", inStock: true, sizes: ["S", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcb30bb7e33dc49afa7d3dcb0da3bdb4a_9366%2FCamiseta_primera_equipacion_Colombia_26_Amarillo_JL6972_21_model.jpg&feedId=92152&k=ec65beae90739d63406c225a25400a5552fe3754" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096963439&a=3013769&m=77026", title: "Camisola Principal 26 da Colômbia", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcb30bb7e33dc49afa7d3dcb0da3bdb4a_9366%2FCamisola_Principal_26_da_Colombia_Amarelo_JL6972_21_model.jpg&feedId=92150&k=accea9c86e1686b70ea41c12d78fde41644fbd13" },
    ],
  },
{
    id: "ned-home-2026",
    teamKey: "paisesbajos",
    season: "2026",
    typeKey: "home",
    colorHex: "#FF6600",
    colorHexSecondary: "#1B3A6B",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fnetherlands-2026-world-cup-home-football-jersey%3Fvariant%3D42961846534249", title: "Netherlands 2026 World Cup Home Football Jersey", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/NetherlandsHomeStadiumShirt2026_2.avif?v=1774490642" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926283&a=3013769&m=65912", title: "Camiseta Local Países Bajos Coupe du monde 2026", inStock: true, sizes: ["S", "M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5334-809_04.webp&feedId=89032&k=32c5cb1d07f1c1b97cc66447d87ece67823e2909" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5334-809-maillot-domicile-pays-bas-coupe-du-monde-2026-hyper-crimson-black", title: "Maillot Domicile Pays-Bas Coupe du Monde 2026", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5334-809_04.webp" },
    ],
  },
{
    id: "cro-home-2026",
    teamKey: "croacia",
    season: "2026",
    typeKey: "home",
    colorHex: "#ED1C24",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "stripes",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcroatia-2026-world-cup-home-football-jersey%3Fvariant%3D42736040444009", title: "Croatia 2026 World Cup Home Football Jersey", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/6_90b404c6-206f-45b9-b7eb-1fcc8b9abca3.webp?v=1776237973" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973668&a=3013769&m=65912", title: "Maillot Domicile Croacia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8621-100-white-69ef67d574381-1.webp&feedId=89032&k=6fd1cb77c13c139317a6e4347de387bedd35d559" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio8621-100-maillot-domicile-croatie-coupe-du-monde-2026-white", title: "Maillot Domicile Croatie Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8621-100-white-69ef67d574381-1.webp" },
      { store: "SportIsGoodES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335325&a=3013769&m=65906", title: "Maillot Domicile Croacia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8621-100-white-69ef67d574381-1.webp&feedId=89044&k=6fd1cb77c13c139317a6e4347de387bedd35d559" },
      { store: "SportIsGoodFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fio8621-100-maillot-domicile-croatie-coupe-du-monde-2026-white", title: "Maillot Domicile Croatie Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8621-100-white-69ef67d574381-1.webp" },
    ],
  },
{
    id: "bar-home-2025",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#004D98",
    colorHexSecondary: "#A50044",
    jerseyPattern: "stripes",
    offers: [
      { store: "PlanetFoot", price: 39.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-fc-barcelone-connect-blaugrana-navy-2026%3Fvariant%3D53802756211029", title: "Maillot FC Barcelone Connect 2026 - Blaugrana / Navy", inStock: true, sizes: ["S", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-football-fc-barcelone-connect-blaugrana-navy-20264.jpg?v=1778253327" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-home-soccer-jersey-2025-26%3Fvariant%3D42557200629865", title: "Barcelona Home Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Barcelona_Home_Soccer_Jersey_2025_26_Barcelona_Home_Soccer_Jersey_2025_26-1.png?v=1760082704" },
      { store: "FootStoreES", price: 73.1, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44291084666&a=3013769&m=65912", title: "Camiseta Local FC Barcelona 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hj4590-456-phsfh001.webp&feedId=89032&k=97609522fc0d8f0c9d0156cefc15a48558a6c170" },
    ],
  },
{
    id: "bar-away-2025",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#0F5A2E",
    colorHexSecondary: "#F5C742",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-third-away-soccer-jersey-2025-26%3Fvariant%3D42557191585897", title: "Barcelona Third Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/barcelona_third_away_jersey_2025_1.png?v=1759219885" },
    ],
  },
{
    id: "liv-home-2025",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#C8102E",
    colorHexSecondary: "#F6EB61",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000090240%3Fvariant%3D54365471441237", title: "Liverpool FC 26/27 Home Jersey LFC KA6852", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_9024-1.jpg?v=1783947765" },
      { store: "FootStoreES", price: 62.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42095532069&a=3013769&m=65912", title: "Camiseta Local Liverpool FC 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6423_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=c05489700eddd294fc6885fcfd7d7c0cb0e2a575" },
      { store: "FootStoreFR", price: 61.07, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv6423-maillot-domicile-liverpool-fc-2025-26-strred", title: "Maillot Domicile Liverpool FC 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv6423_1_apparel_photography_front_center_view_white.jpg" },
      { store: "SportIsGoodES", price: 62.2, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845380&a=3013769&m=65906", title: "Camiseta Local Liverpool FC 2025/26", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6423_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=c05489700eddd294fc6885fcfd7d7c0cb0e2a575" },
      { store: "SportIsGoodFR", price: 62.45, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv6423-maillot-domicile-liverpool-fc-2025-26-strred", title: "Maillot Domicile Liverpool FC 2025/26", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv6423_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972277543&a=3013769&m=77008", title: "Camiseta Liverpool FC 25/26 Home", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F2e9b3d1665f944f09c921c0174b355bf_9366%2FCamiseta_Liverpool_FC_25-26_Home_Rojo_JV6423_21_model.jpg&feedId=92152&k=9a85f4b95dcbb9dae26332c2df6913bfa03f1e33" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972279593&a=3013769&m=77026", title: "Camisola Principal 25/26 do Liverpool FC", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F2e9b3d1665f944f09c921c0174b355bf_9366%2FCamisola_Principal_25-26_do_Liverpool_FC_Vermelho_JV6423_21_model.jpg&feedId=92150&k=d5bd5b8ce3f6be2203ce980140e2032d130609c9" },
    ],
  },
{
    id: "bay-home-2025",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#DC052D",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41666325423&a=3013769&m=65912", title: "Camiseta Local Bayern Múnich 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj2137_0.webp&feedId=89032&k=3ebf6034a9eec25021e177a7c87578fc4174e582" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjj2137-maillot-domicile-bayern-munich-2025-26-red", title: "Maillot Domicile Bayern Munich 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_adidas_jj2137_0.jpg" },
      { store: "SportIsGoodES", price: 63.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301834694&a=3013769&m=65906", title: "Camiseta Local Bayern Múnich 2025/26", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj2137_0.webp&feedId=89044&k=3ebf6034a9eec25021e177a7c87578fc4174e582" },
      { store: "SportIsGoodFR", price: 64.23, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjj2137-maillot-domicile-bayern-munich-2025-26-red", title: "Maillot Domicile Bayern Munich 2025/26", inStock: true, sizes: ["L"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_adidas_jj2137_0.jpg" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41562954582&a=3013769&m=77008", title: "Camiseta primera equipación Bayern 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F637467085ad14aad8cb0acf249276c31_9366%2FCamiseta_primera_equipacion_Bayern_25-26_Rojo_JJ2137_21_model.jpg&feedId=92152&k=ff7faf51f2729fd462f7dfafff56a61345fc92fb" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41562962668&a=3013769&m=77026", title: "Camisola Principal 25/26 do FC Bayern München", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F637467085ad14aad8cb0acf249276c31_9366%2FCamisola_Principal_25-26_do_FC_Bayern_Munchen_Vermelho_JJ2137_21_model.jpg&feedId=92150&k=ef296570761f4bbe69e4caef77e758a94b224042" },
    ],
  },
{
    id: "psg-home-2025",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#001E62",
    colorHexSecondary: "#DA291C",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 24.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-paris-saint-germain-fan-adulte-2025-26-bleu%3Fvariant%3D51402024649045", title: "Maillot Paris Saint-Germain Fan Adulte 2025/26 Bleu", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-psg-fan-2025-26-bleu-adulte-planetfoot1.jpg?v=1758377994" },
      { store: "FootStoreES", price: 109.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44783130096&a=3013769&m=65912", title: "Camiseta Local PSG 2026/27", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ii1885-417_01.webp&feedId=89032&k=44e8a96c6fed9924a4ddd08aabd82f166cc7f203" },
    ],
  },
{
    id: "juv-home-2025",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#000000",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "stripes",
    offers: [
      { store: "PlanetFoot", price: 59.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-homme-2025-26-blanc%3Fvariant%3D50897551950165", title: "Maillot Juventus Turin Domicile Homme 2025/26 Blanc", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/Maillot-Juventus-Turin-Domicile-homme-2025_26-Blanc1.webp?v=1749412808" },
      { store: "FootStoreES", price: 58.37, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41446542641&a=3013769&m=65912", title: "Camiseta Local Juventus de Turín 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jj4320_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=2001bf1a1b3858c7d860f1ca8ec36793dcce2c85" },
      { store: "FootStoreFR", price: 57.08, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjj4320-maillot-domicile-juventus-turin-2025-26-white-black", title: "Maillot Domicile Juventus Turin 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jj4320_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 58.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301836082&a=3013769&m=65906", title: "Camiseta Local Juventus de Turín 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jj4320_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=2001bf1a1b3858c7d860f1ca8ec36793dcce2c85" },
      { store: "SportIsGoodFR", price: 58.38, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjj4320-maillot-domicile-juventus-turin-2025-26-white-black", title: "Maillot Domicile Juventus Turin 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jj4320_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41299301716&a=3013769&m=77008", title: "Camiseta primera equipación Juventus 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ffe0a2e213d8d4ce2accb8324679b8e5a_9366%2FCamiseta_primera_equipacion_Juventus_25-26_Blanco_JJ4320_21_model.jpg&feedId=92152&k=50933479dcddaa1674736281986926603961b0c8" },
    ],
  },
{
    id: "juv-away-2025",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 69.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000091377%3Fvariant%3D54464904102229", title: "Juventus 26/27 Away Pre-Match Jersey KG4514", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_9137-1.jpg?v=1785005278" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41701521183&a=3013769&m=65912", title: "Camiseta de visitante Juventus de Turín 2025/26", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jj4323_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=a9102f210281a6fb0f0cbbf8ddbd74471bf2a949" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41590987988&a=3013769&m=77008", title: "Camiseta segunda equipación Juventus 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F8c6cd78831754419beba203bacb3d1f2_9366%2FCamiseta_segunda_equipacion_Juventus_25-26_Azul_JJ4323_21_model.jpg&feedId=92152&k=290f465711cbc768a25fc0307cc596106de0a24b" },
    ],
  },
{
    id: "riv-home-2025",
    teamKey: "riverplate",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#E30613",
    jerseyPattern: "band",
    offers: [
      { store: "PlanetFoot", price: 60.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-river-plate-domicile-homme-2025-26-blanc%3Fvariant%3D51421275455829", title: "Maillot River Plate Domicile Homme 2025/26 Blanc", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-river-plate-25-26-domicile-adulte-adidas-planetfoot1.webp?v=1758730642" },
    ],
  },
{
    id: "che-home-2025",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#034694",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-home-soccer-jersey-2025-26-blue%3Fvariant%3D42557244145769", title: "Chelsea Home Soccer Jersey 2025/26 Blue", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Chelsea_Home_Soccer_Jersey_2025_26_Blue1.png?v=1760182866" },
      { store: "FootStoreES", price: 73.1, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41368868581&a=3013769&m=65912", title: "Camiseta Local Chelsea 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_nike_hj4589-496_1.webp&feedId=89032&k=9f5b680c799085eb4705cf60f7ea408d6ac737df" },
      { store: "FootStoreFR", price: 71.65, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhj4589-496-maillot-domicile-chelsea-2025-26-rush-blue-white-speed-red-white", title: "Maillot Domicile Chelsea 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_nike_hj4589-496_1.webp" },
    ],
  },
{
    id: "ind-home-2025",
    teamKey: "independiente",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#D2001C",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    // Todavía sin tienda afiliada aprobada que venda esta camiseta.
    offers: [],
  },
{
    id: "ale-away-2026",
    teamKey: "alemania",
    season: "2026",
    typeKey: "away",
    colorHex: "#000000",
    colorHexSecondary: "#F5F5F5",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 40.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fwirtz-17-germany-away-soccer-jersey-2026%3Fvariant%3D43061751218281", title: "Wirtz #17 Germany Away Soccer Jersey 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Wirtz_17GermanyAwayJerseyWorldCup2026_2.webp?v=1774494062" },
      { store: "FootStoreES", price: 66.16, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890852&a=3013769&m=65912", title: "Camiseta de visitante Alemania Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn2074_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=59b81a2f0c43c9df878660b1234b1cbc760c15c6" },
      { store: "SportIsGoodES", price: 67.85, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365711&a=3013769&m=65906", title: "Camiseta de visitante Alemania Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn2074_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=59b81a2f0c43c9df878660b1234b1cbc760c15c6" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265204653&a=3013769&m=77008", title: "Camiseta segunda equipación Alemania 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fa3eb6fcc22434146abe924050e0a91ad_9366%2FCamiseta_segunda_equipacion_Alemania_26_Azul_JN2074_21_model.jpg&feedId=92152&k=11a8a240e4958def20c236f9fa1de72176fccaf6" },
      { store: "AdidasPT", price: 70.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44267895747&a=3013769&m=77026", title: "Camisola Alternativa 26 da Alemanha", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fb77fff63a8db4413b9422887ffa0ccfe_9366%2FCamisola_Alternativa_26_da_Alemanha_Azul_JZ4568_21_model.jpg&feedId=92150&k=ffef37a4ba5614a195f88ea48a0e7009400ff4e2" },
    ],
  },
{
    id: "ale-goalkeeper-2026",
    teamKey: "alemania",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fgermany-goalkeeper-soccer-jersey-2026-world-cup%3Fvariant%3D42791058800745", title: "Germany Goalkeeper Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/germany_goalkeeper_jersey_2026_1.webp?v=1767519814" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43852271896&a=3013769&m=65912", title: "Maillot de portero local Alemania Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_kd5121_0.webp&feedId=89032&k=c8180c6dfb54ccd6de948da373dc4b84b4aced7a" },
      { store: "FootStoreFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd5121-maillot-de-gardien-domicile-allemagne-coupe-du-monde-2026-actgrn", title: "Maillot de gardien Domicile Allemagne Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_kd5121_0.webp" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44487548744&a=3013769&m=65906", title: "Maillot de portero local Alemania Coupe du Monde 2026", inStock: true, sizes: ["M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_kd5121_0.webp&feedId=89044&k=c8180c6dfb54ccd6de948da373dc4b84b4aced7a" },
      { store: "SportIsGoodFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd5121-maillot-de-gardien-domicile-allemagne-coupe-du-monde-2026-actgrn", title: "Maillot de gardien Domicile Allemagne Coupe du Monde 2026", inStock: true, sizes: ["M"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_kd5121_0.webp" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094289571&a=3013769&m=77008", title: "Camiseta de portero primera equipación Alemania 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7549fd098cf04f7cad8a2af08f2bad9e_9366%2FCamiseta_de_portero_primera_equipacion_Alemania_26_Verde_KD5121_21_model.jpg&feedId=92152&k=772fb18e9c429ed564771e02b20d723037ccc0cb" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096958515&a=3013769&m=77026", title: "Camisola Principal de Guarda-redes 26 da Alemanha", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7549fd098cf04f7cad8a2af08f2bad9e_9366%2FCamisola_Principal_de_Guarda-redes_26_da_Alemanha_Verde_KD5121_21_model.jpg&feedId=92150&k=0d0e04d57e6b3107cdf6e32e3b7a25a4ac335965" },
    ],
  },
{
    id: "bar-third-202526",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#004D98",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-third-away-soccer-jersey-2025-26%3Fvariant%3D42557191553129", title: "Barcelona Third Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/barcelona_third_away_jersey_2025_1.png?v=1759219885" },
      { store: "FootStoreES", price: 73.1, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42177817663&a=3013769&m=65912", title: "Camiseta Third FC Barcelona 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hm3201-855-phsfh001-ss25.webp&feedId=89032&k=74179f0a31d5c307468729e4432203e324bd1a31" },
    ],
  },
{
    id: "bay-away-202526",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#DC052D",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45443802616&a=3013769&m=65912", title: "Camiseta de visitante del Bayern Múnich 2026/27", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fj%2Fz%2Fjz3069.webp&feedId=89032&k=21d8dc2f5262c10d6cce2e46f167f935cd4e3b6a" },
      { store: "SportIsGoodES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45443710850&a=3013769&m=65906", title: "Camiseta de visitante del Bayern Múnich 2026/27", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fj%2Fz%2Fjz3069.webp&feedId=89044&k=21d8dc2f5262c10d6cce2e46f167f935cd4e3b6a" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41205144020&a=3013769&m=77008", title: "Camiseta segunda equipación FC Bayern 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F1e69f796f20e4af288539ad0fdab5eb4_9366%2FCamiseta_segunda_equipacion_FC_Bayern_25-26_Blanco_JJ2143_21_model.jpg&feedId=92152&k=a2623107242a7aa442ce4556355a5fc67083ae97" },
    ],
  },
{
    id: "bay-third-202526",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#DC052D",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 74.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-homme-2025-26-noir%3Fvariant%3D51353837535573", title: "Maillot Bayern Munich Third Homme 2025/26 Noir", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-fc-bayern-munich-25-26-adulte-adidas-planetfoot1.webp?v=1756563493" },
      { store: "FootStoreFR", price: 64.65, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fke6801-maillot-third-bayern-munich-2025-26-black-halivo", title: "Maillot Third Bayern Munich 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_ke6801_3_apparel_on_model_standard_view_white.webp" },
      { store: "SportIsGoodFR", price: 66.1, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fke6801-maillot-third-bayern-munich-2025-26-black-halivo", title: "Maillot Third Bayern Munich 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_ke6801_3_apparel_on_model_standard_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41981562750&a=3013769&m=77008", title: "Camiseta tercera equipación FC Bayern 25/26", inStock: true, sizes: ["S", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F49bc73dfd3614dd8bbb60cee4331e882_9366%2FCamiseta_tercera_equipacion_FC_Bayern_25-26_Negro_KE6801_21_model.jpg&feedId=92152&k=272658667bf0d750fd2984be47794350a48b4439" },
      { store: "AdidasPT", price: 105.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41981561190&a=3013769&m=77026", title: "Camisola do Terceiro Equipamento 25/26 do FC Bayern München", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9b87e68616064dac999e972239f2aca5_9366%2FCamisola_do_Terceiro_Equipamento_25-26_do_FC_Bayern_Munchen_Preto_KE6802_HM1.jpg&feedId=92150&k=d8fe6c86db23304c5f0d289c99bd9481b711bc86" },
    ],
  },
{
    id: "bay-goalkeeper-202526",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 64.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-gardien-homme-2025-26-rouge%3Fvariant%3D51325544235349", title: "Maillot Bayern Munich Third Gardien Homme 2025/26 Rouge", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-gardien-bayern-munich-25-26-adulte-adidas-planetfoot1.webp?v=1756559240" },
      { store: "FootStoreES", price: 94.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43724611538&a=3013769&m=65912", title: "Camiseta Bayern de Múnich Gardien 2025/26", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8517_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=871a5ac7476e2975296900b46fb052c581f324f7" },
      { store: "FootStoreFR", price: 83.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn8517-maillot-bayern-munich-gardien-2025-26-purrub", title: "Maillot Bayern Munich Gardien 2025/26", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn8517_1_apparel_photography_front_center_view_white.jpg" },
      { store: "AdidasES", price: 120.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=37867477771&a=3013769&m=77008", title: "Camiseta portero FC Bayern Icon", inStock: true, sizes: ["M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcc919d29365847b98019af5e00fcbdff_9366%2FCamiseta_portero_FC_Bayern_Icon_Negro_HT8835_21_model.jpg&feedId=92152&k=ddfd563aaa0ad9780a666187112cfdfa8e0b5173" },
      { store: "AdidasPT", price: 48.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=37867478580&a=3013769&m=77026", title: "Camisola de Guarda-redes Icon do FC Bayern München", inStock: true, sizes: ["M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcc919d29365847b98019af5e00fcbdff_9366%2FCamisola_de_Guarda-redes_Icon_do_FC_Bayern_Munchen_Preto_HT8835_21_model.jpg&feedId=92150&k=4e70c139d38cb71e60baaba787168211feeadf7a" },
    ],
  },
{
    id: "boca-away-202526",
    teamKey: "boca",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFD400",
    colorHexSecondary: "#1B3A6B",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-away-soccer-jersey-2025-26%3Fvariant%3D42557168484457", title: "Boca Juniors Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/441c3efad7fae985971a17f4b80580ea.png?v=1758073946" },
    ],
  },
{
    id: "bra-away-2026",
    teamKey: "brasil",
    season: "2026",
    typeKey: "away",
    colorHex: "#0F5A2E",
    colorHexSecondary: "#FFCC29",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-away-soccer-jersey-2026-world-cup%3Fvariant%3D42710746726505", title: "Brazil Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Brazil_Away_Jersey_World_Cup_2026_2.webp?v=1765245417" },
    ],
  },
{
    id: "bra-third-2026",
    teamKey: "brasil",
    season: "2026",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#FFCC29",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-player-version-third-away-soccer-jersey-2026-world-cup%3Fvariant%3D42707026968681", title: "Brazil Player Version Third Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Brazil_Player_Version_Third_Away_Soccer_Jersey_2026_World_Cup_11.jpg?v=1764055948" },
    ],
  },
{
    id: "bra-goalkeeper-2026",
    teamKey: "brasil",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-goalkeeper-soccer-jersey-world-cup-2026%3Fvariant%3D43162048430185", title: "Brazil Goalkeeper Soccer Jersey World Cup 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/BrazilGoalkeeperJerseyWorldCup2026_3.webp?v=1777278166" },
      { store: "FootStoreES", price: 69.05, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44645300845&a=3013769&m=65912", title: "Maillot Gardien Brasil Jordan Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_if3900-741_04.webp&feedId=89032&k=5e22c0d7ecbdfc4c32ca88061dd64a04e65d23e5" },
    ],
  },
{
    id: "che-away-202526",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#034694",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-away-soccer-jersey-2025-26-white%3Fvariant%3D42557257777257", title: "Chelsea Away Soccer Jersey 2025/26 White", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/eac3b5b68e76822f38daba2e8cea8fd7_32facad5-ad21-46d4-abe3-d2e581bec0c5.png?v=1758074597" },
    ],
  },
{
    id: "che-third-202526",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#034694",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-third-away-soccer-jersey-2025-26%3Fvariant%3D42591174819945", title: "Chelsea Third Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/ChelseaThirdAwaySoccerJersey2025_26_1.png?v=1759221142" },
      { store: "FootStoreES", price: 71.21, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44645292560&a=3013769&m=65912", title: "Maillot Tercero Chelsea 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_09_nike_hm3202-011_0.webp&feedId=89032&k=84ade01617c17927a67a8848fa10bdaf414696f6" },
      { store: "FootStoreFR", price: 69.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhm3202-011-maillot-third-chelsea-2025-26-black-field-silver-field-silver", title: "Maillot Third Chelsea 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_09_nike_hm3202-011_0.jpg" },
    ],
  },
{
    id: "col-away-2026",
    teamKey: "colombia",
    season: "2026",
    typeKey: "away",
    colorHex: "#003893",
    colorHexSecondary: "#FCD116",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 40.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fmunoz-2-colombia-away-soccer-jersey-2026-world-cup%3Fvariant%3D47714319728745", title: "Muñoz #2 Colombia Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/colombiaawayfan_2-2.webp?v=1782184765" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269891004&a=3013769&m=65912", title: "Maillot Exterior Colombia Coupe du Monde 2026", inStock: true, sizes: ["M", "L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jl6974_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=2ca24e4d72ae29c539156487bda6ac9fc9ba59a7" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365794&a=3013769&m=65906", title: "Maillot Exterior Colombia Coupe du Monde 2026", inStock: true, sizes: ["M", "L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jl6974_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=2ca24e4d72ae29c539156487bda6ac9fc9ba59a7" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265204499&a=3013769&m=77008", title: "Camiseta segunda equipación Colombia 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F70f4bc91f935442e8cac80543f1bb140_9366%2FCamiseta_segunda_equipacion_Colombia_26_Azul_JL6974_21_model.jpg&feedId=92152&k=47cf1abba6f138bb9d4c45a15369035ebf94e6be" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44267895140&a=3013769&m=77026", title: "Camisola Alternativa 26 da Colômbia", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F70f4bc91f935442e8cac80543f1bb140_9366%2FCamisola_Alternativa_26_da_Colombia_Azul_JL6974_21_model.jpg&feedId=92150&k=4380d48d4f2255c00194e08d250f68197f02646b" },
    ],
  },
{
    id: "cro-away-2026",
    teamKey: "croacia",
    season: "2026",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#ED1C24",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcroatia-2026-world-cup-away-football-jersey%3Fvariant%3D42973970006121", title: "Croatia 2026 World Cup Away Football Jersey", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/8_e70d7e54-97a0-4b83-b7f0-76b72de86e24.webp?v=1774316659" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973697&a=3013769&m=65912", title: "Maillot Exterior Croacia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8619-455-deep-royal-blue-69ef682c1ed2e-4.webp&feedId=89032&k=446796584f92b8f8401d474f5db476f6dabd5255" },
      { store: "SportIsGoodES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335354&a=3013769&m=65906", title: "Maillot Exterior Croacia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8619-455-deep-royal-blue-69ef682c1ed2e-4.webp&feedId=89044&k=446796584f92b8f8401d474f5db476f6dabd5255" },
    ],
  },
{
    id: "esp-away-2026",
    teamKey: "espana",
    season: "2026",
    typeKey: "away",
    colorHex: "#F5B942",
    colorHexSecondary: "#C60B1E",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 46.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Folmo-10-spain-away-winner-jersey-2026-world-cup%3Fvariant%3D47816170274921", title: "OLMO #10 Spain Away Winner Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/spainaway2starsfan_102026_2.webp?v=1784553919" },
      { store: "FootStoreES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44972135372&a=3013769&m=65912", title: "Maillot Exterior España Coupe du Monde 2026", inStock: true, sizes: ["XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn4397_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=30bd73b835c97dd4e6d56a76f4a0880e9860377f" },
    ],
  },
{
    id: "esp-goalkeeper-2026",
    teamKey: "espana",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 34.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-home-goalkeeper-jersey-2026-world-cup%3Fvariant%3D42713300205673", title: "Spain Home Goalkeeper Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Spain_2026_Home_Goalkeeper_Jersey_1.jpg?v=1764323097" },
      { store: "FootStoreES", price: 95.37, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44216768825&a=3013769&m=65912", title: "Maillot Domicilio Auténtico portero España Coupe du Monde 2026", inStock: true, sizes: ["XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_07_adidas_kc3084_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=93d07ba9fa9de5374d99b7332c3b965e9d1d9711" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094290000&a=3013769&m=77008", title: "Camiseta de portero primera equipación España 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F306d4e607aee4a148d0367de314782ec_9366%2FCamiseta_de_portero_primera_equipacion_Espana_26_Azul_KB8371_21_model.jpg&feedId=92152&k=50336f025c887d9a65d8ff6f4a020cb1e71aa8de" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096957488&a=3013769&m=77026", title: "Camisola Principal de Guarda-Redes 26 da Espanha", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F306d4e607aee4a148d0367de314782ec_9366%2FCamisola_Principal_de_Guarda-Redes_26_da_Espanha_Azul_KB8371_21_model.jpg&feedId=92150&k=6aed226aeb383f4bedc3f9e04ea27cd01020541f" },
    ],
  },
{
    id: "fra-away-2026",
    teamKey: "francia",
    season: "2026",
    typeKey: "away",
    colorHex: "#EF4135",
    colorHexSecondary: "#0055A4",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-away-soccer-jersey-2026-world-cup%3Fvariant%3D43013419139177", title: "France Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/France2026awayjersey_1_8343c88f-f693-4341-92d5-f8ce052bf427.webp?v=1773914236" },
      { store: "FootStoreES", price: 149.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42613754369&a=3013769&m=65912", title: "Camiseta Exterior Auténtica Francia 2025", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ih0804-110_pale-ivory-sail-bright-blue-light-madder-root_7.webp&feedId=89032&k=8251273dcb1100b99d24d57d312352954f8e7a74" },
      { store: "SportIsGoodES", price: 76.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43574015747&a=3013769&m=65906", title: "Camiseta de visitante de Francia 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_12_adidas_jy0843_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=f57386e1dd5777d768d1db8c6deec43666f08eb2" },
      { store: "AdidasES", price: 90.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570679950&a=3013769&m=77008", title: "Camiseta segunda equipación Francia", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F6d1f55123d6b469cbc50bdd4c1535ad7_9366%2FCamiseta_segunda_equipacion_Francia_Blanco_KA3300_21_model.jpg&feedId=92152&k=0990d94274f67a902a04e2d85c45e3021b0b144e" },
      { store: "AdidasPT", price: 90.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570674785&a=3013769&m=77026", title: "Camisola alternativa da França", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F6d1f55123d6b469cbc50bdd4c1535ad7_9366%2FCamisola_alternativa_da_Franca_Branco_KA3300_21_model.jpg&feedId=92150&k=8b8ef16af3cab194d15cd10a1eec17eeb94f754e" },
    ],
  },
{
    id: "fra-goalkeeper-2026",
    teamKey: "francia",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926234&a=3013769&m=65912", title: "Maillot de Gardien Francia Coupe du monde 2026", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5304-010_01.webp&feedId=89032&k=b16607e44bd3e5b0037a2e30581dc1143cb8b008" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5304-010-maillot-de-gardien-france-coupe-du-monde-2026-black-medium-ash-monarch-igloo", title: "Maillot de Gardien France Coupe du Monde 2026", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5304-010_01.webp" },
    ],
  },
{
    id: "ing-away-2026",
    teamKey: "inglaterra",
    season: "2026",
    typeKey: "away",
    colorHex: "#1B3A6B",
    colorHexSecondary: "#F5F5F5",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-away-soccer-jersey-2026-world-cup%3Fvariant%3D42634045227113", title: "England Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Englandawayjersey2026_8.webp?v=1776328101" },
    ],
  },
{
    id: "ita-away-2026",
    teamKey: "italia",
    season: "2026",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#003D7C",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000088506%3Fvariant%3D54053031346517", title: "Italy 26 Away Jersey FIGC  KC8704", inStock: true, sizes: ["S", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8850-1.jpg?v=1780401355" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fitaly-away-soccer-jersey-2026-world-cup%3Fvariant%3D42648228855913", title: "Italy Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/italy_away_2026.png?v=1762399188" },
      { store: "FootStoreES", price: 66.16, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890955&a=3013769&m=65912", title: "Camiseta Exterior Italia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_kc8704_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=b3ec5316a7e5c30cdc259273b4c320822ab4e291" },
      { store: "SportIsGoodES", price: 67.85, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365777&a=3013769&m=65906", title: "Camiseta Exterior Italia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_kc8704_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=b3ec5316a7e5c30cdc259273b4c320822ab4e291" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265207190&a=3013769&m=77008", title: "Camiseta segunda equipación Italia 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F75936dd14cc7497f82e20014ecee59bf_9366%2FCamiseta_segunda_equipacion_Italia_26_Azul_JY5680_21_model.jpg&feedId=92152&k=365ed0bda42dd34ba085ab9f3b1e4976fd08de26" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44267899840&a=3013769&m=77026", title: "Camisola Alternativa 26 da Itália", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F75936dd14cc7497f82e20014ecee59bf_9366%2FCamisola_Alternativa_26_da_Italia_Azul_JY5680_21_model.jpg&feedId=92150&k=34e4a6152c4e3ec1e223fc36a300166e11a23e28" },
    ],
  },
{
    id: "juv-third-202526",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 44.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-third-junior-2025-26-noir%3Fvariant%3D51534371389781", title: "Maillot Juventus Turin Third Junior 2025/26 Noir", inStock: true, sizes: ["M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-juventus-25-26-junior-adidas-planetfoot1.webp?v=1759851355" },
      { store: "FootStoreES", price: 63.36, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42530174584&a=3013769&m=65912", title: "Maillot Tercero Juventus de Turín 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kc3223_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=14712536193ce2c36296be7ab8460362d3cfe4f5" },
      { store: "FootStoreFR", price: 61.93, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkc3223-maillot-third-juventus-turin-2025-26-pursul", title: "Maillot Third Juventus Turin 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_kc3223_1_apparel_photography_front_center_view_white.jpg" },
      { store: "SportIsGoodES", price: 63.09, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301840763&a=3013769&m=65906", title: "Maillot Tercero Juventus de Turín 2025/26", inStock: true, sizes: ["S", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas-kc3486-black-ecrtin-6a58becf55734-1.webp&feedId=89044&k=49321b190131ae9a1e8b603e079f0efb60f1ab45" },
      { store: "SportIsGoodFR", price: 63.33, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkc3486-maillot-third-juventus-turin-2025-26-black-ecrtin", title: "Maillot Third Juventus Turin 2025/26", inStock: true, sizes: ["S", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas-kc3486-black-ecrtin-6a58becf55734-1.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45256778802&a=3013769&m=77008", title: "Camiseta tercera equipación Juventus 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fd5391efe8b6f4675a243e15c5f2aa956_9366%2FCamiseta_tercera_equipacion_Juventus_25-26_Negro_KC3491_21_model.jpg&feedId=92152&k=b15cac81426f613a09955b5e7a788f5b35de2c00" },
      { store: "AdidasPT", price: 70.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45256773512&a=3013769&m=77026", title: "Camisola do Terceiro Equipamento 25/26 da Juventus", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fd5391efe8b6f4675a243e15c5f2aa956_9366%2FCamisola_do_Terceiro_Equipamento_25-26_da_Juventus_Preto_KC3491_21_model.jpg&feedId=92150&k=87687fa44c67f7b6cd1bfc7f59cbf649a1b873d6" },
    ],
  },
{
    id: "juv-goalkeeper-202526",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 50.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-gardien-homme-2025-26-noir%3Fvariant%3D50981178310997", title: "Maillot Juventus Turin Domicile Gardien Homme 2025/26 Noir", inStock: true, sizes: ["M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-juventus-turin-25-26-adidas-planetfoot1.jpg?v=1755180645" },
      { store: "FootStoreES", price: 77.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42530011707&a=3013769&m=65912", title: "Maillot de portero local Juventus de Turín 2025/26", inStock: true, sizes: ["M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn5219_gris_1.webp&feedId=89032&k=217bbe918fb6a320ce3bb2e7d978285a0ac96986" },
      { store: "FootStoreFR", price: 67.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn5219-maillot-de-gardien-domicile-juventus-turin-2025-26-gris", title: "Maillot de gardien Domicile Juventus Turin 2025/26", inStock: true, sizes: ["M", "L"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn5219_gris_1.jpg" },
    ],
  },
{
    id: "liv-away-202526",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#F6EB61",
    colorHexSecondary: "#C8102E",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 50.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-exterieur-homme-2025-26-beige%3Fvariant%3D51325520838997", title: "Maillot Liverpool F.C. Extérieur Homme 2025/26 Beige", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-exterieur-liverpool-fc-25-26-adulte-adidas-planetfoot1.webp?v=1756479104" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972277361&a=3013769&m=77008", title: "Camiseta segunda equipación Liverpool FC 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F96d873b3322b42a3afe56931da8f56be_9366%2FCamiseta_segunda_equipacion_Liverpool_FC_25-26_Blanco_JV6487_21_model.jpg&feedId=92152&k=320697cd5f84b18ae54a95e347aaf2bdcf240359" },
    ],
  },
{
    id: "liv-third-202526",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#C8102E",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 39.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-third-junior-2025-26-vert%3Fvariant%3D51385406619989", title: "Maillot Liverpool F.C. Third Junior 2025/26 Vert", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-liverpool-fc-25-26-enfants-adulte-adidas-planetfoot1.webp?v=1757425405" },
      { store: "FootStoreES", price: 59.96, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42381633159&a=3013769&m=65912", title: "Camiseta Third Liverpool FC 2025/26", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6428_2.webp&feedId=89032&k=0f867e31f13ed4790328f9d8592e8eaf33ba63ef" },
      { store: "FootStoreFR", price: 58.61, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv6428-maillot-third-liverpool-fc-2025-26-seagre", title: "Maillot Third Liverpool FC 2025/26", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv6428_2.jpg" },
      { store: "SportIsGoodES", price: 59.69, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845433&a=3013769&m=65906", title: "Camiseta Third Liverpool FC 2025/26", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6428_2.webp&feedId=89044&k=0f867e31f13ed4790328f9d8592e8eaf33ba63ef" },
      { store: "SportIsGoodFR", price: 59.95, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv6428-maillot-third-liverpool-fc-2025-26-seagre", title: "Maillot Third Liverpool FC 2025/26", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv6428_2.jpg" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42382383639&a=3013769&m=77008", title: "Camiseta tercera equipación Liverpool FC 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F21d0abf65dcd4eaebbb1b3e8f1ca3d99_9366%2FCamiseta_tercera_equipacion_Liverpool_FC_25-26_Verde_JV6428_21_model.jpg&feedId=92152&k=9e327c2af9227d116734c0ae2023eddeb31cf0ba" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42382384159&a=3013769&m=77026", title: "Camisola do Terceiro Equipamento 25/26 do Liverpool FC", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F21d0abf65dcd4eaebbb1b3e8f1ca3d99_9366%2FCamisola_do_Terceiro_Equipamento_25-26_do_Liverpool_FC_Verde_JV6428_21_model.jpg&feedId=92150&k=8e495f38acfce47c0b6a9ccaf1e201f3ce78b681" },
    ],
  },
{
    id: "liv-goalkeeper-202526",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 34.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-domicile-gardien-junior-2025-26-vert%3Fvariant%3D51325535191381", title: "Maillot Liverpool F.C. Domicile Gardien Junior 2025/26 Vert", inStock: true, sizes: ["L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-liverpool-fc-25-26-junior-adidas-planetfoot1.webp?v=1756548418" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972273419&a=3013769&m=77008", title: "Camiseta de portero Liverpool FC 25/26", inStock: true, sizes: ["M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ff0b54147d3ad4a40b7e1d6add0de3b87_9366%2FCamiseta_de_portero_Liverpool_FC_25-26_Verde_JZ4088_21_model.jpg&feedId=92152&k=4bce89c860eb0fb536bb3d75aa495814d1443622" },
      { store: "AdidasPT", price: 70.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972274257&a=3013769&m=77026", title: "Camisola de Guarda-Redes 25/26 do Liverpool FC", inStock: true, sizes: ["M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ff0b54147d3ad4a40b7e1d6add0de3b87_9366%2FCamisola_de_Guarda-Redes_25-26_do_Liverpool_FC_Verde_JZ4088_21_model.jpg&feedId=92150&k=aa2064b4085271f7c972cba2ba5b8b6d2fcc1cbb" },
    ],
  },
{
    id: "manutd-away-202526",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#000000",
    colorHexSecondary: "#DA020E",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-exterieur-homme-2025-26-blanc%3Fvariant%3D51325538664789", title: "Maillot Manchester United Extérieur Homme 2025/26 Blanc", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-exterieur-manchester-united-25-26-adulte-adidas-planetfoot1.webp?v=1756552164" },
      { store: "FansJerseyHub", price: 40.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcunha-10-manchester-united-away-soccer-jersey-2025-26%3Fvariant%3D42861896728681", title: "Cunha #10 Manchester United Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Cunha10ManchesterUnitedAwayJersey202526.webp?v=1769591811" },
      { store: "FootStoreES", price: 59.96, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41991593869&a=3013769&m=65912", title: "Camiseta visitante Manchester United 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_ji7423_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=54baf9959b1cf70bfb0bd3efadea267563587fc8" },
      { store: "SportIsGoodES", price: 59.69, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301844190&a=3013769&m=65906", title: "Camiseta visitante Manchester United 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_ji7423_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=54baf9959b1cf70bfb0bd3efadea267563587fc8" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41848202010&a=3013769&m=77008", title: "Camiseta segunda equipación Manchester United 25/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F1623df85821444868c899b09fd5c9a3c_9366%2FCamiseta_segunda_equipacion_Manchester_United_25-26_Blanco_JI7423_21_model.jpg&feedId=92152&k=a1f47608daf926a7217fde6420b83b5c8136c105" },
    ],
  },
{
    id: "manutd-third-202526",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#DA020E",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-homme-2025-26-noir%3Fvariant%3D51385053184341", title: "Maillot Manchester United Third Homme 2025/26 Noir", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-manchester-united-25-26-adulte-adidas-planetfoot1.webp?v=1757767675" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42287717126&a=3013769&m=65912", title: "Maillot Tercero Manchester United 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kd4225_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=59b172cffbf8cbcc3240e789ebe88077097bea67" },
      { store: "FootStoreFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd4225-maillot-third-manchester-united-2025-26-black", title: "Maillot Third Manchester United 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kd4225_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301836101&a=3013769&m=65906", title: "Maillot Tercero Manchester United 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kd4225_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=59b172cffbf8cbcc3240e789ebe88077097bea67" },
      { store: "SportIsGoodFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd4225-maillot-third-manchester-united-2025-26-black", title: "Maillot Third Manchester United 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kd4225_1_apparel_photography_front_center_view_white.webp" },
    ],
  },
{
    // Todavía sin oferta válida: la única disponible era de talla junior.
    id: "manutd-goalkeeper-202526",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [],
  },
{
    id: "ned-away-2026",
    teamKey: "paisesbajos",
    season: "2026",
    typeKey: "away",
    colorHex: "#1B3A6B",
    colorHexSecondary: "#FF6600",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fnetherlands-2026-world-cup-away-football-jersey%3Fvariant%3D42961849286761", title: "Netherlands 2026 World Cup Away Football Jersey", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/netherlandsaway2026jersey.webp?v=1776235089" },
      { store: "FootStoreES", price: 149.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43406659936&a=3013769&m=65912", title: "Camiseta Exterior Países Bajos 2025", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ih0806-489_blue-beyond-noir_5.webp&feedId=89032&k=04fe3982cfb43bfc421b816f9b8d5a9fdad66de9" },
    ],
  },
{
    id: "por-away-2026",
    teamKey: "portugal",
    season: "2026",
    typeKey: "away",
    colorHex: "#046A38",
    colorHexSecondary: "#A5001E",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 54.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-portugal-ronaldo-away-blanc-vert-2026-homme%3Fvariant%3D53802754081109", title: "Maillot Portugal Ronaldo 2026 Extérieur Homme - Blanc / Vert", inStock: true, sizes: ["L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/Maillot_Portugal_Ronaldo_2026_Ext_rieur_Homme_-_Blanc_Vert.png?v=1778057945" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fportugal-away-soccer-jersey-2026-world-cup%3Fvariant%3D42706804211817", title: "Portugal Away Soccer Jersey 2026 World Cup", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Portugal_Away_Jersey_World_Cup_2026_3.webp?v=1764049124" },
      { store: "FootStoreES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45381240346&a=3013769&m=65912", title: "Camiseta de Visitante Portugal Coupe du Monde 2026", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783288-02-white-green-lagoon-69babe09f07cc-1.webp&feedId=89032&k=ac61552a06c41a5e7fa574881e51ebe4bcff1ef9" },
      { store: "SportIsGoodES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45380187815&a=3013769&m=65906", title: "Camiseta de Visitante Portugal Coupe du Monde 2026", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783288-02-white-green-lagoon-69babe09f07cc-1.webp&feedId=89044&k=ac61552a06c41a5e7fa574881e51ebe4bcff1ef9" },
    ],
  },
{
    id: "psg-away-202526",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#DA291C",
    colorHexSecondary: "#001E62",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 119.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45263181337&a=3013769&m=65912", title: "Maillot de manga larga Exterior PSG 2026/27", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-iw9271-101-white-college-navy-college-navy-6a45a12f40f2f-1.webp&feedId=89032&k=8c11cff7c3650201cb3981654ec04e09596ac914" },
    ],
  },
{
    id: "psg-third-202526",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#001E62",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 83.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43745917174&a=3013769&m=65912", title: "Maillot Tercero PSG Strike 2025/26", inStock: true, sizes: ["L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hm3606-101_white-global-red_1.webp&feedId=89032&k=2e58deaeee8071150c777244cca3a2423906a3c9" },
    ],
  },
{
    id: "rma-away-202526",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#FEBE10",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-exterieur-homme-2025-26-bleu%3Fvariant%3D51159086367061", title: "Maillot Real Madrid Extérieur Homme 2025/26 Bleu", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-exterieur-real-madrid-25-26-adulte-adidas-planetfoot1.jpg?v=1755938674" },
      { store: "FootStoreES", price: 62.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41718361138&a=3013769&m=65912", title: "Camiseta de visitante del Real Madrid 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj4182_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=0cfa015b02d52489201081e0a54e252c213094a0" },
      { store: "SportIsGoodES", price: 62.2, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45072984905&a=3013769&m=65906", title: "Camiseta de visitante del Real Madrid 2025/26", inStock: true, sizes: ["S", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj4182_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=0cfa015b02d52489201081e0a54e252c213094a0" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41617120726&a=3013769&m=77008", title: "Camiseta segunda equipación Real Madrid 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F69b7b03005ed474e95c1bae97618e097_9366%2FCamiseta_segunda_equipacion_Real_Madrid_25-26_Azul_JJ4182_21_model.jpg&feedId=92152&k=cc9ae1669d7c92a3a506080bc2ff8bae5c3ac9e6" },
    ],
  },
{
    id: "rma-third-202526",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#FEBE10",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-third-homme-2024-25-beige-hp%3Fvariant%3D50258487411029", title: "Maillot Real Madrid Third Homme 2024/25 Beige ( HP )", inStock: true, sizes: ["M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/JX2119_b2b012_plp.jpg?v=1738601110" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42031884497&a=3013769&m=65912", title: "Maillot Tercero del Real Madrid 2025/26", inStock: true, sizes: ["S", "M", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv5845_blubir_1.webp&feedId=89032&k=a0b9c2844799909cd0d942d2d619222a00bcf2f0" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv5845-maillot-third-real-madrid-2025-26-blubir", title: "Maillot Third Real Madrid 2025/26", inStock: true, sizes: ["S", "M", "XXL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv5845_blubir_1.jpg" },
      { store: "SportIsGoodES", price: 62.2, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301840777&a=3013769&m=65906", title: "Maillot Tercero del Real Madrid 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv5845_blubir_1.webp&feedId=89044&k=a0b9c2844799909cd0d942d2d619222a00bcf2f0" },
      { store: "SportIsGoodFR", price: 62.45, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv5845-maillot-third-real-madrid-2025-26-blubir", title: "Maillot Third Real Madrid 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv5845_blubir_1.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42036950039&a=3013769&m=77008", title: "Camiseta tercera equipación Real Madrid 25/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7355abe9c0ce4ab9a6ae6b448cd03b15_9366%2FCamiseta_tercera_equipacion_Real_Madrid_25-26_Azul_JV5845_21_model.jpg&feedId=92152&k=a59ef60598ec45123135f6a30b8cac8a9e0d276d" },
      { store: "AdidasPT", price: 56.25, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42036951913&a=3013769&m=77026", title: "Camisola do Terceiro Equipamento 25/26 do Real Madrid", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7355abe9c0ce4ab9a6ae6b448cd03b15_9366%2FCamisola_do_Terceiro_Equipamento_25-26_do_Real_Madrid_Azul_JV5845_21_model.jpg&feedId=92150&k=5df6e6ec9172e874ea2e2e9d34fb6d0ec31811d2" },
    ],
  },
{
    id: "rma-goalkeeper-202526",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 54.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-domicile-gardien-homme-2025-26-bleu%3Fvariant%3D50923096572245", title: "Maillot Real Madrid Domicile Gardien Homme 2025/26 Bleu", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-domicile-real-madrid-2025-26-adidas-homme1.webp?v=1754908724" },
      { store: "FootStoreES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45184773387&a=3013769&m=65912", title: "Maillot de portero Local Real Madrid 2026/27", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas-kc3988-black-6a444bfd9b27d-1.webp&feedId=89032&k=7be41354610aacb392afaa0185b9e2b0da7e9a58" },
      { store: "FootStoreFR", price: 71.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp4178-maillot-de-gardien-domicile-real-madrid-2025-26-blubrs-rayblu", title: "Maillot de gardien Domicile Real Madrid 2025/26", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jp4178_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41530608280&a=3013769&m=77008", title: "Camiseta portero primera equipación Real Madrid 25/26", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F29dc1225fe254240a947e360e1fe27a4_9366%2FCamiseta_portero_primera_equipacion_Real_Madrid_25-26_Azul_JP4178_21_model.jpg&feedId=92152&k=d0f6bc7e69a226ff69d852fa60d1ef6d0a47b88a" },
      { store: "AdidasPT", price: 85.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41704988514&a=3013769&m=77026", title: "Camisola Principal de Guarda-redes 25/26 do Real Madrid", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F29dc1225fe254240a947e360e1fe27a4_9366%2FCamisola_Principal_de_Guarda-redes_25-26_do_Real_Madrid_Azul_JP4178_21_model.jpg&feedId=92150&k=2822f996edd7687930060cec4d6da60957802a67" },
    ],
  },
{
    id: "riv-away-202526",
    teamKey: "riverplate",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#E30613",
    colorHexSecondary: "#F5F5F5",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 59.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-river-plate-exterieur-homme-2025-26-noir%3Fvariant%3D51494762905941", title: "Maillot River Plate Extérieur Homme 2025/26 Noir", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-river-plate-25-26-exterieur-adulte-adidas-planetfoot1.webp?v=1758817199" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Friver-plate-away-soccer-jersey-2025-26%3Fvariant%3D42724207886441", title: "River Plate Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/RiverPlateAwaySoccerJersey202526_1.png?v=1764762115" },
    ],
  },
{
    id: "uru-away-2026",
    teamKey: "uruguay",
    season: "2026",
    typeKey: "away",
    colorHex: "#000000",
    colorHexSecondary: "#75C6E8",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Furuguay-away-football-jersey-world-cup-2026%3Fvariant%3D42762193895529", title: "Uruguay Away Football Jersey World Cup 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/uruguayawayjersey2026_1_1.webp?v=1776843683" },
      { store: "FootStoreES", price: 76.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926351&a=3013769&m=65912", title: "Camiseta de visitante Uruguay Coupe du monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io4681-451-obsidian-hyper-royal-69ca9aab64a88-1.webp&feedId=89032&k=e9d91af639ffe5d5b6786019048fab89d945d9d6" },
    ],
  },
{
    id: "como-home-202526",
    teamKey: "como",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#0F3460",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    offers: [
      { store: "ComoFCShop", price: 110.0, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fhome-jersey-2025-26-jd7389-1%3Fvariant%3D55667122078078", title: "Como 1907 Maglia Gara Home 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_B1001_01.jpg?v=1758876217" },
    ],
  },
{
    id: "como-away-202526",
    teamKey: "como",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#0F3460",
    jerseyPattern: "solid",
    offers: [
      { store: "ComoFCShop", price: 110.0, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Faway-jersey-2025-26-jd7389-1%3Fvariant%3D55667123388798", title: "Como 1907 Maglia Away 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/SecondaMaglia_01.jpg?v=1758876564" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0.0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcomo-1907-away-soccer-jersey-2025-26%3Fvariant%3D42712375197801", title: "Como 1907 Away Soccer Jersey 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Como_1907_Away_Jersey_202526_2.webp?v=1764227829" },
    ],
  },
{
    id: "como-third-202526",
    teamKey: "como",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#0F3460",
    jerseyPattern: "solid",
    offers: [
      { store: "ComoFCShop", price: 110.0, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fcomo-1907-maglia-third-2025-26%3Fvariant%3D55667125158270", title: "Como 1907 Maglia Third 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/1stImage.jpg?v=1764583746" },
    ],
  },
{
    id: "como-goalkeeper-home-202526",
    teamKey: "como",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "ComoFCShop", price: 42.5, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fgoalkeeper-home-jersey-2025-26-jn2032-1%3Fvariant%3D56086477308286", title: "Como 1907 Maglia Gara Portiere Home 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_00347_01_e50516b8-fa7b-4078-ad8e-04edab096380.jpg?v=1758876738" },
    ],
  },
{
    id: "como-goalkeeper-away-202526",
    teamKey: "como",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "ComoFCShop", price: 42.5, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fgoalkeeper-away-jersey-2025-26-jn2033-1%3Fvariant%3D56182570582398", title: "Como 1907 Maglia Gara Portiere Away 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_B5001_09_01.jpg?v=1758876639" },
    ],
  },
{
    id: "como-goalkeeper-third-202526",
    teamKey: "como",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "ComoFCShop", price: 42.5, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fgoalkeeper-third-jersey-2025-26-jp4380-1%3Fvariant%3D56193832878462", title: "Como 1907 Maglia Gara Portiere Third 2025/26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_B6001_08_01.jpg?v=1757675978" },
    ],
  },
{
    id: "bar-goalkeeper-202526",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 109.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42805631887&a=3013769&m=65912", title: "Camiseta de portero local de manga larga FC Barcelona 2025/26", inStock: true, sizes: ["L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hq0477-311-phsym001.webp&feedId=89032&k=d5ea0c65a894acdb978e42af23924d9854efe8ae" },
    ],
  },
{
    id: "ita-goalkeeper-2026",
    teamKey: "italia",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 70.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087832288&a=3013769&m=65912", title: "Camiseta local de manga larga portero Italia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_jy7656_0.webp&feedId=89032&k=603757ba829bf74d0fbc4d8b219049021ac8394b" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn1979-maillot-domicile-gardien-italie-coupe-du-monde-2026-tecobu", title: "Maillot Domicile gardien Italie Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_jn1979_0.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094298145&a=3013769&m=77008", title: "Camiseta de portero primera equipación Italia 26", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fffbebe63c7264f5685f8623206ecdcbc_9366%2FCamiseta_de_portero_primera_equipacion_Italia_26_Burgundy_JN1979_21_model.jpg&feedId=92152&k=065984b74a67cd9f363a6737e6d95aa612f91db1" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096965775&a=3013769&m=77026", title: "Camisola Principal de Guarda-redes 26 da ITÁLIA", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fffbebe63c7264f5685f8623206ecdcbc_9366%2FCamisola_Principal_de_Guarda-redes_26_da_ITALIA_Bordo_JN1979_21_model.jpg&feedId=92150&k=6a09c49c89949a40bf302884bc6e8d874b76d776" },
    ],
  },
{
    id: "che-goalkeeper-202526",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 62.14, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43829770459&a=3013769&m=65912", title: "Camiseta de portero de manga larga Chelsea 2025/26", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_01_nike_ib3830-012_15.webp&feedId=89032&k=467fdde996986625813f61f52625d138227cccfa" },
    ],
  },
{
    id: "cro-goalkeeper-2026",
    teamKey: "croacia",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973663&a=3013769&m=65912", title: "Maillot de portero Croacia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8620-718-lightening-69ef67d39f748-1.webp&feedId=89032&k=e8189782542a1ef2d7ee323d1b7b868751e09fa5" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio8620-718-maillot-de-gardien-croatie-coupe-du-monde-2026-lightening", title: "Maillot de gardien Croatie Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8620-718-lightening-69ef67d39f748-1.webp" },
      { store: "SportIsGoodES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335320&a=3013769&m=65906", title: "Maillot de portero Croacia Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8620-718-lightening-69ef67d39f748-1.webp&feedId=89044&k=e8189782542a1ef2d7ee323d1b7b868751e09fa5" },
      { store: "SportIsGoodFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fio8620-718-maillot-de-gardien-croatie-coupe-du-monde-2026-lightening", title: "Maillot de gardien Croatie Coupe du Monde 2026", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8620-718-lightening-69ef67d39f748-1.webp" },
    ],
  },
{
    id: "psg-goalkeeper-202526",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FootStoreFR", price: 109.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhq9799-703-maillot-de-gardien-third-psg-2025-26-volt-white-black", title: "Maillot de gardien Third PSG 2025/26", inStock: true, sizes: ["XL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_08_nike_hq9799-703-phsfh001.webp" },
    ],
  },{
    id: "alemania-away-kids",
    teamKey: "alemania",
    season: "2026",
    typeKey: "away",
    colorHex: "#000000",
    colorHexSecondary: "#F5F5F5",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 50.22, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890766&a=3013769&m=65912", title: "Camiseta de visitante niño Alemania Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jz4569_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=61be843b7130d2ec904846bbc9c4c8c704ede557" },
      { store: "SportIsGoodES", price: 51.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365594&a=3013769&m=65906", title: "Camiseta de visitante niño Alemania Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jz4569_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=61be843b7130d2ec904846bbc9c4c8c704ede557" },
    ],
  },
{
    id: "alemania-home-kids",
    teamKey: "alemania",
    season: "2026",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 50.22, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087832834&a=3013769&m=65912", title: "Camiseta local para niño Alemania Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz4560_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=e30858e73a026f6860fad497def37b8dfe15da95" },
      { store: "FootStoreFR", price: 48.84, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjz4560-maillot-domicile-enfant-allemagne-coupe-du-monde-2026-white", title: "Maillot Domicile enfant Allemagne Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jz4560_3_apparel_on_model_standard_view_white.webp" },
      { store: "SportIsGoodES", price: 51.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301934153&a=3013769&m=65906", title: "Camiseta local para niño Alemania Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz4560_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=e30858e73a026f6860fad497def37b8dfe15da95" },
      { store: "SportIsGoodFR", price: 50.29, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjz4560-maillot-domicile-enfant-allemagne-coupe-du-monde-2026-white", title: "Maillot Domicile enfant Allemagne Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jz4560_3_apparel_on_model_standard_view_white.webp" },
      { store: "PlanetFoot", price: 74.99, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000089541%3Fvariant%3D54228787364181", title: "Germany 26 Home Kids Jersey JZ4560", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8954-1.jpg?v=1782473252" },
    ],
  },
{
    id: "argentina-away-kids",
    teamKey: "argentina",
    season: "2026",
    typeKey: "away",
    colorHex: "#1A1A2E",
    colorHexSecondary: "#75AADB",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 52.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890904&a=3013769&m=65912", title: "Camiseta Visitante niño Argentina Coupe du Monde 2026", inStock: true, sizes: ["11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_kb0626_2_apparel_photography_front_center_view_white.webp&feedId=89032&k=f836f03d20de93b8f330c39b2c1f618da01a2895" },
      { store: "SportIsGoodES", price: 52.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365743&a=3013769&m=65906", title: "Camiseta Visitante niño Argentina Coupe du Monde 2026", inStock: true, sizes: ["11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_kb0626_2_apparel_photography_front_center_view_white.webp&feedId=89044&k=f836f03d20de93b8f330c39b2c1f618da01a2895" },
    ],
  },
{
    id: "argentina-home-kids",
    teamKey: "argentina",
    season: "2026",
    typeKey: "home",
    colorHex: "#75AADB",
    colorHexSecondary: "#F4F7FA",
    jerseyPattern: "stripes",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 52.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831955&a=3013769&m=65912", title: "Camiseta Local niño Argentina Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_ka8119_1_apparel_photography_front_view_white.webp&feedId=89032&k=d76759f9bfaddbacacf41c5f02513659cd88e430" },
      { store: "SportIsGoodES", price: 52.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932811&a=3013769&m=65906", title: "Camiseta Local niño Argentina Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_ka8119_1_apparel_photography_front_view_white.webp&feedId=89044&k=d76759f9bfaddbacacf41c5f02513659cd88e430" },
      { store: "PlanetFoot", price: 89.99, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000088070%3Fvariant%3D54010394378581", title: "Argentina 26 Home Messi Jersey Kids  AFA KA8115", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8807-1.jpg?v=1779804027" },
    ],
  },
{
    id: "barcelona-away-kids",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#0F5A2E",
    colorHexSecondary: "#F5C742",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 84.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45443804104&a=3013769&m=65912", title: "Camiseta de visitante infantil del FC Barcelona 2026/27", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-ii1674-505-field-purple-field-purple-metallic-gold-6a6a2762a5f3f-1.webp&feedId=89032&k=a83972c28a276baa4a95a80bd4bc87b346c155bd" },
    ],
  },
{
    id: "barcelona-goalkeeper-kids",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 89.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45263180656&a=3013769&m=65912", title: "Camiseta de portero de manga larga para niño FC Barcelona 2026/27", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fi%2Fi%2Fii3610-324.webp&feedId=89032&k=140791eb507c5bd4b3506ef0efd4908744904bd6" },
    ],
  },
{
    id: "barcelona-home-kids",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#004D98",
    colorHexSecondary: "#A50044",
    jerseyPattern: "stripes",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 129.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42969282893&a=3013769&m=65912", title: "Camiseta Local niño FC Barcelona 2025/26", inStock: true, sizes: ["7-8"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hj5216-456-phsfh001.webp&feedId=89032&k=ec98d4e4d639b1eb24f63bc0af3337acf8c5035b" },
    ],
  },
{
    id: "barcelona-third-kids",
    teamKey: "barcelona",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#004D98",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 58.79, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43770970412&a=3013769&m=65912", title: "Maillot Tercero niño FC Barcelona 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hm4122-855-phsfh001-ss25.webp&feedId=89032&k=81101ab40061a59846471176654953ead7eca001" },
    ],
  },
{
    id: "bayern-away-kids",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#DC052D",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.38, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41385744433&a=3013769&m=65912", title: "Camiseta de visitante para niño Bayern Múnich 2025/26", inStock: true, sizes: ["9-10", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8524_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=c68ac8aee0b631d18f48adf3497905dc3ce7dc9c" },
      { store: "SportIsGoodES", price: 45.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301834732&a=3013769&m=65906", title: "Camiseta de visitante para niño Bayern Múnich 2025/26", inStock: true, sizes: ["9-10", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8524_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=c68ac8aee0b631d18f48adf3497905dc3ce7dc9c" },
    ],
  },
{
    id: "bayern-home-kids",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#DC052D",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.38, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41666325429&a=3013769&m=65912", title: "Camiseta local infantil Bayern Munich 2025/26", inStock: true, sizes: ["7-8"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8525_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=2be0bed85a6555727dc33cb2c4c5a1b84513665d" },
      { store: "FootStoreFR", price: 44.16, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn8525-maillot-domicile-enfant-bayern-munich-2025-26-red", title: "Maillot Domicile enfant Bayern Munich 2025/26", inStock: true, sizes: ["7-8"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn8525_3_apparel_on_model_standard_view_white.jpg" },
      { store: "SportIsGoodES", price: 45.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43324654331&a=3013769&m=65906", title: "Camiseta local infantil Bayern Munich 2025/26", inStock: true, sizes: ["7-8"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8525_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=2be0bed85a6555727dc33cb2c4c5a1b84513665d" },
      { store: "SportIsGoodFR", price: 45.49, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjn8525-maillot-domicile-enfant-bayern-munich-2025-26-red", title: "Maillot Domicile enfant Bayern Munich 2025/26", inStock: true, sizes: ["7-8"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn8525_3_apparel_on_model_standard_view_white.jpg" },
    ],
  },
{
    id: "bayern-third-kids",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#DC052D",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42331812898&a=3013769&m=65912", title: "Maillot Tercero niño Bayern Munich 2025/26", inStock: true, sizes: ["9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_ke6797_1_apparel_photography_front_view_white.webp&feedId=89032&k=ea88641cb6b713ee92c54d4847da9bf7e04edb7c" },
      { store: "FootStoreFR", price: 45.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fke6797-maillot-third-enfant-bayern-munich-2025-26-black-halivo", title: "Maillot Third enfant Bayern Munich 2025/26", inStock: true, sizes: ["9-10", "11-12", "13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_ke6797_1_apparel_photography_front_view_white.webp" },
      { store: "SportIsGoodES", price: 45.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301844232&a=3013769&m=65906", title: "Maillot Tercero niño Bayern Munich 2025/26", inStock: true, sizes: ["9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_ke6797_1_apparel_photography_front_view_white.webp&feedId=89044&k=ea88641cb6b713ee92c54d4847da9bf7e04edb7c" },
      { store: "SportIsGoodFR", price: 45.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fke6797-maillot-third-enfant-bayern-munich-2025-26-black-halivo", title: "Maillot Third enfant Bayern Munich 2025/26", inStock: true, sizes: ["9-10", "11-12", "13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_ke6797_1_apparel_photography_front_view_white.webp" },
      { store: "PlanetFoot", price: 49.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-junior-2025-26-noir%3Fvariant%3D51494769099093", title: "Maillot Bayern Munich Third Junior 2025/26 Noir", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-bayern-munich-25-26-junior-adidas-planetfoot1.webp?v=1759840239" },
    ],
  },
{
    id: "brasil-home-kids",
    teamKey: "brasil",
    season: "2026",
    typeKey: "home",
    colorHex: "#FFCC29",
    colorHexSecondary: "#0F5A2E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 59.49, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44374081633&a=3013769&m=65912", title: "Maillot Domicile niño Brasil Coupe du monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_io2231-724_01.webp&feedId=89032&k=6a5e17cb94416a8aa29e7de9fae10d3e1b140325" },
    ],
  },
{
    id: "chelsea-away-kids",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#034694",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 58.79, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41674758726&a=3013769&m=65912", title: "Camiseta de visitante para niño Chelsea 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hj5284-031-phsfh001.webp&feedId=89032&k=3afede53a1c262f50054794edb1d2d52d3df08a2" },
    ],
  },
{
    id: "chelsea-goalkeeper-kids",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 79.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42694572981&a=3013769&m=65912", title: "Maillot de portero infantil Chelsea 2025/2026", inStock: true, sizes: ["10-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hj5248-011-phsfh001.webp&feedId=89032&k=3ac511cb225ed8ed9d9d6bcf0c9042d99cb9fcc0" },
      { store: "FootStoreFR", price: 79.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhj5248-011-maillot-de-gardien-enfant-chelsea-2025-2026-noir-smoke-grey-blanc", title: "Maillot de gardien enfant Chelsea 2025/2026", inStock: true, sizes: ["10-12"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_hj5248-011-phsfh001.webp" },
    ],
  },
{
    id: "chelsea-home-kids",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#034694",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 58.79, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44389415215&a=3013769&m=65912", title: "Camiseta local niño Chelsea 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_nike_hj5285-496_1.webp&feedId=89032&k=b5283ddc5f4d46bcf89ccf777dc45701c2b9578d" },
      { store: "FootStoreFR", price: 57.46, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhj5285-496-maillot-domicile-enfant-chelsea-2025-26-rush-blue-white-speed-red-white", title: "Maillot Domicile enfant Chelsea 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_nike_hj5285-496_1.webp" },
    ],
  },
{
    id: "chelsea-third-kids",
    teamKey: "chelsea",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#034694",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 58.79, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42441229555&a=3013769&m=65912", title: "Maillot Third niño Chelsea 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fh%2Fm%2Fhm4123-011.webp&feedId=89032&k=a0604bb992def03aa8f2968de397064298d0ae92" },
      { store: "FootStoreFR", price: 57.46, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhm4123-011-maillot-third-enfant-chelsea-2025-26-black-field-silver-field-silver", title: "Maillot Third enfant Chelsea 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13", "13-15"], imageUrl: "https://cdn.blazimg.com/1800/product/h/m/hm4123-011.webp" },
    ],
  },
{
    id: "colombia-home-kids",
    teamKey: "colombia",
    season: "2026",
    typeKey: "home",
    colorHex: "#FCD116",
    colorHexSecondary: "#003893",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 52.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43397425436&a=3013769&m=65912", title: "Maillot Domicile niño Colombia Coupe du Monde 2026", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_jz8797_0.webp&feedId=89032&k=823dac51aa58630c649059b37860c39b9a3d2c15" },
      { store: "SportIsGoodES", price: 52.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43398022730&a=3013769&m=65906", title: "Maillot Domicile niño Colombia Coupe du Monde 2026", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_jz8797_0.webp&feedId=89044&k=823dac51aa58630c649059b37860c39b9a3d2c15" },
    ],
  },
{
    id: "croacia-home-kids",
    teamKey: "croacia",
    season: "2026",
    typeKey: "home",
    colorHex: "#ED1C24",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "stripes",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 67.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973672&a=3013769&m=65912", title: "Maillot Domicile niño Croacia Coupe du Monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8704-100-white-69ef685db8975-1.webp&feedId=89032&k=07cb35e835273893c480080448407f6bf48f8704" },
      { store: "FootStoreFR", price: 67.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio8704-100-maillot-domicile-enfant-croatie-coupe-du-monde-2026-white", title: "Maillot Domicile enfant Croatie Coupe du Monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8704-100-white-69ef685db8975-1.webp" },
      { store: "SportIsGoodES", price: 67.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335329&a=3013769&m=65906", title: "Maillot Domicile niño Croacia Coupe du Monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8704-100-white-69ef685db8975-1.webp&feedId=89044&k=07cb35e835273893c480080448407f6bf48f8704" },
      { store: "SportIsGoodFR", price: 67.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fio8704-100-maillot-domicile-enfant-croatie-coupe-du-monde-2026-white", title: "Maillot Domicile enfant Croatie Coupe du Monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8704-100-white-69ef685db8975-1.webp" },
    ],
  },
{
    id: "espana-away-kids",
    teamKey: "espana",
    season: "2026",
    typeKey: "away",
    colorHex: "#F5B942",
    colorHexSecondary: "#C60B1E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890777&a=3013769&m=65912", title: "Camiseta de visitante para niño España Coupe du Monde 2026", inStock: true, sizes: ["9-10"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jz5728_1_apparel_photography_front_view_white.webp&feedId=89032&k=74e0077422be5bac36f0ef3ac80a537b906a8069" },
    ],
  },
{
    id: "espana-home-kids",
    teamKey: "espana",
    season: "2026",
    typeKey: "home",
    colorHex: "#C60B1E",
    colorHexSecondary: "#F5B942",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831910&a=3013769&m=65912", title: "Camiseta Local niño España Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz5757_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=21ad4ffa814de2024c8c7483ef5187c4ebc1f304" },
      { store: "FootStoreFR", price: 75.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjz5757-maillot-domicile-enfant-espagne-coupe-du-monde-2026-vivid-red", title: "Maillot Domicile enfant Espagne Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jz5757_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932736&a=3013769&m=65906", title: "Camiseta Local niño España Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz5757_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=21ad4ffa814de2024c8c7483ef5187c4ebc1f304" },
      { store: "SportIsGoodFR", price: 75.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjz5757-maillot-domicile-enfant-espagne-coupe-du-monde-2026-vivid-red", title: "Maillot Domicile enfant Espagne Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jz5757_1_apparel_photography_front_center_view_white.webp" },
      { store: "PlanetFoot", price: 74.99, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-espagne-domicile-junior-2026-rouge%3Fvariant%3D51806482104661", title: "Maillot Espagne Domicile Junior 2026 Rouge - Coupe du Monde", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-domicile-espagne-2026-rouge-junior-adidas-planetfoot1.webp?v=1762956843" },
    ],
  },
{
    id: "francia-home-kids",
    teamKey: "francia",
    season: "2026",
    typeKey: "home",
    colorHex: "#0055A4",
    colorHexSecondary: "#E8EDF5",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 59.49, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44645300834&a=3013769&m=65912", title: "Camiseta local niño Francia Coupe du monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5129-480_01.webp&feedId=89032&k=fc330f2aab6dd6028de1049780dff41deedbb1e4" },
      { store: "FootStoreFR", price: 59.49, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5129-480-maillot-domicile-enfant-france-coupe-du-monde-2026-royal-metallic-copper", title: "Maillot Domicile enfant France Coupe du Monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5129-480_01.webp" },
      { store: "SportIsGoodES", price: 63.75, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43574015731&a=3013769&m=65906", title: "Camiseta local niño Francia 2025/26", inStock: true, sizes: ["8-9", "9-10", "11-12", "12-13", "13-14", "14-15", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_12_adidas_kf1711_2_apparel_photography_front_center_view_white.webp&feedId=89044&k=1e4b9d113d8d0116ce058332313d2d8d8086ae85" },
      { store: "SportIsGoodFR", price: 55.18, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjy1227-maillot-domicile-enfant-france-2025-26-selubl-white", title: "Maillot Domicile enfant France 2025/26", inStock: true, sizes: ["8-9", "9-10", "11-12", "12-13", "13-14", "14-15", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jy1227_2_apparel_photography_front_center_view_white.webp" },
    ],
  },
{
    id: "inglaterra-away-kids",
    teamKey: "inglaterra",
    season: "2026",
    typeKey: "away",
    colorHex: "#1B3A6B",
    colorHexSecondary: "#F5F5F5",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 67.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926328&a=3013769&m=65912", title: "Camiseta de visitante para niño Inglaterra Coupe du monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5197-624_01.webp&feedId=89032&k=93e21f4ddcbc8cee58456cbcf4d229ba2f69775c" },
    ],
  },
{
    id: "inglaterra-home-kids",
    teamKey: "inglaterra",
    season: "2026",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#1B3A6B",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 129.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087822558&a=3013769&m=65912", title: "Camiseta Local Auténtica niña Inglaterra 2025", inStock: true, sizes: ["8-10"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_fz9191-405_hyper-royal-blanc-blanc_1.webp&feedId=89032&k=be1e487e5e0a2e2d0bb234ac8b7a98a4a5d25615" },
      { store: "FootStoreFR", price: 129.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Ffz9191-405-maillot-domicile-authentique-fille-angleterre-2025-hyper-royal-blanc-blanc", title: "Maillot Domicile Authentique fille Angleterre 2025", inStock: true, sizes: ["8-10"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_fz9191-405_hyper-royal-blanc-blanc_1.webp" },
    ],
  },
{
    id: "italia-away-kids",
    teamKey: "italia",
    season: "2026",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#003D7C",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 44.14, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301921942&a=3013769&m=65912", title: "Camiseta de visitante infantil Italia Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jy5681_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=5108ae04b5148d140918999465672643f2ba95c4" },
      { store: "SportIsGoodES", price: 43.88, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44302792407&a=3013769&m=65906", title: "Camiseta de visitante infantil Italia Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jy5681_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=5108ae04b5148d140918999465672643f2ba95c4" },
      { store: "PlanetFoot", price: 74.99, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000088490%3Fvariant%3D54053031084373", title: "Italy 26 Away Kids Jersey  FIGC JY5681", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8849-1.jpg?v=1780401353" },
    ],
  },
{
    id: "italia-goalkeeper-kids",
    teamKey: "italia",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 54.97, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087832452&a=3013769&m=65912", title: "Maillot de portero Domicilio manga larga niño Italia Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_jy7653_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=adca18c057d5f686407e23209b8116851bdf6806" },
      { store: "FootStoreFR", price: 53.58, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjy7653-maillot-de-gardien-domicile-manches-longues-enfant-italie-coupe-du-monde-2026-tecobu", title: "Maillot de gardien Domicile manches longues enfant Italie Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_jy7653_1_apparel_photography_front_center_view_white.webp" },
    ],
  },
{
    id: "italia-home-kids",
    teamKey: "italia",
    season: "2026",
    typeKey: "home",
    colorHex: "#003D7C",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 44.14, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831509&a=3013769&m=65912", title: "Camiseta Local infantil Italia Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jy7585_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=4f81c4e0da634c42a2bf232640d8bbb91f77c483" },
      { store: "FootStoreFR", price: 42.96, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjy7585-maillot-domicile-enfant-italie-coupe-du-monde-2026-boblue", title: "Maillot Domicile enfant Italie Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jy7585_3_apparel_on_model_standard_view_white.webp" },
      { store: "SportIsGoodES", price: 43.88, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301927916&a=3013769&m=65906", title: "Camiseta Local infantil Italia Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jy7585_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=4f81c4e0da634c42a2bf232640d8bbb91f77c483" },
      { store: "SportIsGoodFR", price: 44.26, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjy7585-maillot-domicile-enfant-italie-coupe-du-monde-2026-boblue", title: "Maillot Domicile enfant Italie Coupe du Monde 2026", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jy7585_3_apparel_on_model_standard_view_white.webp" },
      { store: "PlanetFoot", price: 74.99, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-italie-domicile-junior-2026-bleu%3Fvariant%3D51868458385749", title: "Maillot Italie Domicile Junior 2026 Bleu - Coupe du Monde", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-domicile-italie-2026-bleu-junior-adidas-planetfoot1.webp?v=1763248956" },
    ],
  },
{
    id: "juventus-away-kids",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 48.75, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41701521289&a=3013769&m=65912", title: "Camiseta de visitante niño Juventus de Turín 2025/26", inStock: true, sizes: ["7-8"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn5236_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=05a309be7d37c85bf708297338a9a6eab15c0de3" },
    ],
  },
{
    id: "juventus-goalkeeper-kids",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42530011697&a=3013769&m=65912", title: "Camiseta de portero local niño Juventus de Turín 2025/26", inStock: true, sizes: ["11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn5217_gris_1.webp&feedId=89032&k=7924e9be31da6612809e203a5ad02e0ac9eef91f" },
      { store: "FootStoreFR", price: 59.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn5217-maillot-de-gardien-domicile-enfant-juventus-turin-2025-26-gris", title: "Maillot de gardien Domicile enfant Juventus Turin 2025/26", inStock: true, sizes: ["11-12", "13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jn5217_gris_1.webp" },
      { store: "PlanetFoot", price: 44.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-gardien-junior-2025-26-noir%3Fvariant%3D50981178016085", title: "Maillot Juventus Turin Domicile Gardien Junior 2025/26 Noir", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-juventus-turin-25-26-enfants-adidas-planetfoot1.jpg?v=1755180203" },
    ],
  },
{
    id: "juventus-home-kids",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#000000",
    colorHexSecondary: "#FFFFFF",
    jerseyPattern: "stripes",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41446542656&a=3013769&m=65912", title: "Camiseta de local infantil Juventus de Turín 2025/26", inStock: true, sizes: ["11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn5237_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=cd7958f768f47139f841ff94bc936c801dc0c0aa" },
      { store: "SportIsGoodES", price: 45.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845360&a=3013769&m=65906", title: "Camiseta de local infantil Juventus de Turín 2025/26", inStock: true, sizes: ["11-12", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn5237_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=cd7958f768f47139f841ff94bc936c801dc0c0aa" },
      { store: "SportIsGoodFR", price: 45.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjn5237-maillot-domicile-enfant-juventus-turin-2025-26-white-black", title: "Maillot Domicile enfant Juventus Turin 2025/26", inStock: true, sizes: ["11-12", "15-16"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn5237_1_apparel_photography_front_center_view_white.jpg" },
    ],
  },
{
    id: "juventus-third-kids",
    teamKey: "juventus",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#000000",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 47.35, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42418817963&a=3013769&m=65912", title: "Camiseta Third niño Juventus de Turín 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kc3497_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=109f8c7f20c007b59adf6fecb3d180571865c775" },
      { store: "FootStoreFR", price: 46.06, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkc3497-maillot-third-enfant-juventus-turin-2025-26-black-ecrtin", title: "Maillot Third enfant Juventus Turin 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kc3497_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 47.07, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301840743&a=3013769&m=65906", title: "Camiseta Third niño Juventus de Turín 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kc3497_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=109f8c7f20c007b59adf6fecb3d180571865c775" },
      { store: "SportIsGoodFR", price: 47.44, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkc3497-maillot-third-enfant-juventus-turin-2025-26-black-ecrtin", title: "Maillot Third enfant Juventus Turin 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kc3497_1_apparel_photography_front_center_view_white.webp" },
      { store: "PlanetFoot", price: 44.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-third-junior-2025-26-noir%3Fvariant%3D51534371291477", title: "Maillot Juventus Turin Third Junior 2025/26 Noir", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-juventus-25-26-junior-adidas-planetfoot1.webp?v=1759851355" },
    ],
  },
{
    id: "liverpool-away-kids",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#F6EB61",
    colorHexSecondary: "#C8102E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.38, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42095532018&a=3013769&m=65912", title: "Camiseta de visitante niño Liverpool FC 2025/26", inStock: true, sizes: ["7-8", "9-10", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6453_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=2825241be604f4930431c0af3b4474cf2645f4f1" },
      { store: "SportIsGoodES", price: 45.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301844177&a=3013769&m=65906", title: "Camiseta de visitante niño Liverpool FC 2025/26", inStock: true, sizes: ["7-8", "9-10", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6453_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=2825241be604f4930431c0af3b4474cf2645f4f1" },
    ],
  },
{
    id: "liverpool-goalkeeper-kids",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 64.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42530174568&a=3013769&m=65912", title: "Camiseta de portero infantil Liverpool FC  tercera equipación 2025/26", inStock: true, sizes: ["11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6475_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=fdaf99410a7065d812c878e71d8d25e1701d93aa" },
      { store: "FootStoreFR", price: 48.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjz4089-maillot-de-gardien-de-but-enfant-liverpool-fc-2025-26-glomin", title: "Maillot de gardien de but enfant Liverpool FC 2025/26", inStock: true, sizes: ["13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jz4089_1_apparel_photography_front_center_view_white.webp" },
      { store: "PlanetFoot", price: 39.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-third-gardien-junior-2025-26-noir%3Fvariant%3D51325539680597", title: "Maillot Liverpool F.C. Third Gardien Junior 2025/26 Noir", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-liverpool-25-26-third-junior-adidas-planetfoot1.webp?v=1758728944" },
    ],
  },
{
    id: "liverpool-home-kids",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#C8102E",
    colorHexSecondary: "#F6EB61",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.38, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42095532062&a=3013769&m=65912", title: "Camiseta de local para niño Liverpool FC 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6436_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=938967b9662ed4e7e3b3b6e6b133a53d8efe7e16" },
      { store: "FootStoreFR", price: 44.16, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv6436-maillot-domicile-enfant-liverpool-fc-2025-26-strred", title: "Maillot Domicile enfant Liverpool FC 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv6436_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 45.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845365&a=3013769&m=65906", title: "Camiseta de local para niño Liverpool FC 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6436_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=938967b9662ed4e7e3b3b6e6b133a53d8efe7e16" },
      { store: "SportIsGoodFR", price: 45.49, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv6436-maillot-domicile-enfant-liverpool-fc-2025-26-strred", title: "Maillot Domicile enfant Liverpool FC 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv6436_1_apparel_photography_front_center_view_white.webp" },
    ],
  },
{
    id: "liverpool-third-kids",
    teamKey: "liverpool",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#C8102E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.38, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42375647640&a=3013769&m=65912", title: "Camiseta Third niño Liverpool FC 2025/26", inStock: true, sizes: ["9-10", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6468_seagre_1.webp&feedId=89032&k=d7987dbd7214a0dc71d3fe68150de820bc78269b" },
      { store: "FootStoreFR", price: 44.16, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv6468-maillot-third-enfant-liverpool-fc-2025-26-seagre", title: "Maillot Third enfant Liverpool FC 2025/26", inStock: true, sizes: ["9-10", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv6468_seagre_1.webp" },
      { store: "SportIsGoodES", price: 45.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301844238&a=3013769&m=65906", title: "Camiseta Third niño Liverpool FC 2025/26", inStock: true, sizes: ["9-10", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6468_seagre_1.webp&feedId=89044&k=d7987dbd7214a0dc71d3fe68150de820bc78269b" },
      { store: "SportIsGoodFR", price: 45.49, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv6468-maillot-third-enfant-liverpool-fc-2025-26-seagre", title: "Maillot Third enfant Liverpool FC 2025/26", inStock: true, sizes: ["9-10", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv6468_seagre_1.webp" },
      { store: "PlanetFoot", price: 39.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-third-junior-2025-26-vert%3Fvariant%3D51385406554453", title: "Maillot Liverpool F.C. Third Junior 2025/26 Vert", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-liverpool-fc-25-26-enfants-adulte-adidas-planetfoot1.webp?v=1757425405" },
    ],
  },
{
    id: "manutd-away-kids",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#000000",
    colorHexSecondary: "#DA020E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 45.38, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41949206684&a=3013769&m=65912", title: "Camiseta de visitante para niños Manchester United 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3030_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=389e90b9bb897b28fed260cba6a3f9fb3ff053d3" },
      { store: "SportIsGoodES", price: 45.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301836138&a=3013769&m=65906", title: "Camiseta de visitante para niños Manchester United 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3030_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=389e90b9bb897b28fed260cba6a3f9fb3ff053d3" },
    ],
  },
{
    id: "manutd-goalkeeper-kids",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44790774888&a=3013769&m=65912", title: "Maillot de portero tercero niño Manchester United 2025/26", inStock: true, sizes: ["11-12", "13-14"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3054_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=3766aff07f8cd020669907bcdc4a65b5225cb555" },
      { store: "FootStoreFR", price: 59.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp3054-maillot-de-gardien-third-enfant-manchester-united-2025-26-sescgr", title: "Maillot de gardien third enfant Manchester United 2025/26", inStock: true, sizes: ["11-12", "13-14"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jp3054_1_apparel_photography_front_center_view_white.jpg" },
      { store: "PlanetFoot", price: 44.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-gardien-junior-2025-26-vert%3Fvariant%3D51385052725589", title: "Maillot Manchester United Third Gardien Junior 2025/26 Vert", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-third-manchester-united-25-26-enfants-adidas-planetfoot1.webp?v=1757767447" },
    ],
  },
{
    id: "manutd-home-kids",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#DA020E",
    colorHexSecondary: "#F5D142",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 47.35, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41701521167&a=3013769&m=65912", title: "Camiseta Local niño Manchester United 2025/26", inStock: true, sizes: ["7-8", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fj%2Fp%2Fjp3013.webp&feedId=89032&k=d6bfe0ae94229cf82a0df7560a2c5400edb26f53" },
      { store: "FootStoreFR", price: 46.06, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp3013-maillot-domicile-enfant-manchester-united-2025-26-mufred", title: "Maillot Domicile enfant Manchester United 2025/26", inStock: true, sizes: ["7-8", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/j/p/jp3013.webp" },
      { store: "SportIsGoodES", price: 47.07, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301836065&a=3013769&m=65906", title: "Camiseta Local niño Manchester United 2025/26", inStock: true, sizes: ["7-8", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fj%2Fp%2Fjp3013.webp&feedId=89044&k=d6bfe0ae94229cf82a0df7560a2c5400edb26f53" },
      { store: "SportIsGoodFR", price: 47.44, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjp3013-maillot-domicile-enfant-manchester-united-2025-26-mufred", title: "Maillot Domicile enfant Manchester United 2025/26", inStock: true, sizes: ["7-8", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/j/p/jp3013.webp" },
    ],
  },
{
    id: "manutd-third-kids",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#DA020E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 40.77, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42529915215&a=3013769&m=65912", title: "Maillot Tercero niño Manchester United 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kd4227_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=fe807cee795f6d8cd3e6c3ecc14564858a6e1243" },
      { store: "FootStoreFR", price: 39.7, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd4227-maillot-third-enfant-manchester-united-2025-26-black", title: "Maillot Third enfant Manchester United 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kd4227_3_apparel_on_model_standard_view_white.webp" },
      { store: "SportIsGoodES", price: 40.52, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301844242&a=3013769&m=65906", title: "Maillot Tercero niño Manchester United 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kd4227_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=fe807cee795f6d8cd3e6c3ecc14564858a6e1243" },
      { store: "SportIsGoodFR", price: 40.91, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd4227-maillot-third-enfant-manchester-united-2025-26-black", title: "Maillot Third enfant Manchester United 2025/26", inStock: true, sizes: ["9-10", "11-12"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kd4227_3_apparel_on_model_standard_view_white.webp" },
      { store: "PlanetFoot", price: 39.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-junior-2025-26-noir%3Fvariant%3D51325528539477", title: "Maillot Manchester United Third Junior 2025/26 Noir", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-manchester-united-25-26-junior-adidas-planetfoot1.webp?v=1756542906" },
    ],
  },
{
    id: "portugal-away-kids",
    teamKey: "portugal",
    season: "2026",
    typeKey: "away",
    colorHex: "#046A38",
    colorHexSecondary: "#A5001E",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 60.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44284203570&a=3013769&m=65912", title: "Maillot Exterior niño Portugal Coupe du Monde 2026", inStock: true, sizes: ["5-6", "9-10"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783291-02-white-green-lagoon-69babfb8838ea-1.webp&feedId=89032&k=d8fcaab7090cca5a855a470216e09b7f0ced67e7" },
      { store: "SportIsGoodES", price: 60.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44390069249&a=3013769&m=65906", title: "Maillot Exterior niño Portugal Coupe du Monde 2026", inStock: true, sizes: ["5-6", "9-10"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783291-02-white-green-lagoon-69babfb8838ea-1.webp&feedId=89044&k=d8fcaab7090cca5a855a470216e09b7f0ced67e7" },
    ],
  },
{
    id: "psg-away-kids",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#DA291C",
    colorHexSecondary: "#001E62",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 57.24, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=38335048894&a=3013769&m=65912", title: "Camiseta de visitante niño PSG 2025/26", inStock: true, sizes: ["6-7", "8-9", "10-11", "12-13", "14-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_fn9126-101-phsfh001.webp&feedId=89032&k=7473c0539ae11e093f6ee9aa48b6b642aaff3579" },
    ],
  },
{
    id: "psg-goalkeeper-kids",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 89.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45081945842&a=3013769&m=65912", title: "Maillot de portero de manga larga niño PSG 2026/27", inStock: true, sizes: ["8-10", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ii3616-011_01.webp&feedId=89032&k=931a4f699ee483abfcc4813b8ebedd895435f29b" },
      { store: "FootStoreFR", price: 89.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fii3616-011-maillot-de-gardien-manches-longues-enfant-psg-2026-27-black-white", title: "Maillot de gardien manches longues enfant PSG 2026/27", inStock: true, sizes: ["8-10", "12-13", "13-15"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ii3616-011_01.webp" },
    ],
  },
{
    id: "psg-home-kids",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#001E62",
    colorHexSecondary: "#DA291C",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 57.24, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41624817789&a=3013769&m=65912", title: "Camiseta Local niño PSG 2025/26", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_nike_hj5293-411_01.webp&feedId=89032&k=629e66305be0034e20ea1191cd3aa8ff623552d2" },
      { store: "FootStoreFR", price: 55.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhj5293-411-maillot-domicile-enfant-psg-2025-26-midnight-navy-midnight-navy-white", title: "Maillot Domicile enfant PSG 2025/26", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_nike_hj5293-411_01.jpg" },
    ],
  },
{
    id: "psg-third-kids",
    teamKey: "psg",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#001E62",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 57.24, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42246665414&a=3013769&m=65912", title: "Camiseta Third niño PSG 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_08_nike_hm4126-680-phsfh001.webp&feedId=89032&k=27bfddab8e28224f6a8cfc1be47042e0842586ba" },
      { store: "FootStoreFR", price: 55.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhm4126-680-maillot-third-enfant-psg-2025-26-global-red-sport-red-hyper-royal", title: "Maillot Third enfant PSG 2025/26", inStock: true, sizes: ["7-8", "8-10", "10-12", "12-13"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_08_nike_hm4126-680-phsfh001.jpg" },
    ],
  },
{
    id: "realmadrid-away-kids",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "away",
    colorHex: "#FFFFFF",
    colorHexSecondary: "#FEBE10",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 47.35, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41718361168&a=3013769&m=65912", title: "Camiseta de visitante para niño Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3947_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=1c3de2d62eee59c99b535e38a10d7d6afd4ee849" },
      { store: "SportIsGoodES", price: 47.07, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845400&a=3013769&m=65906", title: "Camiseta de visitante para niño Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3947_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=1c3de2d62eee59c99b535e38a10d7d6afd4ee849" },
    ],
  },
{
    id: "realmadrid-goalkeeper-kids",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45184773283&a=3013769&m=65912", title: "Maillot de portero Local niño Real Madrid 2026/27", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas-kc3986-black-6a444bfa9e013-6.webp&feedId=89032&k=311c4af21071a4a961ce3ab7465c19383785a228" },
      { store: "FootStoreFR", price: 62.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp4176-maillot-de-gardien-domicile-enfant-real-madrid-2025-26-blubrs-rayblu", title: "Maillot de gardien Domicile enfant Real Madrid 2025/26", inStock: true, sizes: ["11-12"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jp4176_0.webp" },
      { store: "PlanetFoot", price: 64.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-domicile-gardien-junior-2025-26-bleu%3Fvariant%3D50923096146261", title: "Maillot Real Madrid Domicile Gardien Junior 2025/26 Bleu", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-domicile-real-madrid-2025-26-adidas-junior1.jpg?v=1754908482" },
    ],
  },
{
    id: "realmadrid-home-kids",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#F5F5F5",
    colorHexSecondary: "#8FB8E8",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 50.22, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41646236223&a=3013769&m=65912", title: "Camiseta Local niño Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jn8887_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=71cf5f291f42f910f7ba404707343dcbed591dbc" },
      { store: "FootStoreFR", price: 48.84, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn8887-maillot-domicile-enfant-real-madrid-2025-26-white", title: "Maillot Domicile enfant Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_adidas_jn8887_3_apparel_on_model_standard_view_white.jpg" },
      { store: "SportIsGoodES", price: 43.35, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43690621731&a=3013769&m=65906", title: "Camiseta Local niño Real Madrid", inStock: true, sizes: ["9-10", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_10_adidas_kd4339_1_apparel_photography_front_view_white.webp&feedId=89044&k=601325266f3232753331f6382b38b5061387f0f6" },
      { store: "SportIsGoodFR", price: 43.74, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd4339-maillot-domicile-enfant-real-madrid-white", title: "Maillot Domicile enfant Real Madrid", inStock: true, sizes: ["9-10", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_10_adidas_kd4339_1_apparel_photography_front_view_white.webp" },
    ],
  },
{
    id: "realmadrid-third-kids",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#FEBE10",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreES", price: 47.35, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42270681136&a=3013769&m=65912", title: "Maillot Tercero niño Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3930_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=4e92b81d4c887b4e2ee5cb563e6042ec74ef5cf5" },
      { store: "FootStoreFR", price: 46.06, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp3930-maillot-third-enfant-real-madrid-2025-26-blubir", title: "Maillot Third enfant Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jp3930_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 47.07, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845428&a=3013769&m=65906", title: "Maillot Tercero niño Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jp3930_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=4e92b81d4c887b4e2ee5cb563e6042ec74ef5cf5" },
      { store: "SportIsGoodFR", price: 47.44, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjp3930-maillot-third-enfant-real-madrid-2025-26-blubir", title: "Maillot Third enfant Real Madrid 2025/26", inStock: true, sizes: ["7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jp3930_1_apparel_photography_front_center_view_white.webp" },
      { store: "PlanetFoot", price: 49.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-third-junior-2025-26-bleu%3Fvariant%3D51325515858261", title: "Maillot Real Madrid Third Junior 2025/26 Bleu", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-real-madrid-25-26-junior-adidas-planetfoot1.webp?v=1756477772" },
    ],
  },
{
    id: "bayern-goalkeeper-kids",
    teamKey: "bayern",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreFR", price: 59.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp3694-maillot-de-gardien-third-enfant-bayern-munich-2025-26-purrub", title: "Maillot de gardien Third enfant Bayern Munich 2025/26", inStock: true, sizes: ["13-14"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jp3694_1_apparel_photography_front_center_view_white.jpg" },
      { store: "PlanetFoot", price: 44.95, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-gardien-junior-2025-26-rouge%3Fvariant%3D51325543547221", title: "Maillot Bayern Munich Third Gardien Junior 2025/26 Rouge", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-gardien-bayern-munich-25-26-junior-adidas-planetfoot3.webp?v=1756558034" },
    ],
  },
{
    id: "espana-goalkeeper-kids",
    teamKey: "espana",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreFR", price: 47.41, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkb8372-maillot-domicile-gardien-enfant-espagne-coupe-du-monde-2026-boaqua", title: "Maillot Domicile gardien enfant Espagne Coupe du Monde 2026", inStock: true, sizes: ["7-8", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_kb8372_0.webp" },
      { store: "PlanetFoot", price: 74.99, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-espagne-domicile-gardien-junior-2026-bleu%3Fvariant%3D51868458615125", title: "Maillot Espagne Domicile Gardien Junior 2026 Bleu - Coupe du Monde", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-espagne-2026-domicile-junior-adidas-planetfoot1.webp?v=1763313675" },
    ],
  },
{
    id: "paisesbajos-home-kids",
    teamKey: "paisesbajos",
    season: "2026",
    typeKey: "home",
    colorHex: "#FF6600",
    colorHexSecondary: "#1B3A6B",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "FootStoreFR", price: 59.49, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5165-809-maillot-domicile-enfant-pays-bas-coupe-du-monde-2026-hyper-crimson-black", title: "Maillot Domicile enfant Pays-Bas Coupe du Monde 2026", inStock: true, sizes: ["8-10", "10-12", "12-13", "13-15"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5165-809_01.webp" },
    ],
  },
{
    id: "francia-third-kids",
    teamKey: "francia",
    season: "2026/27",
    typeKey: "third",
    colorHex: "#1A1A1A",
    colorHexSecondary: "#0055A4",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "SportIsGoodES", price: 46.78, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45443706479&a=3013769&m=65906", title: "Maillot Tercero niño Francia 2026/27", inStock: true, sizes: ["7-8", "11-12", "13-14", "15-16"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_01_adidas_kg7528_1_apparel_photography_front_view_white.webp&feedId=89044&k=65255b2fe85b3a03d45d810c034c7c98cdc1843a" },
      { store: "SportIsGoodFR", price: 45.77, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkg7528-maillot-third-enfant-france-2026-27-bliss-pink", title: "Maillot Third enfant France 2026/27", inStock: true, sizes: ["7-8", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2026_01_adidas_kg7528_1_apparel_photography_front_view_white.webp" },
    ],
  },
  {
    id: "alemania-goalkeeper-kids",
    teamKey: "alemania",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "PlanetFoot", price: 44.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-allemagne-125-ans-gardien-junior-2025-26-bleu%3Fvariant%3D51159079027029", title: "Maillot Allemagne 125 Ans Gardien Junior 2025/26 Bleu", inStock: true, sizes: ["5-6", "7-8", "9-10", "11-12", "13-14", "15-16"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-anniversaire-allemagne-125-ans-enfant-adidas-planetfoot3.avif?v=1755695084" },
    ],
  },
  {
    id: "portugal-home-kids",
    teamKey: "portugal",
    season: "2026",
    typeKey: "home",
    colorHex: "#A5001E",
    colorHexSecondary: "#046A38",
    jerseyPattern: "solid",
    ageGroup: "kids",
    offers: [
      { store: "PlanetFoot", price: 79.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-portugal-domicile-2026-junior-puma%3Fvariant%3D52090727661909", title: "Maillot Portugal Domicile Junior 2026 Rouge - Coupe du Monde", inStock: true, sizes: ["5-6", "7-8", "9-10"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-portugal-domicile-2026-junior-puma-planetfoot2.webp?v=1767451832" },
    ],
  },
];

export function offerTotal(offer: Offer): number {
  return offer.price + offer.shipping;
}

export function bestOffer(product: Product): Offer | undefined {
  return [...product.offers]
    .filter((o) => o.inStock)
    .sort((a, b) => offerTotalInEUR(a) - offerTotalInEUR(b))[0];
}

export function bestOfferForCountry(
  product: Product,
  country: CountryCode
): Offer | undefined {
  return [...product.offers]
    .filter((o) => o.inStock && offerShipsTo(o.store, country))
    .sort((a, b) => offerTotalInEUR(a) - offerTotalInEUR(b))[0];
}

export function shipsToCountry(product: Product, country: CountryCode): boolean {
  return product.offers.some((o) => o.inStock && offerShipsTo(o.store, country));
}

export function availableSizes(product: Product): Size[] {
  const set = new Set<Size>();
  product.offers.forEach((o) => {
    if (o.inStock) o.sizes.forEach((s) => set.add(s));
  });
  return SIZES.filter((s) => set.has(s));
}

export function availableSizesForCountry(
  product: Product,
  country: CountryCode
): Size[] {
  const set = new Set<Size>();
  product.offers.forEach((o) => {
    if (o.inStock && offerShipsTo(o.store, country)) o.sizes.forEach((s) => set.add(s));
  });
  return SIZES.filter((s) => set.has(s));
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const SEASONS: string[] = Array.from(
  new Set(products.map((p) => p.season))
).sort((a, b) => b.localeCompare(a));
