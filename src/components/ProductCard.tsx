"use client";

import { useState } from "react";
import { Product, bestPrice, teamNames, typeNames } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function formatPrice(price: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-ES", {
    style: "currency",
    currency,
  }).format(price);
}

export default function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const best = bestPrice(product);
  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
  const otherOffers = sortedOffers.filter((o) => o !== best);
  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)]">
      <div
        className="relative flex h-16 items-center justify-center overflow-hidden text-xs font-semibold text-white sm:h-20"
        style={{
          background: `linear-gradient(135deg, ${product.colorHex}, #05060a)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/0" />
        <span className="relative truncate px-2 tracking-wide">
          {team} · {type}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="truncate text-sm font-semibold text-zinc-50 sm:text-base">
          {team} {type} {product.season}
        </h3>

        {best ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                {t.product.bestPrice}
              </p>
              <p className="text-gradient truncate text-lg font-bold sm:text-xl">
                {formatPrice(best.price, best.currency, locale)}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {t.product.in} {best.store}
              </p>
            </div>
            <a
              href={best.url}
              className="shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-2 text-xs font-medium text-black transition-opacity hover:opacity-90 sm:px-4 sm:text-sm"
            >
              {t.product.buy}
            </a>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">{t.product.outOfStockLabel}</p>
        )}

        {otherOffers.length > 0 && (
          <div className="mt-1">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-medium text-zinc-400 underline-offset-2 hover:text-cyan-300 hover:underline"
            >
              {expanded
                ? t.product.hideStores
                : t.product.viewStores.replace("{n}", String(otherOffers.length))}
            </button>

            {expanded && (
              <ul className="mt-2 flex flex-col gap-2 text-sm">
                {otherOffers.map((offer) => (
                  <li
                    key={offer.store}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
                  >
                    <span
                      className={
                        offer.inStock
                          ? "truncate text-zinc-300"
                          : "truncate text-zinc-600 line-through"
                      }
                    >
                      {offer.store}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-medium text-zinc-50">
                        {formatPrice(offer.price, offer.currency, locale)}
                      </span>
                      <a
                        href={offer.url}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          offer.inStock
                            ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:opacity-90"
                            : "pointer-events-none bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {offer.inStock ? t.product.buy : t.product.soldOut}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
