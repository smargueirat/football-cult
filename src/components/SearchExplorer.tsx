"use client";

import { useMemo, useState } from "react";
import {
  AgeGroup,
  Product,
  SEASONS,
  TeamKey,
  TypeKey,
  bestOfferForCountry,
  getAgeGroup,
  offerTotalInEUR,
  products,
  shipsToCountry,
  teamCategory,
  teamColors,
  teamFlags,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import { useCountry } from "@/lib/country/CountryContext";
import ProductCard from "./ProductCard";
import Chip from "./Chip";
import TeamBadge from "./TeamBadge";
import Portal from "./Portal";

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper", "training"];
const AGE_GROUP_FILTERS: AgeGroup[] = ["adult", "kids"];

// Selecciones/clubes más buscados: son un atajo, no un listado completo
// (para eso ya está el buscador de texto), así que se mantiene corta a
// propósito en vez de mostrar los ~90 equipos del catálogo.
const QUICK_PICK_TEAMS: TeamKey[] = [
  "argentina",
  "brasil",
  "espana",
  "francia",
  "realmadrid",
  "barcelona",
  "manutd",
  "liverpool",
  "psg",
  "bayern",
  "boca",
  "riverplate",
].filter((key) => products.some((p) => p.teamKey === key)) as TeamKey[];

type SortKey = "priceAsc" | "priceDesc" | "seasonNewest" | "seasonOldest";

// "2025/26" -> 2025, "2026" -> 2026. Sirve para poder ordenar temporadas
// cronológicamente sin importar el formato con el que se cargó cada una.
function seasonSortValue(season: string): number {
  const match = season.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function SearchExplorer() {
  const { locale, t } = useLanguage();
  const {
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    seasonFilter,
    setSeasonFilter,
    ageGroupFilter,
    setAgeGroupFilter,
    activeFilterCount,
  } = useSearchFilter();
  const { countryCode } = useCountry();
  const [sortBy, setSortBy] = useState<SortKey>("priceAsc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = products.filter((p) => {
      const matchesQuery = normalized
        ? teamNames[p.teamKey].es.toLowerCase().includes(normalized) ||
          teamNames[p.teamKey].en.toLowerCase().includes(normalized)
        : true;
      const matchesType = typeFilter === "all" || p.typeKey === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || teamCategory[p.teamKey] === categoryFilter;
      const matchesSeason = seasonFilter === "all" || p.season === seasonFilter;
      const matchesAgeGroup = ageGroupFilter === "all" || getAgeGroup(p) === ageGroupFilter;
      const matchesShipping = shipsToCountry(p, countryCode);
      return (
        matchesQuery &&
        matchesType &&
        matchesCategory &&
        matchesSeason &&
        matchesAgeGroup &&
        matchesShipping
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "seasonNewest" || sortBy === "seasonOldest") {
        const diff = seasonSortValue(a.season) - seasonSortValue(b.season);
        return sortBy === "seasonNewest" ? -diff : diff;
      }
      const bestA = bestOfferForCountry(a, countryCode);
      const bestB = bestOfferForCountry(b, countryCode);
      const totalA = bestA ? offerTotalInEUR(bestA) : Infinity;
      const totalB = bestB ? offerTotalInEUR(bestB) : Infinity;
      return sortBy === "priceDesc" ? totalB - totalA : totalA - totalB;
    });
  }, [query, typeFilter, categoryFilter, seasonFilter, ageGroupFilter, countryCode, sortBy]);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "priceAsc", label: t.search.sortPriceAsc },
    { key: "priceDesc", label: t.search.sortPriceDesc },
    { key: "seasonNewest", label: t.search.sortNewest },
    { key: "seasonOldest", label: t.search.sortOldest },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="vintage-card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="font-tagline text-sm not-italic text-[#5b5442]">
            {t.search.label}
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a8926a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="w-full rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-4 pl-12 pr-11 text-base text-[#1a1a1a] placeholder-[#a8926a] outline-none transition focus:border-[#1B3B2B]/40 focus:bg-white focus:ring-2 focus:ring-[#1B3B2B]/10"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label={t.search.clearAria}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#8a7a5a] transition-colors hover:bg-black/[0.05] hover:text-[#1a1a1a]"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="relative flex items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18M6 12h12M10 20h4"
              />
            </svg>
            {t.search.filtersButton}
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D97706] text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setSortOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h10M3 12h6M3 17h3M17 4v16m0 0l-3.5-3.5M17 20l3.5-3.5"
              />
            </svg>
            {t.search.sortLabel}
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-[#8a8a84]">
          {t.search.noResults.replace("{query}", query)}
        </p>
      ) : (
        <>
          <p className="text-xs text-[#8a7a5a]">
            {t.search.resultsCount.replace("{n}", String(results.length))}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {results.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {filtersOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-[#FFFDF8] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b border-[#C9A24B]/20 px-5 py-4">
              <p className="font-card-title text-lg text-[#1a1a1a]">
                {t.search.filtersButton}
              </p>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label={t.search.clearAria}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8a7a5a] hover:bg-black/[0.05] hover:text-[#1a1a1a]"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#8a7a5a]">{t.search.quickSelectLabel}:</span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PICK_TEAMS.map((key) => {
                    const active = query.toLowerCase() === teamNames[key].es.toLowerCase();
                    return (
                      <Chip
                        key={key}
                        active={active}
                        onClick={() => setQuery(active ? "" : teamNames[key][locale])}
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
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#8a7a5a]">{t.nav.categories}:</span>
                <div className="flex flex-wrap gap-2">
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

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#8a7a5a]">{t.search.typeLabel}:</span>
                <div className="flex flex-wrap gap-2">
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

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#8a7a5a]">{t.search.seasonLabel}:</span>
                <div className="flex flex-wrap gap-2">
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

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#8a7a5a]">{t.search.ageGroupLabel}:</span>
                <div className="flex flex-wrap gap-2">
                  <Chip active={ageGroupFilter === "all"} onClick={() => setAgeGroupFilter("all")}>
                    {t.search.allCategories}
                  </Chip>
                  {AGE_GROUP_FILTERS.map((key) => (
                    <Chip key={key} active={ageGroupFilter === key} onClick={() => setAgeGroupFilter(key)}>
                      {key === "adult" ? t.search.ageGroupAdult : t.search.ageGroupKids}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#C9A24B]/20 p-4">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-full bg-[#1B3B2B] py-3 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
              >
                {t.search.showResults} ({results.length})
              </button>
            </div>
          </div>
        </Portal>
      )}

      {sortOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSortOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-[#FFFDF8] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b border-[#C9A24B]/20 px-5 py-4">
              <p className="font-card-title text-lg text-[#1a1a1a]">{t.search.sortLabel}</p>
              <button
                onClick={() => setSortOpen(false)}
                aria-label={t.search.clearAria}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8a7a5a] hover:bg-black/[0.05] hover:text-[#1a1a1a]"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 p-3">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSortBy(opt.key);
                    setSortOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
                    sortBy === opt.key
                      ? "bg-[#1B3B2B] text-[#F3E9C9]"
                      : "text-[#3a3a36] hover:bg-black/[0.04]"
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.key && (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
