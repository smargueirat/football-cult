import { bestOffer, products, teamNames, typeNames } from "@/data/products";

// Feed de Google Shopping / Merchant Center (RSS 2.0 + namespace g:) --
// un item por producto, con el precio de la mejor oferta real disponible
// (no representa las N tiendas que sí se muestran en la ficha: un item de
// Merchant Center es un solo precio, no un comparador -- ver nota en
// scripts/catalog-mining/README.md sobre Comparison Shopping Services si
// más adelante se quiere representar cada oferta por separado).
export const dynamic = "force-static";

const SITE_URL = "https://football-cult.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = products
    .map((product) => {
      const offer = bestOffer(product);
      // Sin oferta en stock o sin foto real, no hay nada válido para
      // mandarle a Merchant Center (image_link es obligatorio).
      if (!offer || !offer.imageUrl) return null;

      const team = teamNames[product.teamKey].es;
      const type = typeNames[product.typeKey].es;
      const title = `${team} ${type} ${product.season}`;
      const description = `Camiseta ${type.toLowerCase()} de ${team}, temporada ${product.season}. Comparación de precio real en Football Cult.`;
      const link = `${SITE_URL}/camiseta/${product.id}`;

      return `  <item>
    <g:id>${escapeXml(product.id)}</g:id>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <g:image_link>${escapeXml(offer.imageUrl)}</g:image_link>
    <g:availability>in stock</g:availability>
    <g:price>${offer.price.toFixed(2)} ${offer.currency}</g:price>
    <g:condition>new</g:condition>
    ${product.brand ? `<g:brand>${escapeXml(product.brand)}</g:brand>` : ""}
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Shirts &amp; Tops</g:google_product_category>
  </item>`;
    })
    .filter((item): item is string => item !== null)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Football Cult</title>
  <link>${SITE_URL}</link>
  <description>Comparador de precios de camisetas de fútbol</description>
${items}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
