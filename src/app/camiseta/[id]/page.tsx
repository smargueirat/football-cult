import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  bestOffer,
  findProduct,
  teamNames,
  typeNames,
} from "@/data/products";
import JerseyDetailClient from "@/components/JerseyDetailClient";

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

  return <JerseyDetailClient product={product} />;
}
