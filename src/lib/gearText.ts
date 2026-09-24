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
// el catálogo, no una traducción automática: cubre el 75% de los prefijos
// (47% de los productos; el resto ya empieza por la marca) y el 100% de
// los colores; lo que no está se muestra tal cual
// venía. De paso corrige traducciones malas del propio feed español
// ("Cono de accionamiento" por cono de entrenamiento, "Sudor" por sudadera,
// "silbato de zorro" por silbato Fox, "Casulla" por peto).


// Prefijo canónico (sin acentos, en minúsculas) -> nombre por idioma.
const TERMS: Record<string, Record<HubLocale, string>> = {
  "accesorio para porterias de futbol": { es: "Accesorio para porterías", en: "Goal accessory", pt: "Acessório para balizas", fr: "Accessoire de but", it: "Accessorio per porte" },
  "accessoire but de football": { es: "Accesorio para porterías", en: "Goal accessory", pt: "Acessório para balizas", fr: "Accessoire de but", it: "Accessorio per porte" },
  "aro": { es: "Aro", en: "Hoop", pt: "Arco", fr: "Cerceau", it: "Cerchio" },
  "aro con peso": { es: "Aro con peso", en: "Weighted hoop", pt: "Arco com peso", fr: "Cerceau avec poids", it: "Cerchio con peso" },
  "aro magnetico con peso y contador": { es: "Aro magnético con peso y contador", en: "Weighted magnetic hoop with counter", pt: "Arco magnético com peso e contador", fr: "Cerceau magnétique avec poids et compteur", it: "Cerchio magnetico con peso e contatore" },
  "ballon de football": { es: "Balón de fútbol", en: "Football", pt: "Bola de futebol", fr: "Ballon de football", it: "Pallone da calcio" },
  "balon de futbol": { es: "Balón de fútbol", en: "Football", pt: "Bola de futebol", fr: "Ballon de football", it: "Pallone da calcio" },
  "balones de futbol": { es: "Balón de fútbol", en: "Football", pt: "Bola de futebol", fr: "Ballon de football", it: "Pallone da calcio" },
  "banda de resistencia": { es: "Banda de resistencia", en: "Resistance band", pt: "Banda de resistência", fr: "Bande de résistance", it: "Banda di resistenza" },
  "banda de resistencia de tela": { es: "Banda de resistencia de tela", en: "Fabric resistance band", pt: "Banda de resistência em tecido", fr: "Bande de résistance en tissu", it: "Banda di resistenza in tessuto" },
  "banda de resistencia terapeutica": { es: "Banda de resistencia terapéutica", en: "Therapy resistance band", pt: "Banda de resistência terapêutica", fr: "Bande de résistance thérapeutique", it: "Banda di resistenza terapeutica" },
  "banda elastica multiple": { es: "Banda elástica múltiple", en: "Multi-loop resistance band", pt: "Banda elástica múltipla", fr: "Multi-bande de résistance", it: "Banda elastica multipla" },
  "bandas elasticas": { es: "Bandas elásticas", en: "Resistance bands", pt: "Bandas elásticas", fr: "Bandes élastiques", it: "Bande elastiche" },
  "bande de resistance": { es: "Banda de resistencia", en: "Resistance band", pt: "Banda de resistência", fr: "Bande de résistance", it: "Banda di resistenza" },
  "bas": { es: "Calcetines", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "bolsa": { es: "Bolsa", en: "Bag", pt: "Saco", fr: "Sac", it: "Borsa" },
  "bolsa de deporte": { es: "Bolsa de deporte", en: "Sports bag", pt: "Saco de desporto", fr: "Sac de sport", it: "Borsa sportiva" },
  "brassard de capitaine": { es: "Brazalete de capitán", en: "Captain's armband", pt: "Braçadeira de capitão", fr: "Brassard de capitaine", it: "Fascia da capitano" },
  "brazalete de capitan": { es: "Brazalete de capitán", en: "Captain's armband", pt: "Braçadeira de capitão", fr: "Brassard de capitaine", it: "Fascia da capitano" },
  "calcetines": { es: "Calcetines", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "calcetines de 3 rayas": { es: "Calcetines de 3 rayas", en: "3-stripe socks", pt: "Meias de 3 riscas", fr: "Chaussettes 3 bandes", it: "Calzettoni a 3 strisce" },
  "calcetines de futbol": { es: "Calcetines de fútbol", en: "Football socks", pt: "Meias de futebol", fr: "Chaussettes de football", it: "Calzettoni da calcio" },
  "calcetines tecnicos antideslizantes": { es: "Calcetines técnicos antideslizantes", en: "Non-slip technical socks", pt: "Meias técnicas antiderrapantes", fr: "Chaussettes techniques antidérapantes", it: "Calzettoni tecnici antiscivolo" },
  "camiseta": { es: "Camiseta", en: "Shirt", pt: "Camisola", fr: "Maillot", it: "Maglia" },
  "camiseta de compresion": { es: "Camiseta de compresión", en: "Compression shirt", pt: "Camisola de compressão", fr: "Maillot de compression", it: "Maglia a compressione" },
  "camiseta de manga larga": { es: "Camiseta de manga larga", en: "Long-sleeve shirt", pt: "Camisola de manga comprida", fr: "Maillot manches longues", it: "Maglia a maniche lunghe" },
  "camiseta interior de manga larga": { es: "Camiseta interior de manga larga", en: "Long-sleeve base layer", pt: "Camisola interior de manga comprida", fr: "Sous-maillot manches longues", it: "Maglia intima a maniche lunghe" },
  "carta tactica": { es: "Pizarra táctica", en: "Tactics board", pt: "Quadro tático", fr: "Tableau tactique", it: "Lavagna tattica" },
  "casulla": { es: "Peto", en: "Training bib", pt: "Colete de treino", fr: "Chasuble", it: "Casacca" },
  "cerceau magnetique avec poids et compteur": { es: "Aro magnético con peso y contador", en: "Weighted magnetic hoop with counter", pt: "Arco magnético com peso e contador", fr: "Cerceau magnétique avec poids et compteur", it: "Cerchio magnetico con peso e contatore" },
  "chaleco": { es: "Chaleco", en: "Gilet", pt: "Colete", fr: "Gilet", it: "Gilet" },
  "chaqueta": { es: "Chaqueta", en: "Jacket", pt: "Casaco", fr: "Veste", it: "Giacca" },
  "chaqueta con capucha": { es: "Chaqueta con capucha", en: "Hooded jacket", pt: "Casaco com capuz", fr: "Veste à capuche", it: "Giacca con cappuccio" },
  "chaqueta con cremallera 1/4": { es: "Chaqueta con cremallera 1/4", en: "Quarter-zip jacket", pt: "Casaco com fecho 1/4", fr: "Veste 1/4 zip", it: "Giacca con zip 1/4" },
  "chaqueta de chandal": { es: "Chaqueta de chándal", en: "Track jacket", pt: "Casaco de fato de treino", fr: "Veste de survêtement", it: "Giacca della tuta" },
  "chaqueta de chandal con capucha": { es: "Chaqueta de chándal con capucha", en: "Hooded track jacket", pt: "Casaco de fato de treino com capuz", fr: "Veste de survêtement à capuche", it: "Giacca della tuta con cappuccio" },
  "chaqueta de presentacion": { es: "Chaqueta de presentación", en: "Presentation jacket", pt: "Casaco de apresentação", fr: "Veste de présentation", it: "Giacca da presentazione" },
  "chaqueta impermeable": { es: "Chaqueta impermeable", en: "Waterproof jacket", pt: "Casaco impermeável", fr: "Veste imperméable", it: "Giacca impermeabile" },
  "chasuble": { es: "Peto", en: "Training bib", pt: "Colete de treino", fr: "Chasuble", it: "Casacca" },
  "chasuble en mesh": { es: "Peto de malla", en: "Mesh training bib", pt: "Colete de treino em rede", fr: "Chasuble en mesh", it: "Casacca in rete" },
  "chaussettes": { es: "Calcetines", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "chaussettes de football": { es: "Calcetines de fútbol", en: "Football socks", pt: "Meias de futebol", fr: "Chaussettes de football", it: "Calzettoni da calcio" },
  "chubasquero": { es: "Chubasquero", en: "Rain jacket", pt: "Corta-vento impermeável", fr: "Coupe-vent imperméable", it: "Giacca antipioggia" },
  "cobertura": { es: "Funda", en: "Cover", pt: "Cobertura", fr: "Housse", it: "Copertura" },
  "cojin de pelota": { es: "Aguja para balones", en: "Ball inflation needle", pt: "Agulha para bolas", fr: "Aiguille à ballon", it: "Ago per palloni" },
  "cone d'entrainement": { es: "Cono de entrenamiento", en: "Training cone", pt: "Cone de treino", fr: "Cône d'entraînement", it: "Cono da allenamento" },
  "conjunto de camisa y pantalon corto": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "conjunto de camiseta de entrenamiento y pantalon corto": { es: "Conjunto de camiseta de entrenamiento y pantalón corto", en: "Training shirt and shorts kit", pt: "Conjunto de camisola de treino e calção", fr: "Ensemble maillot d'entraînement et short", it: "Completo maglia da allenamento e pantaloncini" },
  "conjunto de camiseta y pantalon corto": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "conjunto de camiseta, pantalon corto y calcetas": { es: "Conjunto de camiseta, pantalón corto y calcetines", en: "Shirt, shorts and socks kit", pt: "Conjunto de camisola, calção e meias", fr: "Ensemble maillot, short et chaussettes", it: "Completo maglia, pantaloncini e calzettoni" },
  "conjunto de polo y pantalon pantalon corto": { es: "Conjunto de polo y pantalón corto", en: "Polo and shorts kit", pt: "Conjunto de polo e calção", fr: "Ensemble polo et short", it: "Completo polo e pantaloncini" },
  "conjunto de portero": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien", it: "Completo da portiere" },
  "conjunto de trajes de bano": { es: "Conjunto de baño", en: "Swim set", pt: "Conjunto de banho", fr: "Ensemble de bain", it: "Completo da bagno" },
  "conjunto guardian": { es: "Conjunto de portero", en: "Goalkeeper kit", pt: "Conjunto de guarda-redes", fr: "Ensemble gardien", it: "Completo da portiere" },
  "cono de accionamiento": { es: "Cono de entrenamiento", en: "Training cone", pt: "Cone de treino", fr: "Cône d'entraînement", it: "Cono da allenamento" },
  "cono de entrenamiento": { es: "Cono de entrenamiento", en: "Training cone", pt: "Cone de treino", fr: "Cône d'entraînement", it: "Cono da allenamento" },
  "cortavientos": { es: "Cortavientos", en: "Windbreaker", pt: "Corta-vento", fr: "Coupe-vent", it: "Giacca antivento" },
  "coupe-vent": { es: "Cortavientos", en: "Windbreaker", pt: "Corta-vento", fr: "Coupe-vent", it: "Giacca antivento" },
  "cuissard": { es: "Malla corta", en: "Compression shorts", pt: "Calções de compressão", fr: "Cuissard", it: "Pantaloncini a compressione" },
  "ensemble maillot et short": { es: "Conjunto de camiseta y pantalón corto", en: "Shirt and shorts kit", pt: "Conjunto de camisola e calção", fr: "Ensemble maillot et short", it: "Completo maglia e pantaloncini" },
  "equipo de entrenamiento": { es: "Equipo de entrenamiento", en: "Training equipment", pt: "Equipamento de treino", fr: "Matériel d'entraînement", it: "Attrezzatura da allenamento" },
  "espinilleras": { es: "Espinilleras", en: "Shin guards", pt: "Caneleiras", fr: "Protège-tibias", it: "Parastinchi" },
  "futbol formativo": { es: "Fútbol base", en: "Youth football", pt: "Futebol de formação", fr: "Football des jeunes", it: "Calcio giovanile" },
  "gants de gardien": { es: "Guantes de portero", en: "Goalkeeper gloves", pt: "Luvas de guarda-redes", fr: "Gants de gardien", it: "Guanti da portiere" },
  "guantes de portero": { es: "Guantes de portero", en: "Goalkeeper gloves", pt: "Luvas de guarda-redes", fr: "Gants de gardien", it: "Guanti da portiere" },
  "kit": { es: "Kit", en: "Kit", pt: "Kit", fr: "Kit", it: "Kit" },
  "legging": { es: "Mallas", en: "Leggings", pt: "Leggings", fr: "Legging", it: "Leggings" },
  "lot de 6 chaussettes": { es: "Pack de 6 pares de calcetines", en: "Pack of 6 socks", pt: "Pack de 6 meias", fr: "Lot de 6 chaussettes", it: "Confezione da 6 calzettoni" },
  "lote de 5 petos numerados del 1 al 5": { es: "Lote de 5 petos numerados del 1 al 5", en: "Set of 5 training bibs numbered 1 to 5", pt: "Conjunto de 5 coletes numerados de 1 a 5", fr: "Lot de 5 chasubles numérotés de 1 à 5", it: "Set di 5 casacche numerate da 1 a 5" },
  "lote de 5 petos numerados del 11 al 15": { es: "Lote de 5 petos numerados del 11 al 15", en: "Set of 5 training bibs numbered 11 to 15", pt: "Conjunto de 5 coletes numerados de 11 a 15", fr: "Lot de 5 chasubles numérotés de 11 à 15", it: "Set di 5 casacche numerate da 11 a 15" },
  "lote de 5 petos numerados del 16 al 20": { es: "Lote de 5 petos numerados del 16 al 20", en: "Set of 5 training bibs numbered 16 to 20", pt: "Conjunto de 5 coletes numerados de 16 a 20", fr: "Lot de 5 chasubles numérotés de 16 à 20", it: "Set di 5 casacche numerate da 16 a 20" },
  "lote de 5 petos numerados del 6 al 10": { es: "Lote de 5 petos numerados del 6 al 10", en: "Set of 5 training bibs numbered 6 to 10", pt: "Conjunto de 5 coletes numerados de 6 a 10", fr: "Lot de 5 chasubles numérotés de 6 à 10", it: "Set di 5 casacche numerate da 6 a 10" },
  "maillot": { es: "Camiseta", en: "Shirt", pt: "Camisola", fr: "Maillot", it: "Maglia" },
  "maillot de compression": { es: "Camiseta de compresión", en: "Compression shirt", pt: "Camisola de compressão", fr: "Maillot de compression", it: "Maglia a compressione" },
  "malla": { es: "Mallas", en: "Leggings", pt: "Leggings", fr: "Legging", it: "Leggings" },
  "mallas": { es: "Mallas", en: "Leggings", pt: "Leggings", fr: "Legging", it: "Leggings" },
  "mango de la bomba": { es: "Mango de inflador", en: "Pump handle", pt: "Punho de bomba", fr: "Poignée de pompe", it: "Impugnatura per pompa" },
  "manguito para pierna": { es: "Manguito de pierna", en: "Leg sleeve", pt: "Manguito de perna", fr: "Manchon de jambe", it: "Manicotto per gamba" },
  "material de entrenamiento": { es: "Material de entrenamiento", en: "Training equipment", pt: "Material de treino", fr: "Matériel d'entraînement", it: "Materiale da allenamento" },
  "materiel d'entrainement": { es: "Equipo de entrenamiento", en: "Training equipment", pt: "Equipamento de treino", fr: "Matériel d'entraînement", it: "Attrezzatura da allenamento" },
  "medias": { es: "Medias", en: "Socks", pt: "Meias", fr: "Chaussettes", it: "Calzettoni" },
  "medias sin pies": { es: "Medias sin pie", en: "Footless socks", pt: "Meias sem pé", fr: "Chaussettes sans pieds", it: "Calzettoni senza piede" },
  "mini banda de resistencia": { es: "Mini banda de resistencia", en: "Mini resistance band", pt: "Mini banda de resistência", fr: "Mini bande de résistance", it: "Mini banda di resistenza" },
  "mini bande de resistance": { es: "Mini banda de resistencia", en: "Mini resistance band", pt: "Mini banda de resistência", fr: "Mini bande de résistance", it: "Mini banda di resistenza" },
  "mochila": { es: "Mochila", en: "Backpack", pt: "Mochila", fr: "Sac à dos", it: "Zaino" },
  "multi-bande de resistance": { es: "Banda elástica múltiple", en: "Multi-loop resistance band", pt: "Banda elástica múltipla", fr: "Multi-bande de résistance", it: "Banda elastica multipla" },
  "pack de 6 calcetines de futbol": { es: "Pack de 6 pares de calcetines de fútbol", en: "Pack of 6 football socks", pt: "Pack de 6 meias de futebol", fr: "Lot de 6 chaussettes de football", it: "Confezione da 6 calzettoni da calcio" },
  "pantalon": { es: "Pantalón", en: "Trousers", pt: "Calças", fr: "Pantalon", it: "Pantaloni" },
  "pantalon corto": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "pantalon corto de compresion": { es: "Pantalón corto de compresión", en: "Compression shorts", pt: "Calção de compressão", fr: "Short de compression", it: "Pantaloncini a compressione" },
  "pantalon corto de entrenamiento": { es: "Pantalón corto de entrenamiento", en: "Training shorts", pt: "Calção de treino", fr: "Short d'entraînement", it: "Pantaloncini da allenamento" },
  "pantalon corto de portero": { es: "Pantalón corto de portero", en: "Goalkeeper shorts", pt: "Calção de guarda-redes", fr: "Short de gardien", it: "Pantaloncini da portiere" },
  "pantalon corto partido": { es: "Pantalón corto de partido", en: "Match shorts", pt: "Calção de jogo", fr: "Short de match", it: "Pantaloncini da partita" },
  "pantalon de chandal": { es: "Pantalón de chándal", en: "Tracksuit bottoms", pt: "Calças de fato de treino", fr: "Pantalon de survêtement", it: "Pantaloni della tuta" },
  "pantalon de entrenamiento": { es: "Pantalón de entrenamiento", en: "Training trousers", pt: "Calças de treino", fr: "Pantalon d'entraînement", it: "Pantaloni da allenamento" },
  "pantalon de presentacion": { es: "Pantalón de presentación", en: "Presentation trousers", pt: "Calças de apresentação", fr: "Pantalon de présentation", it: "Pantaloni da presentazione" },
  "pantalon de survetement": { es: "Pantalón de chándal", en: "Tracksuit bottoms", pt: "Calças de fato de treino", fr: "Pantalon de survêtement", it: "Pantaloni della tuta" },
  "pantalones cortos": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "parka": { es: "Parka", en: "Parka", pt: "Parka", fr: "Parka", it: "Parka" },
  "peto": { es: "Peto", en: "Training bib", pt: "Colete de treino", fr: "Chasuble", it: "Casacca" },
  "peto de malla": { es: "Peto de malla", en: "Mesh training bib", pt: "Colete de treino em rede", fr: "Chasuble en mesh", it: "Casacca in rete" },
  "peto reversible": { es: "Peto reversible", en: "Reversible training bib", pt: "Colete de treino reversível", fr: "Chasuble réversible", it: "Casacca reversibile" },
  "petos": { es: "Petos", en: "Training bibs", pt: "Coletes de treino", fr: "Chasubles", it: "Casacche" },
  "plumifero": { es: "Plumífero", en: "Padded jacket", pt: "Casaco acolchoado", fr: "Doudoune", it: "Piumino" },
  "polo": { es: "Polo", en: "Polo shirt", pt: "Polo", fr: "Polo", it: "Polo" },
  "protege-tibias": { es: "Espinilleras", en: "Shin guards", pt: "Caneleiras", fr: "Protège-tibias", it: "Parastinchi" },
  "puno": { es: "Muñequera", en: "Wristband", pt: "Punho", fr: "Poignet", it: "Polsino" },
  "red": { es: "Red", en: "Net", pt: "Rede", fr: "Filet", it: "Rete" },
  "red de futbol": { es: "Red de fútbol", en: "Football net", pt: "Rede de futebol", fr: "Filet de football", it: "Rete da calcio" },
  "redes": { es: "Redes", en: "Nets", pt: "Redes", fr: "Filets", it: "Reti" },
  "resistencia elastica": { es: "Banda elástica", en: "Resistance band", pt: "Banda elástica", fr: "Bande élastique", it: "Banda elastica" },
  "sac a dos": { es: "Mochila", en: "Backpack", pt: "Mochila", fr: "Sac à dos", it: "Zaino" },
  "sac de sport": { es: "Bolsa de deporte", en: "Sports bag", pt: "Saco de desporto", fr: "Sac de sport", it: "Borsa sportiva" },
  "short": { es: "Pantalón corto", en: "Shorts", pt: "Calção", fr: "Short", it: "Pantaloncini" },
  "silbato": { es: "Silbato", en: "Whistle", pt: "Apito", fr: "Sifflet", it: "Fischietto" },
  "silbato con cuerda": { es: "Silbato con cuerda", en: "Whistle with lanyard", pt: "Apito com cordão", fr: "Sifflet avec cordon", it: "Fischietto con cordino" },
  "silbato de zorro": { es: "Silbato Fox", en: "Fox whistle", pt: "Apito Fox", fr: "Sifflet Fox", it: "Fischietto Fox" },
  "sudadera": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sudadera con capucha": { es: "Sudadera con capucha", en: "Hoodie", pt: "Sweat com capuz", fr: "Sweat à capuche", it: "Felpa con cappuccio" },
  "sudadera con capucha y cremallera": { es: "Sudadera con capucha y cremallera", en: "Zip hoodie", pt: "Sweat com capuz e fecho", fr: "Sweat à capuche zippé", it: "Felpa con cappuccio e zip" },
  "sudor": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sweat a capuche": { es: "Sudadera con capucha", en: "Hoodie", pt: "Sweat com capuz", fr: "Sweat à capuche", it: "Felpa con cappuccio" },
  "sweatshirt": { es: "Sudadera", en: "Sweatshirt", pt: "Sweatshirt", fr: "Sweatshirt", it: "Felpa" },
  "sweatshirt a capuche": { es: "Sudadera con capucha", en: "Hoodie", pt: "Sweat com capuz", fr: "Sweat à capuche", it: "Felpa con cappuccio" },
  "t-shirt": { es: "Camiseta", en: "T-shirt", pt: "T-shirt", fr: "T-shirt", it: "T-shirt" },
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
