"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { AgeGroup, Brand, CategoryKey, Size, TypeKey } from "@/data/products";

export type SortKey = "priceAsc" | "priceDesc" | "seasonNewest" | "seasonOldest";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

interface SearchFilterValue {
  query: string;
  setQuery: (q: string) => void;
  // Cada filtro es multi-selección (array = OR entre sus valores; array
  // vacío = sin filtrar, equivalente al viejo "all"). El usuario pidió
  // poder elegir, por ejemplo, Nike Y Adidas a la vez en Marca — antes
  // cada filtro solo aceptaba un valor a la vez.
  typeFilter: TypeKey[];
  toggleTypeFilter: (t: TypeKey) => void;
  setTypeFilter: (t: TypeKey[]) => void;
  categoryFilter: CategoryKey[];
  toggleCategoryFilter: (c: CategoryKey) => void;
  setCategoryFilter: (c: CategoryKey[]) => void;
  seasonFilter: string[];
  toggleSeasonFilter: (s: string) => void;
  setSeasonFilter: (s: string[]) => void;
  ageGroupFilter: AgeGroup[];
  toggleAgeGroupFilter: (a: AgeGroup) => void;
  setAgeGroupFilter: (a: AgeGroup[]) => void;
  brandFilter: Brand[];
  toggleBrandFilter: (b: Brand) => void;
  setBrandFilter: (b: Brand[]) => void;
  sizeFilter: Size[];
  toggleSizeFilter: (s: Size) => void;
  setSizeFilter: (s: Size[]) => void;
  // Vive acá (no como useState local del componente de resultados) para
  // que sobreviva cuando el usuario entra a una camiseta y vuelve atrás:
  // este contexto está montado en el layout raíz, no en la página de
  // búsqueda, así que no se resetea al navegar.
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
  activeFilterCount: number;
  clearAllFilters: () => void;
  // Vive acá (no como useState local del componente de resultados) por la
  // misma razón que sortBy: si viviera en SearchExplorer, entrar a una
  // camiseta y volver (que desmonta y remonta ese componente) perdería
  // cuántas tandas de "Ver más" había cargado el usuario, volviendo
  // siempre al primer bloque -- justo el bug que se pidió corregir.
  visibleCount: number;
  setVisibleCount: (n: number | ((c: number) => number)) => void;
}

export const CATALOG_PAGE_SIZE = 24;

const SearchFilterContext = createContext<SearchFilterValue | undefined>(undefined);

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeKey[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<string[]>([]);
  const [ageGroupFilter, setAgeGroupFilter] = useState<AgeGroup[]>([]);
  const [brandFilter, setBrandFilter] = useState<Brand[]>([]);
  const [sizeFilter, setSizeFilter] = useState<Size[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("priceAsc");
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);

  const activeFilterCount =
    (typeFilter.length > 0 ? 1 : 0) +
    (categoryFilter.length > 0 ? 1 : 0) +
    (seasonFilter.length > 0 ? 1 : 0) +
    (ageGroupFilter.length > 0 ? 1 : 0) +
    (brandFilter.length > 0 ? 1 : 0) +
    (sizeFilter.length > 0 ? 1 : 0);

  return (
    <SearchFilterContext.Provider
      value={{
        query,
        setQuery,
        typeFilter,
        toggleTypeFilter: (t) => setTypeFilter((cur) => toggle(cur, t)),
        setTypeFilter,
        categoryFilter,
        toggleCategoryFilter: (c) => setCategoryFilter((cur) => toggle(cur, c)),
        setCategoryFilter,
        seasonFilter,
        toggleSeasonFilter: (s) => setSeasonFilter((cur) => toggle(cur, s)),
        setSeasonFilter,
        ageGroupFilter,
        toggleAgeGroupFilter: (a) => setAgeGroupFilter((cur) => toggle(cur, a)),
        setAgeGroupFilter,
        brandFilter,
        toggleBrandFilter: (b) => setBrandFilter((cur) => toggle(cur, b)),
        setBrandFilter,
        sizeFilter,
        toggleSizeFilter: (s) => setSizeFilter((cur) => toggle(cur, s)),
        setSizeFilter,
        sortBy,
        setSortBy,
        activeFilterCount,
        clearAllFilters: () => {
          setQuery("");
          setTypeFilter([]);
          setCategoryFilter([]);
          setSeasonFilter([]);
          setAgeGroupFilter([]);
          setBrandFilter([]);
          setSizeFilter([]);
        },
        visibleCount,
        setVisibleCount,
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
