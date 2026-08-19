"use client";

import Link from "next/link";
import {
  Offer,
  Product,
  displayTitleForCountry,
  findProduct,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { useCountry } from "@/lib/country/CountryContext";
import { getDisplaySrc } from "@/lib/images";
import JerseyIcon from "@/components/JerseyIcon";
import CompareOfferRow from "@/components/CompareOfferRow";

interface CompareCard {
  key: string;
  productId: string;
  store: string;
  product: Product;
  offer: Offer;
  isBest: boolean;
}

export default function CompareClient() {
  const { locale, t } = useLanguage();
  const { countryCode } = useCountry();
  const { compareList, toggleCompare, clearCompare } = useCompare();

  // Cada entrada de compareList es un vendedor puntual de una camiseta
  // puntual (no "la camiseta en general") -- así se puede comparar entre
  // distintos proveedores de la MISMA camiseta, no solo entre camisetas
  // distintas. Si dos o más entradas comparten camiseta, marcamos la más
  // barata de ese grupo como "mejor precio".
  const cards: CompareCard[] = compareList
    .map((entry) => {
      const product = findProduct(entry.productId);
      const offer = product?.offers.find((o) => o.store === entry.store);
      if (!product || !offer) return null;
      return {
        key: `${entry.productId}-${entry.store}`,
        productId: entry.productId,
        store: entry.store,
        product,
        offer,
        isBest: false,
      };
    })
    .filter((c): c is CompareCard => c !== null);

  const byProduct = new Map<string, CompareCard[]>();
  for (const c of cards) {
    const list = byProduct.get(c.productId);
    if (list) list.push(c);
    else byProduct.set(c.productId, [c]);
  }
  for (const list of byProduct.values()) {
    if (list.length < 2) continue;
    const cheapest = list.reduce((a, b) => (offerTotal(a.offer) <= offerTotal(b.offer) ? a : b));
    cheapest.isBest = true;
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-card-title text-3xl text-[#1a1a1a] sm:text-4xl">
          {t.compare.pageTitle}
        </h1>
        {cards.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-sm text-[#675c44] hover:text-[#1a1a1a]"
          >
            {t.compare.clearAll}
          </button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl border border-[#C9A24B]/25 p-10 text-center">
          <p className="text-[#675c44]">{t.compare.empty}</p>
          <Link
            href="/"
            className="rounded-full bg-[#1F6F4C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18573c]"
          >
            {t.favoritesPage.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ key, productId, store, product, offer, isBest }) => {
            const team = teamNames[product.teamKey][locale];
            const type = typeNames[product.typeKey][locale];
            const photo = offer.imageUrl ?? product.offers.find((o) => o.imageUrl)?.imageUrl;
            const displayName =
              displayTitleForCountry(product, countryCode, locale) ?? `${team} ${type}`;

            return (
              <div key={key} className="vintage-card flex flex-col overflow-hidden rounded-2xl">
                <div
                  className="relative flex aspect-square items-center justify-center overflow-hidden p-8"
                  style={{
                    background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
                  }}
                >
                  {photo ? (
                    <img
                      src={getDisplaySrc(photo, 700)}
                      srcSet={`${getDisplaySrc(photo, 350)} 350w, ${getDisplaySrc(photo, 600)} 600w, ${getDisplaySrc(photo, 900)} 900w`}
                      sizes="(max-width: 640px) 90vw, 30vw"
                      alt={displayName}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : (
                    <JerseyIcon
                      className="h-2/3 w-2/3"
                      primary={product.colorHex}
                      secondary={product.colorHexSecondary}
                      pattern={product.jerseyPattern}
                    />
                  )}
                  <button
                    onClick={() => toggleCompare(productId, store)}
                    aria-label={t.compare.remove}
                    className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#675c44] hover:text-[#1a1a1a]"
                  >
                    ✕
                  </button>
                </div>
                <div className="vintage-divider" />
                <div className="flex flex-col gap-3 p-4">
                  <h2 className="font-card-title text-lg text-[#1a1a1a]">
                    {displayName}
                  </h2>
                  <CompareOfferRow offer={offer} countryCode={countryCode} isBest={isBest} />
                  <Link
                    href={`/camiseta/${productId}`}
                    className="mt-1 flex items-center justify-center rounded-full bg-[#1B3B2B] py-2 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
                  >
                    {t.compare.viewProduct}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
