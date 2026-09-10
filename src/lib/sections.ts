// Las 6 secciones del catálogo (5 de camisetas + botas), compartidas
// entre HeroCarousel y CategorySections para no repetir las mismas fotos
// curadas dos veces. El índice de cada entrada coincide con el índice de
// heroSlides en translations.ts -- mismo orden en los dos lugares.
export const SECTION_PATHS = ["/selecciones", "/clubes", "/retro", "/mujer", "/ninos", "/botas"] as const;

// Fotos para los círculos de navegación (CategorySections/SectionsMenu):
// foto real de producto puesta en modelo (fondo de estudio), pensada
// para que un recorte CENTRADO (el círculo recorta parejo en las 4
// direcciones desde el centro) siempre caiga sobre la persona. A
// propósito NO son las mismas fotos anchas de campaña que usa el hero
// (HERO_PHOTOS, más abajo): esas tienen a la persona corrida a un
// costado adrede para dejarle aire al texto, que es exactamente lo
// contrario de lo que necesita un recorte centrado chiquito. Cada URL
// se descargó y se miró antes de usarla.
export const SECTION_PHOTOS: string[] = [
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/Source_Max_2560/706949_v2.jpg", // selecciones: campaña "largest ever collection of home kits" (camisetas colgadas, cielo real)
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/1326ee23fe114676909df9508f1e3b61_9366/Camiseta_primera_equipacion_de_Boca_Juniors_25-26_Azul_JJ4298_21_model.jpg",
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/1eb1081d24de4c72a3aba41d9be1025b_9366/Camiseta_segunda_equipacion_Newcastle_United_FC_95-96_Azul_JM8252_21_model.jpg",
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/94ae188e712c487f9e28e47fcc83803b_9366/Camiseta_primera_equipacion_Alemania_2007_Blanco_KD3997_21_model.jpg",
  "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jy7585_3_apparel_on_model_standard_view_white.webp",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/Source_Max_2560/711064.jpg", // botas: campaña Predator/F50 "Choose a Side" (Jude Bellingham con la bota real, fondo de campaña)
];

// Fotos anchas de campaña real de prensa oficial (adidas news /
// thenewsmarket, mismo origen que ya se usaba para selecciones/botas)
// para el banner del hero -- a diferencia de SECTION_PHOTOS (fotos de
// producto cuadradas de estudio, con la persona centrada), estas están
// compuestas de verdad para un formato panorámico: sujeto corrido a un
// costado, con aire real alrededor. Eso es lo que hace que "cover" en
// un recuadro ancho sea seguro acá y no lo era con las fotos de
// estudio (ver el bug documentado en SECTION_HERO_FIT).
//
// Clubes: adidas + Real Madrid, jugadores reales con la camiseta
// puesta en el túnel del estadio (Real Madrid pega más que Liverpool
// en una audiencia de habla hispana -- reemplazo pedido explícitamente
// por el usuario, la primera foto de Liverpool no gustó)
// (news.adidas.com/football/adidas-and-real-madrid-reveal-white-home-kit-rooted-in-tradition-for-2024-25-season)
// Retro: adidas + Arsenal, "Bring-Back" 1992-94 (colección retro real)
// (news.adidas.com/football/adidas-and-arsenal-launch-iconic-1992-1994-bring-back-home-jersey)
// Mujer: adidas + Arsenal Women, segunda equipación real puesta por
// varias jugadoras del plantel (Blackstenius, Miedema, Maanum, etc.),
// repartidas en todo el ancho de la foto -- así que siempre hay alguna
// con la camiseta bien visible caiga donde caiga el degradé del texto
// (news.adidas.com/football/adidas-and-arsenal-unveil-first-away-kit-with-stella-mccartney-for-arsenal-women)
// Niños: chico real con la camiseta infantil de Real Madrid puesta,
// de la sesión "family photo" del lanzamiento 2023/24 (reemplazo
// pedido explícitamente, la foto de Son Heung-Min no gustó)
// (news.adidas.com/football/adidas-and-real-madrid-unveil-new-home-jersey-for-2023-24-season)
// Botas: F50 SPARKFUSION (bota de fútbol femenino real), sin persona
// -- foto de producto puro sobre un fondo de cielo/atardecer real en
// gradiente (naranja/rosa/celeste), reflejo incluido. Se probaron 2
// fotos CON persona (Messi, Bellingham) y las dos tenían el mismo
// problema real: el jugador queda centrado en la foto original, casi
// sin margen para sacarlo del degradé del texto -- lo poco que se veía
// era cara tapada/opaca y fondo vacío, reportado dos veces por el
// usuario con captura. Esta foto no tiene ese riesgo porque no depende
// de dónde cae una persona: el fondo en sí ya es rico en color en todo
// el ancho, y con object-position "50% 50%" la suela de la bota (con
// sus colores) queda justo en el borde de la zona visible.
// (news.adidas.com/football/adidas-launches-f50-sparkfusion---a-boot-built-by-and-for-women-s-football-players)
//
// Todas las candidatas se probaron con un overlay que reproduce el
// degradé real (mismo gradient CSS que el slide) sobre las dos medidas
// reales del banner (1736x460 escritorio, ~360x300 celular) -- no
// alcanza con mirar la foto sola: la primera candidata de mujer (un
// tríptico) se veía perfecta así pero la camiseta quedaba tapada por
// el degradé al probarla con el ancho real de escritorio (ver
// historial de commits).
export const HERO_PHOTOS: string[] = [
  SECTION_PHOTOS[0],
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/669240_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/705622_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/650936_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/644816.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/696580.jpg",
];

