"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Contacto() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t.contact.title}</h1>
      <div className="glass flex flex-col gap-4 rounded-3xl p-8 text-zinc-300">
        <p>{t.contact.p1}</p>
        <p>
          {t.contact.emailLabel}:{" "}
          <a
            href="mailto:hola@footballcult.example"
            className="font-medium text-cyan-300 underline"
          >
            hola@footballcult.example
          </a>
        </p>
        <p className="text-sm text-zinc-500">{t.contact.note}</p>
      </div>
    </div>
  );
}
