import type { HubLocale } from "@/data/teamMeta";

// Textos de los hubs nuevos (src/lib/extraHubs.ts) en los cinco idiomas. Solo
// cifras del catálogo, nada de historia inventada (regla heritage-storytelling).
// /es en español de España (tú, talla, equipación).

const fmtDate = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "");

/** "años 90" / "1990s"... (2000 = de 2000 a 2006: lo de después ya no es retro). */
function decadeLabel(d: number, locale: HubLocale): string {
  const short = d >= 2000 ? String(d) : String(d).slice(2);
  return {
    es: `años ${short}`,
    en: `${d}s`,
    pt: `anos ${short}`,
    fr: `années ${short}`,
    it: `anni ${d >= 2000 ? d : `'${short}`}`,
  }[locale];
}

/** "1990/91, 1994/95, 1996/97 (+4)": hasta 8 y el resto contado. */
const list = (xs: string[], max = 8) => xs.slice(0, max).join(", ") + (xs.length > max ? ` (+${xs.length - max})` : "");

export interface ExtraUi {
  kidsH1: string;
  futsalH1: string;
  byLine: string;
  kidsAndFutsal: string;
  lineKidsNote: (n: number) => string;
  allModels: (n: number) => string;
  retroTeamH1: (team: string, national: boolean) => string;
  retroTeamDecadeH1: (team: string, national: boolean, d: number) => string;
  retroDecadeH1: (d: number) => string;
  decadeName: (d: number) => string;
  /** <title> de un hub retro: el H1 + el sinónimo que también se busca
   *  ("vintage") + el rango real de temporadas. */
  retroTitle: (h1: string, range: string) => string;
  /** seasons/stores: listas reales del catálogo; price: "12 € – 90 €". */
  retroIntro: (o: { subject: string; n: number; seasons: string[]; stores: string[]; price: string }) => string;
  retroMeta: (o: { subject: string; n: number; price: string; range: string }) => string;
  retroByDecade: string;
  retroByTeam: string;
  retroAll: string;
  retroCurrent: (team: string) => string;
  ticketTeamH1: (team: string) => string;
  ticketCompH1: (comp: string) => string;
  ticketIntro: (o: { subject: string; n: number; first: string; last: string; sellers: number; price: string }) => string;
  ticketMeta: (o: { subject: string; n: number; price: string }) => string;
  ticketByComp: string;
  ticketByTeam: string;
  ticketsAll: string;
  ticketsOf: (team: string) => string;
  explore: string;
}

