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
  getAgeGroup,
  isVintageRetro,
  offerShipsTo,
  offerTotal,
  offerTotalInEUR,
  products,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translateTitleVocabulary } from "@/lib/i18n/titleGlossary";
import { useCountry } from "@/lib/country/CountryContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import DiscoveryCarousel from "./DiscoveryCarousel";
import JerseyGallery from "./JerseyGallery";
import ReportProductModal from "./ReportProductModal";

const BADGE_COLORS = ["#1F6F4C", "#B45309", "#2563EB", "#7C3AED", "#DB2777", "#0891B2"];

function badgeColor(store: string) {
  const sum = store.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BADGE_COLORS[sum % BADGE_COLORS.length];
}

const KNOWN_CURRENCIES = ["EUR", "USD", "GBP", "BRL"] as const;
type KnownCurrency = (typeof KNOWN_CURRENCIES)[number];

// eBay's live shipping endpoint can in principle return a currency for
// a destination we don't otherwise handle (formatOfferMoney only knows
// our 4 supported offer currencies) -- fall back to a plain "amount
// CODE" string instead of a type-unsafe cast, for the rare country
// where that happens.
function formatMaybeKnownMoney(amount: number, currency: string): string {
  if ((KNOWN_CURRENCIES as readonly string[]).includes(currency)) {
    return formatOfferMoney(amount, currency as KnownCurrency);
  }
  return `${amount.toFixed(2)} ${currency}`;
}

// Vibración corta al guardar/sacar de favoritos -- puro progressive
// enhancement: Safari/iOS no implementa la Vibration API para web y
// simplemente no hace nada ahí, sin romper el resto de la interacción.
function triggerHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(15);
  }
}

const OFFERS_SECTION_ID = "comparativa-tiendas";

