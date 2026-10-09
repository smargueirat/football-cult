import type { HubLocale } from "@/data/teamMeta";

// Textos del índice de precios. Los NÚMEROS no viven acá: salen de
// priceIndex() en build, desde el catálogo y el archivo de precios reales.
export interface IndexCopy {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  updated: string;
  statGap: string;
  statGapNote: string;
  statSample: string;
  statSampleNote: string;
  statDays: string;
  statDaysNote: string;
  honestyTitle: string;
  /** Aviso de historia corta: se muestra siempre que el archivo cubre < 60 días. */
  honestyShort: (days: number, from: string, to: string) => string;
  honestyNone: string;
  seriesTitle: string;
  seriesIntro: string;
  seriesNoChart: (n: number) => string;
  seriesMonthlyPending: string;
  colDate: string;
  colIndex: string;
  colMonth: string;
  leagueTitle: string;
  leagueIntro: string;
  brandTitle: string;
  brandIntro: string;
  colGroup: string;
  colN: string;
  colAvgGap: string;
  colMedianGap: string;
  colChange: string;
  otherBrand: string;
  methodTitle: string;
  methodItems: string[];
  citeTitle: string;
  citeText: string;
  citeLine: string;
  downloadCsv: (n: number) => string;
  downloadJson: string;
  linkFromStudy: string;
  csvHead: string[];
}

