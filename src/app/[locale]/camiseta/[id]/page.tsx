import { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Product, findProduct, products, teamNames } from "@/data/products";
import { productImage } from "@/lib/productPhoto";
import JerseyDetailClient from "@/components/JerseyDetailClient";
import JerseyFaq from "@/components/JerseyFaq";
import priceHistoryData from "@/data/priceHistory.json";
import { archiveStatsFor } from "@/lib/priceArchive";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { productMpn } from "@/lib/offerGtin";
import type { HubLocale } from "@/data/teamMeta";
import { offerTotalInEUR } from "@/lib/offerMoney";
import { OG_LOCALE, SITE_URL, aggregateOfferLd, jerseyBrand, jerseyDescription, jerseyName, jerseyTitle, ldImage, ogImages } from "@/lib/seoMeta";
import { jerseyRelated, jerseyTrail } from "@/lib/detailLinks";
import { DetailCrumbs, RelatedLinks } from "@/components/DetailNav";

import { countDistinctRetailers } from "@/lib/retailerFamily";

// Product/Offer structured data para Google Shopping / resultados
// enriquecidos. Nombre, marca, imagen y AggregateOffer de una sola moneda
// salen de seoMeta.ts (revisión 2026-10-09: "other" como marca en el 19 %,
// monedas mezcladas en el 73 %, fotos de 200x200).
//
// Real bug found (Search Console, 2026-09-08): cuando TODAS las ofertas
// están agotadas Google sigue exigiendo "offers": se declaran todas con su
// disponibilidad real, sin inventar stock.
function productJsonLd(product: Product, locale: HubLocale) {
  const url = `${SITE_URL}/${locale}/camiseta/${product.id}`;
  const image = ldImage(productImage(product));
  const brand = jerseyBrand(product);
  const mpn = productMpn(product.offers);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: jerseyName(product, locale),
    image: image ? [image.url] : undefined,
    url,
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    // Código del fabricante: con marca + mpn Google puede identificar el
    // producto exacto. No se manda el EAN porque es de UNA talla y esta
    // ficha agrupa todas (ver offerGtin.ts).
    ...(mpn ? { mpn } : {}),
    offers: aggregateOfferLd(product.offers, url, offerTotalInEUR),
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

  // Título/descripción por idioma, únicos en todo el catálogo y con lo que
  // se busca ("Camiseta Real Madrid primera equipación 2026/27"), ver
  // seoMeta.ts y scripts/check_seo_titles.mts.
  const title = jerseyTitle(product, locale);
  const description = jerseyDescription(product, locale);
  const images = ogImages(productImage(product));

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/camiseta/${product.id}`),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/camiseta/${product.id}`,
      siteName: "Football Cult",
      locale: OG_LOCALE[locale],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images?.map((i) => i.url),
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
    // Ficha retirada (o sin ofertas hoy): al hub de su equipo en vez de un
    // 404. Temporal si la ficha existe (puede volver a tener ofertas),
    // permanente si el id ya no está en el catálogo.
    const teamKey = (product?.teamKey ?? id.split("-")[0]) as keyof typeof teamNames;
    if (teamNames[teamKey] && products.some((p) => p.teamKey === teamKey && p.offers.length)) {
      (product ? redirect : permanentRedirect)(`/${locale}/equipo/${teamKey}`);
    }
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
      <DetailCrumbs locale={locale} trail={jerseyTrail(product, locale)} current={`/camiseta/${product.id}`} />
      <JerseyDetailClient
        product={product}
        priceHistory={priceHistory}
        sameTeamProducts={sameTeamProducts}
        archiveStats={archiveStatsFor(product.offers.map((o) => o.url))}
        manufacturerCode={productMpn(product.offers)}
      />
      <JerseyFaq product={product} locale={locale} />
      <RelatedLinks related={jerseyRelated(product, locale)} />
    </>
  );
}
