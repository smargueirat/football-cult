"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { BootProduct } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc, prefetchDetailPhoto } from "@/lib/images";

// Mismo "chrome" visual que ProductCard3D (misma tarjeta, mismo badge de
// arriba a la izquierda, mismo precio abajo a la derecha, misma línea de
// info debajo, mismos botones de favorito/comparar) -- pedido explícito
// del usuario, dos veces: primero que las tarjetas se vean iguales,
// después que favoritos/comparar tengan "el mismo comportamiento" que
// las camisetas. FavoritesContext/CompareContext ya eran genéricos (solo
// guardan ids de string, sin asumir nada de camisetas) así que se
// reusan tal cual -- lo que hacía falta era resolver esos ids también
// contra bootProducts en los lugares donde se muestran (panel de
// favoritos, /favoritos, barra de comparar, /comparar), no acá.
export default function BootCard({ boot, priority = false }: { boot: BootProduct; priority?: boolean }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const favorite = isFavorite(boot.id);
  const cheapest = boot.offers.reduce((a, b) => (a.price + a.shipping <= b.price + b.shipping ? a : b));
  const sizes = [...new Set(boot.offers.flatMap((o) => o.sizes))].sort((a, b) => parseFloat(a) - parseFloat(b));
  const sizeRange = sizes.length > 0 ? (sizes[0] === sizes[sizes.length - 1] ? sizes[0] : `${sizes[0]}–${sizes[sizes.length - 1]}`) : "";
  const photo = cheapest.imageUrl;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, [photo]);

  const prefetched = useRef(false);
  function handlePrefetchPhoto() {
    if (prefetched.current) return;
    prefetched.current = true;
    prefetchDetailPhoto(photo);
  }

  return (
    <Link
      href={`/botas/${boot.id}`}
      onMouseEnter={handlePrefetchPhoto}
      onTouchStart={handlePrefetchPhoto}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] shadow-[0_14px_28px_-10px_rgba(43,32,10,0.45)] transition-transform duration-150 ease-out hover:-translate-y-0.5"
    >
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-2.5 sm:p-4 lg:p-6"
        style={{ background: "linear-gradient(135deg, #fffdf8, #C9A24B22, #1B3B2B11)" }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 h-full w-full animate-pulse bg-[#C9A24B]/10" />
        )}
        <img
          ref={imgRef}
          src={getDisplaySrc(photo, 500)}
          srcSet={`${getDisplaySrc(photo, 260)} 260w, ${getDisplaySrc(photo, 420)} 420w, ${getDisplaySrc(photo, 600)} 600w`}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          alt={boot.model}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm ${imageLoaded ? "photo-settle-in" : "opacity-0"}`}
        />

        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
          <span className="vintage-plaque rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {boot.brand}
          </span>
        </span>

        <div className="shadow-vintage-md absolute bottom-3 right-3 flex flex-col items-end gap-0.5 rounded-2xl border border-[#8a6a1f]/40 bg-gradient-to-br from-[#F3D889] to-[#B8923F] px-3 py-1.5 text-[#2A2410]">
          <span className="text-sm font-semibold">
            {formatOfferMoney(cheapest.price + cheapest.shipping, "EUR")}
          </span>
          {cheapest.shipping > 0 && (
            <span className="text-[9px] font-medium uppercase leading-none opacity-70">
              {t.product.shippingIncluded}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(boot.id);
          }}
          aria-label={t.nav.favorites}
          className="shadow-vintage-sm absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#B45309] backdrop-blur-md transition-transform hover:scale-110 active:scale-90 sm:h-11 sm:w-11"
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            viewBox="0 0 24 24"
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(boot.id, cheapest.store);
          }}
          disabled={!isComparing(boot.id, cheapest.store) && maxReached}
          aria-label={isComparing(boot.id, cheapest.store) ? t.compare.remove : t.compare.add}
          title={!isComparing(boot.id, cheapest.store) && maxReached ? t.compare.maxReached : undefined}
          className={`shadow-vintage-sm absolute right-2 top-11 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:top-14 sm:h-11 sm:w-11 ${
            isComparing(boot.id, cheapest.store)
              ? "bg-[#1B3B2B] text-[#F3E9C9]"
              : "bg-white/80 text-[#1B3B2B]"
          }`}
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
        </button>
      </div>

      <div className="vintage-divider" />

      <div className="flex flex-col gap-0.5 px-2 py-1.5 sm:p-4">
        <h3 className="font-card-title text-xs leading-snug text-[#1a1a1a] sm:text-lg">
          {boot.model}
        </h3>
        <p className="text-[10px] text-[#675c44] sm:text-xs">
          {t.product.inStores.replace("{n}", String(boot.offers.length))} ·{" "}
          {t.product.sizesRange.replace("{range}", sizeRange)}
        </p>
      </div>
    </Link>
  );
}
