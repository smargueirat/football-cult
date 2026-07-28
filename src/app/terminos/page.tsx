"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Terminos() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t.terms.title}</h1>
      <div className="glass flex flex-col gap-4 rounded-3xl p-8 text-zinc-300">
        <p>{t.terms.updated}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.terms.whatTitle}
        </h2>
        <p>{t.terms.whatText}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.terms.accuracyTitle}
        </h2>
        <p>{t.terms.accuracyText}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.terms.ordersTitle}
        </h2>
        <p>{t.terms.ordersText}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.terms.affiliateTitle}
        </h2>
        <p>{t.terms.affiliateText}</p>
        <p className="text-sm text-zinc-500">{t.terms.note}</p>
      </div>
    </div>
  );
}
