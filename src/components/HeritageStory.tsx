"use client";

import { heritageFor } from "@/data/heritage";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Solo se muestra para el puñado de productos con entrada real en
// heritage.ts -- para el resto del catálogo no renderiza nada (ver el
// comentario en ese archivo sobre por qué no hay una anécdota genérica
// de relleno).
export default function HeritageStory({ productId }: { productId: string }) {
  const { locale, t } = useLanguage();
  const entry = heritageFor(productId);
  if (!entry) return null;

  return (
    <section className="mt-8 rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] px-5 py-5 shadow-vintage-sm sm:px-8 sm:py-6">
      <span className="font-tagline text-[10px] uppercase text-[#9C7A2E] sm:text-xs">
        {t.heritage.eyebrow}
      </span>
      <h2 className="font-vintage mt-0.5 text-lg text-[#1B3B2B] sm:text-2xl">{t.heritage.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#3a3222] sm:text-base">{entry.text[locale]}</p>
      <a
        href={entry.sourceUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-[#675c44] underline decoration-[#C9A24B]/60 underline-offset-2 hover:text-[#1B3B2B]"
      >
        {t.heritage.sourceLabel}: {entry.sourceLabel}
      </a>
    </section>
  );
}
