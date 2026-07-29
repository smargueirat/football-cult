"use client";

import SearchExplorer from "@/components/SearchExplorer";
import FloatingFilterButton from "@/components/FloatingFilterButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-6 pb-4 pt-4 text-center sm:gap-6 sm:pb-20 sm:pt-28">
          <span className="hidden rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-[#5b5b57] sm:inline-block">
            {t.hero.badge}
          </span>
          <h1 className="max-w-3xl text-xl font-semibold leading-tight tracking-tight text-[#1a1a1a] sm:text-6xl">
            {t.hero.titlePre}{" "}
            <span className="text-[#B45309]">
              {t.hero.titleHighlight}
            </span>{" "}
            <span className="hidden font-normal text-[#6b6b66] sm:inline sm:text-3xl">
              {t.hero.titlePost}
            </span>
          </h1>
          <p className="hidden max-w-2xl text-lg text-[#6b6b66] sm:block">
            {t.hero.subtitle}
          </p>
        </section>

        {/* Search + results */}
        <section className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
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
