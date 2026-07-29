import { Locale } from "@/lib/i18n/translations";

export type TeamKey =
  | "argentina"
  | "brasil"
  | "espana"
  | "francia"
  | "realmadrid"
  | "boca"
  | "manutd";

export type TypeKey = "home" | "away" | "third" | "goalkeeper";
export type CategoryKey = "national" | "club";
export type Size = "S" | "M" | "L" | "XL" | "XXL";

export const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

export const teamCategory: Record<TeamKey, CategoryKey> = {
  argentina: "national",
  brasil: "national",
  espana: "national",
  francia: "national",
  realmadrid: "club",
  boca: "club",
  manutd: "club",
};

export const teamNames: Record<TeamKey, Record<Locale, string>> = {
  argentina: { es: "Argentina", en: "Argentina" },
  brasil: { es: "Brasil", en: "Brazil" },
  espana: { es: "España", en: "Spain" },
  francia: { es: "Francia", en: "France" },
  realmadrid: { es: "Real Madrid", en: "Real Madrid" },
  boca: { es: "Boca Juniors", en: "Boca Juniors" },
  manutd: { es: "Manchester United", en: "Manchester United" },
};

export const teamFlags: Record<TeamKey, string> = {
  argentina: "🇦🇷",
  brasil: "🇧🇷",
  espana: "🇪🇸",
  francia: "🇫🇷",
  realmadrid: "⚪",
  boca: "💙",
  manutd: "🔴",
};

// Colores icónicos por equipo, usados en los accesos rápidos y avatares.
export const teamColors: Record<TeamKey, [string, string]> = {
  argentina: ["#75AADB", "#FFFFFF"],
  brasil: ["#FFCC29", "#0F5A2E"],
  espana: ["#C60B1E", "#F5B942"],
  francia: ["#0055A4", "#EF4135"],
  realmadrid: ["#FEBE10", "#FFFFFF"],
  boca: ["#1B3A6B", "#FFD400"],
  manutd: ["#DA020E", "#000000"],
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
      { store: "Kit Center", price: 74.99, shipping: 4.99, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "MatchDay Shop", price: 69.5, shipping: 3.5, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XL", "XXL"] },
      { store: "ProSoccer Store", price: 82.0, shipping: 0, currency: "EUR", url: "#", inStock: false, sizes: ["S", "M"] },
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
      { store: "Kit Center", price: 79.99, shipping: 4.99, currency: "EUR", url: "#", inStock: true, sizes: ["S", "L", "XL"] },
      { store: "GoalGear", price: 71.25, shipping: 5.5, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XXL"] },
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
      { store: "MatchDay Shop", price: 68.0, shipping: 3.5, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L"] },
      { store: "ProSoccer Store", price: 73.4, shipping: 0, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XL", "XXL"] },
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
      { store: "Kit Center", price: 76.5, shipping: 4.99, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "XL"] },
      { store: "GoalGear", price: 70.0, shipping: 5.5, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XL"] },
      { store: "Elite Jerseys", price: 65.99, shipping: 6.95, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L", "XL", "XXL"] },
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
      { store: "MatchDay Shop", price: 72.0, shipping: 3.5, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "Elite Jerseys", price: 67.3, shipping: 6.95, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L"] },
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
      { store: "Kit Center", price: 89.99, shipping: 4.99, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "ProSoccer Store", price: 84.5, shipping: 0, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XXL"] },
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
      { store: "MatchDay Shop", price: 66.0, shipping: 3.5, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L"] },
      { store: "GoalGear", price: 61.75, shipping: 5.5, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XL", "XXL"] },
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
      { store: "Kit Center", price: 91.0, shipping: 4.99, currency: "EUR", url: "#", inStock: true, sizes: ["S", "M", "L", "XL"] },
      { store: "Elite Jerseys", price: 87.25, shipping: 6.95, currency: "EUR", url: "#", inStock: true, sizes: ["M", "L", "XXL"] },
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
