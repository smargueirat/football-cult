import type { HubLocale } from "@/data/teamMeta";

// Guías de compra (contenido propio, evergreen). Solo afirmaciones generales
// ciertas para cualquier camiseta de fútbol: nada de historias por producto
// ni datos inventados. Cada guía tiene su versión en los 5 idiomas.
export interface GuideSection {
  h: string;
  p: string[];
}
export interface Guide {
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
}

export const GUIDE_SLUGS = ["camiseta-original", "talle-fan-vs-jugador"] as const;
export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export const GUIDES: Record<GuideSlug, Record<HubLocale, Guide>> = {
  "camiseta-original": {
    es: {
      title: "Cómo saber si una camiseta de fútbol es original",
      description: "Qué revisar antes de comprar: etiquetas, código de producto, costuras, escudo, precio y vendedor. Guía práctica para no comprar una falsificación.",
      intro: "Una camiseta oficial tiene detalles que una copia rara vez iguala. Ninguno es infalible por separado, pero juntos dan una idea muy clara. Esto es lo que conviene revisar antes de comprar.",
      sections: [
        { h: "1. Empezá por el vendedor", p: ["El punto más fiable no está en la camiseta sino en quién la vende. Las tiendas oficiales del club, de la marca (adidas, Nike, Puma…) y los comercios deportivos reconocidos venden producto licenciado. En marketplaces y tiendas desconocidas, leé la ficha con más cuidado y revisá las valoraciones y la política de devolución.", "En nuestras comparaciones cada oferta muestra el nombre real de la tienda: fijate siempre quién vende antes de hacer clic."] },
        { h: "2. El precio cuenta", p: ["Una camiseta de la temporada actual a la mitad del precio oficial o menos es una señal de alarma. Las rebajas reales existen, sobre todo con temporadas anteriores, pero un descuento enorme en un modelo recién salido casi nunca es legítimo."] },
        { h: "3. Etiquetas y código de producto", p: ["Las camisetas oficiales llevan una etiqueta interior con el código de producto (por ejemplo, una combinación de letras y números de la marca). Buscá ese código en la web oficial de la marca: tiene que corresponder al mismo modelo y color.", "Revisá también la etiqueta de composición y las de lavado: en las originales están impresas o cosidas con limpieza, en las copias suelen verse borrosas o con errores de idioma."] },
        { h: "4. Escudo, logo y costuras", p: ["En las versiones de jugador el escudo y el logo suelen ir termosellados, con bordes limpios y sin restos de pegamento. En las versiones de hincha pueden ir bordados. Costuras torcidas, hilos sueltos o un escudo con proporciones raras son mala señal.", "Compará con las fotos de la web oficial del club: colores, franjas y patrocinadores tienen que coincidir exactamente."] },
        { h: "5. Tejido y ajuste", p: ["El material de una camiseta oficial se siente técnico y ligero; los tejidos gruesos, brillantes o que no transpiran suelen delatar una copia. Si el vendedor permite devolver, es la mejor forma de comprobarlo en mano."] },
        { h: "6. Qué hacer si dudás", p: ["Pagá con un método que te proteja (tarjeta o plataforma con protección al comprador), guardá las capturas de la publicación y pedí factura. Si la camiseta llega y no es lo que esperabas, reclamá dentro del plazo de devolución."] },
      ],
    },
    en: {
      title: "How to tell if a football shirt is genuine",
      description: "What to check before you buy: labels, product code, stitching, crest, price and seller. A practical guide to avoid fake shirts.",
      intro: "An official shirt has details that a copy rarely matches. None is foolproof on its own, but together they give a clear picture. Here is what to check before you buy.",
      sections: [
        { h: "1. Start with the seller", p: ["The most reliable clue is not on the shirt but in who sells it. Official club and brand stores (adidas, Nike, Puma…) and well-known sports retailers sell licensed products. On marketplaces and unfamiliar shops, read the listing carefully and check reviews and the returns policy.", "In our comparisons every offer shows the real store name: always look at who is selling before you click."] },
        { h: "2. Price matters", p: ["A current-season shirt at half the official price or less is a red flag. Real sales exist, especially on older seasons, but a huge discount on a brand-new kit is almost never legitimate."] },
        { h: "3. Labels and product code", p: ["Official shirts carry an inner label with a product code (a mix of letters and numbers from the brand). Look that code up on the brand's official site: it should match the same model and colour.", "Also check the composition and care labels: on genuine shirts they are cleanly printed or sewn, on copies they are often blurry or contain language mistakes."] },
        { h: "4. Crest, logo and stitching", p: ["On player versions the crest and logo are usually heat-sealed, with clean edges and no glue residue. On fan versions they may be embroidered. Crooked stitching, loose threads or a crest with odd proportions are bad signs.", "Compare with photos on the club's official site: colours, stripes and sponsors must match exactly."] },
        { h: "5. Fabric and fit", p: ["An official shirt feels technical and light; thick, shiny or non-breathable fabric often gives a copy away. If the seller accepts returns, that is the best way to check it in hand."] },
        { h: "6. If you are unsure", p: ["Pay with a method that protects you (card or a platform with buyer protection), keep screenshots of the listing and ask for an invoice. If the shirt arrives and is not what you expected, claim within the return window."] },
      ],
    },
    pt: {
      title: "Como saber se uma camisa de futebol é original",
      description: "O que conferir antes de comprar: etiquetas, código do produto, costuras, escudo, preço e vendedor. Guia prático para não comprar falsificação.",
      intro: "Uma camisa oficial tem detalhes que uma cópia raramente iguala. Nenhum é infalível sozinho, mas juntos dão uma ideia bem clara. Veja o que conferir antes de comprar.",
      sections: [
        { h: "1. Comece pelo vendedor", p: ["A pista mais confiável não está na camisa, e sim em quem a vende. Lojas oficiais do clube e da marca (adidas, Nike, Puma…) e lojas esportivas conhecidas vendem produto licenciado. Em marketplaces e lojas desconhecidas, leia o anúncio com mais cuidado e veja avaliações e política de devolução.", "Nas nossas comparações cada oferta mostra o nome real da loja: sempre veja quem está vendendo antes de clicar."] },
        { h: "2. O preço conta", p: ["Uma camisa da temporada atual pela metade do preço oficial ou menos é sinal de alerta. Promoções reais existem, sobretudo em temporadas antigas, mas um desconto enorme num modelo recém-lançado quase nunca é legítimo."] },
        { h: "3. Etiquetas e código do produto", p: ["As camisas oficiais trazem uma etiqueta interna com o código do produto (letras e números da marca). Procure esse código no site oficial da marca: ele deve corresponder ao mesmo modelo e cor.", "Confira também as etiquetas de composição e lavagem: nas originais são bem impressas ou costuradas; nas cópias costumam ficar borradas ou com erros de idioma."] },
        { h: "4. Escudo, logo e costuras", p: ["Nas versões jogador, o escudo e o logo costumam ser termocolados, com bordas limpas e sem resto de cola. Nas versões torcedor podem ser bordados. Costuras tortas, fios soltos ou um escudo com proporções estranhas são mau sinal.", "Compare com as fotos do site oficial do clube: cores, listras e patrocinadores devem coincidir exatamente."] },
        { h: "5. Tecido e caimento", p: ["O material de uma camisa oficial parece técnico e leve; tecidos grossos, brilhantes ou que não respiram costumam denunciar uma cópia. Se o vendedor aceita devolução, é a melhor forma de conferir em mãos."] },
        { h: "6. Se ficar em dúvida", p: ["Pague com um método que te proteja (cartão ou plataforma com proteção ao comprador), guarde capturas do anúncio e peça nota fiscal. Se a camisa chegar diferente do esperado, reclame dentro do prazo de devolução."] },
      ],
    },
    fr: {
      title: "Comment savoir si un maillot de football est authentique",
      description: "Ce qu'il faut vérifier avant d'acheter : étiquettes, code produit, coutures, écusson, prix et vendeur. Guide pratique pour éviter les contrefaçons.",
      intro: "Un maillot officiel a des détails qu'une copie reproduit rarement. Aucun n'est infaillible seul, mais ensemble ils donnent une idée très claire. Voici quoi vérifier avant d'acheter.",
      sections: [
        { h: "1. Commencez par le vendeur", p: ["L'indice le plus fiable n'est pas sur le maillot mais chez celui qui le vend. Les boutiques officielles des clubs et des marques (adidas, Nike, Puma…) et les enseignes de sport reconnues vendent du produit sous licence. Sur les places de marché et les boutiques inconnues, lisez l'annonce avec attention et vérifiez les avis et la politique de retour.", "Dans nos comparatifs, chaque offre affiche le vrai nom de la boutique : regardez toujours qui vend avant de cliquer."] },
        { h: "2. Le prix compte", p: ["Un maillot de la saison en cours à moitié prix ou moins est un signal d'alerte. De vraies promotions existent, surtout sur les anciennes saisons, mais une énorme remise sur un modèle tout juste sorti est presque jamais légitime."] },
        { h: "3. Étiquettes et code produit", p: ["Les maillots officiels portent une étiquette intérieure avec un code produit (lettres et chiffres de la marque). Cherchez ce code sur le site officiel de la marque : il doit correspondre au même modèle et à la même couleur.", "Vérifiez aussi les étiquettes de composition et d'entretien : sur les originaux elles sont nettes, sur les copies elles sont souvent floues ou comportent des fautes."] },
        { h: "4. Écusson, logo et coutures", p: ["Sur les versions joueur, l'écusson et le logo sont généralement thermocollés, aux bords nets et sans trace de colle. Sur les versions supporter, ils peuvent être brodés. Des coutures de travers, des fils qui dépassent ou un écusson aux proportions étranges sont de mauvais signes.", "Comparez avec les photos du site officiel du club : couleurs, rayures et sponsors doivent correspondre exactement."] },
        { h: "5. Tissu et coupe", p: ["Le tissu d'un maillot officiel paraît technique et léger ; un tissu épais, brillant ou qui respire mal trahit souvent une copie. Si le vendeur accepte les retours, c'est le meilleur moyen de vérifier en main."] },
        { h: "6. En cas de doute", p: ["Payez avec un moyen qui vous protège (carte ou plateforme avec protection acheteur), gardez des captures de l'annonce et demandez une facture. Si le maillot arrive et ne correspond pas, faites une réclamation dans le délai de retour."] },
      ],
    },
    it: {
      title: "Come capire se una maglia da calcio è originale",
      description: "Cosa controllare prima di comprare: etichette, codice prodotto, cuciture, stemma, prezzo e venditore. Guida pratica per evitare i falsi.",
      intro: "Una maglia ufficiale ha dettagli che una copia raramente eguaglia. Nessuno è infallibile da solo, ma insieme danno un'idea molto chiara. Ecco cosa controllare prima di acquistare.",
      sections: [
        { h: "1. Parti dal venditore", p: ["L'indizio più affidabile non è sulla maglia ma in chi la vende. Gli store ufficiali dei club e dei marchi (adidas, Nike, Puma…) e i negozi sportivi noti vendono prodotto su licenza. Su marketplace e negozi sconosciuti leggi l'annuncio con più attenzione e controlla recensioni e politica di reso.", "Nei nostri confronti ogni offerta mostra il vero nome del negozio: guarda sempre chi vende prima di cliccare."] },
        { h: "2. Il prezzo conta", p: ["Una maglia della stagione in corso a metà del prezzo ufficiale o meno è un campanello d'allarme. I saldi veri esistono, soprattutto sulle stagioni passate, ma un grosso sconto su un modello appena uscito non è quasi mai legittimo."] },
        { h: "3. Etichette e codice prodotto", p: ["Le maglie ufficiali hanno un'etichetta interna con un codice prodotto (lettere e numeri del marchio). Cerca quel codice sul sito ufficiale del marchio: deve corrispondere allo stesso modello e colore.", "Controlla anche le etichette di composizione e lavaggio: negli originali sono nitide, nelle copie spesso sfocate o con errori di lingua."] },
        { h: "4. Stemma, logo e cuciture", p: ["Nelle versioni giocatore stemma e logo sono in genere termosaldati, con bordi netti e senza residui di colla. Nelle versioni tifoso possono essere ricamati. Cuciture storte, fili sfilacciati o uno stemma dalle proporzioni strane sono un cattivo segno.", "Confronta con le foto del sito ufficiale del club: colori, righe e sponsor devono coincidere esattamente."] },
        { h: "5. Tessuto e vestibilità", p: ["Il tessuto di una maglia ufficiale è tecnico e leggero; un tessuto spesso, lucido o poco traspirante spesso tradisce una copia. Se il venditore accetta resi, è il modo migliore per verificarlo di persona."] },
        { h: "6. Se hai dubbi", p: ["Paga con un metodo che ti tuteli (carta o piattaforma con protezione acquirenti), conserva gli screenshot dell'annuncio e chiedi la fattura. Se la maglia arriva e non è come previsto, reclama entro il periodo di reso."] },
      ],
    },
  },
  "talle-fan-vs-jugador": {
    es: {
      title: "Qué talle elegir: versión de hincha vs versión de jugador",
      description: "Diferencias entre la versión fan (réplica) y la de jugador (authentic), cómo medir y cómo elegir talle para que la camiseta te quede bien.",
      intro: "Muchas camisetas se venden en dos versiones con el mismo diseño pero distinto corte, tejido y precio. Elegir bien el talle depende de cuál compres.",
      sections: [
        { h: "Versión de hincha (fan, réplica o \"stadium\")", p: ["Es la versión pensada para el uso diario y la grada. Tiene un corte más suelto, materiales resistentes y suele llevar escudo y patrocinadores bordados o serigrafiados. Es la más económica."] },
        { h: "Versión de jugador (authentic, match o \"player issue\")", p: ["Es la equivalente a la que usan los futbolistas. Tiene corte ajustado, tejidos más livianos con zonas de ventilación y detalles como escudos termosellados. Cuesta bastante más y queda pegada al cuerpo."] },
        { h: "Cómo medirte", p: ["Medí el contorno de pecho a la altura de las axilas y el largo que te gusta desde el hombro. Compará con la tabla de tallas de la tienda, porque cada marca y cada versión tiene la suya.", "Un truco útil: extendé sobre una mesa una camiseta que ya te quede bien y medí de axila a axila; ese ancho es tu referencia."] },
        { h: "Cómo elegir el talle", p: ["En versión de hincha, tu talle habitual suele ir bien; si preferís un calce amplio, subí uno.", "En versión de jugador, si estás entre dos talles, elegí el más grande: el corte es ajustado y no perdona."] },
        { h: "Cuidado y encogimiento", p: ["Lavá del revés, con agua fría y sin secadora; el calor deforma los estampados y puede encoger el tejido. Así la camiseta mantiene el talle que elegiste."] },
        { h: "Niños y mujer", p: ["Las camisetas de niño y de mujer tienen tablas propias. No uses la equivalencia de adulto: comprobá siempre la tabla de esa versión."] },
      ],
    },
    en: {
      title: "Which size to pick: fan version vs player version",
      description: "Differences between the fan (replica) and player (authentic) versions, how to measure and how to choose a size so your shirt fits.",
      intro: "Many shirts come in two versions with the same design but a different cut, fabric and price. Picking the right size depends on which one you buy.",
      sections: [
        { h: "Fan version (replica or \"stadium\")", p: ["This is the version made for everyday wear and the stands. It has a looser cut, durable materials and usually embroidered or printed crest and sponsors. It is the cheaper one."] },
        { h: "Player version (authentic, match or \"player issue\")", p: ["The equivalent of what the players wear. It has a slim cut, lighter fabrics with ventilation zones and details such as heat-sealed badges. It costs noticeably more and fits close to the body."] },
        { h: "How to measure", p: ["Measure your chest around the underarms and the length you like from the shoulder. Compare with the store's size chart, because each brand and each version has its own.", "A useful trick: lay a shirt that already fits you flat on a table and measure from underarm to underarm; that width is your reference."] },
        { h: "How to choose", p: ["On the fan version your usual size normally works; if you prefer a roomy fit, go up one.", "On the player version, if you are between two sizes pick the larger one: the cut is slim and unforgiving."] },
        { h: "Care and shrinkage", p: ["Wash inside out, in cold water and without a dryer; heat deforms prints and can shrink the fabric. That way the shirt keeps the size you chose."] },
        { h: "Kids and women", p: ["Kids' and women's shirts have their own charts. Do not use the adult equivalent: always check the chart for that version."] },
      ],
    },
    pt: {
      title: "Qual tamanho escolher: versão torcedor ou versão jogador",
      description: "Diferenças entre a versão torcedor (réplica) e a de jogador (authentic), como medir e como escolher o tamanho para a camisa servir bem.",
      intro: "Muitas camisas são vendidas em duas versões com o mesmo design, mas corte, tecido e preço diferentes. Escolher bem o tamanho depende de qual você compra.",
      sections: [
        { h: "Versão torcedor (réplica ou \"stadium\")", p: ["É a versão pensada para o uso diário e para a arquibancada. Tem corte mais solto, materiais resistentes e costuma trazer escudo e patrocinadores bordados ou estampados. É a mais barata."] },
        { h: "Versão jogador (authentic, match ou \"player issue\")", p: ["É a equivalente à que os jogadores usam. Tem corte justo, tecidos mais leves com áreas de ventilação e detalhes como escudos termocolados. Custa bem mais e fica junto ao corpo."] },
        { h: "Como se medir", p: ["Meça o contorno do peito na altura das axilas e o comprimento que você gosta a partir do ombro. Compare com a tabela de tamanhos da loja, pois cada marca e cada versão tem a sua.", "Um truque útil: estenda sobre uma mesa uma camisa que já te sirva e meça de axila a axila; essa largura é a sua referência."] },
        { h: "Como escolher", p: ["Na versão torcedor, o seu tamanho habitual costuma servir; se preferir folga, suba um.", "Na versão jogador, se estiver entre dois tamanhos, escolha o maior: o corte é justo e não perdoa."] },
        { h: "Cuidados e encolhimento", p: ["Lave do avesso, com água fria e sem secadora; o calor deforma as estampas e pode encolher o tecido. Assim a camisa mantém o tamanho escolhido."] },
        { h: "Infantil e feminina", p: ["Camisas infantis e femininas têm tabelas próprias. Não use a equivalência de adulto: confira sempre a tabela dessa versão."] },
      ],
    },
    fr: {
      title: "Quelle taille choisir : version supporter ou version joueur",
      description: "Différences entre la version supporter (réplique) et la version joueur (authentic), comment se mesurer et choisir sa taille pour que le maillot tombe bien.",
      intro: "Beaucoup de maillots existent en deux versions au même design mais à la coupe, au tissu et au prix différents. Bien choisir sa taille dépend de celle que vous achetez.",
      sections: [
        { h: "Version supporter (réplique ou \"stadium\")", p: ["C'est la version pensée pour un usage quotidien et pour les tribunes. Coupe plus ample, matières résistantes, écusson et sponsors généralement brodés ou imprimés. C'est la moins chère."] },
        { h: "Version joueur (authentic, match ou \"player issue\")", p: ["L'équivalent de celle que portent les joueurs. Coupe ajustée, tissus plus légers avec zones de ventilation et détails comme des écussons thermocollés. Elle coûte nettement plus cher et se porte près du corps."] },
        { h: "Comment se mesurer", p: ["Mesurez votre tour de poitrine sous les aisselles et la longueur souhaitée depuis l'épaule. Comparez avec le guide des tailles de la boutique : chaque marque et chaque version a le sien.", "Une astuce : posez à plat un maillot qui vous va déjà et mesurez d'une aisselle à l'autre ; cette largeur est votre référence."] },
        { h: "Comment choisir", p: ["En version supporter, votre taille habituelle convient généralement ; pour une coupe ample, prenez une taille au-dessus.", "En version joueur, si vous hésitez entre deux tailles, prenez la plus grande : la coupe est ajustée et ne pardonne pas."] },
        { h: "Entretien et rétrécissement", p: ["Lavez à l'envers, à l'eau froide et sans sèche-linge ; la chaleur déforme les impressions et peut faire rétrécir le tissu. Le maillot garde ainsi la taille choisie."] },
        { h: "Enfant et femme", p: ["Les maillots enfant et femme ont leurs propres tableaux. N'utilisez pas l'équivalence adulte : vérifiez toujours le tableau de cette version."] },
      ],
    },
    it: {
      title: "Quale taglia scegliere: versione tifoso o versione giocatore",
      description: "Differenze tra la versione tifoso (replica) e quella giocatore (authentic), come misurarsi e come scegliere la taglia perché la maglia calzi bene.",
      intro: "Molte maglie si vendono in due versioni con lo stesso design ma taglio, tessuto e prezzo diversi. Scegliere bene la taglia dipende da quale acquisti.",
      sections: [
        { h: "Versione tifoso (replica o \"stadium\")", p: ["È la versione pensata per l'uso quotidiano e per la curva. Taglio più morbido, materiali resistenti e in genere stemma e sponsor ricamati o stampati. È la più economica."] },
        { h: "Versione giocatore (authentic, match o \"player issue\")", p: ["L'equivalente di quella che indossano i calciatori. Taglio aderente, tessuti più leggeri con zone di ventilazione e dettagli come gli stemmi termosaldati. Costa nettamente di più e veste vicino al corpo."] },
        { h: "Come misurarsi", p: ["Misura il torace all'altezza delle ascelle e la lunghezza che preferisci dalla spalla. Confronta con la tabella taglie del negozio: ogni marchio e ogni versione ha la sua.", "Un trucco utile: stendi su un tavolo una maglia che ti sta già bene e misura da ascella ad ascella; quella larghezza è il tuo riferimento."] },
        { h: "Come scegliere", p: ["Nella versione tifoso di solito va bene la tua taglia abituale; se preferisci una vestibilità comoda, sali di una.", "Nella versione giocatore, se sei tra due taglie scegli la più grande: il taglio è aderente e non perdona."] },
        { h: "Cura e restringimento", p: ["Lava al rovescio, in acqua fredda e senza asciugatrice; il calore deforma le stampe e può restringere il tessuto. Così la maglia mantiene la taglia scelta."] },
        { h: "Bambino e donna", p: ["Le maglie da bambino e da donna hanno tabelle proprie. Non usare l'equivalenza adulto: controlla sempre la tabella di quella versione."] },
      ],
    },
  },
};

export { GUIDE_UI } from "./guideUi";
