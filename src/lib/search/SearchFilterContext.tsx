"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { CategoryKey, TypeKey } from "@/data/products";

interface SearchFilterValue {
  query: string;
  setQuery: (q: string) => void;
  typeFilter: TypeKey | "all";
  setTypeFilter: (t: TypeKey | "all") => void;
  categoryFilter: CategoryKey | "all";
  setCategoryFilter: (c: CategoryKey | "all") => void;
  activeFilterCount: number;
}

const SearchFilterContext = createContext<SearchFilterValue | undefined>(undefined);

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeKey | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | "all">("all");

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) + (categoryFilter !== "all" ? 1 : 0);

  return (
    <SearchFilterContext.Provider
      value={{
        query,
        setQuery,
        typeFilter,
        setTypeFilter,
        categoryFilter,
        setCategoryFilter,
        activeFilterCount,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const ctx = useContext(SearchFilterContext);
  if (!ctx) {
    throw new Error("useSearchFilter must be used within a SearchFilterProvider");
  }
  return ctx;
}
