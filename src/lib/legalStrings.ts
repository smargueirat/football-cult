import type { Locale } from "@/lib/i18n/translations";

// Textos del banner de consentimiento y de las tres páginas legales
// (/aviso-legal, /privacidad, /como-ganamos-dinero) en los cinco idiomas.
// Archivo propio, como giftStrings.ts: translations.ts ya pasa de 3.000
// líneas y estos textos solo los leen estas piezas.
//
// {email} se reemplaza por LEGAL_ENTITY.email al renderizar. Los datos del
// titular (nombre, NIF, domicilio) no van en los textos: salen de
// legalEntity.ts y se pintan aparte (LegalPage).
//
// Todo lo que afirman estos textos está contrastado con el código del
// sitio (qué se guarda, qué terceros se cargan, cómo se ordenan las
// ofertas). Si cambia alguna de esas cosas, hay que cambiar el texto.

export type LegalSection = { h: string; p: string[] };
export type LegalPageKey = "aviso" | "privacidad" | "dinero";
export type LegalPageStrings = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  sections: LegalSection[];
};
export interface LegalStrings {
  updatedLabel: string;
  dateLabel: string;
  entityLabels: { owner: string; nif: string; address: string; email: string; site: string };
  footer: { legal: string; money: string; cookies: string };
  consent: {
    region: string;
    title: string;
    body: string;
    accept: string;
    reject: string;
    configure: string;
    save: string;
    moreInfo: string;
    necessaryLabel: string;
    necessaryDesc: string;
    analyticsLabel: string;
    analyticsDesc: string;
    affiliateLabel: string;
    affiliateDesc: string;
    reopen: string;
  };
  pages: Record<LegalPageKey, LegalPageStrings>;
}

