import gtins from "@/data/offerGtins.json";
import mpns from "@/data/offerMpns.json";

// EAN/GTIN real de cada oferta, indexado por su URL.
//
// Vive FUERA de products.ts a propósito: ese archivo está al borde del límite
// de complejidad de tipos de TypeScript y sumarle un campo opcional más a las
// ofertas lo revienta con "Expression produces a union type that is too
// complex to represent" (probado el 2026-09-28). Mismo motivo y mismo patrón
// que las bajadas de precio en priceDrops.ts.
//
// El dato lo genera scripts/catalog-mining/update_gtins.py cruzando las URLs
// del catálogo con la columna de EAN de cada feed. Nunca se deriva ni se
// inventa: si la tienda no lo publica, la oferta simplemente no está acá.
const MAP = gtins as Record<string, string>;

/** El GTIN de esa oferta, o undefined si su tienda no lo publica. */
export function gtinFor(url: string): string | undefined {
  return MAP[url];
}

/** `{ gtin }` para el JSON-LD de una Offer solo si la oferta es de UNA talla
 *  (el EAN identifica una talla concreta). */
export function singleSizeGtin(o: { url: string; sizes?: readonly string[] }): { gtin?: string } {
  const g = o.sizes?.length === 1 ? MAP[o.url] : undefined;
  return g ? { gtin: g } : {};
}

const MPN = mpns as Record<string, string>;

/** Código del fabricante de esa oferta ("KC3993"), o undefined. */
export function mpnFor(url: string): string | undefined {
  return MPN[url];
}

/**
 * El código del fabricante de una FICHA: el que más se repite entre sus
 * ofertas. A diferencia del EAN, no depende de la talla, así que es el
 * identificador correcto para una ficha que agrupa todas las tallas.
 */
export function productMpn(offers: { url: string }[]): string | undefined {
  const count = new Map<string, number>();
  for (const o of offers) {
    const m = MPN[o.url];
    if (m) count.set(m, (count.get(m) ?? 0) + 1);
  }
  let best: string | undefined;
  let n = 0;
  for (const [k, v] of count) if (v > n) [best, n] = [k, v];
  return best;
}

// Código escrito en el título real de la oferta (sobre todo eBay, que no
// tiene feed con MPN): Nike "893873-100" / "IB5321-718", Puma "773346-02",
// adidas "KV2847" (solo si el título dice adidas). La consulta con más
// impresiones de Search Console (sep-oct 2026) es "893873 euros", el código
// de la camiseta de Francia 2018 que solo figura en el título de eBay.
const NIKE_CODE = /\b((?:[A-Z]{2}\d{4}|\d{6})-\d{3})\b/;
const PUMA_CODE = /\b(\d{6}-\d{2})\b/;
const ADIDAS_CODE = /\b([A-Z]{2}\d{4})\b/;

export function titleCode(title: string): string | undefined {
  const t = title.toUpperCase();
  return t.match(NIKE_CODE)?.[1] ?? t.match(PUMA_CODE)?.[1] ?? (t.includes("ADIDAS") ? t.match(ADIDAS_CODE)?.[1] : undefined);
}

/** Código del fabricante de una ficha: el MPN del feed y, si no hay, el que
 *  aparece en los títulos de sus ofertas, solo si es UNO (dos códigos
 *  distintos suelen ser versión jugador y aficionado mezcladas). */
export function productCode(offers: { url: string; title?: string }[]): string | undefined {
  const mpn = productMpn(offers);
  if (mpn) return mpn;
  const codes = new Set(offers.map((o) => (o.title ? titleCode(o.title) : undefined)).filter(Boolean));
  return codes.size === 1 ? [...codes][0] : undefined;
}
