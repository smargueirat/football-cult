import { buildShoppingFeedXml } from "@/lib/shoppingFeed";

// Feed de Google Shopping / Merchant Center específico de Uruguay
// (USD) -- solo incluye ofertas de tiendas con envío mundial
// verificado (ver storeShipping en src/data/products.ts), ya que
// ninguna tienda del catálogo declara envío a Uruguay específicamente.
// Ver nota en src/lib/shoppingFeed.ts sobre por qué cada país necesita
// su propio feed en vez de uno global multi-moneda.
export const dynamic = "force-static";

export async function GET() {
  const xml = buildShoppingFeedXml("USD", "UY", true);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
