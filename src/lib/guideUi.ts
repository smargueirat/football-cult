import type { HubLocale } from "@/data/teamMeta";

// Etiquetas chicas de las guías, aparte de guides.ts (que trae los textos
// completos) para poder usarlas desde el footer sin sumar esos textos al bundle.
export const GUIDE_UI: Record<HubLocale, { index: string; indexIntro: string; read: string; related: string; sizes: string; auth: string; deals: string; worldCup: string; whenDrop: string }> = {
  es: { index: "Guías de compra", indexIntro: "Guías prácticas para comprar camisetas de fútbol con criterio.", read: "Leer la guía", related: "Sigue explorando", sizes: "Tabla de tallas", auth: "Guía de autenticidad", deals: "Camisetas que han bajado de precio", worldCup: "Camisetas del Mundial 2026", whenDrop: "Cuándo bajan de precio las camisetas" },
  en: { index: "Buying guides", indexIntro: "Practical guides to buy football shirts with confidence.", read: "Read the guide", related: "Keep exploring", sizes: "Size guide", auth: "Authenticity guide", deals: "Shirts that dropped in price", worldCup: "2026 World Cup shirts", whenDrop: "When shirts drop in price" },
  pt: { index: "Guias de compra", indexIntro: "Guias práticos para comprar camisas de futebol com critério.", read: "Ler o guia", related: "Continue explorando", sizes: "Guia de tamanhos", auth: "Guia de autenticidade", deals: "Camisas que baixaram de preço", worldCup: "Camisas do Mundial 2026", whenDrop: "Quando baixam as camisas" },
  fr: { index: "Guides d'achat", indexIntro: "Guides pratiques pour acheter des maillots de football en connaissance de cause.", read: "Lire le guide", related: "Continuer à explorer", sizes: "Guide des tailles", auth: "Guide d'authenticité", deals: "Maillots dont le prix a baissé", worldCup: "Maillots de la Coupe du monde 2026", whenDrop: "Quand les maillots baissent" },
  it: { index: "Guide all'acquisto", indexIntro: "Guide pratiche per acquistare maglie da calcio con criterio.", read: "Leggi la guida", related: "Continua a esplorare", sizes: "Guida alle taglie", auth: "Guida all'autenticità", deals: "Maglie scese di prezzo", worldCup: "Maglie dei Mondiali 2026", whenDrop: "Quando scendono le maglie" },
};
