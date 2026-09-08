import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Product,
  bestOffer,
  findProduct,
  teamNames,
  typeNames,
} from "@/data/products";
import JerseyDetailClient from "@/components/JerseyDetailClient";
import priceHistoryData from "@/data/priceHistory.json";

const SITE_URL = "https://football-cult.com";

// Product/Offer structured data para Google Shopping / resultados
// enriquecidos -- una oferta por tienda real (nunca AggregateOffer con un
// solo priceCurrency inventado, las tiendas cobran en monedas distintas).
function productJsonLd(product: Product) {
  const team = teamNames[product.teamKey].es;
  const type = typeNames[product.typeKey].es;
  const image = bestOffer(product)?.imageUrl;

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
    url: `${SITE_URL}/camiseta/${product.id}`,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: product.offers.map((o) => ({
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: o.currency,
      availability: o.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: o.store },
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return {};

  const team = teamNames[product.teamKey].es;
  const type = typeNames[product.typeKey].es;
  const title = `${team} ${type} ${product.season} — Comparar precios | Football Cult`;
  const description = `Compará precios de la camiseta ${type.toLowerCase()} de ${team} (${product.season}) entre distintas tiendas y comprá donde te convenga.`;
  const image = bestOffer(product)?.imageUrl;

  return {
    title,
    description,
    alternates: { canonical: `/camiseta/${product.id}` },
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    notFound();
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

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <JerseyDetailClient product={product} priceHistory={priceHistory} />
    </>
  );
}
