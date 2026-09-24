import type { HubLocale } from "@/data/teamMeta";

// Los feeds de Foot-Store y Sport is Good traen el título del producto en
// el idioma de la tienda, y solo existen en castellano y francés. Después
// de fundir las fichas espejo (merge_mirror_locales en mine_gear.py) queda
// un catálogo mayormente en castellano con una cola en francés, que en
// /en /pt /it no se entiende y en /es se lee mal.
//
// La parte traducible es solo el PREFIJO: el sustantivo del producto antes
// de la marca ("Pantalón corto" en "Pantalón corto Nike Dri-FIT - Noir") y
// el color del final. Marca, modelo y códigos se dejan intactos: son el
// nombre real del artículo y es lo que el usuario va a ver en la tienda
// cuando haga clic (mismo criterio que mantener el nombre real de la
// tienda, 2026-09-16).
//
// Es un glosario curado a partir del vocabulario que realmente aparece en
// el catálogo, no una traducción automática: cubre el 82% de los prefijos
// (47% de los productos; el resto ya empieza por la marca) y el 100% de
// los colores; lo que no está se muestra tal cual
// venía. De paso corrige traducciones malas del propio feed español
// ("Cono de accionamiento" por cono de entrenamiento, "Sudor" por sudadera,
// "silbato de zorro" por silbato Fox, "Casulla" por peto).


