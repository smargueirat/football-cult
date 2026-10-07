"use client";

import Image from "next/image";
import { useState } from "react";
import BackToCatalogLink from "@/components/BackToCatalogLink";
import { BootProduct, BootOffer } from "@/data/boots";
import { formatOfferMoney, bootOfferTotalInEUR } from "@/lib/offerMoney";
import { trackOfferClick } from "@/lib/analytics";
import { goHref } from "@/lib/go";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCountry } from "@/lib/country/CountryContext";
import { offersForCountry } from "@/lib/productMeta";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc, upsizeBootDetailPhoto } from "@/lib/images";
import StickyBestOfferBar from "@/components/StickyBestOfferBar";
import PriceArchiveLine from "@/components/PriceArchiveLine";
import { savingsVsMedian } from "@/lib/offerStats";
import type { OfferPriceStats } from "@/lib/priceArchive";

import { retailerCountText } from "@/lib/retailerFamily";
export default function BootDetailClient({
  boot,
  archiveStats = {},
}: {
  boot: BootProduct;
  /** Mínimo/mediana del archivo durable de precios, por URL de oferta. */
  archiveStats?: Record<string, OfferPriceStats>;
}) {
  const { t, locale } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const { countryCode, country } = useCountry();
  const favorite = isFavorite(boot.id);

  // bootOfferTotalInEUR (no el precio bruto) porque Pro Soccer factura en
  // USD -- ver el comentario largo en boots.ts.
  const sortedOffers = [...boot.offers].sort(
    (a, b) => bootOfferTotalInEUR(a) - bootOfferTotalInEUR(b)
  );
  // Ofertas que no envían al país del visitante: siguen listadas, atenuadas,
  // y nunca son "mejor precio" (salvo que ninguna envíe: entonces todas valen).
  const shippable = offersForCountry(sortedOffers, countryCode);
  const cheapestOffer = shippable[0];
  const cheapestTotal = cheapestOffer.price + cheapestOffer.shipping;

  // Ahorro frente a la MEDIANA de las tiendas (no la más cara). ProSoccer
  // queda afuera: su envío internacional no figura en el feed y su "total"
  // sería menor al real. Con menos de 3 tiendas distintas no se muestra.
  const medianSavings = savingsVsMedian(
    shippable
      .filter((o) => o.store !== "ProSoccer")
      .map((o) => ({ store: o.store, total: bootOfferTotalInEUR(o) })),
  );

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
  const [selectedOffer, setSelectedOffer] = useState<BootOffer>(cheapestOffer);
  const hasDistinctPhotos = new Set(boot.offers.map((o) => o.imageUrl)).size > 1;

  // Selector de talla real: algunas tiendas (ver el comentario largo de
  // sizePrices en boots.ts) cobran distinto según la talla dentro del
  // mismo colorway, cada una con su propio precio y a veces su propio
  // link real. Antes se resolvía mostrando "Desde X" -- esto deja
  // elegir la talla real y ver/linkear su precio exacto en vez de una
  // cifra que solo vale para la más barata.
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  function cheapestSize(offer: BootOffer) {
    if (!offer.sizePrices || offer.sizePrices.length === 0) return undefined;
    return offer.sizePrices.reduce((a, b) => (a.price <= b.price ? a : b)).size;
  }
  function activeSizePrice(offer: BootOffer) {
    if (!offer.sizePrices || offer.sizePrices.length === 0) return null;
    const sel = selectedSize[offer.store] ?? cheapestSize(offer);
    return offer.sizePrices.find((sp) => sp.size === sel) ?? offer.sizePrices[0];
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 pt-8 pb-28 sm:px-6 sm:pb-8">
      <BackToCatalogLink fallbackHref="/botas" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_2fr]">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
            <Image
              key={selectedOffer.imageUrl}
              src={getDisplaySrc(upsizeBootDetailPhoto(selectedOffer.imageUrl), 1200)}
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
          {/* Señal de confianza real junto a la foto (antes espacio vacío)
              -- cantidad real de tiendas para este modelo, sin inventar
              nada más (no hay guía de autenticidad propia para botas ni
              fecha de último refresh cargada acá, a diferencia de
              camisetas -- ver JerseyDetailClient.tsx). */}
          <div className="vintage-card mt-3 flex items-center gap-1.5 rounded-2xl p-4 text-sm font-medium text-[#1B3B2B]">
            {retailerCountText(sortedOffers, t.product)}
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-[#B8933F]">
            {boot.brand} · {boot.groundType}
          </span>
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{boot.model}</h1>
          <p className="mt-2 text-sm text-[#675c44]">
            {t.botas.bestPrice}: {cheapestOffer.priceMax ? `${t.botas.from} ` : ""}
            {formatOfferMoney(cheapestTotal, cheapestOffer.currency)} {t.botas.shippingIncluded}
          </p>

          {medianSavings && medianSavings.abs >= 1 && (
            <p className="mt-2 inline-flex rounded-lg bg-[#1B3B2B]/10 px-3 py-1.5 text-sm font-medium text-[#1B3B2B]">
              {t.detail.savingsVsMedian
                .replace("{n}", String(medianSavings.stores))
                .replace("{amount}", formatOfferMoney(medianSavings.abs, "EUR"))
                .replace("{pct}", String(medianSavings.pct))}
            </p>
          )}
          <PriceArchiveLine stats={archiveStats[cheapestOffer.url] ?? null} />

          {/* Mismo corazón de arriba, favoritar ya suscribe a la alerta de
              precio por mail (ver FavoritesContext.tsx y check-prices).
              Botas tiene su propio componente separado de
              GearDetailClient.tsx -- por eso necesitaba esto aparte. */}
          <button
            onClick={() => toggleFavorite(boot.id)}
            className="mt-2 text-left text-sm text-[#8a6a1f] underline decoration-[#C9A24B] underline-offset-2 hover:text-[#1B3B2B]"
          >
            {favorite ? t.detail.priceAlertCtaOn : t.detail.priceAlertCtaOff}
          </button>

          <a
            href="https://t.me/FootballCultOfertas"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs text-[#675c44] underline decoration-[#C9A24B] underline-offset-2 hover:text-[#1B3B2B]"
          >
            {t.priceDrop.channelCta} · {t.priceDrop.channelLink} →
          </a>

          {hasDistinctPhotos && (
            <p className="mt-4 text-xs text-[#675c44]">{t.botas.differentPhotosNote}</p>
          )}

          <div className="mt-3 flex flex-col gap-3">
            {sortedOffers.map((offer, i) => {
              const ships = shippable.includes(offer);
              const isSelected = offer.imageUrl === selectedOffer.imageUrl;
              const sp = activeSizePrice(offer);
              const rowUrl = sp ? sp.url : offer.url;
              const rowPrice = sp ? sp.price : offer.price;
              return (
                // div, no button: ya trae adentro un <a> real (ver oferta) y un
                // <button> real (comparar) -- anidar cualquiera de los dos
                // dentro de un <button> es HTML inválido. El click en la fila
                // (fuera de esos dos controles, que llevan stopPropagation)
                // elige la foto de esta oferta como foto grande.
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
                      {offer.sizes.length > 0 && (
                        <p className="text-xs text-[#675c44]">
                          {t.botas.sizesEU}: {offer.sizes[0]}–{offer.sizes[offer.sizes.length - 1]}
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
                        {offer.store === "ProSoccer"
                          ? // Tienda de EE.UU. -- el feed no da un costo de envío
                            // internacional real, y su propia política dice
                            // explícitamente que el envío gratis NO aplica a
                            // pedidos internacionales -- decir "envío gratis"
                            // acá sería un dato falso, no una aproximación.
                            ` · ${t.botas.shippingCalculatedAtStore}`
                          : offer.shipping > 0
                            ? ` + ${formatOfferMoney(offer.shipping, offer.currency)} ${t.botas.shippingCost}`
                            : ` · ${t.botas.freeShipping}`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={goHref({ kind: "b", productId: boot.id, url: rowUrl, locale, origin: "ficha", position: i + 1, isBest: offer === cheapestOffer })}
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
            })}
          </div>
        </div>
      </div>

      {/* Barra fija en celular: un toque a la mejor tienda, con tienda y
          total a la vista. En botas la lista de ofertas queda debajo de una
          foto cuadrada de pantalla completa, así que sin esto había que
          scrollear para encontrar dónde comprar. */}
      {(() => {
        const sp = activeSizePrice(cheapestOffer);
        const barUrl = sp ? sp.url : cheapestOffer.url;
        const barPrice = sp ? sp.price : cheapestOffer.price;
        const barTotal = barPrice + (cheapestOffer.store === "ProSoccer" ? 0 : cheapestOffer.shipping);
        return (
          <StickyBestOfferBar
            hideFrom="sm"
            store={cheapestOffer.store}
            total={`${!sp && cheapestOffer.priceMax ? `${t.botas.from} ` : ""}${formatOfferMoney(barTotal, cheapestOffer.currency)}`}
            fromLabel={t.botas.bestPrice}
            goLabel={t.detail.goToStore.replace("{store}", cheapestOffer.store)}
            href={barUrl}
            onClick={() =>
              trackOfferClick({ store: cheapestOffer.store, url: barUrl, price: barPrice, currency: cheapestOffer.currency })
            }
          />
        );
      })()}
    </div>
  );
}
