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
  pages: string;
  hubs: string;
  more: string;
  /** Nombre de cada grupo de hubs del mapa (primer tramo de la URL). */
  groups: Record<string, string>;
}

export const CATALOG_INDEX: Record<HubLocale, IndexCopy> = {
  es: {
    index: "Índice del catálogo",
    intro: "Todos los productos que comparamos, ordenados alfabéticamente. Es la lista completa, sin filtros.",
    section: { camisetas: "Camisetas", botas: "Botas", ropa: "Ropa", entrenamiento: "Entrenamiento", guantes: "Guantes", pelotas: "Balones", tickets: "Entradas" },
    page: "Página",
    prev: "Anterior",
    next: "Siguiente",
    of: "de",
    count: "{n} productos",
    pages: "Páginas",
    hubs: "Todas las categorías",
    more: "Más páginas",
    groups: { equipo: "Equipos", liga: "Ligas", pais: "Países", temporada: "Temporadas", guia: "Guías", estudios: "Estudios", botas: "Botas", ropa: "Ropa", entrenamiento: "Entrenamiento", guantes: "Guantes", pelotas: "Balones", tickets: "Entradas", retro: "Retro" },
  },
  en: {
    index: "Catalogue index",
    intro: "Every product we compare, in alphabetical order. The full list, no filters.",
    section: { camisetas: "Shirts", botas: "Boots", ropa: "Apparel", entrenamiento: "Training", guantes: "Gloves", pelotas: "Balls", tickets: "Tickets" },
    page: "Page",
    prev: "Previous",
    next: "Next",
    of: "of",
    count: "{n} products",
    pages: "Pages",
    hubs: "All categories",
    more: "More pages",
    groups: { equipo: "Teams", liga: "Leagues", pais: "Countries", temporada: "Seasons", guia: "Guides", estudios: "Studies", botas: "Boots", ropa: "Apparel", entrenamiento: "Training", guantes: "Gloves", pelotas: "Balls", tickets: "Tickets", retro: "Retro" },
  },
  pt: {
    index: "Índice do catálogo",
    intro: "Todos os produtos que comparamos, por ordem alfabética. A lista completa, sem filtros.",
    section: { camisetas: "Camisolas", botas: "Chuteiras", ropa: "Roupa", entrenamiento: "Treino", guantes: "Luvas", pelotas: "Bolas", tickets: "Ingressos" },
    page: "Página",
    prev: "Anterior",
    next: "Seguinte",
    of: "de",
    count: "{n} produtos",
    pages: "Páginas",
    hubs: "Todas as categorias",
    more: "Mais páginas",
    groups: { equipo: "Equipas", liga: "Ligas", pais: "Países", temporada: "Temporadas", guia: "Guias", estudios: "Estudos", botas: "Chuteiras", ropa: "Roupa", entrenamiento: "Treino", guantes: "Luvas", pelotas: "Bolas", tickets: "Ingressos", retro: "Retrô" },
  },
  fr: {
    index: "Index du catalogue",
    intro: "Tous les produits que nous comparons, par ordre alphabétique. La liste complète, sans filtres.",
    section: { camisetas: "Maillots", botas: "Chaussures", ropa: "Vêtements", entrenamiento: "Entraînement", guantes: "Gants", pelotas: "Ballons", tickets: "Billets" },
    page: "Page",
    prev: "Précédent",
    next: "Suivant",
    of: "sur",
    count: "{n} produits",
    pages: "Pages",
    hubs: "Toutes les catégories",
    more: "Autres pages",
    groups: { equipo: "Équipes", liga: "Championnats", pais: "Pays", temporada: "Saisons", guia: "Guides", estudios: "Études", botas: "Chaussures", ropa: "Vêtements", entrenamiento: "Entraînement", guantes: "Gants", pelotas: "Ballons", tickets: "Billets", retro: "Rétro" },
  },
  it: {
    index: "Indice del catalogo",
    intro: "Tutti i prodotti che confrontiamo, in ordine alfabetico. L'elenco completo, senza filtri.",
    section: { camisetas: "Maglie", botas: "Scarpini", ropa: "Abbigliamento", entrenamiento: "Allenamento", guantes: "Guanti", pelotas: "Palloni", tickets: "Biglietti" },
    page: "Pagina",
    prev: "Precedente",
    next: "Successiva",
    of: "di",
    count: "{n} prodotti",
    pages: "Pagine",
    hubs: "Tutte le categorie",
    more: "Altre pagine",
    groups: { equipo: "Squadre", liga: "Campionati", pais: "Paesi", temporada: "Stagioni", guia: "Guide", estudios: "Studi", botas: "Scarpini", ropa: "Abbigliamento", entrenamiento: "Allenamento", guantes: "Guanti", pelotas: "Palloni", tickets: "Biglietti", retro: "Retrò" },
  },
};
