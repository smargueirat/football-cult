// Las 6 secciones del catálogo (5 de camisetas + botas), compartidas
// entre HeroCarousel y CategorySections para no repetir las mismas fotos
// curadas dos veces. El índice de cada entrada coincide con el índice de
// heroSlides en translations.ts -- mismo orden en los dos lugares.
export const SECTION_PATHS = ["/selecciones", "/clubes", "/retro", "/mujer", "/ninos", "/botas"] as const;

// Foto real curada a mano por sección (apparel-on-model para camisetas,
// mejor foto de producto real disponible para botas -- ver nota en
// HeroCarousel.tsx). Cada URL se descargó y se miró antes de usarla.
export const SECTION_PHOTOS: string[] = [
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/cb30bb7e33dc49afa7d3dcb0da3bdb4a_9366/Camiseta_primera_equipacion_Colombia_26_Amarillo_JL6972_21_model.jpg",
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/1326ee23fe114676909df9508f1e3b61_9366/Camiseta_primera_equipacion_de_Boca_Juniors_25-26_Azul_JJ4298_21_model.jpg",
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/1eb1081d24de4c72a3aba41d9be1025b_9366/Camiseta_segunda_equipacion_Newcastle_United_FC_95-96_Azul_JM8252_21_model.jpg",
  "https://assets.adidas.com/images/w_1080,h_1080,f_auto,q_auto:sensitive,fl_lossy/94ae188e712c487f9e28e47fcc83803b_9366/Camiseta_primera_equipacion_Alemania_2007_Blanco_KD3997_21_model.jpg",
  "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jy7585_3_apparel_on_model_standard_view_white.webp",
  "https://www.futbolemotion.com/imagesarticulos/327349/750/bota-adidas-predator-elite-ft-ag-tursol-croter-core-black-1.jpg",
];
