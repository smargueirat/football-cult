import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  Product,
  findProduct,
  kitTypeName,
  products,
  teamNames,
} from "@/data/products";
import { productImage } from "@/lib/productPhoto";
import JerseyDetailClient from "@/components/JerseyDetailClient";
import JerseyFaq from "@/components/JerseyFaq";
import priceHistoryData from "@/data/priceHistory.json";
import { archiveStatsFor } from "@/lib/priceArchive";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { HUB } from "@/lib/hubStrings";
import { TITLE_SUFFIX, ageGroupLabel } from "@/lib/categoryMeta";
import { productMpn } from "@/lib/offerGtin";
import { HubBacklinks } from "@/components/hubs/HubLinkParts";
import { EXTRA } from "@/lib/extraHubStrings";
import { decadeOf, retroDecadeFacets, retroTeamFacets } from "@/lib/extraHubs";
import { isVintageRetro, teamCategory } from "@/lib/productMeta";
import type { HubLocale } from "@/data/teamMeta";

import { countDistinctRetailers } from "@/lib/retailerFamily";
const SITE_URL = "https://football-cult.com";

// Product/Offer structured data para Google Shopping / resultados
// enriquecidos -- una oferta por tienda real (nunca AggregateOffer con un
// solo priceCurrency inventado, las tiendas cobran en monedas distintas).
// Camiseta retro (temporada <= 2006) -> sus hubs retro de equipo y de
// década, solo si existen hoy.
function retroHubLinks(product: Product, locale: HubLocale) {
  if (!isVintageRetro(product)) return [];
  const x = EXTRA[locale];
  const d = decadeOf(product.season);
  const out: { href: string; label: string }[] = [];
  if (retroTeamFacets().some((f) => f.team === product.teamKey))
    out.push({ href: `/${locale}/retro/${product.teamKey}`, label: x.retroTeamH1(teamNames[product.teamKey][locale], teamCategory[product.teamKey] === "national") });
  if (retroDecadeFacets().some((f) => f.decade === d)) out.push({ href: `/${locale}/retro/decada/${d}`, label: x.retroDecadeH1(d) });
  return out;
}

function productJsonLd(product: Product, locale: HubLocale) {
  // Estaba cableado en español para los cinco idiomas: el nombre del
  // producto que ve Google era el mismo en /fr/ que en /es/.
  const team = teamNames[product.teamKey][locale];
  const age = ageGroupLabel(locale, product.ageGroup);
  // Para las fichas retro esto lee además la equipación del id: si no,
  // las seis variantes de un mismo equipo/temporada salen con el mismo
  // título (ver kitTypeName en src/lib/productMeta.ts).
  const kit = kitTypeName(product, locale);
  const type = age ? `${kit} ${age}` : kit;
  const image = productImage(product);

  // Real bug found (Search Console, 2026-09-08): cuando TODAS las ofertas
  // de un producto están agotadas, esto antes omitía "offers" del todo --
  // Google exige que un Product declare "offers", "review" o
  // "aggregateRating" (ninguno de los otros dos existe acá), así que esas
  // páginas quedaban con datos estructurados inválidos. Se listan todas
  // las ofertas reales (no solo las in-stock) marcando la disponibilidad
  // real de cada una -- sigue siendo precio/tienda genuinos, no inventa
  // stock que no existe.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${team} ${type} ${product.season}`,
    image: image ? [image] : undefined,
    url: `${SITE_URL}/${locale}/camiseta/${product.id}`,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    // Código del fabricante: con marca + mpn Google puede identificar el
    // producto exacto, que es lo que un comparador quiere. No se manda el EAN
    // porque es de UNA talla y esta ficha agrupa todas (ver offerGtin.ts).
    ...(productMpn(product.offers) ? { mpn: productMpn(product.offers) } : {}),
    offers: aggregateOffer(product.offers),
  };
}

// AggregateOffer envolviendo las ofertas individuales, no en lugar de
// ellas: es el marcado que Google pide para una página que compara varias
// tiendas, y es lo que habilita el resultado enriquecido con rango de
// precios ("desde 39,99 EUR"). Se sigue listando cada Offer real con su
// tienda y su disponibilidad -- nunca un precio único inventado, que era
// el motivo por el que esto no se había puesto antes.
//
// lowPrice/highPrice se calculan SOLO sobre la moneda mayoritaria: mezclar
// EUR con USD en un mismo rango daría un número sin sentido, y priceCurrency
// admite una sola moneda.
function aggregateOffer(offers: Product["offers"]) {
  const byCurrency = new Map<string, Product["offers"]>();
  // El rango ("desde X") sale solo de lo que se puede comprar; las agotadas
  // siguen listadas abajo como OutOfStock. Si no queda ninguna, todas.
  const live = offers.filter((o) => o.inStock);
  for (const o of live.length > 0 ? live : offers) {
    const list = byCurrency.get(o.currency) ?? [];
    list.push(o);
    byCurrency.set(o.currency, list);
  }
  const [currency, main] = [...byCurrency.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  )[0];

  const individual = offers.map((o) => ({
    "@type": "Offer",
    url: o.url,
    price: o.price,
    priceCurrency: o.currency,
    availability: o.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: o.store },
  }));

  const totals = main.map((o) => o.price);
  return {
    "@type": "AggregateOffer",
    priceCurrency: currency,
    lowPrice: Math.min(...totals),
    highPrice: Math.max(...totals),
    offerCount: offers.length,
    offers: individual,
  };
}

