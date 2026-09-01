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
  const inStockOffers = product.offers.filter((o) => o.inStock);
  const image = bestOffer(product)?.imageUrl;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${team} ${type} ${product.season}`,
    image: image ? [image] : undefined,
    url: `${SITE_URL}/camiseta/${product.id}`,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: inStockOffers.length
      ? inStockOffers.map((o) => ({
          "@type": "Offer",
          url: o.url,
          price: o.price,
          priceCurrency: o.currency,
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: o.store },
        }))
      : undefined,
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
