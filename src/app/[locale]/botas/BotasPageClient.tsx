"use client";

import dynamic from "next/dynamic";
import Link from "@/lib/i18n/LocaleLink";
import { bootProducts } from "@/data/boots";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// A diferencia del home (donde SearchExplorer es una sección más, ver
// LazySearchExplorer.tsx), acá ES el contenido principal de la página --
// no tiene sentido esconderlo detrás de un gate de scroll. dynamic() sin
// ssr:false igual code-splitea el catálogo (~1.1MB) a un chunk propio en
// vez de inflar el bundle de esta página, pero mantiene el SSR (el HTML
// servido ya trae el catálogo real, así que SEO/LCP no se resienten) --
// el `loading` solo se llegaría a ver en una navegación client-side, no
// en la carga inicial con HTML ya renderizado.
const SearchExplorer = dynamic(() => import("@/components/SearchExplorer"), {
  loading: () => <div className="h-16 w-full animate-pulse rounded-2xl bg-[#f6efdd]" />,
});

// Antes: grid propio, sin buscador ni filtros -- viable con 71 modelos,
// roto con los ~1740 actuales (pedido explícito del usuario: "hay que
// ponerle todos los filtros a la sección de las botas"). Reusa
// SearchExplorer con forcedSection="boots", el mismo patrón que ya usan
// las páginas de camisetas por categoría (ver CategoryCatalogPage.tsx) --
// da buscador, filtros de marca/talla/color/nivel/precio y el "Ver más"
// paginado gratis, sin mantener una segunda implementación en paralelo.
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
