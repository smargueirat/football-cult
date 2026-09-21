import type { HubLocale } from "@/data/teamMeta";
import type { TypeKey } from "@/data/products";

const TYPE_PLURAL: Record<TypeKey, Record<HubLocale, string>> = {
  home: { es: "Camisetas titulares", en: "Home shirts", pt: "Camisas titulares", fr: "Maillots domicile", it: "Maglie casa" },
  away: { es: "Camisetas suplentes", en: "Away shirts", pt: "Camisas reservas", fr: "Maillots extérieur", it: "Maglie trasferta" },
  third: { es: "Terceras camisetas", en: "Third shirts", pt: "Terceiras camisas", fr: "Maillots third", it: "Terze maglie" },
  goalkeeper: { es: "Camisetas de arquero", en: "Goalkeeper shirts", pt: "Camisas de goleiro", fr: "Maillots de gardien", it: "Maglie da portiere" },
  training: { es: "Camisetas de entrenamiento", en: "Training shirts", pt: "Camisas de treino", fr: "Maillots d'entraînement", it: "Maglie da allenamento" },
  prematch: { es: "Camisetas pre-match", en: "Pre-match shirts", pt: "Camisas pré-jogo", fr: "Maillots d'avant-match", it: "Maglie pre-partita" },
  retro: { es: "Camisetas retro", en: "Retro shirts", pt: "Camisas retrô", fr: "Maillots rétro", it: "Maglie retrò" },
};

export const typePlural = (t: TypeKey, l: HubLocale) => TYPE_PLURAL[t][l];

export const SEASON_UI: Record<
  HubLocale,
  {
    seasonsIndex: string;
    seasonH1: (s: string) => string;
    typeH1: (type: string, s: string) => string;
    seasonIntro: (o: { season: string; n: number; teams: number; price: string }) => string;
    typeIntro: (o: { type: string; season: string; n: number; price: string }) => string;
    meta: (o: { h1: string; n: number; price: string }) => string;
    byType: string;
    cheapestOf: (type: string) => string;
    teams: string;
    offersH1: string;
    offersIntro: (n: number) => string;
    offersEmpty: string;
    offersMeta: string;
    seasons: string;
  }
