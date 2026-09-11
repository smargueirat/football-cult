"use client";

import { useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { bootProducts } from "@/data/boots";
import BootCard from "@/components/BootCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CATALOG_PAGE_SIZE } from "@/lib/search/SearchFilterContext";

export default function BotasPageClient() {
  const { t } = useLanguage();
  // El catálogo de botas paso de 71 a ~1860 modelos reales (todas las
  // tiendas aprobadas) -- montar las 1860 cards de una sola vez rompía
  // exactamente lo que se acaba de arreglar en rendimiento. Mismo patrón
  // "Ver más" que ya usa SearchExplorer (visibleCount/CATALOG_PAGE_SIZE).
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);
  const visibleBoots = bootProducts.slice(0, visibleCount);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-8">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <div className="mb-6">
        <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">
          {t.botas.pageTitle}
        </h1>
        <p className="mt-2 text-sm text-[#675c44]">
          {t.botas.pageSubtitle.replace("{n}", String(bootProducts.length))}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 2xl:grid-cols-6">
        {visibleBoots.map((product, i) => (
          <BootCard key={product.id} boot={product} priority={i < 8} />
        ))}
      </div>
      {visibleCount < bootProducts.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + CATALOG_PAGE_SIZE)}
            className="rounded-full border border-[#C9A24B]/30 bg-white/70 px-6 py-2.5 text-sm font-medium text-[#1B3B2B] transition-colors hover:bg-[#C9A24B]/10"
          >
            {t.search.loadMore} ({bootProducts.length - visibleCount})
          </button>
        </div>
      )}
    </div>
  );
}
