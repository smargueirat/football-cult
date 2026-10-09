import type { HubLocale } from "@/data/teamMeta";
import type { QA } from "@/lib/siteFacts";

// Textos de los bloques de datos de las guías (ver guideData.ts y
// components/GuideData.tsx). Las cifras llegan ya formateadas.

type Kit = "home" | "away" | "third";

export interface GuideDataText {
  asOf: (date: string) => string;
  kit: Record<Kit, string>;
  ground: Record<string, string>;
  wc: {
    h2: string;
    note: (country: string) => string;
    cols: [string, string, string, string, string, string, string];
    qa: (f: { min: string; team: string; kit: string; store: string; median: string; n: number; teams: number; country: string; k: number; diff: string }) => QA[];
  };
  fp: {
    h2: string;
    note: string;
    cols: [string, string, string, string];
    qa: (f: { pct: number; diff: string; n: number }) => QA[];
    examples: string;
    ex: (name: string, fan: string, player: string) => string;
  };
  gr: {
    h2: string;
    note: (country: string) => string;
    cols: [string, string, string, string, string];
    qa: (f: { most: string; mostN: string; mostFrom: string; cheap: string; cheapMedian: string }) => QA[];
    kids: string;
    futsal: string;
  };
  dt: {
    h2: string;
    qa: (f: { first: string; offers: string; withDrop: string; pct: number; med: number; p75: number; n: number; lo: number; hi: number; mid: number }) => QA[];
    storesH: string;
    storeCols: [string, string, string];
    seasonH: string;
    seasonNote: string;
    seasonCols: [string, string, string, string, string];
  };
}

