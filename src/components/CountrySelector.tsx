"use client";

import { useMemo, useRef, useState } from "react";
import { countries } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCountry } from "@/lib/country/CountryContext";
import Portal from "./Portal";
import { useAnchoredDropdown } from "@/lib/useAnchoredDropdown";

export default function CountrySelector() {
  const { locale, t } = useLanguage();
  const { country, setCountryCode } = useCountry();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const position = useAnchoredDropdown(buttonRef, open);

  const sorted = useMemo(
    () => [...countries].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale)),
    [locale]
  );

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return sorted;
    return sorted.filter(
      (c) =>
        c.name[locale].toLowerCase().includes(normalized) ||
        c.code.toLowerCase().includes(normalized) ||
        c.currency.toLowerCase().includes(normalized)
    );
  }, [search, locale, sorted]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
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
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpen(false);
              setSearch("");
            }}
          />
          <div
            style={{ top: position?.top ?? 56, right: position?.right ?? 12 }}
            className="solid-panel fixed z-50 flex w-72 max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-[#C9A24B]/25 p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
          >
            <p className="mb-2 px-1 text-sm font-medium text-[#1a1a1a]">
              {t.countryPanel.title}
            </p>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.countryPanel.searchPlaceholder}
              className="mb-2 w-full rounded-xl border border-[#C9A24B]/30 bg-[#FFFDF8] px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#a8926a] outline-none transition focus:border-[#1B3B2B]/40 focus:ring-2 focus:ring-[#1B3B2B]/10"
            />
            <ul className="flex max-h-72 flex-col gap-0.5 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-2 py-3 text-sm text-[#675c44]">{t.countryPanel.noMatches}</p>
              ) : (
                filtered.map((c) => (
                  <li key={c.code}>
                    <button
                      onClick={() => {
                        setCountryCode(c.code);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors hover:bg-[#C9A24B]/10 ${
                        c.code === country.code ? "bg-[#1F6F4C]/10 text-[#1F6F4C]" : "text-[#1a1a1a]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base leading-none">{c.flag}</span>
                        {c.name[locale]}
                      </span>
                      <span className="text-xs text-[#675c44]">{c.currency}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="mt-2 border-t border-[#C9A24B]/25 px-1 pt-2 text-[11px] text-[#675c44]">
              {t.countryPanel.note}
            </p>
          </div>
        </Portal>
      )}
    </div>
  );
}