export const LEGAL: Record<Locale, LegalStrings> = {
  es: {
    updatedLabel: "Última actualización",
    dateLabel: "2 de octubre de 2026",
    entityLabels: { owner: "Titular", nif: "NIF", address: "Domicilio", email: "Correo electrónico", site: "Sitio web" },
    footer: { legal: "Aviso legal", money: "Cómo ganamos dinero", cookies: "Preferencias de cookies" },
    consent: {
      region: "Preferencias de cookies",
      title: "Tu privacidad",
      body: "Usamos almacenamiento propio imprescindible (idioma, país, favoritos). Con tu permiso, también Google Analytics (medir visitas) y Skimlinks (afiliación: cobramos una comisión si compras, sin coste extra para ti). Puedes aceptar, rechazar o elegir. El sitio funciona igual si rechazas.",
      accept: "Aceptar",
      reject: "Rechazar",
      configure: "Configurar",
      save: "Guardar selección",
      moreInfo: "Política de privacidad",
      necessaryLabel: "Necesarias",
      necessaryDesc: "Idioma, país, favoritos y esta misma elección. Siempre activas.",
      analyticsLabel: "Analítica (Google Analytics 4)",
      analyticsDesc: "Cuenta visitas y clics para saber qué páginas sirven. Cookies _ga de Google.",
      affiliateLabel: "Afiliación (Skimlinks)",
      affiliateDesc: "Convierte enlaces a algunas tiendas en enlaces de afiliado. Skimlinks puede usar cookies.",
      reopen: "Cambiar preferencias de cookies",
    },
    pages: {
      aviso: {
        metaTitle: "Aviso legal | Football Cult",
        metaDescription: "Titular, objeto y condiciones de uso de football-cult.com (Ley 34/2002, LSSI-CE).",
        h1: "Aviso legal",
        sections: [
          { h: "Datos del titular", p: ["En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web es titularidad de la persona que figura a continuación."] },
          { h: "Objeto del sitio", p: ["Football Cult es un comparador de precios de camisetas, botas y otro material de fútbol. No vendemos productos ni gestionamos pedidos, pagos o envíos: te enviamos a la tienda de un tercero, y el contrato de compra se celebra únicamente entre tú y esa tienda.", "Algunos enlaces a tiendas son enlaces de afiliado: podemos recibir una comisión si compras, sin coste adicional para ti. Lo explicamos en la página «Cómo ganamos dinero»."] },
          { h: "Exactitud de la información", p: ["Los precios, gastos de envío y disponibilidad proceden de los catálogos de las propias tiendas y cambian con frecuencia. Pueden diferir del precio final en la web de la tienda; el que vale es el que ves allí antes de pagar. No garantizamos que la información esté libre de errores ni actualizada en todo momento."] },
          { h: "Propiedad intelectual y marcas", p: ["Los nombres, escudos, marcas e imágenes de clubes, selecciones, fabricantes y tiendas pertenecen a sus respectivos titulares y se muestran solo para identificar los productos. Football Cult no está afiliado a clubes, federaciones ni fabricantes, ni cuenta con su patrocinio. El diseño y los textos propios del sitio no pueden reproducirse sin permiso."] },
          { h: "Enlaces a terceros", p: ["No somos responsables del contenido, las políticas o las prácticas de los sitios de terceros a los que enlazamos. Antes de comprar, revisa las condiciones de la tienda."] },
          { h: "Ley aplicable", p: ["Este aviso se rige por la legislación española. Si eres consumidor, conservas los derechos que te reconoce la normativa de tu lugar de residencia. Para cualquier consulta o reclamación puedes escribir a {email}."] },
        ],
      },
      privacidad: {
        metaTitle: "Política de privacidad | Football Cult",
        metaDescription: "Qué datos trata Football Cult, con qué terceros, cookies de Google Analytics y Skimlinks, y cómo ejercer tus derechos RGPD.",
        h1: "Política de privacidad",
        sections: [
          { h: "Responsable del tratamiento", p: ["El responsable es el titular indicado más abajo. Para cualquier cuestión sobre tus datos escribe a {email}."] },
          { h: "Qué datos tratamos y para qué", p: [
            "Navegación. Al cargar el sitio, el servidor y Cloudflare (que nos sirve la web) procesan tu dirección IP y datos técnicos para entregarte las páginas y protegerlas de abusos. Base jurídica: interés legítimo en la seguridad del servicio.",
            "Clics hacia tiendas. Cuando pulsas «Ver oferta» pasas por un enlace nuestro (/go/) que anota el clic: fecha, producto, tienda, idioma, tipo de página y un resumen del navegador (por ejemplo «Chrome, Android, móvil»). No guarda tu IP ni ningún identificador. Sirve para saber qué enlaces funcionan y retirar los que están rotos.",
            "Analítica (solo si la aceptas). Google Analytics 4 mide visitas, páginas vistas y clics a tiendas. Base jurídica: tu consentimiento.",
            "Afiliación (solo si la aceptas). Skimlinks convierte enlaces a algunas tiendas en enlaces de afiliado para que podamos cobrar comisión. Base jurídica: tu consentimiento.",
            "Alertas de precio. Si pides un aviso, guardamos tu correo y el producto hasta que te des de baja (cada aviso incluye un enlace para hacerlo). Base jurídica: tu solicitud.",
            "Cuenta. Si inicias sesión con Google o con un enlace enviado a tu correo, tratamos tu correo y, con Google, tu nombre y foto de perfil. Tus favoritos viajan en tu sesión. Base jurídica: ejecución del servicio que pides.",
            "Contacto y reportes. Si nos escribes o reportas un producto, usamos tu mensaje y tu correo para responderte. El envío lo realiza Resend.",
          ] },
          { h: "Cookies y almacenamiento local", p: [
            "Necesarias (no requieren consentimiento): cookie de idioma (football-cult-locale, 1 año), cookie del país detectado (football-cult-geo-country, 30 días), cookie de sesión si inicias sesión, y en tu navegador tu elección de cookies, país, favoritos, comparador y vistos recientemente.",
            "Analítica: cookies _ga y _ga_* de Google, solo si lo aceptas. Afiliación: los scripts y cookies de Skimlinks, solo si lo aceptas. Sin tu permiso no se carga ni Google Analytics ni Skimlinks.",
            "Puedes cambiar la elección cuando quieras con «Preferencias de cookies» en el pie de página o con el botón de abajo. Si retiras un permiso, la página se recarga y se dejan de cargar esos servicios.",
          ] },
          { h: "Con quién compartimos datos", p: [
            "Google (Analytics 4 si lo aceptas, e inicio de sesión), Skimlinks (si lo aceptas), Cloudflare (red y seguridad), Resend (envío de correos), un proveedor de base de datos en la nube (alertas y registros de cuenta) e images.weserv.nl (servicio que entrega las fotos de producto: tu navegador le pide las imágenes y ve tu IP).",
            "Al pulsar «Ver oferta» sales a la tienda o a su red de afiliación (Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon, Soicos u otras). Desde ese momento rigen su política de privacidad y sus cookies. No vendemos tus datos.",
          ] },
          { h: "Transferencias internacionales", p: ["Algunos de estos proveedores están fuera del Espacio Económico Europeo (por ejemplo en EE. UU. o Reino Unido). Se apoyan en una decisión de adecuación (como el Marco de Privacidad de Datos UE-EE. UU.) o en cláusulas contractuales tipo de cada proveedor."] },
          { h: "Cuánto tiempo los conservamos", p: ["Alertas: hasta que te des de baja. Mensajes de contacto: el tiempo necesario para atenderlos. Analítica: el periodo configurado en la propiedad de Google Analytics. El registro de clics no contiene datos personales."] },
          { h: "Tus derechos", p: ["Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos, y retirar tu consentimiento en cualquier momento, escribiendo a {email}. Si consideras que no tratamos tus datos correctamente, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es)."] },
          { h: "Cambios", p: ["Si cambia algo de lo anterior (por ejemplo, un servicio nuevo), actualizaremos esta página y su fecha."] },
        ],
      },
      dinero: {
        metaTitle: "Cómo ganamos dinero | Football Cult",
        metaDescription: "Football Cult cobra comisiones de afiliación sin coste extra para ti. Qué redes usamos, cómo se ordenan las ofertas y cómo calculamos el mejor precio.",
        h1: "Cómo ganamos dinero",
        sections: [
          { h: "En pocas palabras", p: ["Football Cult es gratis para ti. Cuando pulsas «Ver oferta» y compras en la tienda, esa tienda o su red de afiliación puede pagarnos una comisión. No pagas nada de más: el precio es el mismo que si entraras directamente."] },
          { h: "Con qué redes trabajamos", p: ["Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon Associates, Soicos y Skimlinks (que convierte enlaces normales a algunas tiendas, como Pro:Direct, en enlaces de afiliado). No todas las tiendas que mostramos nos pagan comisión: también listamos tiendas con las que no tenemos ningún acuerdo."] },
          { h: "La comisión no cambia el orden", p: ["Dentro de cada producto, las ofertas se ordenan solo por precio total (precio más envío), de la más barata a la más cara. La comisión que pueda pagar cada tienda no interviene en ese orden ni en cuál se marca como mejor precio."] },
          { h: "Cómo calculamos el «mejor precio»", p: [
            "Es la oferta con menor total entre las que están en stock, envían al país elegido y cumplen la talla o versión filtrada. El total es precio más gastos de envío; en eBay, cuando se puede consultar, usamos el envío real a tu país en lugar del estimado.",
            "Para ordenar ofertas en monedas distintas usamos tipos de cambio fijos y aproximados; el importe que ves siempre está en la moneda de la tienda. Los gastos de envío y los impuestos de importación pueden variar al finalizar la compra: confírmalos en la tienda.",
          ] },
          { h: "Qué medimos", p: ["Anotamos los clics hacia las tiendas para saber qué enlaces funcionan, sin guardar tu IP. Si lo aceptas, Google Analytics y Skimlinks añaden su propia medición. Detalle en la política de privacidad."] },
          { h: "Amazon", p: ["Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables."] },
          { h: "¿Dudas?", p: ["Escríbenos a {email}."] },
        ],
      },
    },
  },
  en: {
    updatedLabel: "Last updated",
    dateLabel: "2 October 2026",
    entityLabels: { owner: "Owner", nif: "Tax ID (NIF)", address: "Address", email: "Email", site: "Website" },
    footer: { legal: "Legal notice", money: "How we make money", cookies: "Cookie settings" },
    consent: {
      region: "Cookie settings",
      title: "Your privacy",
      body: "We use essential storage of our own (language, country, favourites). With your permission we also use Google Analytics (to measure visits) and Skimlinks (affiliate links: we earn a commission if you buy, at no extra cost to you). You can accept, reject or choose. The site works the same if you reject.",
      accept: "Accept",
      reject: "Reject",
      configure: "Customise",
      save: "Save choices",
      moreInfo: "Privacy policy",
      necessaryLabel: "Necessary",
      necessaryDesc: "Language, country, favourites and this choice itself. Always on.",
      analyticsLabel: "Analytics (Google Analytics 4)",
      analyticsDesc: "Counts visits and clicks to see which pages are useful. Google _ga cookies.",
      affiliateLabel: "Affiliate links (Skimlinks)",
      affiliateDesc: "Turns links to some stores into affiliate links. Skimlinks may use cookies.",
      reopen: "Change cookie settings",
    },
    pages: {
      aviso: {
        metaTitle: "Legal Notice | Football Cult",
        metaDescription: "Owner, purpose and terms of use of football-cult.com (Spanish Law 34/2002, LSSI-CE).",
        h1: "Legal notice",
        sections: [
          { h: "Owner details", p: ["In compliance with Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), this website is owned by the person listed below."] },
          { h: "Purpose of the site", p: ["Football Cult is a price comparison site for football shirts, boots and other gear. We do not sell products or handle orders, payments or shipping: we send you to a third-party store, and the purchase contract is solely between you and that store.", "Some store links are affiliate links: we may receive a commission if you buy, at no extra cost to you. We explain this on the \"How we make money\" page."] },
          { h: "Accuracy of information", p: ["Prices, shipping costs and availability come from the stores' own catalogues and change often. They may differ from the final price on the store's website; the one you see there before paying is the one that counts. We do not guarantee that the information is error-free or always up to date."] },
          { h: "Intellectual property and trademarks", p: ["Names, crests, trademarks and images of clubs, national teams, manufacturers and stores belong to their respective owners and are shown only to identify products. Football Cult is not affiliated with or sponsored by clubs, federations or manufacturers. The site's own design and texts may not be reproduced without permission."] },
          { h: "Third-party links", p: ["We are not responsible for the content, policies or practices of the third-party sites we link to. Check the store's terms before you buy."] },
          { h: "Governing law", p: ["This notice is governed by Spanish law. If you are a consumer, you keep the rights granted by the rules of your place of residence. For any question or complaint, write to {email}."] },
        ],
      },
      privacidad: {
        metaTitle: "Privacy Policy | Football Cult",
        metaDescription: "What data Football Cult processes, which third parties are involved, Google Analytics and Skimlinks cookies, and how to exercise your GDPR rights.",
        h1: "Privacy policy",
        sections: [
          { h: "Data controller", p: ["The controller is the owner listed below. For anything about your data, write to {email}."] },
          { h: "What data we process and why", p: [
            "Browsing. When you load the site, our server and Cloudflare (which delivers the site to you) process your IP address and technical data to serve the pages and protect them from abuse. Legal basis: legitimate interest in the security of the service.",
            "Clicks to stores. When you press \"View offer\" you go through our own link (/go/), which records the click: date, product, store, language, page type and a summary of your browser (for example \"Chrome, Android, mobile\"). It does not store your IP or any identifier. It is used to find out which links work and to remove broken ones.",
            "Analytics (only if you accept). Google Analytics 4 measures visits, page views and clicks to stores. Legal basis: your consent.",
            "Affiliate links (only if you accept). Skimlinks turns links to some stores into affiliate links so that we can earn a commission. Legal basis: your consent.",
            "Price alerts. If you ask for an alert, we store your email and the product until you unsubscribe (every alert includes a link to do so). Legal basis: your request.",
            "Account. If you sign in with Google or with a link sent to your email, we process your email and, with Google, your name and profile picture. Your favourites travel in your session. Legal basis: performing the service you ask for.",
            "Contact and reports. If you write to us or report a product, we use your message and email to reply. Resend delivers the email.",
          ] },
          { h: "Cookies and local storage", p: [
            "Necessary (no consent needed): language cookie (football-cult-locale, 1 year), detected-country cookie (football-cult-geo-country, 30 days), session cookie if you sign in, and, in your browser, your cookie choice, country, favourites, comparison list and recently viewed items.",
            "Analytics: Google _ga and _ga_* cookies, only if you accept. Affiliate links: Skimlinks scripts and cookies, only if you accept. Without your permission neither Google Analytics nor Skimlinks is loaded.",
            "You can change your choice at any time with \"Cookie settings\" in the footer or the button below. If you withdraw a permission, the page reloads and those services stop loading.",
          ] },
          { h: "Who we share data with", p: [
            "Google (Analytics 4 if you accept, and sign-in), Skimlinks (if you accept), Cloudflare (network and security), Resend (email delivery), a cloud database provider (alerts and account records) and images.weserv.nl (the service that delivers product photos: your browser requests the images from it and it sees your IP).",
            "When you press \"View offer\" you leave for the store or its affiliate network (Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon, Soicos or others). From that point their privacy policy and cookies apply. We do not sell your data.",
          ] },
          { h: "International transfers", p: ["Some of these providers are outside the European Economic Area (for example in the US or the UK). They rely on an adequacy decision (such as the EU-US Data Privacy Framework) or on each provider's standard contractual clauses."] },
          { h: "How long we keep it", p: ["Alerts: until you unsubscribe. Contact messages: as long as needed to deal with them. Analytics: the period set in the Google Analytics property. The click log contains no personal data."] },
          { h: "Your rights", p: ["You can ask for access, rectification, erasure, objection, restriction and portability of your data, and withdraw your consent at any time, by writing to {email}. If you believe we are not handling your data properly, you can complain to the Spanish Data Protection Agency (aepd.es) or to your local authority."] },
          { h: "Changes", p: ["If anything above changes (for example a new service), we will update this page and its date."] },
        ],
      },
      dinero: {
        metaTitle: "How We Make Money | Football Cult",
        metaDescription: "Football Cult earns affiliate commissions at no extra cost to you. Which networks we use, how offers are ordered and how we work out the best price.",
        h1: "How we make money",
        sections: [
          { h: "In short", p: ["Football Cult is free for you. When you press \"View offer\" and buy at the store, that store or its affiliate network may pay us a commission. You pay nothing extra: the price is the same as if you went there directly."] },
          { h: "Which networks we work with", p: ["Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon Associates, Soicos and Skimlinks (which turns plain links to some stores, such as Pro:Direct, into affiliate links). Not every store we show pays us a commission: we also list stores we have no agreement with."] },
          { h: "Commission does not change the order", p: ["Within each product, offers are ordered only by total price (price plus shipping), cheapest first. Whatever commission a store may pay plays no part in that order or in which offer is marked as best price."] },
          { h: "How we work out the \"best price\"", p: [
            "It is the offer with the lowest total among those that are in stock, ship to the chosen country and match the size or version filter. The total is price plus shipping; for eBay, when it can be checked, we use the real shipping to your country instead of the estimate.",
            "To order offers in different currencies we use fixed, approximate exchange rates; the amount you see is always in the store's currency. Shipping and import taxes may change at checkout: confirm them at the store.",
          ] },
          { h: "What we measure", p: ["We record clicks to stores to know which links work, without storing your IP. If you accept, Google Analytics and Skimlinks add their own measurement. Details are in the privacy policy."] },
          { h: "Amazon", p: ["As an Amazon Associate I earn from qualifying purchases."] },
          { h: "Questions?", p: ["Write to us at {email}."] },
        ],
      },
    },
  },
  pt: {
    updatedLabel: "Última atualização",
    dateLabel: "2 de outubro de 2026",
    entityLabels: { owner: "Titular", nif: "NIF", address: "Endereço", email: "E-mail", site: "Site" },
    footer: { legal: "Aviso legal", money: "Como ganhamos dinheiro", cookies: "Preferências de cookies" },
    consent: {
      region: "Preferências de cookies",
      title: "Sua privacidade",
      body: "Usamos armazenamento próprio essencial (idioma, país, favoritos). Com a sua permissão, também o Google Analytics (medir visitas) e o Skimlinks (afiliação: ganhamos uma comissão se você comprar, sem custo extra para você). Você pode aceitar, recusar ou escolher. O site funciona igual se recusar.",
      accept: "Aceitar",
      reject: "Recusar",
      configure: "Configurar",
      save: "Salvar seleção",
      moreInfo: "Política de privacidade",
      necessaryLabel: "Necessários",
      necessaryDesc: "Idioma, país, favoritos e esta própria escolha. Sempre ativos.",
      analyticsLabel: "Análise (Google Analytics 4)",
      analyticsDesc: "Conta visitas e cliques para saber quais páginas são úteis. Cookies _ga do Google.",
      affiliateLabel: "Afiliação (Skimlinks)",
      affiliateDesc: "Transforma links de algumas lojas em links de afiliado. O Skimlinks pode usar cookies.",
      reopen: "Alterar preferências de cookies",
    },
    pages: {
      aviso: {
        metaTitle: "Aviso Legal | Football Cult",
        metaDescription: "Titular, objeto e condições de uso do football-cult.com (Lei espanhola 34/2002, LSSI-CE).",
        h1: "Aviso legal",
        sections: [
          { h: "Dados do titular", p: ["Em cumprimento do artigo 10 da Lei espanhola 34/2002, de Serviços da Sociedade da Informação e de Comércio Eletrônico (LSSI-CE), informa-se que este site pertence à pessoa indicada abaixo."] },
          { h: "Objeto do site", p: ["A Football Cult é um comparador de preços de camisas, chuteiras e outros artigos de futebol. Não vendemos produtos nem gerenciamos pedidos, pagamentos ou envios: levamos você até a loja de um terceiro, e o contrato de compra é feito apenas entre você e essa loja.", "Alguns links para lojas são links de afiliado: podemos receber uma comissão se você comprar, sem custo adicional para você. Explicamos isso na página «Como ganhamos dinheiro»."] },
          { h: "Exatidão das informações", p: ["Preços, custos de envio e disponibilidade vêm dos catálogos das próprias lojas e mudam com frequência. Podem diferir do preço final no site da loja; vale o que você vê lá antes de pagar. Não garantimos que a informação esteja livre de erros nem sempre atualizada."] },
          { h: "Propriedade intelectual e marcas", p: ["Nomes, escudos, marcas e imagens de clubes, seleções, fabricantes e lojas pertencem aos seus respectivos titulares e são exibidos apenas para identificar os produtos. A Football Cult não é afiliada nem patrocinada por clubes, federações ou fabricantes. O design e os textos próprios do site não podem ser reproduzidos sem permissão."] },
          { h: "Links para terceiros", p: ["Não somos responsáveis pelo conteúdo, pelas políticas ou pelas práticas dos sites de terceiros para os quais enviamos você. Antes de comprar, leia as condições da loja."] },
          { h: "Lei aplicável", p: ["Este aviso é regido pela legislação espanhola. Se você é consumidor, mantém os direitos que a norma do seu local de residência lhe reconhece. Para qualquer dúvida ou reclamação, escreva para {email}."] },
        ],
      },
      privacidad: {
        metaTitle: "Política de Privacidade | Football Cult",
        metaDescription: "Quais dados a Football Cult trata, com quais terceiros, cookies do Google Analytics e do Skimlinks, e como exercer seus direitos do RGPD.",
        h1: "Política de privacidade",
        sections: [
          { h: "Responsável pelo tratamento", p: ["O responsável é o titular indicado abaixo. Para qualquer assunto sobre seus dados, escreva para {email}."] },
          { h: "Quais dados tratamos e para quê", p: [
            "Navegação. Ao carregar o site, o servidor e a Cloudflare (que entrega o site a você) processam seu endereço IP e dados técnicos para servir as páginas e protegê-las de abusos. Base jurídica: interesse legítimo na segurança do serviço.",
            "Cliques para lojas. Quando você toca em «Ver oferta», passa por um link nosso (/go/) que registra o clique: data, produto, loja, idioma, tipo de página e um resumo do navegador (por exemplo «Chrome, Android, celular»). Não guarda seu IP nem nenhum identificador. Serve para saber quais links funcionam e retirar os quebrados.",
            "Análise (só se você aceitar). O Google Analytics 4 mede visitas, páginas vistas e cliques para lojas. Base jurídica: seu consentimento.",
            "Afiliação (só se você aceitar). O Skimlinks transforma links de algumas lojas em links de afiliado para que possamos receber comissão. Base jurídica: seu consentimento.",
            "Alertas de preço. Se você pedir um aviso, guardamos seu e-mail e o produto até você cancelar (cada aviso traz um link para isso). Base jurídica: seu pedido.",
            "Conta. Se você entrar com o Google ou com um link enviado ao seu e-mail, tratamos seu e-mail e, com o Google, seu nome e foto de perfil. Seus favoritos viajam na sua sessão. Base jurídica: execução do serviço que você pede.",
            "Contato e denúncias. Se você nos escrever ou denunciar um produto, usamos sua mensagem e seu e-mail para responder. O envio é feito pela Resend.",
          ] },
          { h: "Cookies e armazenamento local", p: [
            "Necessários (não exigem consentimento): cookie de idioma (football-cult-locale, 1 ano), cookie do país detectado (football-cult-geo-country, 30 dias), cookie de sessão se você entrar e, no seu navegador, sua escolha de cookies, país, favoritos, comparador e vistos recentemente.",
            "Análise: cookies _ga e _ga_* do Google, só se você aceitar. Afiliação: scripts e cookies do Skimlinks, só se você aceitar. Sem a sua permissão, nem o Google Analytics nem o Skimlinks são carregados.",
            "Você pode mudar a escolha quando quiser em «Preferências de cookies» no rodapé ou no botão abaixo. Se retirar uma permissão, a página recarrega e esses serviços deixam de ser carregados.",
          ] },
          { h: "Com quem compartilhamos dados", p: [
            "Google (Analytics 4 se você aceitar, e login), Skimlinks (se você aceitar), Cloudflare (rede e segurança), Resend (envio de e-mails), um provedor de banco de dados na nuvem (alertas e registros de conta) e images.weserv.nl (serviço que entrega as fotos dos produtos: seu navegador pede as imagens a ele, que vê seu IP).",
            "Ao tocar em «Ver oferta» você sai para a loja ou sua rede de afiliação (Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon, Soicos ou outras). A partir daí valem a política de privacidade e os cookies deles. Não vendemos seus dados.",
          ] },
          { h: "Transferências internacionais", p: ["Alguns desses provedores estão fora do Espaço Econômico Europeu (por exemplo, nos EUA ou no Reino Unido). Eles se apoiam em uma decisão de adequação (como o Marco de Privacidade de Dados UE-EUA) ou nas cláusulas contratuais padrão de cada provedor."] },
          { h: "Por quanto tempo guardamos", p: ["Alertas: até você cancelar. Mensagens de contato: o tempo necessário para atendê-las. Análise: o período configurado na propriedade do Google Analytics. O registro de cliques não contém dados pessoais."] },
          { h: "Seus direitos", p: ["Você pode pedir acesso, retificação, exclusão, oposição, limitação e portabilidade dos seus dados, e retirar o consentimento a qualquer momento, escrevendo para {email}. Se achar que não tratamos seus dados corretamente, pode reclamar à Agência Espanhola de Proteção de Dados (aepd.es) ou à autoridade do seu país."] },
          { h: "Alterações", p: ["Se algo do que está acima mudar (por exemplo, um novo serviço), atualizaremos esta página e a sua data."] },
        ],
      },
      dinero: {
        metaTitle: "Como Ganhamos Dinheiro | Football Cult",
        metaDescription: "A Football Cult recebe comissões de afiliação sem custo extra para você. Quais redes usamos, como as ofertas são ordenadas e como calculamos o melhor preço.",
        h1: "Como ganhamos dinheiro",
        sections: [
          { h: "Em poucas palavras", p: ["A Football Cult é grátis para você. Quando você toca em «Ver oferta» e compra na loja, essa loja ou sua rede de afiliação pode nos pagar uma comissão. Você não paga nada a mais: o preço é o mesmo que se entrasse direto."] },
          { h: "Com quais redes trabalhamos", p: ["Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon Associates, Soicos e Skimlinks (que transforma links comuns de algumas lojas, como a Pro:Direct, em links de afiliado). Nem toda loja que mostramos nos paga comissão: também listamos lojas com as quais não temos nenhum acordo."] },
          { h: "A comissão não muda a ordem", p: ["Dentro de cada produto, as ofertas são ordenadas apenas pelo preço total (preço mais frete), da mais barata para a mais cara. A comissão que cada loja possa pagar não interfere nessa ordem nem em qual oferta é marcada como melhor preço."] },
          { h: "Como calculamos o «melhor preço»", p: [
            "É a oferta de menor total entre as que estão em estoque, enviam para o país escolhido e atendem ao filtro de tamanho ou versão. O total é preço mais frete; no eBay, quando é possível consultar, usamos o frete real para o seu país no lugar da estimativa.",
            "Para ordenar ofertas em moedas diferentes usamos taxas de câmbio fixas e aproximadas; o valor que você vê está sempre na moeda da loja. Frete e impostos de importação podem mudar no fechamento da compra: confirme na loja.",
          ] },
          { h: "O que medimos", p: ["Registramos os cliques para as lojas para saber quais links funcionam, sem guardar seu IP. Se você aceitar, o Google Analytics e o Skimlinks acrescentam a medição deles. Detalhes na política de privacidade."] },
          { h: "Amazon", p: ["Como Associado da Amazon, ganho com compras qualificadas."] },
          { h: "Dúvidas?", p: ["Escreva para {email}."] },
        ],
      },
    },
  },
  fr: {
    updatedLabel: "Dernière mise à jour",
    dateLabel: "2 octobre 2026",
    entityLabels: { owner: "Titulaire", nif: "NIF", address: "Adresse", email: "E-mail", site: "Site web" },
    footer: { legal: "Mentions légales", money: "Comment nous gagnons de l'argent", cookies: "Préférences cookies" },
    consent: {
      region: "Préférences cookies",
      title: "Votre vie privée",
      body: "Nous utilisons un stockage propre indispensable (langue, pays, favoris). Avec votre accord, nous utilisons aussi Google Analytics (mesure des visites) et Skimlinks (affiliation : nous touchons une commission si vous achetez, sans frais supplémentaires pour vous). Vous pouvez accepter, refuser ou choisir. Le site fonctionne de la même façon si vous refusez.",
      accept: "Accepter",
      reject: "Refuser",
      configure: "Personnaliser",
      save: "Enregistrer mon choix",
      moreInfo: "Politique de confidentialité",
      necessaryLabel: "Nécessaires",
      necessaryDesc: "Langue, pays, favoris et ce choix lui-même. Toujours actifs.",
      analyticsLabel: "Mesure d'audience (Google Analytics 4)",
      analyticsDesc: "Compte les visites et les clics pour savoir quelles pages sont utiles. Cookies _ga de Google.",
      affiliateLabel: "Affiliation (Skimlinks)",
      affiliateDesc: "Transforme les liens vers certaines boutiques en liens d'affiliation. Skimlinks peut utiliser des cookies.",
      reopen: "Modifier les préférences cookies",
    },
    pages: {
      aviso: {
        metaTitle: "Mentions Légales | Football Cult",
        metaDescription: "Titulaire, objet et conditions d'utilisation de football-cult.com (loi espagnole 34/2002, LSSI-CE).",
        h1: "Mentions légales",
        sections: [
          { h: "Informations sur le titulaire", p: ["Conformément à l'article 10 de la loi espagnole 34/2002 sur les services de la société de l'information et le commerce électronique (LSSI-CE), ce site appartient à la personne indiquée ci-dessous."] },
          { h: "Objet du site", p: ["Football Cult est un comparateur de prix de maillots, chaussures et autres articles de football. Nous ne vendons aucun produit et ne gérons ni commandes, ni paiements, ni livraisons : nous vous envoyons vers la boutique d'un tiers, et le contrat d'achat est conclu uniquement entre vous et cette boutique.", "Certains liens vers des boutiques sont des liens d'affiliation : nous pouvons toucher une commission si vous achetez, sans frais supplémentaires pour vous. Nous l'expliquons sur la page « Comment nous gagnons de l'argent »."] },
          { h: "Exactitude des informations", p: ["Les prix, frais de livraison et disponibilités proviennent des catalogues des boutiques elles-mêmes et changent souvent. Ils peuvent différer du prix final sur le site de la boutique ; c'est celui que vous y voyez avant de payer qui fait foi. Nous ne garantissons pas l'absence d'erreurs ni une mise à jour permanente."] },
          { h: "Propriété intellectuelle et marques", p: ["Les noms, écussons, marques et images des clubs, sélections, fabricants et boutiques appartiennent à leurs titulaires respectifs et ne sont affichés que pour identifier les produits. Football Cult n'est ni affilié ni parrainé par des clubs, fédérations ou fabricants. La conception et les textes propres du site ne peuvent être reproduits sans autorisation."] },
          { h: "Liens vers des tiers", p: ["Nous ne sommes pas responsables du contenu, des politiques ou des pratiques des sites tiers vers lesquels nous renvoyons. Avant d'acheter, consultez les conditions de la boutique."] },
          { h: "Droit applicable", p: ["Les présentes mentions sont régies par le droit espagnol. Si vous êtes consommateur, vous conservez les droits que vous reconnaît la réglementation de votre lieu de résidence. Pour toute question ou réclamation, écrivez à {email}."] },
        ],
      },
      privacidad: {
        metaTitle: "Politique de Confidentialité | Football Cult",
        metaDescription: "Quelles données Football Cult traite, avec quels tiers, cookies de Google Analytics et Skimlinks, et comment exercer vos droits RGPD.",
        h1: "Politique de confidentialité",
        sections: [
          { h: "Responsable du traitement", p: ["Le responsable est le titulaire indiqué ci-dessous. Pour toute question sur vos données, écrivez à {email}."] },
          { h: "Quelles données nous traitons et pourquoi", p: [
            "Navigation. Quand vous chargez le site, notre serveur et Cloudflare (qui vous délivre le site) traitent votre adresse IP et des données techniques pour servir les pages et les protéger contre les abus. Base juridique : intérêt légitime à la sécurité du service.",
            "Clics vers les boutiques. Quand vous appuyez sur « Voir l'offre », vous passez par un lien à nous (/go/) qui enregistre le clic : date, produit, boutique, langue, type de page et un résumé du navigateur (par exemple « Chrome, Android, mobile »). Il ne conserve ni votre IP ni aucun identifiant. Il sert à savoir quels liens fonctionnent et à retirer ceux qui sont cassés.",
            "Mesure d'audience (seulement si vous acceptez). Google Analytics 4 mesure les visites, les pages vues et les clics vers les boutiques. Base juridique : votre consentement.",
            "Affiliation (seulement si vous acceptez). Skimlinks transforme les liens vers certaines boutiques en liens d'affiliation pour que nous puissions toucher une commission. Base juridique : votre consentement.",
            "Alertes de prix. Si vous demandez une alerte, nous conservons votre e-mail et le produit jusqu'à votre désinscription (chaque alerte contient un lien pour cela). Base juridique : votre demande.",
            "Compte. Si vous vous connectez avec Google ou avec un lien envoyé à votre e-mail, nous traitons votre e-mail et, avec Google, votre nom et votre photo de profil. Vos favoris voyagent dans votre session. Base juridique : exécution du service demandé.",
            "Contact et signalements. Si vous nous écrivez ou signalez un produit, nous utilisons votre message et votre e-mail pour vous répondre. L'envoi est assuré par Resend.",
          ] },
          { h: "Cookies et stockage local", p: [
            "Nécessaires (sans consentement) : cookie de langue (football-cult-locale, 1 an), cookie du pays détecté (football-cult-geo-country, 30 jours), cookie de session si vous vous connectez et, dans votre navigateur, votre choix de cookies, pays, favoris, comparateur et articles vus récemment.",
            "Mesure d'audience : cookies _ga et _ga_* de Google, seulement si vous acceptez. Affiliation : scripts et cookies de Skimlinks, seulement si vous acceptez. Sans votre accord, ni Google Analytics ni Skimlinks ne sont chargés.",
            "Vous pouvez changer votre choix à tout moment avec « Préférences cookies » en bas de page ou avec le bouton ci-dessous. Si vous retirez un accord, la page se recharge et ces services cessent d'être chargés.",
          ] },
          { h: "Avec qui nous partageons des données", p: [
            "Google (Analytics 4 si vous acceptez, et connexion), Skimlinks (si vous acceptez), Cloudflare (réseau et sécurité), Resend (envoi d'e-mails), un fournisseur de base de données dans le cloud (alertes et comptes) et images.weserv.nl (service qui délivre les photos des produits : votre navigateur lui demande les images et il voit votre IP).",
            "Quand vous appuyez sur « Voir l'offre », vous quittez le site pour la boutique ou son réseau d'affiliation (Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon, Soicos ou autres). À partir de là, leur politique de confidentialité et leurs cookies s'appliquent. Nous ne vendons pas vos données.",
          ] },
          { h: "Transferts internationaux", p: ["Certains de ces prestataires sont hors de l'Espace économique européen (par exemple aux États-Unis ou au Royaume-Uni). Ils s'appuient sur une décision d'adéquation (comme le cadre de protection des données UE-États-Unis) ou sur les clauses contractuelles types de chaque prestataire."] },
          { h: "Durée de conservation", p: ["Alertes : jusqu'à votre désinscription. Messages de contact : le temps nécessaire pour les traiter. Mesure d'audience : la durée configurée dans la propriété Google Analytics. Le journal des clics ne contient aucune donnée personnelle."] },
          { h: "Vos droits", p: ["Vous pouvez demander l'accès, la rectification, l'effacement, l'opposition, la limitation et la portabilité de vos données, et retirer votre consentement à tout moment, en écrivant à {email}. Si vous estimez que vos données ne sont pas traitées correctement, vous pouvez saisir l'Agence espagnole de protection des données (aepd.es) ou la CNIL."] },
          { h: "Modifications", p: ["Si l'un de ces points change (par exemple un nouveau service), nous mettrons à jour cette page et sa date."] },
        ],
      },
      dinero: {
        metaTitle: "Comment Nous Gagnons de l'Argent | Football Cult",
        metaDescription: "Football Cult touche des commissions d'affiliation sans frais supplémentaires pour vous. Quels réseaux, comment les offres sont classées et comment nous calculons le meilleur prix.",
        h1: "Comment nous gagnons de l'argent",
        sections: [
          { h: "En bref", p: ["Football Cult est gratuit pour vous. Quand vous appuyez sur « Voir l'offre » et achetez en boutique, cette boutique ou son réseau d'affiliation peut nous verser une commission. Vous ne payez rien de plus : le prix est le même que si vous y alliez directement."] },
          { h: "Avec quels réseaux nous travaillons", p: ["Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon Associates, Soicos et Skimlinks (qui transforme les liens ordinaires vers certaines boutiques, comme Pro:Direct, en liens d'affiliation). Toutes les boutiques affichées ne nous versent pas de commission : nous listons aussi des boutiques avec lesquelles nous n'avons aucun accord."] },
          { h: "La commission ne change pas le classement", p: ["Pour chaque produit, les offres sont classées uniquement par prix total (prix plus livraison), de la moins chère à la plus chère. La commission qu'une boutique peut verser n'intervient ni dans ce classement ni dans le choix de l'offre marquée meilleur prix."] },
          { h: "Comment nous calculons le « meilleur prix »", p: [
            "C'est l'offre au total le plus bas parmi celles qui sont en stock, livrent le pays choisi et correspondent au filtre de taille ou de version. Le total est le prix plus la livraison ; pour eBay, quand c'est possible, nous utilisons la livraison réelle vers votre pays à la place de l'estimation.",
            "Pour classer des offres en devises différentes, nous utilisons des taux de change fixes et approximatifs ; le montant affiché est toujours dans la devise de la boutique. La livraison et les taxes d'importation peuvent changer au paiement : confirmez-les en boutique.",
          ] },
          { h: "Ce que nous mesurons", p: ["Nous enregistrons les clics vers les boutiques pour savoir quels liens fonctionnent, sans conserver votre IP. Si vous acceptez, Google Analytics et Skimlinks ajoutent leur propre mesure. Détails dans la politique de confidentialité."] },
          { h: "Amazon", p: ["En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises."] },
          { h: "Une question ?", p: ["Écrivez-nous à {email}."] },
        ],
      },
    },
  },
  it: {
    updatedLabel: "Ultimo aggiornamento",
    dateLabel: "2 ottobre 2026",
    entityLabels: { owner: "Titolare", nif: "NIF", address: "Indirizzo", email: "E-mail", site: "Sito web" },
    footer: { legal: "Note legali", money: "Come guadagniamo", cookies: "Preferenze cookie" },
    consent: {
      region: "Preferenze cookie",
      title: "La tua privacy",
      body: "Usiamo archiviazione propria indispensabile (lingua, paese, preferiti). Con il tuo consenso usiamo anche Google Analytics (misurare le visite) e Skimlinks (affiliazione: guadagniamo una commissione se acquisti, senza costi aggiuntivi per te). Puoi accettare, rifiutare o scegliere. Il sito funziona allo stesso modo se rifiuti.",
      accept: "Accetta",
      reject: "Rifiuta",
      configure: "Personalizza",
      save: "Salva la scelta",
      moreInfo: "Informativa sulla privacy",
      necessaryLabel: "Necessari",
      necessaryDesc: "Lingua, paese, preferiti e questa stessa scelta. Sempre attivi.",
      analyticsLabel: "Analisi (Google Analytics 4)",
      analyticsDesc: "Conta visite e clic per capire quali pagine sono utili. Cookie _ga di Google.",
      affiliateLabel: "Affiliazione (Skimlinks)",
      affiliateDesc: "Trasforma i link ad alcuni negozi in link di affiliazione. Skimlinks può usare cookie.",
      reopen: "Modifica le preferenze cookie",
    },
    pages: {
      aviso: {
        metaTitle: "Note Legali | Football Cult",
        metaDescription: "Titolare, oggetto e condizioni d'uso di football-cult.com (legge spagnola 34/2002, LSSI-CE).",
        h1: "Note legali",
        sections: [
          { h: "Dati del titolare", p: ["In adempimento dell'articolo 10 della legge spagnola 34/2002 sui servizi della società dell'informazione e il commercio elettronico (LSSI-CE), si informa che questo sito appartiene alla persona indicata di seguito."] },
          { h: "Oggetto del sito", p: ["Football Cult è un comparatore di prezzi di maglie, scarpe e altri articoli da calcio. Non vendiamo prodotti né gestiamo ordini, pagamenti o spedizioni: ti indirizziamo al negozio di un terzo, e il contratto di acquisto è concluso solo tra te e quel negozio.", "Alcuni link ai negozi sono link di affiliazione: possiamo ricevere una commissione se acquisti, senza costi aggiuntivi per te. Lo spieghiamo nella pagina «Come guadagniamo»."] },
          { h: "Accuratezza delle informazioni", p: ["Prezzi, costi di spedizione e disponibilità provengono dai cataloghi dei negozi stessi e cambiano spesso. Possono differire dal prezzo finale sul sito del negozio; vale quello che vedi lì prima di pagare. Non garantiamo che le informazioni siano prive di errori né sempre aggiornate."] },
          { h: "Proprietà intellettuale e marchi", p: ["Nomi, stemmi, marchi e immagini di club, nazionali, produttori e negozi appartengono ai rispettivi titolari e sono mostrati solo per identificare i prodotti. Football Cult non è affiliata né sponsorizzata da club, federazioni o produttori. Il design e i testi propri del sito non possono essere riprodotti senza autorizzazione."] },
          { h: "Link a terzi", p: ["Non siamo responsabili del contenuto, delle politiche o delle pratiche dei siti di terzi a cui rimandiamo. Prima di acquistare, leggi le condizioni del negozio."] },
          { h: "Legge applicabile", p: ["Queste note sono regolate dalla legge spagnola. Se sei un consumatore, mantieni i diritti riconosciuti dalla normativa del tuo luogo di residenza. Per qualsiasi domanda o reclamo scrivi a {email}."] },
        ],
      },
      privacidad: {
        metaTitle: "Informativa sulla Privacy | Football Cult",
        metaDescription: "Quali dati tratta Football Cult, con quali terze parti, cookie di Google Analytics e Skimlinks, e come esercitare i diritti GDPR.",
        h1: "Informativa sulla privacy",
        sections: [
          { h: "Titolare del trattamento", p: ["Il titolare è la persona indicata di seguito. Per qualsiasi questione sui tuoi dati scrivi a {email}."] },
          { h: "Quali dati trattiamo e perché", p: [
            "Navigazione. Quando carichi il sito, il nostro server e Cloudflare (che ti consegna il sito) trattano il tuo indirizzo IP e dati tecnici per servire le pagine e proteggerle dagli abusi. Base giuridica: legittimo interesse alla sicurezza del servizio.",
            "Clic verso i negozi. Quando premi «Vedi offerta» passi da un nostro link (/go/) che registra il clic: data, prodotto, negozio, lingua, tipo di pagina e un riepilogo del browser (ad esempio «Chrome, Android, mobile»). Non conserva il tuo IP né alcun identificativo. Serve a sapere quali link funzionano e a rimuovere quelli rotti.",
            "Analisi (solo se accetti). Google Analytics 4 misura visite, pagine viste e clic verso i negozi. Base giuridica: il tuo consenso.",
            "Affiliazione (solo se accetti). Skimlinks trasforma i link ad alcuni negozi in link di affiliazione perché possiamo ricevere una commissione. Base giuridica: il tuo consenso.",
            "Avvisi di prezzo. Se richiedi un avviso, conserviamo la tua e-mail e il prodotto finché non annulli l'iscrizione (ogni avviso contiene un link per farlo). Base giuridica: la tua richiesta.",
            "Account. Se accedi con Google o con un link inviato alla tua e-mail, trattiamo la tua e-mail e, con Google, nome e foto del profilo. I tuoi preferiti viaggiano nella tua sessione. Base giuridica: esecuzione del servizio richiesto.",
            "Contatto e segnalazioni. Se ci scrivi o segnali un prodotto, usiamo il tuo messaggio e la tua e-mail per risponderti. L'invio è effettuato da Resend.",
          ] },
          { h: "Cookie e archiviazione locale", p: [
            "Necessari (non richiedono consenso): cookie della lingua (football-cult-locale, 1 anno), cookie del paese rilevato (football-cult-geo-country, 30 giorni), cookie di sessione se accedi e, nel tuo browser, la scelta sui cookie, il paese, i preferiti, il confronto e gli articoli visti di recente.",
            "Analisi: cookie _ga e _ga_* di Google, solo se accetti. Affiliazione: script e cookie di Skimlinks, solo se accetti. Senza il tuo consenso non vengono caricati né Google Analytics né Skimlinks.",
            "Puoi cambiare la scelta in qualsiasi momento con «Preferenze cookie» a piè di pagina o con il pulsante qui sotto. Se revochi un consenso, la pagina si ricarica e quei servizi non vengono più caricati.",
          ] },
          { h: "Con chi condividiamo i dati", p: [
            "Google (Analytics 4 se accetti, e accesso), Skimlinks (se accetti), Cloudflare (rete e sicurezza), Resend (invio e-mail), un fornitore di database cloud (avvisi e registri degli account) e images.weserv.nl (servizio che consegna le foto dei prodotti: il tuo browser gli richiede le immagini e vede il tuo IP).",
            "Quando premi «Vedi offerta» esci verso il negozio o la sua rete di affiliazione (Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon, Soicos o altre). Da quel momento valgono la loro informativa e i loro cookie. Non vendiamo i tuoi dati.",
          ] },
          { h: "Trasferimenti internazionali", p: ["Alcuni di questi fornitori si trovano fuori dallo Spazio economico europeo (ad esempio negli USA o nel Regno Unito). Si basano su una decisione di adeguatezza (come il quadro UE-USA per la protezione dei dati) o sulle clausole contrattuali tipo di ciascun fornitore."] },
          { h: "Per quanto tempo li conserviamo", p: ["Avvisi: finché non annulli l'iscrizione. Messaggi di contatto: il tempo necessario a gestirli. Analisi: il periodo configurato nella proprietà di Google Analytics. Il registro dei clic non contiene dati personali."] },
          { h: "I tuoi diritti", p: ["Puoi chiedere accesso, rettifica, cancellazione, opposizione, limitazione e portabilità dei tuoi dati, e revocare il consenso in qualsiasi momento, scrivendo a {email}. Se ritieni che i tuoi dati non siano trattati correttamente, puoi presentare reclamo all'Agenzia spagnola per la protezione dei dati (aepd.es) o al Garante per la protezione dei dati personali."] },
          { h: "Modifiche", p: ["Se qualcosa di quanto sopra cambia (ad esempio un nuovo servizio), aggiorneremo questa pagina e la sua data."] },
        ],
      },
      dinero: {
        metaTitle: "Come Guadagniamo | Football Cult",
        metaDescription: "Football Cult riceve commissioni di affiliazione senza costi aggiuntivi per te. Quali reti usiamo, come sono ordinate le offerte e come calcoliamo il miglior prezzo.",
        h1: "Come guadagniamo",
        sections: [
          { h: "In breve", p: ["Football Cult è gratuito per te. Quando premi «Vedi offerta» e acquisti nel negozio, quel negozio o la sua rete di affiliazione può pagarci una commissione. Non paghi nulla in più: il prezzo è lo stesso che se entrassi direttamente."] },
          { h: "Con quali reti lavoriamo", p: ["Awin, eBay Partner Network, TradeTracker, Rakuten Advertising, Amazon Associates, Soicos e Skimlinks (che trasforma i link normali ad alcuni negozi, come Pro:Direct, in link di affiliazione). Non tutti i negozi che mostriamo ci pagano una commissione: elenchiamo anche negozi con cui non abbiamo alcun accordo."] },
          { h: "La commissione non cambia l'ordine", p: ["All'interno di ogni prodotto, le offerte sono ordinate solo per prezzo totale (prezzo più spedizione), dalla più economica alla più cara. La commissione che un negozio può pagare non interviene né in quell'ordine né nella scelta dell'offerta indicata come miglior prezzo."] },
          { h: "Come calcoliamo il «miglior prezzo»", p: [
            "È l'offerta con il totale più basso tra quelle disponibili, che spediscono nel paese scelto e rispettano il filtro di taglia o versione. Il totale è prezzo più spedizione; per eBay, quando è possibile verificarla, usiamo la spedizione reale verso il tuo paese al posto della stima.",
            "Per ordinare offerte in valute diverse usiamo tassi di cambio fissi e approssimativi; l'importo che vedi è sempre nella valuta del negozio. Spedizione e imposte di importazione possono cambiare al pagamento: confermale nel negozio.",
          ] },
          { h: "Cosa misuriamo", p: ["Registriamo i clic verso i negozi per sapere quali link funzionano, senza conservare il tuo IP. Se accetti, Google Analytics e Skimlinks aggiungono la loro misurazione. Dettagli nell'informativa sulla privacy."] },
          { h: "Amazon", p: ["In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei."] },
          { h: "Domande?", p: ["Scrivici a {email}."] },
        ],
      },
    },
  },
};
