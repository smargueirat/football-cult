import { offerTotalInEUR, type OfferCurrencyCode } from "@/lib/offerMoney";
import { countDistinctRetailers } from "@/lib/retailerFamily";

// Selección de regalos por rango de precio.
//
// Por qué existe: la camiseta de fútbol es un regalo de manual y el pico de
// búsqueda arranca a principios de noviembre, pero todas nuestras páginas
// están organizadas por equipo o por tipo de producto -- o sea, por lo que
// busca alguien que YA sabe qué quiere. Quien busca un regalo no sabe: busca
// por presupuesto. No teníamos ninguna puerta de entrada para eso.
//
// No inventa nada: filtra el catálogo que ya existe por el total real en
// euros (precio + envío, la misma cuenta que ordena las ofertas de una
// ficha), que es justo el número que le importa a alguien con un presupuesto.

export interface GiftOffer {
  store: string;
  price: number;
  shipping?: number;
  currency: OfferCurrencyCode;
  url: string;
  imageUrl?: string;
  inStock?: boolean;
}

export interface Giftable {
  id: string;
  offers: GiftOffer[];
}

export interface GiftBand {
  /** Sufijo de la clave de traducción en GIFTS_UI (bandUpTo25, etc). */
  key: "upTo25" | "upTo50" | "upTo100" | "over100";
  min: number;
  /** Exclusivo. Infinity en el último tramo. */
  max: number;
}

export const GIFT_BANDS: GiftBand[] = [
  { key: "upTo25", min: 0, max: 25 },
  { key: "upTo50", min: 25, max: 50 },
  { key: "upTo100", min: 50, max: 100 },
  { key: "over100", min: 100, max: Infinity },
];

function total(o: GiftOffer): number {
  return offerTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency });
}

/** La oferta más barata que de verdad se puede comprar hoy. */
function cheapestLive(item: Giftable): GiftOffer | undefined {
  return item.offers
    .filter((o) => o.inStock !== false && (o.imageUrl ?? "").trim() !== "")
    .sort((a, b) => total(a) - total(b))[0];
}

/**
 * Fichas de `list` cuyo precio real cae en `band`, con la oferta elegida ya
 * resuelta. Se priorizan las que comparan varias tiendas: en una página de
 * regalos, que haya tres precios para lo mismo es justo lo que convierte a un
 * visitante que no conoce el sitio.
 *
 * `groupKey` evita que un tramo entero se llene del mismo equipo o de la misma
 * marca -- para un regalo la variedad es el producto, no el catálogo entero.
 */
export function giftPicks<T extends Giftable>(
  list: readonly T[],
  band: GiftBand,
  max: number,
  groupKey?: (item: T) => string,
  perGroup = 2,
): (T & { pick: GiftOffer; eur: number })[] {
  const scored: (T & { pick: GiftOffer; eur: number; stores: number })[] = [];
  for (const item of list) {
    const pick = cheapestLive(item);
    if (!pick) continue;
    const eur = total(pick);
    if (eur < band.min || eur >= band.max) continue;
    const stores = countDistinctRetailers(item.offers.filter((o) => o.inStock !== false));
    scored.push({ ...item, pick, eur, stores });
  }
  // Más tiendas primero; a igualdad, lo más barato del tramo.
  scored.sort((a, b) => b.stores - a.stores || a.eur - b.eur);

  const seen = new Map<string, number>();
  const out: (T & { pick: GiftOffer; eur: number })[] = [];
  for (const item of scored) {
    if (out.length >= max) break;
    if (groupKey) {
      const k = groupKey(item);
      const n = seen.get(k) ?? 0;
      if (n >= perGroup) continue;
      seen.set(k, n + 1);
    }
    out.push(item);
  }
  return out;
}
