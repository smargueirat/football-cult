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

export const GUIDE_SLUGS = [
  "camiseta-original",
  "talle-fan-vs-jugador",
  "tapones-botas-segun-terreno",
  "que-es-una-camiseta-retro",
] as const;
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
  "tapones-botas-segun-terreno": {
    es: {
      title: "Qué tapones de botas de fútbol usar según el terreno",
      description: "FG, AG, SG, TF, MG: qué significa cada código de tapón y cuándo conviene cada uno según la cancha donde jugás.",
      intro: "El tapón -la suela con los tacos- es lo que decide si tenés agarre real en la cancha, no solo un detalle de diseño. Usar el tapón equivocado para el terreno reduce la tracción y puede ser incómodo o inseguro. Esto es lo que significa cada código.",
      sections: [
        { h: "FG · Firme", p: ["Firm Ground (Terreno Firme): césped natural seco o ligeramente húmedo y compacto.", "Es el tapón más común: cubre la mayoría de las canchas de césped natural en buen estado, el terreno más habitual tanto en ligas amateur como profesionales."] },
        { h: "AG · Sintético", p: ["Artificial Grass (Césped Sintético): pensado para césped artificial moderno (3G/4G).", "El sintético es más abrasivo y compacto que el césped natural: una bota FG usada ahí se desgasta más rápido y pierde tracción antes de tiempo. Si jugás sobre todo en sintético, conviene buscar el código AG."] },
        { h: "SG · Blando", p: ["Soft Ground (Terreno Blando): césped natural muy mojado, embarrado o con barro abundante.", "Tiene tapones más largos, en algunos modelos removibles, pensados para clavarse en barro. Es el menos común de encontrar en catálogo hoy porque cada vez se juega menos en canchas así."] },
        { h: "TF · Turf/Moqueta", p: ["Turf / Moqueta: pensada para moqueta sintética, cemento pulido o campos de tierra dura.", "En vez de tapones largos tiene decenas de tacos chicos, la suela típica del fútbol 5 o 7. Usar una bota de tapones largos (FG o SG) sobre estas superficies es incómodo y la gasta antes de tiempo."] },
        { h: "MG · Múltiple", p: ["Multi-Ground (Terreno Múltiple): un híbrido pensado para césped natural duro y césped artificial.", "Es una opción práctica si jugás en canchas mixtas o no sabés de antemano en qué superficie vas a jugar, aunque suele rendir un poco menos que una bota específica para cada terreno."] },
        { h: "Botas homologadas para más de un terreno", p: ["Algunos modelos vienen certificados para dos superficies a la vez (por ejemplo FG/AG), pensados para quien juega tanto en césped natural como sintético sin comprar dos pares distintos.", "En el catálogo de botas podés filtrar directamente por terreno para ver solo los modelos que sirven para tu cancha."] },
      ],
    },
    en: {
      title: "Which football boot studs to use for each surface",
      description: "FG, AG, SG, TF, MG: what each stud code means and when to use each one depending on the pitch you play on.",
      intro: "The studs -the sole with the cleats- are what actually give you grip on the pitch, not just a design detail. Wearing the wrong studs for the surface means less traction, and can be uncomfortable or even unsafe. Here's what each code means.",
      sections: [
        { h: "FG · Firm Ground", p: ["Firm Ground: dry or slightly damp, compact natural grass.", "The most common stud type: it covers most natural grass pitches in good condition, the surface used in most amateur and professional leagues."] },
        { h: "AG · Artificial Grass", p: ["Artificial Grass: built for modern synthetic turf (3G/4G).", "Synthetic surfaces are more abrasive and compact than natural grass -- FG boots worn there wear out faster and lose grip sooner. If you mostly play on synthetic turf, look for the AG code."] },
        { h: "SG · Soft Ground", p: ["Soft Ground: very wet, muddy natural grass.", "Longer studs, removable on some models, built to dig into mud. The rarest to find in the catalog today, since fewer pitches are in this condition."] },
        { h: "TF · Turf", p: ["Turf: built for synthetic carpet, polished concrete or hard dirt pitches.", "Instead of long studs, it has dozens of small rubber nubs -- the typical sole for 5-a-side/7-a-side football. Wearing long studs (FG or SG) on these surfaces is uncomfortable and wears them out fast."] },
        { h: "MG · Multi-Ground", p: ["Multi-Ground: a hybrid built for hard natural grass and artificial turf.", "A practical option if you play on mixed pitches or don't know in advance what surface you'll be on, though it usually performs a bit worse than a boot built for one specific surface."] },
        { h: "Boots rated for more than one surface", p: ["Some models are certified for two surfaces at once (FG/AG, for example), built for players who play on both natural and synthetic grass without buying two separate pairs.", "In the boots catalog you can filter directly by surface to see only the models that work for your pitch."] },
      ],
    },
    pt: {
      title: "Que travas de chuteira usar de acordo com o terreno",
      description: "FG, AG, SG, TF, MG: o que cada código de trava significa e quando usar cada uma de acordo com o campo onde você joga.",
      intro: "A trava -a sola com os pinos- é o que realmente garante aderência no campo, não é só um detalhe de design. Usar a trava errada para o terreno reduz a tração e pode ser desconfortável ou até perigoso. Veja o que significa cada código.",
      sections: [
        { h: "FG · Firme", p: ["Firm Ground (Terreno Firme): grama natural seca ou levemente úmida e compacta.", "É a trava mais comum: cobre a maioria dos campos de grama natural em bom estado, o terreno mais comum tanto no amador quanto no profissional."] },
        { h: "AG · Sintético", p: ["Artificial Grass (Grama Sintética): feita para grama sintética moderna (3G/4G).", "O sintético é mais abrasivo e compacto que a grama natural -- uma chuteira FG usada ali se desgasta mais rápido e perde aderência antes do tempo. Se você joga principalmente em sintético, procure o código AG."] },
        { h: "SG · Macio", p: ["Soft Ground (Terreno Macio): grama natural muito molhada, encharcada ou com bastante barro.", "Tem travas mais longas, removíveis em alguns modelos, feitas para se cravar no barro. É a menos comum de encontrar no catálogo hoje, já que cada vez menos campos ficam nesse estado."] },
        { h: "TF · Society/Moqueta", p: ["Turf / Moqueta: feita para grama sintética curta, cimento liso ou terra batida.", "Em vez de travas longas, tem dezenas de pinos pequenos, a sola típica do futsal/society. Usar travas longas (FG ou SG) nessas superfícies é desconfortável e desgasta a chuteira antes do tempo."] },
        { h: "MG · Múltiplo", p: ["Multi-Ground (Terreno Múltiplo): um híbrido feito para grama natural dura e grama artificial.", "Uma opção prática se você joga em campos mistos ou não sabe de antemão em qual superfície vai jogar, embora costume render um pouco menos que uma chuteira específica para cada terreno."] },
        { h: "Chuteiras homologadas para mais de um terreno", p: ["Alguns modelos vêm certificados para duas superfícies ao mesmo tempo (FG/AG, por exemplo), feitos para quem joga tanto em grama natural quanto sintética sem precisar comprar dois pares.", "No catálogo de chuteiras você pode filtrar diretamente por terreno para ver só os modelos que servem para o seu campo."] },
      ],
    },
    fr: {
      title: "Quels crampons de chaussures de foot choisir selon le terrain",
      description: "FG, AG, SG, TF, MG : ce que signifie chaque code de crampon et quand utiliser lequel selon le terrain sur lequel vous jouez.",
      intro: "Les crampons -la semelle avec les picots- sont ce qui donne une vraie accroche sur le terrain, pas juste un détail de design. Se tromper de crampons pour le terrain réduit l'adhérence et peut être inconfortable, voire dangereux. Voici ce que signifie chaque code.",
      sections: [
        { h: "FG · Terrain ferme", p: ["Firm Ground (Terrain Ferme) : pelouse naturelle sèche ou légèrement humide et compacte.", "Le crampon le plus courant : il couvre la majorité des terrains en pelouse naturelle en bon état, la surface la plus fréquente en amateur comme en professionnel."] },
        { h: "AG · Synthétique", p: ["Artificial Grass (Gazon Synthétique) : conçu pour le gazon synthétique moderne (3G/4G).", "Le synthétique est plus abrasif et compact que la pelouse naturelle -- des chaussures FG utilisées dessus s'usent plus vite et perdent leur adhérence prématurément. Si vous jouez surtout sur synthétique, cherchez le code AG."] },
        { h: "SG · Terrain souple", p: ["Soft Ground (Terrain Souple) : pelouse naturelle très humide, boueuse ou détrempée.", "Crampons plus longs, amovibles sur certains modèles, conçus pour s'enfoncer dans la boue. Le moins courant à trouver dans le catalogue aujourd'hui, ces terrains étant de plus en plus rares."] },
        { h: "TF · Turf/Moquette", p: ["Turf / Moquette : conçu pour moquette synthétique, béton lisse ou terrains en terre battue dure.", "Au lieu de longs crampons, une semelle avec des dizaines de petits picots, typique du foot à 5 ou 7. Porter des crampons longs (FG ou SG) sur ces surfaces est inconfortable et les use prématurément."] },
        { h: "MG · Multi-terrain", p: ["Multi-Ground (Terrain Multiple) : un hybride conçu pour la pelouse naturelle dure et le gazon artificiel.", "Une option pratique si vous jouez sur des terrains mixtes ou ne savez pas à l'avance sur quelle surface vous jouerez, même si les performances sont généralement un peu en retrait par rapport à une chaussure dédiée à un seul terrain."] },
        { h: "Des chaussures homologuées pour plusieurs terrains", p: ["Certains modèles sont certifiés pour deux surfaces à la fois (FG/AG par exemple), pensés pour ceux qui jouent aussi bien sur pelouse naturelle que synthétique sans acheter deux paires différentes.", "Dans le catalogue de chaussures, vous pouvez filtrer directement par terrain pour ne voir que les modèles adaptés à votre terrain."] },
      ],
    },
    it: {
      title: "Quali tacchetti scegliere per ogni terreno di gioco",
      description: "FG, AG, SG, TF, MG: cosa significa ogni codice di tacchetto e quando usarlo in base al campo su cui giochi.",
      intro: "I tacchetti -la suola con i chiodi- sono ciò che davvero garantisce la presa sul campo, non solo un dettaglio estetico. Usare il tacchetto sbagliato per il terreno riduce la trazione e può essere scomodo o addirittura rischioso. Ecco cosa significa ogni codice.",
      sections: [
        { h: "FG · Terreno Fermo", p: ["Firm Ground (Terreno Fermo): erba naturale asciutta o leggermente umida e compatta.", "Il tacchetto più comune: copre la maggior parte dei campi in erba naturale in buone condizioni, il terreno più diffuso sia nel dilettantismo che nel professionismo."] },
        { h: "AG · Sintetico", p: ["Artificial Grass (Erba Sintetica): pensato per l'erba sintetica moderna (3G/4G).", "Il sintetico è più abrasivo e compatto dell'erba naturale: una scarpa FG usata lì si consuma più in fretta e perde aderenza prima del previsto. Se giochi soprattutto su sintetico, cerca il codice AG."] },
        { h: "SG · Terreno Morbido", p: ["Soft Ground (Terreno Morbido): erba naturale molto bagnata, fangosa o con fango abbondante.", "Ha tacchetti più lunghi, removibili in alcuni modelli, pensati per affondare nel fango. È il meno comune da trovare oggi nel catalogo, perché si gioca sempre meno su campi così."] },
        { h: "TF · Turf/Moquette", p: ["Turf / Moquette: pensato per moquette sintetica, cemento levigato o campi in terra battuta dura.", "Invece di tacchetti lunghi ha decine di piccoli tacchetti, la suola tipica del calcio a 5 o 7. Usare tacchetti lunghi (FG o SG) su queste superfici è scomodo e li consuma prima del tempo."] },
        { h: "MG · Multi-terreno", p: ["Multi-Ground (Terreno Multiplo): un ibrido pensato per erba naturale dura ed erba artificiale.", "Un'opzione pratica se giochi su campi misti o non sai in anticipo su quale superficie giocherai, anche se di solito rende un po' meno di una scarpa specifica per ogni terreno."] },
        { h: "Scarpe omologate per più di un terreno", p: ["Alcuni modelli sono certificati per due superfici contemporaneamente (ad esempio FG/AG), pensati per chi gioca sia su erba naturale che sintetica senza comprare due paia diverse.", "Nel catalogo delle scarpe puoi filtrare direttamente per terreno per vedere solo i modelli adatti al tuo campo."] },
      ],
    },
  },
  "que-es-una-camiseta-retro": {
    es: {
      title: "Qué es (y qué no es) una camiseta retro",
      description: "Por qué llamamos \"retro\" a una camiseta y a partir de qué temporada, réplica vs versión de época, y cómo evitar comprar una reedición moderna pensando que es vintage.",
      intro: "En el fútbol \"retro\" se usa para casi cualquier diseño antiguo, pero acá tiene un criterio fijo: temporada 2006/07 o anterior. Esto es lo que significa en la práctica y qué conviene mirar antes de comprar.",
      sections: [
        { h: "Nuestro criterio: temporada 2006/07 o anterior", p: ["Marcamos como retro cualquier camiseta cuya temporada real sea 2006/07 o más vieja. No es una opinión de gusto: muchas marcas reeditan diseños clásicos de los 90 o 2000 en temporadas recientes (2022/23, 2024/25...), y esas reediciones NO cuentan como retro acá aunque el diseño sea idéntico al original.", "La temporada real de cada camiseta figura siempre en la ficha del producto -- fijate esa fecha, no solo el diseño."] },
        { h: "Reedición moderna vs original de época", p: ["Una reedición fabricada hoy usa telas y cortes actuales aunque copie los colores y el escudo de una temporada vieja. El original de época tiene el tejido, el corte y a veces el desgaste propio de su año real de fabricación.", "Si buscás la pieza de época real (no la reedición), fijate que la temporada indicada en la ficha sea la original y no la del relanzamiento."] },
        { h: "Por qué a veces cuesta más una retro", p: ["El stock real de camisetas de época se agota con el tiempo: cuantos menos ejemplares reales circulan de una temporada vieja, más sube el precio en tiendas de segunda mano y especializadas. Una reedición moderna, en cambio, se sigue fabricando y suele costar menos."] },
        { h: "Versión hincha vs versión jugador en retro", p: ["La distinción entre versión de hincha (fan) y versión de jugador también aplica a las retro: las de jugador de época suelen ser más difíciles de conseguir y más caras que las de hincha de la misma temporada. Ver nuestra guía de talles fan vs jugador si no sabés cuál te conviene."] },
        { h: "Cómo lo mostramos en el comparador", p: ["Cuando una camiseta cumple el criterio (temporada 2006/07 o anterior), la marcamos con la etiqueta \"Retro\" en su ficha y aparece en la sección de retro del catálogo. Si no ves esa etiqueta en un diseño clásico reeditado, es porque técnicamente es una reedición de una temporada reciente, no la pieza retro original."] },
      ],
    },
    en: {
      title: "What counts as a retro football shirt (and what doesn't)",
      description: "Why we call a shirt \"retro\", from which season onward, replica vs period-correct version, and how to avoid buying a modern reissue thinking it's vintage.",
      intro: "In football, \"retro\" gets used for almost any old-looking design, but here it follows a fixed rule: season 2006/07 or earlier. Here's what that means in practice and what to check before buying.",
      sections: [
        { h: "Our rule: 2006/07 season or earlier", p: ["We mark a shirt as retro when its real season is 2006/07 or older. It's not a matter of taste: brands often reissue classic '90s or 2000s designs in recent seasons (2022/23, 2024/25...), and those reissues do NOT count as retro here even if the design is identical to the original.", "Every product page always shows the shirt's real season -- check that date, not just the design."] },
        { h: "Modern reissue vs period-correct original", p: ["A reissue made today uses current fabric and cut even if it copies the colours and crest of an old season. A genuine period piece has the fabric, cut and sometimes the wear of its actual year of manufacture.", "If you're after the real period piece (not the reissue), check that the season on the listing is the original one, not the relaunch."] },
        { h: "Why a retro shirt can cost more", p: ["Real stock of period shirts shrinks over time -- the fewer genuine pieces from an old season are still around, the higher the price on resale and specialist stores. A modern reissue, by contrast, keeps being made and usually costs less."] },
        { h: "Fan vs player version in retro shirts too", p: ["The fan-cut vs player-cut distinction applies to retro shirts as well: period player versions are usually harder to find and pricier than fan versions from the same season. See our fan vs player sizing guide if you're not sure which one you want."] },
        { h: "How we show it in the comparator", p: ["When a shirt meets the rule (season 2006/07 or older), we tag it \"Retro\" on its page and it shows up in the catalog's retro section. If you don't see that tag on a reissued classic design, it's because it's technically a reissue from a recent season, not the original retro piece."] },
      ],
    },
    pt: {
      title: "O que conta como camisa retrô (e o que não conta)",
      description: "Por que chamamos uma camisa de \"retrô\", a partir de que temporada, réplica vs peça de época, e como não comprar um relançamento moderno achando que é vintage.",
      intro: "No futebol, \"retrô\" costuma ser usado para qualquer design antigo, mas aqui seguimos um critério fixo: temporada 2006/07 ou anterior. Veja o que isso significa na prática e o que conferir antes de comprar.",
      sections: [
        { h: "Nosso critério: temporada 2006/07 ou anterior", p: ["Marcamos como retrô qualquer camisa cuja temporada real seja 2006/07 ou mais antiga. Não é questão de gosto: várias marcas relançam designs clássicos dos anos 90 ou 2000 em temporadas recentes (2022/23, 2024/25...), e esses relançamentos NÃO contam como retrô aqui, mesmo com design idêntico ao original.", "A temporada real de cada camisa sempre aparece na ficha do produto -- confira essa data, não só o design."] },
        { h: "Relançamento moderno vs peça original de época", p: ["Um relançamento feito hoje usa tecido e corte atuais, mesmo copiando as cores e o escudo de uma temporada antiga. A peça original de época tem o tecido, o corte e às vezes o desgaste do próprio ano de fabricação.", "Se você procura a peça de época real (não o relançamento), confira se a temporada indicada na ficha é a original, e não a do relançamento."] },
        { h: "Por que uma retrô às vezes custa mais", p: ["O estoque real de camisas de época diminui com o tempo -- quanto menos peças reais de uma temporada antiga ainda circulam, mais sobe o preço em brechós e lojas especializadas. Já um relançamento moderno continua sendo fabricado e costuma custar menos."] },
        { h: "Versão torcedor vs versão jogador também na retrô", p: ["A distinção entre versão torcedor (fan) e versão jogador também vale para as retrôs: as versões jogador de época costumam ser mais difíceis de achar e mais caras que as versões torcedor da mesma temporada. Veja nosso guia de tamanhos torcedor vs jogador se não souber qual escolher."] },
        { h: "Como mostramos isso no comparador", p: ["Quando uma camisa atende ao critério (temporada 2006/07 ou anterior), marcamos com a etiqueta \"Retrô\" na ficha e ela aparece na seção retrô do catálogo. Se você não vir essa etiqueta em um design clássico relançado, é porque tecnicamente é um relançamento de uma temporada recente, não a peça retrô original."] },
      ],
    },
    fr: {
      title: "Ce qui compte comme maillot rétro (et ce qui n'en est pas)",
      description: "Pourquoi on parle de maillot \"rétro\", à partir de quelle saison, réplique vs pièce d'époque, et comment éviter d'acheter une réédition moderne en pensant que c'est du vintage.",
      intro: "Dans le foot, \"rétro\" est utilisé pour presque tout design ancien, mais ici on suit une règle fixe : saison 2006/07 ou antérieure. Voici ce que ça signifie concrètement et ce qu'il faut vérifier avant d'acheter.",
      sections: [
        { h: "Notre règle : saison 2006/07 ou antérieure", p: ["On marque comme rétro tout maillot dont la vraie saison est 2006/07 ou plus ancienne. Ce n'est pas une question de goût : de nombreuses marques rééditent des designs classiques des années 90 ou 2000 lors de saisons récentes (2022/23, 2024/25...), et ces rééditions ne comptent PAS comme rétro ici, même si le design est identique à l'original.", "La vraie saison de chaque maillot figure toujours sur la fiche produit -- vérifiez cette date, pas seulement le design."] },
        { h: "Réédition moderne vs original d'époque", p: ["Une réédition fabriquée aujourd'hui utilise un tissu et une coupe actuels même si elle copie les couleurs et l'écusson d'une saison ancienne. La pièce d'époque authentique a le tissu, la coupe et parfois l'usure de sa vraie année de fabrication.", "Si vous cherchez la vraie pièce d'époque (pas la réédition), vérifiez que la saison indiquée sur la fiche est bien l'originale, pas celle de la relance."] },
        { h: "Pourquoi un maillot rétro coûte parfois plus cher", p: ["Le vrai stock de maillots d'époque diminue avec le temps -- moins il reste de pièces authentiques d'une saison ancienne en circulation, plus le prix grimpe en seconde main et chez les spécialistes. Une réédition moderne, elle, continue d'être fabriquée et coûte généralement moins cher."] },
        { h: "Version supporter vs version joueur, même en rétro", p: ["La distinction entre version supporter (fan) et version joueur s'applique aussi aux maillots rétro : les versions joueur d'époque sont généralement plus rares et plus chères que les versions supporter de la même saison. Consultez notre guide des tailles supporter vs joueur si vous hésitez."] },
        { h: "Comment on l'affiche dans le comparateur", p: ["Quand un maillot respecte la règle (saison 2006/07 ou antérieure), on le marque \"Rétro\" sur sa fiche et il apparaît dans la section rétro du catalogue. Si vous ne voyez pas ce badge sur un design classique réédité, c'est que c'est techniquement une réédition d'une saison récente, pas la pièce rétro originale."] },
      ],
    },
    it: {
      title: "Cosa conta come maglia retro (e cosa no)",
      description: "Perché chiamiamo una maglia \"retro\", a partire da quale stagione, replica vs pezzo d'epoca, e come evitare di comprare una riedizione moderna pensando sia vintage.",
      intro: "Nel calcio \"retro\" viene usato per quasi ogni design vecchio, ma qui seguiamo un criterio fisso: stagione 2006/07 o precedente. Ecco cosa significa in pratica e cosa controllare prima di comprare.",
      sections: [
        { h: "Il nostro criterio: stagione 2006/07 o precedente", p: ["Segniamo come retro qualsiasi maglia la cui stagione reale sia 2006/07 o più vecchia. Non è una questione di gusti: molti brand rilanciano design classici degli anni '90 o 2000 in stagioni recenti (2022/23, 2024/25...), e queste riedizioni NON contano come retro qui, anche se il design è identico all'originale.", "La stagione reale di ogni maglia è sempre indicata nella scheda prodotto -- controlla quella data, non solo il design."] },
        { h: "Riedizione moderna vs originale d'epoca", p: ["Una riedizione realizzata oggi usa tessuto e taglio attuali anche se copia i colori e lo stemma di una stagione vecchia. Il pezzo originale d'epoca ha il tessuto, il taglio e a volte l'usura del suo vero anno di fabbricazione.", "Se cerchi il vero pezzo d'epoca (non la riedizione), controlla che la stagione indicata nella scheda sia quella originale, non quella del rilancio."] },
        { h: "Perché una retro a volte costa di più", p: ["Lo stock reale di maglie d'epoca si riduce nel tempo -- meno pezzi autentici di una vecchia stagione restano in circolazione, più sale il prezzo nell'usato e nei negozi specializzati. Una riedizione moderna, invece, continua a essere prodotta e di solito costa meno."] },
        { h: "Versione tifoso vs versione giocatore anche nelle retro", p: ["La distinzione tra versione tifoso (fan) e versione giocatore vale anche per le maglie retro: le versioni giocatore d'epoca sono di solito più difficili da trovare e più costose delle versioni tifoso della stessa stagione. Guarda la nostra guida taglie tifoso vs giocatore se non sai quale scegliere."] },
        { h: "Come lo mostriamo nel comparatore", p: ["Quando una maglia rispetta il criterio (stagione 2006/07 o precedente), la segniamo con l'etichetta \"Retro\" nella scheda e compare nella sezione retro del catalogo. Se non vedi quell'etichetta su un design classico rilanciato, è perché tecnicamente è una riedizione di una stagione recente, non il pezzo retro originale."] },
      ],
    },
  },
};

export { GUIDE_UI } from "./guideUi";
