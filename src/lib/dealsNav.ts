import type { HubLocale } from "@/data/teamMeta";

// Nombres cortos de las páginas de bajadas (pie de página, enlaces de hubs).
// Archivo aparte para que el pie (componente de cliente) no cargue los textos
// largos de dealsStrings.ts.
export const DEALS_NAV: Record<HubLocale, { drops: string; week: string; lows: string; feed: string }> = {
  es: { drops: "Bajadas de precio", week: "Ofertas de la semana", lows: "Mínimos históricos", feed: "Feed de bajadas (Atom)" },
  en: { drops: "Price drops", week: "Deals of the week", lows: "Lowest recorded prices", feed: "Price drop feed (Atom)" },
  pt: { drops: "Baixas de preço", week: "Ofertas da semana", lows: "Mínimos históricos", feed: "Feed de baixas (Atom)" },
  fr: { drops: "Baisses de prix", week: "Bons plans de la semaine", lows: "Prix les plus bas relevés", feed: "Flux des baisses (Atom)" },
  it: { drops: "Ribassi di prezzo", week: "Offerte della settimana", lows: "Minimi storici", feed: "Feed dei ribassi (Atom)" },
};
