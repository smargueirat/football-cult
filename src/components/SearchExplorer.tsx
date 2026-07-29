"use client";

import { useMemo, useState } from "react";
import {
  CategoryKey,
  Product,
  TeamKey,
  TypeKey,
  bestOffer,
  offerTotal,
  products,
  teamCategory,
  teamColors,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper"];

const TEAM_KEYS: TeamKey[] = Array.from(
  new Set(products.map((p) => p.teamKey))
);

function Chip({
  active,
  onClick,
  children,
  accent = "green",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "green" | "amber";
}) {
  const activeClasses =
    accent === "green"
      ? "border-[#1F6F4C] bg-[#1F6F4C]/10 text-[#1F6F4C]"
      : "border-[#B45309] bg-[#B45309]/10 text-[#B45309]";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? activeClasses
          : "border-black/[0.08] bg-white text-[#5b5b57] hover:border-black/20 hover:text-[#1a1a1a]"
      }`}
    >
      {children}
    </button>
  );
}

export default function SearchExplorer() {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeKey | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | "all">("all");

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
      return matchesQuery && matchesType && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      const totalA = bestOffer(a) ? offerTotal(bestOffer(a)!) : Infinity;
      const totalB = bestOffer(b) ? offerTotal(bestOffer(b)!) : Infinity;
      return totalA - totalB;
    });
  }, [query, typeFilter, categoryFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel flex flex-col gap-4 rounded-3xl border border-black/[0.06] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-medium text-[#3a3a36]">
            {t.search.label}
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a9a94]"
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
              className="w-full rounded-2xl border border-black/[0.08] bg-[#faf9f5] py-4 pl-12 pr-11 text-base text-[#1a1a1a] placeholder-[#9a9a94] outline-none transition focus:border-[#1F6F4C]/50 focus:bg-white focus:ring-2 focus:ring-[#1F6F4C]/15"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label={t.search.clearAria}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#9a9a94] transition-colors hover:bg-black/[0.05] hover:text-[#1a1a1a]"
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#9a9a94]">{t.search.quickSelectLabel}:</span>
          {TEAM_KEYS.map((key) => {
            const active = query.toLowerCase() === teamNames[key].es.toLowerCase();
            const [c1, c2] = teamColors[key];
            return (
              <Chip
                key={key}
                active={active}
                onClick={() => setQuery(active ? "" : teamNames[key][locale])}
              >
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                />
                {teamNames[key][locale]}
              </Chip>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#9a9a94]">{t.nav.categories}:</span>
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
          <span className="text-xs text-[#9a9a94]">{t.search.typeLabel}:</span>
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

      {results.length === 0 ? (
        <p className="text-[#8a8a84]">
          {t.search.noResults.replace("{query}", query)}
        </p>
      ) : (
        <>
          <p className="text-xs text-[#9a9a94]">
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
