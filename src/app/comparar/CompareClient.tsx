"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Product,
  bestOffer,
  findProduct,
  formatOfferMoney,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCompare } from "@/lib/compare/CompareContext";
import JerseyIcon from "@/components/JerseyIcon";

export default function CompareClient() {
  const { locale, t } = useLanguage();
  const { compareList, toggleCompare, clearCompare } = useCompare();

  const products = compareList
    .map((id) => findProduct(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-card-title text-3xl text-[#1a1a1a] sm:text-4xl">
          {t.compare.pageTitle}
        </h1>
        {products.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-sm text-[#8a7a5a] hover:text-[#1a1a1a]"
          >
            {t.compare.clearAll}
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl border border-[#C9A24B]/25 p-10 text-center">
          <p className="text-[#8a7a5a]">{t.compare.empty}</p>
          <Link
            href="/"
            className="rounded-full bg-[#1F6F4C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18573c]"
          >
            {t.favoritesPage.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const team = teamNames[product.teamKey][locale];
            const type = typeNames[product.typeKey][locale];
            const best = bestOffer(product);
            const photo = best?.imageUrl ?? product.offers.find((o) => o.imageUrl)?.imageUrl;
            const displayName = best?.title ?? `${team} ${type}`;

            return (
              <div key={product.id} className="vintage-card flex flex-col overflow-hidden rounded-2xl">
                <div
                  className="relative flex aspect-square items-center justify-center overflow-hidden p-8"
                  style={{
                    background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
                  }}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={displayName}
                      fill
                      sizes="(max-width: 640px) 90vw, 30vw"
                      className="object-contain"
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
                    onClick={() => toggleCompare(product.id)}
                    aria-label={t.compare.remove}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#8a7a5a] hover:text-[#1a1a1a]"
                  >
                    ✕
                  </button>
                </div>
                <div className="vintage-divider" />
                <div className="flex flex-col gap-3 p-4">
                  <h2 className="font-card-title text-lg text-[#1a1a1a]">
                    {displayName}
                  </h2>
                  <dl className="flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between border-b border-[#C9A24B]/15 pb-1.5">
                      <dt className="text-[#8a7a5a]">{t.compare.store}</dt>
                      <dd className="font-medium text-[#1a1a1a]">{best?.store ?? "—"}</dd>
                    </div>
                    <div className="flex justify-between border-b border-[#C9A24B]/15 pb-1.5">
                      <dt className="text-[#8a7a5a]">{t.compare.price}</dt>
                      <dd className="font-semibold text-[#B45309]">
                        {best ? formatOfferMoney(offerTotal(best), best.currency) : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#8a7a5a]">{t.compare.sizes}</dt>
                      <dd className="font-medium text-[#1a1a1a]">
                        {best?.sizes.join(", ") ?? "—"}
                      </dd>
                    </div>
                  </dl>
                  <Link
                    href={`/camiseta/${product.id}`}
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