export const INDEX: Record<HubLocale, IndexCopy> = {
  es: {
    title: "Índice de precios de camisetas de fútbol",
    metaTitle: "Índice de precios de camisetas de fútbol: datos abiertos | Football Cult",
    metaDescription:
      "Seguimiento de precios de {n} camisetas oficiales en tiendas europeas, por liga y por marca. Metodología pública y datos descargables en CSV y JSON.",
    intro:
      "Un índice abierto de lo que cuestan las camisetas oficiales en las tiendas europeas: cuánto se separan los precios de la misma prenda entre tiendas, por liga y por marca, y cómo se mueven con el tiempo. Todo sale de los precios que publican las tiendas, medidos por nosotros, con la metodología a la vista y los datos para descargar.",
    updated: "Datos al",
    statGap: "de diferencia media",
    statGapNote: "entre la tienda más barata y la más cara para la misma camiseta (mediana: {median}%)",
    statSample: "camisetas comparadas",
    statSampleNote: "mismo código de fabricante, temporada actual, solo euros y tiendas oficiales",
    statDays: "días de historia",
    statDaysNote: "del archivo de precios que alimenta la serie temporal",
    honestyTitle: "Cuánto historial hay",
    honestyShort: (days, from, to) =>
      `El archivo de precios de las ofertas de este índice cubre ${days} días (${from} a ${to}). Es poco: una serie mensual necesita varios meses, así que por ahora publicamos la serie diaria desde que hay datos suficientes y no mostramos tendencias. La comparación entre tiendas, por liga y por marca, sí es del día y no depende del historial. Esta página se actualiza sola con cada actualización del catálogo.`,
    honestyNone: "Todavía no hay historial suficiente para publicar una serie de precios. La comparación entre tiendas, por liga y por marca, sí es del día.",
    seriesTitle: "Evolución del precio",
    seriesIntro:
      "Mediana de la variación del precio más bajo de cada camiseta respecto de la fecha base (base = 100). Se siguen las mismas ofertas de la tabla de abajo; no entran ni salen camisetas, solo cambian precios.",
    seriesNoChart: (n) => `Hay ${n} puntos diarios: con menos de 5 no dibujamos un gráfico, porque una línea corta parecería una tendencia sin serlo. La tabla muestra todos los valores.`,
    seriesMonthlyPending: "La serie mensual aparece cuando el archivo cubra al menos dos meses naturales completos.",
    colDate: "Fecha",
    colIndex: "Índice (base 100)",
    colMonth: "Mes cerrado",
    leagueTitle: "Por liga",
    leagueIntro: "Diferencia de precio entre tiendas para la misma camiseta, agrupada por liga del equipo. Solo ligas con 5 o más camisetas comparadas.",
    brandTitle: "Por marca",
    brandIntro: "Lo mismo, agrupado por el fabricante de la camiseta. Solo marcas con 5 o más camisetas comparadas.",
    colGroup: "Grupo",
    colN: "Camisetas",
    colAvgGap: "Diferencia media",
    colMedianGap: "Diferencia mediana",
    colChange: "Variación desde la base",
    otherBrand: "Otras marcas",
    methodTitle: "Metodología",
    methodItems: [
      "Misma prenda: solo se comparan ofertas con el mismo código de fabricante (MPN), que cada tienda publica y que es distinto para la versión de jugador y la de aficionado. Es la misma muestra que usa el estudio de precios.",
      "Solo camisetas de temporada actual, en euros y de minoristas oficiales. Se excluyen retro, marketplaces y tiendas de réplicas.",
      "Diferencia entre tiendas: (precio final más alto − más bajo) / más alto, con envío incluido. Se promedia y se calcula la mediana por grupo.",
      "Serie temporal: sale del archivo durable de precios (solo se anotan los cambios, nunca se borra). Panel fijo de las camisetas con precio registrado en la fecha base; la fecha base es la primera en que al menos el 80% de la muestra tiene todas sus ofertas registradas. No se inventan datos anteriores.",
      "El precio de cada día es el más bajo entre las ofertas de esa camiseta, sin envío (el envío se asume constante). El índice es la mediana de precio del día sobre precio base, por 100.",
      "Los grupos con menos de 5 camisetas no se publican. Los datos de cada fila se pueden descargar y verificar.",
    ],
    citeTitle: "Cómo citar y descargar",
    citeText: "Los datos son libres de citar. Te agradecemos un enlace a esta página, que se actualiza sola y siempre muestra el número vigente. Licencia CC BY 4.0: puedes copiar, usar y republicar los datos, incluso con fines comerciales, siempre que nombres «Football Cult» como fuente y enlaces a esta página.",
    citeLine: "Football Cult, «{title}», datos al {date}.",
    downloadCsv: (n) => `Descargar la tabla (${n} camisetas, CSV)`,
    downloadJson: "Descargar todo en JSON (tabla, grupos y serie)",
    linkFromStudy: "Ver también el índice de precios, por liga y marca",
    csvHead: ["equipo", "liga", "marca", "temporada", "tipo", "precio_mas_bajo_eur", "precio_mas_alto_eur", "diferencia_pct", "variacion_desde_base_pct", "ficha"],
  },
  en: {
    title: "Football shirt price index",
    metaTitle: "Football shirt price index: open data | Football Cult",
    metaDescription:
      "Price tracking for {n} official football shirts across European stores, by league and brand. Public methodology and downloadable CSV and JSON data.",
    intro:
      "An open index of what official football shirts cost in European stores: how far apart the prices of the same shirt are between stores, by league and by brand, and how they move over time. Everything comes from the prices stores publish, measured by us, with the methodology in plain sight and the data available to download.",
    updated: "Data as of",
    statGap: "average gap",
    statGapNote: "between the cheapest and the dearest store for the same shirt (median: {median}%)",
    statSample: "shirts compared",
    statSampleNote: "same manufacturer code, current season, euros only, official retailers",
    statDays: "days of history",
    statDaysNote: "in the price archive that feeds the time series",
    honestyTitle: "How long the history is",
    honestyShort: (days, from, to) =>
      `The price archive for the offers in this index covers ${days} days (${from} to ${to}). That is short: a monthly series needs several months, so for now we publish the daily series once there is enough data and we do not show trends. The comparison between stores, by league and by brand, is current and does not depend on the history. This page updates itself with every catalog update.`,
    honestyNone: "There is not yet enough history to publish a price series. The comparison between stores, by league and by brand, is current.",
    seriesTitle: "Price evolution",
    seriesIntro:
      "Median change of each shirt's lowest price against the base date (base = 100). The same offers as in the tables below are followed; no shirts enter or leave, only prices change.",
    seriesNoChart: (n) => `There are ${n} daily points: with fewer than 5 we do not draw a chart, because a short line would look like a trend without being one. The table shows every value.`,
    seriesMonthlyPending: "The monthly series appears once the archive covers at least two full calendar months.",
    colDate: "Date",
    colIndex: "Index (base 100)",
    colMonth: "Closed month",
    leagueTitle: "By league",
    leagueIntro: "Price gap between stores for the same shirt, grouped by the team's league. Only leagues with 5 or more compared shirts.",
    brandTitle: "By brand",
    brandIntro: "The same, grouped by shirt manufacturer. Only brands with 5 or more compared shirts.",
    colGroup: "Group",
    colN: "Shirts",
    colAvgGap: "Average gap",
    colMedianGap: "Median gap",
    colChange: "Change since base",
    otherBrand: "Other brands",
    methodTitle: "Methodology",
    methodItems: [
      "Same garment: only offers with the same manufacturer code (MPN) are compared; each store publishes it and it differs between the player and fan versions. It is the same sample the price study uses.",
      "Current-season shirts only, in euros, from official retailers. Retro, marketplaces and replica stores are excluded.",
      "Gap between stores: (highest final price − lowest) / highest, shipping included. Averaged, with the median calculated per group.",
      "Time series: taken from the durable price archive (only changes are recorded, nothing is ever deleted). Fixed panel of the shirts with a recorded price on the base date; the base date is the first one on which at least 80% of the sample has all its offers recorded. No earlier data is invented.",
      "Each day's price is the lowest among that shirt's offers, without shipping (shipping is assumed constant). The index is the median of the day's price over the base price, times 100.",
      "Groups with fewer than 5 shirts are not published. The data behind every row can be downloaded and checked.",
    ],
    citeTitle: "How to cite and download",
    citeText: "The data is free to cite. A link to this page is appreciated; it updates itself and always shows the current figure. Licensed under CC BY 4.0: you may copy, use and republish the data, including commercially, as long as you credit “Football Cult” and link to this page.",
    citeLine: "Football Cult, “{title}”, data as of {date}.",
    downloadCsv: (n) => `Download the table (${n} shirts, CSV)`,
    downloadJson: "Download everything as JSON (table, groups and series)",
    linkFromStudy: "See also the price index, by league and brand",
    csvHead: ["team", "league", "brand", "season", "kit", "lowest_price_eur", "highest_price_eur", "gap_pct", "change_since_base_pct", "page"],
  },
  pt: {
    title: "Índice de preços de camisas de futebol",
    metaTitle: "Índice de preços de camisas de futebol: dados abertos | Football Cult",
    metaDescription:
      "Acompanhamento de preços de {n} camisas oficiais em lojas europeias, por liga e por marca. Metodologia pública e dados para baixar em CSV e JSON.",
    intro:
      "Um índice aberto do que custam as camisas oficiais nas lojas europeias: quanto os preços da mesma camisa se afastam entre lojas, por liga e por marca, e como se movem ao longo do tempo. Tudo sai dos preços que as lojas publicam, medidos por nós, com a metodologia à vista e os dados para baixar.",
    updated: "Dados de",
    statGap: "de diferença média",
    statGapNote: "entre a loja mais barata e a mais cara para a mesma camisa (mediana: {median}%)",
    statSample: "camisas comparadas",
    statSampleNote: "mesmo código do fabricante, temporada atual, só euros e lojas oficiais",
    statDays: "dias de histórico",
    statDaysNote: "do arquivo de preços que alimenta a série temporal",
    honestyTitle: "Quão longo é o histórico",
    honestyShort: (days, from, to) =>
      `O arquivo de preços das ofertas deste índice cobre ${days} dias (${from} a ${to}). É pouco: uma série mensal precisa de vários meses, então por ora publicamos a série diária quando há dados suficientes e não mostramos tendências. A comparação entre lojas, por liga e por marca, é do dia e não depende do histórico. Esta página se atualiza sozinha a cada atualização do catálogo.`,
    honestyNone: "Ainda não há histórico suficiente para publicar uma série de preços. A comparação entre lojas, por liga e por marca, é do dia.",
    seriesTitle: "Evolução do preço",
    seriesIntro:
      "Mediana da variação do menor preço de cada camisa em relação à data base (base = 100). Acompanham-se as mesmas ofertas das tabelas abaixo; nenhuma camisa entra ou sai, só mudam os preços.",
    seriesNoChart: (n) => `Há ${n} pontos diários: com menos de 5 não desenhamos gráfico, porque uma linha curta pareceria uma tendência sem ser. A tabela mostra todos os valores.`,
    seriesMonthlyPending: "A série mensal aparece quando o arquivo cobrir pelo menos dois meses civis completos.",
    colDate: "Data",
    colIndex: "Índice (base 100)",
    colMonth: "Mês fechado",
    leagueTitle: "Por liga",
    leagueIntro: "Diferença de preço entre lojas para a mesma camisa, agrupada pela liga do time. Só ligas com 5 ou mais camisas comparadas.",
    brandTitle: "Por marca",
    brandIntro: "O mesmo, agrupado pelo fabricante da camisa. Só marcas com 5 ou mais camisas comparadas.",
    colGroup: "Grupo",
    colN: "Camisas",
    colAvgGap: "Diferença média",
    colMedianGap: "Diferença mediana",
    colChange: "Variação desde a base",
    otherBrand: "Outras marcas",
    methodTitle: "Metodologia",
    methodItems: [
      "Mesma peça: só se comparam ofertas com o mesmo código do fabricante (MPN), que cada loja publica e que é diferente para a versão de jogador e a de torcedor. É a mesma amostra do estudo de preços.",
      "Só camisas da temporada atual, em euros e de varejistas oficiais. Ficam de fora retrô, marketplaces e lojas de réplicas.",
      "Diferença entre lojas: (preço final mais alto − mais baixo) / mais alto, com frete incluído. Calcula-se a média e a mediana por grupo.",
      "Série temporal: vem do arquivo durável de preços (só se anotam as mudanças, nada é apagado). Painel fixo das camisas com preço registrado na data base; a data base é a primeira em que pelo menos 80% da amostra tem todas as ofertas registradas. Não se inventam dados anteriores.",
      "O preço de cada dia é o mais baixo entre as ofertas dessa camisa, sem frete (o frete se assume constante). O índice é a mediana do preço do dia sobre o preço base, vezes 100.",
      "Grupos com menos de 5 camisas não são publicados. Os dados de cada linha podem ser baixados e conferidos.",
    ],
    citeTitle: "Como citar e baixar",
    citeText: "Os dados são livres para citar. Agradecemos um link para esta página, que se atualiza sozinha e sempre mostra o número vigente. Licença CC BY 4.0: você pode copiar, usar e republicar os dados, inclusive com fins comerciais, desde que cite «Football Cult» como fonte e faça um link para esta página.",
    citeLine: "Football Cult, «{title}», dados de {date}.",
    downloadCsv: (n) => `Baixar a tabela (${n} camisas, CSV)`,
    downloadJson: "Baixar tudo em JSON (tabela, grupos e série)",
    linkFromStudy: "Veja também o índice de preços, por liga e marca",
    csvHead: ["time", "liga", "marca", "temporada", "tipo", "preco_mais_baixo_eur", "preco_mais_alto_eur", "diferenca_pct", "variacao_desde_base_pct", "pagina"],
  },
  fr: {
    title: "Indice des prix des maillots de football",
    metaTitle: "Indice des prix des maillots de football : données ouvertes | Football Cult",
    metaDescription:
      "Suivi des prix de {n} maillots officiels dans des boutiques européennes, par championnat et par marque. Méthodologie publique et données à télécharger en CSV et JSON.",
    intro:
      "Un indice ouvert de ce que coûtent les maillots officiels dans les boutiques européennes : l'écart de prix d'un même maillot entre boutiques, par championnat et par marque, et son évolution dans le temps. Tout vient des prix publiés par les boutiques, mesurés par nos soins, avec la méthodologie visible et les données à télécharger.",
    updated: "Données au",
    statGap: "d'écart moyen",
    statGapNote: "entre la boutique la moins chère et la plus chère pour le même maillot (médiane : {median} %)",
    statSample: "maillots comparés",
    statSampleNote: "même code fabricant, saison en cours, euros uniquement, détaillants officiels",
    statDays: "jours d'historique",
    statDaysNote: "dans l'archive des prix qui alimente la série temporelle",
    honestyTitle: "Quelle est la durée de l'historique",
    honestyShort: (days, from, to) =>
      `L'archive des prix des offres de cet indice couvre ${days} jours (${from} au ${to}). C'est peu : une série mensuelle demande plusieurs mois, donc pour l'instant nous publions la série quotidienne dès qu'il y a assez de données et nous n'affichons aucune tendance. La comparaison entre boutiques, par championnat et par marque, est celle du jour et ne dépend pas de l'historique. Cette page se met à jour toute seule à chaque mise à jour du catalogue.`,
    honestyNone: "L'historique n'est pas encore suffisant pour publier une série de prix. La comparaison entre boutiques, par championnat et par marque, est celle du jour.",
    seriesTitle: "Évolution du prix",
    seriesIntro:
      "Variation médiane du prix le plus bas de chaque maillot par rapport à la date de base (base = 100). Ce sont les mêmes offres que dans les tableaux ci-dessous : aucun maillot n'entre ni ne sort, seuls les prix changent.",
    seriesNoChart: (n) => `Il y a ${n} points quotidiens : en dessous de 5 nous ne traçons pas de graphique, car une ligne courte ressemblerait à une tendance sans en être une. Le tableau donne toutes les valeurs.`,
    seriesMonthlyPending: "La série mensuelle apparaît quand l'archive couvre au moins deux mois civils complets.",
    colDate: "Date",
    colIndex: "Indice (base 100)",
    colMonth: "Mois clos",
    leagueTitle: "Par championnat",
    leagueIntro: "Écart de prix entre boutiques pour le même maillot, regroupé par championnat de l'équipe. Seulement les championnats avec 5 maillots comparés ou plus.",
    brandTitle: "Par marque",
    brandIntro: "La même chose, regroupée par équipementier. Seulement les marques avec 5 maillots comparés ou plus.",
    colGroup: "Groupe",
    colN: "Maillots",
    colAvgGap: "Écart moyen",
    colMedianGap: "Écart médian",
    colChange: "Variation depuis la base",
    otherBrand: "Autres marques",
    methodTitle: "Méthodologie",
    methodItems: [
      "Même article : on ne compare que des offres ayant le même code fabricant (MPN), que chaque boutique publie et qui diffère entre la version joueur et la version supporter. C'est le même échantillon que l'étude des prix.",
      "Uniquement les maillots de la saison en cours, en euros, de détaillants officiels. Rétro, places de marché et boutiques de répliques sont exclus.",
      "Écart entre boutiques : (prix final le plus haut − le plus bas) / le plus haut, livraison comprise. On calcule la moyenne et la médiane par groupe.",
      "Série temporelle : issue de l'archive durable des prix (seuls les changements sont enregistrés, rien n'est jamais supprimé). Panel fixe des maillots dont le prix est enregistré à la date de base ; la date de base est la première où au moins 80 % de l'échantillon a toutes ses offres enregistrées. Aucune donnée antérieure n'est inventée.",
      "Le prix de chaque jour est le plus bas parmi les offres du maillot, hors livraison (la livraison est supposée constante). L'indice est la médiane du prix du jour sur le prix de base, fois 100.",
      "Les groupes de moins de 5 maillots ne sont pas publiés. Les données de chaque ligne peuvent être téléchargées et vérifiées.",
    ],
    citeTitle: "Comment citer et télécharger",
    citeText: "Les données sont libres de citation. Un lien vers cette page est apprécié ; elle se met à jour toute seule et affiche toujours le chiffre en vigueur. Licence CC BY 4.0 : vous pouvez copier, utiliser et republier les données, y compris à des fins commerciales, à condition de citer « Football Cult » comme source et de lier cette page.",
    citeLine: "Football Cult, « {title} », données au {date}.",
    downloadCsv: (n) => `Télécharger le tableau (${n} maillots, CSV)`,
    downloadJson: "Tout télécharger en JSON (tableau, groupes et série)",
    linkFromStudy: "Voir aussi l'indice des prix, par championnat et marque",
    csvHead: ["equipe", "championnat", "marque", "saison", "type", "prix_le_plus_bas_eur", "prix_le_plus_haut_eur", "ecart_pct", "variation_depuis_base_pct", "page"],
  },
  it: {
    title: "Indice dei prezzi delle maglie da calcio",
    metaTitle: "Indice dei prezzi delle maglie da calcio: dati aperti | Football Cult",
    metaDescription:
      "Monitoraggio dei prezzi di {n} maglie ufficiali nei negozi europei, per campionato e per marchio. Metodologia pubblica e dati scaricabili in CSV e JSON.",
    intro:
      "Un indice aperto di quanto costano le maglie ufficiali nei negozi europei: di quanto si distanziano i prezzi della stessa maglia tra negozi, per campionato e per marchio, e come cambiano nel tempo. Tutto parte dai prezzi che i negozi pubblicano, misurati da noi, con la metodologia in vista e i dati da scaricare.",
    updated: "Dati al",
    statGap: "di differenza media",
    statGapNote: "tra il negozio più economico e il più caro per la stessa maglia (mediana: {median}%)",
    statSample: "maglie confrontate",
    statSampleNote: "stesso codice del produttore, stagione in corso, solo euro, rivenditori ufficiali",
    statDays: "giorni di storico",
    statDaysNote: "nell'archivio dei prezzi che alimenta la serie temporale",
    honestyTitle: "Quanto è lungo lo storico",
    honestyShort: (days, from, to) =>
      `L'archivio dei prezzi delle offerte di questo indice copre ${days} giorni (dal ${from} al ${to}). Sono pochi: una serie mensile richiede diversi mesi, quindi per ora pubblichiamo la serie giornaliera quando i dati bastano e non mostriamo tendenze. Il confronto tra negozi, per campionato e per marchio, è quello di oggi e non dipende dallo storico. Questa pagina si aggiorna da sola a ogni aggiornamento del catalogo.`,
    honestyNone: "Non c'è ancora abbastanza storico per pubblicare una serie di prezzi. Il confronto tra negozi, per campionato e per marchio, è quello di oggi.",
    seriesTitle: "Andamento del prezzo",
    seriesIntro:
      "Variazione mediana del prezzo più basso di ogni maglia rispetto alla data base (base = 100). Si seguono le stesse offerte delle tabelle qui sotto: nessuna maglia entra o esce, cambiano solo i prezzi.",
    seriesNoChart: (n) => `Ci sono ${n} punti giornalieri: sotto i 5 non disegniamo un grafico, perché una linea corta sembrerebbe una tendenza senza esserlo. La tabella mostra tutti i valori.`,
    seriesMonthlyPending: "La serie mensile compare quando l'archivio copre almeno due mesi di calendario completi.",
    colDate: "Data",
    colIndex: "Indice (base 100)",
    colMonth: "Mese chiuso",
    leagueTitle: "Per campionato",
    leagueIntro: "Differenza di prezzo tra negozi per la stessa maglia, raggruppata per campionato della squadra. Solo campionati con 5 o più maglie confrontate.",
    brandTitle: "Per marchio",
    brandIntro: "Lo stesso, raggruppato per produttore della maglia. Solo marchi con 5 o più maglie confrontate.",
    colGroup: "Gruppo",
    colN: "Maglie",
    colAvgGap: "Differenza media",
    colMedianGap: "Differenza mediana",
    colChange: "Variazione dalla base",
    otherBrand: "Altri marchi",
    methodTitle: "Metodologia",
    methodItems: [
      "Stesso capo: si confrontano solo offerte con lo stesso codice del produttore (MPN), che ogni negozio pubblica e che è diverso tra versione giocatore e versione tifoso. È lo stesso campione dello studio sui prezzi.",
      "Solo maglie della stagione in corso, in euro, di rivenditori ufficiali. Esclusi retro, marketplace e negozi di repliche.",
      "Differenza tra negozi: (prezzo finale più alto − più basso) / più alto, spedizione inclusa. Si calcolano media e mediana per gruppo.",
      "Serie temporale: ricavata dall'archivio durevole dei prezzi (si annotano solo i cambiamenti, nulla viene mai cancellato). Panel fisso delle maglie con prezzo registrato alla data base; la data base è la prima in cui almeno l'80% del campione ha tutte le offerte registrate. Non si inventano dati precedenti.",
      "Il prezzo di ogni giorno è il più basso tra le offerte di quella maglia, senza spedizione (la spedizione si assume costante). L'indice è la mediana del prezzo del giorno sul prezzo base, per 100.",
      "I gruppi con meno di 5 maglie non vengono pubblicati. I dati di ogni riga si possono scaricare e verificare.",
    ],
    citeTitle: "Come citare e scaricare",
    citeText: "I dati si possono citare liberamente. Un link a questa pagina è gradito; si aggiorna da sola e mostra sempre il numero vigente. Licenza CC BY 4.0: puoi copiare, usare e ripubblicare i dati, anche a fini commerciali, purché citi «Football Cult» come fonte e linki questa pagina.",
    citeLine: "Football Cult, «{title}», dati al {date}.",
    downloadCsv: (n) => `Scarica la tabella (${n} maglie, CSV)`,
    downloadJson: "Scarica tutto in JSON (tabella, gruppi e serie)",
    linkFromStudy: "Vedi anche l'indice dei prezzi, per campionato e marchio",
    csvHead: ["squadra", "campionato", "marchio", "stagione", "tipo", "prezzo_piu_basso_eur", "prezzo_piu_alto_eur", "differenza_pct", "variazione_dalla_base_pct", "pagina"],
  },
};
