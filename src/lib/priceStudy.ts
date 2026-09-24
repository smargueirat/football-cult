import { splitByVersion } from "@/lib/jerseyVersion";
import { isComparableStore } from "@/lib/officialStores";
import { products } from "@/data/products";

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

  for (const p of products) {
    if (p.typeKey === "retro") continue;
    if (!CURRENT_SEASONS.includes(p.season)) continue;
    const eligible = p.offers.filter((o) => o.currency === "EUR" && isComparableStore(o.store));

    // Solo se comparan ofertas de la MISMA versión. La de jugador y la de
    // hincha son prendas distintas que las marcas separan por 50-70 EUR,
    // así que mezclarlas no mide dispersión de precio: mide la diferencia
    // entre dos productos. Se veía justo donde más duele -- 6 de los 10
    // ejemplos destacados eran mezclas, porque el estudio ordena por la
    // diferencia más grande y estas siempre ganan (auditoría 2026-09-24).
    // Se toma el grupo con más tiendas; a igualdad, el de hincha, que es
    // el que busca la mayoría.
    const groups = splitByVersion(eligible);
    const offers =
      groups.player.length > groups.fan.length ? groups.player : groups.fan;
    const storeNames = new Set(offers.map((o) => o.store));
    if (storeNames.size < 2) continue;

    // Total real: precio + envío. Comparar solo el precio escondería que
    // una tienda barata con envío caro termina saliendo más.
    const totals = offers
      .map((o) => ({ store: o.store, total: o.price + o.shipping }))
      .sort((a, b) => a.total - b.total);
    const low = totals[0];
    const high = totals[totals.length - 1];
    if (low.total <= 0) continue;

    for (const s of storeNames) appearances.set(s, (appearances.get(s) ?? 0) + 1);
    wins.set(low.store, (wins.get(low.store) ?? 0) + 1);

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
    storeRanking: [...appearances.entries()]
      .filter(([, n]) => n >= 10)
      .map(([store, n]) => ({
        store,
        appearances: n,
        wins: wins.get(store) ?? 0,
        winPct: ((wins.get(store) ?? 0) / n) * 100,
      }))
      .sort((a, b) => b.winPct - a.winPct),
  };
  return cached;
}
