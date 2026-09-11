"use client";

import Link from "@/lib/i18n/LocaleLink";
import Image from "next/image";
import { useState } from "react";
import { BootProduct, BootOffer } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";

export default function BootDetailClient({ boot }: { boot: BootProduct }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const favorite = isFavorite(boot.id);

  const sortedOffers = [...boot.offers].sort(
    (a, b) => a.price + a.shipping - (b.price + b.shipping)
  );
  const cheapestTotal = sortedOffers[0].price + sortedOffers[0].shipping;

  // La foto grande arrancaba siempre en offers[0] (la primera tienda del
  // feed, orden arbitrario) mientras que BootCard.tsx en el catálogo usa
  // la oferta más barata -- reportado por el usuario: "la foto del
  // catálogo no corresponde con la foto cuando entrás". Ahora arranca en
  // la misma oferta que la tarjeta (la más barata), así entrar al
  // producto muestra la misma foto que ya se vio en el catálogo.
  //
  // Cuando dos tiendas listan "el mismo modelo" (los 71 originales,
  // cruzados por nombre entre FutbolEmotion y ForumSport) a veces tienen
  // fotos reales distintas -- no es un error de datos, son colorways
  // reales distintos que cada tienda fotografió (confirmado: la URL de
  // FutbolEmotion para este caso dice literalmente "solar-yellow-core-
  // black-lucid-red"). En vez de inventar una noción de "variante de
  // color" separada, se deja elegir la foto real de cada tienda tocando
  // su oferta -- mismo dato que ya se mostraba, solo se lo conecta a la
  // foto grande.
  const [selectedOffer, setSelectedOffer] = useState<BootOffer>(sortedOffers[0]);
  const hasDistinctPhotos = new Set(boot.offers.map((o) => o.imageUrl)).size > 1;

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-8 sm:px-6">
      <Link
        href="/botas"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image
            key={selectedOffer.imageUrl}
            src={selectedOffer.imageUrl}
            alt={boot.model}
            fill
            unoptimized
            className="object-contain p-6"
          />
          <button
            onClick={() => toggleFavorite(boot.id)}
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
          <span className="text-xs uppercase tracking-wide text-[#B8933F]">
            {boot.brand} · {boot.groundType}
          </span>
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{boot.model}</h1>
          <p className="mt-2 text-sm text-[#675c44]">
            {t.botas.bestPrice}: {formatOfferMoney(cheapestTotal, "EUR")} {t.botas.shippingIncluded}
          </p>

          {hasDistinctPhotos && (
            <p className="mt-4 text-xs text-[#675c44]">{t.botas.differentPhotosNote}</p>
          )}

          <div className="mt-3 flex flex-col gap-3">
            {sortedOffers.map((offer, i) => {
              const isSelected = offer.imageUrl === selectedOffer.imageUrl;
              return (
                // div, no button: ya trae adentro un <a> real (ver oferta) y un
                // <button> real (comparar) -- anidar cualquiera de los dos
                // dentro de un <button> es HTML inválido. El click en la fila
                // (fuera de esos dos controles, que llevan stopPropagation)
                // elige la foto de esta oferta como foto grande.
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
                            toggleCompare(boot.id, offer.store);
                          }}
                          disabled={!isComparing(boot.id, offer.store) && maxReached}
                          title={!isComparing(boot.id, offer.store) && maxReached ? t.compare.maxReached : undefined}
                          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            isComparing(boot.id, offer.store)
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
                          {isComparing(boot.id, offer.store) ? t.compare.remove : t.compare.add}
                        </button>
                      </div>
                      <p className="text-xs text-[#675c44]">
                        {t.botas.sizesEU}: {offer.sizes[0]}–{offer.sizes[offer.sizes.length - 1]}
                      </p>
                      <p className="text-xs text-[#675c44]">
                        {formatOfferMoney(offer.price, "EUR")}
                        {offer.shipping > 0
                          ? ` + ${formatOfferMoney(offer.shipping, "EUR")} ${t.botas.shippingCost}`
                          : ` · ${t.botas.freeShipping}`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    onClick={(e) => e.stopPropagation()}
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
