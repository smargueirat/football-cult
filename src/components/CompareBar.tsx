"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { useCountry } from "@/lib/country/CountryContext";
import { displayTitleForCountry, findProduct, teamNames, typeNames } from "@/data/products";

export default function CompareBar() {
  const { locale, t } = useLanguage();
  const { countryCode } = useCountry();
  const { compareList, toggleCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const products = compareList
    .map((id) => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="vintage-card flex w-full max-w-xl items-center gap-3 rounded-2xl p-3 shadow-lg">
        <span className="font-tagline hidden shrink-0 text-xs not-italic text-[#5b5442] sm:block">
          {t.compare.barTitle}
        </span>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => {
            const displayName =
              displayTitleForCountry(product, countryCode, locale) ??
              `${teamNames[product.teamKey][locale]} ${typeNames[product.typeKey][locale]}`;
            return (
            <span
              key={product.id}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#C9A24B]/30 bg-white/70 px-3 py-1.5 text-xs text-[#3a3a36]"
            >
              <span className="max-w-[14rem] truncate">{displayName}</span>
              <button
                onClick={() => toggleCompare(product.id)}
                aria-label={t.compare.remove}
                className="text-[#8a7a5a] hover:text-[#1a1a1a]"
              >
                ✕
              </button>
            </span>
            );
          })}
        </div>
        <button
          onClick={clearCompare}
          className="hidden shrink-0 text-xs text-[#8a7a5a] hover:text-[#1a1a1a] sm:block"
        >
          {t.compare.clearAll}
        </button>
        <Link
          href="/comparar"
          className="shrink-0 rounded-full bg-[#1B3B2B] px-4 py-2 text-xs font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
        >
          {t.compare.viewComparison}
        </Link>
      </div>
    </div>
  );
}
