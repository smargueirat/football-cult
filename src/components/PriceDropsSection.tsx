"use client";

import { useMemo, useRef } from "react";
// Tipos solamente (se borran al compilar, no arrastran products.ts al
// cliente) -- la lista real de "en baja" por país llega YA CALCULADA
// como prop desde el server component (page.tsx). Antes este componente
// importaba `products`/bestOfferForCountry/etc. en vivo, lo que arrastraba
// el catálogo completo (5.9MB/76 mil líneas) al cliente para una cuenta
// que un server component puede hacer una sola vez en el build -- mismo
// bug documentado en src/lib/offerMoney.ts.
import type { CountryCode, Product } from "@/data/products";
import { useCountry } from "@/lib/country/CountryContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";

const SCROLL_STEP_PX = 480;

interface PriceDropsSectionProps {
  // Pool deduplicado de productos que aparecen en la lista de ALGÚN país
  // (un mismo producto suele bajar de precio para varios países a la
  // vez), más los ids en orden ya para el país actual -- así el payload
  // no repite el mismo Product completo una vez por país.
  dropProducts: Product[];
  dropIdsByCountry: Partial<Record<CountryCode, string[]>>;
}

// "Mercado de Pases" -- las camisetas cuya mejor oferta bajó de precio
// desde el snapshot diario anterior (ver src/lib/priceDrops.ts). Vive
// en la home, fuera de SearchExplorer a propósito: no depende de los
// filtros/búsqueda que el usuario esté usando en el catálogo, siempre
// muestra el mismo destacado.
export default function PriceDropsSection({ dropProducts, dropIdsByCountry }: PriceDropsSectionProps) {
  const { countryCode } = useCountry();
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: "smooth" });
  }

  const drops = useMemo(() => {
    const byId = new Map(dropProducts.map((p) => [p.id, p]));
    const ids = dropIdsByCountry[countryCode] ?? [];
    return ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
  }, [dropProducts, dropIdsByCountry, countryCode]);

  if (drops.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1800px] px-4 pt-6 sm:px-8">
      <div className="mb-3 flex flex-col items-start gap-0.5">
        <span className="font-tagline text-[10px] uppercase text-[#7A5B1E] sm:text-xs">
          {t.priceDrop.eyebrow}
        </span>
        <h2 className="font-vintage text-lg text-[#1B3B2B] sm:text-2xl">{t.priceDrop.title}</h2>
      </div>
      <div className="relative">
        {/* Mismo scroll horizontal nativo y misma card liviana que
            DiscoveryCarousel -- ProductCard3D (tilt 3D por mousemove,
            translateZ en cada capa, will-change:transform) se ve lindo en
            el grid estático del catálogo, pero acá son varias cards
            juntas en un carrusel horizontal: con esa versión se sentía
            pesado/tironeado al scrollear, sobre todo en celular. */}
        <div
          ref={scrollerRef}
          className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:gap-4 sm:px-0"
        >
          {drops.map((product) => (
            <div key={product.id} className="w-40 shrink-0 snap-start sm:w-56">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Flechas solo desde sm+: en celular el swipe táctil ya alcanza,
            pero en desktop sin trackpad (mouse común) no hay forma de
            mover este scroll horizontal sin esto. */}
        {drops.length > 3 && (
          <>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Ver anteriores"
              className="shadow-vintage-sm absolute left-1 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A24B]/35 bg-white/90 p-2 text-[#1B3B2B] backdrop-blur-md transition-transform hover:scale-110 active:scale-95 sm:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Ver siguientes"
              className="shadow-vintage-sm absolute right-1 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A24B]/35 bg-white/90 p-2 text-[#1B3B2B] backdrop-blur-md transition-transform hover:scale-110 active:scale-95 sm:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
