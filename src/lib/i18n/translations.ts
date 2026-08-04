export type Locale = "es" | "en" | "pt";

export const locales: Locale[] = ["es", "en", "pt"];

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
  };
  loginPanel: {
    title: string;
    text: string;
    googleCta: string;
    signedInAs: string;
    signOut: string;
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
    ageGroupAdult: string;
    ageGroupKids: string;
    quickSelectLabel: string;
    clearAria: string;
    resultsCount: string;
    sortLabel: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortNewest: string;
    sortOldest: string;
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
    storesCompared: string;
    basePrice: string;
    shipping: string;
    total: string;
    viewInStore: string;
    photoPlaceholder: string;
    currencyNote: string;
    replicaNotice: string;
  };
  footer: {
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    disclaimer: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  contact: {
    title: string;
    p1: string;
    emailLabel: string;
    note: string;
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
    note: string;
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
    note: string;
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
    },
    loginPanel: {
      title: "Tu cuenta",
      text: "Iniciá sesión para guardar tus favoritos y accederlos desde cualquier dispositivo.",
      googleCta: "Continuar con Google",
      signedInAs: "Conectado como",
      signOut: "Cerrar sesión",
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
      eyebrow: "Descubrí tu herencia futbolera",
      title: "Explorá nuestro archivo",
      subtitle:
        "Comparamos precios de camisetas de selecciones, clubes y ligas de todo el mundo. Vos comprás directo donde quieras.",
      cta: "Ver catálogo",
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
      ageGroupLabel: "Talle",
      ageGroupAdult: "Adulto",
      ageGroupKids: "Niño/a",
      quickSelectLabel: "Accesos rápidos",
      clearAria: "Limpiar búsqueda",
      resultsCount: "{n} camisetas encontradas",
      sortLabel: "Ordenar por",
      sortPriceAsc: "Precio: menor a mayor",
      sortPriceDesc: "Precio: mayor a menor",
      sortNewest: "Más reciente",
      sortOldest: "Más antigua",
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
      storesCompared: "{n} tiendas comparadas",
      basePrice: "Precio",
      shipping: "Envío",
      total: "Total",
      viewInStore: "Ver en tienda",
      photoPlaceholder: "Foto de producto próximamente",
      currencyNote: "Precio real de cada tienda en su moneda de origen. La tienda puede mostrarte otra moneda según tu ubicación, pero cobra este mismo precio.",
      replicaNotice: "Esta tienda vende camisetas réplica (no oficiales).",
    },
    footer: {
      about: "Sobre nosotros",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      disclaimer:
        "Football Cult es un comparador de precios. No vendemos productos directamente: te redirigimos a tiendas de terceros para completar tu compra. Algunos enlaces son enlaces de afiliado, lo que significa que podemos recibir una comisión sin costo adicional para vos.",
    },
    about: {
      title: "Sobre nosotros",
      p1: "Football Cult nació con una idea simple: encontrar la camiseta de tu selección, tu club o tu liga favorita —de cualquier parte del mundo— no debería significar abrir veinte pestañas del navegador para comparar precios.",
      p2: "Somos un comparador de precios independiente. Buscamos entre distintas tiendas online y te mostramos las mejores opciones disponibles para que decidas dónde comprar con toda la información a mano.",
      p3: 'Football Cult no vende productos directamente ni maneja pagos, envíos o devoluciones. Cuando hacés clic en "Comprar", te llevamos a la tienda correspondiente para que completes tu compra ahí. Algunos de esos enlaces son enlaces de afiliado: si comprás a través de ellos, podemos recibir una pequeña comisión de la tienda, sin ningún costo adicional para vos.',
    },
    contact: {
      title: "Contacto",
      p1: "¿Encontraste un precio desactualizado, una tienda que deberíamos sumar, o tenés alguna consulta? Escribinos.",
      emailLabel: "Email",
      note: "(Reemplazar por el email real y, si corresponde, un formulario de contacto antes de publicar el sitio.)",
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
      note: "Nota: este texto es un punto de partida. Antes de publicar el sitio, conviene adaptarlo con asesoría legal según la jurisdicción donde operes (RGPD si apunta a la UE, LOPD en España, etc.).",
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
      note: "Nota: este texto es un punto de partida general, no asesoramiento legal. Revisalo con un profesional antes de publicar el sitio.",
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
    },
    loginPanel: {
      title: "Sua conta",
      text: "Faça login para salvar seus favoritos e acessá-los de qualquer dispositivo.",
      googleCta: "Continuar com o Google",
      signedInAs: "Conectado como",
      signOut: "Sair",
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
      eyebrow: "Descubra sua herança futebolística",
      title: "Explore nosso arquivo",
      subtitle:
        "Comparamos preços de camisas de seleções, clubes e ligas do mundo todo. Você compra direto onde quiser.",
      cta: "Ver catálogo",
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
      ageGroupLabel: "Tamanho",
      ageGroupAdult: "Adulto",
      ageGroupKids: "Infantil",
      quickSelectLabel: "Acessos rápidos",
      clearAria: "Limpar busca",
      resultsCount: "{n} camisas encontradas",
      sortLabel: "Ordenar por",
      sortPriceAsc: "Preço: menor para maior",
      sortPriceDesc: "Preço: maior para menor",
      sortNewest: "Mais recente",
      sortOldest: "Mais antiga",
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
      storesCompared: "{n} lojas comparadas",
      basePrice: "Preço",
      shipping: "Frete",
      total: "Total",
      viewInStore: "Ver na loja",
      photoPlaceholder: "Foto do produto em breve",
      currencyNote: "Preço real de cada loja na sua moeda de origem. A loja pode te mostrar outra moeda de acordo com sua localização, mas cobra esse mesmo preço.",
      replicaNotice: "Esta loja vende camisas réplica (não oficiais).",
    },
    footer: {
      about: "Sobre nós",
      contact: "Contato",
      privacy: "Privacidade",
      terms: "Termos",
      disclaimer:
        "Football Cult é um comparador de preços. Não vendemos produtos diretamente: te redirecionamos para lojas terceiras para concluir sua compra. Alguns links são links de afiliado, o que significa que podemos receber uma comissão sem custo adicional para você.",
    },
    about: {
      title: "Sobre nós",
      p1: "Football Cult nasceu de uma ideia simples: encontrar a camisa da sua seleção, do seu clube ou da sua liga favorita — de qualquer parte do mundo — não deveria significar abrir vinte abas do navegador para comparar preços.",
      p2: "Somos um comparador de preços independente. Buscamos em diferentes lojas online e mostramos as melhores opções disponíveis para você decidir onde comprar com todas as informações em mãos.",
      p3: 'Football Cult não vende produtos diretamente nem processa pagamentos, envios ou devoluções. Quando você clica em "Comprar", te levamos até a loja correspondente para concluir sua compra lá. Alguns desses links são links de afiliado: se você comprar através deles, podemos receber uma pequena comissão da loja, sem nenhum custo adicional para você.',
    },
    contact: {
      title: "Contato",
      p1: "Encontrou um preço desatualizado, uma loja que deveríamos adicionar, ou tem alguma dúvida? Fale conosco.",
      emailLabel: "Email",
      note: "(Substituir pelo email real e, se aplicável, um formulário de contato antes de publicar o site.)",
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
      note: "Nota: este texto é um ponto de partida. Antes de publicar o site, é recomendável adaptá-lo com assessoria jurídica de acordo com a jurisdição onde você opera (LGPD no Brasil, RGPD na UE, etc.).",
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
      note: "Nota: este texto é um ponto de partida geral, não é aconselhamento jurídico. Revise com um profissional antes de publicar o site.",
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
    },
    loginPanel: {
      title: "Your account",
      text: "Sign in to save your favorites and access them from any device.",
      googleCta: "Continue with Google",
      signedInAs: "Signed in as",
      signOut: "Sign out",
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
      eyebrow: "Discover your football heritage",
      title: "Explore our archive",
      subtitle:
        "We compare prices on national team, club, and league jerseys from all over the world. You buy directly wherever you want.",
      cta: "Shop now",
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
      ageGroupLabel: "Size",
      ageGroupAdult: "Adult",
      ageGroupKids: "Kids",
      quickSelectLabel: "Quick picks",
      clearAria: "Clear search",
      resultsCount: "{n} jerseys found",
      sortLabel: "Sort by",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
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
      storesCompared: "{n} stores compared",
      basePrice: "Price",
      shipping: "Shipping",
      total: "Total",
      viewInStore: "View in store",
      photoPlaceholder: "Product photo coming soon",
      currencyNote: "Real price from each store in its original currency. The store may show you a different currency based on your location, but charges this same price.",
      replicaNotice: "This store sells replica (unofficial) jerseys.",
    },
    footer: {
      about: "About us",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      disclaimer:
        "Football Cult is a price comparison site. We don't sell products directly: we redirect you to third-party stores to complete your purchase. Some links are affiliate links, meaning we may earn a commission at no extra cost to you.",
    },
    about: {
      title: "About us",
      p1: "Football Cult was born from a simple idea: finding the jersey of your national team, club, or favorite league — from anywhere in the world — shouldn't mean opening twenty browser tabs to compare prices.",
      p2: "We're an independent price comparison site. We search across different online stores and show you the best available options so you can decide where to buy with all the information at hand.",
      p3: 'Football Cult doesn\'t sell products directly and doesn\'t handle payments, shipping, or returns. When you click "Buy," we take you to the corresponding store to complete your purchase there. Some of those links are affiliate links: if you buy through them, we may earn a small commission from the store, at no extra cost to you.',
    },
    contact: {
      title: "Contact",
      p1: "Found an outdated price, a store we should add, or have a question? Get in touch.",
      emailLabel: "Email",
      note: "(Replace with the real email and, if applicable, a contact form before publishing the site.)",
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
      note: "Note: this text is a starting point. Before publishing the site, it should be adapted with legal advice according to the jurisdiction you operate in (GDPR for the EU, etc.).",
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
      note: "Note: this text is a general starting point, not legal advice. Have it reviewed by a professional before publishing the site.",
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
      sizes: "Sizes",
      viewProduct: "View jersey",
    },
  },
};