> = {
  es: {
    seasonsIndex: "Temporadas",
    seasonH1: (s) => `Camisetas de fútbol ${s}`,
    typeH1: (t, s) => `${t} ${s}`,
    seasonIntro: ({ season, n, teams, price }) => `${n} camisetas de la temporada ${season} de ${teams} equipos, comparadas entre varias tiendas. Precio más bajo hoy: ${price}.`,
    typeIntro: ({ type, season, n, price }) => `${type} de la temporada ${season}: ${n} modelos comparados entre varias tiendas. Precio más bajo hoy: ${price}.`,
    meta: ({ h1, n, price }) => `${h1}: compará ${n} camisetas entre tiendas. Desde ${price}.`,
    byType: "Por tipo de camiseta",
    cheapestOf: (t) => `${t}: las más baratas`,
    teams: "Equipos con camisetas de esta temporada",
    offersH1: "Camisetas que bajaron de precio",
    offersIntro: (n) => `${n} camisetas bajaron de precio desde el último control diario. Ordenadas por el porcentaje de baja.`,
    offersEmpty: "Hoy no hay bajas de precio nuevas. Volvé mañana: los precios se controlan todos los días.",
    offersMeta: "Camisetas de fútbol que bajaron de precio hoy, ordenadas por porcentaje de baja.",
    seasons: "Temporadas",
  },
  en: {
    seasonsIndex: "Seasons",
    seasonH1: (s) => `${s} football shirts`,
    typeH1: (t, s) => `${t} ${s}`,
    seasonIntro: ({ season, n, teams, price }) => `${n} ${season} shirts from ${teams} teams, compared across several stores. Lowest price today: ${price}.`,
    typeIntro: ({ type, season, n, price }) => `${type} for the ${season} season: ${n} models compared across several stores. Lowest price today: ${price}.`,
    meta: ({ h1, n, price }) => `${h1}: compare ${n} shirts across stores. From ${price}.`,
    byType: "By kit type",
    cheapestOf: (t) => `${t}: lowest prices`,
    teams: "Teams with shirts this season",
    offersH1: "Football shirts that dropped in price",
    offersIntro: (n) => `${n} shirts dropped in price since the last daily check, sorted by percentage drop.`,
    offersEmpty: "No new price drops today. Come back tomorrow: prices are checked every day.",
    offersMeta: "Football shirts that dropped in price today, sorted by percentage drop.",
    seasons: "Seasons",
  },
  pt: {
    seasonsIndex: "Temporadas",
    seasonH1: (s) => `Camisas de futebol ${s}`,
    typeH1: (t, s) => `${t} ${s}`,
    seasonIntro: ({ season, n, teams, price }) => `${n} camisas da temporada ${season} de ${teams} times, comparadas entre várias lojas. Menor preço hoje: ${price}.`,
    typeIntro: ({ type, season, n, price }) => `${type} da temporada ${season}: ${n} modelos comparados entre várias lojas. Menor preço hoje: ${price}.`,
    meta: ({ h1, n, price }) => `${h1}: compare ${n} camisas entre lojas. A partir de ${price}.`,
    byType: "Por tipo de camisa",
    cheapestOf: (t) => `${t}: as mais baratas`,
    teams: "Times com camisas desta temporada",
    offersH1: "Camisas que baixaram de preço",
    offersIntro: (n) => `${n} camisas baixaram de preço desde a última checagem diária, ordenadas pela porcentagem de queda.`,
    offersEmpty: "Hoje não há novas quedas de preço. Volte amanhã: os preços são conferidos todos os dias.",
    offersMeta: "Camisas de futebol que baixaram de preço hoje, ordenadas pela porcentagem de queda.",
    seasons: "Temporadas",
  },
  fr: {
    seasonsIndex: "Saisons",
    seasonH1: (s) => `Maillots de football ${s}`,
    typeH1: (t, s) => `${t} ${s}`,
    seasonIntro: ({ season, n, teams, price }) => `${n} maillots de la saison ${season} de ${teams} équipes, comparés entre plusieurs boutiques. Prix le plus bas aujourd'hui : ${price}.`,
    typeIntro: ({ type, season, n, price }) => `${type} de la saison ${season} : ${n} modèles comparés entre plusieurs boutiques. Prix le plus bas aujourd'hui : ${price}.`,
    meta: ({ h1, n, price }) => `${h1} : comparez ${n} maillots entre boutiques. Dès ${price}.`,
    byType: "Par type de maillot",
    cheapestOf: (t) => `${t} : les moins chers`,
    teams: "Équipes avec des maillots de cette saison",
    offersH1: "Maillots dont le prix a baissé",
    offersIntro: (n) => `${n} maillots ont baissé de prix depuis le dernier contrôle quotidien, classés par pourcentage de baisse.`,
    offersEmpty: "Aucune nouvelle baisse de prix aujourd'hui. Revenez demain : les prix sont contrôlés chaque jour.",
    offersMeta: "Maillots de football dont le prix a baissé aujourd'hui, classés par pourcentage de baisse.",
    seasons: "Saisons",
  },
  it: {
    seasonsIndex: "Stagioni",
    seasonH1: (s) => `Maglie da calcio ${s}`,
    typeH1: (t, s) => `${t} ${s}`,
    seasonIntro: ({ season, n, teams, price }) => `${n} maglie della stagione ${season} di ${teams} squadre, confrontate tra vari negozi. Prezzo più basso oggi: ${price}.`,
    typeIntro: ({ type, season, n, price }) => `${type} della stagione ${season}: ${n} modelli confrontati tra vari negozi. Prezzo più basso oggi: ${price}.`,
    meta: ({ h1, n, price }) => `${h1}: confronta ${n} maglie tra negozi. Da ${price}.`,
    byType: "Per tipo di maglia",
    cheapestOf: (t) => `${t}: le più economiche`,
    teams: "Squadre con maglie di questa stagione",
    offersH1: "Maglie scese di prezzo",
    offersIntro: (n) => `${n} maglie sono scese di prezzo dall'ultimo controllo giornaliero, ordinate per percentuale di ribasso.`,
    offersEmpty: "Oggi nessun nuovo ribasso. Torna domani: i prezzi si controllano ogni giorno.",
    offersMeta: "Maglie da calcio scese di prezzo oggi, ordinate per percentuale di ribasso.",
    seasons: "Stagioni",
  },
};
