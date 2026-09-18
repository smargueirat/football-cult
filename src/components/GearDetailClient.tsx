"use client";

import Link from "@/lib/i18n/LocaleLink";
import Image from "next/image";
import { useState } from "react";
import { formatOfferMoney } from "@/lib/offerMoney";
import { trackOfferClick } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc } from "@/lib/images";

// Mismo patrón que BootDetailClient.tsx (foto grande + selector de
// oferta + selector de talla real por oferta), generalizado para
// guantes Y pelotas -- misma forma de datos exacta, sin groundType (no
// aplica a ninguno de los dos), así que un solo componente alcanza en
// vez de mantener dos copias casi idénticas.
interface GearOffer {
  store: string;
  price: number;
  priceMax?: number;
  shipping: number;
  currency: "EUR";
  url: string;
  imageUrl: string;
  sizes: string[];
  sizePrices?: { size: string; price: number; url: string }[];
}
interface GearProductLike {
  id: string;
  brand: string;
  model: string;
  offers: GearOffer[];
}

export default function GearDetailClient({
  item,
  basePath,
  sizeLabel,
}: {
  item: GearProductLike;
  basePath: "guantes" | "pelotas" | "ropa";
  sizeLabel: string;
}) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const favorite = isFavorite(item.id);

  const sortedOffers = [...item.offers].sort((a, b) => a.price + a.shipping - (b.price + b.shipping));
  const cheapestOffer = sortedOffers[0];
  const cheapestTotal = cheapestOffer.price + cheapestOffer.shipping;

  const [selectedOffer, setSelectedOffer] = useState<GearOffer>(sortedOffers[0]);
  const hasDistinctPhotos = new Set(item.offers.map((o) => o.imageUrl)).size > 1;

  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  function cheapestSize(offer: GearOffer) {
    if (!offer.sizePrices || offer.sizePrices.length === 0) return undefined;
    return offer.sizePrices.reduce((a, b) => (a.price <= b.price ? a : b)).size;
  }
  function activeSizePrice(offer: GearOffer) {
    if (!offer.sizePrices || offer.sizePrices.length === 0) return null;
    const sel = selectedSize[offer.store] ?? cheapestSize(offer);
    return offer.sizePrices.find((sp) => sp.size === sel) ?? offer.sizePrices[0];
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-6">
      <Link
        href={`/${basePath}`}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_2fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image
            key={selectedOffer.imageUrl}
            src={getDisplaySrc(selectedOffer.imageUrl, 1200)}
            alt={item.model}
            fill
            unoptimized
            className="object-contain p-6"
          />
          <button
            onClick={() => toggleFavorite(item.id)}
            aria-label={t.nav.favorites}
            className="shadow-vintage-sm absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#B45309] backdrop-blur-md transition-transform hover:scale-110"
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
        <div>
          <span className="text-xs uppercase tracking-wide text-[#B8933F]">{item.brand}</span>
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{item.model}</h1>
          <p className="mt-2 text-sm text-[#675c44]">
            {t.botas.bestPrice}: {cheapestOffer.priceMax ? `${t.botas.from} ` : ""}
            {formatOfferMoney(cheapestTotal, cheapestOffer.currency)} {t.botas.shippingIncluded}
          </p>

          {hasDistinctPhotos && (
            <p className="mt-4 text-xs text-[#675c44]">{t.botas.differentPhotosNote}</p>
          )}

          <div className="mt-3 flex flex-col gap-3">
            {sortedOffers.map((offer, i) => {
              const isSelected = offer.imageUrl === selectedOffer.imageUrl;
              const sp = activeSizePrice(offer);
              const rowUrl = sp ? sp.url : offer.url;
              const rowPrice = sp ? sp.price : offer.price;
              return (
                <div
                  key={offer.store}
                  onClick={() => setSelectedOffer(offer)}
                  className={`glass-panel flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                    hasDistinctPhotos ? "cursor-pointer" : ""
                  } ${
                    hasDistinctPhotos && isSelected
                      ? "border-[#1B3B2B] ring-1 ring-[#1B3B2B]"
                      : "border-[#C9A24B]/25"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {hasDistinctPhotos && (
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#C9A24B]/30 bg-white">
                        <Image src={offer.imageUrl} alt={offer.store} fill unoptimized className="object-contain p-1" />
                      </span>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[#1a1a1a]">
                          {offer.store}
                          {i === 0 && (
                            <span className="ml-2 rounded-full bg-[#1B3B2B] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#F3E9C9]">
                              {t.botas.bestPrice}
                            </span>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(item.id, offer.store);
                          }}
                          disabled={!isComparing(item.id, offer.store) && maxReached}
                          title={!isComparing(item.id, offer.store) && maxReached ? t.compare.maxReached : undefined}
                          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            isComparing(item.id, offer.store)
                              ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
                              : "border-[#C9A24B]/40 bg-white/60 text-[#675c44] hover:border-[#1B3B2B]/40 hover:text-[#1a1a1a]"
                          }`}
                        >
                          <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                            />
                          </svg>
                          {isComparing(item.id, offer.store) ? t.compare.remove : t.compare.add}
                        </button>
                      </div>
                      {offer.sizes.length > 0 && (
                        <p className="text-xs text-[#675c44]">
                          {sizeLabel}: {offer.sizes.length === 1 ? offer.sizes[0] : `${offer.sizes[0]}–${offer.sizes[offer.sizes.length - 1]}`}
                        </p>
                      )}
                      {offer.sizePrices && (
                        <div className="mt-1 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                          {offer.sizePrices.map((sizeOpt) => {
                            const isSizeSelected = (selectedSize[offer.store] ?? cheapestSize(offer)) === sizeOpt.size;
                            return (
                              <button
                                key={sizeOpt.size}
                                type="button"
                                onClick={() =>
                                  setSelectedSize((prev) => ({ ...prev, [offer.store]: sizeOpt.size }))
                                }
                                className={`rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                                  isSizeSelected
                                    ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
                                    : "border-[#C9A24B]/40 bg-white/60 text-[#675c44] hover:border-[#1B3B2B]/40"
                                }`}
                              >
                                {sizeOpt.size}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-xs text-[#675c44]">
                        {!sp && offer.priceMax ? `${t.botas.from} ` : ""}
                        {formatOfferMoney(rowPrice, offer.currency)}
                        {offer.shipping > 0
                          ? ` + ${formatOfferMoney(offer.shipping, offer.currency)} ${t.botas.shippingCost}`
                          : ` · ${t.botas.freeShipping}`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={rowUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackOfferClick({ store: offer.store, url: rowUrl, price: rowPrice, currency: offer.currency });
                    }}
                    className="vintage-plaque shrink-0 rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {t.botas.viewOffer}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
