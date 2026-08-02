"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactoClient() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{t.contact.title}</h1>
      <div className="vintage-card rounded-3xl p-8 text-[#3a3a36]">
        <p>{t.contact.p1}</p>
        <p>
          {t.contact.emailLabel}:{" "}
          <a
            href="mailto:hola@footballcult.example"
            className="font-medium text-[#1F6F4C] underline"
          >
            hola@footballcult.example
          </a>
        </p>
        <p className="text-sm text-[#8a7a5a]">{t.contact.note}</p>
      </div>
    </div>
  );
}