// ISR (2026-09-20): sin generateStaticParams estas páginas eran ƒ
// (cache-control no-store): cada visita de un usuario o de Googlebot
// ejecutaba una función que carga el catálogo entero -- la causa más
// probable de que la cuenta Hobby llegara al 100% de Fluid Active CPU.
//
// 2026-09-24: se probó prerenderizar en build las fichas con 2+ tiendas
// (1.831 x 5 idiomas) para sacarlas de la generación bajo demanda, que es
// lo que hace de `camiseta/[id]` la ruta más invocada del sitio. Funciona
// -- 9.255 páginas estáticas, build de 1:09 a 1:51 -- pero deja el .next
// en 3,2 GB (93 KB de HTML por ficha). Con el límite de 10 GB de
// Deployment Storage en Hobby y una retención de una semana eso revienta
// la cuenta en dos deploys, y de ese agujero recién salimos el 09-23.
// O sea: prerenderizar cambia CPU por storage, y storage es el límite más
// ajustado. Se vuelve a [] a propósito. Si algún día hay plan Pro (o el
// HTML por ficha adelgaza mucho), esto es lo primero que conviene probar.
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const product = findProduct(id);
  if (!product) return {};

  // El <title> y la descripción estaban cableados en español para los
  // cinco idiomas. Son 6.651 fichas x 5 idiomas con el MISMO título, que
  // es justo lo que hace que Google marque una página como duplicada de
  // otra (lo reportó: los 47 ejemplos de "Duplicada" eran páginas /en/).
  const team = teamNames[product.teamKey][locale];
  // La ficha de mujer y la de niños comparten equipo/tipo/temporada con la de
  // adulto: sin el sufijo salían con el mismo título y la misma descripción.
  const age = ageGroupLabel(locale, product.ageGroup);
  // Para las fichas retro esto lee además la equipación del id: si no,
  // las seis variantes de un mismo equipo/temporada salen con el mismo
  // título (ver kitTypeName en src/lib/productMeta.ts).
  const kit = kitTypeName(product, locale);
  const type = age ? `${kit} ${age}` : kit;
  const title = `${team} ${type} ${product.season} — ${TITLE_SUFFIX[locale]} | Football Cult`;
  const description = HUB[locale].metaJersey({ team, type, season: product.season });
  const image = productImage(product);

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/camiseta/${product.id}`),
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function JerseyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const product = findProduct(id);

  // Sin ofertas no hay nada que comparar (y aggregateOffer no tiene moneda
  // que elegir): 404 en vez del 500 que daba antes.
  if (!product?.offers.length) {
    notFound();
  }

  // Un id viejo (renombrado o fusionado, ver productAliases.ts) redirige al
  // actual con un 308 en vez de servir la misma página en otra URL. Antes
  // findProduct resolvía el alias y la ficha se mostraba igual en las dos
  // direcciones: contenido duplicado para Google, con 3.744 alias en la lista.
  if (product.id !== id) {
    permanentRedirect(`/${locale}/camiseta/${product.id}`);
  }

  // Solo se manda al cliente la porción de historial que corresponde a
  // las ofertas de ESTE producto -- el JSON completo tiene una entrada
  // por cada una de las ~8400 ofertas del catálogo.
  const priceHistory: Record<string, { date: string; price: number }[]> = {};
  for (const offer of product.offers) {
    const entries = (priceHistoryData as Record<string, { date: string; price: number }[]>)[
      offer.url
    ];
    if (entries) priceHistory[offer.url] = entries;
  }

  // Calculado acá (server, con el array completo -- no cuesta nada de
  // bundle del lado del cliente) y no en JerseyDetailClient.tsx como
  // antes: ese componente importaba `products` directo, y por el mismo
  // bug de bundling ya documentado para botas (ver src/lib/offerMoney.ts)
  // eso arrastraba el catálogo entero de camisetas a esta página aunque
  // solo se necesitara UN producto. "Mismo talle" (que depende de una
  // talla elegida en vivo por el usuario DESPUÉS de cargar la página,
  // más el país detectado en el navegador) no se puede precalcular acá
  // de la misma forma -- ver el fetch a /api/related-by-size en
  // JerseyDetailClient.tsx.
  // Se priorizan las que SÍ comparan varias tiendas. En una ficha de una
  // sola oferta -- el 77% del catálogo son listados sueltos de eBay, que
  // por naturaleza no se comparan con nada -- este carrusel es el único
  // puente hacia una página donde el sitio hace lo que promete. Antes
  // salían en el orden del catálogo, así que podía llevar de una ficha
  // pobre a otra igual de pobre (auditoría 2026-09-24).
  // Y se cuentan solo las tiendas con stock: ordenar por el total de
  // ofertas ponía primero una ficha con tres ofertas agotadas antes que una
  // con una sola oferta viva, o sea recomendaba algo que no se puede
  // comprar. Pasaba en 94 fichas, y en 77 de ellas había una alternativa
  // viva disponible para poner en su lugar (medido 2026-09-28).
  const liveStores = (p: Product) =>
    countDistinctRetailers(p.offers.filter((o) => o.inStock !== false));
  const sameTeamProducts = products
    .filter((p) => p.id !== product.id && p.teamKey === product.teamKey)
    .sort(
      (a, b) =>
        liveStores(b) - liveStores(a) ||
        countDistinctRetailers(b.offers) - countDistinctRetailers(a.offers),
    )
    .slice(0, 10);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, locale)) }}
      />
      <JerseyDetailClient
        product={product}
        priceHistory={priceHistory}
        sameTeamProducts={sameTeamProducts}
        archiveStats={archiveStatsFor(product.offers.map((o) => o.url))}
        manufacturerCode={productMpn(product.offers)}
      />
      <JerseyFaq product={product} locale={locale} />
      <HubBacklinks label={EXTRA[locale].explore} items={retroHubLinks(product, locale)} />
    </>
  );
}
