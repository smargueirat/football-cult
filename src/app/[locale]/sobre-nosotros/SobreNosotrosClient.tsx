"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import LocaleLink from "@/lib/i18n/LocaleLink";

// Sin nombres de personas a propósito: los datos del titular que exige la
// LSSI viven en /aviso-legal (legalEntity.ts), y aquí solo se enlazan.
export default function SobreNosotrosClient() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{a.title}</h1>
      <div className="vintage-card flex flex-col gap-4 rounded-3xl p-8 text-[#3a3a36]">
        <p>{a.p1}</p>
        <p>{a.p2}</p>
        <p>{a.p3}</p>
        <h2 className="mt-2 text-xl font-semibold text-[#1a1a1a]">{a.howTitle}</h2>
        <ul className="list-disc space-y-2 pl-5">
          {a.how.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <p>{a.p4}</p>
        <p className="text-sm">
          {a.legalNote}{" "}
          <LocaleLink href="/aviso-legal" className="underline">
            {a.legalLink}
          </LocaleLink>
          {" · "}
          <LocaleLink href="/como-ganamos-dinero" className="underline">
            {a.moneyLink}
          </LocaleLink>
        </p>
      </div>
    </div>
  );
}