export const EXTRA: Record<HubLocale, ExtraUi> = {
  es: {
    kidsH1: "Botas de fútbol para niños",
    futsalH1: "Zapatillas de fútbol sala",
    byLine: "Por línea de modelo",
    kidsAndFutsal: "Niños y fútbol sala",
    lineKidsNote: (n) => `Además hay ${n} ${n === 1 ? "modelo" : "modelos"} de esta línea en talla de niño: elige «Niño/a» en Filtros o entra en`,
    allModels: (n) => `Todos los modelos (${n})`,
    retroTeamH1: (team, national) => `Camisetas retro ${national ? "de" : "del"} ${team}`,
    retroTeamDecadeH1: (team, national, d) => `Camisetas retro ${national ? "de" : "del"} ${team} de los ${decadeLabel(d, "es")}`,
    retroDecadeH1: (d) => `Camisetas retro de los ${decadeLabel(d, "es")}`,
    decadeName: (d) => `Años ${d >= 2000 ? "2000 (hasta 2006)" : String(d).slice(2)}`,
    retroTitle: (h1, range) => `${h1}: equipaciones vintage ${range}`,
    retroIntro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "camiseta" : "camisetas"} de ${seasons.length === 1 ? "la temporada" : `${seasons.length} temporadas:`} ${list(seasons)}. ${stores.length === 1 ? "Tienda" : `${stores.length} tiendas`}: ${list(stores, 5)}. Precio hoy: ${price}. Aquí «retro» es la temporada 2006 o anterior.`,
    retroMeta: ({ subject, n, price, range }) => `${subject}: compara ${n} camisetas vintage (${range}) entre tiendas. Desde ${price}.`,
    retroByDecade: "Retro por década",
    retroByTeam: "Retro por equipo",
    retroAll: "Todas las camisetas retro",
    retroCurrent: (team) => `Camisetas actuales de ${team}`,
    ticketTeamH1: (team) => `Entradas ${team}`,
    ticketCompH1: (comp) => `Entradas ${comp}`,
    ticketIntro: ({ subject, n, first, last, sellers, price }) =>
      `${subject}: ${n} ${n === 1 ? "partido" : "partidos"} entre el ${fmtDate(first)} y el ${fmtDate(last)}, con precio de ${sellers === 1 ? "un vendedor" : `${sellers} vendedores`}. La entrada más barata hoy: ${price}. Son vendedores de reventa: el precio lo fija el mercado y cambia cada día.`,
    ticketMeta: ({ subject, n, price }) => `${subject}: ${n} partidos con precio y enlace directo al vendedor. Desde ${price}.`,
    ticketByComp: "Entradas por competición",
    ticketByTeam: "Entradas por equipo",
    ticketsAll: "Todas las entradas",
    ticketsOf: (team) => `Entradas ${team}`,
    explore: "Explorar",
  },
  en: {
    kidsH1: "Kids' football boots",
    futsalH1: "Futsal shoes",
    byLine: "By boot line",
    kidsAndFutsal: "Kids and futsal",
    lineKidsNote: (n) => `There are also ${n} ${n === 1 ? "model" : "models"} of this line in kids' sizes: choose "Kids" in Filters or go to`,
    allModels: (n) => `All models (${n})`,
    // "retro {team} shirt" / "retro {team} football shirt": así se busca
    // (Search Console sep-oct 2026, posiciones 9,9-11,3).
    retroTeamH1: (team) => `Retro ${team} football shirts`,
    // "90s", como se busca ("manchester united 90s shirt").
    retroTeamDecadeH1: (team, _n, d) => `Retro ${team} ${d >= 2000 ? "2000s" : `${String(d).slice(2)}s`} football shirts`,
    retroDecadeH1: (d) => `${decadeLabel(d, "en")} retro football shirts`,
    decadeName: (d) => (d >= 2000 ? "2000s (up to 2006)" : `${d}s`),
    retroTitle: (h1, range) => `${h1}: vintage kits ${range}`,
    retroIntro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "shirt" : "shirts"} from ${seasons.length === 1 ? "the season" : `${seasons.length} seasons:`} ${list(seasons)}. ${stores.length === 1 ? "Store" : `${stores.length} stores`}: ${list(stores, 5)}. Price today: ${price}. Here "retro" means the 2006 season or earlier.`,
    retroMeta: ({ subject, n, price, range }) => `${subject}: compare ${n} vintage shirts (${range}) across stores. From ${price}.`,
    retroByDecade: "Retro by decade",
    retroByTeam: "Retro by team",
    retroAll: "All retro shirts",
    retroCurrent: (team) => `Current ${team} shirts`,
    ticketTeamH1: (team) => `${team} tickets`,
    ticketCompH1: (comp) => `${comp} tickets`,
    ticketIntro: ({ subject, n, first, last, sellers, price }) =>
      `${subject}: ${n} ${n === 1 ? "match" : "matches"} between ${fmtDate(first)} and ${fmtDate(last)}, priced by ${sellers === 1 ? "one seller" : `${sellers} sellers`}. Cheapest ticket today: ${price}. These are resale sellers: the market sets the price and it changes every day.`,
    ticketMeta: ({ subject, n, price }) => `${subject}: ${n} matches with price and a direct link to the seller. From ${price}.`,
    ticketByComp: "Tickets by competition",
    ticketByTeam: "Tickets by team",
    ticketsAll: "All tickets",
    ticketsOf: (team) => `${team} tickets`,
    explore: "Explore",
  },
  pt: {
    kidsH1: "Chuteiras de futebol infantis",
    futsalH1: "Chuteiras de futsal",
    byLine: "Por linha de modelo",
    kidsAndFutsal: "Infantil e futsal",
    lineKidsNote: (n) => `Há também ${n} ${n === 1 ? "modelo" : "modelos"} desta linha em tamanho infantil: escolha «Infantil» em Filtros ou acesse`,
    allModels: (n) => `Todos os modelos (${n})`,
    retroTeamH1: (team) => `Camisas retrô ${team}`,
    retroTeamDecadeH1: (team, _n, d) => `Camisas retrô ${team} dos ${decadeLabel(d, "pt")}`,
    retroDecadeH1: (d) => `Camisas retrô dos ${decadeLabel(d, "pt")}`,
    decadeName: (d) => `Anos ${d >= 2000 ? "2000 (até 2006)" : String(d).slice(2)}`,
    retroTitle: (h1, range) => `${h1}: vintage ${range}`,
    retroIntro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "camisa" : "camisas"} de ${seasons.length === 1 ? "a temporada" : `${seasons.length} temporadas:`} ${list(seasons)}. ${stores.length === 1 ? "Loja" : `${stores.length} lojas`}: ${list(stores, 5)}. Preço hoje: ${price}. Aqui «retrô» é a temporada 2006 ou anterior.`,
    retroMeta: ({ subject, n, price, range }) => `${subject}: compare ${n} camisas vintage (${range}) entre lojas. A partir de ${price}.`,
    retroByDecade: "Retrô por década",
    retroByTeam: "Retrô por time",
    retroAll: "Todas as camisas retrô",
    retroCurrent: (team) => `Camisas atuais ${team}`,
    ticketTeamH1: (team) => `Ingressos ${team}`,
    ticketCompH1: (comp) => `Ingressos ${comp}`,
    ticketIntro: ({ subject, n, first, last, sellers, price }) =>
      `${subject}: ${n} ${n === 1 ? "partida" : "partidas"} entre ${fmtDate(first)} e ${fmtDate(last)}, com preço de ${sellers === 1 ? "um vendedor" : `${sellers} vendedores`}. Ingresso mais barato hoje: ${price}. São vendedores de revenda: o preço é definido pelo mercado e muda todo dia.`,
    ticketMeta: ({ subject, n, price }) => `${subject}: ${n} partidas com preço e link direto ao vendedor. A partir de ${price}.`,
    ticketByComp: "Ingressos por competição",
    ticketByTeam: "Ingressos por time",
    ticketsAll: "Todos os ingressos",
    ticketsOf: (team) => `Ingressos ${team}`,
    explore: "Explorar",
  },
  fr: {
    kidsH1: "Chaussures de football pour enfants",
    futsalH1: "Chaussures de futsal",
    byLine: "Par gamme de modèle",
    kidsAndFutsal: "Enfants et futsal",
    lineKidsNote: (n) => `Il y a aussi ${n} ${n === 1 ? "modèle" : "modèles"} de cette gamme en pointure enfant : choisissez « Enfant » dans Filtres ou allez sur`,
    allModels: (n) => `Tous les modèles (${n})`,
    retroTeamH1: (team) => `Maillots rétro ${team}`,
    retroTeamDecadeH1: (team, _n, d) => `Maillots rétro ${team} des ${decadeLabel(d, "fr")}`,
    retroDecadeH1: (d) => `Maillots rétro des ${decadeLabel(d, "fr")}`,
    decadeName: (d) => `Années ${d >= 2000 ? "2000 (jusqu'à 2006)" : String(d).slice(2)}`,
    retroTitle: (h1, range) => `${h1} : maillots vintage ${range}`,
    retroIntro: ({ subject, n, seasons, stores, price }) =>
      `${subject} : ${n} ${n === 1 ? "maillot" : "maillots"} de ${seasons.length === 1 ? "la saison" : `${seasons.length} saisons :`} ${list(seasons)}. ${stores.length === 1 ? "Boutique" : `${stores.length} boutiques`} : ${list(stores, 5)}. Prix aujourd'hui : ${price}. Ici, « rétro » veut dire la saison 2006 ou avant.`,
    retroMeta: ({ subject, n, price, range }) => `${subject} : comparez ${n} maillots vintage (${range}) entre boutiques. Dès ${price}.`,
    retroByDecade: "Rétro par décennie",
    retroByTeam: "Rétro par équipe",
    retroAll: "Tous les maillots rétro",
    retroCurrent: (team) => `Maillots actuels ${team}`,
    ticketTeamH1: (team) => `Billets ${team}`,
    ticketCompH1: (comp) => `Billets ${comp}`,
    ticketIntro: ({ subject, n, first, last, sellers, price }) =>
      `${subject} : ${n} ${n === 1 ? "match" : "matchs"} entre le ${fmtDate(first)} et le ${fmtDate(last)}, avec le prix de ${sellers === 1 ? "un vendeur" : `${sellers} vendeurs`}. Billet le moins cher aujourd'hui : ${price}. Ce sont des vendeurs de revente : le marché fixe le prix et il change chaque jour.`,
    ticketMeta: ({ subject, n, price }) => `${subject} : ${n} matchs avec prix et lien direct vers le vendeur. Dès ${price}.`,
    ticketByComp: "Billets par compétition",
    ticketByTeam: "Billets par équipe",
    ticketsAll: "Tous les billets",
    ticketsOf: (team) => `Billets ${team}`,
    explore: "Explorer",
  },
  it: {
    kidsH1: "Scarpe da calcio per bambini",
    futsalH1: "Scarpe da calcio a 5",
    byLine: "Per linea di modello",
    kidsAndFutsal: "Bambini e calcio a 5",
    lineKidsNote: (n) => `Ci sono anche ${n} ${n === 1 ? "modello" : "modelli"} di questa linea in taglia bambino: scegli «Bambino» in Filtri o vai a`,
    allModels: (n) => `Tutti i modelli (${n})`,
    retroTeamH1: (team) => `Maglie retrò ${team}`,
    retroTeamDecadeH1: (team, _n, d) => `Maglie retrò ${team} ${decadeLabel(d, "it")}`,
    retroDecadeH1: (d) => `Maglie retrò ${decadeLabel(d, "it")}`,
    decadeName: (d) => (d >= 2000 ? "Anni 2000 (fino al 2006)" : `Anni '${String(d).slice(2)}`),
    retroTitle: (h1, range) => `${h1}: maglie vintage ${range}`,
    retroIntro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "maglia" : "maglie"} di ${seasons.length === 1 ? "la stagione" : `${seasons.length} stagioni:`} ${list(seasons)}. ${stores.length === 1 ? "Negozio" : `${stores.length} negozi`}: ${list(stores, 5)}. Prezzo oggi: ${price}. Qui «retrò» significa la stagione 2006 o precedente.`,
    retroMeta: ({ subject, n, price, range }) => `${subject}: confronta ${n} maglie vintage (${range}) tra negozi. Da ${price}.`,
    retroByDecade: "Retrò per decennio",
    retroByTeam: "Retrò per squadra",
    retroAll: "Tutte le maglie retrò",
    retroCurrent: (team) => `Maglie attuali ${team}`,
    ticketTeamH1: (team) => `Biglietti ${team}`,
    ticketCompH1: (comp) => `Biglietti ${comp}`,
    ticketIntro: ({ subject, n, first, last, sellers, price }) =>
      `${subject}: ${n} ${n === 1 ? "partita" : "partite"} tra il ${fmtDate(first)} e il ${fmtDate(last)}, con il prezzo di ${sellers === 1 ? "un venditore" : `${sellers} venditori`}. Biglietto più economico oggi: ${price}. Sono venditori di rivendita: il prezzo lo fa il mercato e cambia ogni giorno.`,
    ticketMeta: ({ subject, n, price }) => `${subject}: ${n} partite con prezzo e link diretto al venditore. Da ${price}.`,
    ticketByComp: "Biglietti per competizione",
    ticketByTeam: "Biglietti per squadra",
    ticketsAll: "Tutti i biglietti",
    ticketsOf: (team) => `Biglietti ${team}`,
    explore: "Esplora",
  },
};
