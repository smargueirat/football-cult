"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/translations";
import { LOCALES, isLocale } from "@/lib/i18n/locales";

const LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  it: "Italiano",
};

const SHORT: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
  fr: "FR",
  it: "IT",
};

const COOKIE_KEY = "football-cult-locale";

// Antes eran 5 botones siempre visibles (ES EN PT FR IT en fila) --
// ocupaba bastante ancho en el header y en mobile chocaba con el
// nombre "Football Cult" al lado del logo. Un solo botón + desplegable
// (mismo patrón de click-afuera-para-cerrar que SectionsMenu) ocupa una
// fracción del espacio.
export default function LanguageSwitcher() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstSegment = pathname.split("/")[1];
  const rest = isLocale(firstSegment) ? pathname.slice(firstSegment.length + 1) : pathname;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full border border-[#C9A24B]/30 bg-white px-2.5 py-1 text-xs font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
      >
        {SHORT[locale]}
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="solid-panel absolute right-0 top-full mt-2 w-40 rounded-2xl border border-[#C9A24B]/25 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]"
        >
          {LOCALES.map((code) => (
            <NextLink
              key={code}
              href={`/${code}${rest}`}
              onClick={() => {
                document.cookie = `${COOKIE_KEY}=${code}; path=/; max-age=31536000; samesite=lax`;
                setOpen(false);
              }}
              aria-pressed={locale === code}
              className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                locale === code
                  ? "bg-[#1B3B2B] text-[#F3E9C9]"
                  : "text-[#1a1a1a] hover:bg-black/[0.03]"
              }`}
            >
              {LABELS[code]}
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}
