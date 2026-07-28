"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SobreNosotros() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{t.about.title}</h1>
      <div className="rounded-3xl border border-black/[0.06] bg-white p-8 shadow-sm text-[#3a3a36]">
        <p>{t.about.p1}</p>
        <p>{t.about.p2}</p>
        <p>{t.about.p3}</p>
      </div>
    </div>
  );
}