export const GUIDE_DATA: Record<HubLocale, GuideDataText> = {
  es: {
    asOf: (d) => `Datos del catálogo a ${d}. Se actualizan cada día.`,
    kit: { home: "Primera", away: "Segunda", third: "Tercera" },
    ground: { FG: "Césped natural firme", AG: "Césped artificial", SG: "Terreno blando", MG: "Multisuperficie", TF: "Moqueta (turf)", "FG/AG": "Natural y artificial" },
    wc: {
      h2: "Precio más bajo hoy de cada camiseta de selección",
      note: (c) => `Versión aficionado, adulto, con envío a ${c} incluido. Tiendas oficiales y minoristas de deporte; sin eBay, Amazon ni réplicas.`,
      cols: ["Selección", "Equipación", "Desde", "Tienda", "Tiendas", "Tallas en la más barata", "Versión jugador desde"],
      qa: (f) => [
        { q: "¿Cuánto cuesta una camiseta del Mundial 2026?", a: `La más barata hoy cuesta ${f.min} (${f.team}, ${f.kit.toLowerCase()} equipación, en ${f.store}). El precio mediano de las ${f.n} camisetas comparadas es ${f.median}, con envío a ${f.country}.` },
        { q: "¿De cuántas selecciones hay camiseta de 2026?", a: `De ${f.teams} selecciones, con ${f.n} camisetas entre primera, segunda y tercera equipación en tiendas que envían a ${f.country}.` },
        ...(f.k ? [{ q: "¿Cuánto más cuesta la versión jugador?", a: `En las ${f.k} camisetas que también tienen versión jugador, esta cuesta de mediana ${f.diff} más que la de aficionado.` }] : []),
      ],
    },
    fp: {
      h2: "Cuánto más cuesta la versión jugador (datos de hoy)",
      note: "Camisetas de la temporada 2025/26 en adelante que se venden a la vez en las dos versiones en tiendas oficiales o minoristas, en euros y sin envío.",
      cols: ["Marca", "Camisetas", "Jugador / aficionado", "Diferencia mediana"],
      qa: (f) => [{ q: "¿Cuánto más cara es la versión jugador?", a: `De mediana un ${f.pct} % más (${f.diff}), medido en ${f.n} camisetas que se venden en las dos versiones a la vez.` }],
      examples: "Ejemplos del catálogo",
      ex: (n, a, b) => `${n}: aficionado desde ${a}, jugador desde ${b}`,
    },
    gr: {
      h2: "Botas por terreno: modelos y precios de hoy",
      note: (c) => `Botas de adulto del catálogo. «Desde» es el precio más bajo con envío a ${c}; el precio mediano se calcula con la oferta más barata de cada modelo en euros.`,
      cols: ["Terreno", "Modelos", "Desde", "Precio mediano", "Líneas con más modelos"],
      qa: (f) => [
        { q: "¿Para qué terreno hay más botas?", a: `Para ${f.most}: ${f.mostN} modelos, desde ${f.mostFrom}.` },
        { q: "¿Qué tipo de suela sale más barata?", a: `${f.cheap}, con un precio mediano de ${f.cheapMedian}.` },
      ],
      kids: "Botas de niño",
      futsal: "Zapatillas de fútbol sala",
    },
    dt: {
      h2: "Lo que dice nuestro historial de precios",
      qa: (f) => [
        { q: "¿Cuántas camisetas bajan de precio?", a: `Desde el ${f.first} seguimos ${f.offers} ofertas de camisetas en tiendas oficiales y minoristas: ${f.withDrop} (el ${f.pct} %) han bajado de precio al menos una vez.` },
        { q: "¿Cuánto suele bajar una camiseta?", a: `La bajada mediana es del ${f.med} %, y una de cada cuatro baja un ${f.p75} % o más.` },
        { q: "¿Es más barata la camiseta de la temporada anterior?", a: `Sí, en la mayoría de los casos: en ${f.n} camisetas de un mismo equipo y equipación que se venden a la vez en dos temporadas, la anterior cuesta hoy de mediana un ${f.mid} % menos que la nueva (la mitad central de los casos, entre un ${f.lo} % y un ${f.hi} % menos).` },
      ],
      storesH: "Qué tiendas bajan precios más a menudo",
      storeCols: ["Tienda", "Ofertas seguidas", "Han bajado al menos una vez"],
      seasonH: "Temporada anterior frente a temporada nueva",
      seasonNote: "Precio más bajo de hoy de cada una (versión aficionado, adulto, con envío). No es la evolución de la misma camiseta en el tiempo y puede mezclar tiendas distintas.",
      seasonCols: ["Equipo", "Equipación", "Temporada anterior", "Temporada nueva", "Diferencia"],
    },
  },
  en: {
    asOf: (d) => `Catalogue data as of ${d}. Updated daily.`,
    kit: { home: "Home", away: "Away", third: "Third" },
    ground: { FG: "Firm natural grass", AG: "Artificial grass", SG: "Soft ground", MG: "Multi-ground", TF: "Turf", "FG/AG": "Natural and artificial" },
    wc: {
      h2: "Lowest price today for each national team shirt",
      note: (c) => `Fan version, adult, delivery to ${c} included. Official brand stores and sports retailers; no eBay, Amazon or replicas.`,
      cols: ["Team", "Kit", "From", "Store", "Stores", "Sizes at the cheapest", "Player version from"],
      qa: (f) => [
        { q: "How much does a 2026 World Cup shirt cost?", a: `The cheapest today costs ${f.min} (${f.team}, ${f.kit.toLowerCase()} kit, at ${f.store}). The median price of the ${f.n} shirts compared is ${f.median}, delivered to ${f.country}.` },
        { q: "How many national teams have a 2026 shirt?", a: `${f.teams} national teams, with ${f.n} home, away and third shirts at stores that ship to ${f.country}.` },
        ...(f.k ? [{ q: "How much more is the player version?", a: `For the ${f.k} shirts that also come in a player version, it costs a median ${f.diff} more than the fan version.` }] : []),
      ],
    },
    fp: {
      h2: "How much more the player version costs (today's data)",
      note: "Shirts from the 2025/26 season onward sold in both versions at the same time at official stores or retailers, in euros and without shipping.",
      cols: ["Brand", "Shirts", "Player / fan", "Median difference"],
      qa: (f) => [{ q: "How much more expensive is the player version?", a: `A median ${f.pct}% more (${f.diff}), measured on ${f.n} shirts sold in both versions at the same time.` }],
      examples: "Examples from the catalogue",
      ex: (n, a, b) => `${n}: fan from ${a}, player from ${b}`,
    },
    gr: {
      h2: "Boots by surface: models and prices today",
      note: (c) => `Adult boots in the catalogue. "From" is the lowest price delivered to ${c}; the median uses the cheapest offer for each model in euros.`,
      cols: ["Surface", "Models", "From", "Median price", "Lines with most models"],
      qa: (f) => [
        { q: "Which surface has the most boots?", a: `${f.most}: ${f.mostN} models, from ${f.mostFrom}.` },
        { q: "Which soleplate is cheapest on average?", a: `${f.cheap}, with a median price of ${f.cheapMedian}.` },
      ],
      kids: "Kids' boots",
      futsal: "Futsal shoes",
    },
    dt: {
      h2: "What our price history says",
      qa: (f) => [
        { q: "How many shirts drop in price?", a: `Since ${f.first} we have tracked ${f.offers} shirt offers at official stores and retailers: ${f.withDrop} (${f.pct}%) have dropped in price at least once.` },
        { q: "How much does a shirt usually drop?", a: `The median drop is ${f.med}%, and one in four drops by ${f.p75}% or more.` },
        { q: "Is last season's shirt cheaper?", a: `Yes, in most cases: across ${f.n} shirts of the same team and kit on sale in two seasons at once, last season's costs a median ${f.mid}% less than the new one today (the middle half of cases, between ${f.lo}% and ${f.hi}% less).` },
      ],
      storesH: "Which stores cut prices most often",
      storeCols: ["Store", "Offers tracked", "Dropped at least once"],
      seasonH: "Last season versus the new season",
      seasonNote: "Today's lowest price for each (fan version, adult, with delivery). This is not the same shirt over time and it can mix different stores.",
      seasonCols: ["Team", "Kit", "Last season", "New season", "Difference"],
    },
  },
  pt: {
    asOf: (d) => `Dados do catálogo a ${d}. Atualizados todos os dias.`,
    kit: { home: "Principal", away: "Alternativa", third: "Terceira" },
    ground: { FG: "Relva natural firme", AG: "Relva artificial", SG: "Terreno mole", MG: "Multiterreno", TF: "Society (turf)", "FG/AG": "Natural e artificial" },
    wc: {
      h2: "Preço mais baixo hoje de cada camisa de seleção",
      note: (c) => `Versão torcedor, adulto, com envio para ${c} incluído. Lojas oficiais e lojas de desporto; sem eBay, Amazon nem réplicas.`,
      cols: ["Seleção", "Equipamento", "Desde", "Loja", "Lojas", "Tamanhos na mais barata", "Versão jogador desde"],
      qa: (f) => [
        { q: "Quanto custa uma camisa do Mundial 2026?", a: `A mais barata hoje custa ${f.min} (${f.team}, equipamento ${f.kit.toLowerCase()}, na ${f.store}). O preço mediano das ${f.n} camisas comparadas é ${f.median}, com envio para ${f.country}.` },
        { q: "De quantas seleções há camisa de 2026?", a: `De ${f.teams} seleções, com ${f.n} camisas entre principal, alternativa e terceira em lojas que enviam para ${f.country}.` },
        ...(f.k ? [{ q: "Quanto custa a mais a versão jogador?", a: `Nas ${f.k} camisas que também têm versão jogador, esta custa em mediana mais ${f.diff} do que a de torcedor.` }] : []),
      ],
    },
    fp: {
      h2: "Quanto custa a mais a versão jogador (dados de hoje)",
      note: "Camisas da temporada 2025/26 em diante vendidas nas duas versões ao mesmo tempo em lojas oficiais ou de desporto, em euros e sem envio.",
      cols: ["Marca", "Camisas", "Jogador / torcedor", "Diferença mediana"],
      qa: (f) => [{ q: "Quanto mais cara é a versão jogador?", a: `Em mediana ${f.pct}% mais (${f.diff}), medido em ${f.n} camisas vendidas nas duas versões ao mesmo tempo.` }],
      examples: "Exemplos do catálogo",
      ex: (n, a, b) => `${n}: torcedor desde ${a}, jogador desde ${b}`,
    },
    gr: {
      h2: "Chuteiras por terreno: modelos e preços de hoje",
      note: (c) => `Chuteiras de adulto do catálogo. «Desde» é o preço mais baixo com envio para ${c}; a mediana usa a oferta mais barata de cada modelo em euros.`,
      cols: ["Terreno", "Modelos", "Desde", "Preço mediano", "Linhas com mais modelos"],
      qa: (f) => [
        { q: "Para que terreno há mais chuteiras?", a: `Para ${f.most}: ${f.mostN} modelos, desde ${f.mostFrom}.` },
        { q: "Que tipo de sola sai mais barata?", a: `${f.cheap}, com um preço mediano de ${f.cheapMedian}.` },
      ],
      kids: "Chuteiras de criança",
      futsal: "Sapatilhas de futsal",
    },
    dt: {
      h2: "O que diz o nosso histórico de preços",
      qa: (f) => [
        { q: "Quantas camisas baixam de preço?", a: `Desde ${f.first} seguimos ${f.offers} ofertas de camisas em lojas oficiais e de desporto: ${f.withDrop} (${f.pct}%) baixaram de preço pelo menos uma vez.` },
        { q: "Quanto costuma baixar uma camisa?", a: `A baixa mediana é de ${f.med}%, e uma em cada quatro baixa ${f.p75}% ou mais.` },
        { q: "A camisa da temporada anterior é mais barata?", a: `Sim, na maioria dos casos: em ${f.n} camisas da mesma equipa e equipamento à venda em duas temporadas ao mesmo tempo, a anterior custa hoje em mediana ${f.mid}% menos do que a nova (a metade central dos casos, entre ${f.lo}% e ${f.hi}% menos).` },
      ],
      storesH: "Que lojas baixam preços com mais frequência",
      storeCols: ["Loja", "Ofertas seguidas", "Baixaram pelo menos uma vez"],
      seasonH: "Temporada anterior contra temporada nova",
      seasonNote: "Preço mais baixo de hoje de cada uma (versão torcedor, adulto, com envio). Não é a evolução da mesma camisa no tempo e pode misturar lojas diferentes.",
      seasonCols: ["Equipa", "Equipamento", "Temporada anterior", "Temporada nova", "Diferença"],
    },
  },
  fr: {
    asOf: (d) => `Données du catalogue au ${d}. Mises à jour chaque jour.`,
    kit: { home: "Domicile", away: "Extérieur", third: "Third" },
    ground: { FG: "Terrain naturel sec", AG: "Synthétique", SG: "Terrain gras", MG: "Multi-surfaces", TF: "Stabilisé / turf", "FG/AG": "Naturel et synthétique" },
    wc: {
      h2: "Prix le plus bas aujourd'hui pour chaque maillot de sélection",
      note: (c) => `Version supporter, adulte, livraison en ${c} comprise. Boutiques officielles et enseignes de sport ; ni eBay, ni Amazon, ni répliques.`,
      cols: ["Sélection", "Maillot", "Dès", "Boutique", "Boutiques", "Tailles chez la moins chère", "Version joueur dès"],
      qa: (f) => [
        { q: "Combien coûte un maillot de la Coupe du monde 2026 ?", a: `Le moins cher coûte aujourd'hui ${f.min} (${f.team}, maillot ${f.kit.toLowerCase()}, chez ${f.store}). Le prix médian des ${f.n} maillots comparés est de ${f.median}, livrés en ${f.country}.` },
        { q: "Combien de sélections ont un maillot 2026 ?", a: `${f.teams} sélections, avec ${f.n} maillots domicile, extérieur et third dans des boutiques qui livrent en ${f.country}.` },
        ...(f.k ? [{ q: "Combien coûte en plus la version joueur ?", a: `Pour les ${f.k} maillots qui existent aussi en version joueur, celle-ci coûte en médiane ${f.diff} de plus que la version supporter.` }] : []),
      ],
    },
    fp: {
      h2: "Combien coûte en plus la version joueur (données du jour)",
      note: "Maillots de la saison 2025/26 et suivantes vendus dans les deux versions en même temps dans des boutiques officielles ou des enseignes de sport, en euros et hors livraison.",
      cols: ["Marque", "Maillots", "Joueur / supporter", "Écart médian"],
      qa: (f) => [{ q: "Combien plus chère est la version joueur ?", a: `En médiane ${f.pct} % de plus (${f.diff}), mesuré sur ${f.n} maillots vendus dans les deux versions en même temps.` }],
      examples: "Exemples du catalogue",
      ex: (n, a, b) => `${n} : supporter dès ${a}, joueur dès ${b}`,
    },
    gr: {
      h2: "Chaussures par terrain : modèles et prix du jour",
      note: (c) => `Chaussures adulte du catalogue. « Dès » est le prix le plus bas livré en ${c} ; la médiane utilise l'offre la moins chère de chaque modèle en euros.`,
      cols: ["Terrain", "Modèles", "Dès", "Prix médian", "Gammes les plus fournies"],
      qa: (f) => [
        { q: "Pour quel terrain y a-t-il le plus de chaussures ?", a: `${f.most} : ${f.mostN} modèles, dès ${f.mostFrom}.` },
        { q: "Quel type de semelle est le moins cher en moyenne ?", a: `${f.cheap}, avec un prix médian de ${f.cheapMedian}.` },
      ],
      kids: "Chaussures enfant",
      futsal: "Chaussures de futsal",
    },
    dt: {
      h2: "Ce que dit notre historique de prix",
      qa: (f) => [
        { q: "Combien de maillots baissent de prix ?", a: `Depuis le ${f.first}, nous suivons ${f.offers} offres de maillots dans des boutiques officielles et des enseignes de sport : ${f.withDrop} (${f.pct} %) ont baissé de prix au moins une fois.` },
        { q: "De combien baisse un maillot en général ?", a: `La baisse médiane est de ${f.med} %, et une sur quatre atteint ${f.p75} % ou plus.` },
        { q: "Le maillot de la saison précédente est-il moins cher ?", a: `Oui, dans la plupart des cas : sur ${f.n} maillots d'une même équipe et d'un même modèle vendus en même temps sur deux saisons, celui de la saison précédente coûte aujourd'hui en médiane ${f.mid} % de moins que le nouveau (la moitié centrale des cas, entre ${f.lo} % et ${f.hi} % de moins).` },
      ],
      storesH: "Les boutiques qui baissent leurs prix le plus souvent",
      storeCols: ["Boutique", "Offres suivies", "Ont baissé au moins une fois"],
      seasonH: "Saison précédente contre nouvelle saison",
      seasonNote: "Prix le plus bas du jour pour chacun (version supporter, adulte, livraison comprise). Ce n'est pas l'évolution du même maillot dans le temps et cela peut mélanger des boutiques différentes.",
      seasonCols: ["Équipe", "Maillot", "Saison précédente", "Nouvelle saison", "Écart"],
    },
  },
  it: {
    asOf: (d) => `Dati del catalogo al ${d}. Aggiornati ogni giorno.`,
    kit: { home: "Home", away: "Away", third: "Third" },
    ground: { FG: "Erba naturale compatta", AG: "Erba sintetica", SG: "Terreno morbido", MG: "Multi-terreno", TF: "Turf / calcetto", "FG/AG": "Naturale e sintetico" },
    wc: {
      h2: "Prezzo più basso di oggi per ogni maglia di nazionale",
      note: (c) => `Versione tifoso, adulto, con spedizione in ${c} inclusa. Store ufficiali e negozi sportivi; niente eBay, Amazon o repliche.`,
      cols: ["Nazionale", "Maglia", "Da", "Negozio", "Negozi", "Taglie nel più economico", "Versione giocatore da"],
      qa: (f) => [
        { q: "Quanto costa una maglia dei Mondiali 2026?", a: `La più economica oggi costa ${f.min} (${f.team}, maglia ${f.kit.toLowerCase()}, da ${f.store}). Il prezzo mediano delle ${f.n} maglie confrontate è ${f.median}, con spedizione in ${f.country}.` },
        { q: "Quante nazionali hanno una maglia 2026?", a: `${f.teams} nazionali, con ${f.n} maglie home, away e third in negozi che spediscono in ${f.country}.` },
        ...(f.k ? [{ q: "Quanto costa in più la versione giocatore?", a: `Nelle ${f.k} maglie che hanno anche la versione giocatore, questa costa in mediana ${f.diff} in più di quella da tifoso.` }] : []),
      ],
    },
    fp: {
      h2: "Quanto costa in più la versione giocatore (dati di oggi)",
      note: "Maglie dalla stagione 2025/26 in poi vendute in entrambe le versioni contemporaneamente in store ufficiali o negozi sportivi, in euro e senza spedizione.",
      cols: ["Marchio", "Maglie", "Giocatore / tifoso", "Differenza mediana"],
      qa: (f) => [{ q: "Quanto è più cara la versione giocatore?", a: `In mediana il ${f.pct}% in più (${f.diff}), misurato su ${f.n} maglie vendute in entrambe le versioni contemporaneamente.` }],
      examples: "Esempi dal catalogo",
      ex: (n, a, b) => `${n}: tifoso da ${a}, giocatore da ${b}`,
    },
    gr: {
      h2: "Scarpe per terreno: modelli e prezzi di oggi",
      note: (c) => `Scarpe da adulto del catalogo. «Da» è il prezzo più basso con spedizione in ${c}; la mediana usa l'offerta più economica di ogni modello in euro.`,
      cols: ["Terreno", "Modelli", "Da", "Prezzo mediano", "Linee con più modelli"],
      qa: (f) => [
        { q: "Per quale terreno ci sono più scarpe?", a: `${f.most}: ${f.mostN} modelli, da ${f.mostFrom}.` },
        { q: "Quale tipo di suola costa meno in media?", a: `${f.cheap}, con un prezzo mediano di ${f.cheapMedian}.` },
      ],
      kids: "Scarpe da bambino",
      futsal: "Scarpe da calcio a 5",
    },
    dt: {
      h2: "Cosa dice il nostro storico dei prezzi",
      qa: (f) => [
        { q: "Quante maglie scendono di prezzo?", a: `Dal ${f.first} seguiamo ${f.offers} offerte di maglie in store ufficiali e negozi sportivi: ${f.withDrop} (il ${f.pct}%) sono scese di prezzo almeno una volta.` },
        { q: "Di quanto scende di solito una maglia?", a: `Il ribasso mediano è del ${f.med}%, e una su quattro scende del ${f.p75}% o più.` },
        { q: "La maglia della stagione precedente costa meno?", a: `Sì, nella maggior parte dei casi: su ${f.n} maglie della stessa squadra e dello stesso modello in vendita in due stagioni insieme, quella precedente oggi costa in mediana il ${f.mid}% in meno della nuova (la metà centrale dei casi, tra il ${f.lo}% e il ${f.hi}% in meno).` },
      ],
      storesH: "I negozi che abbassano i prezzi più spesso",
      storeCols: ["Negozio", "Offerte seguite", "Scese almeno una volta"],
      seasonH: "Stagione precedente contro stagione nuova",
      seasonNote: "Prezzo più basso di oggi di ciascuna (versione tifoso, adulto, con spedizione). Non è l'andamento della stessa maglia nel tempo e può mescolare negozi diversi.",
      seasonCols: ["Squadra", "Maglia", "Stagione precedente", "Stagione nuova", "Differenza"],
    },
  },
};
