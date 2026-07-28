"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Privacidad() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t.privacy.title}</h1>
      <div className="glass flex flex-col gap-4 rounded-3xl p-8 text-zinc-300">
        <p>{t.privacy.updated}</p>
        <p>{t.privacy.intro}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.privacy.collectTitle}
        </h2>
        <p>{t.privacy.collectText}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.privacy.affiliateTitle}
        </h2>
        <p>{t.privacy.affiliateText}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.privacy.thirdPartyTitle}
        </h2>
        <p>{t.privacy.thirdPartyText}</p>
        <h2 className="text-xl font-semibold text-zinc-50">
          {t.privacy.contactTitle}
        </h2>
        <p>
          {t.privacy.contactText}{" "}
          <a
            href="mailto:hola@footballcult.example"
            className="text-cyan-300 underline"
          >
            hola@footballcult.example
          </a>
          .
        </p>
        <p className="text-sm text-zinc-500">{t.privacy.note}</p>
      </div>
    </div>
  );
}
