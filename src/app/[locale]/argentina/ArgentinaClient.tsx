"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ArgentinaClient() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{t.argentina.title}</h1>
      <div className="vintage-card flex flex-col gap-4 rounded-3xl p-8 text-[#3a3a36]">
        <p>{t.argentina.intro}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">{t.argentina.comparisonTitle}</h2>
        <p>{t.argentina.comparisonText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">{t.argentina.retroTitle}</h2>
        <p>{t.argentina.retroText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">{t.argentina.heritageTitle}</h2>
        <p>{t.argentina.heritageText}</p>
        <p className="mt-2 border-t border-[#C9A24B]/25 pt-4 text-sm text-[#675c44]">
          {t.argentina.note}
        </p>
      </div>
    </div>
  );
}
