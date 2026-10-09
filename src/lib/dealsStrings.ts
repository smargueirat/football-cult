import type { HubLocale } from "@/data/teamMeta";
import type { DealSection } from "@/lib/dealsData";
import { shortDate } from "@/lib/newStrings";

// Textos de /bajadas-de-precio, /ofertas-de-la-semana, /minimos-historicos y
// del feed Atom. /es en español de España (tú, talla, equipación).

export interface DealsText {
  section: Record<DealSection, string>;
  col: { product: string; store: string; before: string; now: string; drop: string; since: string; usual: string; below: string; days: string };
  dropsH1: string;
  dropsMeta: string;
  dropsIntro: (n: number, date: string) => string;
  dropsEmpty: string;
  methodH2: string;
  method: string[];
  feedLink: string;
  weekH1: string;
  weekMeta: string;
  weekIntro: (n: number, from: string, to: string) => string;
  weekEmpty: string;
  lowsH1: string;
  lowsMeta: string;
  lowsIntro: (n: number, minDays: number, first: string) => string;
  lowsEmpty: string;
  lowsNote: string;
  related: string;
  topOf: (n: number, total: number) => string;
  feedTitle: string;
  feedSubtitle: string;
  feedEntry: (o: { name: string; before: string; now: string; pct: number; store: string }) => string;
}

