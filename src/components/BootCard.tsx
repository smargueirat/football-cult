"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { BootProduct } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDisplaySrc, prefetchDetailPhoto } from "@/lib/images";

// Mismo "chrome" visual que ProductCard3D (misma tarjeta, mismo badge de
// arriba a la izquierda, mismo precio abajo a la derecha, misma línea de
// info debajo) -- pedido explícito del usuario después de ver que las
// tarjetas de botas se veían distintas al resto. No tiene favoritos ni
// comparador todavía: esos sistemas están armados solo para camisetas
// (FavoritosClient/CompareContext resuelven contra products.ts), sumar
// botas ahí es un cambio más grande que "que las tarjetas se vean
// iguales" -- se deja afuera de esta pasada.
export default function BootCard({ boot, priority = false }: { boot: BootProduct; priority?: boolean }) {
  const { t } = useLanguage();
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
