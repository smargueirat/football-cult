// Comisión estimada por tienda, como fracción del precio del producto.
//
// PROVISIONAL: son las tarifas típicas de cada red/programa, NO las
// nuestras confirmadas una por una en el panel de Awin. Sirven para lo
// que se usan hoy, que es ORDENAR (qué oferta ofrecer primero entre dos
// precios casi iguales, qué bajada publicar antes en el canal): para eso
// basta con que el orden relativo sea correcto. NO sirven para prometerle
// a nadie un ingreso concreto. Cuando estén los porcentajes reales, se
// cambian los números acá y nada más.
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
  "eBay US": 0.02,

  // Awin, tiendas de fútbol especializadas.
  FootStoreES: 0.06,
  FootStoreFR: 0.06,
  SportIsGoodES: 0.06,
  SportIsGoodFR: 0.06,
  PlanetFoot: 0.06,
  DeporteOutlet: 0.06,
  DeporteOutletES: 0.06,
  FansJerseyHub: 0.08,

  // Marcas y grandes superficies: pagan menos que las especializadas.
  AdidasES: 0.06,
  AdidasPT: 0.06,
  DecathlonIE: 0.03,
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
  "Pro:Direct Soccer": 0,
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
