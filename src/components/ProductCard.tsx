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

export default function ProductCard({ product }: { product: Product }) {
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
  // Nombre real tal como aparece en la tienda, no un nombre armado por
  // nosotros (equipo + tipo). Se prefiere una oferta cuyo título esté en
  // el idioma elegido en el sitio; si no hay ninguna, se usa el de la
  // oferta más barata. El nombre armado queda solo como respaldo para
  // los pocos casos sin oferta cargada todavía.
  const displayName = displayTitleForCountry(product, countryCode, locale) ?? `${team} ${type}`;
  const photo = best?.imageUrl ?? product.offers.find((o) => o.imageUrl)?.imageUrl;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Si el navegador ya tenía la imagen en caché, puede terminar de
  // cargarla antes de que React llegue a enganchar onLoad -- el evento
  // "load" del <img> nunca llega a dispararse en ese caso y la
  // camiseta queda con el skeleton pegado para siempre. Se chequea
  // `complete` al montar como red de seguridad.
  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, [photo]);

  return (
    <Link
      href={`/camiseta/${product.id}`}
      className="vintage-card group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
    >
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-2.5 sm:p-4 lg:p-6"
        style={{
          background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
        }}
      >
        {photo ? (
          <>
            {!imageLoaded && (
              <JerseySkeleton className="absolute inset-0 h-full w-full" />
            )}
            {/* <img> nativo en vez de next/image: como las fotos ya se
                sirven "unoptimized" (ver lib/images.ts), next/image nunca
                generaba un srcSet real -- todas las pantallas bajaban el
                mismo archivo de 500px, aunque en el grid de 2 columnas del
                celular la tarjeta se ve a ~160-180px. Con srcSet real el
                navegador elige el tamaño que realmente necesita. */}
            <img
              ref={imgRef}
              src={getDisplaySrc(photo, 500)}
              srcSet={`${getDisplaySrc(photo, 260)} 260w, ${getDisplaySrc(photo, 420)} 420w, ${getDisplaySrc(photo, 600)} 600w`}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              alt={displayName}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <JerseyIcon
            className="h-2/3 w-2/3 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            primary={product.colorHex}
            secondary={product.colorHexSecondary}
            pattern={product.jerseyPattern}
          />
        )}

        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
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
          <div className="shadow-vintage-md absolute bottom-3 right-3 flex flex-col items-end gap-0.5 rounded-2xl border border-[#8a6a1f]/40 bg-gradient-to-br from-[#F3D889] to-[#B8923F] px-3 py-1.5 text-[#2A2410]">
            <span className="flex items-center gap-1 text-sm font-semibold">
              <span className="text-xs">🥇</span>
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

      <div className="flex flex-col gap-0.5 px-2 py-1.5 sm:p-4">
        <h3 className="font-card-title text-xs leading-snug text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#1B3B2B] sm:text-lg">
          {displayName}
        </h3>
        {best ? (
          <p className="text-[10px] text-[#675c44] sm:text-xs">
            {t.product.inStores.replace("{n}", String(storeCount))} ·{" "}
            {t.product.sizesRange.replace("{range}", sizeRange)}
          </p>
        ) : (
          <p className="text-[10px] text-[#675c44] sm:text-xs">{t.countryPanel.notAvailable}</p>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          disabled={!comparing && maxReached}
          title={!comparing && maxReached ? t.compare.maxReached : undefined}
          className={`mt-1 flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 sm:mt-1.5 ${
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
