import type { HubLocale } from "@/data/teamMeta";
import type { IndexSection } from "@/lib/catalogIndex";

interface IndexCopy {
  index: string;
  intro: string;
  section: Record<IndexSection, string>;
  page: string;
  prev: string;
  next: string;
  of: string;
  count: string;
}

export const CATALOG_INDEX: Record<HubLocale, IndexCopy> = {
  es: {
    index: "Índice del catálogo",
    intro: "Todos los productos que comparamos en al menos dos tiendas, ordenados alfabéticamente. Es la lista completa, sin filtros.",
    section: { camisetas: "Camisetas", botas: "Botas", ropa: "Ropa", entrenamiento: "Entrenamiento", guantes: "Guantes", pelotas: "Pelotas" },
    page: "Página",
    prev: "Anterior",
    next: "Siguiente",
    of: "de",
    count: "{n} productos",
  },
  en: {
    index: "Catalogue index",
    intro: "Every product we compare across at least two stores, in alphabetical order. The full list, no filters.",
    section: { camisetas: "Shirts", botas: "Boots", ropa: "Apparel", entrenamiento: "Training", guantes: "Gloves", pelotas: "Balls" },
    page: "Page",
    prev: "Previous",
    next: "Next",
    of: "of",
    count: "{n} products",
  },
  pt: {
    index: "Índice do catálogo",
    intro: "Todos os produtos que comparamos em pelo menos duas lojas, por ordem alfabética. A lista completa, sem filtros.",
    section: { camisetas: "Camisolas", botas: "Chuteiras", ropa: "Roupa", entrenamiento: "Treino", guantes: "Luvas", pelotas: "Bolas" },
    page: "Página",
    prev: "Anterior",
    next: "Seguinte",
    of: "de",
    count: "{n} produtos",
  },
  fr: {
    index: "Index du catalogue",
    intro: "Tous les produits que nous comparons dans au moins deux boutiques, par ordre alphabétique. La liste complète, sans filtres.",
    section: { camisetas: "Maillots", botas: "Chaussures", ropa: "Vêtements", entrenamiento: "Entraînement", guantes: "Gants", pelotas: "Ballons" },
    page: "Page",
    prev: "Précédent",
    next: "Suivant",
    of: "sur",
    count: "{n} produits",
  },
  it: {
    index: "Indice del catalogo",
    intro: "Tutti i prodotti che confrontiamo in almeno due negozi, in ordine alfabetico. L'elenco completo, senza filtri.",
    section: { camisetas: "Maglie", botas: "Scarpini", ropa: "Abbigliamento", entrenamiento: "Allenamento", guantes: "Guanti", pelotas: "Palloni" },
    page: "Pagina",
    prev: "Precedente",
    next: "Successiva",
    of: "di",
    count: "{n} prodotti",
  },
};
