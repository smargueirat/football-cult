"use client";

import { useEffect, useMemo, useState } from "react";
import BackToCatalogLink from "./BackToCatalogLink";
import GearCard from "./GearCard";
import Chip from "./Chip";
import ScrollArrowRow from "./ScrollArrowRow";
import FilterSheet from "./FilterSheet";
import SortDropdown from "./SortDropdown";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localizeGearColour } from "@/lib/gearText";
import { markCatalogVisited } from "@/lib/search/catalogVisit";

// Variante de GearListClient para ropa: misma UI (grilla + búsqueda +
// filtros de Tipo/Marca/Talla/Color, reusando GearCard/FilterSheet/
// SortDropdown -- pedido explícito del usuario: "los filtros tienen que
// tener este formato siempre, como hiciste con los botines"), más un
// filtro extra de Tipo (shorts/chaqueta/pantalón/medias) que gloves/
// balls no tienen. No se generalizó GearListClient para aceptar un
// `type` opcional porque las tallas también cambian de forma real:
// shorts/chaquetas/pantalones usan XS-4XL (letras), medias usan rangos
// numéricos ("39/42") -- el sort por talla de GearListClient asume
// números sueltos (parseFloat) y rompería con letras, así que hace
// falta su propio comparador acá en vez de forzar uno solo para los 3
// tipos de producto.
// La lista de tipos ya NO es fija acá: entra por prop, porque este mismo
// componente sirve la sección Ropa y la sección Entrenamiento (2026-09-24),
// que tienen tipos propios. Duplicar 270 líneas para cambiar una lista de
// chips no tenía sentido.
export const APPAREL_TYPES = ["shorts", "jacket", "pants", "socks", "sweatshirt", "polo", "set", "tshirt", "shinguards", "bag", "armband", "baselayer"] as const;

const LETTER_SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "5XL"];
function sizeSortKey(s: string): number {
  const i = LETTER_SIZE_ORDER.indexOf(s.toUpperCase());
  if (i !== -1) return i;
  const n = parseFloat(s);
  // Tallas numéricas (medias en rango "39/42", pantalón de mujer "38")
  // ordenan después de las de letra, por su propio valor -- separar los
  // dos mundos evita que un "40" se intercale entre "S" y "M" por una
  // comparación numérica que no tiene sentido para talla de letra.
  return Number.isNaN(n) ? 100 + LETTER_SIZE_ORDER.length : LETTER_SIZE_ORDER.length + n;
}

interface ApparelOffer {
  store: string;
  price: number;
  shipping: number;
  currency: "EUR";
  imageUrl: string;
  sizes: string[];
}
interface ApparelProductLike {
  id: string;
  brand: string;
  model: string;
  colour: string;
  type: string;
  offers: ApparelOffer[];
}

type SortKey = "priceAsc" | "priceDesc";
const PAGE_SIZE = 24;

