"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ItaliaClient() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{t.italy.title}</h1>
      <div className="vintage-card flex flex-col gap-4 rounded-3xl p-8 text-[#3a3a36]">
        <p>{t.italy.intro}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">{t.italy.comparisonTitle}</h2>
        <p>{t.italy.comparisonText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">{t.italy.retroTitle}</h2>
        <p>{t.italy.retroText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">{t.italy.heritageTitle}</h2>
        <p>{t.italy.heritageText}</p>
        <p className="mt-2 border-t border-[#C9A24B]/25 pt-4 text-sm text-[#675c44]">
          {t.italy.note}
        </p>
      </div>
    </div>
  );
}
