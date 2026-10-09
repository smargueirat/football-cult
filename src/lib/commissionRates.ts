// Comisión estimada por tienda, como fracción del precio del producto.
//
// Sirven para DESEMPATAR (src/lib/offerOrder.ts: entre dos ofertas cuyo
// total con envío difiere <= 1 %, va primero la de mayor comisión; nunca
// por encima de una más barata) y para elegir qué bajada publicar antes en
// el canal. NO sirven para prometerle a nadie un ingreso concreto.
//
// Revisión 2026-10-09 (informe football-cult-review/2026-10-08/
// monetizacion.md, H12): Gigsberg, adidas ES/PT, Nike/Puma (Soicos) y los
// enlaces de Sovrn estaban mal; corregidos abajo con su fuente.
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
  // igual. POR VERIFICAR en el panel de EPN: fuentes secundarias publican
  // ~4 % para "Clothing, Shoes & Accessories"; se deja 2 % hasta verlo.
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

  // adidas ES: venta REAL del 2026-09-21 en Awin, EUR 6,63 sobre EUR 82,85
  // = 8 % (estaba en 6 %). PT es el mismo programa de adidas en Awin.
  AdidasES: 0.08,
  AdidasPT: 0.08,
  // adidas CL (Awin 79922, aprobado 2026-10-06): PROVISIONAL, sin EPC ni
  // venta medida todavía. 6 % = por debajo de lo medido en adidas ES, a
  // propósito. Revisar en el directorio de Awin cuando haya EPC.
  AdidasCL: 0.06,
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
  // Awin aid 121508, aprobado 2026-10-04: 8,23% publicado.
  "Reebok DE": 0.08,

  // Entradas: porcentaje parecido al retail pero sobre un ticket medio de
  // €91, así que por clic paga más que una camiseta.
  FootballTicketNetUK: 0.04,
  FootballTicketNetUS: 0.04,
  // Gigsberg ES: EPC EUR 0,11 con 0,47 % de conversión (Awin, 2026-09-28)
  // => EPC/conversión = ~EUR 23 de comisión por pedido. Con la entrada
  // mediana de Gigsberg en EUR 103 (tickets.ts, 2026-10-09) y pedidos de ~2
  // entradas, eso es ~11 %. Estaba en 1 %, que la subestimaba ~20 veces.
  Gigsberg: 0.1,

  // Tiendas oficiales de club (Rakuten y programas propios).
  SantosStore: 0.05,
  ComoFCShop: 0.05,
  InterStore: 0.05,
  "Shop Real Betis": 0.05,
  CruzeiroStore: 0.05,
  LojaPST: 0.05,
  ShopTimao: 0.05,

  Amazon: 0.03,

  // Nike CL/AR y Puma AR: programas de Soicos (cuenta aprobada 2026-08-27,
  // aid 56058, pid 14271/14661/14084; patrón de enlace en
  // scripts/catalog-mining/README.md "Soicos"). Estaban en 0 ("sin
  // programa"), falso. Soicos no publica la tarifa: se usa la de por
  // defecto (3 %). OJO: las botas de estas tiendas todavía llevan el enlace
  // directo, sin envolver con Soicos (monetizacion.md H10).
  NikeCL: 0.03,
  NikeAR: 0.03,
  PumaAR: 0.03,
  // Pro:Direct España y Reino Unido: enlace directo que monetiza Skimlinks
  // (Pro:Direct paga 3% en esa red; Skimlinks se queda una parte). Su
  // programa en Awin (ID 6667) figura inactivo al 2026-09-29.
  "Pro:Direct ES": 0.02,
  "Pro:Direct Soccer": 0.02,
  // Enlaces sovrn.co (Sovrn Commerce): SÍ monetizan (estaban en 0); tarifa
  // no publicada, se usa la de por defecto.
  "Classic Football Shirts": 0.03,
  "UK Soccer Shop": 0.03,
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
