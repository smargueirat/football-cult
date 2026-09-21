import type { HubLocale } from "@/data/teamMeta";

// Textos de las páginas hub (equipo / liga / país / índice). Aparte de
// translations.ts a propósito: ese archivo es enorme y lo importan
// componentes de cliente; estas páginas son puro servidor.
type S = {
  home: string;
  leaguesIndex: string;
  teamH1: (team: string) => string;
  leagueH1: (league: string) => string;
  countryH1: (country: string) => string;
  teamIntro: (o: { team: string; n: number; stores: number; price: string; kinds: string }) => string;
  leagueIntro: (o: { league: string; teams: number; n: number; price: string }) => string;
  countryIntro: (o: { country: string; leagues: number; teams: number; n: number; price: string }) => string;
  allJerseys: string;
  otherTeams: (league: string) => string;
  leaguesOf: (country: string) => string;
  bestDeals: string;
  teams: string;
  nationalTeam: string;
  jerseysCount: (n: number) => string;
  from: string;
  stores: (n: number) => string;
  kids: string;
  women: string;
  browseCountries: string;
  browseLeagues: string;
  indexIntro: string;
  metaTeam: (team: string, price: string) => string;
  metaGeneric: (name: string, n: number, price: string) => string;
  seasonLabel: string;
};

