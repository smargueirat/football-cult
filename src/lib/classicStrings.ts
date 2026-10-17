import type { HubLocale } from "@/data/teamMeta";

// Textos de la sección "Clásicas" (temporadas 2007-2019, isClassicKit) en los
// cinco idiomas. Solo cifras del catálogo, nada de historia inventada. La
// palabra "retro" sale solo como término de búsqueda y aclarando que aquí
// retro es 2006 o antes: ningún producto 2007+ se etiqueta Retro.
// Sin imports del catálogo: lo usa también el pie (cliente).

const list = (xs: string[], max = 8) => xs.slice(0, max).join(", ") + (xs.length > max ? ` (+${xs.length - max})` : "");
/** Tramo real de cada "década" de clásicas: 2000 = 2007-2009. */
export const classicSpan = (d: number) => (d < 2010 ? "2007-2009" : "2010-2019");

type Facts = { subject: string; n: number; seasons: string[]; stores: string[]; price: string };
type AllFacts = { n: number; teams: number; seasons: number; stores: number; price: string };

export interface ClassicUi {
  /** Pie, migas y enlaces: nombre corto de la sección. */
  nav: string;
  allH1: string;
  allTitle: string;
  allIntro: (o: AllFacts) => string;
  allMeta: (o: AllFacts) => string;
  teamH1: (team: string, national: boolean) => string;
  teamDecadeH1: (team: string, national: boolean, d: number) => string;
  decadeName: (d: number) => string;
  intro: (o: Facts) => string;
  meta: (o: { subject: string; n: number; price: string }) => string;
  byTeam: string;
  byDecade: string;
  /** Enlace de clásicas a retro. */
  retroLink: string;
}

const de = (national: boolean) => (national ? "de" : "del");

