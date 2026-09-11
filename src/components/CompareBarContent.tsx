"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { useCountry } from "@/lib/country/CountryContext";
import { displayTitleForCountry, findProduct, teamNames, typeNames } from "@/data/products";
import { bootProducts } from "@/data/boots";

// Separado de CompareBar.tsx a propósito -- ver el comentario largo ahí.
// Este archivo (y sólo este) tiene el import real de products.ts, así
// que sólo se carga cuando alguien realmente puso algo a comparar.
//
// Un entry puede ser una camiseta o una bota -- mismo comportamiento
// pedido explícitamente por el usuario. Se resuelve contra el catálogo
// que corresponda.
export default function CompareBarContent() {
  const { locale, t } = useLanguage();
  const { countryCode } = useCountry();
  const { compareList, toggleCompare, clearCompare } = useCompare();

  const entries = compareList
    .map((entry) => {
      const product = findProduct(entry.productId);
      if (product) return { entry, kind: "jersey" as const, product };
      const boot = bootProducts.find((b) => b.id === entry.productId);
      if (boot) return { entry, kind: "boot" as const, boot };
      return null;
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="vintage-card flex w-full max-w-xl items-center gap-3 rounded-2xl p-3">
        <span className="font-tagline hidden shrink-0 text-xs not-italic text-[#5b5442] sm:block">
          {t.compare.barTitle}
        </span>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {entries.map((item) => {
            const displayName =
              item.kind === "boot"
                ? item.boot.model
                : displayTitleForCountry(item.product, countryCode, locale) ??
                  `${teamNames[item.product.teamKey][locale]} ${typeNames[item.product.typeKey][locale]}`;
            return (
            <span
              key={`${item.entry.productId}-${item.entry.store}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#C9A24B]/30 bg-white/70 px-3 py-1.5 text-xs text-[#3a3a36]"
            >
              <span className="flex max-w-[14rem] flex-col leading-tight">
                <span className="truncate">{displayName}</span>
                <span className="text-[10px] text-[#9a9a94]">{item.entry.store}</span>
              </span>
              <button
                onClick={() => toggleCompare(item.entry.productId, item.entry.store)}
                aria-label={t.compare.remove}
                className="text-[#675c44] hover:text-[#1a1a1a]"
              >
                ✕
              </button>
            </span>
            );
          })}
        </div>
        <button
          onClick={clearCompare}
          className="hidden shrink-0 text-xs text-[#675c44] hover:text-[#1a1a1a] sm:block"
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
