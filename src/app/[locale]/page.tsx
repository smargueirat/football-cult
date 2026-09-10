"use client";

import SearchExplorer from "@/components/SearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import HeroCarousel from "@/components/HeroCarousel";
import CategorySections from "@/components/CategorySections";
import PriceDropsSection from "@/components/PriceDropsSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Hero: carrusel dinámico que va rotando entre las secciones
            reales del catálogo (selecciones, clubes, retro, mujer,
            niños, botas), cada una con una foto real de una oferta
            cargada -- reemplaza la placa chica de siempre. */}
        <section className="mx-auto w-full max-w-[1800px] px-4 pt-3 sm:px-8 sm:pt-6">
          <HeroCarousel />
        </section>

        <section className="mx-auto w-full max-w-[1800px] px-4 pt-4 sm:px-8">
          <CategorySections />
        </section>

        <PriceDropsSection />

        {/* Search + results: mezcla de todo por defecto (camisetas y
            botas, ordenadas por relevancia), con filtros para acotar. */}
        <section id="catalogo" className="mx-auto w-full max-w-[1800px] flex-1 scroll-mt-20 px-4 pb-24 pt-6 sm:px-8">
          <SearchExplorer />
        </section>

        {/* Steps */}
        <section className="vintage-dark border-y border-[#C9A24B]/20">
          <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-3 sm:gap-10 sm:px-8 sm:py-20">
            {[
              { title: t.steps.title1, text: t.steps.text1 },
              { title: t.steps.title2, text: t.steps.text2 },
              { title: t.steps.title3, text: t.steps.text3 },
            ].map((step, i) => (
              <div key={step.title} className="flex flex-col items-start gap-2">
                <span className="vintage-plaque flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                  0{i + 1}
                </span>
                <h3 className="font-card-title mt-1 text-xl text-[#F3E9C9]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#B8AF98]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FloatingFilterButton />
    </>
  );
}
