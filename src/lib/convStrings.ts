import type { Locale } from "@/lib/i18n/translations";

// Textos de los botones directos a tienda, las alternativas y la captura de
// vuelta (alertas + Telegram), 2026-10-16. Aparte de translations.ts para no
// tocar su interfaz de 3.000 líneas. /es: español de España (tú).
export const CONV: Record<
  Locale,
  {
    dealsEyebrow: string;
    dealsTitle: string;
    dealsSub: string;
    /** Botón con precio: "Ver en {store} — {price}". */
    goWithPrice: string;
    goStore: string;
    totalWithShipping: string;
    before: string;
    lowestInDays: string;
    altSoldOut: string;
    altCheaper: string;
    details: string;
    alertTitle: string;
    alertBody: string;
    tgTeam: string;
    tgChannel: string;
    dropsCaptureTitle: string;
    dropsCaptureBody: string;
    tgBot: string;
  }
> = {
  es: {
    dealsEyebrow: "Hoy",
    dealsTitle: "Mejores ofertas de hoy",
    dealsSub: "Bajadas comprobadas en nuestro registro y mínimos de varias semanas, en tiendas oficiales. Un toque y estás en la tienda.",
    goWithPrice: "Ver en {store} — {price}",
    goStore: "Ver en {store}",
    totalWithShipping: "Total con envío",
    before: "Antes {price}",
    lowestInDays: "Precio más bajo en {days} días",
    altSoldOut: "Agotada aquí: alternativas con precio directo",
    altCheaper: "Parecidas y más baratas",
    details: "Ver ficha",
    alertTitle: "¿Todavía no? Te avisamos si baja",
    alertBody: "Un correo cuando baje de precio. Sin cuenta: confirmas el correo una vez y te das de baja con un clic.",
    tgTeam: "Avisos de {team} en Telegram",
    tgChannel: "Canal de bajadas en Telegram",
    dropsCaptureTitle: "Que las bajadas te lleguen solas",
    dropsCaptureBody: "Las bajadas del día en nuestro canal de Telegram, avisos de tu equipo con el bot, o un correo cuando baje la camiseta o la bota que quieras (botón «Avísame» en cada ficha).",
    tgBot: "Avisos de tu equipo (bot de Telegram)",
  },
  en: {
    dealsEyebrow: "Today",
    dealsTitle: "Today's best deals",
    dealsSub: "Price drops verified in our own records and multi-week lows, at official stores. One tap and you're at the store.",
    goWithPrice: "View at {store} — {price}",
    goStore: "View at {store}",
    totalWithShipping: "Total incl. shipping",
    before: "Was {price}",
    lowestInDays: "Lowest price in {days} days",
    altSoldOut: "Sold out here: alternatives with a direct price",
    altCheaper: "Similar and cheaper",
    details: "See details",
    alertTitle: "Not yet? We'll tell you when it drops",
    alertBody: "One email when the price drops. No account: confirm your email once, unsubscribe in one click.",
    tgTeam: "{team} alerts on Telegram",
    tgChannel: "Price-drop channel on Telegram",
    dropsCaptureTitle: "Get the drops delivered",
    dropsCaptureBody: "Today's drops on our Telegram channel, your team's alerts through the bot, or an email when the shirt or boot you want gets cheaper (the “Notify me” button on every product page).",
    tgBot: "Your team's alerts (Telegram bot)",
  },
  pt: {
    dealsEyebrow: "Hoje",
    dealsTitle: "Melhores ofertas de hoje",
    dealsSub: "Quedas de preço verificadas no nosso registo e mínimos de várias semanas, em lojas oficiais. Um toque e está na loja.",
    goWithPrice: "Ver na {store} — {price}",
    goStore: "Ver na {store}",
    totalWithShipping: "Total com envio",
    before: "Antes {price}",
    lowestInDays: "Preço mais baixo em {days} dias",
    altSoldOut: "Esgotada aqui: alternativas com preço direto",
    altCheaper: "Parecidas e mais baratas",
    details: "Ver ficha",
    alertTitle: "Ainda não? Avisamos quando baixar",
    alertBody: "Um e-mail quando o preço baixar. Sem conta: confirma o e-mail uma vez e cancela com um clique.",
    tgTeam: "Avisos do {team} no Telegram",
    tgChannel: "Canal de quedas de preço no Telegram",
    dropsCaptureTitle: "Receba as quedas de preço sem procurar",
    dropsCaptureBody: "As quedas do dia no nosso canal do Telegram, avisos do seu time pelo bot, ou um e-mail quando a camisa ou chuteira que quer ficar mais barata (botão «Avise-me» em cada ficha).",
    tgBot: "Avisos do seu time (bot do Telegram)",
  },
  fr: {
    dealsEyebrow: "Aujourd'hui",
    dealsTitle: "Meilleures offres du jour",
    dealsSub: "Baisses vérifiées dans notre propre historique et prix les plus bas depuis plusieurs semaines, en boutiques officielles. Un clic et vous êtes en boutique.",
    goWithPrice: "Voir chez {store} — {price}",
    goStore: "Voir chez {store}",
    totalWithShipping: "Total livraison incluse",
    before: "Avant {price}",
    lowestInDays: "Prix le plus bas depuis {days} jours",
    altSoldOut: "Épuisé ici : alternatives avec prix direct",
    altCheaper: "Similaires et moins chers",
    details: "Voir la fiche",
    alertTitle: "Pas encore ? On vous prévient si ça baisse",
    alertBody: "Un e-mail quand le prix baisse. Sans compte : vous confirmez l'e-mail une fois, désinscription en un clic.",
    tgTeam: "Alertes {team} sur Telegram",
    tgChannel: "Canal des baisses sur Telegram",
    dropsCaptureTitle: "Recevez les baisses sans chercher",
    dropsCaptureBody: "Les baisses du jour sur notre canal Telegram, les alertes de votre équipe via le bot, ou un e-mail quand le maillot ou la chaussure que vous voulez baisse (bouton « Prévenez-moi » sur chaque fiche).",
    tgBot: "Alertes de votre équipe (bot Telegram)",
  },
  it: {
    dealsEyebrow: "Oggi",
    dealsTitle: "Le migliori offerte di oggi",
    dealsSub: "Ribassi verificati nel nostro storico e minimi di più settimane, in negozi ufficiali. Un tocco e sei nel negozio.",
    goWithPrice: "Vedi su {store} — {price}",
    goStore: "Vedi su {store}",
    totalWithShipping: "Totale con spedizione",
    before: "Prima {price}",
    lowestInDays: "Prezzo più basso in {days} giorni",
    altSoldOut: "Esaurita qui: alternative con prezzo diretto",
    altCheaper: "Simili e più economici",
    details: "Vedi scheda",
    alertTitle: "Non ancora? Ti avvisiamo se scende",
    alertBody: "Un'e-mail quando il prezzo scende. Senza account: confermi l'e-mail una volta e ti cancelli con un clic.",
    tgTeam: "Avvisi {team} su Telegram",
    tgChannel: "Canale dei ribassi su Telegram",
    dropsCaptureTitle: "Ricevi i ribassi senza cercarli",
    dropsCaptureBody: "I ribassi del giorno sul nostro canale Telegram, gli avvisi della tua squadra con il bot, o un'e-mail quando la maglia o lo scarpino che vuoi scende di prezzo (pulsante «Avvisami» in ogni scheda).",
    tgBot: "Avvisi della tua squadra (bot Telegram)",
  },
};
