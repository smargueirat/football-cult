"use client";

import Link from "next/link";
import {
  Product,
  SIZES,
  availableSizesForCountry,
  bestOfferForCountry,
  formatOfferMoney,
  offerShipsTo,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCountry } from "@/lib/country/CountryContext";
import JerseyIcon from "./JerseyIcon";

export default function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { countryCode } = useCountry();
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
  const photo = product.offers.find((o) => o.imageUrl)?.imageUrl;

  return (
    <Link
      href={`/camiseta/${product.id}`}
      className="vintage-card group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-6"
        style={{
          background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={`${team} ${type} ${product.season}`}
            className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <JerseyIcon
            className="h-2/3 w-2/3 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            primary={product.colorHex}
            secondary={product.colorHexSecondary}
            pattern={product.jerseyPattern}
          />
        )}

        <span className="vintage-plaque absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          {product.season}
        </span>

        {best && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-[#8a6a1f]/40 bg-gradient-to-br from-[#F3D889] to-[#B8923F] px-3 py-1.5 text-sm font-semibold text-[#2A2410] shadow-md">
            <span className="text-xs">🥇</span>
            {formatOfferMoney(offerTotal(best), best.currency)}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={t.nav.favorites}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#B45309] shadow-sm backdrop-blur-md transition-transform hover:scale-110"
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
          {team} {type}
        </h3>
        {best ? (
          <p className="text-xs text-[#8a7a5a]">
            {t.product.inStores.replace("{n}", String(storeCount))} ·{" "}
            {t.product.sizesRange.replace("{range}", sizeRange)}
          </p>
        ) : (
          <p className="text-xs text-[#8a7a5a]">{t.countryPanel.notAvailable}</p>
        )}
      </div>
    </Link>
  );
}
