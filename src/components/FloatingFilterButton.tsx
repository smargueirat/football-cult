"use client";

import { useEffect, useState } from "react";
import { SEASONS, TypeKey, typeNames } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import Chip from "./Chip";

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper", "training", "prematch"];

export default function FloatingFilterButton() {
  const { locale, t } = useLanguage();
  const {
    typeFilter,
    toggleTypeFilter,
    setTypeFilter,
    categoryFilter,
    toggleCategoryFilter,
    setCategoryFilter,
    seasonFilter,
    toggleSeasonFilter,
    setSeasonFilter,
    activeFilterCount,
    clearAllFilters,
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
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-10 md:left-1/2 md:right-auto md:-translate-x-1/2 md:items-center">
      {open && (
        <div className="solid-panel flex w-64 flex-col gap-4 rounded-2xl border border-black/[0.06] p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="self-start text-xs font-medium text-[#675c44] transition-colors hover:text-[#1a1a1a]"
            >
              {t.search.clearFilters}
            </button>
          )}
          <div>
            <p className="mb-2 text-xs text-[#9a9a94]">{t.nav.categories}</p>
            <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip
                active={categoryFilter.length === 0}
                onClick={() => setCategoryFilter([])}
                accent="amber"
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              <Chip
                active={categoryFilter.includes("national")}
                onClick={() => toggleCategoryFilter("national")}
                accent="amber"
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.categoryNational}
              </Chip>
              <Chip
                active={categoryFilter.includes("club")}
                onClick={() => toggleCategoryFilter("club")}
                accent="amber"
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.categoryClubs}
              </Chip>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#9a9a94]">{t.search.typeLabel}</p>
            <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip
                active={typeFilter.length === 0}
                onClick={() => setTypeFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {TYPE_FILTERS.map((key) => (
                <Chip
                  key={key}
                  active={typeFilter.includes(key)}
                  onClick={() => toggleTypeFilter(key)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {typeNames[key][locale]}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[#9a9a94]">{t.search.seasonLabel}</p>
            <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip
                active={seasonFilter.length === 0}
                onClick={() => setSeasonFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {SEASONS.map((season) => (
                <Chip
                  key={season}
                  active={seasonFilter.includes(season)}
                  onClick={() => toggleSeasonFilter(season)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {season}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="shadow-vintage-md relative flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-[#FFFDF8]/[0.82] text-[#1a1a1a] backdrop-blur-[8px] transition-all hover:scale-105 md:h-14 md:w-auto md:gap-2.5 md:border-2 md:border-[#1B3B2B] md:bg-[#1B3B2B] md:px-6 md:text-[#F3E9C9] md:shadow-[0_14px_34px_-8px_rgba(27,59,43,0.55)] md:hover:bg-[#15301f]"
        aria-label={t.search.typeLabel}
      >
        <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h18M6 12h12M10 20h4"
          />
        </svg>
        <span className="hidden text-sm font-semibold md:inline">{t.search.filtersButton}</span>
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-[9px] font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
