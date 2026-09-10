"use client";

import Link from "@/lib/i18n/LocaleLink";
import { bootProducts } from "@/data/boots";
import BootCard from "@/components/BootCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BotasPageClient() {
  const { t } = useLanguage();

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
        {bootProducts.map((product, i) => (
          <BootCard key={product.id} boot={product} priority={i < 8} />
        ))}
      </div>
    </div>
  );
}
