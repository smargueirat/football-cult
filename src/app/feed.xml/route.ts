import { buildShoppingFeedXml } from "@/lib/shoppingFeed";

// Feed de Google Shopping / Merchant Center para España + resto de la
// eurozona cubierta por la política "Europa (EUR)" en Merchant Center
// (Alemania, Austria, Bélgica, Francia, Irlanda, Italia, Países Bajos,
// Portugal). Se usa España como país de referencia para verificar
// elegibilidad real de envío -- ver la nota completa en
// src/lib/shoppingFeed.ts sobre por qué existe un feed por país en vez
// de uno solo multi-moneda.
export const dynamic = "force-static";

export async function GET() {
  const xml = buildShoppingFeedXml("EUR", "ES");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
