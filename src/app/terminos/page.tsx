"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Terminos() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t.terms.title}</h1>
      <div className="rounded-3xl border border-black/[0.06] bg-white p-8 shadow-sm text-[#3a3a36]">
        <p>{t.terms.updated}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.terms.whatTitle}
        </h2>
        <p>{t.terms.whatText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.terms.accuracyTitle}
        </h2>
        <p>{t.terms.accuracyText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.terms.ordersTitle}
        </h2>
        <p>{t.terms.ordersText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.terms.affiliateTitle}
        </h2>
        <p>{t.terms.affiliateText}</p>
        <p className="text-sm text-[#8a8a84]">{t.terms.note}</p>
      </div>
    </div>
  );
}
