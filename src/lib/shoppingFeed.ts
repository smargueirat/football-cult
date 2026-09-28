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
import { HUB } from "@/lib/hubStrings";
import type { HubLocale } from "@/data/teamMeta";
import { gtinFor, mpnFor } from "@/lib/offerGtin";

// Mismo bucketeo de color que ya usa el filtro del catálogo (ColorKey),
// solo traducido a texto plano para el feed -- no es un dato nuevo.
//
// En los cinco idiomas desde el 2026-09-28: el feed de Reino Unido mandaba
// <g:color>Celeste</g:color> a un comprador inglés. Describir el producto en
// un idioma que su mercado no habla es, para Merchant Center, un dato malo.
const COLOR_NAME: Record<ColorKey, Record<HubLocale, string>> = {
  black:  { es: "Negro",         en: "Black",      pt: "Preto",         fr: "Noir",        it: "Nero" },
  white:  { es: "Blanco",        en: "White",      pt: "Branco",        fr: "Blanc",       it: "Bianco" },
  gray:   { es: "Gris",          en: "Gray",       pt: "Cinza",         fr: "Gris",        it: "Grigio" },
  red:    { es: "Rojo",          en: "Red",        pt: "Vermelho",      fr: "Rouge",       it: "Rosso" },
  orange: { es: "Naranja",       en: "Orange",     pt: "Laranja",       fr: "Orange",      it: "Arancione" },
  yellow: { es: "Amarillo",      en: "Yellow",     pt: "Amarelo",       fr: "Jaune",       it: "Giallo" },
  green:  { es: "Verde",         en: "Green",      pt: "Verde",         fr: "Vert",        it: "Verde" },
  teal:   { es: "Verde azulado", en: "Teal",       pt: "Verde-azulado", fr: "Sarcelle",    it: "Verde acqua" },
  blue:   { es: "Celeste",       en: "Light Blue", pt: "Azul-claro",    fr: "Bleu clair",  it: "Azzurro" },
  navy:   { es: "Azul marino",   en: "Navy",       pt: "Azul-marinho",  fr: "Bleu marine", it: "Blu navy" },
  purple: { es: "Violeta",       en: "Purple",     pt: "Roxo",          fr: "Violet",      it: "Viola" },
  pink:   { es: "Rosa",          en: "Pink",       pt: "Rosa",          fr: "Rose",        it: "Rosa" },
};

// Dos tiendas distintas sirven LA MISMA foto a través del proxy de Awin, y
// lo único que cambia en la URL es el feedId de cada tienda. Mandarle a
// Google la misma imagen varias veces como si fueran distintas es
// exactamente lo contrario de "más imágenes por producto", así que se
// deduplica por la imagen de destino real (el parámetro url=), no por la
// URL del proxy.
function underlyingImage(u: string): string {
  const m = /[?&]url=([^&]+)/.exec(u);
  const raw = m ? decodeURIComponent(m[1]) : u;
  return raw.split("?")[0].toLowerCase();
}

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
  requireExplicitWorldwide = false,
  locale: HubLocale = "es"
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

      // Estaban cableados en español aunque la función ya recibía el idioma
      // y lo usaba para el link: los feeds de Reino Unido, Estados Unidos y
      // Brasil mandaban título y descripción en español. Mismo fallo que
      // tenía la ficha de camiseta hasta el 2026-09-28 (commit 3ab5b8e), y
      // para Merchant Center es calidad de datos: describir un producto en
      // un idioma que su mercado no habla.
      const team = teamNames[product.teamKey][locale];
      const type = typeNames[product.typeKey][locale];
      const title = `${team} ${type} ${product.season}`;
      const description = HUB[locale].metaJersey({ team, type, season: product.season });
      const link = `${SITE_URL}/${locale}/camiseta/${product.id}`;
      const ageGroup = getAgeGroup(product);
      const colorName = COLOR_NAME[productColorKey(product)][locale];
      const imageUrl = upsizeIfResizable(offer.imageUrl);
      // Fotos ADICIONALES del mismo producto: cada tienda que lo vende trae
      // la suya, y hasta ahora el feed mandaba solo una y tiraba el resto.
      // Merchant Center lo pide explícitamente ("Añade más imágenes por
      // producto") y la spec admite hasta 10.
      //
      // Honestidad de la medida: esto sube el promedio de 1,00 a 1,38 fotos
      // por ficha, NO a las 2,0 que Google pide para que esa métrica llegue
      // a "Aceptable" -- el 77% del catálogo son fichas de una sola tienda y
      // por lo tanto de una sola foto. No hay forma de llegar a 2 sin
      // inventar imágenes, así que no se llega.
      const seenImages = new Set([underlyingImage(imageUrl)]);
      const extraImages: string[] = [];
      for (const o of product.offers) {
        if (extraImages.length >= 6) break;
        if (o.inStock === false || !o.imageUrl) continue;
        const up = upsizeIfResizable(o.imageUrl);
        const key = underlyingImage(up);
        if (seenImages.has(key)) continue;
        seenImages.add(key);
        extraImages.push(up);
      }
      const extraImageTags = extraImages
        .map((u) => `<g:additional_image_link>${escapeXml(u)}</g:additional_image_link>\n    `)
        .join("");
      // Merchant Center flaggeó "falta la talla" en el 100% del catálogo --
      // el feed nunca mandaba <g:size>. Google no exige un item por talla:
      // acepta un solo valor consolidado con "/" en vez de coma (spec
      // oficial), así que se manda el array real de talles de ESTA oferta
      // puntual (ya viene del feed/eBay real, no se inventa nada acá).
      // Identificador del producto. El EAN es de UNA talla concreta, y este
      // artículo agrupa todas las tallas de la oferta ("S/M/L/XL"): mandar el
      // EAN de la M para todo eso es un identificador equivocado (corregido
      // el mismo 2026-09-28 en que se agregó). Lo correcto para un artículo
      // de varias tallas es marca + código del fabricante (MPN), que no
      // depende de la talla. El EAN va solo cuando la oferta es de una talla.
      const gtin = offer.sizes.length === 1 ? gtinFor(offer.url) : undefined;
      const mpn = mpnFor(offer.url);
      const gtinTag =
        [gtin && `<g:gtin>${escapeXml(gtin)}</g:gtin>`, mpn && `<g:mpn>${escapeXml(mpn)}</g:mpn>`]
          .filter(Boolean)
          .join("\n    ") || "<g:identifier_exists>no</g:identifier_exists>";
      const sizeTag =
        offer.sizes.length > 0
          ? `<g:size>${escapeXml(offer.sizes.join("/"))}</g:size>\n    `
          : "";

      return `  <item>
    <g:id>${escapeXml(product.id)}</g:id>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <g:image_link>${escapeXml(imageUrl)}</g:image_link>
    ${extraImageTags}
    <g:availability>in stock</g:availability>
    <g:price>${offer.price.toFixed(2)} ${offer.currency}</g:price>
    <g:condition>new</g:condition>
    ${sizeTag}${product.brand ? `<g:brand>${escapeXml(product.brand)}</g:brand>` : ""}
    ${gtinTag}
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
