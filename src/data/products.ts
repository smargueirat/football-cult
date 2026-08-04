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
export type Size = "S" | "M" | "L" | "XL" | "XXL";

export const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

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
  return new Intl.NumberFormat(OFFER_CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
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
      { store: "FansJerseyHub", price: 43.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fargentina-home-soccer-jersey-kit-2026-world-cup%3Fvariant%3D42724228989033", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/ArgentinaHomeWorldCupJerseysKit2026_1.png?v=1764764397" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831938&a=3013769&m=65912", inStock: true, sizes: ["M", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm8396_4_apparel_on_model_standard_view_white.webp&feedId=89032&k=a4b8fa91b7231e735c623310893c709382a2bbad" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932798&a=3013769&m=65906", inStock: true, sizes: ["XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm8396_4_apparel_on_model_standard_view_white.webp&feedId=89044&k=a4b8fa91b7231e735c623310893c709382a2bbad" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094299504&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F841749a208934f2ab4a0cfa1a8ae237d_9366%2FCamiseta_primera_equipacion_Argentina_26_Blanco_JM8396_21_model.jpg&feedId=92152&k=a338c7e80a6aefec58ce63631c6945faaea0b545" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096967179&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F841749a208934f2ab4a0cfa1a8ae237d_9366%2FCamisola_Principal_26_da_Argentina_Branco_JM8396_21_model.jpg&feedId=92150&k=9eed40cd2ecd528e3ed1bd8ff0c51de38b0c4198" },
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
      { store: "FansJerseyHub", price: 42.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fl-martinez-22-argentina-away-soccer-jersey-2026-world-cup%3Fvariant%3D47752567259241", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/argentinaawayfan_222026_1.webp?v=1783224447" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265206984&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F8379c4f319d34f948399a95e6f4b28ac_9366%2FCamiseta_segunda_equipacion_Argentina_26_Negro_JM8395_21_model.jpg&feedId=92152&k=40b92245b9cceb5fddba33f29e9fa302c14b2ad4" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43692242689&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fe1aababf51c948d68cdf4491cc33acba_9366%2FCamisola_Alternativa_26_da_Argentina_Azul_KF0321_HM1.jpg&feedId=92150&k=21ce26e766700c99e6179587121adb55e9e29557" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-home-soccer-jersey-2026-world-cup%3Fvariant%3D42706934825065", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/BrazilHomeSoccerJersey2026WorldCup_2.webp?v=1778049344" },
      { store: "FootStoreES", price: 86.71, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44374081627&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_if7054-724_01.webp&feedId=89032&k=72daf3c8a34828a58f79061845a8e0bfeb776364" },
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
      { store: "PlanetFoot", price: 54.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000086793%3Fvariant%3D53957404787029", inStock: true, sizes: ["M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8679-1.jpg?v=1779201425" },
      { store: "FansJerseyHub", price: 41.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-player-version-home-soccer-jersey-2026-world-cup%3Fvariant%3D42669729644649", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Spain_Player_Version_Home_Soccer_Jersey_2026_World_Cup_1.png?v=1762652078" },
      { store: "FootStoreES", price: 110.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831917&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz5786_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=c0d2d1b4e5d6cb247c9816817d418187725468f6" },
      { store: "FootStoreFR", price: 100.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn4390-maillot-domicile-espagne-coupe-du-monde-2026-vivred", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jn4390_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 110.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932743&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jz5786_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=c0d2d1b4e5d6cb247c9816817d418187725468f6" },
      { store: "SportIsGoodFR", price: 100.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjn4390-maillot-domicile-espagne-coupe-du-monde-2026-vivred", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jn4390_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094299250&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F866664f412bb4443bca790fed9c9f0a3_9366%2FCamiseta_primera_equipacion_Espana_26_Rojo_JN4390_21_model.jpg&feedId=92152&k=3147fbc911758b33b863018c56285f93ba4baca0" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096966931&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F866664f412bb4443bca790fed9c9f0a3_9366%2FCamisola_Principal_26_da_Espanha_Vermelho_JN4390_21_model.jpg&feedId=92150&k=62e9e3c30e8bcdcb3ade8efee634bb03d13b28fe" },
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
      { store: "PlanetFoot", price: 24.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-france-dkali-adulte-2025-26-bleu%3Fvariant%3D50991716663637", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/Maillot-France-Dkali-Adulte-2025_26-Bleu2.webp?v=1752613610" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634036936809", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/France_Home_Jersey_World_Cup_2026_2.webp?v=1766144118" },
      { store: "FootStoreES", price: 86.71, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44992302561&a=3013769&m=65912", inStock: true, sizes: ["S", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5300-480_01.webp&feedId=89032&k=29768505a38d91ac3ab2fa3e2f164bb1ae8d9a1c" },
      { store: "FootStoreFR", price: 85.72, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5300-480-maillot-domicile-france-coupe-du-monde-2026-game-royal-metallic-copper", inStock: true, sizes: ["S", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5300-480_01.webp" },
      { store: "SportIsGoodES", price: 67.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43574015741&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_12_adidas_kf1712_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=9a9425f3ee590c3d0e42a6ae50a407326e681e29" },
      { store: "SportIsGoodFR", price: 66.56, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkf1712-maillot-domicile-france-2025-26-semid-lucid-blue", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_12_adidas_kf1712_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570682104&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7a998a6cdd5e4b91a6c834352367cb84_9366%2FCamiseta_primera_equipacion_Francia_Azul_JM6958_21_model.jpg&feedId=92152&k=96fd22295283f412b714c6c0899721d54339a9c0" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570678463&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7a998a6cdd5e4b91a6c834352367cb84_9366%2FCamisola_Principal_da_Franca_Azul_JM6958_21_model.jpg&feedId=92150&k=801684a1cc61304cee4e15bb5ecd26817862a6f7" },
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
      { store: "DeporteOutletES", price: 37.99, shipping: 8.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44919264258&a=3013769&m=19598", inStock: true, sizes: ["S", "M"], imageUrl: "https://www.sportspar.de/media/image/29/34/fc/IX8095-1_600x600.jpg" },
      { store: "FootStoreES", price: 63.36, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41646236240&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8884_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=4be16423ba80eb06a0d89667afc592329abcf6d4" },
      { store: "FootStoreFR", price: 61.93, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjj1931-maillot-domicile-real-madrid-2025-26-white", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jj1931_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 63.09, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845393&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8884_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=4be16423ba80eb06a0d89667afc592329abcf6d4" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41530602511&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F0b3e6a5ef6cf471db6b0e17f0c22cc5c_9366%2FCamiseta_primera_equipacion_Real_Madrid_25-26_Blanco_JN8869_21_model.jpg&feedId=92152&k=2ca473787bb5b8b35a3fad1a6ac9e165e51d2e7e" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44926291670&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fc548a2002b64469790374b51af279885_9366%2FCamisola_Real_Madrid_26-27_Home_Branco_KC3989_21_model.jpg&feedId=92150&k=8f217614e6a25c2336cc2f9eecd936094e887866" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-home-soccer-jersey-2025-26%3Fvariant%3D42557169860713", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/86c6d74da59cbd7b06e351d6fda018dc.png?v=1758073956" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-terrace-icon-jersey-2025-26%3Fvariant%3D42660270604393", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Boca_Juniors_Icon_Jersey_202526.png?v=1762224920" },
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
      { store: "PlanetFoot", price: 89.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-domicile-homme-rouge%3Fvariant%3D49228463079765", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/IU1397_b2b012_plp.webp?v=1722949779" },
      { store: "FootStoreFR", price: 58.61, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fji7428-maillot-domicile-manchester-united-2025-26-mufred", inStock: true, sizes: ["M"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_ji7428_1_apparel_photography_front_center_view_white.jpg" },
      { store: "SportIsGoodFR", price: 59.95, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fji7428-maillot-domicile-manchester-united-2025-26-mufred", inStock: true, sizes: ["M"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_ji7428_1_apparel_photography_front_center_view_white.jpg" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41581831846&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9ae59d2a8c6249c9a3b1fefc31a9d595_9366%2FCamiseta_primera_equipacion_Manchester_United_25-26_Rojo_JI7428_21_model.jpg&feedId=92152&k=f644496248d2c1861b200bde48a29fdbec89637b" },
      { store: "AdidasPT", price: 85.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44745842333&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F76d03fbbd5dc4624ac1b596f1332392b_9366%2FCamisola_Curta_Manchester_United_FC_26-27_Home_Vermelho_KC4787_21_model.jpg&feedId=92150&k=bd38a62fe40532df2e28492319b75d4cfd40b44e" },
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
      { store: "PlanetFoot", price: 59.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000087110%3Fvariant%3D53957425398101", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8711-1.jpg?v=1779201517" },
      { store: "FootStoreES", price: 66.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831994&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm1380_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=1a9f3bc0e70afe7c2f888b91700182a560e0a9c5" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd8363-maillot-domicile-allemagne-coupe-du-monde-2026-white", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_kd8363_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 66.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301932843&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jm1380_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=1a9f3bc0e70afe7c2f888b91700182a560e0a9c5" },
      { store: "SportIsGoodFR", price: 66.1, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd8363-maillot-domicile-allemagne-coupe-du-monde-2026-white", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_kd8363_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094300482&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fad8d788b983145b9913d29c68367ecd6_9366%2FCamiseta_primera_equipacion_Alemania_26_Blanco_KD8363_21_model.jpg&feedId=92152&k=1193b6882b1631f4c4f794a0dd29ac312720f6e8" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096966058&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fad8d788b983145b9913d29c68367ecd6_9366%2FCamisola_Principal_26_da_Alemanha_Branco_KD8363_21_model.jpg&feedId=92150&k=e41795945f0b568908bcb62ce17594875b4c174a" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fitaly-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634053779561", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Italy_Home_Jersey_World_Cup_2026_2.webp?v=1765781283" },
      { store: "FootStoreES", price: 90.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087831506&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6934_3_apparel_on_model_standard_view_white.webp&feedId=89032&k=479064e2772ed5d7f282bddb21cfcae15e800534" },
      { store: "FootStoreFR", price: 45.64, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjy5633-maillot-domicile-italie-2026-white", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jy5633_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 90.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301927913&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6934_3_apparel_on_model_standard_view_white.webp&feedId=89044&k=479064e2772ed5d7f282bddb21cfcae15e800534" },
      { store: "SportIsGoodFR", price: 47.09, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjy5633-maillot-domicile-italie-2026-white", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jy5633_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094295102&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9716cb1d4ca14ca8a3ee4af6a3e2c31f_9366%2FCamiseta_primera_equipacion_Italia_26_Azul_JY7586_21_model.jpg&feedId=92152&k=c90c1da5c2652fadfa28bad5f4448c941d356d88" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096965381&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9716cb1d4ca14ca8a3ee4af6a3e2c31f_9366%2FCamisola_Principal_26_da_Italia_Azul_JY7586_21_model.jpg&feedId=92150&k=0946f5470c32292679753de0c7f6d65ed2941ed7" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-2026-world-cup-home-football-jersey%3Fvariant%3D42742727868521", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/englandhome2026_2.webp?v=1776585726" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44374081613&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5290-100_01.webp&feedId=89032&k=5bdb8ae4497cc5f7f438c91d9e656c4d86364915" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5290-100-maillot-domicile-angleterre-coupe-du-monde-2026-white-speed-red-obsidian-obsidian", inStock: true, sizes: ["S", "M", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5290-100_01.webp" },
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
      { store: "PlanetFoot", price: 44.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Ft-shirt-portugal-pumatech-homme-bleu-seafoam-coupe-du-monde%3Fvariant%3D53556155842901", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/t-shirt-portugal-pumatech-homme-coupe-du-monde-bleu-seafoam2.webp?v=1776701516" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fportugal-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634047160425", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Portugal_Home_Jersey_2026_2_ed666cd9-f9bb-4c0e-9d7b-f92dcbd5bba2.jpg?v=1764817208" },
      { store: "FootStoreES", price: 82.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43429697292&a=3013769&m=65912", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783279-01-club-red-green-lagoon-1.webp&feedId=89032&k=f1cee1fc4b6a6df89fa403cdaa4b04326a064609" },
      { store: "SportIsGoodES", price: 82.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43430682902&a=3013769&m=65906", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783279-01-club-red-green-lagoon-1.webp&feedId=89044&k=f1cee1fc4b6a6df89fa403cdaa4b04326a064609" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Furuguay-home-football-jersey-world-cup-2026%3Fvariant%3D42735948300393", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Uruguay_Home_Football_Jersey_World_Cup_2026_1.webp?v=1777537855" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926288&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io4680-425-royal-tint-obsidian-69ca9a902cd7b-1.webp&feedId=89032&k=4780a54f0874bb05eb7125178c79fd8c99232289" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio4680-425-maillot-domicile-uruguay-coupe-du-monde-2026-royal-tint-obsidian", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io4680-425-royal-tint-obsidian-69ca9a902cd7b-1.webp" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcolombia-home-soccer-jersey-2026-world-cup%3Fvariant%3D42632125677673", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/colombia_home_2026.png?v=1762398867" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43125141962&a=3013769&m=65912", inStock: true, sizes: ["S", "L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6972_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=929a0badd905569e5c89c9b31015f256e9e743a1" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45376303136&a=3013769&m=65906", inStock: true, sizes: ["L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_12_adidas_jl6972_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=929a0badd905569e5c89c9b31015f256e9e743a1" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094291634&a=3013769&m=77008", inStock: true, sizes: ["S", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcb30bb7e33dc49afa7d3dcb0da3bdb4a_9366%2FCamiseta_primera_equipacion_Colombia_26_Amarillo_JL6972_21_model.jpg&feedId=92152&k=ec65beae90739d63406c225a25400a5552fe3754" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096963439&a=3013769&m=77026", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcb30bb7e33dc49afa7d3dcb0da3bdb4a_9366%2FCamisola_Principal_26_da_Colombia_Amarelo_JL6972_21_model.jpg&feedId=92150&k=accea9c86e1686b70ea41c12d78fde41644fbd13" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fnetherlands-2026-world-cup-home-football-jersey%3Fvariant%3D42961846501481", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/NetherlandsHomeStadiumShirt2026_2.avif?v=1774490642" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926283&a=3013769&m=65912", inStock: true, sizes: ["S", "M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5334-809_04.webp&feedId=89032&k=32c5cb1d07f1c1b97cc66447d87ece67823e2909" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5334-809-maillot-domicile-pays-bas-coupe-du-monde-2026-hyper-crimson-black", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5334-809_04.webp" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcroatia-2026-world-cup-home-football-jersey%3Fvariant%3D42736040411241", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/6_90b404c6-206f-45b9-b7eb-1fcc8b9abca3.webp?v=1776237973" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973668&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8621-100-white-69ef67d574381-1.webp&feedId=89032&k=6fd1cb77c13c139317a6e4347de387bedd35d559" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio8621-100-maillot-domicile-croatie-coupe-du-monde-2026-white", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8621-100-white-69ef67d574381-1.webp" },
      { store: "SportIsGoodES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335325&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8621-100-white-69ef67d574381-1.webp&feedId=89044&k=6fd1cb77c13c139317a6e4347de387bedd35d559" },
      { store: "SportIsGoodFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fio8621-100-maillot-domicile-croatie-coupe-du-monde-2026-white", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8621-100-white-69ef67d574381-1.webp" },
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
      { store: "PlanetFoot", price: 39.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-fc-barcelone-connect-blaugrana-navy-2026%3Fvariant%3D53802756211029", inStock: true, sizes: ["S", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-football-fc-barcelone-connect-blaugrana-navy-20264.jpg?v=1778253327" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-home-soccer-jersey-2025-26%3Fvariant%3D42557200597097", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Barcelona_Home_Soccer_Jersey_2025_26_Barcelona_Home_Soccer_Jersey_2025_26-1.png?v=1760082704" },
      { store: "FootStoreES", price: 73.1, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44291084666&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hj4590-456-phsfh001.webp&feedId=89032&k=97609522fc0d8f0c9d0156cefc15a48558a6c170" },
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
      { store: "PlanetFoot", price: 39.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-chemise-liverpool-f-c-us-pack-adulte-2025-26-rouge%3Fvariant%3D51159085646165", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/haut-liverpool-fc-us-pack-adulte-adidas-planetfoot1.webp?v=1755881450" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-home-soccer-jersey-2025-26%3Fvariant%3D42557153345641", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Liverpool_Home_Soccer_Jersey_2025_26-1.png?v=1774927826" },
      { store: "FootStoreES", price: 62.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42095532069&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6423_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=c05489700eddd294fc6885fcfd7d7c0cb0e2a575" },
      { store: "FootStoreFR", price: 61.07, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv6423-maillot-domicile-liverpool-fc-2025-26-strred", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv6423_1_apparel_photography_front_center_view_white.jpg" },
      { store: "SportIsGoodES", price: 62.2, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845380&a=3013769&m=65906", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6423_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=c05489700eddd294fc6885fcfd7d7c0cb0e2a575" },
      { store: "SportIsGoodFR", price: 62.45, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv6423-maillot-domicile-liverpool-fc-2025-26-strred", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv6423_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972277543&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F2e9b3d1665f944f09c921c0174b355bf_9366%2FCamiseta_Liverpool_FC_25-26_Home_Rojo_JV6423_21_model.jpg&feedId=92152&k=9a85f4b95dcbb9dae26332c2df6913bfa03f1e33" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972279593&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F2e9b3d1665f944f09c921c0174b355bf_9366%2FCamisola_Principal_25-26_do_Liverpool_FC_Vermelho_JV6423_21_model.jpg&feedId=92150&k=d5bd5b8ce3f6be2203ce980140e2032d130609c9" },
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
      { store: "PlanetFoot", price: 89.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-stadium-2026-27-homme-rouge%3Fvariant%3D53957414977877", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-bayern-munich-stadium-2026-2027-homme-rouge-kg2243-1.webp?v=1784378540" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41666325423&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj2137_0.webp&feedId=89032&k=3ebf6034a9eec25021e177a7c87578fc4174e582" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjj2137-maillot-domicile-bayern-munich-2025-26-red", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_adidas_jj2137_0.jpg" },
      { store: "SportIsGoodES", price: 63.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301834694&a=3013769&m=65906", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj2137_0.webp&feedId=89044&k=3ebf6034a9eec25021e177a7c87578fc4174e582" },
      { store: "SportIsGoodFR", price: 64.23, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjj2137-maillot-domicile-bayern-munich-2025-26-red", inStock: true, sizes: ["L"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_adidas_jj2137_0.jpg" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41562954582&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F637467085ad14aad8cb0acf249276c31_9366%2FCamiseta_primera_equipacion_Bayern_25-26_Rojo_JJ2137_21_model.jpg&feedId=92152&k=ff7faf51f2729fd462f7dfafff56a61345fc92fb" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41562962668&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F637467085ad14aad8cb0acf249276c31_9366%2FCamisola_Principal_25-26_do_FC_Bayern_Munchen_Vermelho_JJ2137_21_model.jpg&feedId=92150&k=ef296570761f4bbe69e4caef77e758a94b224042" },
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
      { store: "PlanetFoot", price: 24.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-paris-saint-germain-fan-adulte-2025-26-bleu%3Fvariant%3D51402024649045", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-psg-fan-2025-26-bleu-adulte-planetfoot1.jpg?v=1758377994" },
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fpsg-player-version-home-soccer-jersey-2025-26-navy-club-world-cup%3Fvariant%3D42557261906025", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/91c10490bb6b481ab778002478b10c64.png?v=1758074620" },
      { store: "FootStoreES", price: 109.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44783130096&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ii1885-417_01.webp&feedId=89032&k=44e8a96c6fed9924a4ddd08aabd82f166cc7f203" },
      { store: "FootStoreFR", price: 109.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fii1885-417-maillot-domicile-psg-2026-27-old-royal-white-university-red-white", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ii1885-417_01.webp" },
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
      { store: "PlanetFoot", price: 59.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-homme-2025-26-blanc%3Fvariant%3D50897551950165", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/Maillot-Juventus-Turin-Domicile-homme-2025_26-Blanc1.webp?v=1749412808" },
      { store: "FootStoreES", price: 58.37, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41446542641&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jj4320_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=2001bf1a1b3858c7d860f1ca8ec36793dcce2c85" },
      { store: "FootStoreFR", price: 57.08, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjj4320-maillot-domicile-juventus-turin-2025-26-white-black", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jj4320_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 58.11, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301836082&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jj4320_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=2001bf1a1b3858c7d860f1ca8ec36793dcce2c85" },
      { store: "SportIsGoodFR", price: 58.38, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjj4320-maillot-domicile-juventus-turin-2025-26-white-black", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jj4320_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41299301716&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ffe0a2e213d8d4ce2accb8324679b8e5a_9366%2FCamiseta_primera_equipacion_Juventus_25-26_Blanco_JJ4320_21_model.jpg&feedId=92152&k=50933479dcddaa1674736281986926603961b0c8" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44729066355&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fc9f22503c4904177b823f5d550912a45_9366%2FCamisola_Juventus_26-27_Home_Branco_KB8823_21_model.jpg&feedId=92150&k=4002d8d094743e2f472afa6a3ecb4e1d44923289" },
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
      { store: "PlanetFoot", price: 69.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000091377%3Fvariant%3D54464904102229", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_9137-1.jpg?v=1785005278" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41701521183&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jj4323_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=a9102f210281a6fb0f0cbbf8ddbd74471bf2a949" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41590987988&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F8c6cd78831754419beba203bacb3d1f2_9366%2FCamiseta_segunda_equipacion_Juventus_25-26_Azul_JJ4323_21_model.jpg&feedId=92152&k=290f465711cbc768a25fc0307cc596106de0a24b" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45355985411&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fbdf794696e314670bf859ae4694318a6_9366%2FCamisola_Juventus_26-27_Away_Rosa_KB8813_21_model.jpg&feedId=92150&k=1e52aa7a328def794fc722dcfdcfbab8ef96303a" },
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
      { store: "PlanetFoot", price: 60.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-river-plate-domicile-homme-2025-26-blanc%3Fvariant%3D51421275455829", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-river-plate-25-26-domicile-adulte-adidas-planetfoot1.webp?v=1758730642" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-home-soccer-jersey-2025-26-blue%3Fvariant%3D42557244113001", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Chelsea_Home_Soccer_Jersey_2025_26_Blue1.png?v=1760182866" },
      { store: "FootStoreES", price: 73.1, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41368868581&a=3013769&m=65912", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_nike_hj4589-496_1.webp&feedId=89032&k=9f5b680c799085eb4705cf60f7ea408d6ac737df" },
      { store: "FootStoreFR", price: 71.65, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhj4589-496-maillot-domicile-chelsea-2025-26-rush-blue-white-speed-red-white", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_nike_hj4589-496_1.webp" },
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
      { store: "FansJerseyHub", price: 47.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fhavertz-7-germany-player-version-away-soccer-jersey-2026-world-cup%3Fvariant%3D47711689408617", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/germanyawayfan_7-2_aa5033f6-4ab7-4156-8981-647f24dd7720.webp?v=1782100554" },
      { store: "FootStoreES", price: 66.16, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890852&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn2074_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=59b81a2f0c43c9df878660b1234b1cbc760c15c6" },
      { store: "SportIsGoodES", price: 67.85, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365711&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn2074_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=59b81a2f0c43c9df878660b1234b1cbc760c15c6" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265204653&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fa3eb6fcc22434146abe924050e0a91ad_9366%2FCamiseta_segunda_equipacion_Alemania_26_Azul_JN2074_21_model.jpg&feedId=92152&k=11a8a240e4958def20c236f9fa1de72176fccaf6" },
      { store: "AdidasPT", price: 70.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44267895747&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fb77fff63a8db4413b9422887ffa0ccfe_9366%2FCamisola_Alternativa_26_da_Alemanha_Azul_JZ4568_21_model.jpg&feedId=92150&k=ffef37a4ba5614a195f88ea48a0e7009400ff4e2" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fgermany-goalkeeper-soccer-jersey-2026-world-cup%3Fvariant%3D42791058767977", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/germany_goalkeeper_jersey_2026_1.webp?v=1767519814" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43852271896&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_kd5121_0.webp&feedId=89032&k=c8180c6dfb54ccd6de948da373dc4b84b4aced7a" },
      { store: "FootStoreFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd5121-maillot-de-gardien-domicile-allemagne-coupe-du-monde-2026-actgrn", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_kd5121_0.webp" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44487548744&a=3013769&m=65906", inStock: true, sizes: ["M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_kd5121_0.webp&feedId=89044&k=c8180c6dfb54ccd6de948da373dc4b84b4aced7a" },
      { store: "SportIsGoodFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd5121-maillot-de-gardien-domicile-allemagne-coupe-du-monde-2026-actgrn", inStock: true, sizes: ["M"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_kd5121_0.webp" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094289571&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7549fd098cf04f7cad8a2af08f2bad9e_9366%2FCamiseta_de_portero_primera_equipacion_Alemania_26_Verde_KD5121_21_model.jpg&feedId=92152&k=772fb18e9c429ed564771e02b20d723037ccc0cb" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096958515&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7549fd098cf04f7cad8a2af08f2bad9e_9366%2FCamisola_Principal_de_Guarda-redes_26_da_Alemanha_Verde_KD5121_21_model.jpg&feedId=92150&k=0d0e04d57e6b3107cdf6e32e3b7a25a4ac335965" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-third-away-soccer-jersey-2025-26%3Fvariant%3D42557191553129", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/barcelona_third_away_jersey_2025_1.png?v=1759219885" },
      { store: "FootStoreES", price: 73.1, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42177817663&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hm3201-855-phsfh001-ss25.webp&feedId=89032&k=74179f0a31d5c307468729e4432203e324bd1a31" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-away-soccer-jersey-2025-26-white%3Fvariant%3D42557241917545", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Bayern_Munich_Away_Soccer_Jersey_2025_26_White1.png?v=1760322380" },
      { store: "FootStoreES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45443802616&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fj%2Fz%2Fjz3069.webp&feedId=89032&k=21d8dc2f5262c10d6cce2e46f167f935cd4e3b6a" },
      { store: "SportIsGoodES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45443710850&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fj%2Fz%2Fjz3069.webp&feedId=89044&k=21d8dc2f5262c10d6cce2e46f167f935cd4e3b6a" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41205144020&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F1e69f796f20e4af288539ad0fdab5eb4_9366%2FCamiseta_segunda_equipacion_FC_Bayern_25-26_Blanco_JJ2143_21_model.jpg&feedId=92152&k=a2623107242a7aa442ce4556355a5fc67083ae97" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45347614191&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F4271d7aa21084f83b5872892760d2e84_9366%2FCamisola_FC_Bayern_Munchen_26-27_Away_Branco_JZ3077_21_model.jpg&feedId=92150&k=8255afeab6a05e2ca329d4ede1e5feb4e3882204" },
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
      { store: "PlanetFoot", price: 74.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-homme-2025-26-noir%3Fvariant%3D51353837535573", inStock: true, sizes: ["S", "M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-fc-bayern-munich-25-26-adulte-adidas-planetfoot1.webp?v=1756563493" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-third-away-soccer-jersey-2025-26%3Fvariant%3D42557143744617", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Bayern_Munich_Third_Away_Soccer_Jersey_2025_26.png?v=1760943255" },
      { store: "FootStoreFR", price: 64.65, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fke6801-maillot-third-bayern-munich-2025-26-black-halivo", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_ke6801_3_apparel_on_model_standard_view_white.webp" },
      { store: "SportIsGoodFR", price: 66.1, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fke6801-maillot-third-bayern-munich-2025-26-black-halivo", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_ke6801_3_apparel_on_model_standard_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41981562750&a=3013769&m=77008", inStock: true, sizes: ["S", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F49bc73dfd3614dd8bbb60cee4331e882_9366%2FCamiseta_tercera_equipacion_FC_Bayern_25-26_Negro_KE6801_21_model.jpg&feedId=92152&k=272658667bf0d750fd2984be47794350a48b4439" },
      { store: "AdidasPT", price: 105.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41981561190&a=3013769&m=77026", inStock: true, sizes: ["S", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9b87e68616064dac999e972239f2aca5_9366%2FCamisola_do_Terceiro_Equipamento_25-26_do_FC_Bayern_Munchen_Preto_KE6802_HM1.jpg&feedId=92150&k=d8fe6c86db23304c5f0d289c99bd9481b711bc86" },
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
      { store: "PlanetFoot", price: 64.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-gardien-homme-2025-26-rouge%3Fvariant%3D51325544235349", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-gardien-bayern-munich-25-26-adulte-adidas-planetfoot1.webp?v=1756559240" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-goalkeeper-soccer-jersey-2025-26%3Fvariant%3D42557136175209", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/b2fb77a0c3f71f6dce754f6fb8ea29ef.png?v=1758073698" },
      { store: "FootStoreES", price: 94.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43724611538&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn8517_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=871a5ac7476e2975296900b46fb052c581f324f7" },
      { store: "FootStoreFR", price: 83.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn8517-maillot-bayern-munich-gardien-2025-26-purrub", inStock: true, sizes: ["S", "M", "L"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn8517_1_apparel_photography_front_center_view_white.jpg" },
      { store: "AdidasES", price: 120.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=37867477771&a=3013769&m=77008", inStock: true, sizes: ["M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcc919d29365847b98019af5e00fcbdff_9366%2FCamiseta_portero_FC_Bayern_Icon_Negro_HT8835_21_model.jpg&feedId=92152&k=ddfd563aaa0ad9780a666187112cfdfa8e0b5173" },
      { store: "AdidasPT", price: 48.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=37867478580&a=3013769&m=77026", inStock: true, sizes: ["M"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fcc919d29365847b98019af5e00fcbdff_9366%2FCamisola_de_Guarda-redes_Icon_do_FC_Bayern_Munchen_Preto_HT8835_21_model.jpg&feedId=92150&k=4e70c139d38cb71e60baaba787168211feeadf7a" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-away-soccer-jersey-2025-26%3Fvariant%3D42557168484457", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/441c3efad7fae985971a17f4b80580ea.png?v=1758073946" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-away-soccer-jersey-2026-world-cup%3Fvariant%3D42710746693737", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Brazil_Away_Jersey_World_Cup_2026_2.webp?v=1765245417" },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-player-version-third-away-soccer-jersey-2026-world-cup%3Fvariant%3D42707026968681", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Brazil_Player_Version_Third_Away_Soccer_Jersey_2026_World_Cup_11.jpg?v=1764055948" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-goalkeeper-soccer-jersey-world-cup-2026%3Fvariant%3D43162048397417", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/BrazilGoalkeeperJerseyWorldCup2026_3.webp?v=1777278166" },
      { store: "FootStoreES", price: 69.05, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44645300845&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_if3900-741_04.webp&feedId=89032&k=5e22c0d7ecbdfc4c32ca88061dd64a04e65d23e5" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-away-soccer-jersey-2025-26-white%3Fvariant%3D42557257744489", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/eac3b5b68e76822f38daba2e8cea8fd7_32facad5-ad21-46d4-abe3-d2e581bec0c5.png?v=1758074597" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-third-away-soccer-jersey-2025-26%3Fvariant%3D42591174819945", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/ChelseaThirdAwaySoccerJersey2025_26_1.png?v=1759221142" },
      { store: "FootStoreES", price: 71.21, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44645292560&a=3013769&m=65912", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_09_nike_hm3202-011_0.webp&feedId=89032&k=84ade01617c17927a67a8848fa10bdaf414696f6" },
      { store: "FootStoreFR", price: 69.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhm3202-011-maillot-third-chelsea-2025-26-black-field-silver-field-silver", inStock: true, sizes: ["S"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/2/0/2025_09_nike_hm3202-011_0.jpg" },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcolombia-player-version-away-soccer-jersey-2026-world-cup%3Fvariant%3D42729803022441", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/ColombiaAwaySoccerJersey2026PlayerVersion_1.webp?v=1773282782" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269891004&a=3013769&m=65912", inStock: true, sizes: ["M", "L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jl6974_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=2ca24e4d72ae29c539156487bda6ac9fc9ba59a7" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365794&a=3013769&m=65906", inStock: true, sizes: ["M", "L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_jl6974_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=2ca24e4d72ae29c539156487bda6ac9fc9ba59a7" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265204499&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F70f4bc91f935442e8cac80543f1bb140_9366%2FCamiseta_segunda_equipacion_Colombia_26_Azul_JL6974_21_model.jpg&feedId=92152&k=47cf1abba6f138bb9d4c45a15369035ebf94e6be" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44267895140&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F70f4bc91f935442e8cac80543f1bb140_9366%2FCamisola_Alternativa_26_da_Colombia_Azul_JL6974_21_model.jpg&feedId=92150&k=4380d48d4f2255c00194e08d250f68197f02646b" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcroatia-2026-world-cup-away-football-jersey%3Fvariant%3D42973969973353", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/8_e70d7e54-97a0-4b83-b7f0-76b72de86e24.webp?v=1774316659" },
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973697&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8619-455-deep-royal-blue-69ef682c1ed2e-4.webp&feedId=89032&k=446796584f92b8f8401d474f5db476f6dabd5255" },
      { store: "SportIsGoodES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335354&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8619-455-deep-royal-blue-69ef682c1ed2e-4.webp&feedId=89044&k=446796584f92b8f8401d474f5db476f6dabd5255" },
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
      { store: "FansJerseyHub", price: 37.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-away-soccer-jersey-2026-world-cup-long-sleeve%3Fvariant%3D43131519271017", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/SpainAwayLongSleeveJerseyWorldCup2026_2.webp?v=1776326893" },
      { store: "FootStoreES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44972135372&a=3013769&m=65912", inStock: true, sizes: ["XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn4397_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=30bd73b835c97dd4e6d56a76f4a0880e9860377f" },
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
      { store: "FansJerseyHub", price: 34.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-home-goalkeeper-jersey-2026-world-cup%3Fvariant%3D42713300172905", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Spain_2026_Home_Goalkeeper_Jersey_1.jpg?v=1764323097" },
      { store: "FootStoreES", price: 95.37, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44216768825&a=3013769&m=65912", inStock: true, sizes: ["XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_07_adidas_kc3084_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=93d07ba9fa9de5374d99b7332c3b965e9d1d9711" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094290000&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F306d4e607aee4a148d0367de314782ec_9366%2FCamiseta_de_portero_primera_equipacion_Espana_26_Azul_KB8371_21_model.jpg&feedId=92152&k=50336f025c887d9a65d8ff6f4a020cb1e71aa8de" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096957488&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F306d4e607aee4a148d0367de314782ec_9366%2FCamisola_Principal_de_Guarda-Redes_26_da_Espanha_Azul_KB8371_21_model.jpg&feedId=92150&k=6aed226aeb383f4bedc3f9e04ea27cd01020541f" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-away-soccer-jersey-2026-world-cup%3Fvariant%3D43013419106409", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/France2026awayjersey_1_8343c88f-f693-4341-92d5-f8ce052bf427.webp?v=1773914236" },
      { store: "FootStoreES", price: 149.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42613754369&a=3013769&m=65912", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ih0804-110_pale-ivory-sail-bright-blue-light-madder-root_7.webp&feedId=89032&k=8251273dcb1100b99d24d57d312352954f8e7a74" },
      { store: "SportIsGoodES", price: 76.5, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43574015747&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_12_adidas_jy0843_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=f57386e1dd5777d768d1db8c6deec43666f08eb2" },
      { store: "AdidasES", price: 90.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570679950&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F6d1f55123d6b469cbc50bdd4c1535ad7_9366%2FCamiseta_segunda_equipacion_Francia_Blanco_KA3300_21_model.jpg&feedId=92152&k=0990d94274f67a902a04e2d85c45e3021b0b144e" },
      { store: "AdidasPT", price: 90.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44570674785&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F6d1f55123d6b469cbc50bdd4c1535ad7_9366%2FCamisola_alternativa_da_Franca_Branco_KA3300_21_model.jpg&feedId=92150&k=8b8ef16af3cab194d15cd10a1eec17eeb94f754e" },
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
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926234&a=3013769&m=65912", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ib5304-010_01.webp&feedId=89032&k=b16607e44bd3e5b0037a2e30581dc1143cb8b008" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fib5304-010-maillot-de-gardien-france-coupe-du-monde-2026-black-medium-ash-monarch-igloo", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike_ib5304-010_01.webp" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-away-soccer-jersey-2026-world-cup%3Fvariant%3D42634045194345", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Englandawayjersey2026_8.webp?v=1776328101" },
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
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000088506%3Fvariant%3D54053031346517", inStock: true, sizes: ["S", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/big_8850-1.jpg?v=1780401355" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fitaly-away-soccer-jersey-2026-world-cup%3Fvariant%3D42648228823145", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/italy_away_2026.png?v=1762399188" },
      { store: "FootStoreES", price: 66.16, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44269890955&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_kc8704_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=b3ec5316a7e5c30cdc259273b4c320822ab4e291" },
      { store: "SportIsGoodES", price: 67.85, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44270365777&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_03_adidas_kc8704_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=b3ec5316a7e5c30cdc259273b4c320822ab4e291" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44265207190&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F75936dd14cc7497f82e20014ecee59bf_9366%2FCamiseta_segunda_equipacion_Italia_26_Azul_JY5680_21_model.jpg&feedId=92152&k=365ed0bda42dd34ba085ab9f3b1e4976fd08de26" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44267899840&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F75936dd14cc7497f82e20014ecee59bf_9366%2FCamisola_Alternativa_26_da_Italia_Azul_JY5680_21_model.jpg&feedId=92150&k=34e4a6152c4e3ec1e223fc36a300166e11a23e28" },
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
      { store: "PlanetFoot", price: 44.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-third-junior-2025-26-noir%3Fvariant%3D51534371389781", inStock: true, sizes: ["M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-juventus-25-26-junior-adidas-planetfoot1.webp?v=1759851355" },
      { store: "FootStoreES", price: 63.36, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42530174584&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kc3223_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=14712536193ce2c36296be7ab8460362d3cfe4f5" },
      { store: "FootStoreFR", price: 61.93, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkc3223-maillot-third-juventus-turin-2025-26-pursul", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_kc3223_1_apparel_photography_front_center_view_white.jpg" },
      { store: "SportIsGoodES", price: 63.09, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301840763&a=3013769&m=65906", inStock: true, sizes: ["S", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas-kc3486-black-ecrtin-6a58becf55734-1.webp&feedId=89044&k=49321b190131ae9a1e8b603e079f0efb60f1ab45" },
      { store: "SportIsGoodFR", price: 63.33, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkc3486-maillot-third-juventus-turin-2025-26-black-ecrtin", inStock: true, sizes: ["S", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas-kc3486-black-ecrtin-6a58becf55734-1.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45256778802&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fd5391efe8b6f4675a243e15c5f2aa956_9366%2FCamiseta_tercera_equipacion_Juventus_25-26_Negro_KC3491_21_model.jpg&feedId=92152&k=b15cac81426f613a09955b5e7a788f5b35de2c00" },
      { store: "AdidasPT", price: 70.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45256773512&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fd5391efe8b6f4675a243e15c5f2aa956_9366%2FCamisola_do_Terceiro_Equipamento_25-26_da_Juventus_Preto_KC3491_21_model.jpg&feedId=92150&k=87687fa44c67f7b6cd1bfc7f59cbf649a1b873d6" },
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
      { store: "PlanetFoot", price: 50.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-gardien-homme-2025-26-noir%3Fvariant%3D50981178310997", inStock: true, sizes: ["M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-juventus-turin-25-26-adidas-planetfoot1.jpg?v=1755180645" },
      { store: "FootStoreES", price: 77.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42530011707&a=3013769&m=65912", inStock: true, sizes: ["M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jn5219_gris_1.webp&feedId=89032&k=217bbe918fb6a320ce3bb2e7d978285a0ac96986" },
      { store: "FootStoreFR", price: 67.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn5219-maillot-de-gardien-domicile-juventus-turin-2025-26-gris", inStock: true, sizes: ["M", "L"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jn5219_gris_1.jpg" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44728893168&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fc775a7fb1f0f49fdb56b251b5526955e_9366%2FCamiseta_de_portero_primera_equipacion_Juventus_26-27_Naranja_KB8818_21_model.jpg&feedId=92152&k=3ddea30d1f8289fecbcbce0ba2efd8cd76d13c2e" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45355988299&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F3e1739be80f4496ba2c7f05df6d29f92_9366%2FCamisola_Juventus_26-27_Away_Goalkeeper_Verde_KB8827_21_model.jpg&feedId=92150&k=468a978690d5fbaf1a941344e0fbb57dfee9e203" },
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
      { store: "PlanetFoot", price: 50.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-exterieur-homme-2025-26-beige%3Fvariant%3D51325520838997", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-exterieur-liverpool-fc-25-26-adulte-adidas-planetfoot1.webp?v=1756479104" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-away-soccer-jersey-2025-26%3Fvariant%3D42557140729961", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Liverpool_Away_Soccer_Jersey_2025_26-1.png?v=1774927948" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972277361&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F96d873b3322b42a3afe56931da8f56be_9366%2FCamiseta_segunda_equipacion_Liverpool_FC_25-26_Blanco_JV6487_21_model.jpg&feedId=92152&k=320697cd5f84b18ae54a95e347aaf2bdcf240359" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45397544917&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F9a14f898beaf4889a1610dd52347684e_9366%2FCamisola_Liverpool_FC_26-27_Away_Branco_KA6860_21_model.jpg&feedId=92150&k=252ec32ec5d94fa8b80c9ee34423769407176a58" },
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
      { store: "PlanetFoot", price: 39.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-third-junior-2025-26-vert%3Fvariant%3D51385406619989", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-liverpool-fc-25-26-enfants-adulte-adidas-planetfoot1.webp?v=1757425405" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-third-away-soccer-jersey-2025-26%3Fvariant%3D42591141724265", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/liverpoolthirdawayjersey202526_1.png?v=1774928407" },
      { store: "FootStoreES", price: 59.96, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42381633159&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6428_2.webp&feedId=89032&k=0f867e31f13ed4790328f9d8592e8eaf33ba63ef" },
      { store: "FootStoreFR", price: 58.61, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv6428-maillot-third-liverpool-fc-2025-26-seagre", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv6428_2.jpg" },
      { store: "SportIsGoodES", price: 59.69, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301845433&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv6428_2.webp&feedId=89044&k=0f867e31f13ed4790328f9d8592e8eaf33ba63ef" },
      { store: "SportIsGoodFR", price: 59.95, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv6428-maillot-third-liverpool-fc-2025-26-seagre", inStock: true, sizes: ["S", "M", "XL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv6428_2.jpg" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42382383639&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F21d0abf65dcd4eaebbb1b3e8f1ca3d99_9366%2FCamiseta_tercera_equipacion_Liverpool_FC_25-26_Verde_JV6428_21_model.jpg&feedId=92152&k=9e327c2af9227d116734c0ae2023eddeb31cf0ba" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42382384159&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F21d0abf65dcd4eaebbb1b3e8f1ca3d99_9366%2FCamisola_do_Terceiro_Equipamento_25-26_do_Liverpool_FC_Verde_JV6428_21_model.jpg&feedId=92150&k=8e495f38acfce47c0b6a9ccaf1e201f3ce78b681" },
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
      { store: "PlanetFoot", price: 34.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-domicile-gardien-junior-2025-26-vert%3Fvariant%3D51325535191381", inStock: true, sizes: ["L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-liverpool-fc-25-26-junior-adidas-planetfoot1.webp?v=1756548418" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-third-goalkeeper-jersey-2025-26%3Fvariant%3D42658393194601", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Liverpool_Third_Goalkeeper_Jersey_202526_1.png?v=1762141985" },
      { store: "FootStoreFR", price: 100.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkt2080-maillot-de-gardien-liverpool-fc-2026-27-vernob", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/k/t/kt2080.webp" },
      { store: "SportIsGoodFR", price: 100.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkt2080-maillot-de-gardien-liverpool-fc-2026-27-vernob", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/k/t/kt2080.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972273419&a=3013769&m=77008", inStock: true, sizes: ["M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ff0b54147d3ad4a40b7e1d6add0de3b87_9366%2FCamiseta_de_portero_Liverpool_FC_25-26_Verde_JZ4088_21_model.jpg&feedId=92152&k=4bce89c860eb0fb536bb3d75aa495814d1443622" },
      { store: "AdidasPT", price: 70.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41972274257&a=3013769&m=77026", inStock: true, sizes: ["M", "L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ff0b54147d3ad4a40b7e1d6add0de3b87_9366%2FCamisola_de_Guarda-Redes_25-26_do_Liverpool_FC_Verde_JZ4088_21_model.jpg&feedId=92150&k=aa2064b4085271f7c972cba2ba5b8b6d2fcc1cbb" },
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
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-exterieur-homme-2025-26-blanc%3Fvariant%3D51325538664789", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-exterieur-manchester-united-25-26-adulte-adidas-planetfoot1.webp?v=1756552164" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fred-devils-away-soccer-jersey-2026-27%3Fvariant%3D47839276630121", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Manunitedawayfan2026_27_1.webp?v=1785205800" },
      { store: "FootStoreES", price: 59.96, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41991593869&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_ji7423_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=54baf9959b1cf70bfb0bd3efadea267563587fc8" },
      { store: "SportIsGoodES", price: 59.69, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301844190&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_ji7423_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=54baf9959b1cf70bfb0bd3efadea267563587fc8" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41848202010&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F1623df85821444868c899b09fd5c9a3c_9366%2FCamiseta_segunda_equipacion_Manchester_United_25-26_Blanco_JI7423_21_model.jpg&feedId=92152&k=a1f47608daf926a7217fde6420b83b5c8136c105" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45361271876&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Feec2ddd0517947eaafc7bc4f9758a978_9366%2FCamisola_Manchester_United_FC_26-27_Away_Azul_KA6861_21_model.jpg&feedId=92150&k=9117f4c3027ae4410d4b3f5d1359959d35a4dc77" },
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
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-homme-2025-26-noir%3Fvariant%3D51385053184341", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-third-manchester-united-25-26-adulte-adidas-planetfoot1.webp?v=1757767675" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fmanchester-united-third-away-soccer-jersey-2026-27%3Fvariant%3D47839298945129", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Manunitedthirdfan2026_27_2.webp?v=1785205911" },
      { store: "FootStoreES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42287717126&a=3013769&m=65912", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kd4225_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=59b172cffbf8cbcc3240e789ebe88077097bea67" },
      { store: "FootStoreFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fkd4225-maillot-third-manchester-united-2025-26-black", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kd4225_1_apparel_photography_front_center_view_white.webp" },
      { store: "SportIsGoodES", price: 70.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301836101&a=3013769&m=65906", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_kd4225_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=59b172cffbf8cbcc3240e789ebe88077097bea67" },
      { store: "SportIsGoodFR", price: 70.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fkd4225-maillot-third-manchester-united-2025-26-black", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_kd4225_1_apparel_photography_front_center_view_white.webp" },
    ],
  },
  {
    id: "manutd-goalkeeper-202526",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 44.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-gardien-junior-2025-26-vert%3Fvariant%3D51385052823893", inStock: true, sizes: ["M", "L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-third-manchester-united-25-26-enfants-adidas-planetfoot1.webp?v=1757767447" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45361279188&a=3013769&m=77008", inStock: true, sizes: ["M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F235469bde4fd433d9056167882f7bc0e_9366%2FCamiseta_de_portero_segunda_equipacion_Manchester_United_26-27_Violeta_KB5557_21_model.jpg&feedId=92152&k=a7b362e3b77da420371d9c96f479e23814dee3d6" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45361275033&a=3013769&m=77026", inStock: true, sizes: ["M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F235469bde4fd433d9056167882f7bc0e_9366%2FCamisola_Manchester_United_FC_26-27_Away_Goalkeeper_Roxo_KB5557_21_model.jpg&feedId=92150&k=feca5d15fe3abb15e7cd47c064a63ab615f29d48" },
    ],
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fnetherlands-2026-world-cup-away-football-jersey%3Fvariant%3D42961849253993", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/netherlandsaway2026jersey.webp?v=1776235089" },
      { store: "FootStoreES", price: 149.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43406659936&a=3013769&m=65912", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_ih0806-489_blue-beyond-noir_5.webp&feedId=89032&k=04fe3982cfb43bfc421b816f9b8d5a9fdad66de9" },
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
      { store: "PlanetFoot", price: 54.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-portugal-ronaldo-away-blanc-vert-2026-homme%3Fvariant%3D53802754081109", inStock: true, sizes: ["L"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/Maillot_Portugal_Ronaldo_2026_Ext_rieur_Homme_-_Blanc_Vert.png?v=1778057945" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fportugal-away-soccer-jersey-2026-world-cup%3Fvariant%3D42706804179049", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Portugal_Away_Jersey_World_Cup_2026_3.webp?v=1764049124" },
      { store: "FootStoreES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45381240346&a=3013769&m=65912", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783288-02-white-green-lagoon-69babe09f07cc-1.webp&feedId=89032&k=ac61552a06c41a5e7fa574881e51ebe4bcff1ef9" },
      { store: "SportIsGoodES", price: 75.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45380187815&a=3013769&m=65906", inStock: true, sizes: ["XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fp%2Fu%2Fpuma-783288-02-white-green-lagoon-69babe09f07cc-1.webp&feedId=89044&k=ac61552a06c41a5e7fa574881e51ebe4bcff1ef9" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fpsg-fourth-away-soccer-jersey-2025-26%3Fvariant%3D42697531752553", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/PSG_Fourth_Away_Soccer_Jersey_202526_2.webp?v=1763610832" },
      { store: "FootStoreES", price: 119.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45263181337&a=3013769&m=65912", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-iw9271-101-white-college-navy-college-navy-6a45a12f40f2f-1.webp&feedId=89032&k=8c11cff7c3650201cb3981654ec04e09596ac914" },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fpsg-third-away-player-version-soccer-jersey-2025-26%3Fvariant%3D42616145444969", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/PSG_Third_Away_player_version_Soccer_Jersey_2025_26_1.png?v=1760254182" },
      { store: "FootStoreES", price: 83.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43745917174&a=3013769&m=65912", inStock: true, sizes: ["L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hm3606-101_white-global-red_1.webp&feedId=89032&k=2e58deaeee8071150c777244cca3a2423906a3c9" },
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
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-exterieur-homme-2025-26-bleu%3Fvariant%3D51159086367061", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-exterieur-real-madrid-25-26-adulte-adidas-planetfoot1.jpg?v=1755938674" },
      { store: "FootStoreES", price: 62.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41718361138&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj4182_1_apparel_photography_front_center_view_white.webp&feedId=89032&k=0cfa015b02d52489201081e0a54e252c213094a0" },
      { store: "SportIsGoodES", price: 62.2, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45072984905&a=3013769&m=65906", inStock: true, sizes: ["S", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_adidas_jj4182_1_apparel_photography_front_center_view_white.webp&feedId=89044&k=0cfa015b02d52489201081e0a54e252c213094a0" },
      { store: "AdidasES", price: 75.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41617120726&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F69b7b03005ed474e95c1bae97618e097_9366%2FCamiseta_segunda_equipacion_Real_Madrid_25-26_Azul_JJ4182_21_model.jpg&feedId=92152&k=cc9ae1669d7c92a3a506080bc2ff8bae5c3ac9e6" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45367101490&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ffd14b6e822344f53bc3f6c5f2ff9f89f_9366%2FCamisola_Real_Madrid_26-27_Away_Verde_KC3990_21_model.jpg&feedId=92150&k=8475a89555115def5111a2a9e8db2c84dedecf8e" },
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
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-third-homme-2024-25-beige-hp%3Fvariant%3D50258487411029", inStock: true, sizes: ["M"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/JX2119_b2b012_plp.jpg?v=1738601110" },
      { store: "FootStoreES", price: 64.27, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42031884497&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv5845_blubir_1.webp&feedId=89032&k=a0b9c2844799909cd0d942d2d619222a00bcf2f0" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjv5845-maillot-third-real-madrid-2025-26-blubir", inStock: true, sizes: ["S", "M", "XXL"], imageUrl: "https://b2c.spacefoot.com/media/catalog/product/a/d/adidas_jv5845_blubir_1.jpg" },
      { store: "SportIsGoodES", price: 62.2, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43301840777&a=3013769&m=65906", inStock: true, sizes: ["S"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas_jv5845_blubir_1.webp&feedId=89044&k=a0b9c2844799909cd0d942d2d619222a00bcf2f0" },
      { store: "SportIsGoodFR", price: 62.45, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fjv5845-maillot-third-real-madrid-2025-26-blubir", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jv5845_blubir_1.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42036950039&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7355abe9c0ce4ab9a6ae6b448cd03b15_9366%2FCamiseta_tercera_equipacion_Real_Madrid_25-26_Azul_JV5845_21_model.jpg&feedId=92152&k=a59ef60598ec45123135f6a30b8cac8a9e0d276d" },
      { store: "AdidasPT", price: 56.25, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42036951913&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F7355abe9c0ce4ab9a6ae6b448cd03b15_9366%2FCamisola_do_Terceiro_Equipamento_25-26_do_Real_Madrid_Azul_JV5845_21_model.jpg&feedId=92150&k=5df6e6ec9172e874ea2e2e9d34fb6d0ec31811d2" },
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
      { store: "PlanetFoot", price: 54.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-domicile-gardien-homme-2025-26-bleu%3Fvariant%3D50923096572245", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-gardien-domicile-real-madrid-2025-26-adidas-homme1.webp?v=1754908724" },
      { store: "FootStoreES", price: 100.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45184773387&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fa%2Fd%2Fadidas-kc3988-black-6a444bfd9b27d-1.webp&feedId=89032&k=7be41354610aacb392afaa0185b9e2b0da7e9a58" },
      { store: "FootStoreFR", price: 71.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjp4178-maillot-de-gardien-domicile-real-madrid-2025-26-blubrs-rayblu", inStock: true, sizes: ["S"], imageUrl: "https://cdn.blazimg.com/1800/product/a/d/adidas_jp4178_1_apparel_photography_front_center_view_white.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41530608280&a=3013769&m=77008", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F29dc1225fe254240a947e360e1fe27a4_9366%2FCamiseta_portero_primera_equipacion_Real_Madrid_25-26_Azul_JP4178_21_model.jpg&feedId=92152&k=d0f6bc7e69a226ff69d852fa60d1ef6d0a47b88a" },
      { store: "AdidasPT", price: 85.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=41704988514&a=3013769&m=77026", inStock: true, sizes: ["L"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2F29dc1225fe254240a947e360e1fe27a4_9366%2FCamisola_Principal_de_Guarda-redes_25-26_do_Real_Madrid_Azul_JP4178_21_model.jpg&feedId=92150&k=2822f996edd7687930060cec4d6da60957802a67" },
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
      { store: "PlanetFoot", price: 59.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-river-plate-exterieur-homme-2025-26-noir%3Fvariant%3D51494762905941", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/maillot-river-plate-25-26-exterieur-adulte-adidas-planetfoot1.webp?v=1758817199" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Friver-plate-away-soccer-jersey-2025-26%3Fvariant%3D42724207853673", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/RiverPlateAwaySoccerJersey202526_1.png?v=1764762115" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Furuguay-away-football-jersey-world-cup-2026%3Fvariant%3D42762193862761", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/uruguayawayjersey2026_1_1.webp?v=1776843683" },
      { store: "FootStoreES", price: 76.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44301926351&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io4681-451-obsidian-hyper-royal-69ca9aab64a88-1.webp&feedId=89032&k=e9d91af639ffe5d5b6786019048fab89d945d9d6" },
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
      { store: "ComoFCShop", price: 110.0, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fhome-jersey-2025-26-jd7389-1%3Fvariant%3D55667122078078", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_B1001_01.jpg?v=1758876217" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45382409500&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ff9b3789d62bf487297ae8d2a5c0b3a6a_9366%2FCamiseta_primera_equipacion_Como_1907_26-27_Azul_KH1328_21_model.jpg&feedId=92152&k=6c96173d0f39b0889f233912d51dc5e286038657" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=45382405637&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Ff9b3789d62bf487297ae8d2a5c0b3a6a_9366%2FCamisola_Principal_26-27_do_Como_1907_Azul_KH1328_21_model.jpg&feedId=92150&k=f83de4e6fd82ed6d659ed658dd7e7a8e65a85929" },
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
      { store: "ComoFCShop", price: 110.0, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Faway-jersey-2025-26-jd7389-1%3Fvariant%3D55667123388798", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/SecondaMaglia_01.jpg?v=1758876564" },
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
      { store: "ComoFCShop", price: 110.0, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fcomo-1907-maglia-third-2025-26%3Fvariant%3D55667125158270", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/1stImage.jpg?v=1764583746" },
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
      { store: "ComoFCShop", price: 42.5, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fgoalkeeper-home-jersey-2025-26-jn2032-1%3Fvariant%3D56086477308286", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_00347_01_e50516b8-fa7b-4078-ad8e-04edab096380.jpg?v=1758876738" },
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
      { store: "ComoFCShop", price: 42.5, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fgoalkeeper-away-jersey-2025-26-jn2033-1%3Fvariant%3D56182570582398", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_B5001_09_01.jpg?v=1758876639" },
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
      { store: "ComoFCShop", price: 42.5, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=128133&awinaffid=3013769&ued=https%3A%2F%2Fshop.comofootball.com%2Fproducts%2Fgoalkeeper-third-jersey-2025-26-jp4380-1%3Fvariant%3D56193832878462", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.shopify.com/s/files/1/0842/2899/7401/files/C1907_B6001_08_01.jpg?v=1757675978" },
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
      { store: "FootStoreES", price: 109.0, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=42805631887&a=3013769&m=65912", inStock: true, sizes: ["L", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike_hq0477-311-phsym001.webp&feedId=89032&k=d5ea0c65a894acdb978e42af23924d9854efe8ae" },
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
      { store: "FootStoreES", price: 70.48, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43087832288&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2025_11_adidas_jy7656_0.webp&feedId=89032&k=603757ba829bf74d0fbc4d8b219049021ac8394b" },
      { store: "FootStoreFR", price: 62.81, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fjn1979-maillot-domicile-gardien-italie-coupe-du-monde-2026-tecobu", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_11_adidas_jn1979_0.webp" },
      { store: "AdidasES", price: 100.0, shipping: 0.0, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43094298145&a=3013769&m=77008", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fffbebe63c7264f5685f8623206ecdcbc_9366%2FCamiseta_de_portero_primera_equipacion_Italia_26_Burgundy_JN1979_21_model.jpg&feedId=92152&k=065984b74a67cd9f363a6737e6d95aa612f91db1" },
      { store: "AdidasPT", price: 100.0, shipping: 4.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43096965775&a=3013769&m=77026", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.adidas.com%2Fimages%2Fw_1080%2Ch_1080%2Cf_auto%2Cq_auto%3Asensitive%2Cfl_lossy%2Fffbebe63c7264f5685f8623206ecdcbc_9366%2FCamisola_Principal_de_Guarda-redes_26_da_ITALIA_Bordo_JN1979_21_model.jpg&feedId=92150&k=6a09c49c89949a40bf302884bc6e8d874b76d776" },
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
      { store: "FootStoreES", price: 62.14, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=43829770459&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2F2%2F0%2F2026_01_nike_ib3830-012_15.webp&feedId=89032&k=467fdde996986625813f61f52625d138227cccfa" },
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
      { store: "FootStoreES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44617973663&a=3013769&m=65912", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8620-718-lightening-69ef67d39f748-1.webp&feedId=89032&k=e8189782542a1ef2d7ee323d1b7b868751e09fa5" },
      { store: "FootStoreFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fio8620-718-maillot-de-gardien-croatie-coupe-du-monde-2026-lightening", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8620-718-lightening-69ef67d39f748-1.webp" },
      { store: "SportIsGoodES", price: 87.99, shipping: 7.99, currency: "EUR", url: "https://www.awin1.com/pclick.php?p=44618335320&a=3013769&m=65906", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Acdn.blazimg.com%2F1800%2Fproduct%2Fn%2Fi%2Fnike-io8620-718-lightening-69ef67d39f748-1.webp&feedId=89044&k=e8189782542a1ef2d7ee323d1b7b868751e09fa5" },
      { store: "SportIsGoodFR", price: 87.99, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=61919&awinaffid=3013769&ued=https%3A%2F%2Fsportisgood.fr%2Fio8620-718-maillot-de-gardien-croatie-coupe-du-monde-2026-lightening", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.blazimg.com/1800/product/n/i/nike-io8620-718-lightening-69ef67d39f748-1.webp" },
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
      { store: "FootStoreFR", price: 109.0, shipping: 6.99, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=55619&awinaffid=3013769&ued=https%3A%2F%2Ffoot-store.fr%2Fhq9799-703-maillot-de-gardien-third-psg-2025-26-volt-white-black", inStock: true, sizes: ["XL"], imageUrl: "https://cdn.blazimg.com/1800/product/2/0/2025_08_nike_hq9799-703-phsfh001.webp" },
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
