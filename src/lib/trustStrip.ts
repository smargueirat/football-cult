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

// Separador de miles a mano, sin Intl.
//
// `(7584).toLocaleString("es")` devuelve "7584" sin separador: el Node de
// build trae ICU reducido (solo en-GB) y el formateo por idioma degrada
// EN SILENCIO, que es lo peor que puede hacer -- no tira error, solo
// escribe mal el número. Verificado el 2026-09-24 en vivo.
export function groupThousands(n: number, locale: string): string {
  const digits = String(Math.round(n));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  // Inglés usa coma; el resto de nuestros idiomas, punto. El espacio
  // duro intermedio evita tener que escapar el separador dos veces.
  return grouped.replace(/\u00A0/g, locale === "en" ? "," : ".");
}
