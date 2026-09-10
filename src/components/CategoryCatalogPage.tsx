"use client";

import Link from "@/lib/i18n/LocaleLink";
import SearchExplorer from "./SearchExplorer";
import { AgeGroup, CategoryKey, TypeKey } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Props {
  // Índice en t.heroSlides (mismo orden que src/lib/sections.ts) -- el
  // título/subtítulo de la sección se toma de ahí, ya traducido a los 5
  // idiomas, en vez de duplicar el mismo texto acá hardcodeado.
  sectionIndex: number;
  category?: CategoryKey;
  type?: TypeKey;
  ageGroup?: AgeGroup;
}

// Página delgada para cada sección de camisetas (clubes, selecciones,
// retro, mujer, niños): reusa el mismo SearchExplorer del home, pero con
// el filtro de esa sección FORZADO vía props en vez de vía un efecto que
// escribe en el contexto compartido -- un efecto solo corre después de
// hidratar, así que el HTML servido (y lo que ve un crawler, o cualquier
// curl/fetch) mostraría el catálogo entero sin filtrar por un instante
// antes de "saltar" a lo correcto. Al forzarlo por prop, el filtro es
// correcto ya en el primer render, tanto en el server como en el
// cliente.
export default function CategoryCatalogPage({ sectionIndex, category, type, ageGroup }: Props) {
  const { t } = useLanguage();
  const slide = t.heroSlides[sectionIndex];

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
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{slide?.title}</h1>
      <p className="mt-1 text-sm text-[#675c44]">{slide?.subtitle}</p>
      <div className="mt-5">
        <SearchExplorer forcedCategory={category} forcedType={type} forcedAgeGroup={ageGroup} forcedSection="jerseys" />
      </div>
    </div>
  );
}
