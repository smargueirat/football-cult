import type { HubLocale } from "@/data/teamMeta";
import type { GearSection } from "@/lib/gearHubs";

const NOUN: Record<GearSection, Record<HubLocale, string>> = {
  botas: { es: "Botas de fútbol", en: "Football boots", pt: "Chuteiras de futebol", fr: "Chaussures de football", it: "Scarpe da calcio" },
  guantes: { es: "Guantes de arquero", en: "Goalkeeper gloves", pt: "Luvas de goleiro", fr: "Gants de gardien", it: "Guanti da portiere" },
  pelotas: { es: "Pelotas de fútbol", en: "Footballs", pt: "Bolas de futebol", fr: "Ballons de football", it: "Palloni da calcio" },
  ropa: { es: "Ropa de fútbol", en: "Football apparel", pt: "Roupas de futebol", fr: "Vêtements de football", it: "Abbigliamento da calcio" },
  entrenamiento: { es: "Equipamiento de entrenamiento", en: "Training equipment", pt: "Material de treino", fr: "Matériel d'entraînement", it: "Materiale da allenamento" },
};

// Nombre del terreno en cada idioma (el código FG/AG/... queda entre paréntesis).
const GROUND: Record<string, Record<HubLocale, string>> = {
  FG: { es: "césped natural firme", en: "firm ground", pt: "grama natural firme", fr: "terrain sec naturel", it: "erba naturale asciutta" },
  AG: { es: "césped artificial", en: "artificial grass", pt: "grama sintética", fr: "pelouse synthétique", it: "erba sintetica" },
  SG: { es: "césped natural blando", en: "soft ground", pt: "grama natural macia", fr: "terrain gras", it: "erba naturale bagnata" },
  MG: { es: "multisuperficie", en: "multi-ground", pt: "multi-superfície", fr: "multi-surfaces", it: "multi-superficie" },
  TF: { es: "turf o moqueta", en: "turf", pt: "society / turf", fr: "synthétique / turf", it: "turf / sintetico" },
  "FG/AG": { es: "césped natural y artificial", en: "firm and artificial ground", pt: "grama natural e sintética", fr: "terrain sec et synthétique", it: "erba naturale e sintetica" },
};

const FOR: Record<HubLocale, string> = { es: "para", en: "for", pt: "para", fr: "pour", it: "per" };

export function groundName(ground: string, locale: HubLocale): string {
  return `${GROUND[ground]?.[locale] ?? ground} (${ground})`;
}

export function sectionNoun(section: GearSection, locale: HubLocale): string {
  return NOUN[section][locale];
}

export function brandHeadline(section: GearSection, brand: string, locale: HubLocale): string {
  return locale === "en" ? `${brand} ${NOUN[section][locale].toLowerCase()}` : `${NOUN[section][locale]} ${brand}`;
}

export function groundHeadline(ground: string, locale: HubLocale, brand?: string): string {
  const base = brand ? brandHeadline("botas", brand, locale) : NOUN.botas[locale];
  return `${base} ${FOR[locale]} ${groundName(ground, locale)}`;
}

export function typeHeadline(typeName: string, locale: HubLocale): string {
  return `${typeName} · ${NOUN.ropa[locale]}`;
}

export const UI: Record<
  HubLocale,
  {
    home: string;
    intro: (o: { headline: string; n: number; stores: number; price: string }) => string;
    meta: (o: { headline: string; n: number; price: string }) => string;
    cheapest: string;
    all: string;
    otherBrands: string;
    byGround: string;
    byType: string;
    byBrand: string;
    from: string;
    stores: (n: number) => string;
    explore: string;
  }
> = {
  es: {
    home: "Inicio",
    intro: ({ headline, n, stores, price }) => `${headline}: ${n} productos comparados entre ${stores} tiendas. Precio más bajo hoy: ${price}. Los precios se actualizan todos los días.`,
    meta: ({ headline, n, price }) => `${headline}: compará ${n} productos entre tiendas. Desde ${price}.`,
    cheapest: "Los más baratos",
    all: "Todos los productos",
    otherBrands: "Otras marcas",
    byGround: "Por tipo de terreno",
    byType: "Por tipo de prenda",
    byBrand: "Por marca",
    from: "Desde",
    stores: (n) => `${n} ${n === 1 ? "tienda" : "tiendas"}`,
    explore: "Explorar",
  },
  en: {
    home: "Home",
    intro: ({ headline, n, stores, price }) => `${headline}: ${n} products compared across ${stores} stores. Lowest price today: ${price}. Prices are updated every day.`,
    meta: ({ headline, n, price }) => `${headline}: compare ${n} products across stores. From ${price}.`,
    cheapest: "Lowest prices",
    all: "All products",
    otherBrands: "Other brands",
    byGround: "By surface",
    byType: "By type",
    byBrand: "By brand",
    from: "From",
    stores: (n) => `${n} ${n === 1 ? "store" : "stores"}`,
    explore: "Explore",
  },
  pt: {
    home: "Início",
    intro: ({ headline, n, stores, price }) => `${headline}: ${n} produtos comparados em ${stores} lojas. Menor preço hoje: ${price}. Os preços são atualizados todos os dias.`,
    meta: ({ headline, n, price }) => `${headline}: compare ${n} produtos entre lojas. A partir de ${price}.`,
    cheapest: "Os mais baratos",
    all: "Todos os produtos",
    otherBrands: "Outras marcas",
    byGround: "Por tipo de piso",
    byType: "Por tipo de peça",
    byBrand: "Por marca",
    from: "A partir de",
    stores: (n) => `${n} ${n === 1 ? "loja" : "lojas"}`,
    explore: "Explorar",
  },
  fr: {
    home: "Accueil",
    intro: ({ headline, n, stores, price }) => `${headline} : ${n} produits comparés dans ${stores} boutiques. Prix le plus bas aujourd'hui : ${price}. Les prix sont mis à jour chaque jour.`,
    meta: ({ headline, n, price }) => `${headline} : comparez ${n} produits entre boutiques. Dès ${price}.`,
    cheapest: "Les moins chers",
    all: "Tous les produits",
    otherBrands: "Autres marques",
    byGround: "Par type de terrain",
    byType: "Par type de vêtement",
    byBrand: "Par marque",
    from: "Dès",
    stores: (n) => `${n} ${n === 1 ? "boutique" : "boutiques"}`,
    explore: "Explorer",
  },
  it: {
    home: "Home",
    intro: ({ headline, n, stores, price }) => `${headline}: ${n} prodotti confrontati in ${stores} negozi. Prezzo più basso oggi: ${price}. I prezzi si aggiornano ogni giorno.`,
    meta: ({ headline, n, price }) => `${headline}: confronta ${n} prodotti tra negozi. Da ${price}.`,
    cheapest: "I più economici",
    all: "Tutti i prodotti",
    otherBrands: "Altre marche",
    byGround: "Per tipo di terreno",
    byType: "Per tipo di capo",
    byBrand: "Per marca",
    from: "Da",
    stores: (n) => `${n} ${n === 1 ? "negozio" : "negozi"}`,
    explore: "Esplora",
  },
};
