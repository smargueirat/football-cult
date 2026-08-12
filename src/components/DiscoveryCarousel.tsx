"use client";

import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function DiscoveryCarousel({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="mb-3 flex flex-col items-start gap-0.5">
        <span className="font-tagline text-[10px] uppercase text-[#9C7A2E] sm:text-xs">
          {eyebrow}
        </span>
        <h2 className="font-vintage text-base text-[#1B3B2B] sm:text-lg">{title}</h2>
      </div>
      {/* Scroll horizontal nativo (scroll-snap) en vez de un carrusel a
          medida con JS -- más liviano, funciona con swipe táctil gratis,
          y respeta prefers-reduced-motion sin lógica extra. */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
        {products.map((product) => (
          <div key={product.id} className="w-40 shrink-0 snap-start sm:w-48">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
