"use client";

import { useMemo } from "react";
import {
  Product,
  SEASONS,
  TeamKey,
  TypeKey,
  bestOfferForCountry,
  offerTotal,
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

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper"];

const TEAM_KEYS: TeamKey[] = Array.from(
  new Set(products.map((p) => p.teamKey))
);

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
  } = useSearchFilter();
  const { countryCode } = useCountry();

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
      const matchesShipping = shipsToCountry(p, countryCode);
      return matchesQuery && matchesType && matchesCategory && matchesSeason && matchesShipping;
    });

    return [...filtered].sort((a, b) => {
      const bestA = bestOfferForCountry(a, countryCode);
      const bestB = bestOfferForCountry(b, countryCode);
      const totalA = bestA ? offerTotal(bestA) : Infinity;
      const totalB = bestB ? offerTotal(bestB) : Infinity;
      return totalA - totalB;
    });
  }, [query, typeFilter, categoryFilter, seasonFilter, countryCode]);

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

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8a7a5a]">{t.nav.categories}:</span>
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8a7a5a]">{t.search.typeLabel}:</span>
          <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            {t.search.allCategories}
          </Chip>
          {TYPE_FILTERS.map((key) => (
            <Chip key={key} active={typeFilter === key} onClick={() => setTypeFilter(key)}>
              {typeNames[key][locale]}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8a7a5a]">{t.search.seasonLabel}:</span>
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
    </div>
  );
}
