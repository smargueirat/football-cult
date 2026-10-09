import { mpnFor } from "@/lib/offerGtin";
import { isComparableStore } from "@/lib/officialStores";
import { products } from "@/data/products";
import { offerVersion, type JerseyVersion } from "@/lib/jerseyVersion";

import { bestPerRetailer, countDistinctRetailers, getRetailerFamily, getRetailerLabel } from "@/lib/retailerFamily";
// Estudio de dispersión de precios, calculado EN BUILD desde el catálogo
// real -- no hay números escritos a mano en ningún lado. Cada vez que el
// scan nocturno actualiza products.ts y se redespliega, el estudio se
// recalcula solo. Es lo que lo hace citable: no envejece.
//
// Criterios, elegidos para que la comparación sea honesta y no infle el
// resultado (cada exclusión tiene un motivo real, ver README del estudio):
//  - Solo temporada actual: en retro conviven la pieza original de época
//    y la reedición/réplica moderna, que NO son el mismo producto -- medir
//    su diferencia de precio daría "90% de ahorro" comparando cosas
//    distintas.
//  - Solo EUR: comparar un precio en USD contra uno en EUR exige convertir,
//    y la conversión mete un error que no controlamos.
//  - Solo minoristas oficiales: se excluyen marketplaces (eBay, Amazon),
//    donde el precio depende del vendedor y del estado, y tiendas de
//    réplicas no licenciadas.
//  - Al menos 2 TIENDAS DISTINTAS: dos ofertas de la misma tienda no son
//    una comparación.
const CURRENT_SEASONS = ["2026/27", "2025/26", "2026"];
// La lista vive en officialStores.ts: la comparte el cálculo del
// ahorro de la ficha, que si no anclaba el "ahorrás X%" en una tienda de
// réplicas (ver el comentario de ese archivo).

export interface StudyExample {
  id: string;
  teamKey: string;
  typeKey: string;
  season: string;
  low: number;
  lowStore: string;
  high: number;
  highStore: string;
  gapPct: number;
  gapAbs: number;
  /** Marca de la camiseta y URLs de las ofertas que se compararon (mismo
   *  código de fabricante). Las usa el índice mensual para seguir ESAS
   *  mismas ofertas en el archivo de precios. */
  brand: string;
  urls: string[];
  /** Público de la ficha (la de niño es otra prenda y otro precio) y
   *  versión de las ofertas comparadas. Van en el CSV para que "Italia 2026
   *  primera" a 40 EUR (niño) y a 90 (adulto) no parezcan la misma camiseta. */
  audience: "adult" | "kids" | "women";
  version: JerseyVersion;
}

export interface StoreRank {
  store: string;
  appearances: number;
  wins: number;
  winPct: number;
}

