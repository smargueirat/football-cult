"use client";

import Image from "next/image";
import { useState } from "react";
import BackToCatalogLink from "./BackToCatalogLink";
import { approxPriceLabel, formatOfferMoney, offerTotalInEUR, shippingUnknown } from "@/lib/offerMoney";
import { trackOfferClick } from "@/lib/analytics";
import { goHref, type GoKind } from "@/lib/go";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localizeGearModel } from "@/lib/gearText";
import { useCountry } from "@/lib/country/CountryContext";
import { offerShipsTo } from "@/lib/productMeta";
import { rankOffers } from "@/lib/offerOrder";
import ApproxPrice from "@/components/ApproxPrice";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc } from "@/lib/images";
import StickyBestOfferBar from "./StickyBestOfferBar";

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
  currency: "EUR" | "CLP";
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

const GEAR_KIND: Record<"guantes" | "pelotas" | "ropa" | "entrenamiento", GoKind> = {
  guantes: "g",
  pelotas: "p",
  ropa: "a",
  entrenamiento: "e",
};

export default function GearDetailClient({
  item,
  basePath,
  sizeLabel,
}: {
  item: GearProductLike;
  basePath: "guantes" | "pelotas" | "ropa" | "entrenamiento";
  sizeLabel: string;
}) {
  const { t, locale } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const { countryCode, country } = useCountry();
  const favorite = isFavorite(item.id);

  // Las que envían al país primero; dentro, precio total y, solo en empate
  // (±1 %), comisión (offerOrder.ts). Las que no envían van aparte, al final,
  // y nunca son "mejor precio": si ninguna envía, no hay mejor precio.
  const ships = (o: GearOffer) => offerShipsTo(o.store, countryCode);
  const sortedOffers = rankOffers(item.offers, offerTotalInEUR, ships);
  const shippable = sortedOffers.filter(ships);
  const elsewhere = sortedOffers.filter((o) => !ships(o));
  const cheapestOffer: GearOffer | undefined = shippable[0];
  const leadOffer = cheapestOffer ?? sortedOffers[0];
  const cheapestTotal = leadOffer.price + leadOffer.shipping;

  const [selectedOffer, setSelectedOffer] = useState<GearOffer>(leadOffer);
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

  function renderRow(offer: GearOffer, i: number) {
    const ships = shippable.includes(offer);
    const isSelected = offer.imageUrl === selectedOffer.imageUrl;
    const sp = activeSizePrice(offer);
    const rowUrl = sp ? sp.url : offer.url;
    const rowPrice = sp ? sp.price : offer.price;
    return (
      <div
        key={offer.store}
        onClick={() => setSelectedOffer(offer)}
        className={`glass-panel relative flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
          hasDistinctPhotos ? "cursor-pointer" : ""
        } ${ships ? "" : "pointer-events-none opacity-40"} ${
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
                {offer === cheapestOffer && (
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
              {formatOfferMoney(rowPrice, offer.currency)}{" "}
              <ApproxPrice amount={rowPrice} currency={offer.currency} />
              {shippingUnknown(offer)
                ? ` · ${t.detail.shipping}: ${t.compare.shippingToCheck}`
                : offer.shipping > 0
                  ? ` + ${formatOfferMoney(offer.shipping, offer.currency)} ${t.botas.shippingCost}`
                  : ` · ${t.botas.freeShipping}`}
            </p>
          </div>
        </div>
        <a
          href={goHref({ kind: GEAR_KIND[basePath], productId: item.id, url: rowUrl, locale, origin: "ficha", position: i + 1, isBest: offer === cheapestOffer })}
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
        {!ships && (
          <span className="shadow-vintage-sm pointer-events-none absolute right-3 top-3 z-10 rounded border border-[#675c44]/60 bg-[#fffdf8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#675c44]">
            {t.detail.notAvailableInCountry.replace("{country}", country.name[locale])}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 pt-8 pb-28 sm:px-6 sm:pb-8">
      <BackToCatalogLink fallbackHref={`/${basePath}`} />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_2fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image
            key={selectedOffer.imageUrl}
            src={getDisplaySrc(selectedOffer.imageUrl, 1200)}
            alt={localizeGearModel(item.model, item.brand, locale)}
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
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{localizeGearModel(item.model, item.brand, locale)}</h1>
          {cheapestOffer ? (
            <p className="mt-2 text-sm text-[#675c44]">
              {t.botas.bestPrice}: {cheapestOffer.priceMax || shippingUnknown(cheapestOffer) ? `${t.botas.from} ` : ""}
              {formatOfferMoney(cheapestTotal, cheapestOffer.currency)} {shippingUnknown(cheapestOffer) ? "" : t.botas.shippingIncluded}{" "}
              <ApproxPrice amount={cheapestTotal} currency={cheapestOffer.currency} className="text-xs" />
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#675c44]">{t.countryPanel.notAvailable}</p>
          )}

          {/* Mismo corazón de arriba, favoritar ya suscribe a la alerta de
              precio por mail (ver FavoritesContext.tsx). Desde que
              check-prices también revisa botas/guantes/pelotas/ropa
              (09-23, antes solo camisetas) esta promesa ya es real acá. */}
          <button
            onClick={() => toggleFavorite(item.id)}
            className="mt-2 text-left text-sm text-[#8a6a1f] underline decoration-[#C9A24B] underline-offset-2 hover:text-[#1B3B2B]"
          >
            {favorite ? t.detail.priceAlertCtaOn : t.detail.priceAlertCtaOff}
          </button>

          {hasDistinctPhotos && (
            <p className="mt-4 text-xs text-[#675c44]">{t.botas.differentPhotosNote}</p>
          )}

          <div className="mt-3 flex flex-col gap-3">
            {shippable.map(renderRow)}
            {elsewhere.length > 0 && (
              <details className="rounded-xl border border-[#C9A24B]/25 bg-white/40 p-3">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[#675c44]">
                  {t.detail.notAvailableInCountry.replace("{country}", country.name[locale])} ({elsewhere.length})
                </summary>
                <div className="mt-3 flex flex-col gap-3">
                  {elsewhere.map((o, i) => renderRow(o, shippable.length + i))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>

      {/* Barra fija en celular: un toque a la mejor tienda (tienda + total),
          igual que en botas. */}
      {cheapestOffer && (() => {
        const sp = activeSizePrice(cheapestOffer);
        const barUrl = sp ? sp.url : cheapestOffer.url;
        const barPrice = sp ? sp.price : cheapestOffer.price;
        return (
          <StickyBestOfferBar
            hideFrom="sm"
            store={cheapestOffer.store}
            total={`${!sp && cheapestOffer.priceMax ? `${t.botas.from} ` : ""}${formatOfferMoney(barPrice + cheapestOffer.shipping, cheapestOffer.currency)}`}
            approx={approxPriceLabel(barPrice + cheapestOffer.shipping, cheapestOffer.currency, country.currency)}
            fromLabel={t.botas.bestPrice}
            goLabel={t.detail.goToStore.replace("{store}", cheapestOffer.store)}
            href={goHref({ kind: GEAR_KIND[basePath], productId: item.id, url: barUrl, locale, origin: "ficha", position: 1, isBest: true })}
            onClick={() =>
              trackOfferClick({ store: cheapestOffer.store, url: barUrl, price: barPrice, currency: cheapestOffer.currency })
            }
          />
        );
      })()}
    </div>
  );
}
