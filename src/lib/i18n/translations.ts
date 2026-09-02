export type Locale = "es" | "en" | "pt" | "fr" | "it";

export const locales: Locale[] = ["es", "en", "pt", "fr", "it"];

export interface Translations {
  brand: string;
  brandTagline: string;
  nav: {
    search: string;
    categories: string;
    about: string;
    contact: string;
    login: string;
    favorites: string;
    shipTo: string;
  };
  countryPanel: {
    title: string;
    note: string;
    notAvailable: string;
    searchPlaceholder: string;
    noMatches: string;
  };
  favoritesPanel: {
    empty: string;
    title: string;
    viewAll: string;
  };
  favoritesPage: {
    title: string;
    empty: string;
    browse: string;
    priceAlertNote: string;
  };
  loginPanel: {
    title: string;
    text: string;
    googleCta: string;
    or: string;
    emailPlaceholder: string;
    emailCta: string;
    emailSending: string;
    emailSent: string;
    emailError: string;
    signedInAs: string;
    signOut: string;
    favoritesGateTitle: string;
    favoritesGateText: string;
  };
  categoriesMenu: {
    national: string;
    nationalDesc: string;
    clubs: string;
    clubsDesc: string;
    retro: string;
    retroDesc: string;
    soon: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  heroSlides: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
  }[];
  featured: {
    eyebrow: string;
    title: string;
  };
  steps: {
    title1: string;
    text1: string;
    title2: string;
    text2: string;
    title3: string;
    text3: string;
  };
  search: {
    label: string;
    placeholder: string;
    noResults: string;
    allCategories: string;
    categoryNational: string;
    categoryClubs: string;
    typeLabel: string;
    seasonLabel: string;
    ageGroupLabel: string;
    ageGroupMen: string;
    ageGroupWomen: string;
    ageGroupKids: string;
    quickSelectLabel: string;
    clearAria: string;
    resultsCount: string;
    sortLabel: string;
    sortRelevance: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortNewest: string;
    sortOldest: string;
    filtersButton: string;
    showResults: string;
    brandLabel: string;
    storeLabel: string;
    loadMore: string;
    sizeLabel: string;
    colorLabel: string;
    colorBlack: string;
    colorWhite: string;
    colorGray: string;
    colorRed: string;
    colorOrange: string;
    colorYellow: string;
    colorGreen: string;
    colorTeal: string;
    colorBlue: string;
    colorNavy: string;
    colorPurple: string;
    colorPink: string;
    priceRangeLabel: string;
    clearFilters: string;
  };
  product: {
    bestPrice: string;
    in: string;
    outOfStockLabel: string;
    buy: string;
    soldOut: string;
    viewStores: string;
    hideStores: string;
    inStores: string;
    sizesRange: string;
    shippingIncluded: string;
  };
  detail: {
    backToCatalog: string;
    chooseSize: string;
    allSizes: string;
    notAvailableInSize: string;
    notAvailableInCountry: string;
    allSoldOut: string;
    storesCompared: string;
    priceHistoryLabel: string;
    basePrice: string;
    shipping: string;
    total: string;
    viewInStore: string;
    photoPlaceholder: string;
    currencyNote: string;
    replicaBadge: string;
    bestPriceBadge: string;
    retroBadge: string;
    from: string;
    viewFullComparison: string;
    sameTeamEyebrow: string;
    sameTeamTitle: string;
    sameSizeEyebrow: string;
    sameSizeTitle: string;
    realShippingTo: string;
    importCharges: string;
    checkingRealShipping: string;
    includedInTotal: string;
  };
  footer: {
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    sizeGuide: string;
    authenticity: string;
    disclaimer: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  sizeGuide: {
    title: string;
    intro: string;
    fitTitle: string;
    fitText: string;
    measureTitle: string;
    measureText: string;
    brandsTitle: string;
    brandsText: string;
    kidsTitle: string;
    kidsText: string;
    note: string;
  };
  authenticity: {
    title: string;
    intro: string;
    termsTitle: string;
    termsText: string;
    redFlagsTitle: string;
    redFlagsText: string;
    ourBadgeTitle: string;
    ourBadgeText: string;
    note: string;
  };
  priceDrop: {
    eyebrow: string;
    title: string;
    badge: string;
    filterLabel: string;
  };
  heritage: {
    eyebrow: string;
    title: string;
    sourceLabel: string;
  };
  contact: {
    title: string;
    p1: string;
    emailLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    orEmail: string;
  };
  privacy: {
    title: string;
    updated: string;
    intro: string;
    collectTitle: string;
    collectText: string;
    affiliateTitle: string;
    affiliateText: string;
    thirdPartyTitle: string;
    thirdPartyText: string;
    contactTitle: string;
    contactText: string;
  };
  terms: {
    title: string;
    updated: string;
    whatTitle: string;
    whatText: string;
    accuracyTitle: string;
    accuracyText: string;
    ordersTitle: string;
    ordersText: string;
    affiliateTitle: string;
    affiliateText: string;
  };
  notFound: {
    title: string;
    text: string;
    cta: string;
  };
  recentlyViewed: {
    title: string;
    empty: string;
  };
  share: {
    button: string;
    copied: string;
  };
  reportProduct: {
    button: string;
    modalTitle: string;
    modalIntro: string;
    reasonLabel: string;
    reasonWrongPhoto: string;
    reasonWrongPrice: string;
    reasonWrongName: string;
    reasonBrokenLink: string;
    reasonOther: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    cancel: string;
  };
  compare: {
    add: string;
    remove: string;
    barTitle: string;
    viewComparison: string;
    clearAll: string;
    maxReached: string;
    pageTitle: string;
    empty: string;
    store: string;
    price: string;
    shippingCost: string;
    taxes: string;
    taxesIncluded: string;
    freeShipping: string;
    total: string;
    sellersLabel: string;
    noSellers: string;
    sizes: string;
    viewProduct: string;
  };
}

export const translations: Record<Locale, Translations> = {
  es: {
    brand: "Football Cult",
    brandTagline: "Un legado del fútbol.",
    nav: {
      search: "Buscar",
      categories: "Categorías",
      about: "Sobre nosotros",
      contact: "Contacto",
      login: "Ingresar",
      favorites: "Favoritos",
      shipTo: "Enviar a",
    },
    countryPanel: {
      title: "¿A dónde enviamos?",
      note: "Filtramos las tiendas que envían a tu país y mostramos precios en tu moneda (conversión aproximada).",
      notAvailable: "Ninguna tienda envía a este país todavía para este producto.",
      searchPlaceholder: "Buscar país...",
      noMatches: "No encontramos ese país.",
    },
    favoritesPanel: {
      empty: "Todavía no guardaste ninguna camiseta. Tocá el corazón en una tarjeta para guardarla acá.",
      title: "Tus favoritos",
      viewAll: "Ver todos los favoritos",
    },
    favoritesPage: {
      title: "Tus favoritos",
      empty: "Todavía no guardaste ninguna camiseta.",
      browse: "Explorar camisetas",
      priceAlertNote: "Te avisamos por mail si alguna de estas baja de precio.",
    },
    loginPanel: {
      title: "Tu cuenta",
      text: "Iniciá sesión para guardar tus favoritos y accederlos desde cualquier dispositivo.",
      googleCta: "Continuar con Google",
      or: "o",
      emailPlaceholder: "Tu email",
      emailCta: "Enviar link de acceso",
      emailSending: "Enviando...",
      emailSent: "Te enviamos un link para ingresar. Revisá tu correo.",
      emailError: "No pudimos enviar el link. Probá de nuevo.",
      signedInAs: "Conectado como",
      signOut: "Cerrar sesión",
      favoritesGateTitle: "Iniciá sesión para guardar favoritos",
      favoritesGateText: "Para agregar camisetas a favoritos y verlas desde cualquier dispositivo, primero tenés que iniciar sesión.",
    },
    categoriesMenu: {
      national: "Selecciones",
      nationalDesc: "Camisetas de selecciones nacionales",
      clubs: "Clubes",
      clubsDesc: "Camisetas de clubes y ligas",
      retro: "Retro",
      retroDesc: "Ediciones clásicas y vintage",
      soon: "Próximamente",
    },
    hero: {
      eyebrow: "Tu vitrina futbolera, en un solo lugar",
      title: "El catálogo del hincha",
      subtitle:
        "Comparamos precios de camisetas de selecciones, clubes y ligas de todo el mundo. Vos comprás directo donde quieras.",
      cta: "Ver catálogo",
    },
    heroSlides: [
      {
        eyebrow: "Selecciones nacionales",
        title: "La camiseta de tu selección",
        subtitle:
          "Argentina, Brasil, España y las camisetas de selecciones de todo el mundo, comparadas en un solo lugar.",
        cta: "Ver selecciones",
      },
      {
        eyebrow: "Grandes clubes",
        title: "Los colores que elegiste de chico",
        subtitle:
          "Real Madrid, Boca, Manchester United y cientos de clubes más, al mejor precio real.",
        cta: "Ver clubes",
      },
      {
        eyebrow: "Colección retro",
        title: "Reliquias de otra época",
        subtitle: "Camisetas vintage de temporadas 2006 para atrás, verificadas una por una.",
        cta: "Ver retro",
      },
      {
        eyebrow: "Talles y cortes de mujer",
        title: "Hecha a tu medida",
        subtitle: "Camisetas oficiales con corte de mujer, de las tiendas que realmente tienen stock.",
        cta: "Ver camisetas de mujer",
      },
      {
        eyebrow: "Los hinchas más chicos",
        title: "La próxima generación",
        subtitle: "Camisetas infantiles de sus ídolos, en los talles que necesitás.",
        cta: "Ver camisetas de niños",
      },
    ],
    featured: {
      eyebrow: "Joyas del catálogo",
      title: "Camisetas destacadas",
    },
    steps: {
      title1: "Buscá",
      text1: "Escribí el nombre de tu equipo, selección o liga.",
      title2: "Comparamos",
      text2: "Cruzamos precios de distintas tiendas al instante.",
      title3: "Comprás",
      text3: "Te llevamos directo a la mejor oferta disponible.",
    },
    search: {
      label: "Buscá tu selección, club o liga favorita",
      placeholder: "Buscá una camiseta, un dorsal, una época... (Ej: Riquelme 2001, Italia 2006, Real Madrid)",
      noResults: 'No encontramos camisetas para "{query}" todavía. Estamos sumando más tiendas cada semana.',
      allCategories: "Todas",
      categoryNational: "Selecciones",
      categoryClubs: "Clubes",
      typeLabel: "Tipo",
      seasonLabel: "Temporada",
      ageGroupLabel: "Edad",
      ageGroupMen: "Hombre",
      ageGroupWomen: "Mujer",
      ageGroupKids: "Niño/a",
      quickSelectLabel: "Accesos rápidos",
      clearAria: "Limpiar búsqueda",
      resultsCount: "{n} camisetas encontradas",
      sortLabel: "Ordenar por",
      sortRelevance: "Relevancia",
      sortPriceAsc: "Precio: menor a mayor",
      sortPriceDesc: "Precio: mayor a menor",
      sortNewest: "Más reciente",
      sortOldest: "Más antigua",
      filtersButton: "Filtros",
      showResults: "Ver resultados",
      brandLabel: "Marca",
      storeLabel: "Tienda",
      loadMore: "Ver más",
      sizeLabel: "Talle",
      colorLabel: "Color",
      colorBlack: "Negro",
      colorWhite: "Blanco",
      colorGray: "Gris",
      colorRed: "Rojo",
      colorOrange: "Naranja",
      colorYellow: "Amarillo",
      colorGreen: "Verde",
      colorTeal: "Turquesa",
      colorBlue: "Celeste",
      colorNavy: "Azul",
      colorPurple: "Violeta",
      colorPink: "Rosa",
      priceRangeLabel: "Rango de precio",
      clearFilters: "Borrar filtros",
    },
    product: {
      bestPrice: "Mejor precio",
      in: "en",
      outOfStockLabel: "Sin stock disponible",
      buy: "Comprar",
      soldOut: "Agotado",
      viewStores: "Ver otras tiendas ({n})",
      hideStores: "Ocultar tiendas",
      inStores: "En {n} tiendas",
      sizesRange: "Tallas {range}",
      shippingIncluded: "envío incl.",
    },
    detail: {
      backToCatalog: "Volver al catálogo",
      chooseSize: "Elegí tu talla",
      allSizes: "Todas las tiendas",
      notAvailableInSize: "No disponible en talla {size}",
      notAvailableInCountry: "No disponible para envíos a {country}",
      allSoldOut: "Todas las ofertas de esta camiseta están agotadas por ahora.",
      storesCompared: "{n} tiendas comparadas",
      priceHistoryLabel: "Evolución de precio (últimos {n} días)",
      basePrice: "Precio",
      shipping: "Envío",
      total: "Total",
      viewInStore: "Ver en tienda",
      photoPlaceholder: "Foto de producto próximamente",
      currencyNote: "Precio real de cada tienda en su moneda de origen. La tienda puede mostrarte otra moneda según tu ubicación, pero cobra este mismo precio.",
      replicaBadge: "Réplica (no oficial)",
      bestPriceBadge: "Oferta Top",
      retroBadge: "Retro / Colección",
      from: "Desde",
      viewFullComparison: "Ver comparativa completa",
      sameTeamEyebrow: "Del mismo archivo",
      sameTeamTitle: "Más de este equipo",
      sameSizeEyebrow: "En tu talla",
      sameSizeTitle: "Otras ofertas en tu talla",
      realShippingTo: "Envío real a {country}",
      importCharges: "Impuestos",
      checkingRealShipping: "Calculando envío real a tu país…",
      includedInTotal: "incluido en el total",
    },
    footer: {
      about: "Sobre nosotros",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      sizeGuide: "Guía de tallas",
      authenticity: "Autenticidad",
      disclaimer:
        "Football Cult es un comparador de precios. No vendemos productos directamente: te redirigimos a tiendas de terceros para completar tu compra. Algunos enlaces son enlaces de afiliado, lo que significa que podemos recibir una comisión sin costo adicional para vos.",
    },
    about: {
      title: "Sobre nosotros",
      p1: "Football Cult nació con una idea simple: encontrar la camiseta de tu selección, tu club o tu liga favorita —de cualquier parte del mundo— no debería significar abrir veinte pestañas del navegador para comparar precios.",
      p2: "Somos un comparador de precios independiente. Buscamos entre distintas tiendas online y te mostramos las mejores opciones disponibles para que decidas dónde comprar con toda la información a mano.",
      p3: 'Football Cult no vende productos directamente ni maneja pagos, envíos o devoluciones. Cuando hacés clic en "Comprar", te llevamos a la tienda correspondiente para que completes tu compra ahí. Algunos de esos enlaces son enlaces de afiliado: si comprás a través de ellos, podemos recibir una pequeña comisión de la tienda, sin ningún costo adicional para vos.',
    },
    sizeGuide: {
      title: "Guía de tallas",
      intro: "Las camisetas de fútbol no se tallan igual que la ropa casual: la mayoría tiene un corte deportivo, pensado para jugar, no para uso diario. Antes de comprar, vale la pena tener en cuenta estos puntos.",
      fitTitle: "Auténtica vs. réplica: el corte no es el mismo",
      fitText: "La versión 'auténtica' (la que usan los jugadores, a veces llamada 'match' o con nombres de tecnología propios de cada marca) tiene un corte ajustado al cuerpo. La versión 'réplica' o de aficionado tiene un corte más suelto y cómodo para uso diario. Si te gusta más holgada, buscá réplica; si preferís el calce ajustado real, buscá auténtica — no siempre coinciden con tu talla habitual de remera.",
      measureTitle: "La forma más segura de elegir: comparar, no adivinar",
      measureText: "Antes de guiarte solo por tu talla habitual, medí una camiseta que ya tengas y te quede bien (ancho de pecho de axila a axila, y largo de hombro a cadera) y compará esas medidas con la tabla de tallas que publica cada tienda en su propia página de producto.",
      brandsTitle: "Cada marca talla distinto",
      brandsText: "Nike, Adidas, Puma y el resto de las marcas no usan exactamente la misma numeración entre sí — una talla M de una marca puede no ser igual a la M de otra. Revisá siempre la tabla de tallas específica de la tienda y la marca antes de confirmar la compra.",
      kidsTitle: "Talles de niños",
      kidsText: "La ropa infantil suele tallarse por edad o altura (por ejemplo 8 años, 128 cm) en vez de S/M/L. Estas conversiones también varían según la marca, así que lo mismo aplica: comparar contra una prenda que ya tengan antes de elegir.",
      note: "En cada ficha de producto filtramos las tallas realmente disponibles por tienda — pero el calce final depende de la tienda y la marca, no de Football Cult. Ante la duda, la tabla de tallas de la tienda es siempre la fuente más confiable.",
    },
    authenticity: {
      title: "Cómo verificar autenticidad",
      intro: "Football Cult no vende directamente: te redirige a la tienda real para que completes la compra ahí. Por eso la autenticidad de lo que comprás depende de la tienda, no de nosotros — pero podemos ayudarte a identificar señales reales antes de decidir.",
      termsTitle: "'Auténtica' y 'réplica' no son lo mismo",
      termsText: "'Auténtica' (o 'match') es la versión con la tecnología y el corte que usan los jugadores en la cancha, con licencia oficial del club o la federación. 'Réplica' es la versión de aficionado, también con licencia oficial en la gran mayoría de los casos, pero con un corte y materiales pensados para uso diario, no para jugar. Ninguna de las dos es una falsificación — son dos productos oficiales distintos, a precios distintos.",
      redFlagsTitle: "Señales de que algo no es lo que dice ser",
      redFlagsText: "Un precio muy por debajo del resto de las ofertas del mismo producto, fotos genéricas o que no coinciden con el escudo/sponsor reales, ausencia de tabla de tallas propia, o un dominio de tienda que no reconocés y no aparece en ningún otro lado — son las señales más comunes de un vendedor no confiable. Comprá siempre desde el link que te lleva directo a la tienda, nunca compartas tus datos de pago en ningún otro sitio.",
      ourBadgeTitle: "Cómo lo marcamos en el sitio",
      ourBadgeText: "Cuando identificamos que una oferta específica es de una tienda que vende exclusivamente réplicas no oficiales, se lo marcamos con la etiqueta 'Réplica (no oficial)' directamente en esa oferta — así lo sabés antes de hacer clic, no después.",
      note: "Si comprás algo que no coincide con lo que viste en Football Cult, el reclamo va directo con la tienda donde compraste — nosotros no procesamos pagos ni envíos. Podés usar el botón 'Reportar producto' en cualquier ficha para avisarnos si algo no coincide, así lo revisamos.",
    },
    priceDrop: {
      eyebrow: "Ofertas del día",
      title: "Bajaron de Precio",
      badge: "Bajó {n}%",
      filterLabel: "Bajaron de precio",
    },
    heritage: {
      eyebrow: "Del archivo",
      title: "La Crónica de la Prenda",
      sourceLabel: "Fuente",
    },
    contact: {
      title: "Contacto",
      p1: "¿Encontraste un precio desactualizado, una tienda que deberíamos sumar, o tenés alguna consulta? Escribinos.",
      emailLabel: "Email",
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      messageLabel: "Mensaje",
      messagePlaceholder: "Contanos qué encontraste o qué necesitás...",
      submit: "Enviar mensaje",
      submitting: "Enviando...",
      success: "¡Listo! Recibimos tu mensaje, te respondemos pronto.",
      error: "No se pudo enviar. Probá de nuevo en un rato.",
      orEmail: "O escribinos directo a:",
    },
    privacy: {
      title: "Política de privacidad",
      updated: "Última actualización: [completar antes de publicar].",
      intro:
        'Football Cult ("nosotros") opera este sitio web. Esta página explica qué información recopilamos y cómo la usamos.',
      collectTitle: "Información que recopilamos",
      collectText:
        "Podemos recopilar datos de uso básico (páginas visitadas, búsquedas realizadas) mediante cookies o herramientas de analítica, y la dirección de email si nos escribís por el formulario de contacto o te suscribís a alertas de precio.",
      affiliateTitle: "Enlaces de afiliado",
      affiliateText:
        "Este sitio participa en programas de afiliados (como Awin, CJ Affiliate o Rakuten Advertising). Esto significa que algunos enlaces hacia tiendas de terceros son enlaces de afiliado: si comprás a través de ellos, la tienda puede compartir información de la transacción (no datos personales tuyos) con nosotros para calcular la comisión correspondiente.",
      thirdPartyTitle: "Terceros",
      thirdPartyText:
        "No vendemos tu información personal a terceros. Las tiendas a las que te redirigimos tienen sus propias políticas de privacidad, que te recomendamos revisar antes de comprar.",
      contactTitle: "Contacto",
      contactText: "Ante cualquier duda sobre esta política, escribinos a",
    },
    terms: {
      title: "Términos y condiciones",
      updated: "Última actualización: [completar antes de publicar].",
      whatTitle: "Qué es Football Cult",
      whatText:
        "Football Cult es un servicio de comparación de precios. No vendemos productos, no procesamos pagos y no somos parte del contrato de compra entre el usuario y la tienda seleccionada.",
      accuracyTitle: "Precisión de los precios",
      accuracyText:
        "Hacemos lo posible para mantener los precios actualizados, pero no garantizamos que reflejen el precio final en el momento de la compra (pueden variar por stock, talla, gastos de envío o cambios de la tienda). El precio final válido es siempre el que muestra la tienda al momento de pagar.",
      ordersTitle: "Compras, envíos y devoluciones",
      ordersText:
        "Cualquier consulta sobre tu compra, envío, devolución o garantía debe dirigirse directamente a la tienda donde compraste, ya que es quien procesa la venta.",
      affiliateTitle: "Enlaces de afiliado",
      affiliateText:
        "Football Cult participa en programas de afiliados y puede recibir una comisión por las compras realizadas a través de nuestros enlaces, sin costo adicional para el usuario.",
    },
    notFound: {
      title: "Fuera de juego",
      text: "No encontramos esta página. Puede que el link esté roto o que la camiseta ya no esté en el catálogo.",
      cta: "Volver al catálogo",
    },
    recentlyViewed: {
      title: "Vistos recientemente",
      empty: "Todavía no visitaste ninguna camiseta.",
    },
    share: {
      button: "Compartir",
      copied: "¡Link copiado!",
    },
    reportProduct: {
      button: "Reportar producto",
      modalTitle: "Reportar este producto",
      modalIntro: "Contanos qué está mal para que podamos revisarlo.",
      reasonLabel: "Motivo",
      reasonWrongPhoto: "La foto no corresponde",
      reasonWrongPrice: "El precio está mal",
      reasonWrongName: "El nombre o equipo está mal",
      reasonBrokenLink: "El link a la tienda no funciona",
      reasonOther: "Otro",
      detailsLabel: "Contanos más (opcional)",
      detailsPlaceholder: "Describí el problema...",
      submit: "Enviar reporte",
      submitting: "Enviando...",
      success: "¡Gracias! Ya recibimos tu reporte.",
      error: "No se pudo enviar el reporte. Intentá de nuevo.",
      cancel: "Cancelar",
    },
    compare: {
      add: "Comparar",
      remove: "Quitar de comparar",
      barTitle: "Comparando",
      viewComparison: "Ver comparación",
      clearAll: "Vaciar",
      maxReached: "Podés comparar hasta 3 camisetas",
      pageTitle: "Comparar camisetas",
      empty: "Todavía no agregaste camisetas para comparar.",
      store: "Tienda",
      price: "Precio",
      shippingCost: "Envío",
      taxes: "Impuestos",
      taxesIncluded: "Incluidos",
      freeShipping: "Gratis",
      total: "Total",
      sellersLabel: "Vendedores",
      noSellers: "Sin ofertas disponibles",
      sizes: "Talles",
      viewProduct: "Ver camiseta",
    },
  },
  pt: {
    brand: "Football Cult",
    brandTagline: "Um legado do futebol.",
    nav: {
      search: "Buscar",
      categories: "Categorias",
      about: "Sobre nós",
      contact: "Contato",
      login: "Entrar",
      favorites: "Favoritos",
      shipTo: "Enviar para",
    },
    countryPanel: {
      title: "Para onde enviamos?",
      note: "Filtramos as lojas que enviam para o seu país e mostramos os preços na sua moeda (conversão aproximada).",
      notAvailable: "Nenhuma loja ainda envia para este país para este produto.",
      searchPlaceholder: "Buscar país...",
      noMatches: "Não encontramos esse país.",
    },
    favoritesPanel: {
      empty: "Você ainda não salvou nenhuma camisa. Toque no coração em um card para salvá-lo aqui.",
      title: "Seus favoritos",
      viewAll: "Ver todos os favoritos",
    },
    favoritesPage: {
      title: "Seus favoritos",
      empty: "Você ainda não salvou nenhuma camisa.",
      browse: "Explorar camisas",
      priceAlertNote: "Avisamos por e-mail se alguma dessas baixar de preço.",
    },
    loginPanel: {
      title: "Sua conta",
      text: "Faça login para salvar seus favoritos e acessá-los de qualquer dispositivo.",
      googleCta: "Continuar com o Google",
      or: "ou",
      emailPlaceholder: "Seu email",
      emailCta: "Enviar link de acesso",
      emailSending: "Enviando...",
      emailSent: "Enviamos um link para você entrar. Confira seu email.",
      emailError: "Não conseguimos enviar o link. Tente novamente.",
      signedInAs: "Conectado como",
      signOut: "Sair",
      favoritesGateTitle: "Faça login para salvar favoritos",
      favoritesGateText: "Para adicionar camisas aos favoritos e vê-las em qualquer dispositivo, primeiro você precisa fazer login.",
    },
    categoriesMenu: {
      national: "Seleções",
      nationalDesc: "Camisas de seleções nacionais",
      clubs: "Clubes",
      clubsDesc: "Camisas de clubes e ligas",
      retro: "Retrô",
      retroDesc: "Edições clássicas e vintage",
      soon: "Em breve",
    },
    hero: {
      eyebrow: "Sua vitrine do futebol, em um só lugar",
      title: "O catálogo do torcedor",
      subtitle:
        "Comparamos preços de camisas de seleções, clubes e ligas do mundo todo. Você compra direto onde quiser.",
      cta: "Ver catálogo",
    },
    heroSlides: [
      {
        eyebrow: "Seleções nacionais",
        title: "A camisa da sua seleção",
        subtitle:
          "Argentina, Brasil, Espanha e as camisas de seleções do mundo todo, comparadas em um só lugar.",
        cta: "Ver seleções",
      },
      {
        eyebrow: "Grandes clubes",
        title: "As cores que você escolheu criança",
        subtitle: "Real Madrid, Boca, Manchester United e centenas de outros clubes, pelo melhor preço real.",
        cta: "Ver clubes",
      },
      {
        eyebrow: "Coleção retrô",
        title: "Relíquias de outra época",
        subtitle: "Camisas retrô de temporadas até 2006, verificadas uma a uma.",
        cta: "Ver retrô",
      },
      {
        eyebrow: "Tamanhos e cortes femininos",
        title: "Feita sob medida",
        subtitle: "Camisas oficiais com corte feminino, das lojas que realmente têm estoque.",
        cta: "Ver camisas femininas",
      },
      {
        eyebrow: "Os torcedores mais novos",
        title: "A próxima geração",
        subtitle: "Camisas infantis dos ídolos deles, nos tamanhos que você precisa.",
        cta: "Ver camisas infantis",
      },
    ],
    featured: {
      eyebrow: "Joias do catálogo",
      title: "Camisas em destaque",
    },
    steps: {
      title1: "Busque",
      text1: "Digite o nome do seu time, seleção ou liga.",
      title2: "Comparamos",
      text2: "Cruzamos preços de diferentes lojas na hora.",
      title3: "Você compra",
      text3: "Te levamos direto para a melhor oferta disponível.",
    },
    search: {
      label: "Busque sua seleção, clube ou liga favorita",
      placeholder: "Busque uma camisa, um número, uma época... (Ex: Riquelme 2001, Itália 2006, Real Madrid)",
      noResults: 'Ainda não encontramos camisas para "{query}". Estamos adicionando mais lojas toda semana.',
      allCategories: "Todas",
      categoryNational: "Seleções",
      categoryClubs: "Clubes",
      typeLabel: "Tipo",
      seasonLabel: "Temporada",
      ageGroupLabel: "Idade",
      ageGroupMen: "Homem",
      ageGroupWomen: "Mulher",
      ageGroupKids: "Infantil",
      quickSelectLabel: "Acessos rápidos",
      clearAria: "Limpar busca",
      resultsCount: "{n} camisas encontradas",
      sortLabel: "Ordenar por",
      sortRelevance: "Relevância",
      sortPriceAsc: "Preço: menor para maior",
      sortPriceDesc: "Preço: maior para menor",
      sortNewest: "Mais recente",
      sortOldest: "Mais antiga",
      filtersButton: "Filtros",
      showResults: "Ver resultados",
      brandLabel: "Marca",
      storeLabel: "Loja",
      loadMore: "Ver mais",
      sizeLabel: "Tamanho",
      colorLabel: "Cor",
      colorBlack: "Preto",
      colorWhite: "Branco",
      colorGray: "Cinza",
      colorRed: "Vermelho",
      colorOrange: "Laranja",
      colorYellow: "Amarelo",
      colorGreen: "Verde",
      colorTeal: "Turquesa",
      colorBlue: "Azul claro",
      colorNavy: "Azul marinho",
      colorPurple: "Roxo",
      colorPink: "Rosa",
      priceRangeLabel: "Faixa de preço",
      clearFilters: "Limpar filtros",
    },
    product: {
      bestPrice: "Melhor preço",
      in: "em",
      outOfStockLabel: "Sem estoque disponível",
      buy: "Comprar",
      soldOut: "Esgotado",
      viewStores: "Ver outras lojas ({n})",
      hideStores: "Ocultar lojas",
      inStores: "Em {n} lojas",
      sizesRange: "Tamanhos {range}",
      shippingIncluded: "frete incl.",
    },
    detail: {
      backToCatalog: "Voltar ao catálogo",
      chooseSize: "Escolha seu tamanho",
      allSizes: "Todas as lojas",
      notAvailableInSize: "Não disponível no tamanho {size}",
      notAvailableInCountry: "Não disponível para envio a {country}",
      allSoldOut: "Todas as ofertas desta camisa estão esgotadas por enquanto.",
      storesCompared: "{n} lojas comparadas",
      priceHistoryLabel: "Evolução de preço (últimos {n} dias)",
      basePrice: "Preço",
      shipping: "Frete",
      total: "Total",
      viewInStore: "Ver na loja",
      photoPlaceholder: "Foto do produto em breve",
      currencyNote: "Preço real de cada loja na sua moeda de origem. A loja pode te mostrar outra moeda de acordo com sua localização, mas cobra esse mesmo preço.",
      replicaBadge: "Réplica (não oficial)",
      bestPriceBadge: "Oferta Top",
      retroBadge: "Retrô / Coleção",
      from: "A partir de",
      viewFullComparison: "Ver comparação completa",
      sameTeamEyebrow: "Do mesmo arquivo",
      sameTeamTitle: "Mais deste time",
      sameSizeEyebrow: "No seu tamanho",
      sameSizeTitle: "Outras ofertas no seu tamanho",
      realShippingTo: "Frete real para {country}",
      importCharges: "Impostos",
      checkingRealShipping: "Calculando frete real para o seu país…",
      includedInTotal: "incluído no total",
    },
    footer: {
      about: "Sobre nós",
      contact: "Contato",
      privacy: "Privacidade",
      terms: "Termos",
      sizeGuide: "Guia de tamanhos",
      authenticity: "Autenticidade",
      disclaimer:
        "Football Cult é um comparador de preços. Não vendemos produtos diretamente: te redirecionamos para lojas terceiras para concluir sua compra. Alguns links são links de afiliado, o que significa que podemos receber uma comissão sem custo adicional para você.",
    },
    about: {
      title: "Sobre nós",
      p1: "Football Cult nasceu de uma ideia simples: encontrar a camisa da sua seleção, do seu clube ou da sua liga favorita — de qualquer parte do mundo — não deveria significar abrir vinte abas do navegador para comparar preços.",
      p2: "Somos um comparador de preços independente. Buscamos em diferentes lojas online e mostramos as melhores opções disponíveis para você decidir onde comprar com todas as informações em mãos.",
      p3: 'Football Cult não vende produtos diretamente nem processa pagamentos, envios ou devoluções. Quando você clica em "Comprar", te levamos até a loja correspondente para concluir sua compra lá. Alguns desses links são links de afiliado: se você comprar através deles, podemos receber uma pequena comissão da loja, sem nenhum custo adicional para você.',
    },
    sizeGuide: {
      title: "Guia de Tamanhos",
      intro: "As camisas de futebol não têm o mesmo caimento da roupa do dia a dia: a maioria tem um corte esportivo, pensado para jogar, não para uso diário. Antes de comprar, vale a pena considerar estes pontos.",
      fitTitle: "Autêntica vs. réplica: o corte não é o mesmo",
      fitText: "A versão 'autêntica' (a que os jogadores usam, às vezes chamada de 'match' ou com o nome de tecnologia próprio de cada marca) tem um corte justo ao corpo. A versão 'réplica' ou de torcedor tem um corte mais largo e confortável para o uso diário. Se você prefere mais folgada, procure réplica; se prefere o caimento justo real, procure autêntica — de qualquer forma nem sempre corresponde ao seu tamanho habitual de camiseta.",
      measureTitle: "A forma mais segura de escolher: comparar, não adivinhar",
      measureText: "Em vez de se guiar apenas pelo seu tamanho habitual, meça uma camisa que você já tenha e que sirva bem (largura do peito de axila a axila, e comprimento do ombro ao quadril) e compare essas medidas com a tabela de tamanhos que cada loja publica na própria página do produto.",
      brandsTitle: "Cada marca numera diferente",
      brandsText: "Nike, Adidas, Puma e as demais marcas não usam exatamente a mesma numeração entre si — um tamanho M de uma marca pode não ser igual ao M de outra. Sempre confira a tabela de tamanhos específica da loja e da marca antes de confirmar a compra.",
      kidsTitle: "Tamanhos infantis",
      kidsText: "A roupa infantil costuma ser numerada por idade ou altura (por exemplo, 8 anos, 128 cm) em vez de P/M/G, e essas conversões também variam por marca — a mesma regra se aplica: compare com uma peça que a criança já tenha antes de escolher.",
      note: "Em cada ficha de produto filtramos os tamanhos realmente disponíveis por loja — mas o caimento final depende da loja e da marca, não da Football Cult. Na dúvida, a tabela de tamanhos da própria loja é sempre a fonte mais confiável.",
    },
    authenticity: {
      title: "Como Verificar a Autenticidade",
      intro: "A Football Cult não vende diretamente: redirecionamos você para a loja real para concluir a compra lá. Por isso a autenticidade do que você compra depende da loja, não de nós — mas podemos ajudar você a identificar sinais reais antes de decidir.",
      termsTitle: "'Autêntica' e 'réplica' não são a mesma coisa",
      termsText: "'Autêntica' (ou 'match') é a versão com a tecnologia e o corte que os jogadores realmente usam em campo, com licença oficial do clube ou da federação. 'Réplica' é a versão de torcedor — também licenciada oficialmente na grande maioria dos casos, mas com corte e materiais pensados para o uso diário, não para jogar. Nenhuma das duas é falsificação — são dois produtos oficiais diferentes, com preços diferentes.",
      redFlagsTitle: "Sinais de que algo não é o que diz ser",
      redFlagsText: "Um preço bem abaixo de todas as outras ofertas do mesmo produto, fotos genéricas que não correspondem ao escudo/patrocinador reais, ausência de tabela de tamanhos própria, ou um domínio de loja que você não reconhece e não encontra em nenhum outro lugar — são os sinais mais comuns de um vendedor não confiável. Compre sempre pelo link que leva direto à loja, e nunca compartilhe seus dados de pagamento em outro lugar.",
      ourBadgeTitle: "Como sinalizamos isso no site",
      ourBadgeText: "Quando identificamos que uma oferta específica vem de uma loja que vende exclusivamente réplicas não oficiais, marcamos essa oferta com o selo 'Réplica (não oficial)' diretamente nela — assim você sabe antes de clicar, não depois.",
      note: "Se o que você recebeu não corresponde ao que viu na Football Cult, a reclamação vai direto para a loja onde você comprou — nós não processamos pagamentos nem envios. Você pode usar o botão 'Reportar produto' em qualquer ficha para nos avisar que algo não corresponde, para que possamos verificar.",
    },
    priceDrop: {
      eyebrow: "Ofertas do dia",
      title: "Baixaram de Preço",
      badge: "Caiu {n}%",
      filterLabel: "Baixaram de preço",
    },
    heritage: {
      eyebrow: "Do arquivo",
      title: "A Crônica da Camisa",
      sourceLabel: "Fonte",
    },
    contact: {
      title: "Contato",
      p1: "Encontrou um preço desatualizado, uma loja que deveríamos adicionar, ou tem alguma dúvida? Fale conosco.",
      emailLabel: "Email",
      nameLabel: "Nome",
      namePlaceholder: "Seu nome",
      messageLabel: "Mensagem",
      messagePlaceholder: "Conte o que encontrou ou o que precisa...",
      submit: "Enviar mensagem",
      submitting: "Enviando...",
      success: "Pronto! Recebemos sua mensagem, respondemos em breve.",
      error: "Não foi possível enviar. Tente novamente daqui a pouco.",
      orEmail: "Ou escreva direto para:",
    },
    privacy: {
      title: "Política de privacidade",
      updated: "Última atualização: [preencher antes de publicar].",
      intro:
        'Football Cult ("nós") opera este site. Esta página explica quais informações coletamos e como as usamos.',
      collectTitle: "Informações que coletamos",
      collectText:
        "Podemos coletar dados básicos de uso (páginas visitadas, buscas realizadas) por meio de cookies ou ferramentas de análise, e o endereço de email caso você entre em contato conosco ou se inscreva em alertas de preço.",
      affiliateTitle: "Links de afiliado",
      affiliateText:
        "Este site participa de programas de afiliados (como Awin, CJ Affiliate ou Rakuten Advertising). Isso significa que alguns links para lojas terceiras são links de afiliado: se você comprar através deles, a loja pode compartilhar informações da transação (não seus dados pessoais) conosco para calcular a comissão correspondente.",
      thirdPartyTitle: "Terceiros",
      thirdPartyText:
        "Não vendemos suas informações pessoais para terceiros. As lojas para as quais te redirecionamos têm suas próprias políticas de privacidade, que recomendamos revisar antes de comprar.",
      contactTitle: "Contato",
      contactText: "Para qualquer dúvida sobre esta política, escreva para",
    },
    terms: {
      title: "Termos e condições",
      updated: "Última atualização: [preencher antes de publicar].",
      whatTitle: "O que é o Football Cult",
      whatText:
        "Football Cult é um serviço de comparação de preços. Não vendemos produtos, não processamos pagamentos e não somos parte do contrato de compra entre o usuário e a loja selecionada.",
      accuracyTitle: "Precisão dos preços",
      accuracyText:
        "Fazemos o possível para manter os preços atualizados, mas não garantimos que reflitam o preço final no momento da compra (podem variar por estoque, tamanho, custos de envio ou mudanças da loja). O preço final válido é sempre o exibido pela loja no momento do pagamento.",
      ordersTitle: "Compras, envios e devoluções",
      ordersText:
        "Qualquer dúvida sobre sua compra, envio, devolução ou garantia deve ser direcionada diretamente à loja onde você comprou, já que é ela quem processa a venda.",
      affiliateTitle: "Links de afiliado",
      affiliateText:
        "Football Cult participa de programas de afiliados e pode receber uma comissão pelas compras feitas através dos nossos links, sem custo adicional para o usuário.",
    },
    notFound: {
      title: "Fora de jogo",
      text: "Não encontramos esta página. O link pode estar quebrado ou a camisa já não está mais no catálogo.",
      cta: "Voltar ao catálogo",
    },
    recentlyViewed: {
      title: "Vistos recentemente",
      empty: "Você ainda não visitou nenhuma camisa.",
    },
    share: {
      button: "Compartilhar",
      copied: "Link copiado!",
    },
    reportProduct: {
      button: "Reportar produto",
      modalTitle: "Reportar este produto",
      modalIntro: "Conte-nos o que está errado para que possamos revisar.",
      reasonLabel: "Motivo",
      reasonWrongPhoto: "A foto não corresponde",
      reasonWrongPrice: "O preço está errado",
      reasonWrongName: "O nome ou time está errado",
      reasonBrokenLink: "O link para a loja não funciona",
      reasonOther: "Outro",
      detailsLabel: "Conte mais (opcional)",
      detailsPlaceholder: "Descreva o problema...",
      submit: "Enviar relato",
      submitting: "Enviando...",
      success: "Obrigado! Já recebemos seu relato.",
      error: "Não foi possível enviar o relato. Tente novamente.",
      cancel: "Cancelar",
    },
    compare: {
      add: "Comparar",
      remove: "Remover da comparação",
      barTitle: "Comparando",
      viewComparison: "Ver comparação",
      clearAll: "Limpar",
      maxReached: "Você pode comparar até 3 camisas",
      pageTitle: "Comparar camisas",
      empty: "Você ainda não adicionou camisas para comparar.",
      store: "Loja",
      price: "Preço",
      shippingCost: "Frete",
      taxes: "Impostos",
      taxesIncluded: "Incluídos",
      freeShipping: "Grátis",
      total: "Total",
      sellersLabel: "Vendedores",
      noSellers: "Nenhuma oferta disponível",
      sizes: "Tamanhos",
      viewProduct: "Ver camisa",
    },
  },
  en: {
    brand: "Football Cult",
    brandTagline: "A legacy collective.",
    nav: {
      search: "Search",
      categories: "Categories",
      about: "About us",
      contact: "Contact",
      login: "Sign in",
      favorites: "Favorites",
      shipTo: "Ship to",
    },
    countryPanel: {
      title: "Where should we ship?",
      note: "We filter stores that ship to your country and show prices in your currency (approximate conversion).",
      notAvailable: "No store ships to this country yet for this product.",
      searchPlaceholder: "Search country...",
      noMatches: "We couldn't find that country.",
    },
    favoritesPanel: {
      empty: "You haven't saved any jerseys yet. Tap the heart on a card to save it here.",
      title: "Your favorites",
      viewAll: "View all favorites",
    },
    favoritesPage: {
      title: "Your favorites",
      empty: "You haven't saved any jerseys yet.",
      browse: "Browse jerseys",
      priceAlertNote: "We'll email you if any of these drop in price.",
    },
    loginPanel: {
      title: "Your account",
      text: "Sign in to save your favorites and access them from any device.",
      googleCta: "Continue with Google",
      or: "or",
      emailPlaceholder: "Your email",
      emailCta: "Send sign-in link",
      emailSending: "Sending...",
      emailSent: "We sent you a sign-in link. Check your email.",
      emailError: "We couldn't send the link. Try again.",
      signedInAs: "Signed in as",
      signOut: "Sign out",
      favoritesGateTitle: "Sign in to save favorites",
      favoritesGateText: "To add jerseys to favorites and see them on any device, you need to sign in first.",
    },
    categoriesMenu: {
      national: "National teams",
      nationalDesc: "Jerseys from national teams",
      clubs: "Clubs",
      clubsDesc: "Club and league jerseys",
      retro: "Retro",
      retroDesc: "Classic and vintage editions",
      soon: "Coming soon",
    },
    hero: {
      eyebrow: "Football heritage, all in one place",
      title: "The collector's catalog",
      subtitle:
        "We compare prices on national team, club, and league jerseys from all over the world. You buy directly wherever you want.",
      cta: "Shop now",
    },
    heroSlides: [
      {
        eyebrow: "National teams",
        title: "Your national team's shirt",
        subtitle:
          "Argentina, Brazil, Spain and national team jerseys from all over the world, compared in one place.",
        cta: "Shop national teams",
      },
      {
        eyebrow: "The big clubs",
        title: "The colors you picked as a kid",
        subtitle: "Real Madrid, Boca, Manchester United and hundreds more clubs, at the best real price.",
        cta: "Shop clubs",
      },
      {
        eyebrow: "The retro collection",
        title: "Relics from another era",
        subtitle: "Vintage jerseys from 2006 and earlier, verified one by one.",
        cta: "Shop retro",
      },
      {
        eyebrow: "Women's sizing and cuts",
        title: "Made to fit",
        subtitle: "Official jerseys with a women's cut, from stores that actually have stock.",
        cta: "Shop women's",
      },
      {
        eyebrow: "The next generation of fans",
        title: "Future legends",
        subtitle: "Kids jerseys of their idols, in the sizes you need.",
        cta: "Shop kids",
      },
    ],
    featured: {
      eyebrow: "Catalog gems",
      title: "Featured jerseys",
    },
    steps: {
      title1: "Search",
      text1: "Type your team, national side, or league.",
      title2: "We compare",
      text2: "We cross-check prices across stores instantly.",
      title3: "You buy",
      text3: "We take you straight to the best deal available.",
    },
    search: {
      label: "Search your national team, club, or league",
      placeholder: "Search a jersey, a squad number, an era... (E.g: Riquelme 2001, Italy 2006, Real Madrid)",
      noResults: 'We couldn\'t find jerseys for "{query}" yet. We\'re adding more stores every week.',
      allCategories: "All",
      categoryNational: "National teams",
      categoryClubs: "Clubs",
      typeLabel: "Type",
      seasonLabel: "Season",
      ageGroupLabel: "Age",
      ageGroupMen: "Men",
      ageGroupWomen: "Women",
      ageGroupKids: "Kids",
      quickSelectLabel: "Quick picks",
      clearAria: "Clear search",
      resultsCount: "{n} jerseys found",
      sortLabel: "Sort by",
      sortRelevance: "Relevance",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      filtersButton: "Filters",
      showResults: "Show results",
      brandLabel: "Brand",
      storeLabel: "Store",
      loadMore: "Show more",
      sizeLabel: "Size",
      colorLabel: "Color",
      colorBlack: "Black",
      colorWhite: "White",
      colorGray: "Gray",
      colorRed: "Red",
      colorOrange: "Orange",
      colorYellow: "Yellow",
      colorGreen: "Green",
      colorTeal: "Teal",
      colorBlue: "Light Blue",
      colorNavy: "Navy",
      colorPurple: "Purple",
      colorPink: "Pink",
      priceRangeLabel: "Price range",
      clearFilters: "Clear filters",
    },
    product: {
      bestPrice: "Best price",
      in: "at",
      outOfStockLabel: "No stock available",
      buy: "Buy",
      soldOut: "Sold out",
      viewStores: "Other stores ({n})",
      hideStores: "Hide stores",
      inStores: "At {n} stores",
      sizesRange: "Sizes {range}",
      shippingIncluded: "shipping incl.",
    },
    detail: {
      backToCatalog: "Back to catalog",
      chooseSize: "Choose your size",
      allSizes: "All stores",
      notAvailableInSize: "Not available in size {size}",
      notAvailableInCountry: "Not available for shipping to {country}",
      allSoldOut: "All offers for this jersey are sold out for now.",
      storesCompared: "{n} stores compared",
      priceHistoryLabel: "Price history (last {n} days)",
      basePrice: "Price",
      shipping: "Shipping",
      total: "Total",
      viewInStore: "View in store",
      photoPlaceholder: "Product photo coming soon",
      currencyNote: "Real price from each store in its original currency. The store may show you a different currency based on your location, but charges this same price.",
      replicaBadge: "Replica (unofficial)",
      bestPriceBadge: "Top Deal",
      retroBadge: "Retro / Collection",
      from: "From",
      viewFullComparison: "View full comparison",
      sameTeamEyebrow: "From the same archive",
      sameTeamTitle: "More from this team",
      sameSizeEyebrow: "In your size",
      sameSizeTitle: "Other deals in your size",
      realShippingTo: "Real shipping to {country}",
      importCharges: "Import charges",
      checkingRealShipping: "Calculating real shipping to your country…",
      includedInTotal: "included in the total",
    },
    footer: {
      about: "About us",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      sizeGuide: "Size Guide",
      authenticity: "Authenticity",
      disclaimer:
        "Football Cult is a price comparison site. We don't sell products directly: we redirect you to third-party stores to complete your purchase. Some links are affiliate links, meaning we may earn a commission at no extra cost to you.",
    },
    about: {
      title: "About us",
      p1: "Football Cult was born from a simple idea: finding the jersey of your national team, club, or favorite league — from anywhere in the world — shouldn't mean opening twenty browser tabs to compare prices.",
      p2: "We're an independent price comparison site. We search across different online stores and show you the best available options so you can decide where to buy with all the information at hand.",
      p3: 'Football Cult doesn\'t sell products directly and doesn\'t handle payments, shipping, or returns. When you click "Buy," we take you to the corresponding store to complete your purchase there. Some of those links are affiliate links: if you buy through them, we may earn a small commission from the store, at no extra cost to you.',
    },
    sizeGuide: {
      title: "Size Guide",
      intro: "Football jerseys don't fit like everyday clothing — most have an athletic cut made for playing, not daily wear. Before you buy, it's worth keeping these points in mind.",
      fitTitle: "Authentic vs. replica: the cut isn't the same",
      fitText: "The 'authentic' version (what players actually wear, sometimes called 'match' or under each brand's own tech name) has a body-hugging cut. The 'replica' or fan version has a looser, more comfortable everyday cut. If you prefer it roomier, look for replica; if you want the real match fit, look for authentic — either way it won't always match your usual T-shirt size.",
      measureTitle: "The safest way to choose: compare, don't guess",
      measureText: "Instead of relying only on your usual size, measure a jersey you already own and fits well (chest width armpit to armpit, and length shoulder to hip) and compare those measurements to the size chart each store publishes on its own product page.",
      brandsTitle: "Every brand sizes differently",
      brandsText: "Nike, Adidas, Puma and the rest don't use exactly the same sizing between them — an M from one brand isn't necessarily the same as an M from another. Always check the specific size chart for that store and brand before confirming your purchase.",
      kidsTitle: "Kids sizing",
      kidsText: "Kids' sizing usually runs by age or height (e.g. 8 years, 128 cm) instead of S/M/L, and these conversions also vary by brand — same rule applies: compare against something they already own before choosing.",
      note: "Every product page filters to the sizes actually available per store — but the final fit depends on the store and brand, not on Football Cult. When in doubt, the store's own size chart is always the most reliable source.",
    },
    authenticity: {
      title: "How to Verify Authenticity",
      intro: "Football Cult doesn't sell directly — we redirect you to the real store to complete your purchase there. That means the authenticity of what you buy depends on the store, not on us — but we can help you spot real signals before you decide.",
      termsTitle: "'Authentic' and 'replica' aren't the same thing",
      termsText: "'Authentic' (or 'match') is the version with the technology and cut players actually wear on the pitch, officially licensed by the club or federation. 'Replica' is the fan version — also officially licensed in the vast majority of cases, but cut and made for everyday wear, not playing. Neither one is a counterfeit — they're two different official products at different prices.",
      redFlagsTitle: "Signs something isn't what it claims to be",
      redFlagsText: "A price well below every other offer for the same product, generic photos that don't match the real crest/sponsor, no size chart of its own, or a store domain you don't recognize and can't find anywhere else — these are the most common signs of an unreliable seller. Always buy through the link that takes you directly to the store, and never share your payment details anywhere else.",
      ourBadgeTitle: "How we flag it on the site",
      ourBadgeText: "When we identify that a specific offer comes from a store that exclusively sells unofficial replicas, we mark that offer with a 'Replica (unofficial)' label directly on it — so you know before you click, not after.",
      note: "If what you receive doesn't match what you saw on Football Cult, the claim goes directly to the store where you bought it — we don't process payments or shipping. You can use the 'Report product' button on any listing to let us know something doesn't match, so we can look into it.",
    },
    priceDrop: {
      eyebrow: "Today's deals",
      title: "Price Drops",
      badge: "Down {n}%",
      filterLabel: "Price drops",
    },
    heritage: {
      eyebrow: "From the archive",
      title: "The Shirt's Chronicle",
      sourceLabel: "Source",
    },
    contact: {
      title: "Contact",
      p1: "Found an outdated price, a store we should add, or have a question? Get in touch.",
      emailLabel: "Email",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      messageLabel: "Message",
      messagePlaceholder: "Tell us what you found or what you need...",
      submit: "Send message",
      submitting: "Sending...",
      success: "Done! We got your message, we'll get back to you soon.",
      error: "Couldn't send it. Try again in a bit.",
      orEmail: "Or email us directly at:",
    },
    privacy: {
      title: "Privacy Policy",
      updated: "Last updated: [fill in before publishing].",
      intro:
        'Football Cult ("we") operates this website. This page explains what information we collect and how we use it.',
      collectTitle: "Information we collect",
      collectText:
        "We may collect basic usage data (pages visited, searches performed) through cookies or analytics tools, and your email address if you contact us or sign up for price alerts.",
      affiliateTitle: "Affiliate links",
      affiliateText:
        "This site participates in affiliate programs (such as Awin, CJ Affiliate, or Rakuten Advertising). This means some links to third-party stores are affiliate links: if you buy through them, the store may share transaction information (not your personal data) with us to calculate the corresponding commission.",
      thirdPartyTitle: "Third parties",
      thirdPartyText:
        "We don't sell your personal information to third parties. The stores we redirect you to have their own privacy policies, which we recommend reviewing before buying.",
      contactTitle: "Contact",
      contactText: "For any questions about this policy, write to us at",
    },
    terms: {
      title: "Terms & Conditions",
      updated: "Last updated: [fill in before publishing].",
      whatTitle: "What is Football Cult",
      whatText:
        "Football Cult is a price comparison service. We don't sell products, don't process payments, and are not party to the purchase contract between the user and the selected store.",
      accuracyTitle: "Price accuracy",
      accuracyText:
        "We do our best to keep prices up to date, but we don't guarantee they reflect the final price at checkout (they may vary by stock, size, shipping costs, or store changes). The valid final price is always the one shown by the store at checkout.",
      ordersTitle: "Orders, shipping and returns",
      ordersText:
        "Any question about your order, shipping, return, or warranty should be directed to the store where you bought it, since they process the sale.",
      affiliateTitle: "Affiliate links",
      affiliateText:
        "Football Cult participates in affiliate programs and may earn a commission from purchases made through our links, at no extra cost to the user.",
    },
    notFound: {
      title: "Offside",
      text: "We couldn't find this page. The link may be broken or the jersey may no longer be in the catalog.",
      cta: "Back to catalog",
    },
    recentlyViewed: {
      title: "Recently viewed",
      empty: "You haven't viewed any jerseys yet.",
    },
    share: {
      button: "Share",
      copied: "Link copied!",
    },
    reportProduct: {
      button: "Report product",
      modalTitle: "Report this product",
      modalIntro: "Tell us what's wrong so we can review it.",
      reasonLabel: "Reason",
      reasonWrongPhoto: "The photo doesn't match",
      reasonWrongPrice: "The price is wrong",
      reasonWrongName: "The name or team is wrong",
      reasonBrokenLink: "The store link is broken",
      reasonOther: "Other",
      detailsLabel: "Tell us more (optional)",
      detailsPlaceholder: "Describe the issue...",
      submit: "Send report",
      submitting: "Sending...",
      success: "Thanks! We got your report.",
      error: "Couldn't send the report. Please try again.",
      cancel: "Cancel",
    },
    compare: {
      add: "Compare",
      remove: "Remove from comparison",
      barTitle: "Comparing",
      viewComparison: "View comparison",
      clearAll: "Clear",
      maxReached: "You can compare up to 3 jerseys",
      pageTitle: "Compare jerseys",
      empty: "You haven't added any jerseys to compare yet.",
      store: "Store",
      price: "Price",
      shippingCost: "Shipping",
      taxes: "Taxes",
      taxesIncluded: "Included",
      freeShipping: "Free",
      total: "Total",
      sellersLabel: "Sellers",
      noSellers: "No offers available",
      sizes: "Sizes",
      viewProduct: "View jersey",
    },
  },
  fr: {
    brand: "Football Cult",
    brandTagline: "Un collectif patrimonial.",
    nav: {
      search: "Recherche",
      categories: "Catégories",
      about: "À propos",
      contact: "Contact",
      login: "Se connecter",
      favorites: "Favoris",
      shipTo: "Livraison vers",
    },
    countryPanel: {
      title: "Où faut-il livrer ?",
      note: "Nous filtrons les boutiques qui livrent dans votre pays et affichons les prix dans votre devise (conversion approximative).",
      notAvailable: "Aucune boutique ne livre encore ce produit dans ce pays.",
      searchPlaceholder: "Rechercher un pays...",
      noMatches: "Nous n'avons pas trouvé ce pays.",
    },
    favoritesPanel: {
      empty: "Vous n'avez encore enregistré aucun maillot. Touchez le cœur sur une fiche pour l'enregistrer ici.",
      title: "Vos favoris",
      viewAll: "Voir tous les favoris",
    },
    favoritesPage: {
      title: "Vos favoris",
      empty: "Vous n'avez encore enregistré aucun maillot.",
      browse: "Explorer les maillots",
      priceAlertNote: "Nous vous préviendrons par mail si l'un d'eux baisse de prix.",
    },
    loginPanel: {
      title: "Votre compte",
      text: "Connectez-vous pour enregistrer vos favoris et y accéder depuis n'importe quel appareil.",
      googleCta: "Continuer avec Google",
      or: "ou",
      emailPlaceholder: "Votre email",
      emailCta: "Envoyer le lien de connexion",
      emailSending: "Envoi en cours...",
      emailSent: "Nous vous avons envoyé un lien de connexion. Vérifiez vos mails.",
      emailError: "Impossible d'envoyer le lien. Réessayez.",
      signedInAs: "Connecté en tant que",
      signOut: "Se déconnecter",
      favoritesGateTitle: "Connectez-vous pour enregistrer des favoris",
      favoritesGateText: "Pour ajouter des maillots aux favoris et les voir sur n'importe quel appareil, vous devez d'abord vous connecter.",
    },
    categoriesMenu: {
      national: "Sélections nationales",
      nationalDesc: "Maillots des équipes nationales",
      clubs: "Clubs",
      clubsDesc: "Maillots de clubs et de championnats",
      retro: "Rétro",
      retroDesc: "Éditions classiques et vintage",
      soon: "Bientôt disponible",
    },
    hero: {
      eyebrow: "Le patrimoine du football, tout au même endroit",
      title: "Le catalogue du collectionneur",
      subtitle:
        "Nous comparons les prix des maillots de sélections, de clubs et de championnats du monde entier. Vous achetez directement où vous voulez.",
      cta: "Acheter maintenant",
    },
    heroSlides: [
      {
        eyebrow: "Sélections nationales",
        title: "Le maillot de votre sélection",
        subtitle:
          "Argentine, Brésil, Espagne et les sélections du monde entier, comparées au même endroit.",
        cta: "Voir les sélections",
      },
      {
        eyebrow: "Les grands clubs",
        title: "Les couleurs que vous portiez enfant",
        subtitle: "Real Madrid, Boca, Manchester United et des centaines d'autres clubs, au meilleur prix réel.",
        cta: "Voir les clubs",
      },
      {
        eyebrow: "La collection rétro",
        title: "Des reliques d'une autre époque",
        subtitle: "Maillots vintage de 2006 et avant, vérifiés un par un.",
        cta: "Voir la collection rétro",
      },
      {
        eyebrow: "Coupes et tailles femme",
        title: "Fait pour vous",
        subtitle: "Maillots officiels coupe femme, chez des boutiques qui ont vraiment du stock.",
        cta: "Voir la collection femme",
      },
      {
        eyebrow: "La prochaine génération de supporters",
        title: "Futures légendes",
        subtitle: "Les maillots enfant de leurs idoles, dans les tailles qu'il vous faut.",
        cta: "Voir la collection enfant",
      },
    ],
    featured: {
      eyebrow: "Pépites du catalogue",
      title: "Maillots en vedette",
    },
    steps: {
      title1: "Recherchez",
      text1: "Tapez votre club, votre sélection ou votre championnat.",
      title2: "Nous comparons",
      text2: "Nous vérifions les prix entre boutiques instantanément.",
      title3: "Vous achetez",
      text3: "Nous vous emmenons directement vers la meilleure offre disponible.",
    },
    search: {
      label: "Recherchez votre sélection, club ou championnat",
      placeholder: "Recherchez un maillot, un numéro, une époque... (Ex : Riquelme 2001, Italie 2006, Real Madrid)",
      noResults: 'Nous n\'avons pas encore trouvé de maillots pour "{query}". Nous ajoutons de nouvelles boutiques chaque semaine.',
      allCategories: "Tout",
      categoryNational: "Sélections nationales",
      categoryClubs: "Clubs",
      typeLabel: "Type",
      seasonLabel: "Saison",
      ageGroupLabel: "Âge",
      ageGroupMen: "Homme",
      ageGroupWomen: "Femme",
      ageGroupKids: "Enfant",
      quickSelectLabel: "Sélection rapide",
      clearAria: "Effacer la recherche",
      resultsCount: "{n} maillots trouvés",
      sortLabel: "Trier par",
      sortRelevance: "Pertinence",
      sortPriceAsc: "Prix : croissant",
      sortPriceDesc: "Prix : décroissant",
      sortNewest: "Plus récent",
      sortOldest: "Plus ancien",
      filtersButton: "Filtres",
      showResults: "Voir les résultats",
      brandLabel: "Marque",
      storeLabel: "Boutique",
      loadMore: "Voir plus",
      sizeLabel: "Taille",
      colorLabel: "Couleur",
      colorBlack: "Noir",
      colorWhite: "Blanc",
      colorGray: "Gris",
      colorRed: "Rouge",
      colorOrange: "Orange",
      colorYellow: "Jaune",
      colorGreen: "Vert",
      colorTeal: "Turquoise",
      colorBlue: "Bleu ciel",
      colorNavy: "Bleu marine",
      colorPurple: "Violet",
      colorPink: "Rose",
      priceRangeLabel: "Fourchette de prix",
      clearFilters: "Effacer les filtres",
    },
    product: {
      bestPrice: "Meilleur prix",
      in: "chez",
      outOfStockLabel: "Aucun stock disponible",
      buy: "Acheter",
      soldOut: "Épuisé",
      viewStores: "Autres boutiques ({n})",
      hideStores: "Masquer les boutiques",
      inStores: "Dans {n} boutiques",
      sizesRange: "Tailles {range}",
      shippingIncluded: "livraison incl.",
    },
    detail: {
      backToCatalog: "Retour au catalogue",
      chooseSize: "Choisissez votre taille",
      allSizes: "Toutes les boutiques",
      notAvailableInSize: "Non disponible en taille {size}",
      notAvailableInCountry: "Livraison non disponible vers {country}",
      allSoldOut: "Toutes les offres pour ce maillot sont épuisées pour le moment.",
      storesCompared: "{n} boutiques comparées",
      priceHistoryLabel: "Évolution du prix (derniers {n} jours)",
      basePrice: "Prix",
      shipping: "Livraison",
      total: "Total",
      viewInStore: "Voir dans la boutique",
      photoPlaceholder: "Photo du produit bientôt disponible",
      currencyNote: "Prix réel de chaque boutique dans sa devise d'origine. La boutique peut vous afficher une autre devise selon votre localisation, mais facture ce même prix.",
      replicaBadge: "Réplique (non officielle)",
      bestPriceBadge: "Meilleure offre",
      retroBadge: "Rétro / Collection",
      from: "À partir de",
      viewFullComparison: "Voir la comparaison complète",
      sameTeamEyebrow: "Des mêmes archives",
      sameTeamTitle: "Plus de cette équipe",
      sameSizeEyebrow: "Dans votre taille",
      sameSizeTitle: "D'autres offres dans votre taille",
      realShippingTo: "Livraison réelle vers {country}",
      importCharges: "Frais d'importation",
      checkingRealShipping: "Calcul de la livraison réelle vers votre pays…",
      includedInTotal: "inclus dans le total",
    },
    footer: {
      about: "À propos",
      contact: "Contact",
      privacy: "Confidentialité",
      terms: "Conditions",
      sizeGuide: "Guide des tailles",
      authenticity: "Authenticité",
      disclaimer:
        "Football Cult est un site de comparaison de prix. Nous ne vendons pas de produits directement : nous vous redirigeons vers des boutiques tierces pour finaliser votre achat. Certains liens sont des liens d'affiliation, ce qui signifie que nous pouvons percevoir une commission sans coût supplémentaire pour vous.",
    },
    about: {
      title: "À propos de nous",
      p1: "Football Cult est né d'une idée simple : trouver le maillot de votre sélection, de votre club ou de votre championnat préféré — où que ce soit dans le monde — ne devrait pas obliger à ouvrir vingt onglets pour comparer les prix.",
      p2: "Nous sommes un site indépendant de comparaison de prix. Nous parcourons différentes boutiques en ligne et vous montrons les meilleures options disponibles pour que vous puissiez décider où acheter en toute connaissance de cause.",
      p3: 'Football Cult ne vend pas de produits directement et ne gère ni les paiements, ni la livraison, ni les retours. Quand vous cliquez sur « Acheter », nous vous emmenons vers la boutique correspondante pour finaliser votre achat. Certains de ces liens sont des liens d\'affiliation : si vous achetez via ceux-ci, nous pouvons percevoir une petite commission de la boutique, sans coût supplémentaire pour vous.',
    },
    sizeGuide: {
      title: "Guide des Tailles",
      intro: "Les maillots de football ne se taillent pas comme les vêtements du quotidien : la plupart ont une coupe sportive, pensée pour jouer, pas pour un usage courant. Avant d'acheter, voici quelques points à garder en tête.",
      fitTitle: "Authentique vs. réplique : la coupe n'est pas la même",
      fitText: "La version « authentique » (celle que portent les joueurs, parfois appelée « match » ou sous le nom de technologie propre à chaque marque) a une coupe ajustée au corps. La version « réplique » ou supporter a une coupe plus ample, plus confortable au quotidien. Si vous la préférez plus large, cherchez la réplique ; si vous voulez la coupe match réelle, cherchez l'authentique — dans les deux cas, cela ne correspond pas toujours à votre taille habituelle de t-shirt.",
      measureTitle: "La façon la plus sûre de choisir : comparer, ne pas deviner",
      measureText: "Plutôt que de vous fier uniquement à votre taille habituelle, mesurez un maillot que vous possédez déjà et qui vous va bien (largeur de poitrine d'aisselle à aisselle, et longueur épaule-hanche) et comparez ces mesures au guide des tailles que chaque boutique publie sur sa propre fiche produit.",
      brandsTitle: "Chaque marque taille différemment",
      brandsText: "Nike, Adidas, Puma et les autres marques n'utilisent pas exactement le même système de tailles entre elles — un M d'une marque n'est pas forcément identique au M d'une autre. Vérifiez toujours le guide des tailles spécifique à la boutique et à la marque avant de confirmer votre achat.",
      kidsTitle: "Tailles enfant",
      kidsText: "Les vêtements enfant sont généralement taillés par âge ou par taille en cm (par exemple 8 ans, 128 cm) plutôt qu'en S/M/L, et ces conversions varient aussi selon la marque — même règle : comparez avec un vêtement que l'enfant possède déjà avant de choisir.",
      note: "Chaque fiche produit filtre les tailles réellement disponibles par boutique — mais la coupe finale dépend de la boutique et de la marque, pas de Football Cult. En cas de doute, le guide des tailles de la boutique elle-même reste toujours la source la plus fiable.",
    },
    authenticity: {
      title: "Comment Vérifier l'Authenticité",
      intro: "Football Cult ne vend pas directement : nous vous redirigeons vers la vraie boutique pour finaliser votre achat là-bas. L'authenticité de ce que vous achetez dépend donc de la boutique, pas de nous — mais nous pouvons vous aider à repérer les vrais signaux avant de décider.",
      termsTitle: "« Authentique » et « réplique » ne sont pas la même chose",
      termsText: "« Authentique » (ou « match ») est la version avec la technologie et la coupe que portent réellement les joueurs sur le terrain, sous licence officielle du club ou de la fédération. « Réplique » est la version supporter — également sous licence officielle dans la grande majorité des cas, mais coupée et fabriquée pour un usage quotidien, pas pour jouer. Aucune des deux n'est une contrefaçon — ce sont deux produits officiels différents, à des prix différents.",
      redFlagsTitle: "Signes que quelque chose n'est pas ce qu'il prétend être",
      redFlagsText: "Un prix nettement inférieur à toutes les autres offres pour le même produit, des photos génériques qui ne correspondent pas au vrai blason/sponsor, l'absence de guide des tailles propre, ou un nom de domaine de boutique que vous ne reconnaissez pas et qu'on ne trouve nulle part ailleurs — ce sont les signes les plus courants d'un vendeur peu fiable. Achetez toujours via le lien qui vous mène directement à la boutique, et ne partagez jamais vos données de paiement ailleurs.",
      ourBadgeTitle: "Comment on le signale sur le site",
      ourBadgeText: "Quand on identifie qu'une offre précise provient d'une boutique qui vend exclusivement des répliques non officielles, on marque cette offre avec l'étiquette « Réplique (non officielle) » directement dessus — comme ça vous le savez avant de cliquer, pas après.",
      note: "Si ce que vous recevez ne correspond pas à ce que vous avez vu sur Football Cult, la réclamation se fait directement auprès de la boutique où vous avez acheté — nous ne traitons ni les paiements ni les livraisons. Vous pouvez utiliser le bouton « Signaler le produit » sur n'importe quelle fiche pour nous prévenir qu'un élément ne correspond pas, afin qu'on puisse vérifier.",
    },
    priceDrop: {
      eyebrow: "Les offres du jour",
      title: "Baisses de prix",
      badge: "-{n}%",
      filterLabel: "Baisses de prix",
    },
    heritage: {
      eyebrow: "Depuis les archives",
      title: "La Chronique du Maillot",
      sourceLabel: "Source",
    },
    contact: {
      title: "Contact",
      p1: "Vous avez trouvé un prix obsolète, une boutique à ajouter, ou vous avez une question ? Contactez-nous.",
      emailLabel: "Email",
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      messageLabel: "Message",
      messagePlaceholder: "Dites-nous ce que vous avez trouvé ou ce dont vous avez besoin...",
      submit: "Envoyer le message",
      submitting: "Envoi en cours...",
      success: "C'est fait ! Nous avons reçu votre message, nous vous répondrons bientôt.",
      error: "Impossible d'envoyer le message. Réessayez dans un instant.",
      orEmail: "Ou écrivez-nous directement à :",
    },
    privacy: {
      title: "Politique de confidentialité",
      updated: "Dernière mise à jour : [à compléter avant publication].",
      intro:
        'Football Cult (« nous ») exploite ce site web. Cette page explique quelles informations nous collectons et comment nous les utilisons.',
      collectTitle: "Informations que nous collectons",
      collectText:
        "Nous pouvons collecter des données d'utilisation basiques (pages visitées, recherches effectuées) via des cookies ou des outils d'analyse, ainsi que votre adresse email si vous nous contactez ou vous inscrivez aux alertes de prix.",
      affiliateTitle: "Liens d'affiliation",
      affiliateText:
        "Ce site participe à des programmes d'affiliation (comme Awin, CJ Affiliate ou Rakuten Advertising). Cela signifie que certains liens vers des boutiques tierces sont des liens d'affiliation : si vous achetez via ceux-ci, la boutique peut nous communiquer des informations sur la transaction (pas vos données personnelles) afin de calculer la commission correspondante.",
      thirdPartyTitle: "Tiers",
      thirdPartyText:
        "Nous ne vendons pas vos informations personnelles à des tiers. Les boutiques vers lesquelles nous vous redirigeons ont leurs propres politiques de confidentialité, que nous vous recommandons de consulter avant d'acheter.",
      contactTitle: "Contact",
      contactText: "Pour toute question concernant cette politique, écrivez-nous à",
    },
    terms: {
      title: "Conditions générales",
      updated: "Dernière mise à jour : [à compléter avant publication].",
      whatTitle: "Qu'est-ce que Football Cult",
      whatText:
        "Football Cult est un service de comparaison de prix. Nous ne vendons pas de produits, ne traitons pas les paiements, et ne sommes pas partie au contrat d'achat entre l'utilisateur et la boutique sélectionnée.",
      accuracyTitle: "Exactitude des prix",
      accuracyText:
        "Nous faisons de notre mieux pour maintenir les prix à jour, mais nous ne garantissons pas qu'ils reflètent le prix final au moment du paiement (ils peuvent varier selon le stock, la taille, les frais de livraison ou des changements côté boutique). Le prix final valable est toujours celui affiché par la boutique au moment du paiement.",
      ordersTitle: "Commandes, livraison et retours",
      ordersText:
        "Toute question concernant votre commande, la livraison, un retour ou une garantie doit être adressée à la boutique où vous avez acheté, puisque c'est elle qui traite la vente.",
      affiliateTitle: "Liens d'affiliation",
      affiliateText:
        "Football Cult participe à des programmes d'affiliation et peut percevoir une commission sur les achats effectués via nos liens, sans coût supplémentaire pour l'utilisateur.",
    },
    notFound: {
      title: "Hors-jeu",
      text: "Nous n'avons pas trouvé cette page. Le lien est peut-être cassé ou le maillot n'est peut-être plus au catalogue.",
      cta: "Retour au catalogue",
    },
    recentlyViewed: {
      title: "Vus récemment",
      empty: "Vous n'avez encore consulté aucun maillot.",
    },
    share: {
      button: "Partager",
      copied: "Lien copié !",
    },
    reportProduct: {
      button: "Signaler le produit",
      modalTitle: "Signaler ce produit",
      modalIntro: "Dites-nous ce qui ne va pas pour que nous puissions vérifier.",
      reasonLabel: "Motif",
      reasonWrongPhoto: "La photo ne correspond pas",
      reasonWrongPrice: "Le prix est incorrect",
      reasonWrongName: "Le nom ou l'équipe est incorrect",
      reasonBrokenLink: "Le lien vers la boutique est cassé",
      reasonOther: "Autre",
      detailsLabel: "Précisez (facultatif)",
      detailsPlaceholder: "Décrivez le problème...",
      submit: "Envoyer le signalement",
      submitting: "Envoi en cours...",
      success: "Merci ! Nous avons bien reçu votre signalement.",
      error: "Impossible d'envoyer le signalement. Réessayez.",
      cancel: "Annuler",
    },
    compare: {
      add: "Comparer",
      remove: "Retirer de la comparaison",
      barTitle: "Comparaison",
      viewComparison: "Voir la comparaison",
      clearAll: "Effacer",
      maxReached: "Vous pouvez comparer jusqu'à 3 maillots",
      pageTitle: "Comparer les maillots",
      empty: "Vous n'avez encore ajouté aucun maillot à comparer.",
      store: "Boutique",
      price: "Prix",
      shippingCost: "Livraison",
      taxes: "Taxes",
      taxesIncluded: "Incluses",
      freeShipping: "Gratuite",
      total: "Total",
      sellersLabel: "Vendeurs",
      noSellers: "Aucune offre disponible",
      sizes: "Tailles",
      viewProduct: "Voir le maillot",
    },
  },
  it: {
    brand: "Football Cult",
    brandTagline: "Un collettivo di eredità calcistica.",
    nav: {
      search: "Cerca",
      categories: "Categorie",
      about: "Chi siamo",
      contact: "Contatti",
      login: "Accedi",
      favorites: "Preferiti",
      shipTo: "Spedire a",
    },
    countryPanel: {
      title: "Dove dobbiamo spedire?",
      note: "Filtriamo i negozi che spediscono nel tuo paese e mostriamo i prezzi nella tua valuta (conversione approssimativa).",
      notAvailable: "Nessun negozio spedisce ancora questo prodotto in questo paese.",
      searchPlaceholder: "Cerca un paese...",
      noMatches: "Non abbiamo trovato questo paese.",
    },
    favoritesPanel: {
      empty: "Non hai ancora salvato nessuna maglia. Tocca il cuore su una scheda per salvarla qui.",
      title: "I tuoi preferiti",
      viewAll: "Vedi tutti i preferiti",
    },
    favoritesPage: {
      title: "I tuoi preferiti",
      empty: "Non hai ancora salvato nessuna maglia.",
      browse: "Esplora le maglie",
      priceAlertNote: "Ti avviseremo via email se una di queste scende di prezzo.",
    },
    loginPanel: {
      title: "Il tuo account",
      text: "Accedi per salvare i tuoi preferiti e accedervi da qualsiasi dispositivo.",
      googleCta: "Continua con Google",
      or: "oppure",
      emailPlaceholder: "La tua email",
      emailCta: "Invia link di accesso",
      emailSending: "Invio in corso...",
      emailSent: "Ti abbiamo inviato un link di accesso. Controlla la tua email.",
      emailError: "Non siamo riusciti a inviare il link. Riprova.",
      signedInAs: "Accesso effettuato come",
      signOut: "Esci",
      favoritesGateTitle: "Accedi per salvare i preferiti",
      favoritesGateText: "Per aggiungere maglie ai preferiti e vederle su qualsiasi dispositivo, devi prima accedere.",
    },
    categoriesMenu: {
      national: "Nazionali",
      nationalDesc: "Maglie delle nazionali",
      clubs: "Club",
      clubsDesc: "Maglie di club e campionati",
      retro: "Retrò",
      retroDesc: "Edizioni classiche e vintage",
      soon: "Prossimamente",
    },
    hero: {
      eyebrow: "L'eredità del calcio, tutta in un posto solo",
      title: "Il catalogo del collezionista",
      subtitle:
        "Confrontiamo i prezzi delle maglie di nazionali, club e campionati di tutto il mondo. Acquisti direttamente dove vuoi.",
      cta: "Acquista ora",
    },
    heroSlides: [
      {
        eyebrow: "Nazionali",
        title: "La maglia della tua nazionale",
        subtitle:
          "Argentina, Brasile, Spagna e le nazionali di tutto il mondo, confrontate in un unico posto.",
        cta: "Vedi le nazionali",
      },
      {
        eyebrow: "I grandi club",
        title: "I colori che sceglievi da bambino",
        subtitle: "Real Madrid, Boca, Manchester United e centinaia di altri club, al miglior prezzo reale.",
        cta: "Vedi i club",
      },
      {
        eyebrow: "La collezione retrò",
        title: "Reliquie di un'altra epoca",
        subtitle: "Maglie vintage dal 2006 in poi indietro, verificate una per una.",
        cta: "Vedi il retrò",
      },
      {
        eyebrow: "Taglie e vestibilità donna",
        title: "Fatta su misura",
        subtitle: "Maglie ufficiali con vestibilità donna, da negozi che hanno davvero disponibilità.",
        cta: "Vedi la collezione donna",
      },
      {
        eyebrow: "La prossima generazione di tifosi",
        title: "Future leggende",
        subtitle: "Le maglie bambino dei loro idoli, nelle taglie di cui hai bisogno.",
        cta: "Vedi la collezione bambino",
      },
    ],
    featured: {
      eyebrow: "Perle del catalogo",
      title: "Maglie in evidenza",
    },
    steps: {
      title1: "Cerca",
      text1: "Digita la tua squadra, nazionale o campionato.",
      title2: "Confrontiamo",
      text2: "Verifichiamo i prezzi tra i negozi all'istante.",
      title3: "Acquisti",
      text3: "Ti portiamo direttamente alla migliore offerta disponibile.",
    },
    search: {
      label: "Cerca la tua nazionale, club o campionato",
      placeholder: "Cerca una maglia, un numero, un'epoca... (Es: Riquelme 2001, Italia 2006, Real Madrid)",
      noResults: 'Non abbiamo ancora trovato maglie per "{query}". Aggiungiamo nuovi negozi ogni settimana.',
      allCategories: "Tutte",
      categoryNational: "Nazionali",
      categoryClubs: "Club",
      typeLabel: "Tipo",
      seasonLabel: "Stagione",
      ageGroupLabel: "Età",
      ageGroupMen: "Uomo",
      ageGroupWomen: "Donna",
      ageGroupKids: "Bambino",
      quickSelectLabel: "Scelte rapide",
      clearAria: "Cancella ricerca",
      resultsCount: "{n} maglie trovate",
      sortLabel: "Ordina per",
      sortRelevance: "Rilevanza",
      sortPriceAsc: "Prezzo: dal più basso",
      sortPriceDesc: "Prezzo: dal più alto",
      sortNewest: "Più recenti",
      sortOldest: "Più vecchie",
      filtersButton: "Filtri",
      showResults: "Mostra risultati",
      brandLabel: "Marca",
      storeLabel: "Negozio",
      loadMore: "Mostra altro",
      sizeLabel: "Taglia",
      colorLabel: "Colore",
      colorBlack: "Nero",
      colorWhite: "Bianco",
      colorGray: "Grigio",
      colorRed: "Rosso",
      colorOrange: "Arancione",
      colorYellow: "Giallo",
      colorGreen: "Verde",
      colorTeal: "Verde acqua",
      colorBlue: "Azzurro",
      colorNavy: "Blu navy",
      colorPurple: "Viola",
      colorPink: "Rosa",
      priceRangeLabel: "Fascia di prezzo",
      clearFilters: "Cancella filtri",
    },
    product: {
      bestPrice: "Miglior prezzo",
      in: "su",
      outOfStockLabel: "Nessuna disponibilità",
      buy: "Acquista",
      soldOut: "Esaurito",
      viewStores: "Altri negozi ({n})",
      hideStores: "Nascondi negozi",
      inStores: "In {n} negozi",
      sizesRange: "Taglie {range}",
      shippingIncluded: "spedizione incl.",
    },
    detail: {
      backToCatalog: "Torna al catalogo",
      chooseSize: "Scegli la tua taglia",
      allSizes: "Tutti i negozi",
      notAvailableInSize: "Non disponibile in taglia {size}",
      notAvailableInCountry: "Spedizione non disponibile verso {country}",
      allSoldOut: "Tutte le offerte per questa maglia sono esaurite per ora.",
      storesCompared: "{n} negozi confrontati",
      priceHistoryLabel: "Andamento del prezzo (ultimi {n} giorni)",
      basePrice: "Prezzo",
      shipping: "Spedizione",
      total: "Totale",
      viewInStore: "Vedi nel negozio",
      photoPlaceholder: "Foto del prodotto in arrivo",
      currencyNote: "Prezzo reale di ogni negozio nella sua valuta originale. Il negozio potrebbe mostrarti un'altra valuta in base alla tua posizione, ma addebita questo stesso prezzo.",
      replicaBadge: "Replica (non ufficiale)",
      bestPriceBadge: "Migliore offerta",
      retroBadge: "Retrò / Collezione",
      from: "Da",
      viewFullComparison: "Vedi il confronto completo",
      sameTeamEyebrow: "Dallo stesso archivio",
      sameTeamTitle: "Altro di questa squadra",
      sameSizeEyebrow: "Nella tua taglia",
      sameSizeTitle: "Altre offerte nella tua taglia",
      realShippingTo: "Spedizione reale verso {country}",
      importCharges: "Oneri doganali",
      checkingRealShipping: "Calcolo della spedizione reale verso il tuo paese…",
      includedInTotal: "incluso nel totale",
    },
    footer: {
      about: "Chi siamo",
      contact: "Contatti",
      privacy: "Privacy",
      terms: "Termini",
      sizeGuide: "Guida alle taglie",
      authenticity: "Autenticità",
      disclaimer:
        "Football Cult è un sito di comparazione prezzi. Non vendiamo prodotti direttamente: ti reindirizziamo verso negozi di terze parti per completare l'acquisto. Alcuni link sono link di affiliazione, il che significa che potremmo guadagnare una commissione senza costi aggiuntivi per te.",
    },
    about: {
      title: "Chi siamo",
      p1: "Football Cult è nato da un'idea semplice: trovare la maglia della tua nazionale, del tuo club o del tuo campionato preferito — da qualsiasi parte del mondo — non dovrebbe significare aprire venti schede del browser per confrontare i prezzi.",
      p2: "Siamo un sito indipendente di comparazione prezzi. Cerchiamo tra diversi negozi online e ti mostriamo le migliori opzioni disponibili così puoi decidere dove acquistare con tutte le informazioni a disposizione.",
      p3: 'Football Cult non vende prodotti direttamente e non gestisce pagamenti, spedizioni o resi. Quando clicchi su "Acquista", ti portiamo al negozio corrispondente per completare l\'acquisto lì. Alcuni di questi link sono link di affiliazione: se acquisti tramite essi, potremmo guadagnare una piccola commissione dal negozio, senza costi aggiuntivi per te.',
    },
    sizeGuide: {
      title: "Guida alle Taglie",
      intro: "Le maglie da calcio non vestono come i normali capi di abbigliamento: la maggior parte ha un taglio sportivo, pensato per giocare, non per l'uso quotidiano. Prima di acquistare, vale la pena tenere a mente questi punti.",
      fitTitle: "Autentica vs. replica: il taglio non è lo stesso",
      fitText: "La versione 'autentica' (quella indossata dai giocatori, a volte chiamata 'match' o con il nome tecnologico proprio di ogni marca) ha un taglio aderente al corpo. La versione 'replica' o da tifoso ha un taglio più ampio, più comodo per l'uso quotidiano. Se la preferisci più larga, cerca la replica; se vuoi la vestibilità match reale, cerca l'autentica — in entrambi i casi non sempre corrisponde alla tua taglia abituale di maglietta.",
      measureTitle: "Il modo più sicuro per scegliere: confrontare, non indovinare",
      measureText: "Invece di affidarti solo alla tua taglia abituale, misura una maglia che possiedi già e che ti sta bene (larghezza del petto da ascella ad ascella, e lunghezza da spalla ad anca) e confronta queste misure con la tabella taglie che ogni negozio pubblica nella propria pagina prodotto.",
      brandsTitle: "Ogni marca ha una taglia diversa",
      brandsText: "Nike, Adidas, Puma e le altre marche non usano esattamente la stessa numerazione tra loro — una taglia M di una marca potrebbe non corrispondere alla M di un'altra. Controlla sempre la tabella taglie specifica del negozio e della marca prima di confermare l'acquisto.",
      kidsTitle: "Taglie bambino",
      kidsText: "L'abbigliamento per bambini è solitamente numerato per età o altezza (ad esempio 8 anni, 128 cm) invece che S/M/L, e anche queste conversioni variano da marca a marca — stessa regola: confronta con un capo che il bambino possiede già prima di scegliere.",
      note: "In ogni scheda prodotto filtriamo le taglie realmente disponibili per negozio — ma la vestibilità finale dipende dal negozio e dalla marca, non da Football Cult. In caso di dubbio, la tabella taglie del negozio stesso è sempre la fonte più affidabile.",
    },
    authenticity: {
      title: "Come Verificare l'Autenticità",
      intro: "Football Cult non vende direttamente: ti reindirizziamo al negozio reale per completare l'acquisto lì. Per questo l'autenticità di ciò che acquisti dipende dal negozio, non da noi — ma possiamo aiutarti a individuare segnali reali prima di decidere.",
      termsTitle: "'Autentica' e 'replica' non sono la stessa cosa",
      termsText: "'Autentica' (o 'match') è la versione con la tecnologia e il taglio che i giocatori indossano realmente in campo, su licenza ufficiale del club o della federazione. 'Replica' è la versione da tifoso — anch'essa su licenza ufficiale nella grande maggioranza dei casi, ma tagliata e realizzata per l'uso quotidiano, non per giocare. Nessuna delle due è una contraffazione — sono due prodotti ufficiali diversi, a prezzi diversi.",
      redFlagsTitle: "Segnali che qualcosa non è quello che dichiara di essere",
      redFlagsText: "Un prezzo molto più basso di tutte le altre offerte per lo stesso prodotto, foto generiche che non corrispondono allo stemma/sponsor reali, l'assenza di una tabella taglie propria, o un dominio del negozio che non riconosci e non trovi da nessun'altra parte — sono i segnali più comuni di un venditore poco affidabile. Acquista sempre tramite il link che ti porta direttamente al negozio, e non condividere mai i tuoi dati di pagamento altrove.",
      ourBadgeTitle: "Come lo segnaliamo sul sito",
      ourBadgeText: "Quando identifichiamo che un'offerta specifica proviene da un negozio che vende esclusivamente repliche non ufficiali, contrassegniamo quell'offerta con l'etichetta 'Replica (non ufficiale)' direttamente su di essa — così lo sai prima di cliccare, non dopo.",
      note: "Se ciò che ricevi non corrisponde a quanto visto su Football Cult, il reclamo va direttamente al negozio dove hai acquistato — noi non gestiamo pagamenti né spedizioni. Puoi usare il pulsante 'Segnala prodotto' su qualsiasi scheda per avvisarci che qualcosa non corrisponde, così possiamo verificare.",
    },
    priceDrop: {
      eyebrow: "Le offerte di oggi",
      title: "Prezzi in calo",
      badge: "-{n}%",
      filterLabel: "Prezzi in calo",
    },
    heritage: {
      eyebrow: "Dall'archivio",
      title: "La Cronaca della Maglia",
      sourceLabel: "Fonte",
    },
    contact: {
      title: "Contatti",
      p1: "Hai trovato un prezzo non aggiornato, un negozio da aggiungere, o hai una domanda? Scrivici.",
      emailLabel: "Email",
      nameLabel: "Nome",
      namePlaceholder: "Il tuo nome",
      messageLabel: "Messaggio",
      messagePlaceholder: "Raccontaci cosa hai trovato o di cosa hai bisogno...",
      submit: "Invia messaggio",
      submitting: "Invio in corso...",
      success: "Fatto! Abbiamo ricevuto il tuo messaggio, ti risponderemo presto.",
      error: "Non siamo riusciti a inviarlo. Riprova tra poco.",
      orEmail: "Oppure scrivici direttamente a:",
    },
    privacy: {
      title: "Informativa sulla privacy",
      updated: "Ultimo aggiornamento: [da completare prima della pubblicazione].",
      intro:
        'Football Cult ("noi") gestisce questo sito web. Questa pagina spiega quali informazioni raccogliamo e come le utilizziamo.',
      collectTitle: "Informazioni che raccogliamo",
      collectText:
        "Potremmo raccogliere dati di utilizzo di base (pagine visitate, ricerche effettuate) tramite cookie o strumenti di analisi, e il tuo indirizzo email se ci contatti o ti iscrivi agli avvisi di prezzo.",
      affiliateTitle: "Link di affiliazione",
      affiliateText:
        "Questo sito partecipa a programmi di affiliazione (come Awin, CJ Affiliate o Rakuten Advertising). Ciò significa che alcuni link verso negozi di terze parti sono link di affiliazione: se acquisti tramite essi, il negozio potrebbe condividere con noi informazioni sulla transazione (non i tuoi dati personali) per calcolare la relativa commissione.",
      thirdPartyTitle: "Terze parti",
      thirdPartyText:
        "Non vendiamo le tue informazioni personali a terze parti. I negozi verso cui ti reindirizziamo hanno le proprie informative sulla privacy, che ti consigliamo di consultare prima di acquistare.",
      contactTitle: "Contatti",
      contactText: "Per qualsiasi domanda su questa informativa, scrivici a",
    },
    terms: {
      title: "Termini e Condizioni",
      updated: "Ultimo aggiornamento: [da completare prima della pubblicazione].",
      whatTitle: "Cos'è Football Cult",
      whatText:
        "Football Cult è un servizio di comparazione prezzi. Non vendiamo prodotti, non elaboriamo pagamenti e non siamo parte del contratto di acquisto tra l'utente e il negozio selezionato.",
      accuracyTitle: "Accuratezza dei prezzi",
      accuracyText:
        "Facciamo del nostro meglio per mantenere i prezzi aggiornati, ma non garantiamo che riflettano il prezzo finale al momento del pagamento (possono variare in base a disponibilità, taglia, costi di spedizione o modifiche da parte del negozio). Il prezzo finale valido è sempre quello mostrato dal negozio al momento del pagamento.",
      ordersTitle: "Ordini, spedizioni e resi",
      ordersText:
        "Qualsiasi domanda sul tuo ordine, spedizione, reso o garanzia deve essere indirizzata al negozio presso cui hai acquistato, poiché è lui a gestire la vendita.",
      affiliateTitle: "Link di affiliazione",
      affiliateText:
        "Football Cult partecipa a programmi di affiliazione e potrebbe guadagnare una commissione dagli acquisti effettuati tramite i nostri link, senza costi aggiuntivi per l'utente.",
    },
    notFound: {
      title: "Fuorigioco",
      text: "Non abbiamo trovato questa pagina. Il link potrebbe essere interrotto oppure la maglia potrebbe non essere più nel catalogo.",
      cta: "Torna al catalogo",
    },
    recentlyViewed: {
      title: "Visti di recente",
      empty: "Non hai ancora visualizzato nessuna maglia.",
    },
    share: {
      button: "Condividi",
      copied: "Link copiato!",
    },
    reportProduct: {
      button: "Segnala prodotto",
      modalTitle: "Segnala questo prodotto",
      modalIntro: "Dicci cosa non va così possiamo verificarlo.",
      reasonLabel: "Motivo",
      reasonWrongPhoto: "La foto non corrisponde",
      reasonWrongPrice: "Il prezzo è sbagliato",
      reasonWrongName: "Il nome o la squadra sono sbagliati",
      reasonBrokenLink: "Il link al negozio è interrotto",
      reasonOther: "Altro",
      detailsLabel: "Dicci di più (facoltativo)",
      detailsPlaceholder: "Descrivi il problema...",
      submit: "Invia segnalazione",
      submitting: "Invio in corso...",
      success: "Grazie! Abbiamo ricevuto la tua segnalazione.",
      error: "Non siamo riusciti a inviare la segnalazione. Riprova.",
      cancel: "Annulla",
    },
    compare: {
      add: "Confronta",
      remove: "Rimuovi dal confronto",
      barTitle: "Confronto",
      viewComparison: "Vedi confronto",
      clearAll: "Cancella",
      maxReached: "Puoi confrontare fino a 3 maglie",
      pageTitle: "Confronta maglie",
      empty: "Non hai ancora aggiunto nessuna maglia da confrontare.",
      store: "Negozio",
      price: "Prezzo",
      shippingCost: "Spedizione",
      taxes: "Tasse",
      taxesIncluded: "Incluse",
      freeShipping: "Gratuita",
      total: "Totale",
      sellersLabel: "Venditori",
      noSellers: "Nessuna offerta disponibile",
      sizes: "Taglie",
      viewProduct: "Vedi maglia",
    },
  },
};
