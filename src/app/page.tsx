"use client";

import SearchExplorer from "@/components/SearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Hero: banner vintage inspirado en el escudo dorado */}
        <section className="mx-auto w-full max-w-6xl px-3 pt-3 sm:px-6 sm:pt-8">
          <div className="vintage-banner relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl px-6 py-8 text-center sm:gap-3 sm:rounded-3xl sm:px-10 sm:py-12">
            <div className="vintage-banner-rays absolute inset-0" aria-hidden />
            <span className="font-tagline relative text-[11px] uppercase text-[#C9A24B] sm:text-sm">
              {t.hero.eyebrow}
            </span>
            <h1 className="font-vintage relative text-2xl leading-tight text-[#F3E9C9] sm:text-5xl">
              {t.hero.title}
            </h1>
            <p className="relative max-w-xl text-sm text-[#CFC7B0] sm:text-base">
              {t.hero.subtitle}
            </p>
            <a
              href="#catalogo"
              className="relative mt-2 inline-flex items-center gap-2 rounded-full border border-[#C9A24B] bg-gradient-to-b from-[#E7C567] to-[#B8923F] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#2A2410] shadow-md transition-transform hover:scale-[1.03] sm:text-sm"
            >
              {t.hero.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>

        {/* Search + results */}
        <section id="catalogo" className="mx-auto w-full max-w-6xl flex-1 scroll-mt-20 px-6 pb-24">
          <SearchExplorer />
        </section>

        {/* Steps */}
        <section className="border-t border-black/[0.06] bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3">
            {[
              { title: t.steps.title1, text: t.steps.text1 },
              { title: t.steps.title2, text: t.steps.text2 },
              { title: t.steps.title3, text: t.steps.text3 },
            ].map((step, i) => (
              <div key={step.title}>
                <span className="text-2xl font-semibold text-[#1F6F4C]">
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-[#1a1a1a]">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-[#6b6b66]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FloatingFilterButton />
    </>
  );
}
