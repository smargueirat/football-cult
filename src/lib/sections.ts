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
// Mujer: campaña real de fútbol femenino adidas, panel izquierdo con
// la camiseta de Alemania puesta -- misma fuente que el resto
// (preview.thenewsmarket.com/Previews/ADID/StillAssets)
//
// Niños: no se encontró una foto de campaña ancha comparable (las
// candidatas reales -- ej. la gira juvenil de Son Heung-Min -- o
// recortaban mal en celular o eran fotos de grupo muy apretadas sin
// aire para el texto), así que se queda con la foto de producto +
// "contain" (ver SECTION_HERO_FIT), ya verificado sin recorte.
export const HERO_PHOTOS: string[] = [
  SECTION_PHOTOS[0],
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/700469_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/705622_v2.jpg",
  "https://preview.thenewsmarket.com/Previews/ADID/StillAssets/1920x1080/646509_v2.jpg",
  SECTION_PHOTOS[4],
  SECTION_PHOTOS[5],
];

// Bug real, encontrado inspeccionando el render en vivo (no a ojo): en
// una foto CUADRADA de estudio con la persona centrada, el recorte
// object-cover en un recuadro ancho SOLO recorta arriba/abajo (nunca a
// los costados, porque el ancho ya encaja justo) -- así que la persona
// siempre queda centrada horizontalmente en el recuadro final, caiga
// donde caiga el degradé oscuro que necesita el texto. Con las fotos de
// campaña reales (HERO_PHOTOS) esto deja de ser un problema porque la
// composición ya es panorámica de origen -- verificado con overlays
// aislados a los dos anchos reales (460px desktop / 300px mobile) antes
// de aplicarlas, no solo a ojo en una resolución. Niños se queda en
// "contain" (sin foto de campaña real disponible, ver arriba).
export const SECTION_HERO_FIT: ("cover" | "contain")[] = ["cover", "cover", "cover", "cover", "contain", "cover"];

// object-position por foto quand fit=="cover". Todas centradas
// arriba salvo mujer: es una foto compuesta en 3 paneles verticales
// (club nocturno / bosque / heladera de bebidas) y la camiseta real
// (panel izquierdo) sólo entra completa en el recorte angosto de
// celular si el recorte arranca pegado al borde izquierdo -- "top"
// centrado dejaba la camiseta afuera y mostraba los paneles 2/3, que
// no tienen ninguna camiseta puesta. Verificado con overlays aislados
// a 380x300 (celular) probando 0%/15%/25%/50% antes de elegir esta.
export const SECTION_HERO_POSITION: string[] = ["top", "top", "top", "left top", "center", "top"];
