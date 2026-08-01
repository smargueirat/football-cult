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
  argentina: { es: "Argentina", en: "Argentina" },
  brasil: { es: "Brasil", en: "Brazil" },
  espana: { es: "España", en: "Spain" },
  francia: { es: "Francia", en: "France" },
  alemania: { es: "Alemania", en: "Germany" },
  italia: { es: "Italia", en: "Italy" },
  inglaterra: { es: "Inglaterra", en: "England" },
  portugal: { es: "Portugal", en: "Portugal" },
  uruguay: { es: "Uruguay", en: "Uruguay" },
  colombia: { es: "Colombia", en: "Colombia" },
  paisesbajos: { es: "Países Bajos", en: "Netherlands" },
  croacia: { es: "Croacia", en: "Croatia" },
  realmadrid: { es: "Real Madrid", en: "Real Madrid" },
  boca: { es: "Boca Juniors", en: "Boca Juniors" },
  manutd: { es: "Manchester United", en: "Manchester United" },
  barcelona: { es: "FC Barcelona", en: "FC Barcelona" },
  liverpool: { es: "Liverpool", en: "Liverpool" },
  bayern: { es: "Bayern Múnich", en: "Bayern Munich" },
  psg: { es: "Paris Saint-Germain", en: "Paris Saint-Germain" },
  juventus: { es: "Juventus", en: "Juventus" },
  riverplate: { es: "River Plate", en: "River Plate" },
  chelsea: { es: "Chelsea", en: "Chelsea" },
  independiente: { es: "Independiente", en: "Independiente" },
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

export type CountryCode = "AR" | "ES" | "MX" | "BR" | "CL" | "US" | "GB" | "FR";

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
  { code: "AR", name: { es: "Argentina", en: "Argentina" }, flag: "🇦🇷", currency: "ARS", formatLocale: "es-AR", rateFromEUR: 1400 },
  { code: "ES", name: { es: "España", en: "Spain" }, flag: "🇪🇸", currency: "EUR", formatLocale: "es-ES", rateFromEUR: 1 },
  { code: "MX", name: { es: "México", en: "Mexico" }, flag: "🇲🇽", currency: "MXN", formatLocale: "es-MX", rateFromEUR: 19.5 },
  { code: "BR", name: { es: "Brasil", en: "Brazil" }, flag: "🇧🇷", currency: "BRL", formatLocale: "pt-BR", rateFromEUR: 6.1 },
  { code: "CL", name: { es: "Chile", en: "Chile" }, flag: "🇨🇱", currency: "CLP", formatLocale: "es-CL", rateFromEUR: 1030 },
  { code: "US", name: { es: "Estados Unidos", en: "United States" }, flag: "🇺🇸", currency: "USD", formatLocale: "en-US", rateFromEUR: 1.08 },
  { code: "GB", name: { es: "Reino Unido", en: "United Kingdom" }, flag: "🇬🇧", currency: "GBP", formatLocale: "en-GB", rateFromEUR: 0.84 },
  { code: "FR", name: { es: "Francia", en: "France" }, flag: "🇫🇷", currency: "EUR", formatLocale: "fr-FR", rateFromEUR: 1 },
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

// A qué países envía cada tienda (ficticia). "all" = envío global.
// NOTA: datos de ejemplo — en la integración real esto vendría del feed
// de cada tienda afiliada.
export const storeShipping: Record<string, CountryCode[] | "all"> = {
  "Kit Center": "all",
  "Elite Jerseys": "all",
  "MatchDay Shop": ["ES", "FR", "GB"],
  "ProSoccer Store": ["US", "MX", "AR"],
  "GoalGear": ["AR", "BR", "CL", "MX"],
};

export function offerShipsTo(store: string, country: CountryCode): boolean {
  const shipping = storeShipping[store];
  if (!shipping) return true;
  return shipping === "all" || shipping.includes(country);
}

export const typeNames: Record<TypeKey, Record<Locale, string>> = {
  home: { es: "Titular", en: "Home" },
  away: { es: "Suplente", en: "Away" },
  third: { es: "Tercera", en: "Third" },
  goalkeeper: { es: "Arquero", en: "Goalkeeper" },
};

