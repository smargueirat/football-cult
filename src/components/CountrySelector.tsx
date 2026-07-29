"use client";

import { useState } from "react";
import { countries } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCountry } from "@/lib/country/CountryContext";

export default function CountrySelector() {
  const { locale, t } = useLanguage();
  const { country, setCountryCode } = useCountry();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.shipTo}
        className="flex h-8 items-center gap-1 rounded-full px-2 text-sm text-[#1a1a1a] transition-colors hover:bg-black/[0.05] sm:h-9"
      >
        <span className="text-base leading-none">{country.flag}</span>
        <span className="hidden text-xs font-medium text-[#5b5b57] md:inline">
          {country.code}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="solid-panel absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-black/[0.06] p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
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
                    <span className="text-xs text-[#9a9a94]">{c.currency}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t border-black/[0.06] px-1 pt-2 text-[11px] text-[#9a9a94]">
              {t.countryPanel.note}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
