"use client";

import { useMemo, useRef } from "react";
import { bestOfferForCountry, priceDropPercent, products, productPriceDropped } from "@/data/products";
import { useCountry } from "@/lib/country/CountryContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";

const MAX_SHOWN = 16;
const SCROLL_STEP_PX = 480;

// "Mercado de Pases" -- las camisetas cuya mejor oferta bajó de precio
// desde el snapshot diario anterior (ver track_price_drops.py). Vive
// en la home, fuera de SearchExplorer a propósito: no depende de los
// filtros/búsqueda que el usuario esté usando en el catálogo, siempre
// muestra el mismo destacado.
export default function PriceDropsSection() {
  const { countryCode } = useCountry();
  const { t } = useLanguage();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: "smooth" });
  }

  const drops = useMemo(() => {
    return products
      .filter((p) => productPriceDropped(p, countryCode))
      .sort((a, b) => {
        const bestA = bestOfferForCountry(a, countryCode);
        const bestB = bestOfferForCountry(b, countryCode);
        const dropA = bestA ? priceDropPercent(bestA) : 0;
        const dropB = bestB ? priceDropPercent(bestB) : 0;
        return dropB - dropA;
      })
      .slice(0, MAX_SHOWN);
  }, [countryCode]);

  if (drops.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-3 pt-6 sm:px-6">
      <div className="mb-3 flex flex-col items-start gap-0.5">
        <span className="font-tagline text-[10px] uppercase text-[#9C7A2E] sm:text-xs">
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
