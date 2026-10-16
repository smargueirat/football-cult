import type { HubLocale } from "@/data/teamMeta";
import type { BfGroup, GiftType } from "@/lib/seasonalData";
import type { GiftBand } from "@/lib/giftPicks";

// Textos de /black-friday y /regalos-futbol. /es en español de España (tú,
// talla, equipación). Ninguna cifra va escrita aquí: todas llegan como
// argumento desde los datos del día.

type Band = GiftBand["key"];

export interface SeasonalText {
  bf: {
    title: string;
    meta: string;
    intro: (o: { year: number; bf: string; cm: string; during: boolean; drops: number; lows: number; last: string }) => string;
    group: Record<BfGroup, string>;
    refH2: string;
    refIntro: string;
    refCol: { product: string; store: string; today: string; min: string; minDate: string; days: string; diff: string };
    atMin: string;
    dropsH2: string;
    dropsEmpty: string;
    lowsH2: string;
    lowsEmpty: string;
    bandsH2: string;
    bandsNote: string;
    methodH2: string;
    method: string[];
  };
  gifts: {
    title: string;
    meta: string;
    intro: (o: { xmas: string; kings: string; n: number }) => string;
    empty: string;
    budgetH2: string;
    typeH2: string;
    type: Record<GiftType, string>;
    note: string;
    ticketsNote: string;
  };
  bands: Record<Band, string>;
}

const BANDS_EUR = {
  es: { upTo30: "Menos de 30 €", upTo60: "De 30 a 60 €", upTo100: "De 60 a 100 €", over100: "Más de 100 €" },
  en: { upTo30: "Under €30", upTo60: "€30 to €60", upTo100: "€60 to €100", over100: "Over €100" },
  pt: { upTo30: "Menos de 30 €", upTo60: "De 30 a 60 €", upTo100: "De 60 a 100 €", over100: "Mais de 100 €" },
  fr: { upTo30: "Moins de 30 €", upTo60: "De 30 à 60 €", upTo100: "De 60 à 100 €", over100: "Plus de 100 €" },
  it: { upTo30: "Meno di 30 €", upTo60: "Da 30 a 60 €", upTo100: "Da 60 a 100 €", over100: "Più di 100 €" },
} satisfies Record<HubLocale, Record<Band, string>>;

