import type { HubLocale } from "@/data/teamMeta";

// Nombres cortos de las páginas de bajadas (pie de página, enlaces de hubs).
// Archivo aparte para que el pie (componente de cliente) no cargue los textos
// largos de dealsStrings.ts / seasonalStrings.ts.
export const DEALS_NAV: Record<HubLocale, { drops: string; week: string; lows: string; feed: string; bf: string; gifts: string }> = {
  es: { drops: "Bajadas de precio", week: "Ofertas de la semana", lows: "Mínimos históricos", feed: "Feed de bajadas (Atom)", bf: "Black Friday fútbol", gifts: "Regalos de fútbol para Navidad y Reyes" },
  en: { drops: "Price drops", week: "Deals of the week", lows: "Lowest recorded prices", feed: "Price drop feed (Atom)", bf: "Black Friday football", gifts: "Football gifts for Christmas" },
  pt: { drops: "Baixas de preço", week: "Ofertas da semana", lows: "Mínimos históricos", feed: "Feed de baixas (Atom)", bf: "Black Friday futebol", gifts: "Presentes de futebol para o Natal" },
  fr: { drops: "Baisses de prix", week: "Bons plans de la semaine", lows: "Prix les plus bas relevés", feed: "Flux des baisses (Atom)", bf: "Black Friday foot", gifts: "Cadeaux foot pour Noël" },
  it: { drops: "Ribassi di prezzo", week: "Offerte della settimana", lows: "Minimi storici", feed: "Feed dei ribassi (Atom)", bf: "Black Friday calcio", gifts: "Regali di calcio per Natale" },
};
