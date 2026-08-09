"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrivacidadClient() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{t.privacy.title}</h1>
      <div className="vintage-card rounded-3xl p-8 text-[#3a3a36]">
        <p>{t.privacy.updated}</p>
        <p>{t.privacy.intro}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.privacy.collectTitle}
        </h2>
        <p>{t.privacy.collectText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.privacy.affiliateTitle}
        </h2>
        <p>{t.privacy.affiliateText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.privacy.thirdPartyTitle}
        </h2>
        <p>{t.privacy.thirdPartyText}</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">
          {t.privacy.contactTitle}
        </h2>
        <p>
          {t.privacy.contactText}{" "}
          <a
            href="mailto:contact@football-cult.com"
            className="text-[#1F6F4C] underline"
          >
            contact@football-cult.com
          </a>
          .
        </p>
        <p className="text-sm text-[#8a7a5a]">{t.privacy.note}</p>
      </div>
    </div>
  );
}
