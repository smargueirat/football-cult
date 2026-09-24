import { products } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";

// Números de la franja de confianza, contados del catálogo en build.
//
// La propuesta original decía "+10.000 artículos comparados" y "tiendas
// 100% verificadas y oficiales". Las dos son falsas y de la peor manera:
// comprobables. Comparan ~5.100 productos (el resto tiene una sola
// tienda), y listamos eBay, Amazon y FansJerseyHub, que no son tiendas
// oficiales. Una franja de confianza que miente es peor que no tenerla:
// es justo donde el visitante decide si creernos.
//
// Con los números reales el mensaje funciona igual, y además no hay que
// volver a tocarlo nunca: se recalcula con el scan nocturno.
export interface TrustStats {
  comparedProducts: number;
  stores: number;
}

let cached: TrustStats | null = null;

export function trustStats(): TrustStats {
  if (cached) return cached;
  const stores = new Set<string>();
  let compared = 0;
  const all = [
    products,
    bootProducts,
    gloveProducts,
    ballProducts,
    apparelProducts,
    trainingProducts,
  ];
  for (const list of all) {
    for (const p of list as { offers: { store: string }[] }[]) {
      const own = new Set(p.offers.map((o) => o.store));
      for (const s of own) stores.add(s);
      if (own.size >= 2) compared += 1;
    }
  }
  cached = { comparedProducts: compared, stores: stores.size };
  return cached;
}
