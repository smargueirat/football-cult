"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { AgeGroup, Brand, CategoryKey, TypeKey } from "@/data/products";

export type SortKey = "priceAsc" | "priceDesc" | "seasonNewest" | "seasonOldest";

interface SearchFilterValue {
  query: string;
  setQuery: (q: string) => void;
  typeFilter: TypeKey | "all";
  setTypeFilter: (t: TypeKey | "all") => void;
  categoryFilter: CategoryKey | "all";
  setCategoryFilter: (c: CategoryKey | "all") => void;
  seasonFilter: string | "all";
  setSeasonFilter: (s: string | "all") => void;
  ageGroupFilter: AgeGroup | "all";
  setAgeGroupFilter: (a: AgeGroup | "all") => void;
  brandFilter: Brand | "all";
  setBrandFilter: (b: Brand | "all") => void;
  // Vive acá (no como useState local del componente de resultados) para
  // que sobreviva cuando el usuario entra a una camiseta y vuelve atrás:
  // este contexto está montado en el layout raíz, no en la página de
  // búsqueda, así que no se resetea al navegar.
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
  activeFilterCount: number;
}

const SearchFilterContext = createContext<SearchFilterValue | undefined>(undefined);

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeKey | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | "all">("all");
  const [seasonFilter, setSeasonFilter] = useState<string | "all">("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState<AgeGroup | "all">("all");
  const [brandFilter, setBrandFilter] = useState<Brand | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("priceAsc");

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (seasonFilter !== "all" ? 1 : 0) +
    (ageGroupFilter !== "all" ? 1 : 0) +
    (brandFilter !== "all" ? 1 : 0);

  return (
    <SearchFilterContext.Provider
      value={{
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
        brandFilter,
        setBrandFilter,
        sortBy,
        setSortBy,
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
