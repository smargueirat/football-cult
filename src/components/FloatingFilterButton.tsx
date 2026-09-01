"use client";

import { useEffect, useRef, useState } from "react";
import { SEASONS, SIZES, brandNames, teamCategory, teamColors, teamFlags, teamNames, typeNames } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  PRICE_RANGE_MAX,
  PRICE_RANGE_MIN,
  useSearchFilter,
} from "@/lib/search/SearchFilterContext";
import { AGE_GROUP_FILTERS, BRAND_FILTERS, QUICK_PICK_TEAMS, STORE_FILTERS, TYPE_FILTERS } from "@/lib/search/filterOptions";
import { COLOR_LABEL_KEY, COLOR_ORDER, COLOR_SWATCH } from "@/lib/colorClassify";
import Chip from "./Chip";
import TeamBadge from "./TeamBadge";
import PriceRangeSlider from "./PriceRangeSlider";
import ScrollArrowRow from "./ScrollArrowRow";

export default function FloatingFilterButton() {
  const { locale, t } = useLanguage();
  const {
    query,
    setQuery,
    typeFilter,
    toggleTypeFilter,
    setTypeFilter,
    categoryFilter,
    toggleCategoryFilter,
    setCategoryFilter,
    seasonFilter,
    toggleSeasonFilter,
    setSeasonFilter,
    ageGroupFilter,
    toggleAgeGroupFilter,
    setAgeGroupFilter,
    brandFilter,
    toggleBrandFilter,
    setBrandFilter,
    storeFilter,
    toggleStoreFilter,
    setStoreFilter,
    sizeFilter,
    toggleSizeFilter,
    setSizeFilter,
    colorFilter,
    toggleColorFilter,
    setColorFilter,
    priceRange,
    setPriceRange,
    activeFilterCount,
    clearAllFilters,
  } = useSearchFilter();
  const [visible, setVisible] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const hoverCapableRef = useRef(false);
  const open = pinnedOpen || hoverOpen;

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    hoverCapableRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setPinnedOpen(false);
      setHoverOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-10 md:left-1/2 md:right-auto md:-translate-x-1/2 md:items-center"
      onMouseEnter={() => {
        if (hoverCapableRef.current) setHoverOpen(true);
      }}
      onMouseLeave={() => {
        if (hoverCapableRef.current) setHoverOpen(false);
      }}
    >
      {open && (
        <div className="solid-panel flex max-h-[75vh] w-80 flex-col gap-4 overflow-y-auto rounded-2xl border border-black/[0.06] p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] sm:w-96">
          <div className="flex items-center justify-between">
            <p className="font-card-title text-sm text-[#1a1a1a]">{t.search.filtersButton}</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-[#675c44] transition-colors hover:text-[#1a1a1a]"
              >
                {t.search.clearFilters}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.quickSelectLabel}</p>
            <ScrollArrowRow className="gap-1.5">
              {QUICK_PICK_TEAMS.map((key) => {
                const active = query.toLowerCase() === teamNames[key].es.toLowerCase();
                return (
                  <Chip
                    key={key}
                    active={active}
                    onClick={() => setQuery(active ? "" : teamNames[key][locale])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {teamCategory[key] === "national" ? (
                      <span className="text-base leading-none">{teamFlags[key]}</span>
                    ) : (
                      <TeamBadge colors={teamColors[key]} className="h-4 w-4" />
                    )}
                    {teamNames[key][locale]}
                  </Chip>
                );
              })}
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.nav.categories}</p>
            <ScrollArrowRow className="gap-1.5">
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
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.typeLabel}</p>
            <ScrollArrowRow className="gap-1.5">
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
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.brandLabel}</p>
            <ScrollArrowRow className="gap-1.5">
              <Chip
                active={brandFilter.length === 0}
                onClick={() => setBrandFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {BRAND_FILTERS.map((key) => (
                <Chip
                  key={key}
                  active={brandFilter.includes(key)}
                  onClick={() => toggleBrandFilter(key)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {brandNames[key]}
                </Chip>
              ))}
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.storeLabel}</p>
            <ScrollArrowRow className="gap-1.5">
              <Chip
                active={storeFilter.length === 0}
                onClick={() => setStoreFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {STORE_FILTERS.map((key) => (
                <Chip
                  key={key}
                  active={storeFilter.includes(key)}
                  onClick={() => toggleStoreFilter(key)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {key}
                </Chip>
              ))}
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.priceRangeLabel}</p>
            <PriceRangeSlider
              min={PRICE_RANGE_MIN}
              max={PRICE_RANGE_MAX}
              value={priceRange}
              onChange={setPriceRange}
              formatLabel={(v, isMax) => (isMax ? `€${v}+` : `€${v}`)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.sizeLabel}</p>
            <ScrollArrowRow className="gap-1.5">
              <Chip
                active={sizeFilter.length === 0}
                onClick={() => setSizeFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {SIZES.map((size) => (
                <Chip
                  key={size}
                  active={sizeFilter.includes(size)}
                  onClick={() => toggleSizeFilter(size)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {size}
                </Chip>
              ))}
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.colorLabel}</p>
            <ScrollArrowRow className="gap-1.5">
              <Chip
                active={colorFilter.length === 0}
                onClick={() => setColorFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {COLOR_ORDER.map((key) => (
                <Chip
                  key={key}
                  active={colorFilter.includes(key)}
                  onClick={() => toggleColorFilter(key)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  <span
                    className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: COLOR_SWATCH[key] }}
                  />
                  {t.search[COLOR_LABEL_KEY[key]]}
                </Chip>
              ))}
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.seasonLabel}</p>
            <ScrollArrowRow className="gap-1.5">
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
            </ScrollArrowRow>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-[#9a9a94]">{t.search.ageGroupLabel}</p>
            <ScrollArrowRow className="gap-1.5">
              <Chip
                active={ageGroupFilter.length === 0}
                onClick={() => setAgeGroupFilter([])}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {t.search.allCategories}
              </Chip>
              {AGE_GROUP_FILTERS.map((key) => (
                <Chip
                  key={key}
                  active={ageGroupFilter.includes(key)}
                  onClick={() => toggleAgeGroupFilter(key)}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {key === "men"
                    ? t.search.ageGroupMen
                    : key === "women"
                      ? t.search.ageGroupWomen
                      : t.search.ageGroupKids}
                </Chip>
              ))}
            </ScrollArrowRow>
          </div>
        </div>
      )}

      <button
        onClick={() => setPinnedOpen((o) => !o)}
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
