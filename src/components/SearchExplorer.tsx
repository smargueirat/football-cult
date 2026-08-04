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

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper", "training"];
const AGE_GROUP_FILTERS: AgeGroup[] = ["adult", "kids"];

const TEAM_KEYS: TeamKey[] = Array.from(
  new Set(products.map((p) => p.teamKey))
);

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
  } = useSearchFilter();
  const { countryCode } = useCountry();
  const [sortBy, setSortBy] = useState<SortKey>("priceAsc");

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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#8a7a5a]">{t.search.quickSelectLabel}:</span>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TEAM_KEYS.map((key) => {
              const active = query.toLowerCase() === teamNames[key].es.toLowerCase();
              return (
                <Chip
                  key={key}
                  active={active}
                  onClick={() => setQuery(active ? "" : teamNames[key][locale])}
                  className="shrink-0"
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
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} accent="amber" className="shrink-0">
              {t.search.allCategories}
            </Chip>
            <Chip active={categoryFilter === "national"} onClick={() => setCategoryFilter("national")} accent="amber" className="shrink-0">
              {t.search.categoryNational}
            </Chip>
            <Chip active={categoryFilter === "club"} onClick={() => setCategoryFilter("club")} accent="amber" className="shrink-0">
              {t.search.categoryClubs}
            </Chip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#8a7a5a]">{t.search.typeLabel}:</span>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")} className="shrink-0">
              {t.search.allCategories}
            </Chip>
            {TYPE_FILTERS.map((key) => (
              <Chip key={key} active={typeFilter === key} onClick={() => setTypeFilter(key)} className="shrink-0">
                {typeNames[key][locale]}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#8a7a5a]">{t.search.seasonLabel}:</span>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip active={seasonFilter === "all"} onClick={() => setSeasonFilter("all")} className="shrink-0">
              {t.search.allCategories}
            </Chip>
            {SEASONS.map((season) => (
              <Chip key={season} active={seasonFilter === season} onClick={() => setSeasonFilter(season)} className="shrink-0">
                {season}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#8a7a5a]">{t.search.ageGroupLabel}:</span>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip active={ageGroupFilter === "all"} onClick={() => setAgeGroupFilter("all")} className="shrink-0">
              {t.search.allCategories}
            </Chip>
            {AGE_GROUP_FILTERS.map((key) => (
              <Chip key={key} active={ageGroupFilter === key} onClick={() => setAgeGroupFilter(key)} className="shrink-0">
                {key === "adult" ? t.search.ageGroupAdult : t.search.ageGroupKids}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-[#8a8a84]">
          {t.search.noResults.replace("{query}", query)}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#8a7a5a]">
              {t.search.resultsCount.replace("{n}", String(results.length))}
            </p>
            <label className="flex items-center gap-2 text-xs text-[#8a7a5a]">
              {t.search.sortLabel}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-full border border-[#C9A24B]/30 bg-[#FFFDF8] px-3 py-1.5 text-xs text-[#1a1a1a] outline-none transition focus:border-[#1B3B2B]/40"
              >
                <option value="priceAsc">{t.search.sortPriceAsc}</option>
                <option value="priceDesc">{t.search.sortPriceDesc}</option>
                <option value="seasonNewest">{t.search.sortNewest}</option>
                <option value="seasonOldest">{t.search.sortOldest}</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {results.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
