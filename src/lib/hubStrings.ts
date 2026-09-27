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
  // Preguntas frecuentes del hub. Todo lo que responden sale del catálogo
  // en vivo (ver hubFaq.ts): si un dato no existe, la pregunta no se
  // muestra. Una respuesta genérica sería justo lo que hace que Google
  // rastree una página y decida no indexarla.
  faqTitle: string;
  faqPriceQ: (subject: string) => string;
  faqPriceA: (o: { price: string; store: string; n: number; stores: number }) => string;
  faqWhereQ: (subject: string) => string;
  faqWhereA: (o: { store: string; price: string }) => string;
  faqSaveQ: (subject: string) => string;
  faqSaveA: (o: { abs: string; pct: number; cheap: string; dear: string }) => string;
  faqSeasonsQ: (subject: string) => string;
  faqSeasonsA: (o: { oldest: string; newest: string; n: number }) => string;
  faqUpdated: (date: string) => string;
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
    faqTitle: "Preguntas frecuentes",
    faqPriceQ: (x) => `¿Cuánto cuesta una camiseta de ${x}?`,
    faqPriceA: ({ price, store, n, stores }) =>
      `Hoy, desde ${price} con envío incluido, en ${store}. Es el precio más bajo de ${n} ${n === 1 ? "camiseta comparada" : "camisetas comparadas"} entre ${stores} ${stores === 1 ? "tienda" : "tiendas"}.`,
    faqWhereQ: (x) => `¿Dónde está más barata la camiseta de ${x}?`,
    faqWhereA: ({ store, price }) =>
      `En ${store}, a ${price}. Comparamos el total con envío, no solo el precio de lista, porque es lo que termina pagando.`,
    faqSaveQ: (x) => `¿Cuánto se ahorra comparando camisetas de ${x}?`,
    faqSaveA: ({ abs, pct, cheap, dear }) =>
      `En la camiseta con más diferencia, ${abs} (${pct}%): ${cheap} contra ${dear}. Solo se comparan tiendas oficiales entre sí; los marketplaces y las réplicas quedan fuera de esta cuenta porque no son el mismo producto.`,
    faqSeasonsQ: (x) => `¿Qué temporadas de ${x} hay?`,
    faqSeasonsA: ({ oldest, newest, n }) => `De ${oldest} a ${newest}, ${n} camisetas en total.`,
    faqUpdated: (d) => `Precios revisados el ${d}.`,
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
    faqTitle: "Frequently asked questions",
    faqPriceQ: (x) => `How much does a ${x} shirt cost?`,
    faqPriceA: ({ price, store, n, stores }) =>
      `Today, from ${price} including delivery, at ${store}. That is the lowest of ${n} ${n === 1 ? "shirt compared" : "shirts compared"} across ${stores} ${stores === 1 ? "store" : "stores"}.`,
    faqWhereQ: (x) => `Where is the ${x} shirt cheapest?`,
    faqWhereA: ({ store, price }) =>
      `At ${store}, for ${price}. We compare the total with delivery, not just the list price, because that is what you actually pay.`,
    faqSaveQ: (x) => `How much can you save comparing ${x} shirts?`,
    faqSaveA: ({ abs, pct, cheap, dear }) =>
      `On the shirt with the widest gap, ${abs} (${pct}%): ${cheap} against ${dear}. Only official retailers are compared with each other; marketplaces and replicas are left out of this figure because they are not the same product.`,
    faqSeasonsQ: (x) => `Which ${x} seasons are available?`,
    faqSeasonsA: ({ oldest, newest, n }) => `From ${oldest} to ${newest}, ${n} shirts in total.`,
    faqUpdated: (d) => `Prices checked on ${d}.`,
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
    faqTitle: "Perguntas frequentes",
    faqPriceQ: (x) => `Quanto custa uma camisa do ${x}?`,
    faqPriceA: ({ price, store, n, stores }) =>
      `Hoje, a partir de ${price} com envio incluído, na ${store}. É o preço mais baixo entre ${n} ${n === 1 ? "camisa comparada" : "camisas comparadas"} em ${stores} ${stores === 1 ? "loja" : "lojas"}.`,
    faqWhereQ: (x) => `Onde a camisa do ${x} está mais barata?`,
    faqWhereA: ({ store, price }) =>
      `Na ${store}, por ${price}. Comparamos o total com envio, não apenas o preço de tabela, porque é o que você paga no fim.`,
    faqSaveQ: (x) => `Quanto dá para economizar comparando camisas do ${x}?`,
    faqSaveA: ({ abs, pct, cheap, dear }) =>
      `Na camisa com maior diferença, ${abs} (${pct}%): ${cheap} contra ${dear}. Só comparamos lojas oficiais entre si; marketplaces e réplicas ficam de fora desta conta porque não são o mesmo produto.`,
    faqSeasonsQ: (x) => `Quais temporadas do ${x} existem?`,
    faqSeasonsA: ({ oldest, newest, n }) => `De ${oldest} a ${newest}, ${n} camisas no total.`,
    faqUpdated: (d) => `Preços verificados em ${d}.`,
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
    faqTitle: "Questions fréquentes",
    faqPriceQ: (x) => `Combien coûte un maillot de ${x} ?`,
    faqPriceA: ({ price, store, n, stores }) =>
      `Aujourd'hui, à partir de ${price} livraison comprise, chez ${store}. C'est le prix le plus bas sur ${n} ${n === 1 ? "maillot comparé" : "maillots comparés"} dans ${stores} ${stores === 1 ? "boutique" : "boutiques"}.`,
    faqWhereQ: (x) => `Où le maillot de ${x} est-il le moins cher ?`,
    faqWhereA: ({ store, price }) =>
      `Chez ${store}, à ${price}. Nous comparons le total livraison comprise, pas seulement le prix affiché, car c'est ce que vous payez vraiment.`,
    faqSaveQ: (x) => `Combien peut-on économiser en comparant les maillots de ${x} ?`,
    faqSaveA: ({ abs, pct, cheap, dear }) =>
      `Sur le maillot où l'écart est le plus large, ${abs} (${pct} %) : ${cheap} contre ${dear}. Seules les boutiques officielles sont comparées entre elles ; les marketplaces et les répliques sont exclues de ce calcul car ce n'est pas le même produit.`,
    faqSeasonsQ: (x) => `Quelles saisons de ${x} sont disponibles ?`,
    faqSeasonsA: ({ oldest, newest, n }) => `De ${oldest} à ${newest}, ${n} maillots au total.`,
    faqUpdated: (d) => `Prix vérifiés le ${d}.`,
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
    faqTitle: "Domande frequenti",
    faqPriceQ: (x) => `Quanto costa una maglia del ${x}?`,
    faqPriceA: ({ price, store, n, stores }) =>
      `Oggi, da ${price} con spedizione inclusa, su ${store}. È il prezzo più basso fra ${n} ${n === 1 ? "maglia confrontata" : "maglie confrontate"} in ${stores} ${stores === 1 ? "negozio" : "negozi"}.`,
    faqWhereQ: (x) => `Dove costa meno la maglia del ${x}?`,
    faqWhereA: ({ store, price }) =>
      `Su ${store}, a ${price}. Confrontiamo il totale con la spedizione, non solo il prezzo di listino, perché è quello che si paga davvero.`,
    faqSaveQ: (x) => `Quanto si risparmia confrontando le maglie del ${x}?`,
    faqSaveA: ({ abs, pct, cheap, dear }) =>
      `Sulla maglia con la differenza più ampia, ${abs} (${pct}%): ${cheap} contro ${dear}. Confrontiamo solo negozi ufficiali fra loro; marketplace e repliche restano fuori da questo conto perché non sono lo stesso prodotto.`,
    faqSeasonsQ: (x) => `Quali stagioni del ${x} ci sono?`,
    faqSeasonsA: ({ oldest, newest, n }) => `Dal ${oldest} al ${newest}, ${n} maglie in totale.`,
    faqUpdated: (d) => `Prezzi verificati il ${d}.`,
  },
};
