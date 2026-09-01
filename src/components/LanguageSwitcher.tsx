"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/translations";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-[#C9A24B]/30 bg-white p-0.5 text-xs font-medium">
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLocale(opt.code)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === opt.code
              ? "bg-[#1B3B2B] text-[#F3E9C9]"
              : "text-[#675c44] hover:text-[#1a1a1a]"
          }`}
          aria-pressed={locale === opt.code}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
