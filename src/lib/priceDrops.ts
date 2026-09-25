import data from "@/data/priceDrops.json";

// Bajadas de precio de TODAS las secciones, no solo camisetas.
//
// Antes esto vivía como un campo `previousPrice` inyectado a mano dentro
// de cada oferta de products.ts por el rastreo nocturno. Eso funcionaba
// para camisetas y para nada más: botas, entradas, ropa, guantes, pelotas
// y entrenamiento nunca recibían el campo, así que el sello de rebaja, el
// filtro "en baja" y la sección de bajadas de la home no se activaban
// jamás fuera de camisetas -- justo en las secciones que más comisión
// pagan (una bota deja ~4 veces lo que deja una camiseta de eBay).
//
// Meterle el campo a las otras seis interfaces de oferta habría sido
// repetir seis veces lo mismo, y el rastreo tenía que reescribir a mano
// siete archivos de TypeScript con formatos de literal distintos (unos en
// una línea, otros multilínea con `sizePrices` anidado que también tiene
// `price` y `url`: un sed ahí es un bug esperando). Un mapa aparte,
// indexado por la URL de la oferta, cubre las siete secciones con un solo
// archivo y sin tocar ningún tipo.
//
// La clave es la URL porque es lo que identifica una oferta concreta
// (misma tienda, mismo producto) entre corridas, el mismo criterio que ya
// usaba el snapshot diario.
const DROPS = data as Record<string, number>;

/** Lo mínimo que hace falta para saber si una oferta bajó. */
export interface DroppableOffer {
  url: string;
  price: number;
}

// Sigue valiendo la invariante de siempre: se compara el precio anterior
// contra el actual de la MISMA oferta, en su moneda nativa y sin envío.
// Quien pinte el par tachado/actual tiene que usar esa misma oferta para
// los dos (ver previousOfferTotal en offerMoney.ts).
export function previousPriceOf(offer: DroppableOffer): number | undefined {
  const prev = DROPS[offer.url];
  if (prev == null || prev <= offer.price) return undefined;
  // Medio punto porcentual de mínimo: el porcentaje se muestra redondeado
  // a entero, así que una bajada de céntimos pintaba un sello que decía
  // "Bajó 0%" (real: atalanta-retro-2010-home y dinamarca-retro-200405-away
  // lo hacían). Con 43.000 ofertas vigiladas en siete secciones, en vez de
  // 10.500 en una, esas fluctuaciones mínimas dejan de ser una rareza.
  if ((prev - offer.price) / prev < 0.005) return undefined;
  return prev;
}

export function isPriceDropped(offer: DroppableOffer): boolean {
  return previousPriceOf(offer) !== undefined;
}

// Redondeado a entero -- una baja de precio real casi siempre es de
// varios puntos porcentuales; mostrar decimales (ej "4.7%") suma ruido.
export function priceDropPercent(offer: DroppableOffer): number {
  const prev = previousPriceOf(offer);
  if (prev === undefined) return 0;
  return Math.round(((prev - offer.price) / prev) * 100);
}
