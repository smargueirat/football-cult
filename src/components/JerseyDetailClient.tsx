"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Offer,
  Product,
  Size,
  availableSizesForCountry,
  formatMoney,
  offerShipsTo,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCountry } from "@/lib/country/CountryContext";
import JerseyIcon from "./JerseyIcon";

const BADGE_COLORS = ["#1F6F4C", "#B45309", "#2563EB", "#7C3AED", "#DB2777", "#0891B2"];

function badgeColor(store: string) {
  const sum = store.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BADGE_COLORS[sum % BADGE_COLORS.length];
}

export default function JerseyDetailClient({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const { country, countryCode } = useCountry();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];
  const sizes = availableSizesForCountry(product, countryCode);

  const sortedOffers = useMemo(
    () => [...product.offers].sort((a, b) => offerTotal(a) - offerTotal(b)),
    [product.offers]
  );

  function shipsHere(offer: Offer) {
    return offerShipsTo(offer.store, countryCode);
  }

  function matchesSize(offer: Offer) {
    return !selectedSize || offer.sizes.includes(selectedSize);
  }

  const shippableCount = product.offers.filter(
    (o) => o.inStock && shipsHere(o)
  ).length;
  const bestStore = sortedOffers.find((o) => o.inStock && shipsHere(o))?.store;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#5b5b57] transition-colors hover:text-[#1a1a1a]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: showcase */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="flex aspect-square items-center justify-center rounded-3xl p-16"
            style={{
              background: `linear-gradient(135deg, #ffffff, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
            }}
          >
            <JerseyIcon
              className="h-2/3 w-2/3 drop-shadow-sm"
              primary={product.colorHex}
              secondary={product.colorHexSecondary}
              pattern={product.jerseyPattern}
            />
          </div>
          <p className="mt-3 text-center text-xs text-[#9a9a94]">
            {t.detail.photoPlaceholder}
          </p>
        </div>

        {/* Right: hunter column */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1a1a1a] sm:text-3xl">
              {team} {type} {product.season}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#8a8a84]">
              <span>{country.flag}</span>
              {t.detail.storesCompared.replace("{n}", String(shippableCount))}
            </p>
          </div>

          {shippableCount === 0 ? (
            <p className="rounded-2xl border border-black/[0.06] bg-white/60 p-4 text-sm text-[#8a8a84]">
              {t.countryPanel.notAvailable}
            </p>
          ) : (
            <>
              {/* Size selector */}
              <div>
                <p className="mb-2 text-sm font-medium text-[#3a3a36]">{t.detail.chooseSize}</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize((s) => (s === size ? null : size))}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-[#1F6F4C] bg-[#1F6F4C] text-white"
                          : "border-black/[0.1] bg-white text-[#3a3a36] hover:border-[#1F6F4C]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offers */}
              <div>
                <p className="mb-3 text-sm font-medium text-[#3a3a36]">
                  {selectedSize
                    ? t.detail.storesCompared.replace(
                        "{n}",
                        String(
                          sortedOffers.filter(
                            (o) => o.inStock && shipsHere(o) && matchesSize(o)
                          ).length
                        )
                      )
                    : t.detail.allSizes}
                </p>

                <div className="flex flex-col gap-3">
                  {sortedOffers.map((offer) => {
                    const ships = shipsHere(offer);
                    const match = offer.inStock && ships && matchesSize(offer);
                    const isBest = offer.store === bestStore && match;
                    return (
                      <div
                        key={offer.store}
                        className={`glass-panel flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-opacity duration-300 sm:flex-row sm:items-center sm:justify-between ${
                          isBest ? "border-[#D97706]/40 ring-1 ring-[#D97706]/20" : "border-black/[0.06]"
                        } ${match ? "" : "pointer-events-none opacity-40"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: badgeColor(offer.store) }}
                          >
                            {offer.store.charAt(0)}
                          </span>
                          <div>
                            <p className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a]">
                              {offer.store}
                              {isBest && <span className="text-xs">🥇</span>}
                            </p>
                            {!offer.inStock ? (
                              <p className="text-xs text-[#b3b3ad]">{t.product.soldOut}</p>
                            ) : !ships ? (
                              <p className="text-xs text-[#b3b3ad]">
                                {t.countryPanel.notAvailable}
                              </p>
                            ) : !matchesSize(offer) ? (
                              <p className="text-xs text-[#b3b3ad]">
                                {t.detail.notAvailableInSize.replace("{size}", selectedSize ?? "")}
                              </p>
                            ) : (
                              <p className="text-xs text-[#8a8a84]">
                                {formatMoney(offer.price, country)} + {formatMoney(offer.shipping, country)} {t.detail.shipping.toLowerCase()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wide text-[#9a9a94]">
                              {t.detail.total}
                            </p>
                            <p
                              className={`text-lg font-semibold ${
                                isBest ? "text-[#B45309]" : "text-[#3a3a36]"
                              }`}
                            >
                              {formatMoney(offerTotal(offer), country)}
                            </p>
                          </div>
                          <a
                            href={offer.url}
                            className="group/btn flex items-center gap-1.5 rounded-full bg-[#1F6F4C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18573c]"
                          >
                            {t.detail.viewInStore}
                            <svg
                              className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