export const HUB: Record<HubLocale, S> = {
  es: {
    home: "Inicio",
    leaguesIndex: "Ligas y países",
    teamH1: (t) => `Camisetas de ${t}`,
    leagueH1: (l) => `Camisetas de ${l}`,
    countryH1: (c) => `Camisetas de fútbol de ${c}`,
    teamIntro: ({ team, n, stores, price, kinds }) =>
      `Comparamos ${n} camisetas de ${team} en ${stores} tiendas online (${kinds}). El precio más bajo hoy es ${price}, con envío incluido. Los precios se actualizan todos los días y cada enlace lleva directo a la tienda.`,
    leagueIntro: ({ league, teams, n, price }) =>
      `${n} camisetas de ${teams} equipos de ${league}, comparadas entre varias tiendas. Precio más bajo hoy: ${price}.`,
    countryIntro: ({ country, leagues, teams, n, price }) =>
      `${n} camisetas de ${country}: la selección y ${teams} equipos en ${leagues} ${leagues === 1 ? "liga" : "ligas"}, comparadas entre varias tiendas. Precio más bajo hoy: ${price}.`,
    allJerseys: "Todas las camisetas",
    otherTeams: (l) => `Otros equipos de ${l}`,
    leaguesOf: (c) => `Ligas de ${c}`,
    bestDeals: "Los precios más bajos",
    teams: "Equipos",
    nationalTeam: "Selección nacional",
    jerseysCount: (n) => `${n} camisetas`,
    from: "Desde",
    stores: (n) => `${n} ${n === 1 ? "tienda" : "tiendas"}`,
    kids: "Niños",
    women: "Mujer",
    browseCountries: "Explorar por país",
    browseLeagues: "Explorar por liga",
    indexIntro: "Elegí una liga o un país para ver todos sus equipos y comparar el precio de cada camiseta entre tiendas.",
    metaTeam: (t, p) => `Camisetas de ${t}: compará precios entre tiendas. Desde ${p}. Titular, suplente y tercera de todas las temporadas.`,
    metaGeneric: (n, c, p) => `${n}: ${c} camisetas de fútbol comparadas entre tiendas. Desde ${p}.`,
    seasonLabel: "Temporada",
  },
  en: {
    home: "Home",
    leaguesIndex: "Leagues and countries",
    teamH1: (t) => `${t} football shirts`,
    leagueH1: (l) => `${l} football shirts`,
    countryH1: (c) => `Football shirts from ${c}`,
    teamIntro: ({ team, n, stores, price, kinds }) =>
      `We compare ${n} ${team} shirts across ${stores} online stores (${kinds}). The lowest price today is ${price}, shipping included. Prices are updated every day and every link goes straight to the store.`,
    leagueIntro: ({ league, teams, n, price }) =>
      `${n} shirts from ${teams} ${league} teams, compared across several stores. Lowest price today: ${price}.`,
    countryIntro: ({ country, leagues, teams, n, price }) =>
      `${n} shirts from ${country}: the national team and ${teams} clubs across ${leagues} ${leagues === 1 ? "league" : "leagues"}, compared across several stores. Lowest price today: ${price}.`,
    allJerseys: "All shirts",
    otherTeams: (l) => `Other ${l} teams`,
    leaguesOf: (c) => `Leagues in ${c}`,
    bestDeals: "Lowest prices",
    teams: "Teams",
    nationalTeam: "National team",
    jerseysCount: (n) => `${n} shirts`,
    from: "From",
    stores: (n) => `${n} ${n === 1 ? "store" : "stores"}`,
    kids: "Kids",
    women: "Women",
    browseCountries: "Browse by country",
    browseLeagues: "Browse by league",
    indexIntro: "Pick a league or a country to see all its teams and compare each shirt's price across stores.",
    metaTeam: (t, p) => `${t} football shirts: compare prices across stores. From ${p}. Home, away and third kits from every season.`,
    metaGeneric: (n, c, p) => `${n}: ${c} football shirts compared across stores. From ${p}.`,
    seasonLabel: "Season",
  },
  pt: {
    home: "Início",
    leaguesIndex: "Ligas e países",
    teamH1: (t) => `Camisas do ${t}`,
    leagueH1: (l) => `Camisas — ${l}`,
    countryH1: (c) => `Camisas de futebol — ${c}`,
    teamIntro: ({ team, n, stores, price, kinds }) =>
      `Comparamos ${n} camisas do ${team} em ${stores} lojas online (${kinds}). O menor preço hoje é ${price}, com frete incluído. Os preços são atualizados todos os dias e cada link leva direto à loja.`,
    leagueIntro: ({ league, teams, n, price }) =>
      `${n} camisas de ${teams} times de ${league}, comparadas entre várias lojas. Menor preço hoje: ${price}.`,
    countryIntro: ({ country, leagues, teams, n, price }) =>
      `${n} camisas — ${country}: a seleção e ${teams} times em ${leagues} ${leagues === 1 ? "liga" : "ligas"}, comparadas entre várias lojas. Menor preço hoje: ${price}.`,
    allJerseys: "Todas as camisas",
    otherTeams: (l) => `Outros times — ${l}`,
    leaguesOf: (c) => `Ligas — ${c}`,
    bestDeals: "Os menores preços",
    teams: "Times",
    nationalTeam: "Seleção nacional",
    jerseysCount: (n) => `${n} camisas`,
    from: "A partir de",
    stores: (n) => `${n} ${n === 1 ? "loja" : "lojas"}`,
    kids: "Infantil",
    women: "Feminina",
    browseCountries: "Explorar por país",
    browseLeagues: "Explorar por liga",
    indexIntro: "Escolha uma liga ou um país para ver todos os times e comparar o preço de cada camisa entre lojas.",
    metaTeam: (t, p) => `Camisas do ${t}: compare preços entre lojas. A partir de ${p}. Titular, reserva e terceira de todas as temporadas.`,
    metaGeneric: (n, c, p) => `${n}: ${c} camisas de futebol comparadas entre lojas. A partir de ${p}.`,
    seasonLabel: "Temporada",
  },
  fr: {
    home: "Accueil",
    leaguesIndex: "Ligues et pays",
    teamH1: (t) => `Maillots ${t}`,
    leagueH1: (l) => `Maillots ${l}`,
    countryH1: (c) => `Maillots de football — ${c}`,
    teamIntro: ({ team, n, stores, price, kinds }) =>
      `Nous comparons ${n} maillots ${team} dans ${stores} boutiques en ligne (${kinds}). Le prix le plus bas aujourd'hui est ${price}, livraison incluse. Les prix sont mis à jour chaque jour et chaque lien mène directement à la boutique.`,
    leagueIntro: ({ league, teams, n, price }) =>
      `${n} maillots de ${teams} équipes de ${league}, comparés entre plusieurs boutiques. Prix le plus bas aujourd'hui : ${price}.`,
    countryIntro: ({ country, leagues, teams, n, price }) =>
      `${n} maillots — ${country} : la sélection et ${teams} clubs dans ${leagues} ${leagues === 1 ? "ligue" : "ligues"}, comparés entre plusieurs boutiques. Prix le plus bas aujourd'hui : ${price}.`,
    allJerseys: "Tous les maillots",
    otherTeams: (l) => `Autres équipes — ${l}`,
    leaguesOf: (c) => `Ligues — ${c}`,
    bestDeals: "Les prix les plus bas",
    teams: "Équipes",
    nationalTeam: "Équipe nationale",
    jerseysCount: (n) => `${n} maillots`,
    from: "Dès",
    stores: (n) => `${n} ${n === 1 ? "boutique" : "boutiques"}`,
    kids: "Enfant",
    women: "Femme",
    browseCountries: "Explorer par pays",
    browseLeagues: "Explorer par ligue",
    indexIntro: "Choisissez une ligue ou un pays pour voir toutes ses équipes et comparer le prix de chaque maillot entre boutiques.",
    metaTeam: (t, p) => `Maillots ${t} : comparez les prix entre boutiques. Dès ${p}. Domicile, extérieur et third de toutes les saisons.`,
    metaGeneric: (n, c, p) => `${n} : ${c} maillots de football comparés entre boutiques. Dès ${p}.`,
    seasonLabel: "Saison",
  },
  it: {
    home: "Home",
    leaguesIndex: "Campionati e paesi",
    teamH1: (t) => `Maglie ${t}`,
    leagueH1: (l) => `Maglie ${l}`,
    countryH1: (c) => `Maglie da calcio — ${c}`,
    teamIntro: ({ team, n, stores, price, kinds }) =>
      `Confrontiamo ${n} maglie ${team} in ${stores} negozi online (${kinds}). Il prezzo più basso oggi è ${price}, spedizione inclusa. I prezzi si aggiornano ogni giorno e ogni link porta direttamente al negozio.`,
    leagueIntro: ({ league, teams, n, price }) =>
      `${n} maglie di ${teams} squadre di ${league}, confrontate tra vari negozi. Prezzo più basso oggi: ${price}.`,
    countryIntro: ({ country, leagues, teams, n, price }) =>
      `${n} maglie — ${country}: la nazionale e ${teams} squadre in ${leagues} ${leagues === 1 ? "campionato" : "campionati"}, confrontate tra vari negozi. Prezzo più basso oggi: ${price}.`,
    allJerseys: "Tutte le maglie",
    otherTeams: (l) => `Altre squadre — ${l}`,
    leaguesOf: (c) => `Campionati — ${c}`,
    bestDeals: "I prezzi più bassi",
    teams: "Squadre",
    nationalTeam: "Nazionale",
    jerseysCount: (n) => `${n} maglie`,
    from: "Da",
    stores: (n) => `${n} ${n === 1 ? "negozio" : "negozi"}`,
    kids: "Bambino",
    women: "Donna",
    browseCountries: "Esplora per paese",
    browseLeagues: "Esplora per campionato",
    indexIntro: "Scegli un campionato o un paese per vedere tutte le squadre e confrontare il prezzo di ogni maglia tra i negozi.",
    metaTeam: (t, p) => `Maglie ${t}: confronta i prezzi tra negozi. Da ${p}. Prima, seconda e terza maglia di ogni stagione.`,
    metaGeneric: (n, c, p) => `${n}: ${c} maglie da calcio confrontate tra negozi. Da ${p}.`,
    seasonLabel: "Stagione",
  },
};