export const DEALS: Record<HubLocale, DealsText> = {
  es: {
    section: { camiseta: "Camisetas", botas: "Botas", tickets: "Entradas", ropa: "Ropa", guantes: "Guantes de portero", pelotas: "Balones", entrenamiento: "Entrenamiento" },
    col: { product: "Producto", store: "Tienda", before: "Antes", now: "Hoy", drop: "Bajada", since: "Desde", usual: "Precio habitual", below: "Por debajo", days: "Días de registro" },
    dropsH1: "Bajadas de precio verificadas",
    dropsMeta: "Camisetas, botas, balones y material de fútbol que han bajado de precio de verdad: precio anterior, precio de hoy, tienda y fecha, medido con nuestro propio historial.",
    dropsIntro: (n, date) => `${n} productos tienen hoy una bajada de precio verificada con nuestro propio historial (última revisión: ${date}). Para cada uno, la tienda donde bajó, el precio anterior, el de hoy y desde cuándo rige.`,
    dropsEmpty: "Hoy no hay bajadas verificadas. Los precios se revisan cada noche.",
    methodH2: "Cómo verificamos cada bajada",
    method: [
      "Guardamos cada noche el precio de cada oferta en un archivo propio. No usamos el precio tachado que muestra la tienda.",
      "Solo cuenta como bajada si el precio anterior estuvo vigente al menos 5 días, era el habitual de esa oferta y el de hoy es el más bajo de los últimos 30 días.",
      "Si una parte grande de una tienda cambia de precio el mismo día, lo tratamos como un cambio de catálogo y no como una rebaja. En entradas, además, el precio nuevo tiene que mantenerse al menos 2 días.",
      "Los precios son los de la tienda, en su moneda y sin envío. En la ficha de cada producto ves el precio final con envío a tu país.",
    ],
    feedLink: "Recibe las bajadas en tu lector (feed Atom)",
    weekH1: "Mejores ofertas de la semana",
    weekMeta: "Las mayores bajadas de precio verificadas de los últimos 7 días en camisetas, botas, balones y material de fútbol. Se actualiza sola cada día.",
    weekIntro: (n, from, to) => `${n} bajadas verificadas entre el ${from} y el ${to}: solo del 5 % o más, por debajo de 1.000 € y como mucho 12 por sección. La página se actualiza sola cada día con el control nocturno de precios.`,
    weekEmpty: "Esta semana no hay bajadas verificadas que cumplan los criterios.",
    lowsH1: "Mínimos históricos: el precio más bajo que hemos registrado",
    lowsMeta: "Productos de fútbol que hoy están en el precio más bajo que hemos registrado en esa tienda, con su precio habitual y los días de historial.",
    lowsIntro: (n, minDays, first) => `${n} productos están hoy en el precio más bajo que hemos registrado para esa tienda, con al menos ${minDays} días de historial y un 3 % o más por debajo de su precio habitual (la mediana de los días registrados). Nuestro archivo empieza el ${first}: es el mínimo de nuestro registro, no de toda la vida del producto.`,
    lowsEmpty: "Hoy no hay ningún producto en su mínimo registrado.",
    lowsNote: "Las entradas no aparecen aquí: su precio de reventa cambia cada día y un mínimo no significa nada. Las demás secciones aparecen cuando su historial llega al mínimo de días.",
    related: "Más formas de ahorrar",
    topOf: (n, total) => (n < total ? `Las ${n} mayores de ${total}.` : ""),
    feedTitle: "Football Cult · Bajadas de precio verificadas",
    feedSubtitle: "Bajadas de precio de camisetas, botas y material de fútbol medidas con nuestro propio historial de precios.",
    feedEntry: ({ name, before, now, pct, store }) => `${name}: de ${before} a ${now} (-${pct} %) en ${store}`,
  },
  en: {
    section: { camiseta: "Shirts", botas: "Boots", tickets: "Tickets", ropa: "Apparel", guantes: "Goalkeeper gloves", pelotas: "Balls", entrenamiento: "Training" },
    col: { product: "Product", store: "Store", before: "Before", now: "Today", drop: "Drop", since: "Since", usual: "Usual price", below: "Below usual", days: "Days tracked" },
    dropsH1: "Verified price drops",
    dropsMeta: "Football shirts, boots, balls and gear that really dropped in price: previous price, today's price, store and date, measured with our own price history.",
    dropsIntro: (n, date) => `${n} products have a price drop verified with our own price history today (last check: ${date}). For each one: the store, the previous price, today's price and since when it applies.`,
    dropsEmpty: "No verified price drops today. Prices are checked every night.",
    methodH2: "How we verify each drop",
    method: [
      "Every night we save the price of every offer in our own archive. We never use the store's crossed-out price.",
      "It only counts as a drop if the previous price was in place for at least 5 days, was that offer's usual price, and today's price is the lowest of the last 30 days.",
      "If a large share of a store changes price on the same day, we treat it as a catalogue change, not a sale. For tickets, the new price must also hold for at least 2 days.",
      "Prices are the store's own, in its currency and without shipping. Each product page shows the final price delivered to your country.",
    ],
    feedLink: "Get the drops in your reader (Atom feed)",
    weekH1: "Best football deals of the week",
    weekMeta: "The biggest verified price drops of the last 7 days on football shirts, boots, balls and gear. Updated automatically every day.",
    weekIntro: (n, from, to) => `${n} verified drops between ${from} and ${to}: only 5% or more, under €1,000 and at most 12 per section. The page updates itself every day after the nightly price check.`,
    weekEmpty: "No verified drops meet the criteria this week.",
    lowsH1: "Lowest recorded prices",
    lowsMeta: "Football products that are at the lowest price we have recorded at that store today, with their usual price and days of history.",
    lowsIntro: (n, minDays, first) => `${n} products are at the lowest price we have recorded at that store today, with at least ${minDays} days of history and 3% or more below their usual price (the median over the recorded days). Our archive starts on ${first}: this is the lowest in our records, not over the product's whole life.`,
    lowsEmpty: "No product is at its lowest recorded price today.",
    lowsNote: "Tickets are not listed here: resale prices change daily and a low means nothing. Other sections appear once their history reaches the minimum number of days.",
    related: "More ways to save",
    topOf: (n, total) => (n < total ? `The top ${n} of ${total}.` : ""),
    feedTitle: "Football Cult · Verified price drops",
    feedSubtitle: "Price drops on football shirts, boots and gear, measured with our own price history.",
    feedEntry: ({ name, before, now, pct, store }) => `${name}: ${before} → ${now} (-${pct}%) at ${store}`,
  },
  pt: {
    section: { camiseta: "Camisas", botas: "Chuteiras", tickets: "Ingressos", ropa: "Roupa", guantes: "Luvas de goleiro", pelotas: "Bolas", entrenamiento: "Treino" },
    col: { product: "Produto", store: "Loja", before: "Antes", now: "Hoje", drop: "Baixa", since: "Desde", usual: "Preço habitual", below: "Abaixo", days: "Dias de registro" },
    dropsH1: "Baixas de preço verificadas",
    dropsMeta: "Camisas, chuteiras, bolas e material de futebol que baixaram de preço de verdade: preço anterior, preço de hoje, loja e data, medidos com o nosso próprio histórico.",
    dropsIntro: (n, date) => `${n} produtos têm hoje uma baixa de preço verificada com o nosso próprio histórico (última verificação: ${date}). Para cada um: a loja, o preço anterior, o de hoje e desde quando vale.`,
    dropsEmpty: "Hoje não há baixas verificadas. Os preços são verificados todas as noites.",
    methodH2: "Como verificamos cada baixa",
    method: [
      "Todas as noites guardamos o preço de cada oferta num arquivo próprio. Não usamos o preço riscado da loja.",
      "Só conta como baixa se o preço anterior vigorou pelo menos 5 dias, era o habitual dessa oferta e o de hoje é o mais baixo dos últimos 30 dias.",
      "Se uma grande parte de uma loja muda de preço no mesmo dia, tratamos isso como mudança de catálogo e não como promoção. Nos ingressos, o novo preço também tem de se manter pelo menos 2 dias.",
      "Os preços são os da loja, na sua moeda e sem envio. Na ficha de cada produto vês o preço final com envio para o teu país.",
    ],
    feedLink: "Recebe as baixas no teu leitor (feed Atom)",
    weekH1: "Melhores ofertas da semana",
    weekMeta: "As maiores baixas de preço verificadas dos últimos 7 dias em camisas, chuteiras, bolas e material de futebol. Atualiza-se sozinha todos os dias.",
    weekIntro: (n, from, to) => `${n} baixas verificadas entre ${from} e ${to}: só de 5% ou mais, abaixo de 1.000 € e no máximo 12 por secção. A página atualiza-se sozinha todos os dias após a verificação noturna.`,
    weekEmpty: "Esta semana não há baixas verificadas que cumpram os critérios.",
    lowsH1: "Mínimos históricos: o preço mais baixo que registámos",
    lowsMeta: "Produtos de futebol que hoje estão no preço mais baixo que registámos nessa loja, com o preço habitual e os dias de histórico.",
    lowsIntro: (n, minDays, first) => `${n} produtos estão hoje no preço mais baixo que registámos nessa loja, com pelo menos ${minDays} dias de histórico e 3% ou mais abaixo do preço habitual (a mediana dos dias registados). O nosso arquivo começa a ${first}: é o mínimo do nosso registo, não de toda a vida do produto.`,
    lowsEmpty: "Hoje nenhum produto está no seu mínimo registado.",
    lowsNote: "Os ingressos não aparecem aqui: o preço de revenda muda todos os dias e um mínimo não significa nada. As outras secções aparecem quando o histórico atinge o mínimo de dias.",
    related: "Mais formas de poupar",
    topOf: (n, total) => (n < total ? `As ${n} maiores de ${total}.` : ""),
    feedTitle: "Football Cult · Baixas de preço verificadas",
    feedSubtitle: "Baixas de preço de camisas, chuteiras e material de futebol medidas com o nosso próprio histórico.",
    feedEntry: ({ name, before, now, pct, store }) => `${name}: de ${before} para ${now} (-${pct}%) na ${store}`,
  },
  fr: {
    section: { camiseta: "Maillots", botas: "Chaussures", tickets: "Billets", ropa: "Vêtements", guantes: "Gants de gardien", pelotas: "Ballons", entrenamiento: "Entraînement" },
    col: { product: "Produit", store: "Boutique", before: "Avant", now: "Aujourd'hui", drop: "Baisse", since: "Depuis", usual: "Prix habituel", below: "En dessous", days: "Jours suivis" },
    dropsH1: "Baisses de prix vérifiées",
    dropsMeta: "Maillots, chaussures, ballons et matériel de foot dont le prix a vraiment baissé : prix précédent, prix du jour, boutique et date, mesurés avec notre propre historique.",
    dropsIntro: (n, date) => `${n} produits ont aujourd'hui une baisse de prix vérifiée avec notre propre historique (dernier contrôle : ${date}). Pour chacun : la boutique, le prix précédent, celui du jour et depuis quand il s'applique.`,
    dropsEmpty: "Aucune baisse vérifiée aujourd'hui. Les prix sont contrôlés chaque nuit.",
    methodH2: "Comment nous vérifions chaque baisse",
    method: [
      "Chaque nuit, nous enregistrons le prix de chaque offre dans notre propre archive. Nous n'utilisons jamais le prix barré de la boutique.",
      "Une baisse ne compte que si le prix précédent est resté en place au moins 5 jours, était le prix habituel de l'offre, et si le prix du jour est le plus bas des 30 derniers jours.",
      "Si une grande partie d'une boutique change de prix le même jour, nous le traitons comme un changement de catalogue, pas comme une promotion. Pour les billets, le nouveau prix doit aussi tenir au moins 2 jours.",
      "Les prix sont ceux de la boutique, dans sa devise et hors livraison. La fiche de chaque produit affiche le prix final livré dans votre pays.",
    ],
    feedLink: "Recevez les baisses dans votre lecteur (flux Atom)",
    weekH1: "Les meilleurs bons plans foot de la semaine",
    weekMeta: "Les plus fortes baisses de prix vérifiées des 7 derniers jours sur les maillots, chaussures, ballons et matériel de foot. Mise à jour automatique chaque jour.",
    weekIntro: (n, from, to) => `${n} baisses vérifiées entre le ${from} et le ${to} : uniquement de 5 % ou plus, sous 1 000 € et au maximum 12 par rubrique. La page se met à jour seule chaque jour après le contrôle nocturne des prix.`,
    weekEmpty: "Aucune baisse vérifiée ne remplit les critères cette semaine.",
    lowsH1: "Prix les plus bas relevés",
    lowsMeta: "Produits de foot qui sont aujourd'hui au prix le plus bas que nous avons relevé dans cette boutique, avec leur prix habituel et les jours d'historique.",
    lowsIntro: (n, minDays, first) => `${n} produits sont aujourd'hui au prix le plus bas que nous avons relevé dans cette boutique, avec au moins ${minDays} jours d'historique et 3 % ou plus sous leur prix habituel (la médiane des jours relevés). Notre archive commence le ${first} : c'est le plus bas de nos relevés, pas de toute la vie du produit.`,
    lowsEmpty: "Aucun produit n'est aujourd'hui à son prix le plus bas relevé.",
    lowsNote: "Les billets n'apparaissent pas ici : le prix de revente change tous les jours et un minimum ne veut rien dire. Les autres rubriques apparaissent dès que leur historique atteint le nombre de jours minimum.",
    related: "D'autres façons d'économiser",
    topOf: (n, total) => (n < total ? `Les ${n} plus fortes sur ${total}.` : ""),
    feedTitle: "Football Cult · Baisses de prix vérifiées",
    feedSubtitle: "Baisses de prix des maillots, chaussures et matériel de foot, mesurées avec notre propre historique de prix.",
    feedEntry: ({ name, before, now, pct, store }) => `${name} : de ${before} à ${now} (-${pct} %) chez ${store}`,
  },
  it: {
    section: { camiseta: "Maglie", botas: "Scarpe", tickets: "Biglietti", ropa: "Abbigliamento", guantes: "Guanti da portiere", pelotas: "Palloni", entrenamiento: "Allenamento" },
    col: { product: "Prodotto", store: "Negozio", before: "Prima", now: "Oggi", drop: "Ribasso", since: "Dal", usual: "Prezzo abituale", below: "Sotto", days: "Giorni registrati" },
    dropsH1: "Ribassi di prezzo verificati",
    dropsMeta: "Maglie, scarpe, palloni e materiale da calcio scesi di prezzo davvero: prezzo precedente, prezzo di oggi, negozio e data, misurati con il nostro storico.",
    dropsIntro: (n, date) => `${n} prodotti hanno oggi un ribasso verificato con il nostro storico dei prezzi (ultimo controllo: ${date}). Per ognuno: il negozio, il prezzo precedente, quello di oggi e da quando vale.`,
    dropsEmpty: "Oggi nessun ribasso verificato. I prezzi si controllano ogni notte.",
    methodH2: "Come verifichiamo ogni ribasso",
    method: [
      "Ogni notte salviamo il prezzo di ogni offerta in un archivio nostro. Non usiamo mai il prezzo barrato del negozio.",
      "Conta come ribasso solo se il prezzo precedente è rimasto in vigore almeno 5 giorni, era quello abituale dell'offerta e quello di oggi è il più basso degli ultimi 30 giorni.",
      "Se una parte grande di un negozio cambia prezzo lo stesso giorno, lo trattiamo come un cambio di catalogo e non come uno sconto. Per i biglietti il nuovo prezzo deve anche durare almeno 2 giorni.",
      "I prezzi sono quelli del negozio, nella sua valuta e senza spedizione. Nella scheda di ogni prodotto vedi il prezzo finale con spedizione nel tuo paese.",
    ],
    feedLink: "Ricevi i ribassi nel tuo lettore (feed Atom)",
    weekH1: "Le migliori offerte calcio della settimana",
    weekMeta: "I maggiori ribassi di prezzo verificati degli ultimi 7 giorni su maglie, scarpe, palloni e materiale da calcio. Si aggiorna da sola ogni giorno.",
    weekIntro: (n, from, to) => `${n} ribassi verificati tra il ${from} e il ${to}: solo del 5% o più, sotto i 1.000 € e al massimo 12 per sezione. La pagina si aggiorna da sola ogni giorno dopo il controllo notturno dei prezzi.`,
    weekEmpty: "Questa settimana nessun ribasso verificato rispetta i criteri.",
    lowsH1: "Minimi storici: il prezzo più basso che abbiamo registrato",
    lowsMeta: "Prodotti da calcio che oggi sono al prezzo più basso che abbiamo registrato in quel negozio, con il prezzo abituale e i giorni di storico.",
    lowsIntro: (n, minDays, first) => `${n} prodotti sono oggi al prezzo più basso che abbiamo registrato in quel negozio, con almeno ${minDays} giorni di storico e il 3% o più sotto il prezzo abituale (la mediana dei giorni registrati). Il nostro archivio parte dal ${first}: è il minimo del nostro registro, non di tutta la vita del prodotto.`,
    lowsEmpty: "Oggi nessun prodotto è al suo minimo registrato.",
    lowsNote: "I biglietti non compaiono qui: il prezzo di rivendita cambia ogni giorno e un minimo non vuol dire nulla. Le altre sezioni compaiono quando il loro storico raggiunge il minimo di giorni.",
    related: "Altri modi per risparmiare",
    topOf: (n, total) => (n < total ? `I ${n} maggiori su ${total}.` : ""),
    feedTitle: "Football Cult · Ribassi di prezzo verificati",
    feedSubtitle: "Ribassi di prezzo di maglie, scarpe e materiale da calcio misurati con il nostro storico dei prezzi.",
    feedEntry: ({ name, before, now, pct, store }) => `${name}: da ${before} a ${now} (-${pct}%) da ${store}`,
  },
};

/** "9 oct 2026" con los meses a mano (ver newStrings.ts). */
export const longDate = (iso: string, locale: HubLocale) => (iso ? `${shortDate(iso, locale)} ${iso.slice(0, 4)}` : "");
