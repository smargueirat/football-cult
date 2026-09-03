import { buildShoppingFeedXml } from "@/lib/shoppingFeed";

// Feed de Google Shopping / Merchant Center específico de Estados Unidos
// (USD) -- ver nota en src/lib/shoppingFeed.ts sobre por qué cada país
// necesita su propio feed en vez de uno global multi-moneda.
export const dynamic = "force-static";

export async function GET() {
  const xml = buildShoppingFeedXml("USD", "US");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
