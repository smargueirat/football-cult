"use client";

import BackToCatalogLink from "./BackToCatalogLink";
import SearchExplorer from "./SearchExplorer";
import type { AgeGroup, CategoryKey, TypeKey } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GUIDE_UI } from "@/lib/guideUi";

interface Props {
  // Índice en t.heroSlides (mismo orden que src/lib/sections.ts) -- el
  // título/subtítulo de la sección se toma de ahí, ya traducido a los 5
  // idiomas, en vez de duplicar el mismo texto acá hardcodeado.
  sectionIndex: number;
  category?: CategoryKey;
  type?: TypeKey;
  ageGroup?: AgeGroup;
  /** Guía propia relevante para esta sección, si la hay: es contenido que
   *  ya existe en los cinco idiomas y al que solo se llegaba por el pie.
   *  Solo el slug: el texto del enlace vive en translations, porque es
   *  este componente el que conoce el idioma. */
  guideSlug?: "que-es-una-camiseta-retro" | "camisetas-mundial-2026";
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
export default function CategoryCatalogPage({ sectionIndex, category, type, ageGroup, guideSlug }: Props) {
  const { t, locale } = useLanguage();
  const slide = t.heroSlides[sectionIndex];

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <BackToCatalogLink />
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{slide?.title}</h1>
      <p className="mt-1 text-sm text-[#675c44]">{slide?.subtitle}</p>
      {guideSlug && (
        <p className="mt-2 text-sm">
          <a
            className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2 transition-colors hover:text-[#8a6a1f]"
            href={`/${locale}/guia/${guideSlug}`}
          >
            {guideSlug === "que-es-una-camiseta-retro" ? t.retroGuideLink : GUIDE_UI[locale].worldCup} →
          </a>
        </p>
      )}
      <div className="mt-5">
        <SearchExplorer forcedCategory={category} forcedType={type} forcedAgeGroup={ageGroup} forcedSection="jerseys" />
      </div>
    </div>
  );
}
