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
  | "independiente";

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
  currency: string;
  // Locale usado solo para formatear el símbolo/posición de la moneda.
  formatLocale: string;
  // Tasa aproximada respecto al EUR (nuestra moneda base de datos).
  // NOTA: valor ilustrativo y estático — una integración real necesitaría
  // un proveedor de tipo de cambio en vivo.
  rateFromEUR: number;
}

export const countries: Country[] = [
  // --- América ---
  { code: "AR", name: { es: "Argentina", en: "Argentina", pt: "Argentina" }, flag: "🇦🇷", currency: "ARS", formatLocale: "es-AR", rateFromEUR: 1400 },
  { code: "MX", name: { es: "México", en: "Mexico", pt: "México" }, flag: "🇲🇽", currency: "MXN", formatLocale: "es-MX", rateFromEUR: 19.5 },
  { code: "BR", name: { es: "Brasil", en: "Brazil", pt: "Brasil" }, flag: "🇧🇷", currency: "BRL", formatLocale: "pt-BR", rateFromEUR: 6.1 },
  { code: "CL", name: { es: "Chile", en: "Chile", pt: "Chile" }, flag: "🇨🇱", currency: "CLP", formatLocale: "es-CL", rateFromEUR: 1030 },
  { code: "US", name: { es: "Estados Unidos", en: "United States", pt: "Estados Unidos" }, flag: "🇺🇸", currency: "USD", formatLocale: "en-US", rateFromEUR: 1.08 },
  { code: "CA", name: { es: "Canadá", en: "Canada", pt: "Canadá" }, flag: "🇨🇦", currency: "CAD", formatLocale: "en-CA", rateFromEUR: 1.48 },
  { code: "CO", name: { es: "Colombia", en: "Colombia", pt: "Colômbia" }, flag: "🇨🇴", currency: "COP", formatLocale: "es-CO", rateFromEUR: 4600 },
  { code: "PE", name: { es: "Perú", en: "Peru", pt: "Peru" }, flag: "🇵🇪", currency: "PEN", formatLocale: "es-PE", rateFromEUR: 4.05 },
  { code: "UY", name: { es: "Uruguay", en: "Uruguay", pt: "Uruguai" }, flag: "🇺🇾", currency: "UYU", formatLocale: "es-UY", rateFromEUR: 45 },
  { code: "PY", name: { es: "Paraguay", en: "Paraguay", pt: "Paraguai" }, flag: "🇵🇾", currency: "PYG", formatLocale: "es-PY", rateFromEUR: 8400 },
  { code: "BO", name: { es: "Bolivia", en: "Bolivia", pt: "Bolívia" }, flag: "🇧🇴", currency: "BOB", formatLocale: "es-BO", rateFromEUR: 7.45 },
  { code: "VE", name: { es: "Venezuela", en: "Venezuela", pt: "Venezuela" }, flag: "🇻🇪", currency: "VES", formatLocale: "es-VE", rateFromEUR: 55 },
  { code: "EC", name: { es: "Ecuador", en: "Ecuador", pt: "Equador" }, flag: "🇪🇨", currency: "USD", formatLocale: "es-EC", rateFromEUR: 1.08 },
  { code: "CR", name: { es: "Costa Rica", en: "Costa Rica", pt: "Costa Rica" }, flag: "🇨🇷", currency: "CRC", formatLocale: "es-CR", rateFromEUR: 550 },
  { code: "PA", name: { es: "Panamá", en: "Panama", pt: "Panamá" }, flag: "🇵🇦", currency: "USD", formatLocale: "es-PA", rateFromEUR: 1.08 },
  { code: "GT", name: { es: "Guatemala", en: "Guatemala", pt: "Guatemala" }, flag: "🇬🇹", currency: "GTQ", formatLocale: "es-GT", rateFromEUR: 8.3 },
  { code: "HN", name: { es: "Honduras", en: "Honduras", pt: "Honduras" }, flag: "🇭🇳", currency: "HNL", formatLocale: "es-HN", rateFromEUR: 27 },
  { code: "NI", name: { es: "Nicaragua", en: "Nicaragua", pt: "Nicarágua" }, flag: "🇳🇮", currency: "NIO", formatLocale: "es-NI", rateFromEUR: 40 },
  { code: "DO", name: { es: "República Dominicana", en: "Dominican Republic", pt: "República Dominicana" }, flag: "🇩🇴", currency: "DOP", formatLocale: "es-DO", rateFromEUR: 65 },
  { code: "CU", name: { es: "Cuba", en: "Cuba", pt: "Cuba" }, flag: "🇨🇺", currency: "CUP", formatLocale: "es-CU", rateFromEUR: 26 },

  // --- Europa ---
  { code: "ES", name: { es: "España", en: "Spain", pt: "Espanha" }, flag: "🇪🇸", currency: "EUR", formatLocale: "es-ES", rateFromEUR: 1 },
  { code: "GB", name: { es: "Reino Unido", en: "United Kingdom", pt: "Reino Unido" }, flag: "🇬🇧", currency: "GBP", formatLocale: "en-GB", rateFromEUR: 0.84 },
  { code: "FR", name: { es: "Francia", en: "France", pt: "França" }, flag: "🇫🇷", currency: "EUR", formatLocale: "fr-FR", rateFromEUR: 1 },
  { code: "DE", name: { es: "Alemania", en: "Germany", pt: "Alemanha" }, flag: "🇩🇪", currency: "EUR", formatLocale: "de-DE", rateFromEUR: 1 },
  { code: "IT", name: { es: "Italia", en: "Italy", pt: "Itália" }, flag: "🇮🇹", currency: "EUR", formatLocale: "it-IT", rateFromEUR: 1 },
  { code: "PT", name: { es: "Portugal", en: "Portugal", pt: "Portugal" }, flag: "🇵🇹", currency: "EUR", formatLocale: "pt-PT", rateFromEUR: 1 },
  { code: "NL", name: { es: "Países Bajos", en: "Netherlands", pt: "Países Baixos" }, flag: "🇳🇱", currency: "EUR", formatLocale: "nl-NL", rateFromEUR: 1 },
  { code: "BE", name: { es: "Bélgica", en: "Belgium", pt: "Bélgica" }, flag: "🇧🇪", currency: "EUR", formatLocale: "nl-BE", rateFromEUR: 1 },
  { code: "AT", name: { es: "Austria", en: "Austria", pt: "Áustria" }, flag: "🇦🇹", currency: "EUR", formatLocale: "de-AT", rateFromEUR: 1 },
  { code: "IE", name: { es: "Irlanda", en: "Ireland", pt: "Irlanda" }, flag: "🇮🇪", currency: "EUR", formatLocale: "en-IE", rateFromEUR: 1 },
  { code: "GR", name: { es: "Grecia", en: "Greece", pt: "Grécia" }, flag: "🇬🇷", currency: "EUR", formatLocale: "el-GR", rateFromEUR: 1 },
  { code: "FI", name: { es: "Finlandia", en: "Finland", pt: "Finlândia" }, flag: "🇫🇮", currency: "EUR", formatLocale: "fi-FI", rateFromEUR: 1 },
  { code: "SE", name: { es: "Suecia", en: "Sweden", pt: "Suécia" }, flag: "🇸🇪", currency: "SEK", formatLocale: "sv-SE", rateFromEUR: 11.3 },
  { code: "NO", name: { es: "Noruega", en: "Norway", pt: "Noruega" }, flag: "🇳🇴", currency: "NOK", formatLocale: "nb-NO", rateFromEUR: 11.6 },
  { code: "DK", name: { es: "Dinamarca", en: "Denmark", pt: "Dinamarca" }, flag: "🇩🇰", currency: "DKK", formatLocale: "da-DK", rateFromEUR: 7.46 },
  { code: "CH", name: { es: "Suiza", en: "Switzerland", pt: "Suíça" }, flag: "🇨🇭", currency: "CHF", formatLocale: "de-CH", rateFromEUR: 0.95 },
  { code: "PL", name: { es: "Polonia", en: "Poland", pt: "Polônia" }, flag: "🇵🇱", currency: "PLN", formatLocale: "pl-PL", rateFromEUR: 4.3 },
  { code: "CZ", name: { es: "República Checa", en: "Czech Republic", pt: "República Tcheca" }, flag: "🇨🇿", currency: "CZK", formatLocale: "cs-CZ", rateFromEUR: 25.1 },
  { code: "HU", name: { es: "Hungría", en: "Hungary", pt: "Hungria" }, flag: "🇭🇺", currency: "HUF", formatLocale: "hu-HU", rateFromEUR: 395 },
  { code: "RO", name: { es: "Rumania", en: "Romania", pt: "Romênia" }, flag: "🇷🇴", currency: "RON", formatLocale: "ro-RO", rateFromEUR: 4.97 },
  { code: "BG", name: { es: "Bulgaria", en: "Bulgaria", pt: "Bulgária" }, flag: "🇧🇬", currency: "BGN", formatLocale: "bg-BG", rateFromEUR: 1.96 },
  { code: "HR", name: { es: "Croacia", en: "Croatia", pt: "Croácia" }, flag: "🇭🇷", currency: "EUR", formatLocale: "hr-HR", rateFromEUR: 1 },
  { code: "SK", name: { es: "Eslovaquia", en: "Slovakia", pt: "Eslováquia" }, flag: "🇸🇰", currency: "EUR", formatLocale: "sk-SK", rateFromEUR: 1 },
  { code: "SI", name: { es: "Eslovenia", en: "Slovenia", pt: "Eslovênia" }, flag: "🇸🇮", currency: "EUR", formatLocale: "sl-SI", rateFromEUR: 1 },
  { code: "UA", name: { es: "Ucrania", en: "Ukraine", pt: "Ucrânia" }, flag: "🇺🇦", currency: "UAH", formatLocale: "uk-UA", rateFromEUR: 45 },
  { code: "IS", name: { es: "Islandia", en: "Iceland", pt: "Islândia" }, flag: "🇮🇸", currency: "ISK", formatLocale: "is-IS", rateFromEUR: 150 },

  // --- Asia ---
  { code: "JP", name: { es: "Japón", en: "Japan", pt: "Japão" }, flag: "🇯🇵", currency: "JPY", formatLocale: "ja-JP", rateFromEUR: 165 },
  { code: "CN", name: { es: "China", en: "China", pt: "China" }, flag: "🇨🇳", currency: "CNY", formatLocale: "zh-CN", rateFromEUR: 7.85 },
  { code: "KR", name: { es: "Corea del Sur", en: "South Korea", pt: "Coreia do Sul" }, flag: "🇰🇷", currency: "KRW", formatLocale: "ko-KR", rateFromEUR: 1480 },
  { code: "IN", name: { es: "India", en: "India", pt: "Índia" }, flag: "🇮🇳", currency: "INR", formatLocale: "en-IN", rateFromEUR: 90 },
  { code: "ID", name: { es: "Indonesia", en: "Indonesia", pt: "Indonésia" }, flag: "🇮🇩", currency: "IDR", formatLocale: "id-ID", rateFromEUR: 17200 },
  { code: "SG", name: { es: "Singapur", en: "Singapore", pt: "Singapura" }, flag: "🇸🇬", currency: "SGD", formatLocale: "en-SG", rateFromEUR: 1.45 },
  { code: "TH", name: { es: "Tailandia", en: "Thailand", pt: "Tailândia" }, flag: "🇹🇭", currency: "THB", formatLocale: "th-TH", rateFromEUR: 37.5 },
  { code: "MY", name: { es: "Malasia", en: "Malaysia", pt: "Malásia" }, flag: "🇲🇾", currency: "MYR", formatLocale: "ms-MY", rateFromEUR: 4.85 },
  { code: "PH", name: { es: "Filipinas", en: "Philippines", pt: "Filipinas" }, flag: "🇵🇭", currency: "PHP", formatLocale: "en-PH", rateFromEUR: 61 },
  { code: "VN", name: { es: "Vietnam", en: "Vietnam", pt: "Vietnã" }, flag: "🇻🇳", currency: "VND", formatLocale: "vi-VN", rateFromEUR: 27500 },
  { code: "AE", name: { es: "Emiratos Árabes Unidos", en: "United Arab Emirates", pt: "Emirados Árabes Unidos" }, flag: "🇦🇪", currency: "AED", formatLocale: "ar-AE", rateFromEUR: 3.97 },
  { code: "SA", name: { es: "Arabia Saudita", en: "Saudi Arabia", pt: "Arábia Saudita" }, flag: "🇸🇦", currency: "SAR", formatLocale: "ar-SA", rateFromEUR: 4.05 },
  { code: "QA", name: { es: "Catar", en: "Qatar", pt: "Catar" }, flag: "🇶🇦", currency: "QAR", formatLocale: "ar-QA", rateFromEUR: 3.93 },
  { code: "IL", name: { es: "Israel", en: "Israel", pt: "Israel" }, flag: "🇮🇱", currency: "ILS", formatLocale: "he-IL", rateFromEUR: 4.0 },
  { code: "TR", name: { es: "Turquía", en: "Turkey", pt: "Turquia" }, flag: "🇹🇷", currency: "TRY", formatLocale: "tr-TR", rateFromEUR: 37 },
  { code: "HK", name: { es: "Hong Kong", en: "Hong Kong", pt: "Hong Kong" }, flag: "🇭🇰", currency: "HKD", formatLocale: "zh-HK", rateFromEUR: 8.4 },
  { code: "TW", name: { es: "Taiwán", en: "Taiwan", pt: "Taiwan" }, flag: "🇹🇼", currency: "TWD", formatLocale: "zh-TW", rateFromEUR: 34.5 },
  { code: "PK", name: { es: "Pakistán", en: "Pakistan", pt: "Paquistão" }, flag: "🇵🇰", currency: "PKR", formatLocale: "en-PK", rateFromEUR: 300 },

  // --- Oceanía ---
  { code: "AU", name: { es: "Australia", en: "Australia", pt: "Austrália" }, flag: "🇦🇺", currency: "AUD", formatLocale: "en-AU", rateFromEUR: 1.63 },
  { code: "NZ", name: { es: "Nueva Zelanda", en: "New Zealand", pt: "Nova Zelândia" }, flag: "🇳🇿", currency: "NZD", formatLocale: "en-NZ", rateFromEUR: 1.77 },

  // --- África ---
  { code: "ZA", name: { es: "Sudáfrica", en: "South Africa", pt: "África do Sul" }, flag: "🇿🇦", currency: "ZAR", formatLocale: "en-ZA", rateFromEUR: 20 },
  { code: "NG", name: { es: "Nigeria", en: "Nigeria", pt: "Nigéria" }, flag: "🇳🇬", currency: "NGN", formatLocale: "en-NG", rateFromEUR: 1700 },
  { code: "EG", name: { es: "Egipto", en: "Egypt", pt: "Egito" }, flag: "🇪🇬", currency: "EGP", formatLocale: "ar-EG", rateFromEUR: 52 },
  { code: "MA", name: { es: "Marruecos", en: "Morocco", pt: "Marrocos" }, flag: "🇲🇦", currency: "MAD", formatLocale: "ar-MA", rateFromEUR: 10.8 },
  { code: "KE", name: { es: "Kenia", en: "Kenya", pt: "Quênia" }, flag: "🇰🇪", currency: "KES", formatLocale: "en-KE", rateFromEUR: 140 },
  { code: "GH", name: { es: "Ghana", en: "Ghana", pt: "Gana" }, flag: "🇬🇭", currency: "GHS", formatLocale: "en-GH", rateFromEUR: 16 },
  { code: "TN", name: { es: "Túnez", en: "Tunisia", pt: "Tunísia" }, flag: "🇹🇳", currency: "TND", formatLocale: "ar-TN", rateFromEUR: 3.35 },
  { code: "DZ", name: { es: "Argelia", en: "Algeria", pt: "Argélia" }, flag: "🇩🇿", currency: "DZD", formatLocale: "ar-DZ", rateFromEUR: 145 },
];

