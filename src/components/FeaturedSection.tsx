"use client";

import { findProduct } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";

// Selección curada a mano (no la más cara ni la más barata, sino
// piezas reconocibles con buena foto) para romper la grilla uniforme
// con una tarjeta grande + 4 chicas, en vez de que todo se vea del
// mismo tamaño de punta a punta.
const FEATURED_IDS = [
  "boca-home-2025",
  "rma-home-2025",
  "manutd-retro-1999-home",
  "napoli-home-202526",
  "psg-away-202526",
];

export default function FeaturedSection() {
  const { t } = useLanguage();
  const featured = FEATURED_IDS.map((id) => findProduct(id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  if (featured.length === 0) return null;

  const [hero, ...rest] = featured;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-10">
      <div className="mb-4 flex flex-col items-start gap-0.5">
        <span className="font-tagline text-[10px] uppercase text-[#9C7A2E] sm:text-xs">
          {t.featured.eyebrow}
        </span>
        <h2 className="font-vintage text-lg text-[#1B3B2B] sm:text-xl">
          {t.featured.title}
        </h2>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
        {/* Tarjeta grande: mismo componente, pero el doble de ancho (y por
            lo tanto más alta, gracias al aspect-ratio fijo de la foto) que
            las 4 de la derecha -- así el grid deja de verse uniforme sin
            depender de row-span de CSS Grid con alturas que no podemos
            verificar visualmente en este entorno. */}
        <div className="sm:w-1/2">
          <ProductCard product={hero} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-1/2 sm:gap-5">
          {rest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
