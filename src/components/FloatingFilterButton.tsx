"use client";

import { useEffect, useState } from "react";
import { SEASONS, TypeKey, typeNames } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import Chip from "./Chip";

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper"];

export default function FloatingFilterButton() {
  const { locale, t } = useLanguage();
  const {
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    seasonFilter,
    setSeasonFilter,
    activeFilterCount,
  } = useSearchFilter();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="solid-panel flex w-64 flex-col gap-4 rounded-2xl border border-black/[0.06] p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
          <div>
            <p className="mb-2 text-xs text-[#9a9a94]">{t.nav.categories}</p>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} accent="amber">
                {t.search.allCategories}
              </Chip>
              <Chip active={categoryFilter === "national"} onClick={() => setCategoryFilter("national")} accent="amber">
                {t.search.categoryNational}
              </Chip>
              <Chip active={categoryFilter === "club"} onClick={() => setCategoryFilter("club")} accent="amber">
                {t.search.categoryClubs}
              </Chip>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#9a9a94]">{t.search.typeLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                {t.search.allCategories}
              </Chip>
              {TYPE_FILTERS.map((key) => (
                <Chip key={key} active={typeFilter === key} onClick={() => setTypeFilter(key)}>
                  {typeNames[key][locale]}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#9a9a94]">{t.search.seasonLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={seasonFilter === "all"} onClick={() => setSeasonFilter("all")}>
                {t.search.allCategories}
              </Chip>
              {SEASONS.map((season) => (
                <Chip key={season} active={seasonFilter === season} onClick={() => setSeasonFilter(season)}>
                  {season}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="glass-panel relative flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] text-[#1a1a1a] shadow-lg transition-transform hover:scale-105"
        aria-label={t.search.typeLabel}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h18M6 12h12M10 20h4"
          />
        </svg>
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-[9px] font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
