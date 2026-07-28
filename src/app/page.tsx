"use client";

import Image from "next/image";
import SearchExplorer from "@/components/SearchExplorer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060a]/20 via-[#05060a]/50 to-[#05060a]" />
          <div className="absolute -left-32 top-10 h-72 w-72 animate-float rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -right-24 top-40 h-80 w-80 animate-float rounded-full bg-violet-500/20 blur-3xl [animation-delay:2s]" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-28 text-center sm:py-36">
          <span className="glass animate-glow-pulse rounded-full px-4 py-1 text-xs font-medium tracking-wide text-cyan-300">
            {t.hero.badge}
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            {t.hero.titlePre}{" "}
            <span className="font-display text-gradient block sm:inline">
              {t.hero.titleHighlight}
            </span>{" "}
            <span className="block text-2xl font-normal text-zinc-300 sm:inline sm:text-3xl">
              {t.hero.titlePost}
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400">{t.hero.subtitle}</p>
        </div>
      </section>

      {/* Search + results */}
      <section className="relative mx-auto -mt-16 w-full max-w-6xl flex-1 px-6 pb-24 sm:-mt-20">
        <div className="glass rounded-3xl p-6 shadow-[0_0_60px_-15px_rgba(34,211,238,0.25)] sm:p-10">
          <SearchExplorer />
        </div>
      </section>

      {/* Feature banner */}
      <section className="relative overflow-hidden border-y border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/images/player-celebrating.jpg"
            alt="Jugador celebrando un gol"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05060a] via-[#05060a]/70 to-[#05060a]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3">
          {[
            { title: t.steps.title1, text: t.steps.text1 },
            { title: t.steps.title2, text: t.steps.text2 },
            { title: t.steps.title3, text: t.steps.text3 },
          ].map((step, i) => (
            <div key={step.title} className="glass rounded-2xl p-6">
              <span className="text-gradient text-2xl font-bold">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
