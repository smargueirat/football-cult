"use client";

import SearchExplorer from "@/components/SearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import HeroCarousel from "@/components/HeroCarousel";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Hero: carrusel dinámico que va rotando entre las secciones
            reales del catálogo (selecciones, clubes, retro, mujer,
            niños), cada una con una foto real de una oferta cargada --
            reemplaza la placa chica de siempre. */}
        <section className="mx-auto w-full max-w-6xl px-3 pt-3 sm:px-6 sm:pt-6">
          <HeroCarousel />
        </section>

        {/* Search + results */}
        <section id="catalogo" className="mx-auto w-full max-w-6xl flex-1 scroll-mt-20 px-6 pb-24 pt-6">
          <SearchExplorer />
        </section>

        {/* Steps */}
        <section className="vintage-dark border-y border-[#C9A24B]/20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3 sm:gap-10 sm:py-20">
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