export default function JerseyDetailClient({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const { country, countryCode } = useCountry();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const comparing = isComparing(product.id);
  const favorite = isFavorite(product.id);

  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];
  const sizes = availableSizesForCountry(product, countryCode);
  const ageGroup = getAgeGroup(product);

  // eBay no puede calcular el envío sin saber el destino (su propia API
  // devuelve shippingOptions: null si no se lo mandamos) -- el número
  // que ya viene minado en el catálogo es un placeholder, casi siempre
  // 0. Acá se pide en vivo, por oferta de eBay visible en esta página,
  // el costo real (envío + impuestos de importación si corresponde)
  // para el país que el visitante tiene elegido arriba del sitio.
  const [liveEbayCosts, setLiveEbayCosts] = useState<
    Record<string, { shipping: number; currency: string; importCharges: number | null } | null>
  >({});
  useEffect(() => {
    const ebayOffers = product.offers.filter((o) => o.store === "eBay");
    if (ebayOffers.length === 0) return;
    let cancelled = false;
    setLiveEbayCosts({});
    ebayOffers.forEach(async (offer) => {
      try {
        const res = await fetch(
          `/api/ebay-shipping?url=${encodeURIComponent(offer.url)}&country=${countryCode}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || data.shipping == null) return;
        setLiveEbayCosts((prev) => ({
          ...prev,
          [offer.url]: {
            shipping: data.shipping,
            currency: data.currency ?? offer.currency,
            importCharges: data.importCharges ?? null,
          },
        }));
      } catch {
        // sin conexión al endpoint en vivo -- se queda con el placeholder
        // minado, no rompe el resto de la ficha.
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product.offers, countryCode]);

  // Ordena (y decide "mejor precio") usando el envío real ya cargado
  // arriba cuando está disponible, no el placeholder minado -- si no,
  // una oferta de eBay podía quedar marcada como la más barata mientras
  // en verdad, una vez sumado el envío real a tu país, terminaba
  // costando más que otra tienda.
  const sortedOffers = useMemo(() => {
    function totalInEUR(offer: Offer): number {
      const live = offer.store === "eBay" ? liveEbayCosts[offer.url] : null;
      if (live && live.currency === offer.currency) {
        const liveTotal = offer.price + live.shipping + (live.importCharges ?? 0);
        return offerTotalInEUR({ ...offer, price: liveTotal, shipping: 0 });
      }
      return offerTotalInEUR(offer);
    }
    return [...product.offers].sort((a, b) => totalInEUR(a) - totalInEUR(b));
  }, [product.offers, liveEbayCosts]);

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
  // Nombre real tal como aparece en la tienda (siempre, sea cual sea su
  // idioma), no un nombre armado por nosotros (equipo + tipo) -- ver
  // displayTitleForCountry, regla fija, no volver a gatear esto por idioma.
  const displayName =
    displayTitleForCountry(product, countryCode, locale) ?? `${team} ${type}`;

  // Galería: todas las fotos distintas entre ofertas (algunas tiendas
  // fotografían la misma camiseta distinto), la de la mejor oferta
  // primero para que nunca se vea una camiseta distinta a la que el
  // usuario termina comprando.
  const photos = useMemo(() => {
    const ordered = bestOffer
      ? [bestOffer, ...sortedOffers.filter((o) => o !== bestOffer)]
      : sortedOffers;
    const seen = new Set<string>();
    const list: string[] = [];
    for (const o of ordered) {
      if (o.imageUrl && !seen.has(o.imageUrl)) {
        seen.add(o.imageUrl);
        list.push(o.imageUrl);
      }
    }
    return list;
  }, [sortedOffers, bestOffer]);

  // Descubrimiento: otros productos del mismo equipo (cualquier tipo o
  // temporada), y -- solo si el usuario ya eligió una talla concreta --
  // otros productos que tengan esa talla disponible en su país.
  const sameTeamProducts = useMemo(
    () =>
      products
        .filter((p) => p.id !== product.id && p.teamKey === product.teamKey)
        .slice(0, 10),
    [product.id, product.teamKey]
  );
  const sameSizeProducts = useMemo(() => {
    if (!selectedSize) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          availableSizesForCountry(p, countryCode).includes(selectedSize)
      )
      .slice(0, 10);
  }, [product.id, selectedSize, countryCode]);

  const isRetro = isVintageRetro(product);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 pb-28 lg:pb-10">
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
          <div className="relative">
            <span className="vintage-plaque absolute left-4 top-4 z-10 rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
              {product.season}
            </span>
            <button
              onClick={() => {
                triggerHaptic();
                toggleFavorite(product.id);
              }}
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
            <JerseyGallery
              photos={photos}
              alt={displayName}
              colorHex={product.colorHex}
              colorHexSecondary={product.colorHexSecondary}
              jerseyPattern={product.jerseyPattern}
            />
          </div>
          {photos.length === 0 && (
            <p className="mt-3 text-center text-xs text-[#9a9a94]">
              {t.detail.photoPlaceholder}
            </p>
          )}

          {/* Badges de tipo de producto, siempre derivadas de datos reales
              (temporada/tipo/edad/retro/mejor oferta), nunca texto libre. */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {/* La categoría solo se muestra cuando no es engañosa: si el
                typeKey es "retro" pero la temporada no es vintage de
                verdad (isRetro), mostrar "Retro" acá confundiría al
                usuario -- se omite en vez de mostrar una etiqueta que no
                corresponde. */}
            {!(product.typeKey === "retro" && !isRetro) && (
              <span className="rounded-full border border-[#C9A24B]/40 bg-white/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3a3a36]">
                {type}
              </span>
            )}
            {ageGroup !== "men" && (
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: ageGroup === "kids" ? "#1F6F4C" : "#DB2777" }}
              >
                {ageGroup === "kids" ? t.search.ageGroupKids : t.search.ageGroupWomen}
              </span>
            )}
            {isRetro && (
              <span className="rounded-full bg-[#7C3AED]/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7C3AED]">
                {t.detail.retroBadge}
              </span>
            )}
          </div>
        </div>

        {/* Right: hunter column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-card-title text-xl leading-tight text-[#1a1a1a] sm:text-2xl lg:text-3xl">
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
              <div id={OFFERS_SECTION_ID} className="scroll-mt-24">
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
                  {/* Las ofertas agotadas (inStock: false) no se muestran --
                      si ya no existe la oferta, no tiene sentido dejarla
                      atenuada en la lista. Las que sí siguen en stock pero
                      no envían al país del usuario se mantienen visibles
                      con el sello "no disponible en {país}" (más abajo),
                      porque ahí sí hay algo real que explicar. */}
                  {sortedOffers.filter((offer) => offer.inStock).length === 0 && (
                    <p className="text-sm text-[#8a8a84]">{t.detail.allSoldOut}</p>
                  )}
                  {sortedOffers.filter((offer) => offer.inStock).map((offer) => {
                    const ships = shipsHere(offer);
                    const match = offer.inStock && ships && matchesSize(offer);
                    const isBest = offer.store === bestStore && match;
                    // Cuando eBay devolvió un costo real de envío (+ impuestos
                    // si aplica) en la misma moneda que el precio del
                    // producto, se suma directo al TOTAL en vez de quedar
                    // solo como un dato informativo aparte -- si la moneda
                    // no coincide (eBay a veces localiza el envío a la
                    // moneda del país de destino), no se suman números de
                    // monedas distintas: se mantiene el total con el
                    // placeholder minado, y la línea de abajo sigue
                    // mostrando el dato real por separado.
                    const liveCost = offer.store === "eBay" ? liveEbayCosts[offer.url] : null;
                    const liveTotal =
                      liveCost && liveCost.currency === offer.currency
                        ? offer.price + liveCost.shipping + (liveCost.importCharges ?? 0)
                        : null;
                    const displayTotal = liveTotal ?? offerTotal(offer);
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
                              <p className="font-card-title text-base tracking-wide text-[#1B3B2B]">{offer.store}</p>
                              {/* Fila de badges con altura reservada fija -- así todas
                                  las ofertas guardan el mismo ritmo vertical, tengan o
                                  no badge, en vez de que el nombre de la tienda salte
                                  de línea distinto según cuántos badges le tocaron. */}
                              <div className="flex min-h-[20px] flex-wrap items-center gap-1.5">
                                {isBest && (
                                  <span className="rounded-full bg-[#B45309] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                    {t.detail.bestPriceBadge}
                                  </span>
                                )}
                                {offer.store === "FansJerseyHub" && (
                                  <span className="rounded-full bg-[#B45309]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                                    {t.detail.replicaBadge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#a8926a]">
                                {offer.title ? translateTitleVocabulary(offer.title, locale) : `${team} ${type}`}
                              </p>
                              {!ships ? null : !matchesSize(offer) ? (
                                <p className="text-xs text-[#b3aa8f]">
                                  {t.detail.notAvailableInSize.replace("{size}", selectedSize ?? "")}
                                </p>
                              ) : (
                                <>
                                  <p className="text-xs text-[#675c44]">
                                    {formatOfferMoney(offer.price, offer.currency)} + {formatOfferMoney(offer.shipping, offer.currency)} {t.detail.shipping.toLowerCase()}
                                    {offer.sizes.length > 0 && (
                                      <> · {offer.sizes.join(", ")}</>
                                    )}
                                  </p>
                                  {offer.store === "eBay" && (
                                    <p className="text-[11px] text-[#9C7A2E]">
                                      {liveEbayCosts[offer.url] ? (
                                        <>
                                          {t.detail.realShippingTo.replace("{country}", country.name[locale])}:{" "}
                                          {formatMaybeKnownMoney(
                                            liveEbayCosts[offer.url]!.shipping,
                                            liveEbayCosts[offer.url]!.currency
                                          )}
                                          {liveEbayCosts[offer.url]!.importCharges != null && (
                                            <>
                                              {" + "}
                                              {formatMaybeKnownMoney(
                                                liveEbayCosts[offer.url]!.importCharges!,
                                                liveEbayCosts[offer.url]!.currency
                                              )}{" "}
                                              {t.detail.importCharges.toLowerCase()}
                                            </>
                                          )}
                                          {liveTotal != null && <> ({t.detail.includedInTotal})</>}
                                        </>
                                      ) : (
                                        t.detail.checkingRealShipping
                                      )}
                                    </p>
                                  )}
                                </>
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
                                {formatOfferMoney(displayTotal, offer.currency)}
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

      <DiscoveryCarousel
        eyebrow={t.detail.sameTeamEyebrow}
        title={t.detail.sameTeamTitle}
        products={sameTeamProducts}
      />
      <DiscoveryCarousel
        eyebrow={t.detail.sameSizeEyebrow}
        title={t.detail.sameSizeTitle}
        products={sameSizeProducts}
      />

      {reportOpen && (
        <ReportProductModal
          productId={product.id}
          productUrl={typeof window !== "undefined" ? window.location.href : ""}
          onClose={() => setReportOpen(false)}
        />
      )}

      {/* Barra fija inferior en mobile: precio mínimo siempre a la vista
          mientras se navega la página, con acceso directo a la
          comparativa completa sin tener que buscarla. */}
      {bestOffer && (
        <div className="shadow-vintage-lg fixed inset-x-0 bottom-0 z-40 border-t border-[#C9A24B]/30 bg-[#fffdf8]/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#a8926a]">
                {t.detail.from}
              </p>
              <p className="text-lg font-semibold text-[#B45309]">
                {(() => {
                  const bestLive = bestOffer.store === "eBay" ? liveEbayCosts[bestOffer.url] : null;
                  const bestLiveTotal =
                    bestLive && bestLive.currency === bestOffer.currency
                      ? bestOffer.price + bestLive.shipping + (bestLive.importCharges ?? 0)
                      : null;
                  return formatOfferMoney(bestLiveTotal ?? offerTotal(bestOffer), bestOffer.currency);
                })()}
              </p>
            </div>
            <a
              href={`#${OFFERS_SECTION_ID}`}
              className="flex items-center gap-1.5 rounded-full bg-[#1B3B2B] px-4 py-2.5 text-sm font-medium text-[#F3E9C9]"
            >
              {t.detail.viewFullComparison}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
