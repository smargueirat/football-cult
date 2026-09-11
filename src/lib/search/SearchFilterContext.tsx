"use client";

import { createContext, ReactNode, useContext, useState } from "react";
// `import type`, no un import normal -- este provider envuelve TODO el
// sitio (layout.tsx de [locale]) y lo único que necesita de products.ts
// son 5 tipos, ningún valor real. Un import sin "type" no se puede
// garantizar libre de costo en tiempo de build (Turbopack transpila
// archivo por archivo, sin chequear si el símbolo termina siendo sólo
// un tipo) -- "import type" lo saca del todo, se borra en compilación,
// cero impacto en el bundle. Ver el comentario largo en
// CountryContext.tsx para el resto de esta misma clase de bug.
import type { AgeGroup, Brand, CategoryKey, Size, TypeKey } from "@/data/products";
import { ColorKey } from "@/lib/colorClassify";

export type SortKey = "relevance" | "priceAsc" | "priceDesc" | "seasonNewest" | "seasonOldest";

// Slider continuo de 0 al tope sobre el total normalizado en EUR (mismo
// valor que ya usa el ordenamiento por precio, offerTotalInEUR) -- así el
// filtro es consistente entre monedas distintas aunque cada card siga
// mostrando el precio en la moneda real de su oferta. El tope no es el
// máximo real del catálogo (~€2700, un puñado de piezas de colección que
// dejarían el slider inservible para el resto) sino un techo que cubre
// la enorme mayoría de las ofertas; llevar la manija de arriba al tope
// significa "sin límite superior", no "hasta exactamente este número".
export const PRICE_RANGE_MIN = 0;
export const PRICE_RANGE_MAX = 300;
export type PriceRange = [number, number];

export type SectionKey = "all" | "jerseys" | "boots";

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
  storeFilter: string[];
  toggleStoreFilter: (s: string) => void;
  setStoreFilter: (s: string[]) => void;
  sizeFilter: Size[];
  toggleSizeFilter: (s: Size) => void;
  setSizeFilter: (s: Size[]) => void;
  // Talle de bota (numeración EU real de calzado, ej. "42", "40 2/3") --
  // no reusa `sizeFilter` (talle de ropa: S/M/L/XL) porque son dominios
  // de valores totalmente distintos, mismo patrón que Marca ya tiene
  // su propio filtro separado de Talla.
  bootSizeFilter: string[];
  toggleBootSizeFilter: (s: string) => void;
  setBootSizeFilter: (s: string[]) => void;
  colorFilter: ColorKey[];
  toggleColorFilter: (c: ColorKey) => void;
  setColorFilter: (c: ColorKey[]) => void;
  // Categoría de calidad de la bota (Tier 1+ a Tier 4, ver
  // src/lib/bootTier.ts) -- no aplica a camisetas, mismo patrón que
  // bootSizeFilter.
  bootTierFilter: string[];
  toggleBootTierFilter: (t: string) => void;
  setBootTierFilter: (t: string[]) => void;
  // "all" (por defecto) mezcla camisetas y botas; "jerseys"/"boots"
  // aíslan una sola sección. Las páginas de categoría (clubes, retro,
  // etc.) fuerzan "jerseys" al montar -- ahí las botas no pintan nada.
  sectionFilter: SectionKey;
  setSectionFilter: (s: SectionKey) => void;
  priceRange: PriceRange;
  setPriceRange: (p: PriceRange) => void;
  // Booleano simple (no multi-selección como el resto) -- "en baja" no
  // tiene variantes para combinar con OR, es sí/no.
  onSaleFilter: boolean;
  toggleOnSaleFilter: () => void;
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
  const [storeFilter, setStoreFilter] = useState<string[]>([]);
  const [sizeFilter, setSizeFilter] = useState<Size[]>([]);
  const [bootSizeFilter, setBootSizeFilter] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<ColorKey[]>([]);
  const [bootTierFilter, setBootTierFilter] = useState<string[]>([]);
  const [sectionFilter, setSectionFilter] = useState<SectionKey>("all");
  const [priceRange, setPriceRange] = useState<PriceRange>([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
  const [onSaleFilter, setOnSaleFilter] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);

  const activeFilterCount =
    (typeFilter.length > 0 ? 1 : 0) +
    (categoryFilter.length > 0 ? 1 : 0) +
    (seasonFilter.length > 0 ? 1 : 0) +
    (ageGroupFilter.length > 0 ? 1 : 0) +
    (brandFilter.length > 0 ? 1 : 0) +
    (storeFilter.length > 0 ? 1 : 0) +
    (sizeFilter.length > 0 ? 1 : 0) +
    (bootSizeFilter.length > 0 ? 1 : 0) +
    (colorFilter.length > 0 ? 1 : 0) +
    (bootTierFilter.length > 0 ? 1 : 0) +
    (priceRange[0] !== PRICE_RANGE_MIN || priceRange[1] !== PRICE_RANGE_MAX ? 1 : 0) +
    (onSaleFilter ? 1 : 0);

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
        storeFilter,
        toggleStoreFilter: (s) => setStoreFilter((cur) => toggle(cur, s)),
        setStoreFilter,
        sizeFilter,
        toggleSizeFilter: (s) => setSizeFilter((cur) => toggle(cur, s)),
        setSizeFilter,
        bootSizeFilter,
        toggleBootSizeFilter: (s) => setBootSizeFilter((cur) => toggle(cur, s)),
        setBootSizeFilter,
        colorFilter,
        toggleColorFilter: (c) => setColorFilter((cur) => toggle(cur, c)),
        setColorFilter,
        bootTierFilter,
        toggleBootTierFilter: (t) => setBootTierFilter((cur) => toggle(cur, t)),
        setBootTierFilter,
        sectionFilter,
        setSectionFilter,
        priceRange,
        setPriceRange,
        onSaleFilter,
        toggleOnSaleFilter: () => setOnSaleFilter((v) => !v),
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
          setStoreFilter([]);
          setSizeFilter([]);
          setBootSizeFilter([]);
          setColorFilter([]);
          setBootTierFilter([]);
          setSectionFilter("all");
          setPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
          setOnSaleFilter(false);
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
