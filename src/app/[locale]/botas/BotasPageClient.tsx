"use client";

import Link from "@/lib/i18n/LocaleLink";
import { bootProducts } from "@/data/boots";
import SearchExplorer from "@/components/SearchExplorer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Antes: grid propio, sin buscador ni filtros -- viable con 71 modelos,
// roto con los 1863 actuales (pedido explícito del usuario: "hay que
// ponerle todos los filtros a la sección de las botas"). Reusa
// SearchExplorer con forcedSection="boots", el mismo patrón que ya usan
// las páginas de camisetas por categoría (ver CategoryCatalogPage.tsx) --
// da buscador, filtros de marca/tienda/precio y el "Ver más" paginado
// gratis, sin mantener una segunda implementación en paralelo.
export default function BotasPageClient() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{t.botas.pageTitle}</h1>
      <p className="mt-1 text-sm text-[#675c44]">
        {t.botas.pageSubtitle.replace("{n}", String(bootProducts.length))}
      </p>
      <div className="mt-5">
        <SearchExplorer forcedSection="boots" />
      </div>
    </div>
  );
}
