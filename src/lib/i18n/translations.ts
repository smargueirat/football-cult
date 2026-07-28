export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];

export interface Translations {
  brand: string;
  nav: {
    search: string;
    categories: string;
    about: string;
    contact: string;
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
    badge: string;
    titlePre: string;
    titleHighlight: string;
    titlePost: string;
    subtitle: string;
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
    quickSelectLabel: string;
    clearAria: string;
    resultsCount: string;
  };
  product: {
    bestPrice: string;
    in: string;
    outOfStockLabel: string;
    buy: string;
    soldOut: string;
    viewStores: string;
    hideStores: string;
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
}

export const translations: Record<Locale, Translations> = {
  es: {
    brand: "Football Cult",
    nav: {
      search: "Buscar",
      categories: "Categorías",
      about: "Sobre nosotros",
      contact: "Contacto",
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
      badge: "⚡ Comparamos precios en segundos",
      titlePre: "Encontrá la",
      titleHighlight: "camiseta más barata",
      titlePost: "de tu selección",
      subtitle:
        "Buscamos entre distintas tiendas para mostrarte el mejor precio. Vos comprás directo en la tienda, nosotros hacemos la comparación por vos.",
    },
    steps: {
      title1: "Buscá",
      text1: "Escribí tu selección o club favorito.",
      title2: "Comparamos",
      text2: "Cruzamos precios de distintas tiendas al instante.",
      title3: "Comprás",
      text3: "Te llevamos directo a la mejor oferta disponible.",
    },
    search: {
      label: "Buscá tu selección o club",
      placeholder: "Ej: Argentina, Brasil, España...",
      noResults: 'No encontramos camisetas para "{query}" todavía. Estamos sumando más tiendas cada semana.',
      allCategories: "Todas",
      quickSelectLabel: "Accesos rápidos",
      clearAria: "Limpiar búsqueda",
      resultsCount: "{n} camisetas encontradas",
    },
    product: {
      bestPrice: "Mejor precio",
      in: "en",
      outOfStockLabel: "Sin stock disponible",
      buy: "Comprar",
      soldOut: "Agotado",
      viewStores: "Ver otras tiendas ({n})",
      hideStores: "Ocultar tiendas",
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
      p1: "Football Cult nació con una idea simple: encontrar la camiseta de tu selección o club favorito no debería significar abrir veinte pestañas del navegador para comparar precios.",
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
  },
  en: {
    brand: "Football Cult",
    nav: {
      search: "Search",
      categories: "Categories",
      about: "About us",
      contact: "Contact",
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
      badge: "⚡ We compare prices in seconds",
      titlePre: "Find the",
      titleHighlight: "cheapest jersey",
      titlePost: "for your team",
      subtitle:
        "We search across different stores to show you the best price. You buy directly from the store, we just do the comparison for you.",
    },
    steps: {
      title1: "Search",
      text1: "Type your national team or club.",
      title2: "We compare",
      text2: "We cross-check prices across stores instantly.",
      title3: "You buy",
      text3: "We take you straight to the best deal available.",
    },
    search: {
      label: "Search your national team or club",
      placeholder: "E.g: Argentina, Brazil, Spain...",
      noResults: 'We couldn\'t find jerseys for "{query}" yet. We\'re adding more stores every week.',
      allCategories: "All",
      quickSelectLabel: "Quick picks",
      clearAria: "Clear search",
      resultsCount: "{n} jerseys found",
    },
    product: {
      bestPrice: "Best price",
      in: "at",
      outOfStockLabel: "No stock available",
      buy: "Buy",
      soldOut: "Sold out",
      viewStores: "Other stores ({n})",
      hideStores: "Hide stores",
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
      p1: "Football Cult was born from a simple idea: finding your national team or club jersey shouldn't mean opening twenty browser tabs to compare prices.",
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
  },
};
