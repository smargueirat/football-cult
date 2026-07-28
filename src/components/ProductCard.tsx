"use client";

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
  const best = bestPrice(product);
  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)]">
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, ${product.colorHex}, #05060a)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/0" />
        <span className="relative tracking-wide">
          {team} · {type}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold text-zinc-50">
            {team} {type} {product.season}
          </h3>
          {best ? (
            <p className="text-sm text-zinc-400">
              {t.product.bestPrice}:{" "}
              <span className="text-gradient font-semibold">
                {formatPrice(best.price, best.currency, locale)}
              </span>{" "}
              {t.product.in} {best.store}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">{t.product.outOfStockLabel}</p>
          )}
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {sortedOffers.map((offer) => (
            <li
              key={offer.store}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
            >
              <span className={offer.inStock ? "text-zinc-300" : "text-zinc-600 line-through"}>
                {offer.store}
              </span>
              <div className="flex items-center gap-2">
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
      </div>
    </article>
  );
}
