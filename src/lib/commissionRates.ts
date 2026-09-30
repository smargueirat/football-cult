// Comisión estimada por tienda, como fracción del precio del producto.
//
// Sirven para ORDENAR (qué oferta ofrecer primero entre dos precios casi
// iguales, qué bajada publicar antes en el canal). NO sirven para
// prometerle a nadie un ingreso concreto.
//
// CONTRASTADAS CONTRA DATOS REALES DE AWIN el 2026-09-28. El panel no
// publica el porcentaje de cada programa en un sitio parseable, pero sí
// publica algo mejor: el EPC medido (lo que ese anunciante paga por clic,
// promediado sobre TODOS los publishers de la red, así que ya mezcla
// comisión con tasa de conversión). Leído en el directorio, pestaña
// "Joined", región EUR:
//
//   anunciante          conversión    EPC
//   FansJerseyHub         10,57%    USD 0,43   <- el mejor con diferencia
//   adidas ES              3,90%    EUR 0,16
//   Foot-Store ES          2,36%    EUR 0,08
//   BSTN ES                1,91%    EUR 0,08
//   Forum Sport ES         2,22%    EUR 0,07
//   Sport is good ES       0,74%    EUR 0,03
//   Deporte Outlet ES      0,51%    EUR 0,01   <- el peor
//
// Dos correcciones que salieron de ahí, porque los había sobreestimado:
// Deporte Outlet y Sport is Good estaban en 6% y son, medidos, los dos
// que menos dejan por clic de toda nuestra lista.
//
// Y un porcentaje real, ese sí publicado en los términos de su programa:
// BSTN ES paga 8% a precio completo y 5% en rebajas (3% en lanzamientos,
// 4% a sitios de cupones). Como casi todo lo que mostramos de ellos está
// rebajado, 5% es el número que corresponde.
//
// OJO con el EPC: es el promedio de la red, no el nuestro. Nuestro
// tráfico puede convertir distinto. Sirve para ordenar, que es para lo
// que se usa.
//
// Por qué existe este archivo: un clic a una bota deja del orden de
// cuatro veces lo que deja un clic a una camiseta de eBay (mediana €98 al
// 5% contra €56 al 2%), y eBay es el 64,6% de nuestras ofertas de
// camisetas. Sin esta tabla, todo el sitio trata igual a las dos.
//
// Ojo con "FutbolEmotion" y "Futbol Emotion": son la MISMA tienda escrita
// de dos formas distintas (la de botas y la de camisetas se cargaron por
// caminos distintos). Las dos claves están a propósito hasta que se
// unifique el nombre en los datos.
const RATES: Record<string, number> = {
  // eBay Partner Network: la tarifa más baja de todas las que tenemos, y
  // el mayor volumen del catálogo. Las tres variantes regionales pagan
  // igual.
  eBay: 0.02,
  "eBay ES": 0.02,
  "eBay IT": 0.02,
  // Reino Unido, agregado 2026-09-28 para el retro: es el mayor mercado de
  // camisetas retro y el que más anuncios del mismo modelo tiene.
  "eBay GB": 0.02,
  "eBay US": 0.02,

  // Awin, tiendas de fútbol especializadas.
  // Medido: EPC EUR 0,08. Las dos tiendas son el mismo minorista en dos
  // países, así que comparten tarifa.
  FootStoreES: 0.05,
  FootStoreFR: 0.05,
  // Medido: EPC EUR 0,03 y 0,74% de conversión -- de los más flojos.
  // Estaba en 0.06.
  SportIsGoodES: 0.03,
  SportIsGoodFR: 0.03,
  PlanetFoot: 0.06,
  // Medido: EPC EUR 0,01 y 0,51% de conversión, lo más bajo de toda
  // nuestra lista. Estaba en 0.06, que era una sobreestimación grande.
  DeporteOutlet: 0.02,
  DeporteOutletES: 0.02,
  FansJerseyHub: 0.08,

  // Marcas y grandes superficies: pagan menos que las especializadas.
  AdidasES: 0.06,
  AdidasPT: 0.06,
  DecathlonIE: 0.03,
  // Publicado en sus propios términos: 8% a precio completo, 5% en
  // rebajas. Casi todo lo que mostramos de ellos está rebajado.
  BSTNIT: 0.05,
  BSTNUK: 0.05,
  GigasportDE: 0.05,
  GigasportCH: 0.05,
  GigasportFR: 0.05,
  FutbolEmotion: 0.04,
  "Futbol Emotion": 0.04,
  ForumSport: 0.04,
  "Futbol Factory": 0.05,
  ClovisCalcadosBR: 0.05,

  // Entradas: porcentaje parecido al retail pero sobre un ticket medio de
  // €91, así que por clic paga más que una camiseta.
  FootballTicketNetUK: 0.04,
  FootballTicketNetUS: 0.04,

  // Tiendas oficiales de club (Rakuten y programas propios).
  SantosStore: 0.05,
  ComoFCShop: 0.05,
  InterStore: 0.05,
  "Shop Real Betis": 0.05,
  CruzeiroStore: 0.05,
  LojaPST: 0.05,
  ShopTimao: 0.05,

  Amazon: 0.03,

  // Sin programa de afiliado: el clic no paga nada por sí mismo (a lo
  // sumo lo recupera Skimlinks). Van explícitas en 0 para que se vea que
  // están consideradas y no simplemente ausentes.
  NikeCL: 0,
  NikeAR: 0,
  PumaAR: 0,
  // Pro:Direct España y Reino Unido: enlace directo que monetiza Skimlinks
  // (Pro:Direct paga 3% en esa red; Skimlinks se queda una parte). Su
  // programa en Awin (ID 6667) figura inactivo al 2026-09-29.
  "Pro:Direct ES": 0.02,
  "Pro:Direct Soccer": 0.02,
  "Classic Football Shirts": 0,
  "UK Soccer Shop": 0,
};

// Conservador a propósito: una tienda que no está en la tabla no debería
// ganarle el primer puesto a una que sí conocemos.
const DEFAULT_RATE = 0.03;

export function commissionRate(store: string): number {
  return RATES[store] ?? DEFAULT_RATE;
}

/** Comisión estimada de una oferta, en su propia moneda. */
export function estimatedCommission(offer: { store: string; price: number }): number {
  return offer.price * commissionRate(offer.store);
}
