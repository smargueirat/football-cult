"use client";

import SearchExplorer from "@/components/SearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import FeaturedSection from "@/components/FeaturedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Hero: banner vintage inspirado en el escudo dorado */}
        <section className="mx-auto w-full max-w-6xl px-3 pt-3 sm:px-6 sm:pt-6">
          <div className="vintage-banner relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl px-6 py-4 text-center sm:gap-1.5 sm:rounded-3xl sm:px-10 sm:py-5">
            <div className="vintage-banner-rays absolute inset-0" aria-hidden />
            <span className="font-tagline relative text-[10px] uppercase text-[#9C7A2E] sm:text-xs">
              {t.hero.eyebrow}
            </span>
            <h1 className="font-vintage relative text-lg leading-tight text-[#1B3B2B] sm:text-2xl">
              {t.hero.title}
            </h1>
            <p className="relative max-w-xl text-xs text-[#6b5f47] sm:text-sm">
              {t.hero.subtitle}
            </p>
            <a
              href="#catalogo"
              className="shadow-vintage-md relative mt-1 inline-flex items-center gap-2 rounded-full border border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2A2410] transition-transform hover:scale-[1.03] sm:text-xs"
            >
              {t.hero.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>

        <FeaturedSection />

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
