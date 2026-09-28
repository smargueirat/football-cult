import type { HubLocale } from "@/data/teamMeta";

// Textos de /novedades. Archivo propio por el mismo motivo que giftStrings.ts.

// El Node del servidor trae solo el locale inglés (ICU reducido), así que
// toLocaleDateString("es") devuelve inglés sin avisar. El mes va a mano.
const MONTHS: Record<HubLocale, string[]> = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  it: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
};

export function shortDate(iso: string, locale: HubLocale): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[locale][m - 1]}`;
}

export const NEW_UI: Record<HubLocale, {
  h1: string; metaTitle: string; metaDescription: string;
  intro: (n: number) => string; empty: string; badge: (date: string) => string;
}> = {
  es: {
    h1: "Camisetas nuevas",
    metaTitle: "Camisetas de fútbol nuevas — Comparar precios",
    metaDescription: "Las camisetas de la temporada 2026/27 que acaban de salir, con el precio de cada tienda que ya las tiene.",
    intro: (n) => `${n} camisetas de temporada que entraron al catálogo en los últimos 30 días, de la más nueva a la más vieja. Cuando sale una camiseta nueva, la sumamos en menos de un día con el precio de cada tienda que ya la vende.`,
    empty: "No entraron camisetas nuevas en los últimos 30 días.",
    badge: (d) => `Nueva · ${d}`,
  },
  en: {
    h1: "New football shirts",
    metaTitle: "New Football Shirts — Compare Prices",
    metaDescription: "The 2026/27 shirts that have just come out, with the price at every store that already stocks them.",
    intro: (n) => `${n} shirts added to the catalogue in the last 30 days, newest first. When a new shirt comes out, we add it within a day with the price at every store that already sells it.`,
    empty: "No new shirts in the last 30 days.",
    badge: (d) => `New · ${d}`,
  },
  pt: {
    h1: "Camisas novas",
    metaTitle: "Camisas de Futebol Novas — Comparar Preços",
    metaDescription: "As camisas da temporada 2026/27 que acabaram de sair, com o preço de cada loja que já as tem.",
    intro: (n) => `${n} camisas que entraram no catálogo nos últimos 30 dias, da mais nova à mais antiga. Quando sai uma camisa nova, nós a adicionamos em menos de um dia com o preço de cada loja que já a vende.`,
    empty: "Nenhuma camisa nova nos últimos 30 dias.",
    badge: (d) => `Nova · ${d}`,
  },
  fr: {
    h1: "Nouveaux maillots",
    metaTitle: "Nouveaux Maillots de Foot — Comparer les Prix",
    metaDescription: "Les maillots de la saison 2026/27 qui viennent de sortir, avec le prix de chaque boutique qui les propose déjà.",
    intro: (n) => `${n} maillots ajoutés au catalogue ces 30 derniers jours, du plus récent au plus ancien. Quand un nouveau maillot sort, nous l'ajoutons en moins d'une journée avec le prix de chaque boutique qui le vend déjà.`,
    empty: "Aucun nouveau maillot ces 30 derniers jours.",
    badge: (d) => `Nouveau · ${d}`,
  },
  it: {
    h1: "Maglie nuove",
    metaTitle: "Maglie da Calcio Nuove — Confronta i Prezzi",
    metaDescription: "Le maglie della stagione 2026/27 appena uscite, con il prezzo di ogni negozio che le ha già.",
    intro: (n) => `${n} maglie entrate nel catalogo negli ultimi 30 giorni, dalla più nuova alla meno recente. Quando esce una maglia nuova, la aggiungiamo in meno di un giorno con il prezzo di ogni negozio che la vende già.`,
    empty: "Nessuna maglia nuova negli ultimi 30 giorni.",
    badge: (d) => `Nuova · ${d}`,
  },
};
