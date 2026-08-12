"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import {
  Offer,
  Product,
  Size,
  availableSizesForCountry,
  displayTitleForCountry,
  formatOfferMoney,
  offerShipsTo,
  offerTotal,
  offerTotalInEUR,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translateTitleVocabulary } from "@/lib/i18n/titleGlossary";
import { useCountry } from "@/lib/country/CountryContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { getDisplaySrc } from "@/lib/images";
import JerseyIcon from "./JerseyIcon";
import JerseySkeleton from "./JerseySkeleton";
import ReportProductModal from "./ReportProductModal";

const BADGE_COLORS = ["#1F6F4C", "#B45309", "#2563EB", "#7C3AED", "#DB2777", "#0891B2"];

function badgeColor(store: string) {
  const sum = store.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BADGE_COLORS[sum % BADGE_COLORS.length];
}

export default function JerseyDetailClient({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const { country, countryCode } = useCountry();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const comparing = isComparing(product.id);
  const favorite = isFavorite(product.id);

  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];
  const sizes = availableSizesForCountry(product, countryCode);

  const sortedOffers = useMemo(
    () => [...product.offers].sort((a, b) => offerTotalInEUR(a) - offerTotalInEUR(b)),
    [product.offers]
  );

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id]);

  async function handleShare() {
    const url = window.location.href;
    const title = `${displayName} — Football Cult`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // el usuario canceló el share sheet, no hacemos nada
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  function shipsHere(offer: Offer) {
    return offerShipsTo(offer.store, countryCode);
  }

  function matchesSize(offer: Offer) {
    return !selectedSize || offer.sizes.includes(selectedSize);
  }

  const shippableCount = product.offers.filter(
    (o) => o.inStock && shipsHere(o)
  ).length;
  const bestOffer = sortedOffers.find((o) => o.inStock && shipsHere(o));
  const bestStore = bestOffer?.store;
  // La foto principal sale de la misma oferta que se muestra como "mejor
  // precio", para que nunca se vea una camiseta distinta a la que el
  // usuario termina comprando.
  const photo = bestOffer?.imageUrl ?? sortedOffers.find((o) => o.imageUrl)?.imageUrl;
  // Nombre real tal como aparece en la tienda (siempre, sea cual sea su
  // idioma), no un nombre armado por nosotros (equipo + tipo) -- ver
  // displayTitleForCountry, regla fija, no volver a gatear esto por idioma.
  const displayName =
    displayTitleForCountry(product, countryCode, locale) ?? `${team} ${type}`;

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
            className="vintage-card relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-16"
            style={{
              background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
            }}
          >
            <span className="vintage-plaque absolute left-4 top-4 rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
              {product.season}
            </span>
            <button
              onClick={() => toggleFavorite(product.id)}
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
            {photo ? (
              <>
                {!imageLoaded && (
                  <JerseySkeleton className="absolute inset-0 h-full w-full" />
                )}
                {/* <img> nativo (ver nota en ProductCard.tsx): mismo motivo,
                    srcSet real en vez de bajar siempre el archivo de 1000px
                    incluso en celular. fetchPriority reemplaza el
                    `priority` de next/image para que siga cargando eager,
                    sin lazy, al ser la foto principal sobre el pliegue. */}
                <img
                  src={getDisplaySrc(photo, 1000)}
                  srcSet={`${getDisplaySrc(photo, 500)} 500w, ${getDisplaySrc(photo, 800)} 800w, ${getDisplaySrc(photo, 1200)} 1200w`}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  alt={displayName}
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
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
          </div>
          {!photo && (
            <p className="mt-3 text-center text-xs text-[#9a9a94]">
              {t.detail.photoPlaceholder}
            </p>
          )}
        </div>

        {/* Right: hunter column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-card-title text-2xl text-[#1a1a1a] sm:text-3xl lg:text-4xl">
                {displayName}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#675c44]">
                <span>{country.flag}</span>
                {t.detail.storesCompared.replace("{n}", String(shippableCount))}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => toggleCompare(product.id)}
                disabled={!comparing && maxReached}
                title={!comparing && maxReached ? t.compare.maxReached : undefined}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  comparing
                    ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
                    : "border-[#C9A24B]/30 bg-white/60 text-[#3a3a36] hover:border-[#1B3B2B]/40"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                </svg>
                {t.compare.add}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-full border border-[#C9A24B]/30 bg-white/60 px-3 py-2 text-xs font-medium text-[#3a3a36] transition-colors hover:border-[#1B3B2B]/40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342a4 4 0 100-2.684l6.632-3.316a4 4 0 100-2.684 4 4 0 000 2.684L8.684 10.658a4 4 0 100 2.684l6.632 3.316a4 4 0 100-2.684l-6.632-3.316z"
                  />
                </svg>
                {shareCopied ? t.share.copied : t.share.button}
              </button>
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-[#C9A24B]/30 bg-white/60 px-3 py-2 text-xs font-medium text-[#3a3a36] transition-colors hover:border-[#1B3B2B]/40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                {t.reportProduct.button}
              </button>
            </div>
          </div>

          {shippableCount === 0 ? (
            <p className="rounded-2xl border border-[#C9A24B]/25 bg-white/60 p-4 text-sm text-[#675c44]">
              {t.countryPanel.notAvailable}
            </p>
          ) : (
            <>
              {/* Size selector */}
              <div>
                <p className="font-tagline mb-2 text-sm not-italic text-[#5b5442]">{t.detail.chooseSize}</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize((s) => (s === size ? null : size))}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
                          : "border-[#C9A24B]/30 bg-white text-[#3a3a36] hover:border-[#1B3B2B]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offers */}
              <div>
                <p className="font-tagline mb-3 text-sm not-italic text-[#5b5442]">
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
                <p className="mb-3 text-xs text-[#5b5442]">{t.detail.currencyNote}</p>

                <div className="flex flex-col gap-3">
                  {sortedOffers.map((offer) => {
                    const ships = shipsHere(offer);
                    const match = offer.inStock && ships && matchesSize(offer);
                    const isBest = offer.store === bestStore && match;
                    return (
                      <div
                        key={offer.store}
                        className={`vintage-card relative overflow-hidden rounded-2xl transition-opacity duration-300 ${
                          isBest ? "border-[#B8923F]/70 ring-1 ring-[#C9A24B]/30" : ""
                        }`}
                      >
                        <div
                          className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                            match ? "" : "pointer-events-none opacity-40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                              style={{ backgroundColor: badgeColor(offer.store) }}
                            >
                              {offer.store.charAt(0)}
                            </span>
                            <div>
                              <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-[#1a1a1a]">
                                {offer.store}
                                {isBest && <span className="text-xs">🥇</span>}
                                {offer.store === "FansJerseyHub" && (
                                  <span className="rounded-full bg-[#B45309]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                                    {t.detail.replicaBadge}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-[#a8926a]">
                                {offer.title ? translateTitleVocabulary(offer.title, locale) : `${team} ${type}`}
                              </p>
                              {!offer.inStock ? (
                                <p className="text-xs text-[#b3aa8f]">{t.product.soldOut}</p>
                              ) : !ships ? null : !matchesSize(offer) ? (
                                <p className="text-xs text-[#b3aa8f]">
                                  {t.detail.notAvailableInSize.replace("{size}", selectedSize ?? "")}
                                </p>
                              ) : (
                                <p className="text-xs text-[#675c44]">
                                  {formatOfferMoney(offer.price, offer.currency)} + {formatOfferMoney(offer.shipping, offer.currency)} {t.detail.shipping.toLowerCase()}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-wide text-[#a8926a]">
                                {t.detail.total}
                              </p>
                              <p
                                className={`text-lg font-semibold ${
                                  isBest ? "text-[#B45309]" : "text-[#3a3a36]"
                                }`}
                              >
                                {formatOfferMoney(offerTotal(offer), offer.currency)}
                              </p>
                            </div>
                            <a
                              href={offer.url}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="group/btn flex items-center gap-1.5 rounded-full bg-[#1B3B2B] px-4 py-2.5 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
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

                        {!ships && (
                          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#f5f0e0]/75">
                            <span className="shadow-vintage-sm -rotate-6 rounded border-2 border-[#675c44]/60 bg-[#fffdf8] px-4 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-[#675c44]">
                              {t.detail.notAvailableInCountry.replace("{country}", country.name[locale])}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {reportOpen && (
        <ReportProductModal
          productId={product.id}
          productUrl={typeof window !== "undefined" ? window.location.href : ""}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
}