export function findCountry(code: CountryCode): Country {
  return countries.find((c) => c.code === code) ?? countries[0];
}

export function convertFromEUR(amountEUR: number, country: Country): number {
  return amountEUR * country.rateFromEUR;
}

export function formatMoney(amountEUR: number, country: Country): string {
  const converted = convertFromEUR(amountEUR, country);
  const maximumFractionDigits = converted >= 100 ? 0 : 2;
  return new Intl.NumberFormat(country.formatLocale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits,
  }).format(converted);
}

// A qué países envía cada tienda. "all" = envío global.
// Las tiendas reales (Awin) no tienen reglas de envío por país todavía,
// así que por defecto se asume que envían a todos lados (ver offerShipsTo).
export const storeShipping: Record<string, CountryCode[] | "all"> = {};

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
      { store: "PlanetFoot", price: 39.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Ft-shirt-sport-real-madrid-noir-bleu-2026-black-blue%3Fvariant%3D53802751099221", inStock: true, sizes: ["L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/t-shirt-sport-real-madrid-noir-bleu-2026-black-blue4.jpg?v=1777992819" },
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Freal-madrid-1996-97-home-retro-soccer-jersey%3Fvariant%3D42557216129129", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/52ed0186609cc48b4c0864c3a2d8aad4.jpg?v=1758074303" },
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
    id: "manutd-home-2025",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#DA020E",
    colorHexSecondary: "#F5D142",
    jerseyPattern: "solid",
    offers: [
      { store: "PlanetFoot", price: 89.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-domicile-homme-rouge%3Fvariant%3D49228463079765", inStock: true, sizes: ["S"], imageUrl: "https://cdn.shopify.com/s/files/1/0568/5012/0886/files/IU1397_b2b012_plp.webp?v=1722949779" },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fmanchester-united-us-pack-shirt-2025-26%3Fvariant%3D42557153575017", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/e185cd3a1a8d902c3a4a4a4759982966.png?v=1758073816" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fgermany-tiro-polo-shirt-world-cup-2026-white%3Fvariant%3D43129060851817", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Germany2026TiroPoloShirt_2.webp?v=1776237733" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-x-kobe-away-soccer-jersey-2025-26%3Fvariant%3D42557195419753", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Barcelona_Away_Soccer_Jersey_2025_26-1.png?v=1760087121" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-us-pack-shirt-2025-26%3Fvariant%3D42557137715305", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/a925a912d8d9b02c6133d842a6d1d761.png?v=1758073706" },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Friver-plate-terrace-icon-jersey-2025-26-white%3Fvariant%3D42719395283049", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/River_Plate_Terrace_Icons_Jersey_202526_2.jpg?v=1764595294" },
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
      { store: "FansJerseyHub", price: 32.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-hollywood-goalkeeper-lifestyle-jersey-2025%3Fvariant%3D42818196013161", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/FranceHollywoodGoalkeeperLifestyleJersey_2.webp?v=1768447784" },
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
    id: "ing-goalkeeper-2026",
    teamKey: "inglaterra",
    season: "2026",
    typeKey: "goalkeeper",
    colorHex: "#1B1B1B",
    colorHexSecondary: "#39FF14",
    jerseyPattern: "solid",
    offers: [
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-hollywood-lifestyle-goalkeeper-jersey-world-cup-2026%3Fvariant%3D43093713846377", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/EnglandHollywoodLifestyleGoalkeeperJerseyWorldCup2026_2.webp?v=1775128059" },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Freal-madrid-2016-17-away-retro-soccer-jersey%3Fvariant%3D42557230907497", inStock: true, sizes: ["S", "M", "L", "XL"], imageUrl: "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/7baa2713e1abd8e17e0981fd45656b0c.png?v=1769069522" },
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
    ],
  },
];

export function offerTotal(offer: Offer): number {
  return offer.price + offer.shipping;
}

export function bestOffer(product: Product): Offer | undefined {
  return [...product.offers]
    .filter((o) => o.inStock)
    .sort((a, b) => offerTotal(a) - offerTotal(b))[0];
}

export function bestOfferForCountry(
  product: Product,
  country: CountryCode
): Offer | undefined {
  return [...product.offers]
    .filter((o) => o.inStock && offerShipsTo(o.store, country))
    .sort((a, b) => offerTotal(a) - offerTotal(b))[0];
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