export const CLASSIC: Record<HubLocale, ClassicUi> = {
  es: {
    nav: "Camisetas clásicas",
    allH1: "Camisetas clásicas de fútbol (2007-2019)",
    allTitle: "Camisetas retro y clásicas de fútbol 2007-2019",
    allIntro: ({ n, teams, seasons, stores, price }) =>
      `Camisetas retro y clásicas: aquí están las de las temporadas 2007/08 a 2019/20, ${n} camisetas de ${teams} equipos y ${seasons} temporadas, en ${stores} tiendas. Precio hoy: ${price}. En este sitio «retro» es la temporada 2006 o anterior; esas tienen su propia sección.`,
    allMeta: ({ n, teams, price }) => `Compara ${n} camisetas clásicas (2007-2019) de ${teams} equipos entre tiendas, desde ${price}. Lo que muchos buscan como «retro».`,
    teamH1: (team, national) => `Camisetas clásicas ${de(national)} ${team} (2007-2019)`,
    teamDecadeH1: (team, national, d) => `Camisetas clásicas ${de(national)} ${team} (${classicSpan(d)})`,
    decadeName: (d) => (d < 2010 ? "Años 2000 (2007-2009)" : "Años 2010"),
    intro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "camiseta" : "camisetas"} de ${seasons.length === 1 ? "la temporada" : `${seasons.length} temporadas:`} ${list(seasons)}. ${stores.length === 1 ? "Tienda" : `${stores.length} tiendas`}: ${list(stores, 5)}. Precio hoy: ${price}. ¿Buscas camisetas «retro»? Aquí retro es 2006 o antes; estas de 2007 a 2019 son clásicas.`,
    meta: ({ subject, n, price }) => `${subject}: compara ${n} camisetas entre tiendas, desde ${price}. Las que muchos buscan como «retro».`,
    byTeam: "Clásicas por equipo",
    byDecade: "Clásicas por década",
    retroLink: "Camisetas retro (2006 o antes)",
  },
  en: {
    nav: "Classic shirts",
    allH1: "Classic football shirts 2007-2019",
    allTitle: "Retro & classic football shirts 2007-2019",
    allIntro: ({ n, teams, seasons, stores, price }) =>
      `Retro and classic football shirts: these are the 2007/08 to 2019/20 seasons, ${n} shirts from ${teams} teams and ${seasons} seasons, across ${stores} stores. Price today: ${price}. On this site "retro" means the 2006 season or earlier; those have their own section.`,
    allMeta: ({ n, teams, price }) => `Compare ${n} classic shirts (2007-2019) from ${teams} teams across stores, from ${price}. What many search for as "retro".`,
    teamH1: (team) => `Classic ${team} football shirts 2007-2019`,
    teamDecadeH1: (team, _n, d) => `Classic ${team} football shirts ${classicSpan(d)}`,
    decadeName: (d) => (d < 2010 ? "2000s (2007-2009)" : "2010s"),
    intro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "shirt" : "shirts"} from ${seasons.length === 1 ? "the season" : `${seasons.length} seasons:`} ${list(seasons)}. ${stores.length === 1 ? "Store" : `${stores.length} stores`}: ${list(stores, 5)}. Price today: ${price}. Looking for "retro" shirts? Here retro means 2006 or earlier; these 2007-2019 shirts are classics.`,
    meta: ({ subject, n, price }) => `${subject}: compare ${n} shirts across stores, from ${price}. What many search for as "retro".`,
    byTeam: "Classics by team",
    byDecade: "Classics by decade",
    retroLink: "Retro shirts (2006 or earlier)",
  },
  pt: {
    nav: "Camisas clássicas",
    allH1: "Camisas de futebol clássicas (2007-2019)",
    allTitle: "Camisas retrô e clássicas de futebol 2007-2019",
    allIntro: ({ n, teams, seasons, stores, price }) =>
      `Camisas retrô e clássicas: aqui estão as das temporadas 2007/08 a 2019/20, ${n} camisas de ${teams} times e ${seasons} temporadas, em ${stores} lojas. Preço hoje: ${price}. Neste site "retrô" é a temporada 2006 ou anterior; essas têm a sua própria seção.`,
    allMeta: ({ n, teams, price }) => `Compare ${n} camisas clássicas (2007-2019) de ${teams} times entre lojas, a partir de ${price}. O que muitos procuram como "retrô".`,
    teamH1: (team) => `Camisas clássicas ${team} (2007-2019)`,
    teamDecadeH1: (team, _n, d) => `Camisas clássicas ${team} (${classicSpan(d)})`,
    decadeName: (d) => (d < 2010 ? "Anos 2000 (2007-2009)" : "Anos 2010"),
    intro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "camisa" : "camisas"} ${seasons.length === 1 ? "da temporada" : `de ${seasons.length} temporadas:`} ${list(seasons)}. ${stores.length === 1 ? "Loja" : `${stores.length} lojas`}: ${list(stores, 5)}. Preço hoje: ${price}. Procura camisas "retrô"? Aqui retrô é 2006 ou antes; estas de 2007 a 2019 são clássicas.`,
    meta: ({ subject, n, price }) => `${subject}: compare ${n} camisas entre lojas, a partir de ${price}. O que muitos procuram como "retrô".`,
    byTeam: "Clássicas por time",
    byDecade: "Clássicas por década",
    retroLink: "Camisas retrô (2006 ou antes)",
  },
  fr: {
    nav: "Maillots classiques",
    allH1: "Maillots de foot classiques (2007-2019)",
    allTitle: "Maillots de foot rétro et classiques 2007-2019",
    allIntro: ({ n, teams, seasons, stores, price }) =>
      `Maillots rétro et classiques : voici les saisons 2007/08 à 2019/20, ${n} maillots de ${teams} équipes et ${seasons} saisons, dans ${stores} boutiques. Prix aujourd'hui : ${price}. Sur ce site, « rétro » désigne la saison 2006 ou avant ; ceux-là ont leur propre section.`,
    allMeta: ({ n, teams, price }) => `Comparez ${n} maillots classiques (2007-2019) de ${teams} équipes entre boutiques, dès ${price}. Ce que beaucoup cherchent comme « rétro ».`,
    teamH1: (team) => `Maillots classiques ${team} (2007-2019)`,
    teamDecadeH1: (team, _n, d) => `Maillots classiques ${team} (${classicSpan(d)})`,
    decadeName: (d) => (d < 2010 ? "Années 2000 (2007-2009)" : "Années 2010"),
    intro: ({ subject, n, seasons, stores, price }) =>
      `${subject} : ${n} ${n === 1 ? "maillot" : "maillots"} de ${seasons.length === 1 ? "la saison" : `${seasons.length} saisons :`} ${list(seasons)}. ${stores.length === 1 ? "Boutique" : `${stores.length} boutiques`} : ${list(stores, 5)}. Prix aujourd'hui : ${price}. Vous cherchez des maillots « rétro » ? Ici, rétro = 2006 ou avant ; ceux de 2007 à 2019 sont des classiques.`,
    meta: ({ subject, n, price }) => `${subject} : comparez ${n} maillots entre boutiques, dès ${price}. Ce que beaucoup cherchent comme « rétro ».`,
    byTeam: "Classiques par équipe",
    byDecade: "Classiques par décennie",
    retroLink: "Maillots rétro (2006 ou avant)",
  },
  it: {
    nav: "Maglie classiche",
    allH1: "Maglie da calcio classiche (2007-2019)",
    allTitle: "Maglie da calcio retrò e classiche 2007-2019",
    allIntro: ({ n, teams, seasons, stores, price }) =>
      `Maglie retrò e classiche: qui ci sono le stagioni dalla 2007/08 alla 2019/20, ${n} maglie di ${teams} squadre e ${seasons} stagioni, in ${stores} negozi. Prezzo oggi: ${price}. Su questo sito "retrò" è la stagione 2006 o precedente; quelle hanno una sezione propria.`,
    allMeta: ({ n, teams, price }) => `Confronta ${n} maglie classiche (2007-2019) di ${teams} squadre tra negozi, da ${price}. Quello che molti cercano come "retrò".`,
    teamH1: (team) => `Maglie classiche ${team} (2007-2019)`,
    teamDecadeH1: (team, _n, d) => `Maglie classiche ${team} (${classicSpan(d)})`,
    decadeName: (d) => (d < 2010 ? "Anni 2000 (2007-2009)" : "Anni 2010"),
    intro: ({ subject, n, seasons, stores, price }) =>
      `${subject}: ${n} ${n === 1 ? "maglia" : "maglie"} ${seasons.length === 1 ? "della stagione" : `di ${seasons.length} stagioni:`} ${list(seasons)}. ${stores.length === 1 ? "Negozio" : `${stores.length} negozi`}: ${list(stores, 5)}. Prezzo oggi: ${price}. Cerchi maglie "retrò"? Qui retrò è 2006 o prima; queste dal 2007 al 2019 sono classiche.`,
    meta: ({ subject, n, price }) => `${subject}: confronta ${n} maglie tra negozi, da ${price}. Quello che molti cercano come "retrò".`,
    byTeam: "Classiche per squadra",
    byDecade: "Classiche per decennio",
    retroLink: "Maglie retrò (2006 o prima)",
  },
};
