"use client";

import { useState } from "react";
import { countries } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCountry } from "@/lib/country/CountryContext";
import Portal from "./Portal";

export default function CountrySelector() {
  const { locale, t } = useLanguage();
  const { country, setCountryCode } = useCountry();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.shipTo}
        className="flex h-8 items-center gap-1 rounded-full px-2 text-sm text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10 sm:h-9"
      >
        <span className="text-base leading-none">{country.flag}</span>
        <span className="hidden text-xs font-medium text-[#5b5b57] md:inline">
          {country.code}
        </span>
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="solid-panel fixed right-3 top-14 z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#C9A24B]/25 p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] sm:right-6 sm:top-16">
            <p className="mb-2 px-1 text-sm font-medium text-[#1a1a1a]">
              {t.countryPanel.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {countries.map((c) => (
                <li key={c.code}>
                  <button
                    onClick={() => {
                      setCountryCode(c.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors hover:bg-black/[0.04] ${
                      c.code === country.code ? "bg-[#1F6F4C]/10 text-[#1F6F4C]" : "text-[#1a1a1a]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{c.flag}</span>
                      {c.name[locale]}
                    </span>
                    <span className="text-xs text-[#8a7a5a]">{c.currency}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t border-[#C9A24B]/25 px-1 pt-2 text-[11px] text-[#8a7a5a]">
              {t.countryPanel.note}
            </p>
          </div>
        </Portal>
      )}
    </div>
  );
}
