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
    <div className="flex items-center rounded-full border border-black/[0.08] bg-white p-0.5 text-xs font-medium">
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLocale(opt.code)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === opt.code
              ? "bg-[#1F6F4C] text-white"
              : "text-[#8a8a84] hover:text-[#1a1a1a]"
          }`}
          aria-pressed={locale === opt.code}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
