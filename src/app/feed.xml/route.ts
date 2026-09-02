import { bestOffer, getAgeGroup, products, teamNames, typeNames } from "@/data/products";
import { ColorKey, productColorKey } from "@/lib/colorClassify";

// Mismo bucketeo de color que ya usa el filtro del catálogo (ColorKey),
// solo traducido a texto plano para el feed -- no es un dato nuevo.
const COLOR_NAME_ES: Record<ColorKey, string> = {
  black: "Negro",
  white: "Blanco",
  gray: "Gris",
  red: "Rojo",
  orange: "Naranja",
  yellow: "Amarillo",
  green: "Verde",
  teal: "Verde azulado",
  blue: "Celeste",
  navy: "Azul marino",
  purple: "Violeta",
  pink: "Rosa",
};

// Google exige valores fijos para gender/age_group -- getAgeGroup() ya
// existe en el sitio (default "men" cuando el producto no especifica).
// "kids" no tiene un sexo real declarado en el catálogo, así que va como
// unisex en vez de inventar uno.
const GENDER_MAP = { men: "male", women: "female", kids: "unisex" } as const;
const AGE_GROUP_MAP = { men: "adult", women: "adult", kids: "kids" } as const;

// Feed de Google Shopping / Merchant Center (RSS 2.0 + namespace g:) --
// un item por producto, con el precio de la mejor oferta real disponible
// (no representa las N tiendas que sí se muestran en la ficha: un item de
// Merchant Center es un solo precio, no un comparador -- ver nota en
// scripts/catalog-mining/README.md sobre Comparison Shopping Services si
// más adelante se quiere representar cada oferta por separado).
export const dynamic = "force-static";

const SITE_URL = "https://football-cult.com";

// Merchant Center flaggeó "imagen demasiado pequeña" (mín. 500x500px) en
// buena parte del catálogo. No hay forma de agrandar una foto que ya nos
// llega chica desde el feed original de la tienda -- pero una porción real
// pasa por este proxy de redimensionado (images2.productserve.com, w/h en
// la propia URL), que sí podemos pedir en un tamaño más grande sin tocar
// la foto real de ningún lado.
function upsizeIfResizable(url: string): string {
  if (!url.includes("images2.productserve.com")) return url;
  return url.replace(/([?&])w=\d+/, "$1w=800").replace(/([?&])h=\d+/, "$1h=800");
}

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
      const ageGroup = getAgeGroup(product);
      const colorName = COLOR_NAME_ES[productColorKey(product)];
      const imageUrl = upsizeIfResizable(offer.imageUrl);

      return `  <item>
    <g:id>${escapeXml(product.id)}</g:id>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <g:image_link>${escapeXml(imageUrl)}</g:image_link>
    <g:availability>in stock</g:availability>
    <g:price>${offer.price.toFixed(2)} ${offer.currency}</g:price>
    <g:condition>new</g:condition>
    ${product.brand ? `<g:brand>${escapeXml(product.brand)}</g:brand>` : ""}
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Shirts &amp; Tops</g:google_product_category>
    <g:color>${escapeXml(colorName)}</g:color>
    <g:gender>${GENDER_MAP[ageGroup]}</g:gender>
    <g:age_group>${AGE_GROUP_MAP[ageGroup]}</g:age_group>
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