export const SEASONAL: Record<HubLocale, SeasonalText> = {
  es: {
    bf: {
      title: "Black Friday camisetas de fútbol y botas: ofertas reales verificadas",
      meta: "Black Friday de camisetas de fútbol, botas y equipamiento: solo bajadas de precio comprobadas con nuestro propio historial, mínimos registrados y el precio de hoy frente al mínimo. Sin descuentos inventados.",
      intro: ({ year, bf, cm, during, drops, lows, last }) =>
        `${during ? `Estamos en el Black Friday ${year} (del ${bf} al Cyber Monday, ${cm}).` : `El Black Friday ${year} es el ${bf} y el Cyber Monday, el ${cm}.`} Aquí no hay descuentos inventados: hoy hay ${drops} bajadas verificadas y ${lows} productos en el precio más bajo que hemos registrado, en tiendas que envían a España (última revisión: ${last}). Antes de comprar, mira el mínimo de cada producto para saber si una oferta lo es de verdad.`,
      group: { botas: "Botas", camiseta: "Camisetas", equipamiento: "Equipamiento (ropa, balones, guantes y entrenamiento)" },
      refH2: "Precio de hoy frente al mínimo registrado",
      refIntro: "Las botas y camisetas que más tiendas comparan, con el precio más barato de hoy y el más bajo que hemos visto en esa misma oferta. Si el Black Friday no lo deja por debajo de ese mínimo, no es una rebaja excepcional.",
      refCol: { product: "Producto", store: "Tienda", today: "Hoy", min: "Mínimo registrado", minDate: "Fecha del mínimo", days: "Días de registro", diff: "Diferencia" },
      atMin: "En su mínimo",
      dropsH2: "Bajadas verificadas ahora",
      dropsEmpty: "Hoy no hay bajadas verificadas en esta sección.",
      lowsH2: "En su mínimo registrado",
      lowsEmpty: "Hoy ningún producto de esta sección está en su mínimo registrado.",
      bandsH2: "Mejores bajadas por precio",
      bandsNote: "Tramo según el precio con envío a España, en euros. En la tarjeta, el precio de la tienda sin envío y la bajada verificada.",
      methodH2: "Qué cuenta aquí como oferta",
      method: [
        "Solo bajadas medidas por nosotros: el precio anterior estuvo vigente al menos 5 días en nuestro archivo y el de hoy es el más bajo de los últimos 30. Nunca usamos el precio tachado de la tienda.",
        "Si media tienda cambia de precio el mismo día, lo tratamos como un cambio de catálogo y no como una rebaja.",
        "Solo productos en stock y tiendas que envían a España. Los precios de las tablas son los de la tienda, en su moneda y sin envío; en cada ficha ves el total con envío.",
        "La página se actualiza sola cada noche con el control de precios, también durante el Black Friday y el Cyber Monday.",
      ],
    },
    gifts: {
      title: "Regalos de fútbol para Navidad y Reyes por presupuesto",
      meta: "Ideas de regalo de fútbol por presupuesto (menos de 30 €, 30-60, 60-100 y más de 100 €) y por tipo: camisetas de club, del Mundial 2026, retro, botas, balones, guantes y entradas, con precios reales en stock.",
      intro: ({ xmas, kings, n }) =>
        `${n} ideas de regalo para Navidad (${xmas}) y Reyes (${kings}), todas en stock hoy y en tiendas que envían a España. El precio es el total con envío, en la moneda de la tienda (los tramos se calculan en euros), y lo revisamos cada noche.`,
      empty: "Ahora mismo no hay regalos disponibles.",
      budgetH2: "Por presupuesto",
      typeH2: "Por tipo de regalo",
      type: { club: "Camiseta de club", seleccion: "Camiseta de selección del Mundial 2026", retro: "Camiseta retro (hasta 2006)", botas: "Botas de fútbol", pelotas: "Balones", guantes: "Guantes de portero", tickets: "Entradas para un partido" },
      note: "Precio con envío a España incluido. No tenemos medido el plazo de entrega de cada tienda: si es para Navidad o Reyes, compruébalo en la tienda antes de pagar.",
      ticketsNote: "Solo partidos después de Navidad. Entradas de reventa: el precio lo pone el vendedor y puede superar el oficial. Son electrónicas o las envía el vendedor.",
    },
    bands: BANDS_EUR.es,
  },
  en: {
    bf: {
      title: "Black Friday football shirts & boots: verified real deals",
      meta: "Black Friday on football shirts, boots and gear: only price drops checked against our own price history, lowest recorded prices and today's price against the low. No made-up discounts.",
      intro: ({ year, bf, cm, during, drops, lows, last }) =>
        `${during ? `It is Black Friday ${year} (from ${bf} to Cyber Monday, ${cm}).` : `Black Friday ${year} is on ${bf} and Cyber Monday on ${cm}.`} No made-up discounts here: today there are ${drops} verified price drops and ${lows} products at the lowest price we have recorded, at stores that deliver to Ireland (last check: ${last}). Before you buy, check each product's low to see whether a deal is real.`,
      group: { botas: "Boots", camiseta: "Shirts", equipamiento: "Gear (apparel, balls, gloves and training)" },
      refH2: "Today's price against the lowest recorded",
      refIntro: "The boots and shirts compared across the most stores, with today's cheapest price and the lowest we have seen for that same offer. If Black Friday does not take it below that low, it is not an exceptional sale.",
      refCol: { product: "Product", store: "Store", today: "Today", min: "Lowest recorded", minDate: "Date of low", days: "Days tracked", diff: "Difference" },
      atMin: "At its low",
      dropsH2: "Verified price drops right now",
      dropsEmpty: "No verified price drops in this section today.",
      lowsH2: "At their lowest recorded price",
      lowsEmpty: "No product in this section is at its lowest recorded price today.",
      bandsH2: "Best drops by price",
      bandsNote: "Band based on the price delivered to Ireland, in euros. The card shows the store price without shipping and the verified drop.",
      methodH2: "What counts as a deal here",
      method: [
        "Only drops we measured: the previous price was in place for at least 5 days in our archive and today's is the lowest of the last 30. We never use the store's crossed-out price.",
        "If half a store changes price on the same day, we treat it as a catalogue change, not a sale.",
        "Only products in stock at stores that deliver to Ireland. Table prices are the store's own, in its currency and without shipping; each product page shows the total delivered.",
        "The page updates itself every night after the price check, including over Black Friday and Cyber Monday.",
      ],
    },
    gifts: {
      title: "Football gifts for Christmas by budget",
      meta: "Football gift ideas by budget (under €30, €30-60, €60-100 and over €100) and by type: club shirts, World Cup 2026 shirts, retro, boots, balls, goalkeeper gloves and match tickets, with real in-stock prices.",
      intro: ({ xmas, n }) =>
        `${n} gift ideas for Christmas (${xmas}), all in stock today at stores that deliver to Ireland. The price is the total with delivery, in the store's currency (budget bands are worked out in euros), and we check it every night.`,
      empty: "No gifts available right now.",
      budgetH2: "By budget",
      typeH2: "By type of gift",
      type: { club: "Club shirt", seleccion: "World Cup 2026 national team shirt", retro: "Retro shirt (up to 2006)", botas: "Football boots", pelotas: "Balls", guantes: "Goalkeeper gloves", tickets: "Match tickets" },
      note: "Price includes delivery to Ireland. We have not measured each store's delivery time: if it is for Christmas, check it with the store before paying.",
      ticketsNote: "Only matches after Christmas. Resale tickets: the seller sets the price, which can be above face value. They are electronic or sent by the seller.",
    },
    bands: BANDS_EUR.en,
  },
  pt: {
    bf: {
      title: "Black Friday camisas de futebol e chuteiras: ofertas reais verificadas",
      meta: "Black Friday de camisas de futebol, chuteiras e equipamento: só baixas de preço confirmadas com o nosso próprio histórico, mínimos registados e o preço de hoje frente ao mínimo. Sem descontos inventados.",
      intro: ({ year, bf, cm, during, drops, lows, last }) =>
        `${during ? `Estamos na Black Friday ${year} (de ${bf} à Cyber Monday, ${cm}).` : `A Black Friday ${year} é a ${bf} e a Cyber Monday a ${cm}.`} Aqui não há descontos inventados: hoje há ${drops} baixas verificadas e ${lows} produtos no preço mais baixo que registámos, em lojas que enviam para Portugal (última verificação: ${last}). Antes de comprar, vê o mínimo de cada produto para saber se uma oferta o é de verdade.`,
      group: { botas: "Chuteiras", camiseta: "Camisas", equipamiento: "Equipamento (roupa, bolas, luvas e treino)" },
      refH2: "Preço de hoje frente ao mínimo registado",
      refIntro: "As chuteiras e camisas comparadas em mais lojas, com o preço mais barato de hoje e o mais baixo que vimos nessa mesma oferta. Se a Black Friday não o deixar abaixo desse mínimo, não é uma promoção excecional.",
      refCol: { product: "Produto", store: "Loja", today: "Hoje", min: "Mínimo registado", minDate: "Data do mínimo", days: "Dias de registo", diff: "Diferença" },
      atMin: "No mínimo",
      dropsH2: "Baixas verificadas agora",
      dropsEmpty: "Hoje não há baixas verificadas nesta secção.",
      lowsH2: "No mínimo registado",
      lowsEmpty: "Hoje nenhum produto desta secção está no mínimo registado.",
      bandsH2: "Melhores baixas por preço",
      bandsNote: "Escalão segundo o preço com envio para Portugal, em euros. No cartão, o preço da loja sem envio e a baixa verificada.",
      methodH2: "O que conta aqui como oferta",
      method: [
        "Só baixas medidas por nós: o preço anterior vigorou pelo menos 5 dias no nosso arquivo e o de hoje é o mais baixo dos últimos 30. Nunca usamos o preço riscado da loja.",
        "Se meia loja muda de preço no mesmo dia, tratamos isso como mudança de catálogo e não como promoção.",
        "Só produtos em stock e lojas que enviam para Portugal. Os preços das tabelas são os da loja, na sua moeda e sem envio; em cada ficha vês o total com envio.",
        "A página atualiza-se sozinha todas as noites, também durante a Black Friday e a Cyber Monday.",
      ],
    },
    gifts: {
      title: "Presentes de futebol para o Natal por orçamento",
      meta: "Ideias de presente de futebol por orçamento (menos de 30 €, 30-60, 60-100 e mais de 100 €) e por tipo: camisas de clube, do Mundial 2026, retrô, chuteiras, bolas, luvas e ingressos, com preços reais em stock.",
      intro: ({ xmas, kings, n }) =>
        `${n} ideias de presente para o Natal (${xmas}) e o Dia de Reis (${kings}), todas em stock hoje e em lojas que enviam para Portugal. O preço é o total com envio, na moeda da loja (os escalões são calculados em euros), e verificamo-lo todas as noites.`,
      empty: "Nenhum presente disponível de momento.",
      budgetH2: "Por orçamento",
      typeH2: "Por tipo de presente",
      type: { club: "Camisa de clube", seleccion: "Camisa de seleção do Mundial 2026", retro: "Camisa retrô (até 2006)", botas: "Chuteiras", pelotas: "Bolas", guantes: "Luvas de guarda-redes", tickets: "Ingressos para um jogo" },
      note: "Preço com envio para Portugal incluído. Não temos medido o prazo de entrega de cada loja: se for para o Natal, confirma-o na loja antes de pagar.",
      ticketsNote: "Só jogos depois do Natal. Ingressos de revenda: o preço é definido pelo vendedor e pode ser superior ao oficial. São eletrónicos ou enviados pelo vendedor.",
    },
    bands: BANDS_EUR.pt,
  },
  fr: {
    bf: {
      title: "Black Friday maillots de foot et chaussures : vraies promos vérifiées",
      meta: "Black Friday sur les maillots de foot, chaussures et équipement : uniquement des baisses vérifiées avec notre propre historique, les prix les plus bas relevés et le prix du jour face au plus bas. Aucune remise inventée.",
      intro: ({ year, bf, cm, during, drops, lows, last }) =>
        `${during ? `C'est le Black Friday ${year} (du ${bf} au Cyber Monday, ${cm}).` : `Le Black Friday ${year} tombe le ${bf} et le Cyber Monday le ${cm}.`} Aucune remise inventée ici : aujourd'hui, ${drops} baisses vérifiées et ${lows} produits au prix le plus bas que nous avons relevé, dans des boutiques qui livrent en France (dernier contrôle : ${last}). Avant d'acheter, regardez le plus bas de chaque produit pour savoir si une promo en est vraiment une.`,
      group: { botas: "Chaussures", camiseta: "Maillots", equipamiento: "Équipement (vêtements, ballons, gants et entraînement)" },
      refH2: "Prix du jour face au plus bas relevé",
      refIntro: "Les chaussures et maillots comparés dans le plus de boutiques, avec le prix le moins cher du jour et le plus bas que nous avons vu pour cette même offre. Si le Black Friday ne le fait pas passer sous ce plus bas, ce n'est pas une promo exceptionnelle.",
      refCol: { product: "Produit", store: "Boutique", today: "Aujourd'hui", min: "Plus bas relevé", minDate: "Date du plus bas", days: "Jours suivis", diff: "Écart" },
      atMin: "À son plus bas",
      dropsH2: "Baisses vérifiées en ce moment",
      dropsEmpty: "Aucune baisse vérifiée dans cette rubrique aujourd'hui.",
      lowsH2: "À leur prix le plus bas relevé",
      lowsEmpty: "Aucun produit de cette rubrique n'est à son plus bas relevé aujourd'hui.",
      bandsH2: "Meilleures baisses par prix",
      bandsNote: "Tranche selon le prix livré en France, en euros. Sur la carte, le prix de la boutique hors livraison et la baisse vérifiée.",
      methodH2: "Ce qui compte ici comme une promo",
      method: [
        "Uniquement des baisses mesurées par nous : le prix précédent est resté en place au moins 5 jours dans notre archive et celui du jour est le plus bas des 30 derniers. Nous n'utilisons jamais le prix barré de la boutique.",
        "Si la moitié d'une boutique change de prix le même jour, nous le traitons comme un changement de catalogue, pas comme une promo.",
        "Uniquement des produits en stock et des boutiques qui livrent en France. Les prix des tableaux sont ceux de la boutique, dans sa devise et hors livraison ; chaque fiche affiche le total livré.",
        "La page se met à jour seule chaque nuit, y compris pendant le Black Friday et le Cyber Monday.",
      ],
    },
    gifts: {
      title: "Cadeaux foot pour Noël par budget",
      meta: "Idées de cadeau foot par budget (moins de 30 €, 30-60, 60-100 et plus de 100 €) et par type : maillots de club, de la Coupe du monde 2026, rétro, chaussures, ballons, gants et billets, avec de vrais prix en stock.",
      intro: ({ xmas, n }) =>
        `${n} idées de cadeau pour Noël (${xmas}), toutes en stock aujourd'hui dans des boutiques qui livrent en France. Le prix est le total livré, dans la devise de la boutique (les tranches sont calculées en euros), et nous le vérifions chaque nuit.`,
      empty: "Aucun cadeau disponible pour le moment.",
      budgetH2: "Par budget",
      typeH2: "Par type de cadeau",
      type: { club: "Maillot de club", seleccion: "Maillot de sélection Coupe du monde 2026", retro: "Maillot rétro (jusqu'à 2006)", botas: "Chaussures de foot", pelotas: "Ballons", guantes: "Gants de gardien", tickets: "Billets pour un match" },
      note: "Prix livraison en France comprise. Nous n'avons pas mesuré le délai de livraison de chaque boutique : si c'est pour Noël, vérifiez-le auprès de la boutique avant de payer.",
      ticketsNote: "Uniquement des matchs après Noël. Billets de revente : le prix est fixé par le vendeur et peut dépasser le prix officiel. Ils sont électroniques ou envoyés par le vendeur.",
    },
    bands: BANDS_EUR.fr,
  },
  it: {
    bf: {
      title: "Black Friday maglie da calcio e scarpe: offerte reali verificate",
      meta: "Black Friday su maglie da calcio, scarpe e attrezzatura: solo ribassi verificati con il nostro storico, minimi registrati e il prezzo di oggi rispetto al minimo. Nessuno sconto inventato.",
      intro: ({ year, bf, cm, during, drops, lows, last }) =>
        `${during ? `È il Black Friday ${year} (dal ${bf} al Cyber Monday, ${cm}).` : `Il Black Friday ${year} è il ${bf} e il Cyber Monday il ${cm}.`} Qui nessuno sconto inventato: oggi ci sono ${drops} ribassi verificati e ${lows} prodotti al prezzo più basso che abbiamo registrato, in negozi che spediscono in Italia (ultimo controllo: ${last}). Prima di comprare, guarda il minimo di ogni prodotto per capire se un'offerta lo è davvero.`,
      group: { botas: "Scarpe", camiseta: "Maglie", equipamiento: "Attrezzatura (abbigliamento, palloni, guanti e allenamento)" },
      refH2: "Prezzo di oggi rispetto al minimo registrato",
      refIntro: "Le scarpe e le maglie confrontate nel maggior numero di negozi, con il prezzo più basso di oggi e il più basso che abbiamo visto per quella stessa offerta. Se il Black Friday non lo porta sotto quel minimo, non è uno sconto eccezionale.",
      refCol: { product: "Prodotto", store: "Negozio", today: "Oggi", min: "Minimo registrato", minDate: "Data del minimo", days: "Giorni registrati", diff: "Differenza" },
      atMin: "Al minimo",
      dropsH2: "Ribassi verificati adesso",
      dropsEmpty: "Oggi nessun ribasso verificato in questa sezione.",
      lowsH2: "Al minimo registrato",
      lowsEmpty: "Oggi nessun prodotto di questa sezione è al suo minimo registrato.",
      bandsH2: "Migliori ribassi per prezzo",
      bandsNote: "Fascia secondo il prezzo con spedizione in Italia, in euro. Sulla scheda, il prezzo del negozio senza spedizione e il ribasso verificato.",
      methodH2: "Cosa conta qui come offerta",
      method: [
        "Solo ribassi misurati da noi: il prezzo precedente è rimasto in vigore almeno 5 giorni nel nostro archivio e quello di oggi è il più basso degli ultimi 30. Non usiamo mai il prezzo barrato del negozio.",
        "Se metà di un negozio cambia prezzo lo stesso giorno, lo trattiamo come un cambio di catalogo e non come uno sconto.",
        "Solo prodotti disponibili e negozi che spediscono in Italia. I prezzi delle tabelle sono quelli del negozio, nella sua valuta e senza spedizione; in ogni scheda vedi il totale con spedizione.",
        "La pagina si aggiorna da sola ogni notte, anche durante il Black Friday e il Cyber Monday.",
      ],
    },
    gifts: {
      title: "Regali di calcio per Natale e la Befana per budget",
      meta: "Idee regalo di calcio per budget (meno di 30 €, 30-60, 60-100 e più di 100 €) e per tipo: maglie di club, dei Mondiali 2026, retrò, scarpe, palloni, guanti e biglietti, con prezzi reali disponibili.",
      intro: ({ xmas, kings, n }) =>
        `${n} idee regalo per Natale (${xmas}) e la Befana (${kings}), tutte disponibili oggi in negozi che spediscono in Italia. Il prezzo è il totale con spedizione, nella valuta del negozio (le fasce sono calcolate in euro), e lo controlliamo ogni notte.`,
      empty: "Nessun regalo disponibile al momento.",
      budgetH2: "Per budget",
      typeH2: "Per tipo di regalo",
      type: { club: "Maglia di club", seleccion: "Maglia di nazionale dei Mondiali 2026", retro: "Maglia retrò (fino al 2006)", botas: "Scarpe da calcio", pelotas: "Palloni", guantes: "Guanti da portiere", tickets: "Biglietti per una partita" },
      note: "Prezzo con spedizione in Italia inclusa. Non abbiamo misurato i tempi di consegna di ogni negozio: se è per Natale o la Befana, verificali con il negozio prima di pagare.",
      ticketsNote: "Solo partite dopo Natale. Biglietti di rivendita: il prezzo lo decide il venditore e può superare quello ufficiale. Sono elettronici o spediti dal venditore.",
    },
    bands: BANDS_EUR.it,
  },
};
