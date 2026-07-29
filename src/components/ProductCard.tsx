"use client";

import Link from "next/link";
import {
  Product,
  SIZES,
  availableSizes,
  bestOffer,
  offerTotal,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import JerseyIcon from "./JerseyIcon";

function formatPrice(price: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-ES", {
    style: "currency",
    currency,
  }).format(price);
}

export default function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const best = bestOffer(product);
  const storeCount = product.offers.filter((o) => o.inStock).length;
  const sizes = availableSizes(product);
  const sizeRange =
    sizes.length > 0
      ? sizes[0] === sizes[sizes.length - 1]
        ? sizes[0]
        : `${sizes[0]}–${sizes[sizes.length - 1]}`
      : SIZES[0];
  const team = teamNames[product.teamKey][locale];
  const type = typeNames[product.typeKey][locale];

  return (
    <Link
      href={`/camiseta/${product.id}`}
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className="relative flex aspect-[4/5] items-center justify-center p-6"
        style={{
          background: `linear-gradient(135deg, #ffffff, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
        }}
      >
        <JerseyIcon
          className="h-2/3 w-2/3 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          primary={product.colorHex}
          secondary={product.colorHexSecondary}
          pattern={product.jerseyPattern}
        />

        {best && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-br from-[#FDE68A] to-[#D97706] px-3 py-1.5 text-sm font-semibold text-[#4A2E04] shadow-md">
            <span className="text-xs">🥇</span>
            {formatPrice(offerTotal(best), best.currency, locale)}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 p-3 sm:p-4">
        <h3 className="text-sm font-medium leading-snug text-[#1a1a1a] sm:text-base">
          {team} {type} {product.season}
        </h3>
        {best ? (
          <p className="text-xs text-[#8a8a84]">
            {t.product.inStores.replace("{n}", String(storeCount))} ·{" "}
            {t.product.sizesRange.replace("{range}", sizeRange)}
          </p>
        ) : (
          <p className="text-xs text-[#8a8a84]">{t.product.outOfStockLabel}</p>
        )}
      </div>
    </Link>
  );
}
