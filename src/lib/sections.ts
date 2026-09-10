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
// Clubes: adidas + Liverpool FC, lanzamiento camisetas 25/26
// (news.adidas.com/football/adidas-and-liverpool-fc-launch-new-home-and-away-jerseys-for-the-2025-26-season)
// Retro: adidas + Arsenal, "Bring-Back" 1992-94 (colección retro real)
// (news.adidas.com/football/adidas-and-arsenal-launch-iconic-1992-1994-bring-back-home-jersey)
// Mujer: adidas + Arsenal Women, segunda equipación real puesta por
// varias jugadoras del plantel (Blackstenius, Miedema, Maanum, etc.),
// repartidas en todo el ancho de la foto -- así que siempre hay alguna
// con la camiseta bien visible caiga donde caiga el degradé del texto
// (news.adidas.com/football/adidas-and-arsenal-unveil-first-away-kit-with-stella-mccartney-for-arsenal-women)
// Niños: gira juvenil de Son Heung-Min con un club de Londres, tres
// juveniles con la camiseta puesta repartidos en el ancho igual que
// arriba (news.adidas.com/ss25/adidas-icon--son-heung-min--surprises-london-youth-football-organisation)
//
// Las 4 candidatas se probaron con un overlay que reproduce el degradé
// real (mismo gradient CSS que el slide) sobre las dos medidas reales
// del banner (1736x460 escritorio, ~360x300 celular) -- no alcanza con
// mirar la foto sola: la primera candidata de mujer (un tríptico) se
// veía perfecta así pero la camiseta quedaba tapada por el degradé al
// probarla con el ancho real de escritorio (ver historial de commits).
export const HERO_PHOTOS: string[] = [
  SECTION_PHOTOS[0],
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/700469_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/705622_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/650936_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/688997.jpg",
  SECTION_PHOTOS[5],
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

// object-position por foto cuando fit=="cover" -- todas centradas
// arriba (object-top), que es donde vive la cara/torso en las fotos de
// campaña reales usadas acá.
export const SECTION_HERO_POSITION: string[] = ["top", "top", "top", "top", "top", "top"];
