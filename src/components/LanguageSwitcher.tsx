"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/translations";
import { LOCALES, isLocale } from "@/lib/i18n/locales";

const LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
  fr: "FR",
  it: "IT",
};

const COOKIE_KEY = "football-cult-locale";

export default function LanguageSwitcher() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  const rest = isLocale(firstSegment) ? pathname.slice(firstSegment.length + 1) : pathname;

  return (
    <div className="flex items-center rounded-full border border-[#C9A24B]/30 bg-white p-0.5 text-xs font-medium">
      {LOCALES.map((code) => (
        <NextLink
          key={code}
          href={`/${code}${rest}`}
          onClick={() => {
            document.cookie = `${COOKIE_KEY}=${code}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === code
              ? "bg-[#1B3B2B] text-[#F3E9C9]"
              : "text-[#675c44] hover:text-[#1a1a1a]"
          }`}
          aria-pressed={locale === code}
        >
          {LABELS[code]}
        </NextLink>
      ))}
    </div>
  );
}
