"use client";

import { useMemo, useState } from "react";
import {
  Product,
  TeamKey,
  TypeKey,
  bestPrice,
  products,
  teamFlags,
  teamNames,
  typeNames,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProductCard from "./ProductCard";

const TYPE_FILTERS: TypeKey[] = ["home", "away", "third", "goalkeeper"];

const TEAM_KEYS: TeamKey[] = Array.from(
  new Set(products.map((p) => p.teamKey))
);

export default function SearchExplorer() {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeKey | "all">("all");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = products.filter((p) => {
      const matchesQuery = normalized
        ? teamNames[p.teamKey].es.toLowerCase().includes(normalized) ||
          teamNames[p.teamKey].en.toLowerCase().includes(normalized)
        : true;
      const matchesType = typeFilter === "all" || p.typeKey === typeFilter;
      return matchesQuery && matchesType;
    });

    return [...filtered].sort((a, b) => {
      const priceA = bestPrice(a)?.price ?? Infinity;
      const priceB = bestPrice(b)?.price ?? Infinity;
      return priceA - priceB;
    });
  }, [query, typeFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-medium text-zinc-300">
            {t.search.label}
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-11 text-base text-zinc-50 placeholder-zinc-500 outline-none transition focus:border-cyan-400/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label={t.search.clearAria}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
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
          <span className="text-xs text-zinc-500">{t.search.quickSelectLabel}:</span>
          {TEAM_KEYS.map((key) => {
            const active = query.toLowerCase() === teamNames[key].es.toLowerCase();
            return (
              <button
                key={key}
                onClick={() => setQuery(active ? "" : teamNames[key][locale])}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                }`}
              >
                <span>{teamFlags[key]}</span>
                {teamNames[key][locale]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              typeFilter === "all"
                ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.search.allCategories}
          </button>
          {TYPE_FILTERS.map((key) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                typeFilter === key
                  ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {typeNames[key][locale]}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-zinc-500">
          {t.search.noResults.replace("{query}", query)}
        </p>
      ) : (
        <>
          <p className="text-xs text-zinc-500">
            {t.search.resultsCount.replace("{n}", String(results.length))}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {results.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
