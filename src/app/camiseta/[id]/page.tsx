import { notFound } from "next/navigation";
import { findProduct } from "@/data/products";
import JerseyDetailClient from "@/components/JerseyDetailClient";

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