// Prefijo canónico (sin acentos, en minúsculas) -> nombre por idioma.
const TERMS: Record<string, Record<HubLocale, string>> = {
  "accesorio de marcado cuadrado en el suelo": { es: "Marcador cuadrado de suelo", en: "Square ground marker", pt: "Marcador quadrado de solo", fr: "Marquage carré au sol", it: "Marcatore quadrato da terra" },
  "accesorio de marcaje de esquina en el suelo": { es: "Marcador de esquina de suelo", en: "Corner ground marker", pt: "Marcador de canto de solo", fr: "Marquage d'angle au sol", it: "Marcatore d'angolo da terra" },
  "accesorio de marcaje en el suelo": { es: "Marcador de suelo", en: "Ground marker", pt: "Marcador de solo", fr: "Marquage au sol", it: "Marcatore da terra" },
  "accesorio para porterias de futbol": { es: "Accesorio para porterías", en: "Goal accessory", pt: "Acessório para balizas", fr: "Accessoire de but", it: "Accessorio per porte" },
  "accessoire but de football": { es: "Accesorio para porterías", en: "Goal accessory", pt: "Acessório para balizas", fr: "Accessoire de but", it: "Accessorio per porte" },
  "accessorio de marcaje de mano en el suelo": { es: "Marcador de suelo", en: "Ground marker", pt: "Marcador de solo", fr: "Marquage au sol", it: "Marcatore da terra" },
  "actuacion breve": { es: "Pantalón corto de competición", en: "Performance shorts", pt: "Calção de competição", fr: "Short performance", it: "Pantaloncini performance" },
  "aro": { es: "Aro", en: "Hoop", pt: "Arco", fr: "Cerceau", it: "Cerchio" },
  "aro con peso": { es: "Aro con peso", en: "Weighted hoop", pt: "Arco com peso", fr: "Cerceau avec poids", it: "Cerchio con peso" },
  "aro magnetico con peso y contador": { es: "Aro magnético con peso y contador", en: "Weighted magnetic hoop with counter", pt: "Arco magnético com peso e contador", fr: "Cerceau magnétique avec poids et compteur", it: "Cerchio magnetico con peso e contatore" },
  "ballon de football": { es: "Balón de fútbol", en: "Football", pt: "Bola de futebol", fr: "Ballon de football", it: "Pallone da calcio" },
  "balon de futbol": { es: "Balón de fútbol", en: "Football", pt: "Bola de futebol", fr: "Ballon de football", it: "Pallone da calcio" },
  "balones de futbol": { es: "Balón de fútbol", en: "Football", pt: "Bola de futebol", fr: "Ballon de football", it: "Pallone da calcio" },
  "banda de resistencia": { es: "Banda de resistencia", en: "Resistance band", pt: "Banda de resistência", fr: "Bande de résistance", it: "Banda di resistenza" },
  "banda de resistencia de tela": { es: "Banda de resistencia de tela", en: "Fabric resistance band", pt: "Banda de resistência em tecido", fr: "Bande de résistance en tissu", it: "Banda di resistenza in tessuto" },
  "banda de resistencia en tpe": { es: "Banda de resistencia de TPE", en: "TPE resistance band", pt: "Banda de resistência em TPE", fr: "Bande de résistance en TPE", it: "Banda di resistenza in TPE" },
  "banda de resistencia terapeutica": { es: "Banda de resistencia terapéutica", en: "Therapy resistance band", pt: "Banda de resistência terapêutica", fr: "Bande de résistance thérapeutique", it: "Banda di resistenza terapeutica" },
  "banda elastica individual": { es: "Banda elástica individual", en: "Single resistance band", pt: "Banda elástica individual", fr: "Bande élastique simple", it: "Banda elastica singola" },
  "banda elastica multiple": { es: "Banda elástica múltiple", en: "Multi-loop resistance band", pt: "Banda elástica múltipla", fr: "Multi-bande de résistance", it: "Banda elastica multipla" },
  "bandas de resistencia": { es: "Bandas de resistencia", en: "Resistance bands", pt: "Bandas de resistência", fr: "Bandes de résistance", it: "Bande di resistenza" },
  "bandas elasticas": { es: "Bandas elásticas", en: "Resistance bands", pt: "Bandas elásticas", fr: "Bandes élastiques", it: "Bande elastiche" },
  "bandas elasticas de fitness": { es: "Bandas elásticas de fitness", en: "Fitness resistance bands", pt: "Bandas elásticas de fitness", fr: "Bandes élastiques de fitness", it: "Bande elastiche da fitness" },
  "bande de resistance": { es: "Banda de resistencia", en: "Resistance band", pt: "Banda de resistência", fr: "Bande de résistance", it: "Banda di resistenza" },
  "bande de resistance en tissu": { es: "Banda de resistencia de tela", en: "Fabric resistance band", pt: "Banda de resistência em tecido", fr: "Bande de résistance en tissu", it: "Banda di resistenza in tessuto" },
  "bandes de resistance": { es: "Bandas de resistencia", en: "Resistance bands", pt: "Bandas de resistência", fr: "Bandes de résistance", it: "Bande di resistenza" },
  "bandes elastique": { es: "Bandas elásticas", en: "Elastic bands", pt: "Bandas elásticas", fr: "Bandes élastiques", it: "Bande elastiche" },
  "bas": { es: "Calcetines", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "bolsa": { es: "Bolsa", en: "Bag", pt: "Saco", fr: "Sac", it: "Borsa" },
  "bolsa basica": { es: "Bolsa básica", en: "Basic bag", pt: "Saco básico", fr: "Sac basique", it: "Borsa basic" },
  "bolsa de deporte": { es: "Bolsa de deporte", en: "Sports bag", pt: "Saco de desporto", fr: "Sac de sport", it: "Borsa sportiva" },
  "bolsa para balones": { es: "Bolsa para balones", en: "Ball bag", pt: "Saco para bolas", fr: "Sac à ballons", it: "Sacca porta palloni" },
  "bomba": { es: "Inflador", en: "Pump", pt: "Bomba", fr: "Pompe", it: "Pompa" },
  "brassard": { es: "Brazalete", en: "Armband", pt: "Braçadeira", fr: "Brassard", it: "Fascia" },
  "brassard capitaine": { es: "Brazalete de capitán", en: "Captain's armband", pt: "Braçadeira de capitão", fr: "Brassard de capitaine", it: "Fascia da capitano" },
  "brassard de capitaine": { es: "Brazalete de capitán", en: "Captain's armband", pt: "Braçadeira de capitão", fr: "Brassard de capitaine", it: "Fascia da capitano" },
  "brassard de capitaine avec velcro": { es: "Brazalete de capitán con velcro", en: "Velcro captain's armband", pt: "Braçadeira de capitão com velcro", fr: "Brassard de capitaine à velcro", it: "Fascia da capitano con velcro" },
  "brazalete de capitan": { es: "Brazalete de capitán", en: "Captain's armband", pt: "Braçadeira de capitão", fr: "Brassard de capitaine", it: "Fascia da capitano" },
  "brazalete de capitan con velcro": { es: "Brazalete de capitán con velcro", en: "Velcro captain's armband", pt: "Braçadeira de capitão com velcro", fr: "Brassard de capitaine à velcro", it: "Fascia da capitano con velcro" },
  "caja de 25 implantes de marcaje": { es: "Caja de 25 discos de marcaje", en: "Box of 25 marking discs", pt: "Caixa de 25 discos de marcação", fr: "Boîte de 25 plots de marquage", it: "Scatola da 25 dischi di marcatura" },
  "calcetines": { es: "Calcetines", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "calcetines cortos": { es: "Calcetines cortos", en: "Ankle socks", pt: "Meias curtas", fr: "Chaussettes courtes", it: "Calzini corti" },
  "calcetines de 3 rayas": { es: "Calcetines de 3 rayas", en: "3-stripe socks", pt: "Meias de 3 riscas", fr: "Chaussettes 3 bandes", it: "Calzettoni a 3 strisce" },
  "calcetines de futbol": { es: "Calcetines de fútbol", en: "Football socks", pt: "Meias de futebol", fr: "Chaussettes de football", it: "Calzettoni da calcio" },
  "calcetines tecnicos antideslizantes": { es: "Calcetines técnicos antideslizantes", en: "Non-slip technical socks", pt: "Meias técnicas antiderrapantes", fr: "Chaussettes techniques antidérapantes", it: "Calzettoni tecnici antiscivolo" },
  "camiseta": { es: "Camiseta", en: "Shirt", pt: "Camisola", fr: "Maillot", it: "Maglia" },
  "camiseta de compresion": { es: "Camiseta de compresión", en: "Compression shirt", pt: "Camisola de compressão", fr: "Maillot de compression", it: "Maglia a compressione" },
  "camiseta de manga larga": { es: "Camiseta de manga larga", en: "Long-sleeve shirt", pt: "Camisola de manga comprida", fr: "Maillot manches longues", it: "Maglia a maniche lunghe" },
  "camiseta interior de manga larga": { es: "Camiseta interior de manga larga", en: "Long-sleeve base layer", pt: "Camisola interior de manga comprida", fr: "Sous-maillot manches longues", it: "Maglia intima a maniche lunghe" },
  "camiseta interior manga larga": { es: "Camiseta interior de manga larga", en: "Long-sleeve base layer", pt: "Camisola interior de manga comprida", fr: "Sous-maillot manches longues", it: "Maglia intima a maniche lunghe" },
  "camiseta promo": { es: "Camiseta promocional", en: "Promo shirt", pt: "Camisola promocional", fr: "Maillot promo", it: "Maglia promo" },
  "carta tactica": { es: "Pizarra táctica", en: "Tactics board", pt: "Quadro tático", fr: "Tableau tactique", it: "Lavagna tattica" },
  "casulla": { es: "Peto", en: "Training bib", pt: "Colete de treino", fr: "Chasuble", it: "Casacca" },
  "casulla de nailon": { es: "Peto de nailon", en: "Nylon training bib", pt: "Colete de treino em nylon", fr: "Chasuble en nylon", it: "Casacca in nylon" },
  "cerceau avec poids": { es: "Aro con peso", en: "Weighted hoop", pt: "Arco com peso", fr: "Cerceau avec poids", it: "Cerchio con peso" },
  "cerceau magnetique avec poids et compteur": { es: "Aro magnético con peso y contador", en: "Weighted magnetic hoop with counter", pt: "Arco magnético com peso e contador", fr: "Cerceau magnétique avec poids et compteur", it: "Cerchio magnetico con peso e contatore" },
  "chaleco": { es: "Chaleco", en: "Gilet", pt: "Colete", fr: "Gilet", it: "Gilet" },
  "chaleco de entrenamiento para adultos": { es: "Peto de entrenamiento de adulto", en: "Adult training bib", pt: "Colete de treino de adulto", fr: "Chasuble d'entraînement adulte", it: "Casacca da allenamento adulto" },
  "chaleco extensible": { es: "Peto elástico", en: "Stretch training bib", pt: "Colete de treino elástico", fr: "Chasuble extensible", it: "Casacca elastica" },
  "chaleco numerado del 1 al 10": { es: "Peto numerado del 1 al 10", en: "Training bib numbered 1 to 10", pt: "Colete numerado de 1 a 10", fr: "Chasuble numéroté de 1 à 10", it: "Casacca numerata da 1 a 10" },
  "chaleco numerado del 11 al 15": { es: "Peto numerado del 11 al 15", en: "Training bib numbered 11 to 15", pt: "Colete numerado de 11 a 15", fr: "Chasuble numéroté de 11 à 15", it: "Casacca numerata da 11 a 15" },
  "chaleco numerado del 16 al 20": { es: "Peto numerado del 16 al 20", en: "Training bib numbered 16 to 20", pt: "Colete numerado de 16 a 20", fr: "Chasuble numéroté de 16 à 20", it: "Casacca numerata da 16 a 20" },
  "chalecos numerados": { es: "Petos numerados", en: "Numbered training bibs", pt: "Coletes numerados", fr: "Chasubles numérotés", it: "Casacche numerate" },
  "chaqueta": { es: "Chaqueta", en: "Jacket", pt: "Casaco", fr: "Veste", it: "Giacca" },
  "chaqueta con capucha": { es: "Chaqueta con capucha", en: "Hooded jacket", pt: "Casaco com capuz", fr: "Veste à capuche", it: "Giacca con cappuccio" },
  "chaqueta con cremallera 1/4": { es: "Chaqueta con cremallera 1/4", en: "Quarter-zip jacket", pt: "Casaco com fecho 1/4", fr: "Veste 1/4 zip", it: "Giacca con zip 1/4" },
  "chaqueta de chandal": { es: "Chaqueta de chándal", en: "Track jacket", pt: "Casaco de fato de treino", fr: "Veste de survêtement", it: "Giacca della tuta" },
  "chaqueta de chandal con 1/2 cremallera": { es: "Chaqueta de chándal con media cremallera", en: "Half-zip track jacket", pt: "Casaco de fato de treino com meio fecho", fr: "Veste de survêtement 1/2 zip", it: "Giacca della tuta con mezza zip" },
  "chaqueta de chandal con capucha": { es: "Chaqueta de chándal con capucha", en: "Hooded track jacket", pt: "Casaco de fato de treino com capuz", fr: "Veste de survêtement à capuche", it: "Giacca della tuta con cappuccio" },
  "chaqueta de chandal de entrenamiento con cremallera estampada": { es: "Chaqueta de chándal estampada con cremallera", en: "Printed zip track jacket", pt: "Casaco de fato de treino estampado com fecho", fr: "Veste de survêtement imprimée zippée", it: "Giacca della tuta stampata con zip" },
  "chaqueta de entrenamiento con cremallera 1/4 en estampado": { es: "Chaqueta de entrenamiento estampada con cremallera 1/4", en: "Printed quarter-zip training jacket", pt: "Casaco de treino estampado com fecho 1/4", fr: "Veste d'entraînement imprimée 1/4 zip", it: "Giacca da allenamento stampata con zip 1/4" },
  "chaqueta de presentacion": { es: "Chaqueta de presentación", en: "Presentation jacket", pt: "Casaco de apresentação", fr: "Veste de présentation", it: "Giacca da presentazione" },
  "chaqueta deportiva mujer": { es: "Chaqueta deportiva de mujer", en: "Women's sports jacket", pt: "Casaco desportivo de mulher", fr: "Veste de sport femme", it: "Giacca sportiva da donna" },
  "chaqueta impermeable": { es: "Chaqueta impermeable", en: "Waterproof jacket", pt: "Casaco impermeável", fr: "Veste imperméable", it: "Giacca impermeabile" },
  "chasuble": { es: "Peto", en: "Training bib", pt: "Colete de treino", fr: "Chasuble", it: "Casacca" },
  "chasuble calada simple": { es: "Peto de malla simple", en: "Simple mesh bib", pt: "Colete de rede simples", fr: "Chasuble calée simple", it: "Casacca in rete semplice" },
  "chasuble de botellas recicladas": { es: "Peto de botellas recicladas", en: "Recycled-bottle training bib", pt: "Colete de garrafas recicladas", fr: "Chasuble en bouteilles recyclées", it: "Casacca in bottiglie riciclate" },
  "chasuble en bouteille recyclees": { es: "Peto de botellas recicladas", en: "Recycled-bottle training bib", pt: "Colete de garrafas recicladas", fr: "Chasuble en bouteilles recyclées", it: "Casacca in bottiglie riciclate" },
  "chasuble en mesh": { es: "Peto de malla", en: "Mesh training bib", pt: "Colete de treino em rede", fr: "Chasuble en mesh", it: "Casacca in rete" },
  "chaussettes": { es: "Calcetines", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "chaussettes 3 stripe": { es: "Calcetines de 3 rayas", en: "3-stripe socks", pt: "Meias de 3 riscas", fr: "Chaussettes 3 bandes", it: "Calzettoni a 3 strisce" },
  "chaussettes de football": { es: "Calcetines de fútbol", en: "Football socks", pt: "Meias de futebol", fr: "Chaussettes de football", it: "Calzettoni da calcio" },
  "chubasquero": { es: "Chubasquero", en: "Rain jacket", pt: "Corta-vento impermeável", fr: "Coupe-vent imperméable", it: "Giacca antipioggia" },
  "cobertura": { es: "Funda", en: "Cover", pt: "Cobertura", fr: "Housse", it: "Copertura" },
  "cojin de pelota": { es: "Cojín para balón", en: "Ball cushion", pt: "Almofada para bola", fr: "Coussin de ballon", it: "Cuscino per pallone" },
  "cone a trous": { es: "Cono con agujeros", en: "Cone with holes", pt: "Cone com furos", fr: "Cône à trous", it: "Cono forato" },
  "cone d'entrainement": { es: "Cono de entrenamiento", en: "Training cone", pt: "Cone de treino", fr: "Cône d'entraînement", it: "Cono da allenamento" },
  "cone d'entrainement avec trous": { es: "Cono de entrenamiento con agujeros", en: "Training cone with holes", pt: "Cone de treino com furos", fr: "Cône d'entraînement à trous", it: "Cono da allenamento forato" },
  "cone d'entrainement soucoupe avec manches": { es: "Cono plano con varillas", en: "Saucer cone with poles", pt: "Cone chato com varetas", fr: "Cône soucoupe avec manches", it: "Cono piatto con aste" },
  "cone d'entrainement souples mini": { es: "Mini conos blandos", en: "Mini soft cones", pt: "Mini cones flexíveis", fr: "Mini cônes souples", it: "Mini coni morbidi" },
  "conjunto de arbitro": { es: "Conjunto de árbitro", en: "Referee kit", pt: "Conjunto de árbitro", fr: "Ensemble arbitre", it: "Completo da arbitro" },
  "conjunto de camisa y pantalon corto": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "conjunto de camiseta de entrenamiento y pantalon corto": { es: "Conjunto de camiseta de entrenamiento y pantalón corto", en: "Training shirt and shorts kit", pt: "Conjunto de camisola de treino e calção", fr: "Ensemble maillot d'entraînement et short", it: "Completo maglia da allenamento e pantaloncini" },
  "conjunto de camiseta de manga larga y pantalon corto de portero": { es: "Conjunto de portero de manga larga", en: "Long-sleeve goalkeeper kit", pt: "Conjunto de guarda-redes de manga comprida", fr: "Ensemble gardien manches longues", it: "Completo da portiere a maniche lunghe" },
  "conjunto de camiseta y pantalon corto": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "conjunto de camiseta y pantalon pantalon corto": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "conjunto de camiseta, pantalon corto y calcetas": { es: "Conjunto de camiseta, pantalón corto y calcetines", en: "Shirt, shorts and socks kit", pt: "Conjunto de camisola, calção e meias", fr: "Ensemble maillot, short et chaussettes", it: "Completo maglia, pantaloncini e calzettoni" },
  "conjunto de camiseta, pantalon y medias de portero": { es: "Conjunto completo de portero", en: "Full goalkeeper kit", pt: "Conjunto completo de guarda-redes", fr: "Ensemble complet gardien", it: "Completo integrale da portiere" },
  "conjunto de polo y pantalon pantalon corto": { es: "Conjunto de polo y pantalón corto", en: "Polo and shorts kit", pt: "Conjunto de polo e calção", fr: "Ensemble polo et short", it: "Completo polo e pantaloncini" },
  "conjunto de portero": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien", it: "Completo da portiere" },
  "conjunto de traje de bano para mujer": { es: "Conjunto de baño de mujer", en: "Women's swim set", pt: "Conjunto de banho de mulher", fr: "Ensemble de bain femme", it: "Completo da bagno da donna" },
  "conjunto de trajes de bano": { es: "Conjunto de baño", en: "Swim set", pt: "Conjunto de banho", fr: "Ensemble de bain", it: "Completo da bagno" },
  "conjunto guardian": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien", it: "Completo da portiere" },
  "conjunto portero": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien", it: "Completo da portiere" },
  "cono con agujeros": { es: "Cono con agujeros", en: "Cone with holes", pt: "Cone com furos", fr: "Cône à trous", it: "Cono forato" },
  "cono de accionamiento": { es: "Cono de entrenamiento", en: "Training cone", pt: "Cone de treino", fr: "Cône d'entraînement", it: "Cono da allenamento" },
  "cono de arrastre con asas": { es: "Cono de arrastre con asas", en: "Drag cone with handles", pt: "Cone de arrasto com pegas", fr: "Cône de traction avec poignées", it: "Cono da trascinamento con maniglie" },
  "cono de entrenamiento": { es: "Cono de entrenamiento", en: "Training cone", pt: "Cone de treino", fr: "Cône d'entraînement", it: "Cono da allenamento" },
  "cono de entrenamiento con agujeros": { es: "Cono de entrenamiento con agujeros", en: "Training cone with holes", pt: "Cone de treino com furos", fr: "Cône d'entraînement à trous", it: "Cono da allenamento forato" },
  "cono de entrenamiento del platillo": { es: "Cono plano de entrenamiento", en: "Saucer training cone", pt: "Cone chato de treino", fr: "Cône soucoupe d'entraînement", it: "Cono piatto da allenamento" },
  "cono de entrenamiento semirrigido": { es: "Cono de entrenamiento semirrígido", en: "Semi-rigid training cone", pt: "Cone de treino semirrígido", fr: "Cône d'entraînement semi-rigide", it: "Cono da allenamento semirigido" },
  "conos de entrenamiento suaves mini": { es: "Mini conos blandos", en: "Mini soft cones", pt: "Mini cones flexíveis", fr: "Mini cônes souples", it: "Mini coni morbidi" },
  "cortavientos": { es: "Cortavientos", en: "Windbreaker", pt: "Corta-vento", fr: "Coupe-vent", it: "Giacca antivento" },
  "corto": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "coupe-vent": { es: "Cortavientos", en: "Windbreaker", pt: "Corta-vento", fr: "Coupe-vent", it: "Giacca antivento" },
  "coussin de balle": { es: "Cojín para balón", en: "Ball cushion", pt: "Almofada para bola", fr: "Coussin de ballon", it: "Cuscino per pallone" },
  "cuissard": { es: "Malla corta", en: "Compression shorts", pt: "Calções de compressão", fr: "Cuissard", it: "Pantaloncini a compressione" },
  "disco de marcado": { es: "Disco de marcaje", en: "Marking disc", pt: "Disco de marcação", fr: "Disque de marquage", it: "Disco di marcatura" },
  "disque de marquage": { es: "Disco de marcaje", en: "Marking disc", pt: "Disco de marcação", fr: "Disque de marquage", it: "Disco di marcatura" },
  "ensemble gardien": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien", it: "Completo da portiere" },
  "ensemble gardien de but": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien de but", it: "Completo da portiere" },
  "ensemble gardien de but maillot manches longues et short": { es: "Conjunto de portero de manga larga", en: "Long-sleeve goalkeeper kit", pt: "Conjunto de guarda-redes de manga comprida", fr: "Ensemble gardien manches longues", it: "Completo da portiere a maniche lunghe" },
  "ensemble maillot et short": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "ensemble t-shirt et short": { es: "Conjunto de camiseta y pantalón corto", en: "T-shirt and shorts kit", pt: "Conjunto de t-shirt e calção", fr: "Ensemble t-shirt et short", it: "Completo t-shirt e pantaloncini" },
  "equipo de entrenamiento": { es: "Equipo de entrenamiento", en: "Training equipment", pt: "Equipamento de treino", fr: "Matériel d'entraînement", it: "Attrezzatura da allenamento" },
  "escala ritmica": { es: "Escalera de agilidad", en: "Agility ladder", pt: "Escada de agilidade", fr: "Échelle de rythme", it: "Scala per agilità" },
  "espinilleras": { es: "Espinilleras", en: "Shin guards", pt: "Caneleiras", fr: "Protège-tibias", it: "Parastinchi" },
  "futbol formativo": { es: "Fútbol base", en: "Youth football", pt: "Futebol de formação", fr: "Football des jeunes", it: "Calcio giovanile" },
  "gants de gardien": { es: "Guantes de portero", en: "Goalkeeper gloves", pt: "Luvas de guarda-redes", fr: "Gants de gardien", it: "Guanti da portiere" },
  "guantes de portero": { es: "Guantes de portero", en: "Goalkeeper gloves", pt: "Luvas de guarda-redes", fr: "Gants de gardien", it: "Guanti da portiere" },
  "haut d'entrainement 1/4 zip": { es: "Top de entrenamiento con cremallera 1/4", en: "Quarter-zip training top", pt: "Top de treino com fecho 1/4", fr: "Haut d'entraînement 1/4 zip", it: "Top da allenamento con zip 1/4" },
  "hinchador para hinchar balones": { es: "Inflador de balones", en: "Ball pump", pt: "Bomba para bolas", fr: "Pompe à ballon", it: "Pompa per palloni" },
  "implantes por unidad": { es: "Disco de marcaje suelto", en: "Single marking disc", pt: "Disco de marcação avulso", fr: "Plot de marquage à l'unité", it: "Disco di marcatura singolo" },
  "implants a l'unite": { es: "Disco de marcaje suelto", en: "Single marking disc", pt: "Disco de marcação avulso", fr: "Plot de marquage à l'unité", it: "Disco di marcatura singolo" },
  "kit": { es: "Kit", en: "Kit", pt: "Kit", fr: "Kit", it: "Kit" },
  "kit de 25 implantes de marcapasos": { es: "Kit de 25 discos de marcaje", en: "Kit of 25 marking discs", pt: "Kit de 25 discos de marcação", fr: "Kit de 25 plots de marquage", it: "Kit da 25 dischi di marcatura" },
  "legging": { es: "Mallas", en: "Leggings", pt: "Leggings", fr: "Legging", it: "Leggings" },
  "lo de 5 chasubles numeroteees de 11 a 15": { es: "Lote de 5 petos numerados del 11 al 15", en: "Set of 5 training bibs numbered 11 to 15", pt: "Conjunto de 5 coletes numerados de 11 a 15", fr: "Lot de 5 chasubles numérotés de 11 à 15", it: "Set di 5 casacche numerate da 11 a 15" },
  "lo de 5 chasubles numeroteees de 16 a 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lot de 5 chasubles numerotees de 11 a 15": { es: "Lote de 5 petos numerados del 11 al 15", en: "Set of 5 training bibs numbered 11 to 15", pt: "Conjunto de 5 coletes numerados de 11 a 15", fr: "Lot de 5 chasubles numérotés de 11 à 15", it: "Set di 5 casacche numerate da 11 a 15" },
  "lot de 5 chasubles numerotees de 16 a 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lot de 5 chasubles numerotes de 11 a 15": { es: "Lote de 5 petos numerados del 11 al 15", en: "Set of 5 training bibs numbered 11 to 15", pt: "Conjunto de 5 coletes numerados de 11 a 15", fr: "Lot de 5 chasubles numérotés de 11 à 15", it: "Set di 5 casacche numerate da 11 a 15" },
  "lot de 5 chasubles numerotes de 16 a 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lot de 5 chasubles numerotes du 11 a 15": { es: "Lote de 5 petos numerados del 11 al 15", en: "Set of 5 training bibs numbered 11 to 15", pt: "Conjunto de 5 coletes numerados de 11 a 15", fr: "Lot de 5 chasubles numérotés de 11 à 15", it: "Set di 5 casacche numerate da 11 a 15" },
  "lot de 5 chasubles numerotes du 16 a 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lot de 5 chasubles numerotes du 16 au 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lot de 6 chaussettes": { es: "Pack de 6 pares de calcetines", en: "Pack of 6 socks", pt: "Pack de 6 meias", fr: "Lot de 6 chaussettes", it: "Confezione da 6 calzettoni" },
  "lote de 5 petos numerados del 1 al 5": { es: "Lote de 5 petos numerados del 1 al 5", en: "Set of 5 training bibs numbered 1 to 5", pt: "Conjunto de 5 coletes numerados de 1 a 5", fr: "Lot de 5 chasubles numérotés de 1 à 5", it: "Set di 5 casacche numerate da 1 a 5" },
  "lote de 5 petos numerados del 11 al 15": { es: "Lote de 5 petos numerados del 11 al 15", en: "Set of 5 training bibs numbered 11 to 15", pt: "Conjunto de 5 coletes numerados de 11 a 15", fr: "Lot de 5 chasubles numérotés de 11 à 15", it: "Set di 5 casacche numerate da 11 a 15" },
  "lote de 5 petos numerados del 16 al 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lote de 5 petos numerados del 6 al 10": { es: "Lote de 5 petos numerados del 6 al 10", en: "Set of 5 training bibs numbered 6 to 10", pt: "Conjunto de 5 coletes numerados de 6 a 10", fr: "Lot de 5 chasubles numérotés de 6 à 10", it: "Set di 5 casacche numerate da 6 a 10" },
  "lote de 6 petos": { es: "Lote de 6 petos", en: "Set of 6 training bibs", pt: "Conjunto de 6 coletes", fr: "Lot de 6 chasubles", it: "Set di 6 casacche" },
  "maillot": { es: "Camiseta", en: "Shirt", pt: "Camisola", fr: "Maillot", it: "Maglia" },
  "maillot de compression": { es: "Camiseta de compresión", en: "Compression shirt", pt: "Camisola de compressão", fr: "Maillot de compression", it: "Maglia a compressione" },
  "malla": { es: "Mallas", en: "Leggings", pt: "Leggings", fr: "Legging", it: "Leggings" },
  "mallas": { es: "Mallas", en: "Leggings", pt: "Leggings", fr: "Legging", it: "Leggings" },
  "mallas cortas": { es: "Mallas cortas", en: "Short leggings", pt: "Leggings curtos", fr: "Legging court", it: "Leggings corti" },
  "manchon jambe": { es: "Manguito de pierna", en: "Leg sleeve", pt: "Manguito de perna", fr: "Manchon de jambe", it: "Manicotto per gamba" },
  "mango de la bomba": { es: "Mango de inflador", en: "Pump handle", pt: "Punho de bomba", fr: "Poignée de pompe", it: "Impugnatura per pompa" },
  "manguito para pierna": { es: "Manguito de pierna", en: "Leg sleeve", pt: "Manguito de perna", fr: "Manchon de jambe", it: "Manicotto per gamba" },
  "manguitos para pierna": { es: "Manguitos de pierna", en: "Leg sleeves", pt: "Manguitos de perna", fr: "Manchons de jambe", it: "Manicotti per gamba" },
  "marcadores": { es: "Conos de marcaje", en: "Markers", pt: "Marcadores", fr: "Marqueurs", it: "Marcatori" },
  "marqueurs": { es: "Conos de marcaje", en: "Markers", pt: "Marcadores", fr: "Marqueurs", it: "Marcatori" },
  "material de entrenamiento": { es: "Material de entrenamiento", en: "Training equipment", pt: "Material de treino", fr: "Matériel d'entraînement", it: "Materiale da allenamento" },
  "material de entrenamiento para manos": { es: "Material de entrenamiento de manos", en: "Hand training equipment", pt: "Material de treino de mãos", fr: "Matériel d'entraînement des mains", it: "Materiale da allenamento per le mani" },
  "materiel d'entrainement": { es: "Equipo de entrenamiento", en: "Training equipment", pt: "Equipamento de treino", fr: "Matériel d'entraînement", it: "Attrezzatura da allenamento" },
  "materiel d'entrainement pour les mains": { es: "Material de entrenamiento de manos", en: "Hand training equipment", pt: "Material de treino de mãos", fr: "Matériel d'entraînement des mains", it: "Materiale da allenamento per le mani" },
  "medias": { es: "Medias", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "medias sin pies": { es: "Medias sin pie", en: "Footless socks", pt: "Meias sem pé", fr: "Chaussettes sans pieds", it: "Calzettoni senza piede" },
  "mini banda de resistencia": { es: "Mini banda de resistencia", en: "Mini resistance band", pt: "Mini banda de resistência", fr: "Mini bande de résistance", it: "Mini banda di resistenza" },
  "mini bande de resistance": { es: "Mini banda de resistencia", en: "Mini resistance band", pt: "Mini banda de resistência", fr: "Mini bande de résistance", it: "Mini banda di resistenza" },
  "mochila": { es: "Mochila", en: "Backpack", pt: "Mochila", fr: "Sac à dos", it: "Zaino" },
  "multi-bande de resistance": { es: "Banda elástica múltiple", en: "Multi-loop resistance band", pt: "Banda elástica múltipla", fr: "Multi-bande de résistance", it: "Banda elastica multipla" },
  "pack de 6 calcetines de futbol": { es: "Pack de 6 pares de calcetines de fútbol", en: "Pack of 6 football socks", pt: "Pack de 6 meias de futebol", fr: "Lot de 6 chaussettes de football", it: "Confezione da 6 calzettoni da calcio" },
  "paires de chaussettes": { es: "Pares de calcetines", en: "Pairs of socks", pt: "Pares de meias", fr: "Paires de chaussettes", it: "Paia di calzettoni" },
  "pantalon": { es: "Pantalón", en: "Trousers", pt: "Calças", fr: "Pantalon", it: "Pantaloni" },
  "pantalon corto": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "pantalon corto de compresion": { es: "Pantalón corto de compresión", en: "Compression shorts", pt: "Calção de compressão", fr: "Short de compression", it: "Pantaloncini a compressione" },
  "pantalon corto de entrenamiento": { es: "Pantalón corto de entrenamiento", en: "Training shorts", pt: "Calção de treino", fr: "Short d'entraînement", it: "Pantaloncini da allenamento" },
  "pantalon corto de portero": { es: "Pantalón corto de portero", en: "Goalkeeper shorts", pt: "Calção de guarda-redes", fr: "Short de gardien", it: "Pantaloncini da portiere" },
  "pantalon corto largo": { es: "Pantalón corto largo", en: "Long shorts", pt: "Calção comprido", fr: "Short long", it: "Pantaloncini lunghi" },
  "pantalon corto partido": { es: "Pantalón corto de partido", en: "Match shorts", pt: "Calção de jogo", fr: "Short de match", it: "Pantaloncini da partita" },
  "pantalon corto portero": { es: "Pantalón corto de portero", en: "Goalkeeper shorts", pt: "Calção de guarda-redes", fr: "Short de gardien", it: "Pantaloncini da portiere" },
  "pantalon de chandal": { es: "Pantalón de chándal", en: "Tracksuit bottoms", pt: "Calças de fato de treino", fr: "Pantalon de survêtement", it: "Pantaloni della tuta" },
  "pantalon de entrenamiento": { es: "Pantalón de entrenamiento", en: "Training trousers", pt: "Calças de treino", fr: "Pantalon d'entraînement", it: "Pantaloni da allenamento" },
  "pantalon de presentacion": { es: "Pantalón de presentación", en: "Presentation trousers", pt: "Calças de apresentação", fr: "Pantalon de présentation", it: "Pantaloni da presentazione" },
  "pantalon de survetement": { es: "Pantalón de chándal", en: "Tracksuit bottoms", pt: "Calças de fato de treino", fr: "Pantalon de survêtement", it: "Pantaloni della tuta" },
  "pantalones cortos": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "pantalones cortos con micro rayas": { es: "Pantalón corto de microrayas", en: "Micro-stripe shorts", pt: "Calção de micro-riscas", fr: "Short micro-rayures", it: "Pantaloncini a micro righe" },
  "paquete de 10 conos de entrenamiento redondos": { es: "Pack de 10 conos redondos", en: "Pack of 10 round cones", pt: "Pack de 10 cones redondos", fr: "Lot de 10 cônes ronds", it: "Confezione da 10 coni tondi" },
  "paquete de 5 balones": { es: "Pack de 5 balones", en: "Pack of 5 balls", pt: "Pack de 5 bolas", fr: "Lot de 5 ballons", it: "Confezione da 5 palloni" },
  "parka": { es: "Parka", en: "Parka", pt: "Parka", fr: "Parka", it: "Parka" },
  "peto": { es: "Peto", en: "Training bib", pt: "Colete de treino", fr: "Chasuble", it: "Casacca" },
  "peto de malla": { es: "Peto de malla", en: "Mesh training bib", pt: "Colete de treino em rede", fr: "Chasuble en mesh", it: "Casacca in rete" },
  "peto numerado del 11 al 15": { es: "Peto numerado del 11 al 15", en: "Training bib numbered 11 to 15", pt: "Colete numerado de 11 a 15", fr: "Chasuble numéroté de 11 à 15", it: "Casacca numerata da 11 a 15" },
  "peto numerado del 16 al 20": { es: "Peto numerado del 16 al 20", en: "Training bib numbered 16 to 20", pt: "Colete numerado de 16 a 20", fr: "Chasuble numéroté de 16 à 20", it: "Casacca numerata da 16 a 20" },
  "peto reversible": { es: "Peto reversible", en: "Reversible training bib", pt: "Colete de treino reversível", fr: "Chasuble réversible", it: "Casacca reversibile" },
  "petos": { es: "Petos", en: "Training bibs", pt: "Coletes de treino", fr: "Chasubles", it: "Casacche" },
  "plumifero": { es: "Plumífero", en: "Padded jacket", pt: "Casaco acolchoado", fr: "Doudoune", it: "Piumino" },
  "plumifero largo": { es: "Plumífero largo", en: "Long padded jacket", pt: "Casaco acolchoado comprido", fr: "Doudoune longue", it: "Piumino lungo" },
  "polo": { es: "Polo", en: "Polo shirt", pt: "Polo", fr: "Polo", it: "Polo" },
  "protege-tibias": { es: "Espinilleras", en: "Shin guards", pt: "Caneleiras", fr: "Protège-tibias", it: "Parastinchi" },
  "puno": { es: "Muñequera", en: "Wristband", pt: "Punho", fr: "Poignet", it: "Polsino" },
  "red": { es: "Red", en: "Net", pt: "Rede", fr: "Filet", it: "Rete" },
  "red de futbol": { es: "Red de fútbol", en: "Football net", pt: "Rede de futebol", fr: "Filet de football", it: "Rete da calcio" },
  "redes": { es: "Redes", en: "Nets", pt: "Redes", fr: "Filets", it: "Reti" },
  "resistencia elastica": { es: "Banda elástica", en: "Resistance band", pt: "Banda elástica", fr: "Bande élastique", it: "Banda elastica" },
  "sac a dos": { es: "Mochila", en: "Backpack", pt: "Mochila", fr: "Sac à dos", it: "Zaino" },
  "sac de sport": { es: "Bolsa de deporte", en: "Sports bag", pt: "Saco de desporto", fr: "Sac de sport", it: "Borsa sportiva" },
  "seto antilesion": { es: "Valla blanda de entrenamiento", en: "Soft training hurdle", pt: "Barreira macia de treino", fr: "Haie souple d'entraînement", it: "Ostacolo morbido da allenamento" },
  "short": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "short de partido confort": { es: "Pantalón corto de partido confort", en: "Comfort match shorts", pt: "Calção de jogo confort", fr: "Short de match confort", it: "Pantaloncini da partita comfort" },
  "short micro-stripe": { es: "Pantalón corto de microrayas", en: "Micro-stripe shorts", pt: "Calção de micro-riscas", fr: "Short micro-rayures", it: "Pantaloncini a micro righe" },
  "short slippe": { es: "Pantalón corto slip", en: "Brief shorts", pt: "Calção slip", fr: "Short slippé", it: "Pantaloncini slip" },
  "silbato": { es: "Silbato", en: "Whistle", pt: "Apito", fr: "Sifflet", it: "Fischietto" },
  "silbato con cuerda": { es: "Silbato con cuerda", en: "Whistle with lanyard", pt: "Apito com cordão", fr: "Sifflet avec cordon", it: "Fischietto con cordino" },
  "silbato de zorro": { es: "Silbato Fox", en: "Fox whistle", pt: "Apito Fox", fr: "Sifflet Fox", it: "Fischietto Fox" },
  "sudadera": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sudadera con capucha": { es: "Sudadera con capucha", en: "Hoodie", pt: "Sweat com capuz", fr: "Sweat à capuche", it: "Felpa con cappuccio" },
  "sudadera con capucha y cremallera": { es: "Sudadera con capucha y cremallera", en: "Zip hoodie", pt: "Sweat com capuz e fecho", fr: "Sweat à capuche zippé", it: "Felpa con cappuccio e zip" },
  "sudadera de cuello redondo": { es: "Sudadera de cuello redondo", en: "Crew-neck sweatshirt", pt: "Sweatshirt de gola redonda", fr: "Sweatshirt col rond", it: "Felpa girocollo" },
  "sudadera de entrenamiento con cremallera 1/4": { es: "Sudadera de entrenamiento con cremallera 1/4", en: "Quarter-zip training sweatshirt", pt: "Sweatshirt de treino com fecho 1/4", fr: "Sweatshirt d'entraînement 1/4 zip", it: "Felpa da allenamento con zip 1/4" },
  "sudor": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sweat": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sweat a capuche": { es: "Sudadera con capucha", en: "Hoodie", pt: "Sweat com capuz", fr: "Sweat à capuche", it: "Felpa con cappuccio" },
  "sweatshirt": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sweatshirt 1/4 zip": { es: "Sudadera con cremallera 1/4", en: "Quarter-zip sweatshirt", pt: "Sweatshirt com fecho 1/4", fr: "Sweatshirt 1/4 zip", it: "Felpa con zip 1/4" },
  "sweatshirt a capuche": { es: "Sudadera con capucha", en: "Hoodie", pt: "Sweat com capuz", fr: "Sweat à capuche", it: "Felpa con cappuccio" },
  "sweatshirt a capuche zippe": { es: "Sudadera con capucha y cremallera", en: "Zip hoodie", pt: "Sweat com capuz e fecho", fr: "Sweat à capuche zippé", it: "Felpa con cappuccio e zip" },
  "t-shirt": { es: "Camiseta", en: "T-shirt", pt: "T-shirt", fr: "T-shirt", it: "T-shirt" },
  "t-shirt manches longues": { es: "Camiseta de manga larga", en: "Long-sleeve t-shirt", pt: "T-shirt de manga comprida", fr: "T-shirt manches longues", it: "T-shirt a maniche lunghe" },
  "top de entrenamiento con 1/4 de cremallera": { es: "Top de entrenamiento con cremallera 1/4", en: "Quarter-zip training top", pt: "Top de treino com fecho 1/4", fr: "Haut d'entraînement 1/4 zip", it: "Top da allenamento con zip 1/4" },
  "veste": { es: "Chaqueta", en: "Jacket", pt: "Casaco", fr: "Veste", it: "Giacca" },
  "veste de presentation": { es: "Chaqueta de presentación", en: "Presentation jacket", pt: "Casaco de apresentação", fr: "Veste de présentation", it: "Giacca da presentazione" },
  "veste de survetement": { es: "Chaqueta de chándal", en: "Track jacket", pt: "Casaco de fato de treino", fr: "Veste de survêtement", it: "Giacca della tuta" },
  "veste de survetement zippee": { es: "Chaqueta de chándal con cremallera", en: "Zip track jacket", pt: "Casaco de fato de treino com fecho", fr: "Veste de survêtement zippée", it: "Giacca della tuta con zip" },
  "veste impermeable": { es: "Chaqueta impermeable", en: "Waterproof jacket", pt: "Casaco impermeável", fr: "Veste imperméable", it: "Giacca impermeabile" },
};

// Modificadores que van pegados al final del prefijo.
const SUFFIXES: Record<string, Record<HubLocale, string>> = {
  "a capuche": { es: "con capucha", en: "Hooded", pt: "com capuz", fr: "à capuche", it: "con cappuccio" },
  "a rayas": { es: "a rayas", en: "Striped", pt: "às riscas", fr: "à rayures", it: "a righe" },
  "a rayures": { es: "a rayas", en: "Striped", pt: "às riscas", fr: "à rayures", it: "a righe" },
  "arbitre": { es: "de árbitro", en: "Referee", pt: "de árbitro", fr: "d'arbitre", it: "da arbitro" },
  "avec poids": { es: "con peso", en: "Weighted", pt: "com peso", fr: "avec poids", it: "con peso" },
  "con capucha": { es: "con capucha", en: "Hooded", pt: "com capuz", fr: "à capuche", it: "con cappuccio" },
  "con peso": { es: "con peso", en: "Weighted", pt: "com peso", fr: "avec poids", it: "con peso" },
  "d'entrainement": { es: "de entrenamiento", en: "Training", pt: "de treino", fr: "d'entraînement", it: "da allenamento" },
  "de algodon": { es: "de algodón", en: "Cotton", pt: "de algodão", fr: "en coton", it: "in cotone" },
  "de arbitro": { es: "de árbitro", en: "Referee", pt: "de árbitro", fr: "d'arbitre", it: "da arbitro" },
  "de compresion": { es: "de compresión", en: "Compression", pt: "de compressão", fr: "de compression", it: "a compressione" },
  "de compression": { es: "de compresión", en: "Compression", pt: "de compressão", fr: "de compression", it: "a compressione" },
  "de entrenamiento": { es: "de entrenamiento", en: "Training", pt: "de treino", fr: "d'entraînement", it: "da allenamento" },
  "de football": { es: "de fútbol", en: "Football", pt: "de futebol", fr: "de football", it: "da calcio" },
  "de futbol": { es: "de fútbol", en: "Football", pt: "de futebol", fr: "de football", it: "da calcio" },
  "de gardien": { es: "de portero", en: "Goalkeeper", pt: "de guarda-redes", fr: "de gardien", it: "da portiere" },
  "de malla": { es: "de malla", en: "Mesh", pt: "em rede", fr: "en mesh", it: "in rete" },
  "de mujer": { es: "de mujer", en: "women's", pt: "de mulher", fr: "femme", it: "da donna" },
  "de portero": { es: "de portero", en: "Goalkeeper", pt: "de guarda-redes", fr: "de gardien", it: "da portiere" },
  "en mesh": { es: "de malla", en: "Mesh", pt: "em rede", fr: "en mesh", it: "in rete" },
  "enfant": { es: "infantil", en: "Kids'", pt: "para criança", fr: "enfant", it: "per bambini" },
  "femme": { es: "de mujer", en: "women's", pt: "de mulher", fr: "femme", it: "da donna" },
  "fluo": { es: "fluorescente", en: "Fluorescent", pt: "fluorescente", fr: "fluo", it: "fluorescente" },
  "fluorescente": { es: "fluorescente", en: "Fluorescent", pt: "fluorescente", fr: "fluo", it: "fluorescente" },
  "mujer": { es: "de mujer", en: "women's", pt: "de mulher", fr: "femme", it: "da donna" },
  "para mujer": { es: "de mujer", en: "women's", pt: "de mulher", fr: "femme", it: "da donna" },
  "para ninos": { es: "infantil", en: "Kids'", pt: "para criança", fr: "enfant", it: "per bambini" },
  "reversible": { es: "reversible", en: "Reversible", pt: "reversível", fr: "réversible", it: "reversibile" },
};

// Los 29 valores de color que existen en el catálogo.
const COLOURS: Record<string, Record<HubLocale, string>> = {
  "amarillo": { es: "Amarillo", en: "Yellow", pt: "Amarelo", fr: "Jaune", it: "Giallo" },
  "argente": { es: "Plateado", en: "Silver", pt: "Prateado", fr: "Argenté", it: "Argento" },
  "azul": { es: "Azul", en: "Blue", pt: "Azul", fr: "Bleu", it: "Blu" },
  "beige": { es: "Beige", en: "Beige", pt: "Bege", fr: "Beige", it: "Beige" },
  "blanc": { es: "Blanco", en: "White", pt: "Branco", fr: "Blanc", it: "Bianco" },
  "blanco": { es: "Blanco", en: "White", pt: "Branco", fr: "Blanc", it: "Bianco" },
  "blau": { es: "Azul", en: "Blue", pt: "Azul", fr: "Bleu", it: "Blu" },
  "bleu": { es: "Azul", en: "Blue", pt: "Azul", fr: "Bleu", it: "Blu" },
  "dore": { es: "Dorado", en: "Gold", pt: "Dourado", fr: "Doré", it: "Oro" },
  "gris": { es: "Gris", en: "Grey", pt: "Cinzento", fr: "Gris", it: "Grigio" },
  "jaune": { es: "Amarillo", en: "Yellow", pt: "Amarelo", fr: "Jaune", it: "Giallo" },
  "marron": { es: "Marrón", en: "Brown", pt: "Castanho", fr: "Marron", it: "Marrone" },
  "multicolor": { es: "Multicolor", en: "Multicolour", pt: "Multicor", fr: "Multicolore", it: "Multicolore" },
  "multicolore": { es: "Multicolor", en: "Multicolour", pt: "Multicor", fr: "Multicolore", it: "Multicolore" },
  "naranja": { es: "Naranja", en: "Orange", pt: "Laranja", fr: "Orange", it: "Arancione" },
  "negro": { es: "Negro", en: "Black", pt: "Preto", fr: "Noir", it: "Nero" },
  "noir": { es: "Negro", en: "Black", pt: "Preto", fr: "Noir", it: "Nero" },
  "orange": { es: "Naranja", en: "Orange", pt: "Laranja", fr: "Orange", it: "Arancione" },
  "plata": { es: "Plateado", en: "Silver", pt: "Prateado", fr: "Argenté", it: "Argento" },
  "rojo": { es: "Rojo", en: "Red", pt: "Vermelho", fr: "Rouge", it: "Rosso" },
  "rose": { es: "Rosa", en: "Pink", pt: "Rosa", fr: "Rose", it: "Rosa" },
  "rouge": { es: "Rojo", en: "Red", pt: "Vermelho", fr: "Rouge", it: "Rosso" },
  "turquoise": { es: "Turquesa", en: "Turquoise", pt: "Turquesa", fr: "Turquoise", it: "Turchese" },
  "verde": { es: "Verde", en: "Green", pt: "Verde", fr: "Vert", it: "Verde" },
  "vert": { es: "Verde", en: "Green", pt: "Verde", fr: "Vert", it: "Verde" },
  "violet": { es: "Violeta", en: "Purple", pt: "Roxo", fr: "Violet", it: "Viola" },
  "weiss": { es: "Blanco", en: "White", pt: "Branco", fr: "Blanc", it: "Bianco" },
};

function norm(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function localizeGearColour(colour: string, locale: HubLocale): string {
  return COLOURS[norm(colour)]?.[locale] ?? colour;
}

/** Traduce el sustantivo inicial y el color final; deja marca y modelo
 *  intactos. Si el prefijo no está en el glosario devuelve el título tal
 *  cual -- mejor el texto real del comercio que una traducción a medias. */
export function localizeGearModel(
  model: string,
  brand: string,
  locale: HubLocale,
): string {
  let rest = model;
  let tail = "";
  const cut = model.lastIndexOf(" - ");
  if (cut > 0) {
    const colour = model.slice(cut + 3);
    const t = COLOURS[norm(colour)]?.[locale];
    if (t) {
      rest = model.slice(0, cut);
      tail = ` - ${t}`;
    }
  }
  const at = norm(rest).indexOf(norm(brand));
  if (!brand || at <= 0) return rest + tail;
  // El prefijo se mide sobre el texto normalizado, que puede tener otra
  // longitud que el original (acentos compuestos), así que se recorta por
  // cantidad de palabras, no por índice de carácter.
  const words = rest.trim().split(/\s+/);
  const prefixWords = norm(rest).slice(0, at).trim().split(/\s+/).length;
  const head = words.slice(0, prefixWords).join(" ");
  const after = words.slice(prefixWords).join(" ");
  const key = norm(head);
  let out = TERMS[key]?.[locale];
  if (!out) {
    for (const [suf, tr] of Object.entries(SUFFIXES)) {
      if (!key.endsWith(` ${suf}`)) continue;
      const base = TERMS[key.slice(0, -suf.length - 1)]?.[locale];
      if (base) {
        // En inglés el modificador va delante ("Women's shorts"), en el
        // resto detrás ("Pantalón corto de mujer").
        out =
          locale === "en"
            ? `${tr.en.charAt(0).toUpperCase()}${tr.en.slice(1)} ${base.charAt(0).toLowerCase()}${base.slice(1)}`
            : `${base} ${tr[locale]}`;
        break;
      }
    }
  }
  if (!out) return rest + tail;
  return `${out}${after ? ` ${after}` : ""}${tail}`;
}