export interface Offer {
  store: string;
  price: number;
  shipping: number;
  currency: "EUR" | "USD";
  url: string;
  inStock: boolean;
  sizes: Size[];
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
      { store: "FansJerseyHub", price: 43.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fargentina-home-soccer-jersey-kit-2026-world-cup%3Fvariant%3D42724228989033", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 42.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fl-martinez-22-argentina-away-soccer-jersey-2026-world-cup%3Fvariant%3D47752567259241", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-home-soccer-jersey-2026-world-cup%3Fvariant%3D42706934825065", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 54.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000086793%3Fvariant%3D53957404787029", inStock: true, sizes: ["M"] },
      { store: "FansJerseyHub", price: 41.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-player-version-home-soccer-jersey-2026-world-cup%3Fvariant%3D42669729644649", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 24.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-france-dkali-adulte-2025-26-bleu%3Fvariant%3D50991716663637", inStock: true, sizes: ["S", "M"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634036936809", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 39.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Ft-shirt-sport-real-madrid-noir-bleu-2026-black-blue%3Fvariant%3D53802751099221", inStock: true, sizes: ["L", "XL"] },
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Freal-madrid-1996-97-home-retro-soccer-jersey%3Fvariant%3D42557216129129", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-home-soccer-jersey-2025-26%3Fvariant%3D42557169860713", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 89.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-domicile-homme-rouge%3Fvariant%3D49228463079765", inStock: true, sizes: ["S"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fmanchester-united-us-pack-shirt-2025-26%3Fvariant%3D42557153575017", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 59.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000087110%3Fvariant%3D53957425398101", inStock: true, sizes: ["S", "M"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fgermany-tiro-polo-shirt-world-cup-2026-white%3Fvariant%3D43129060851817", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fitaly-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634053779561", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-2026-world-cup-home-football-jersey%3Fvariant%3D42742727868521", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 44.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Ft-shirt-portugal-pumatech-homme-bleu-seafoam-coupe-du-monde%3Fvariant%3D53556155842901", inStock: true, sizes: ["S", "M"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fportugal-home-soccer-jersey-2026-world-cup%3Fvariant%3D42634047160425", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Furuguay-home-football-jersey-world-cup-2026%3Fvariant%3D42735948300393", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcolombia-home-soccer-jersey-2026-world-cup%3Fvariant%3D42632125677673", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fnetherlands-2026-world-cup-home-football-jersey%3Fvariant%3D42961846501481", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcroatia-2026-world-cup-home-football-jersey%3Fvariant%3D42736040411241", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 39.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-fc-barcelone-connect-blaugrana-navy-2026%3Fvariant%3D53802756211029", inStock: true, sizes: ["S", "L", "XL"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-home-soccer-jersey-2025-26%3Fvariant%3D42557200597097", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-x-kobe-away-soccer-jersey-2025-26%3Fvariant%3D42557195419753", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 39.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-chemise-liverpool-f-c-us-pack-adulte-2025-26-rouge%3Fvariant%3D51159085646165", inStock: true, sizes: ["S"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-home-soccer-jersey-2025-26%3Fvariant%3D42557153345641", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 89.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-stadium-2026-27-homme-rouge%3Fvariant%3D53957414977877", inStock: true, sizes: ["S", "M", "L"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-us-pack-shirt-2025-26%3Fvariant%3D42557137715305", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 24.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-paris-saint-germain-fan-adulte-2025-26-bleu%3Fvariant%3D51402024649045", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"] },
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fpsg-player-version-home-soccer-jersey-2025-26-navy-club-world-cup%3Fvariant%3D42557261906025", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 59.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-homme-2025-26-blanc%3Fvariant%3D50897551950165", inStock: true, sizes: ["S", "M", "XL"] },
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
      { store: "PlanetFoot", price: 69.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000091377%3Fvariant%3D54464904102229", inStock: true, sizes: ["S", "M", "L"] },
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
      { store: "PlanetFoot", price: 60.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-river-plate-domicile-homme-2025-26-blanc%3Fvariant%3D51421275455829", inStock: true, sizes: ["S"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Friver-plate-terrace-icon-jersey-2025-26-white%3Fvariant%3D42719395283049", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-home-soccer-jersey-2025-26-blue%3Fvariant%3D42557244113001", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 47.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fhavertz-7-germany-player-version-away-soccer-jersey-2026-world-cup%3Fvariant%3D47711689408617", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fgermany-goalkeeper-soccer-jersey-2026-world-cup%3Fvariant%3D42791058767977", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbarcelona-third-away-soccer-jersey-2025-26%3Fvariant%3D42557191553129", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-away-soccer-jersey-2025-26-white%3Fvariant%3D42557241917545", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 74.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-homme-2025-26-noir%3Fvariant%3D51353837535573", inStock: true, sizes: ["S", "M"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-third-away-soccer-jersey-2025-26%3Fvariant%3D42557143744617", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 64.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-bayern-munich-third-gardien-homme-2025-26-rouge%3Fvariant%3D51325544235349", inStock: true, sizes: ["S", "M", "L"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbayern-munich-goalkeeper-soccer-jersey-2025-26%3Fvariant%3D42557136175209", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fboca-juniors-away-soccer-jersey-2025-26%3Fvariant%3D42557168484457", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-away-soccer-jersey-2026-world-cup%3Fvariant%3D42710746693737", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-player-version-third-away-soccer-jersey-2026-world-cup%3Fvariant%3D42707026968681", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fbrazil-goalkeeper-soccer-jersey-world-cup-2026%3Fvariant%3D43162048397417", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-away-soccer-jersey-2025-26-white%3Fvariant%3D42557257744489", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fchelsea-third-away-soccer-jersey-2025-26%3Fvariant%3D42591174819945", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcolombia-player-version-away-soccer-jersey-2026-world-cup%3Fvariant%3D42729803022441", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fcroatia-2026-world-cup-away-football-jersey%3Fvariant%3D42973969973353", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 37.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-away-soccer-jersey-2026-world-cup-long-sleeve%3Fvariant%3D43131519271017", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 34.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fspain-home-goalkeeper-jersey-2026-world-cup%3Fvariant%3D42713300172905", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-away-soccer-jersey-2026-world-cup%3Fvariant%3D43013419106409", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 32.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Ffrance-hollywood-goalkeeper-lifestyle-jersey-2025%3Fvariant%3D42818196013161", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-away-soccer-jersey-2026-world-cup%3Fvariant%3D42634045194345", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fengland-hollywood-lifestyle-goalkeeper-jersey-world-cup-2026%3Fvariant%3D43093713846377", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2F2430000088506%3Fvariant%3D54053031346517", inStock: true, sizes: ["S", "L"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fitaly-away-soccer-jersey-2026-world-cup%3Fvariant%3D42648228823145", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 44.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-third-junior-2025-26-noir%3Fvariant%3D51534371389781", inStock: true, sizes: ["M"] },
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
      { store: "PlanetFoot", price: 50.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-juventus-turin-domicile-gardien-homme-2025-26-noir%3Fvariant%3D50981178310997", inStock: true, sizes: ["M", "L"] },
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
      { store: "PlanetFoot", price: 50.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-exterieur-homme-2025-26-beige%3Fvariant%3D51325520838997", inStock: true, sizes: ["S"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-away-soccer-jersey-2025-26%3Fvariant%3D42557140729961", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 39.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-third-junior-2025-26-vert%3Fvariant%3D51385406619989", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-third-away-soccer-jersey-2025-26%3Fvariant%3D42591141724265", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 34.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-liverpool-f-c-domicile-gardien-junior-2025-26-vert%3Fvariant%3D51325535191381", inStock: true, sizes: ["L"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fliverpool-third-goalkeeper-jersey-2025-26%3Fvariant%3D42658393194601", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-exterieur-homme-2025-26-blanc%3Fvariant%3D51325538664789", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fred-devils-away-soccer-jersey-2026-27%3Fvariant%3D47839276630121", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-homme-2025-26-noir%3Fvariant%3D51385053184341", inStock: true, sizes: ["S"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fmanchester-united-third-away-soccer-jersey-2026-27%3Fvariant%3D47839298945129", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 44.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-manchester-united-third-gardien-junior-2025-26-vert%3Fvariant%3D51385052823893", inStock: true, sizes: ["M", "L"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fnetherlands-2026-world-cup-away-football-jersey%3Fvariant%3D42961849253993", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 54.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-portugal-ronaldo-away-blanc-vert-2026-homme%3Fvariant%3D53802754081109", inStock: true, sizes: ["L"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fportugal-away-soccer-jersey-2026-world-cup%3Fvariant%3D42706804179049", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fpsg-fourth-away-soccer-jersey-2025-26%3Fvariant%3D42697531752553", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Fpsg-third-away-player-version-soccer-jersey-2025-26%3Fvariant%3D42616145444969", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 49.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-exterieur-homme-2025-26-bleu%3Fvariant%3D51159086367061", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "FansJerseyHub", price: 36.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Freal-madrid-2016-17-away-retro-soccer-jersey%3Fvariant%3D42557230907497", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "PlanetFoot", price: 99.99, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-third-homme-2024-25-beige-hp%3Fvariant%3D50258487411029", inStock: true, sizes: ["M"] },
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
      { store: "PlanetFoot", price: 54.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-real-madrid-domicile-gardien-homme-2025-26-bleu%3Fvariant%3D50923096572245", inStock: true, sizes: ["S"] },
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
      { store: "PlanetFoot", price: 59.95, shipping: 0, currency: "EUR", url: "https://www.awin1.com/cread.php?awinmid=123918&awinaffid=3013769&ued=https%3A%2F%2Fplanetfoot.com%2Fproducts%2Fmaillot-river-plate-exterieur-homme-2025-26-noir%3Fvariant%3D51494762905941", inStock: true, sizes: ["S"] },
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Friver-plate-away-soccer-jersey-2025-26%3Fvariant%3D42724207853673", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
      { store: "FansJerseyHub", price: 29.99, shipping: 0, currency: "USD", url: "https://www.awin1.com/cread.php?awinmid=126139&awinaffid=3013769&ued=https%3A%2F%2Ffansjerseyhub1.com%2Fproducts%2Furuguay-away-football-jersey-world-cup-2026%3Fvariant%3D42762193862761", inStock: true, sizes: ["S", "M", "L", "XL"] },
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
