"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/translations";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="glass flex items-center rounded-full p-0.5 text-xs font-medium">
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLocale(opt.code)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === opt.code
              ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
          aria-pressed={locale === opt.code}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
