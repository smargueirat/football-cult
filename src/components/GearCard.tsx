"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { formatOfferMoney } from "@/lib/offerMoney";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc, prefetchDetailPhoto } from "@/lib/images";

// Mismo "chrome" visual que BootCard/ProductCard3D -- guantes y pelotas
// comparten exactamente la misma forma de datos (brand/model/offers con
// store/price/shipping/currency/sizes, siempre EUR, sin groundType), así
// que en vez de duplicar BootCard.tsx dos veces se generaliza acá: un
// solo componente, parametrizado por basePath ("guantes"/"pelotas") para
// el link y sizeLabel para el texto de tallas (glove sizes vs. talla de
// pelota no son lo mismo, cada página pasa el suyo).
interface GearOffer {
  store: string;
  price: number;
  priceMax?: number;
  shipping: number;
  currency: "EUR";
  imageUrl: string;
  sizes: string[];
}
interface GearProductLike {
  id: string;
  brand: string;
  model: string;
  offers: GearOffer[];
}

export default function GearCard({
  item,
  basePath,
  priority = false,
}: {
  item: GearProductLike;
  basePath: "guantes" | "pelotas" | "ropa";
  priority?: boolean;
}) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const favorite = isFavorite(item.id);
  const cheapest = item.offers.reduce((a, b) => (a.price + a.shipping <= b.price + b.shipping ? a : b));
  const sizes = [...new Set(item.offers.flatMap((o) => o.sizes))];
  const sizeRange = sizes.length > 0 ? (sizes.length === 1 ? sizes[0] : `${sizes[0]}–${sizes[sizes.length - 1]}`) : "";
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
      href={`/${basePath}/${item.id}`}
      onMouseEnter={handlePrefetchPhoto}
      onTouchStart={handlePrefetchPhoto}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] shadow-[0_14px_28px_-10px_rgba(43,32,10,0.45)] transition-transform duration-150 ease-out hover:-translate-y-0.5 [content-visibility:auto] [contain-intrinsic-size:auto_300px_auto_420px]"
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
          alt={item.model}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm ${imageLoaded ? "photo-settle-in" : "opacity-0"}`}
        />

        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
          <span className="vintage-plaque rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {item.brand}
          </span>
        </span>

        <div className="shadow-vintage-md absolute bottom-3 right-3 flex flex-col items-end gap-0.5 rounded-2xl border border-[#8a6a1f]/40 bg-gradient-to-br from-[#F3D889] to-[#B8923F] px-3 py-1.5 text-[#2A2410]">
          <span className="text-sm font-semibold">
            {cheapest.priceMax ? `${t.botas.from} ` : ""}
            {formatOfferMoney(cheapest.price + cheapest.shipping, cheapest.currency)}
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
            toggleFavorite(item.id);
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
            toggleCompare(item.id, cheapest.store);
          }}
          disabled={!isComparing(item.id, cheapest.store) && maxReached}
          aria-label={isComparing(item.id, cheapest.store) ? t.compare.remove : t.compare.add}
          title={!isComparing(item.id, cheapest.store) && maxReached ? t.compare.maxReached : undefined}
          className={`shadow-vintage-sm absolute right-2 top-11 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:top-14 sm:h-11 sm:w-11 ${
            isComparing(item.id, cheapest.store)
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
          {item.model}
        </h3>
        <p className="text-[10px] text-[#675c44] sm:text-xs">
          {t.product.inStores.replace("{n}", String(item.offers.length))}
          {sizeRange && (
            <>
              {" "}
              · {sizeRange}
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
