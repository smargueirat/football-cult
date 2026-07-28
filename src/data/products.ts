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

export const typeNames: Record<TypeKey, Record<Locale, string>> = {
  home: { es: "Titular", en: "Home" },
  away: { es: "Suplente", en: "Away" },
  third: { es: "Tercera", en: "Third" },
  goalkeeper: { es: "Arquero", en: "Goalkeeper" },
};

export interface Offer {
  store: string;
  price: number;
  currency: "EUR" | "USD";
  url: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  teamKey: TeamKey;
  season: string;
  typeKey: TypeKey;
  colorHex: string;
  offers: Offer[];
}

// NOTA: datos de ejemplo (placeholder) para poder mostrar la interfaz
// mientras se gestionan las afiliaciones reales (Awin, CJ, Rakuten, etc).
// Una vez aprobadas, este archivo se reemplaza por datos que vienen
// de los feeds de producto de cada red.
export const products: Product[] = [
  {
    id: "arg-home-2026",
    teamKey: "argentina",
    season: "2026",
    typeKey: "home",
    colorHex: "#75AADB",
    offers: [
      { store: "Tienda Ejemplo A", price: 74.99, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo B", price: 69.5, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo C", price: 82.0, currency: "EUR", url: "#", inStock: false },
    ],
  },
  {
    id: "arg-away-2026",
    teamKey: "argentina",
    season: "2026",
    typeKey: "away",
    colorHex: "#1A1A2E",
    offers: [
      { store: "Tienda Ejemplo A", price: 79.99, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo D", price: 71.25, currency: "EUR", url: "#", inStock: true },
    ],
  },
  {
    id: "bra-home-2026",
    teamKey: "brasil",
    season: "2026",
    typeKey: "home",
    colorHex: "#FFCC29",
    offers: [
      { store: "Tienda Ejemplo B", price: 68.0, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo C", price: 73.4, currency: "EUR", url: "#", inStock: true },
    ],
  },
  {
    id: "esp-home-2026",
    teamKey: "espana",
    season: "2026",
    typeKey: "home",
    colorHex: "#C60B1E",
    offers: [
      { store: "Tienda Ejemplo A", price: 76.5, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo D", price: 70.0, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo E", price: 65.99, currency: "EUR", url: "#", inStock: true },
    ],
  },
  {
    id: "fra-home-2026",
    teamKey: "francia",
    season: "2026",
    typeKey: "home",
    colorHex: "#0055A4",
    offers: [
      { store: "Tienda Ejemplo B", price: 72.0, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo E", price: 67.3, currency: "EUR", url: "#", inStock: true },
    ],
  },
  {
    id: "rma-home-2025",
    teamKey: "realmadrid",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#F5F5F5",
    offers: [
      { store: "Tienda Ejemplo A", price: 89.99, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo C", price: 84.5, currency: "EUR", url: "#", inStock: true },
    ],
  },
  {
    id: "boca-home-2025",
    teamKey: "boca",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#1B3A6B",
    offers: [
      { store: "Tienda Ejemplo B", price: 66.0, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo D", price: 61.75, currency: "EUR", url: "#", inStock: true },
    ],
  },
  {
    id: "manutd-home-2025",
    teamKey: "manutd",
    season: "2025/26",
    typeKey: "home",
    colorHex: "#DA020E",
    offers: [
      { store: "Tienda Ejemplo A", price: 91.0, currency: "EUR", url: "#", inStock: true },
      { store: "Tienda Ejemplo E", price: 87.25, currency: "EUR", url: "#", inStock: true },
    ],
  },
];

export function bestPrice(product: Product): Offer | undefined {
  return [...product.offers]
    .filter((o) => o.inStock)
    .sort((a, b) => a.price - b.price)[0];
}