export interface PriceStudy {
  products: number;
  stores: number;
  avgGapPct: number;
  medianGapPct: number;
  avgGapAbs: number;
  maxGapAbs: number;
  shareOver20: number;
  shareOver10: number;
  shareSamePrice: number;
  examples: StudyExample[];
  /** Todas las filas, no solo los diez ejemplos destacados. Existe
   *  para el CSV descargable: lo primero que pide quien quiere citar el
   *  estudio es la tabla entera, y sin ella el dato no es verificable. */
  rows: StudyExample[];
  storeRanking: StoreRank[];
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

let cached: PriceStudy | null = null;

export function priceStudy(): PriceStudy {
  if (cached) return cached;

  const rows: StudyExample[] = [];
  const appearances = new Map<string, number>();
  const wins = new Map<string, number>();
  const labelOf = new Map<string, string>();

  for (const p of products) {
    if (p.typeKey === "retro") continue;
    if (!CURRENT_SEASONS.includes(p.season)) continue;
    const eligible = p.offers.filter((o) => o.currency === "EUR" && isComparableStore(o.store));

    // Solo se comparan ofertas con el MISMO CÓDIGO DE FABRICANTE (MPN).
    //
    // Antes se agrupaba por versión y manga leídas del título (variantKey),
    // y no alcanzaba: adidas escribe "Oficial" tanto en la versión de jugador
    // (150 EUR) como en la de hincha (90 EUR), y otras tiendas no escriben
    // nada. Resultado, medido el 2026-09-28: los tres ejemplos principales
    // eran mezclas -- "Italia mujer" comparaba la de hincha a 60 EUR (código
    // JY7586) con la de jugador a 150 (KA193) -- y la diferencia media
    // publicada daba 17,5% cuando, comparando la misma prenda, es 7,6%.
    //
    // El código del fabricante no se adivina: lo publica cada tienda en su
    // feed y es distinto para cada versión. Dos ofertas con el mismo código
    // son la misma prenda, sin interpretación. Es menos muestra (se quedan
    // afuera las ofertas sin código), pero cada fila del estudio se puede
    // verificar, que es lo que necesita quien quiera citarlo.
    const byMpn = new Map<string, typeof eligible>();
    for (const o of eligible) {
      const m = mpnFor(o.url);
      if (m) byMpn.set(m, [...(byMpn.get(m) ?? []), o]);
    }
    const offers = [...byMpn.values()].sort(
      (a, b) => countDistinctRetailers(b) - countDistinctRetailers(a),
    )[0];
    if (!offers) continue;
    // Minoristas distintos, no feeds: FootStoreES y FootStoreFR son la
    // misma tienda y su diferencia de precio no es una comparación.
    const storeNames = new Set(offers.map((o) => getRetailerFamily(o.store)));
    if (storeNames.size < 2) continue;
    for (const o of offers) labelOf.set(getRetailerFamily(o.store), getRetailerLabel(o.store));

    // Total real: precio + envío. Comparar solo el precio escondería que
    // una tienda barata con envío caro termina saliendo más.
    const totals = bestPerRetailer(
      offers.map((o) => ({ store: o.store, total: o.price + o.shipping })),
      (a, b) => a.total < b.total,
    ).sort((a, b) => a.total - b.total);
    const low = totals[0];
    const high = totals[totals.length - 1];
    if (low.total <= 0) continue;

    // Las dos cuentas por FAMILIA (getRetailerFamily). Hasta el 2026-10-09
    // las apariciones iban por familia ("footstore") y las victorias por el
    // nombre del feed ("FootStoreES"): nunca coincidían y la tabla "qué tienda
    // gana más veces" salía al 0 % en todas (regresión de 547c94d, que pasó
    // storeNames a familias). Comprobación: scripts/check_data_pages.mts.
    for (const s of storeNames) appearances.set(s, (appearances.get(s) ?? 0) + 1);
    const winner = getRetailerFamily(low.store);
    wins.set(winner, (wins.get(winner) ?? 0) + 1);

    rows.push({
      id: p.id,
      teamKey: p.teamKey,
      typeKey: p.typeKey,
      season: p.season,
      low: low.total,
      lowStore: low.store,
      high: high.total,
      highStore: high.store,
      gapPct: ((high.total - low.total) / high.total) * 100,
      gapAbs: high.total - low.total,
      brand: p.brand ?? "",
      urls: offers.map((o) => o.url),
      audience: p.ageGroup === "kids" || p.ageGroup === "women" ? p.ageGroup : "adult",
      // Mismo código de fabricante = misma prenda; basta con que un título
      // diga "jugador" (offerVersion da hincha si el título no dice nada).
      version: offers.some((o) => offerVersion(o) === "player") ? "player" : "fan",
    });
  }

  const pcts = rows.map((r) => r.gapPct);
  const share = (f: (x: number) => boolean) => (rows.filter((r) => f(r.gapPct)).length / rows.length) * 100;

  cached = {
    products: rows.length,
    stores: appearances.size,
    avgGapPct: pcts.reduce((a, b) => a + b, 0) / pcts.length,
    medianGapPct: median(pcts),
    avgGapAbs: rows.reduce((a, r) => a + r.gapAbs, 0) / rows.length,
    maxGapAbs: Math.max(...rows.map((r) => r.gapAbs)),
    shareOver20: share((x) => x >= 20),
    shareOver10: share((x) => x >= 10),
    shareSamePrice: share((x) => x < 0.5),
    examples: [...rows].sort((a, b) => b.gapAbs - a.gapAbs).slice(0, 10),
    rows: [...rows].sort((a, b) => b.gapAbs - a.gapAbs),
    // TODAS las tiendas del estudio (antes solo las de 10+ comparaciones): la
    // cabecera dice "N tiendas" y la tabla tiene que tener esas N filas. La
    // columna "ganadas / comparaciones" ya deja ver cuándo la muestra es chica.
    storeRanking: [...appearances.entries()]
      .map(([family, n]) => ({
        store: labelOf.get(family) ?? family,
        appearances: n,
        wins: wins.get(family) ?? 0,
        winPct: ((wins.get(family) ?? 0) / n) * 100,
      }))
      .sort((a, b) => b.winPct - a.winPct || b.appearances - a.appearances),
  };
  return cached;
}
