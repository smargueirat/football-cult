import type { HubLocale } from "@/data/teamMeta";

// Textos de /regalos, en su propio archivo por el mismo motivo que
// seasonStrings.ts: meterlos en translations.ts obliga a editar con regex un
// archivo enorme de cinco idiomas, que ya rompió una vez.

interface GiftsUi {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: (n: number) => string;
  empty: string;
  upTo25: string;
  upTo50: string;
  upTo100: string;
  over100: string;
  /** Pie de cada tramo, explicando que el precio ya incluye envío. */
  note: string;
}

export const GIFTS_UI: Record<HubLocale, GiftsUi> = {
  es: {
    h1: "Regalos de fútbol por presupuesto",
    metaTitle: "Regalos de fútbol por presupuesto — Comparar precios",
    metaDescription:
      "Ideas de regalo para un aficionado al fútbol, ordenadas por lo que quieras gastar: camisetas, botas, balones y equipamiento, con el precio de varias tiendas comparado.",
    intro: (n) =>
      `${n} ideas de regalo para alguien a quien le gusta el fútbol, agrupadas por presupuesto. Cada una muestra el precio de todas las tiendas que la tienen, envío incluido, así que ves de un vistazo si entra en lo que quieres gastar.`,
    empty: "No hay regalos disponibles en este momento.",
    upTo25: "Por menos de 25 €",
    upTo50: "Entre 25 y 50 €",
    upTo100: "Entre 50 y 100 €",
    over100: "Más de 100 €",
    note: "Precios con envío incluido, convertidos a euros. El precio final lo pone cada tienda.",
  },
  en: {
    h1: "Football gifts by budget",
    metaTitle: "Football Gifts by Budget — Compare Prices",
    metaDescription:
      "Gift ideas for a football fan, grouped by what you want to spend: shirts, boots, balls and gear, with prices compared across stores.",
    intro: (n) =>
      `${n} gift ideas for someone who loves football, grouped by budget. Each one shows the price at every store that has it, shipping included, so you can see at a glance whether it fits what you want to spend.`,
    empty: "No gifts available right now.",
    upTo25: "Under €25",
    upTo50: "€25 to €50",
    upTo100: "€50 to €100",
    over100: "Over €100",
    note: "Prices include shipping, converted to euros. The final price is set by each store.",
  },
  pt: {
    h1: "Presentes de futebol por orçamento",
    metaTitle: "Presentes de Futebol por Orçamento — Comparar Preços",
    metaDescription:
      "Ideias de presente para um torcedor, agrupadas pelo que você quer gastar: camisas, chuteiras, bolas e equipamento, com preços comparados entre lojas.",
    intro: (n) =>
      `${n} ideias de presente para quem gosta de futebol, agrupadas por orçamento. Cada uma mostra o preço em todas as lojas que a têm, com frete incluído, para você ver de imediato se cabe no que quer gastar.`,
    empty: "Nenhum presente disponível no momento.",
    upTo25: "Até 25 €",
    upTo50: "De 25 a 50 €",
    upTo100: "De 50 a 100 €",
    over100: "Mais de 100 €",
    note: "Preços com frete incluído, convertidos em euros. O preço final é definido por cada loja.",
  },
  fr: {
    h1: "Cadeaux foot par budget",
    metaTitle: "Cadeaux Foot par Budget — Comparer les Prix",
    metaDescription:
      "Des idées de cadeau pour un passionné de foot, classées selon ce que vous voulez dépenser : maillots, chaussures, ballons et équipement, prix comparés entre boutiques.",
    intro: (n) =>
      `${n} idées de cadeau pour quelqu'un qui aime le foot, classées par budget. Chacune affiche le prix de toutes les boutiques qui l'ont, livraison comprise, pour voir tout de suite si ça rentre dans ce que vous voulez dépenser.`,
    empty: "Aucun cadeau disponible pour le moment.",
    upTo25: "Moins de 25 €",
    upTo50: "De 25 à 50 €",
    upTo100: "De 50 à 100 €",
    over100: "Plus de 100 €",
    note: "Prix livraison comprise, convertis en euros. Le prix final est fixé par chaque boutique.",
  },
  it: {
    h1: "Regali di calcio per budget",
    metaTitle: "Regali di Calcio per Budget — Confronta i Prezzi",
    metaDescription:
      "Idee regalo per un tifoso, divise per quanto vuoi spendere: maglie, scarpini, palloni e attrezzatura, con i prezzi confrontati fra i negozi.",
    intro: (n) =>
      `${n} idee regalo per chi ama il calcio, divise per budget. Ognuna mostra il prezzo di tutti i negozi che ce l'hanno, spedizione inclusa, così vedi subito se rientra in quello che vuoi spendere.`,
    empty: "Nessun regalo disponibile al momento.",
    upTo25: "Meno di 25 €",
    upTo50: "Da 25 a 50 €",
    upTo100: "Da 50 a 100 €",
    over100: "Più di 100 €",
    note: "Prezzi con spedizione inclusa, convertiti in euro. Il prezzo finale lo stabilisce ogni negozio.",
  },
};
