import {
  CountryCode,
  getAgeGroup,
  Offer,
  offerShipsTo,
  products,
  storeShipping,
  teamNames,
  typeNames,
} from "@/data/products";
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

// Un solo feed.xml con "la oferta más barata de cualquier tienda, en
// cualquier moneda" rompe Merchant Center apenas se lo apunta a más de un
// país: cada producto tiene UN precio en UNA moneda, pero un data source
// puede targetear varios países a la vez, y Google exige que la moneda
// del precio (y de los gastos de envío) coincida con la del país al que
// se muestra. Por eso cada feed de este archivo es específico de UN país
// (o de un grupo de países que comparten moneda Y para el que se usa un
// país representativo para chequear elegibilidad real de envío, igual
// que ya se hace para el costo de envío mostrado en Merchant Center) y
// SOLO incluye productos que de verdad tienen una oferta en esa moneda
// que además envía a ese país (offerShipsTo, ya verificado a mano por
// tienda en storeShipping). Un producto sin ninguna oferta que cumpla
// ambas condiciones simplemente no aparece en ese feed -- nunca se
// fabrica un precio convertido ni se asume envío que no está verificado.
function bestOfferForCurrencyAndCountry(
  offers: Offer[],
  currency: Offer["currency"],
  country: CountryCode,
  requireExplicitWorldwide: boolean
): Offer | undefined {
  return offers
    .filter((o) => {
      if (!o.inStock || o.currency !== currency) return false;
      // Para países donde ninguna tienda tiene envío verificado (hoy,
      // Uruguay), no alcanza con el default genérico de offerShipsTo
      // ("no está en el mapa -> asumimos que envía a todos lados") --
      // eso es una suposición, no un hecho verificado, y ya se dejó
      // afuera a propósito de la política de envío de Merchant Center
      // configurada a mano (solo tiendas con "all" EXPLÍCITO en
      // storeShipping, ej. FansJerseyHub). Este flag replica ese mismo
      // criterio acá en vez de caer al fallback más permisivo.
      if (requireExplicitWorldwide) return storeShipping[o.store] === "all";
      return offerShipsTo(o.store, country);
    })
    .sort((a, b) => a.price + a.shipping - (b.price + b.shipping))[0];
}

export function buildShoppingFeedXml(
  currency: Offer["currency"],
  country: CountryCode,
  requireExplicitWorldwide = false
): string {
  const items = products
    .map((product) => {
      const offer = bestOfferForCurrencyAndCountry(
        product.offers,
        currency,
        country,
        requireExplicitWorldwide
      );
      // Sin oferta real en esta moneda que además envíe a este país, el
      // producto no tiene nada honesto para mostrarle a este mercado.
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Football Cult</title>
  <link>${SITE_URL}</link>
  <description>Comparador de precios de camisetas de fútbol</description>
${items}
</channel>
</rss>
`;
}