// Bug real, encontrado inspeccionando el render en vivo (no a ojo): en
// una foto CUADRADA de estudio con la persona centrada, el recorte
// object-cover en un recuadro ancho SOLO recorta arriba/abajo (nunca a
// los costados, porque el ancho ya encaja justo) -- así que la persona
// siempre queda centrada horizontalmente en el recuadro final, caiga
// donde caiga el degradé oscuro que necesita el texto. Con las 6 fotos
// de campaña reales de HERO_PHOTOS esto deja de ser un problema porque
// la composición ya es panorámica de origen, con gente repartida en
// todo el ancho -- verificado con el overlay+degradé real descrito
// arriba antes de aplicarlas, no solo a ojo en una resolución.
export const SECTION_HERO_FIT: ("cover" | "contain")[] = ["cover", "cover", "cover", "cover", "cover", "cover"];

// object-position por foto cuando fit=="cover" -- la mayoría centradas
// arriba (object-top), que es donde vive la cara/torso en las fotos de
// campaña reales usadas acá. Dos excepciones, las dos probadas con
// varios valores contra el degradé real antes de elegir:
// - Niños: con "top" sólo se veía la cara del chico y una tira mínima
//   del cuello de la camiseta (reportado por el usuario) -- corrido a
//   "50% 40%" baja la ventana visible lo suficiente para que se lea
//   "Emirates Fly Better" y el escudo en el pecho, sin perder la
//   cabeza del cuadro (probado a 0/10/20/30/40/50%).
// - Botas: con "top" sólo entraba cielo, la bota quedaba fuera del
//   recuadro por arriba -- "50% 50%" trae la suela de la bota justo al
//   borde de la zona visible (probado top/30%/50%/70%/bottom).
export const SECTION_HERO_POSITION: string[] = ["top", "top", "top", "top", "50% 40%", "50% 50%"];

// Transform extra (solo Botas): pedido explícito del usuario -- quería
// ver más de las dos botas, no sólo la suela asomando en el borde del
// degradé. En un recuadro tan ancho como el nuestro, object-position
// horizontal no tiene ningún efecto real (cover ya usa el 100% del
// ancho para encajar, sin margen para correr la foto a los costados --
// mismo motivo por el que el resto de las fotos usan "top" nomás,
// nunca un %X). Para poder correr la imagen de verdad hace falta crear
// ese margen a propósito: achicándola un poco de más (scale > 1) y
// después desplazándola (translateX) dentro de ese margen extra -- acá
// sí funciona porque el transform se aplica DESPUÉS del recorte de
// cover, no depende de su matemática. Valores elegidos probando varias
// combinaciones con el degradé real superpuesto (1.15/1.2/1.3 de
// escala x 0%/6%/8%/12% de desplazamiento): 1.2/8% mostraba las dos
// botas con buen detalle (raya de adidas en la de arriba, suela con
// colores en la de abajo) sin comerse todo el degradé de cielo.
export const SECTION_HERO_TRANSFORM: (string | undefined)[] = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  "scale(1.2) translateX(8%)",
];
