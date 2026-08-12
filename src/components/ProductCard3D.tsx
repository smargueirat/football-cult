"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Product,
  SIZES,
  availableSizesForCountry,
  bestOfferForCountry,
  displayTitleForCountry,
  formatOfferMoney,
  getAgeGroup,
  offerShipsTo,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCountry } from "@/lib/country/CountryContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc } from "@/lib/images";
import JerseyIcon from "./JerseyIcon";
import JerseySkeleton from "./JerseySkeleton";

const MAX_TILT_DEG = 9;

// Variante experimental: misma tarjeta de siempre, pero con inclinación
// 3D real que sigue al mouse (rotateX/rotateY calculados según dónde
// está el cursor sobre la tarjeta) en vez de un brillo/luz sobre la
// foto -- exactamente lo que se pidió sacar en la versión anterior.
// Nada de esto se mueve si el usuario prefiere movimiento reducido.
export default function ProductCard3D({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const { countryCode } = useCountry();
  const comparing = isComparing(product.id);
  const favorite = isFavorite(product.id);
  const best = bestOfferForCountry(product, countryCode);
  const storeCount = product.offers.filter(
    (o) => o.inStock && offerShipsTo(o.store, countryCode)
  ).length;
  const sizes = availableSizesForCountry(product, countryCode);
  const sizeRange =
    sizes.length > 0
      ? sizes[0] === sizes[sizes.length - 1]
        ? sizes[0]
        : `${sizes[0]}–${sizes[sizes.length - 1]}`
      : SIZES[0];
  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];
  const ageGroup = getAgeGroup(product);
  const isKids = ageGroup === "kids";
  const isWomen = ageGroup === "women";
  const displayName = displayTitleForCountry(product, countryCode, locale) ?? `${team} ${type}`;
  const photo = best?.imageUrl ?? product.offers.find((o) => o.imageUrl)?.imageUrl;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, [photo]);

  const cardRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useRef(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [tilting, setTilting] = useState(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reducedMotion.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * MAX_TILT_DEG, y: px * MAX_TILT_DEG });
    setTilting(true);
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setTilting(false);
  }

  return (
    <Link
      ref={cardRef}
      href={`/camiseta/${product.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
          tilting ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
        }`,
        transformStyle: "preserve-3d",
        boxShadow: tilting
          ? `${-tilt.y * 1.8}px ${18 - tilt.x * 1.2}px 32px -14px rgba(43, 32, 10, 0.45), ${-tilt.y * 0.6}px ${6 - tilt.x * 0.4}px 10px -6px rgba(43, 32, 10, 0.3)`
          : "0 10px 24px -14px rgba(43, 32, 10, 0.35)",
      }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] transition-[transform,box-shadow] duration-150 ease-out will-change-transform"
    >
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-6"
        style={{
          background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
        }}
      >
        {photo ? (
          <>
            {!imageLoaded && (
              <JerseySkeleton className="absolute inset-0 h-full w-full" />
            )}
            <img
              ref={imgRef}
              src={getDisplaySrc(photo, 500)}
              srcSet={`${getDisplaySrc(photo, 260)} 260w, ${getDisplaySrc(photo, 420)} 420w, ${getDisplaySrc(photo, 600)} 600w`}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              alt={displayName}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ transform: "translateZ(24px)" }}
            />
          </>
        ) : (
          <JerseyIcon
            className="h-2/3 w-2/3 drop-shadow-sm"
            primary={product.colorHex}
            secondary={product.colorHexSecondary}
            pattern={product.jerseyPattern}
          />
        )}

        <span
          className="absolute left-3 top-3 flex flex-col items-start gap-1"
          style={{ transform: "translateZ(36px)" }}
        >
          <span className="vintage-plaque rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {product.season}
          </span>
          {isKids && (
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-vintage-sm" style={{ backgroundColor: "#1F6F4C" }}>
              {t.search.ageGroupKids}
            </span>
          )}
          {isWomen && (
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-vintage-sm" style={{ backgroundColor: "#DB2777" }}>
              {t.search.ageGroupWomen}
            </span>
          )}
        </span>

        {best && (
          <div
            className="shadow-vintage-md absolute bottom-3 right-3 flex flex-col items-end gap-0.5 rounded-2xl border border-[#8a6a1f]/40 bg-gradient-to-br from-[#F3D889] to-[#B8923F] px-3 py-1.5 text-[#2A2410]"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="text-sm font-semibold">
              {formatOfferMoney(offerTotal(best), best.currency)}
            </span>
            {best.shipping > 0 && (
              <span className="text-[9px] font-medium uppercase leading-none opacity-70">
                {t.product.shippingIncluded}
              </span>
            )}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={t.nav.favorites}
          style={{ transform: "translateZ(40px)" }}
          className="shadow-vintage-sm absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#B45309] backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
        >
          <svg
            className="h-4 w-4"
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
      </div>

      <div className="vintage-divider" />

      <div className="flex flex-col gap-0.5 p-3 sm:p-4">
        <h3 className="font-card-title text-base leading-snug text-[#1a1a1a] sm:text-lg">
          {displayName}
        </h3>
        {best ? (
          <p className="text-xs text-[#675c44]">
            {t.product.inStores.replace("{n}", String(storeCount))} ·{" "}
            {t.product.sizesRange.replace("{range}", sizeRange)}
          </p>
        ) : (
          <p className="text-xs text-[#675c44]">{t.countryPanel.notAvailable}</p>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          disabled={!comparing && maxReached}
          title={!comparing && maxReached ? t.compare.maxReached : undefined}
          className={`mt-1.5 flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            comparing
              ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
              : "border-[#C9A24B]/30 text-[#675c44] hover:border-[#1B3B2B]/40 hover:bg-[#1B3B2B]/5"
          }`}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          {t.compare.add}
        </button>
      </div>
    </Link>
  );
}