export default function ApparelListClient({
  items,
  pageTitle,
  pageSubtitle,
  types,
  typeLabel,
  typeFilterLabel,
  basePath = "ropa",
}: {
  items: ApparelProductLike[];
  pageTitle: string;
  pageSubtitle: string;
  types: readonly string[];
  typeLabel: (ty: string) => string;
  typeFilterLabel: string;
  basePath?: "ropa" | "entrenamiento";
}) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("priceAsc");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [brandFilter, setBrandFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [colourFilter, setColourFilter] = useState("");

  useEffect(() => {
    markCatalogVisited();
  }, []);

  const activeFilterCount = [typeFilter, brandFilter, sizeFilter, colourFilter].filter(Boolean).length;
  function clearAllFilters() {
    setTypeFilter("");
    setBrandFilter("");
    setSizeFilter("");
    setColourFilter("");
    setVisible(PAGE_SIZE);
  }

  const scopedByType = useMemo(
    () => (typeFilter ? items.filter((i) => i.type === typeFilter) : items),
    [items, typeFilter],
  );
  const brands = useMemo(
    () => [...new Set(scopedByType.map((i) => i.brand))].sort((a, b) => a.localeCompare(b)),
    [scopedByType],
  );
  const sizes = useMemo(
    () =>
      [...new Set(scopedByType.flatMap((i) => i.offers.flatMap((o) => o.sizes)))].sort(
        (a, b) => sizeSortKey(a) - sizeSortKey(b),
      ),
    [scopedByType],
  );
  const colours = useMemo(
    () =>
      [...new Set(scopedByType.map((i) => i.colour))]
        .filter((c) => c && c !== "N/D")
        .sort((a, b) => a.localeCompare(b)),
    [scopedByType],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = items.filter((i) => {
      if (q && !`${i.brand} ${i.model}`.toLowerCase().includes(q)) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (brandFilter && i.brand !== brandFilter) return false;
      if (colourFilter && i.colour !== colourFilter) return false;
      if (sizeFilter && !i.offers.some((o) => o.sizes.includes(sizeFilter))) return false;
      return true;
    });
    const total = (p: ApparelProductLike) => Math.min(...p.offers.map((o) => o.price + o.shipping));
    return [...base].sort((a, b) => (sortBy === "priceAsc" ? total(a) - total(b) : total(b) - total(a)));
  }, [items, query, typeFilter, brandFilter, sizeFilter, colourFilter, sortBy]);

  function resetPage() {
    setVisible(PAGE_SIZE);
  }

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <BackToCatalogLink />
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{pageTitle}</h1>
      <p className="mt-1 text-sm text-[#675c44]">{pageSubtitle.replace("{n}", String(items.length))}</p>

      <div className="vintage-card mt-5 flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="apparel-search" className="font-tagline text-sm not-italic text-[#5b5442]">
            {t.search.label}
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a8926a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              id="apparel-search"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder={t.search.placeholder}
              className="w-full rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-4 pl-12 pr-11 text-base text-[#1a1a1a] placeholder-[#a8926a] outline-none transition focus:border-[#1B3B2B]/40 focus:bg-white focus:ring-2 focus:ring-[#1B3B2B]/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="relative flex items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
            </svg>
            {t.search.filtersButton}
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D97706] text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { key: "priceAsc", label: t.search.sortPriceAsc },
              { key: "priceDesc", label: t.search.sortPriceDesc },
            ]}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-[#675c44]">{t.search.resultsCountAll.replace("{n}", String(filtered.length))}</p>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.slice(0, visible).map((item, i) => (
          <GearCard key={item.id} item={item} basePath={basePath} priority={i < 4} />
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="vintage-plaque rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {t.search.loadMore}
          </button>
        </div>
      )}

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        activeCount={activeFilterCount}
        onClear={clearAllFilters}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{typeFilterLabel}:</span>
          <ScrollArrowRow className="-mx-5 gap-2 px-5">
            <Chip active={typeFilter === ""} onClick={() => { setTypeFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {types.map((ty) => (
              <Chip key={ty} active={typeFilter === ty} onClick={() => { setTypeFilter(ty); setBrandFilter(""); setSizeFilter(""); setColourFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {typeLabel(ty)}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.search.brandLabel}:</span>
          <ScrollArrowRow className="-mx-5 gap-2 px-5">
            <Chip active={brandFilter === ""} onClick={() => { setBrandFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {brands.map((b) => (
              <Chip key={b} active={brandFilter === b} onClick={() => { setBrandFilter(b); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {b}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.search.sizeLabel}:</span>
          <ScrollArrowRow className="-mx-5 gap-2 px-5">
            <Chip active={sizeFilter === ""} onClick={() => { setSizeFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {sizes.map((s) => (
              <Chip key={s} active={sizeFilter === s} onClick={() => { setSizeFilter(s); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {s}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.search.colorLabel}:</span>
          <ScrollArrowRow className="-mx-5 gap-2 px-5">
            <Chip active={colourFilter === ""} onClick={() => { setColourFilter(""); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
              {t.search.allCategories}
            </Chip>
            {colours.map((c) => (
              <Chip key={c} active={colourFilter === c} onClick={() => { setColourFilter(c); resetPage(); }} className="flex-shrink-0 whitespace-nowrap">
                {localizeGearColour(c, locale)}
              </Chip>
            ))}
          </ScrollArrowRow>
        </div>
      </FilterSheet>
    </div>
  );
}
