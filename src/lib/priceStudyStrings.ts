import type { HubLocale } from "@/data/teamMeta";

// Copys del estudio de precios. Los NÚMEROS no viven acá: salen de
// priceStudy() en build desde el catálogo real, así que este archivo
// nunca hay que actualizarlo cuando cambian los datos.
export interface StudyCopy {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  updated: string;
  statAvgGap: string;
  statOver20: string;
  statMaxGap: string;
  statSamePrice: string;
  statAvgGapNote: string;
  statOver20Note: string;
  statMaxGapNote: string;
  statSamePriceNote: string;
  examplesTitle: string;
  examplesIntro: string;
  colShirt: string;
  colCheapest: string;
  colDearest: string;
  colGap: string;
  storesTitle: string;
  storesIntro: string;
  colStore: string;
  colWins: string;
  colWinPct: string;
  brandTitle: string;
  brandText: string;
  methodTitle: string;
  methodIntro: string;
  method1: string;
  method2: string;
  method3: string;
  method4: string;
  citeTitle: string;
  citeText: string;
  citeLine: string;
}

export const STUDY: Record<HubLocale, StudyCopy> = {
  es: {
    title: "Cuánto cambia el precio de la misma camiseta según la tienda",
    metaTitle: "Estudio: la misma camiseta, hasta un {max} € más cara según la tienda | Football Cult",
    metaDescription:
      "Analizamos {n} camisetas oficiales de temporada actual vendidas por {stores} tiendas europeas. La diferencia media entre la más barata y la más cara es del {avg}%.",
    intro:
      "Comparamos el precio final —producto más envío— de la misma camiseta oficial en distintas tiendas. No es una estimación: son los precios reales que publican las tiendas en sus propios catálogos, recalculados cada vez que actualizamos el sitio.",
    updated: "Datos actualizados el",
    statAvgGap: "de diferencia media",
    statAvgGapNote: "entre la tienda más barata y la más cara para la misma camiseta",
    statOver20: "de las camisetas",
    statOver20Note: "tienen una diferencia de precio del 20% o más entre tiendas",
    statMaxGap: "la mayor diferencia",
    statMaxGapNote: "encontrada en una sola camiseta, entre dos tiendas oficiales",
    statSamePrice: "cuestan lo mismo",
    statSamePriceNote: "en todas las tiendas donde se venden: comparar casi siempre cambia algo",
    examplesTitle: "Las diferencias más grandes",
    examplesIntro:
      "Las diez camisetas donde más dinero separa a la tienda más barata de la más cara. Mismo producto oficial, misma temporada, precio final con envío incluido.",
    colShirt: "Camiseta",
    colCheapest: "Más barata",
    colDearest: "Más cara",
    colGap: "Diferencia",
    storesTitle: "Qué tienda gana más veces",
    storesIntro:
      "De todas las camisetas que vende cada tienda y que además están en otra, cuántas veces es la más barata. Solo tiendas presentes en 10 o más comparaciones.",
    colStore: "Tienda",
    colWins: "Veces más barata",
    colWinPct: "% de victorias",
    brandTitle: "La tienda de la marca no suele ser la más barata",
    brandText:
      "Uno de los resultados más constantes: las tiendas oficiales de las marcas quedan primeras en precio solo en una minoría de los casos. Comprar en la tienda del fabricante da tranquilidad, pero rara vez da el mejor precio.",
    methodTitle: "Cómo se calculó",
    methodIntro:
      "El estudio se recalcula solo con cada actualización del catálogo. Estos son los criterios, elegidos para no inflar el resultado:",
    method1:
      "Solo camisetas de temporada actual. En retro conviven la pieza original de época y la reedición moderna, que no son el mismo producto: compararlas daría diferencias enormes pero falsas.",
    method2:
      "Solo precios en euros. Comparar un precio en dólares contra uno en euros obliga a convertir, y la conversión mete un error que no controlamos.",
    method3:
      "Solo minoristas oficiales. Se excluyen los marketplaces, donde el precio depende del vendedor y del estado del artículo, y las tiendas de réplicas no licenciadas.",
    method4:
      "Precio final, no precio de etiqueta: se suma el envío. Una tienda barata con envío caro puede terminar saliendo más.",
    citeTitle: "Usar estos datos",
    citeText:
      "Los datos son libres de citar. Si los usás en una nota o un artículo, te agradecemos el enlace a esta página, que se actualiza sola y siempre muestra el número vigente.",
    citeLine: "Football Cult, «{title}», datos de {date}.",
  },
  en: {
    title: "How much the same shirt's price changes from store to store",
    metaTitle: "Study: the same shirt costs up to €{max} more depending on the store | Football Cult",
    metaDescription:
      "We analysed {n} official current-season shirts sold by {stores} European stores. The average gap between the cheapest and the dearest is {avg}%.",
    intro:
      "We compare the final price —item plus shipping— of the same official shirt across different stores. These aren't estimates: they're the real prices the stores publish in their own catalogues, recalculated every time the site updates.",
    updated: "Data updated on",
    statAvgGap: "average gap",
    statAvgGapNote: "between the cheapest and the dearest store for the same shirt",
    statOver20: "of the shirts",
    statOver20Note: "have a price gap of 20% or more between stores",
    statMaxGap: "largest gap",
    statMaxGapNote: "found on a single shirt, between two official stores",
    statSamePrice: "cost the same",
    statSamePriceNote: "everywhere they're sold: comparing almost always changes something",
    examplesTitle: "The biggest gaps",
    examplesIntro:
      "The ten shirts where the most money separates the cheapest store from the dearest. Same official product, same season, final price with shipping included.",
    colShirt: "Shirt",
    colCheapest: "Cheapest",
    colDearest: "Dearest",
    colGap: "Gap",
    storesTitle: "Which store wins most often",
    storesIntro:
      "Of all the shirts each store sells that are also sold elsewhere, how often it comes out cheapest. Only stores appearing in 10 or more comparisons.",
    colStore: "Store",
    colWins: "Times cheapest",
    colWinPct: "Win rate",
    brandTitle: "The brand's own store is rarely the cheapest",
    brandText:
      "One of the most consistent findings: the manufacturers' own stores come out cheapest only in a minority of cases. Buying from the brand gives peace of mind, but it rarely gives the best price.",
    methodTitle: "How it was calculated",
    methodIntro:
      "The study recalculates itself with every catalogue update. These are the criteria, chosen so the result isn't inflated:",
    method1:
      "Current-season shirts only. In retro, the genuine period piece and the modern reissue live side by side and aren't the same product: comparing them would produce huge but false gaps.",
    method2:
      "Euro prices only. Comparing a dollar price against a euro one requires converting, and the conversion introduces an error we don't control.",
    method3:
      "Official retailers only. Marketplaces are excluded, where price depends on the seller and the item's condition, as are unlicensed replica shops.",
    method4:
      "Final price, not sticker price: shipping is added. A cheap store with expensive shipping can end up costing more.",
    citeTitle: "Using this data",
    citeText:
      "The data is free to cite. If you use it in an article, we'd appreciate a link to this page, which updates itself and always shows the current figure.",
    citeLine: "Football Cult, “{title}”, data from {date}.",
  },
  pt: {
    title: "Quanto muda o preço da mesma camisa de loja para loja",
    metaTitle: "Estudo: a mesma camisa custa até €{max} a mais dependendo da loja | Football Cult",
    metaDescription:
      "Analisámos {n} camisas oficiais da temporada atual vendidas por {stores} lojas europeias. A diferença média entre a mais barata e a mais cara é de {avg}%.",
    intro:
      "Comparamos o preço final —produto mais portes— da mesma camisa oficial em lojas diferentes. Não são estimativas: são os preços reais que as lojas publicam nos seus próprios catálogos, recalculados sempre que o site é atualizado.",
    updated: "Dados atualizados a",
    statAvgGap: "de diferença média",
    statAvgGapNote: "entre a loja mais barata e a mais cara para a mesma camisa",
    statOver20: "das camisas",
    statOver20Note: "têm uma diferença de preço de 20% ou mais entre lojas",
    statMaxGap: "a maior diferença",
    statMaxGapNote: "encontrada numa só camisa, entre duas lojas oficiais",
    statSamePrice: "custam o mesmo",
    statSamePriceNote: "em todas as lojas onde são vendidas: comparar quase sempre muda algo",
    examplesTitle: "As maiores diferenças",
    examplesIntro:
      "As dez camisas onde mais dinheiro separa a loja mais barata da mais cara. Mesmo produto oficial, mesma temporada, preço final com portes incluídos.",
    colShirt: "Camisa",
    colCheapest: "Mais barata",
    colDearest: "Mais cara",
    colGap: "Diferença",
    storesTitle: "Que loja ganha mais vezes",
    storesIntro:
      "De todas as camisas que cada loja vende e que também estão noutra, quantas vezes é a mais barata. Só lojas presentes em 10 ou mais comparações.",
    colStore: "Loja",
    colWins: "Vezes mais barata",
    colWinPct: "% de vitórias",
    brandTitle: "A loja da marca raramente é a mais barata",
    brandText:
      "Um dos resultados mais constantes: as lojas oficiais das marcas ficam em primeiro no preço apenas numa minoria dos casos. Comprar na loja do fabricante dá tranquilidade, mas raramente dá o melhor preço.",
    methodTitle: "Como foi calculado",
    methodIntro:
      "O estudo recalcula-se sozinho a cada atualização do catálogo. Estes são os critérios, escolhidos para não inflacionar o resultado:",
    method1:
      "Só camisas da temporada atual. No retro convivem a peça original de época e a reedição moderna, que não são o mesmo produto: compará-las daria diferenças enormes mas falsas.",
    method2:
      "Só preços em euros. Comparar um preço em dólares com um em euros obriga a converter, e a conversão introduz um erro que não controlamos.",
    method3:
      "Só retalhistas oficiais. Excluem-se os marketplaces, onde o preço depende do vendedor e do estado do artigo, e as lojas de réplicas não licenciadas.",
    method4:
      "Preço final, não preço de etiqueta: somam-se os portes. Uma loja barata com portes caros pode acabar por sair mais cara.",
    citeTitle: "Usar estes dados",
    citeText:
      "Os dados são livres de citar. Se os usares num artigo, agradecemos a ligação para esta página, que se atualiza sozinha e mostra sempre o número atual.",
    citeLine: "Football Cult, «{title}», dados de {date}.",
  },
  fr: {
    title: "De combien varie le prix du même maillot selon la boutique",
    metaTitle: "Étude : le même maillot coûte jusqu'à {max} € de plus selon la boutique | Football Cult",
    metaDescription:
      "Nous avons analysé {n} maillots officiels de la saison en cours vendus par {stores} boutiques européennes. L'écart moyen entre le moins cher et le plus cher est de {avg} %.",
    intro:
      "Nous comparons le prix final —article plus livraison— du même maillot officiel dans différentes boutiques. Ce ne sont pas des estimations : ce sont les prix réels que les boutiques publient dans leurs propres catalogues, recalculés à chaque mise à jour du site.",
    updated: "Données mises à jour le",
    statAvgGap: "d'écart moyen",
    statAvgGapNote: "entre la boutique la moins chère et la plus chère pour le même maillot",
    statOver20: "des maillots",
    statOver20Note: "présentent un écart de prix de 20 % ou plus entre boutiques",
    statMaxGap: "le plus grand écart",
    statMaxGapNote: "trouvé sur un seul maillot, entre deux boutiques officielles",
    statSamePrice: "coûtent pareil",
    statSamePriceNote: "partout où ils sont vendus : comparer change presque toujours quelque chose",
    examplesTitle: "Les plus gros écarts",
    examplesIntro:
      "Les dix maillots où le plus d'argent sépare la boutique la moins chère de la plus chère. Même produit officiel, même saison, prix final livraison comprise.",
    colShirt: "Maillot",
    colCheapest: "Moins cher",
    colDearest: "Plus cher",
    colGap: "Écart",
    storesTitle: "Quelle boutique gagne le plus souvent",
    storesIntro:
      "Sur tous les maillots que chaque boutique vend et qui sont aussi ailleurs, combien de fois elle est la moins chère. Seulement les boutiques présentes dans 10 comparaisons ou plus.",
    colStore: "Boutique",
    colWins: "Fois la moins chère",
    colWinPct: "% de victoires",
    brandTitle: "La boutique de la marque est rarement la moins chère",
    brandText:
      "L'un des résultats les plus constants : les boutiques officielles des marques n'arrivent en tête sur le prix que dans une minorité de cas. Acheter chez le fabricant rassure, mais donne rarement le meilleur prix.",
    methodTitle: "Comment c'est calculé",
    methodIntro:
      "L'étude se recalcule seule à chaque mise à jour du catalogue. Voici les critères, choisis pour ne pas gonfler le résultat :",
    method1:
      "Uniquement les maillots de la saison en cours. En rétro, la pièce d'époque et la réédition moderne cohabitent et ne sont pas le même produit : les comparer donnerait des écarts énormes mais faux.",
    method2:
      "Uniquement les prix en euros. Comparer un prix en dollars à un prix en euros impose une conversion, qui introduit une erreur que nous ne maîtrisons pas.",
    method3:
      "Uniquement les détaillants officiels. Les marketplaces sont exclues, où le prix dépend du vendeur et de l'état de l'article, ainsi que les boutiques de répliques non licenciées.",
    method4:
      "Prix final, pas prix affiché : la livraison est incluse. Une boutique bon marché avec une livraison chère peut revenir plus cher au total.",
    citeTitle: "Utiliser ces données",
    citeText:
      "Les données sont libres de citation. Si vous les utilisez dans un article, un lien vers cette page est apprécié : elle se met à jour seule et affiche toujours le chiffre en vigueur.",
    citeLine: "Football Cult, « {title} », données du {date}.",
  },
  it: {
    title: "Quanto cambia il prezzo della stessa maglia da negozio a negozio",
    metaTitle: "Studio: la stessa maglia costa fino a {max} € in più a seconda del negozio | Football Cult",
    metaDescription:
      "Abbiamo analizzato {n} maglie ufficiali della stagione in corso vendute da {stores} negozi europei. La differenza media tra la più economica e la più cara è del {avg}%.",
    intro:
      "Confrontiamo il prezzo finale —prodotto più spedizione— della stessa maglia ufficiale in negozi diversi. Non sono stime: sono i prezzi reali che i negozi pubblicano nei propri cataloghi, ricalcolati a ogni aggiornamento del sito.",
    updated: "Dati aggiornati al",
    statAvgGap: "di differenza media",
    statAvgGapNote: "tra il negozio più economico e il più caro per la stessa maglia",
    statOver20: "delle maglie",
    statOver20Note: "hanno una differenza di prezzo del 20% o più tra negozi",
    statMaxGap: "la differenza maggiore",
    statMaxGapNote: "trovata su una sola maglia, tra due negozi ufficiali",
    statSamePrice: "costano uguale",
    statSamePriceNote: "ovunque vengano vendute: confrontare cambia quasi sempre qualcosa",
    examplesTitle: "Le differenze più grandi",
    examplesIntro:
      "Le dieci maglie dove più soldi separano il negozio più economico dal più caro. Stesso prodotto ufficiale, stessa stagione, prezzo finale con spedizione inclusa.",
    colShirt: "Maglia",
    colCheapest: "Più economico",
    colDearest: "Più caro",
    colGap: "Differenza",
    storesTitle: "Quale negozio vince più spesso",
    storesIntro:
      "Di tutte le maglie che ogni negozio vende e che sono anche altrove, quante volte è il più economico. Solo negozi presenti in 10 o più confronti.",
    colStore: "Negozio",
    colWins: "Volte più economico",
    colWinPct: "% di vittorie",
    brandTitle: "Il negozio del marchio raramente è il più economico",
    brandText:
      "Uno dei risultati più costanti: i negozi ufficiali dei marchi risultano primi sul prezzo solo in una minoranza di casi. Comprare dal produttore dà tranquillità, ma raramente dà il prezzo migliore.",
    methodTitle: "Come è stato calcolato",
    methodIntro:
      "Lo studio si ricalcola da solo a ogni aggiornamento del catalogo. Questi sono i criteri, scelti per non gonfiare il risultato:",
    method1:
      "Solo maglie della stagione in corso. Nel retro convivono il pezzo originale d'epoca e la riedizione moderna, che non sono lo stesso prodotto: confrontarli darebbe differenze enormi ma false.",
    method2:
      "Solo prezzi in euro. Confrontare un prezzo in dollari con uno in euro obbliga a convertire, e la conversione introduce un errore che non controlliamo.",
    method3:
      "Solo rivenditori ufficiali. Sono esclusi i marketplace, dove il prezzo dipende dal venditore e dalle condizioni dell'articolo, e i negozi di repliche non ufficiali.",
    method4:
      "Prezzo finale, non prezzo di listino: la spedizione è inclusa. Un negozio economico con spedizione cara può costare di più alla fine.",
    citeTitle: "Usare questi dati",
    citeText:
      "I dati sono liberi da citare. Se li usi in un articolo, ti saremmo grati per un link a questa pagina, che si aggiorna da sola e mostra sempre il dato attuale.",
    citeLine: "Football Cult, «{title}», dati del {date}.",
  },
};
