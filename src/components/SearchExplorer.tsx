"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  Product,
  SEASONS,
  SIZES,
  TeamKey,
  availableSizes,
  bestOfferForCountry,
  brandNames,
  getAgeGroup,
  products,
  isVintageRetro,
  seasonSortValue,
  shipsToCountry,
  sortSafeOfferTotalInEUR,
  teamCategory,
  teamColors,
  teamFlags,
  teamNames,
  teamPopularity,
  typeNames,
} from "@/data/products";
import {
  AGE_GROUP_FILTERS,
  BRAND_FILTERS,
  QUICK_PICK_TEAMS,
  TYPE_FILTERS,
} from "@/lib/search/filterOptions";
import ScrollArrowRow from "./ScrollArrowRow";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  CATALOG_PAGE_SIZE,
  PRICE_RANGE_MAX,
  PRICE_RANGE_MIN,
  useSearchFilter,
} from "@/lib/search/SearchFilterContext";
import { COLOR_LABEL_KEY, COLOR_ORDER, COLOR_SWATCH, productColorKey } from "@/lib/colorClassify";
import PriceRangeSlider from "./PriceRangeSlider";
import { useCountry } from "@/lib/country/CountryContext";
import ProductCard from "./ProductCard3D";
import Chip from "./Chip";
import TeamBadge from "./TeamBadge";
import Portal from "./Portal";

const SCROLL_KEY = "football-cult-catalog-scroll";

// Saca tildes/diacríticos y pasa a minúsculas -- para que buscar "Japon"
// (sin acento, como escribe la mayoría) encuentre "Japón" igual, y para
// que la búsqueda no dependa de en qué idioma esté puesta la página.
function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}


export default function SearchExplorer() {
  const { locale, t } = useLanguage();
  const {
    query,
    setQuery,
    typeFilter,
    toggleTypeFilter,
    setTypeFilter,
    categoryFilter,
    toggleCategoryFilter,
    setCategoryFilter,
    seasonFilter,
    toggleSeasonFilter,
    setSeasonFilter,
    ageGroupFilter,
    toggleAgeGroupFilter,
    setAgeGroupFilter,
    brandFilter,
    toggleBrandFilter,
    setBrandFilter,
    sizeFilter,
    toggleSizeFilter,
    setSizeFilter,
    colorFilter,
    toggleColorFilter,
    setColorFilter,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    activeFilterCount,
    clearAllFilters,
    visibleCount,
    setVisibleCount,
  } = useSearchFilter();
  const { countryCode } = useCountry();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);
  const [sortPanelPos, setSortPanelPos] = useState({ top: 0, right: 0 });

  // Primer intento: dropdown posicionado con position:absolute dentro del
  // flujo normal de la página, cerrado con un listener de click-afuera por
  // ref. Se siguió reportando que en desktop tocar "Price: high to low" /
  // "Newest first" / "Oldest first" (las opciones de más abajo del panel,
  // justo donde el panel se superpone con la primera fila de tarjetas del
  // catálogo) no hacía nada -- mientras que "Relevance"/"Price: low to
  // high" (arriba del panel, sin superposición) sí andaban. Eso apunta a
  // que ProductCard3D (tiene su propio stacking context por el tilt 3D
  // con transform) termina ganándole al panel en esa franja, pese al
  // z-index más alto del panel. La forma de sacarse esa duda de encima
  // del todo es renderizar el panel con Portal (al final de <body>, como
  // ya se hace con el bottom sheet de Filters) en vez de confiar en
  // z-index relativo -- así queda garantizado por encima de cualquier
  // otro stacking context de la página, sea cual sea la causa real.
  useEffect(() => {
    if (!sortOpen || !sortButtonRef.current) return;
    const rect = sortButtonRef.current.getBoundingClientRect();
    setSortPanelPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  }, [sortOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        sortButtonRef.current &&
        !sortButtonRef.current.contains(target) &&
        sortPanelRef.current &&
        !sortPanelRef.current.contains(target)
      ) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortOpen]);

  // ESC cierra el panel de filtros y el de orden, en cualquiera de las
  // dos versiones (bottom sheet mobile o dropdown desktop).
  useEffect(() => {
    if (!filtersOpen && !sortOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setFiltersOpen(false);
      setSortOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [filtersOpen, sortOpen]);

  // El input sigue atado a `query` (así el texto tipeado no se atrasa
  // nunca), pero el filtro pesado de abajo -- recorre las 5500+ camisetas
  // en cada letra -- usa esta versión "diferida": React la actualiza
  // después de la letra en sí, sin competir por el mismo frame. Sin
  // esto, cada tecla se sentía trabada en un celular real (~35-90ms de
  // bloqueo del hilo principal, medido).
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const queryWords = normalizeSearchText(deferredQuery.trim())
      .split(/\s+/)
      .filter(Boolean);

    const filtered = products.filter((p) => {
      // Cada palabra de la búsqueda tiene que aparecer en algún lado del
      // texto del producto (no las tres seguidas como una sola frase) --
      // así "boca 1993" encuentra "Boca Juniors 1993-95 Home Retro
      // Jersey" aunque "juniors" quede en el medio. Junta el nombre del
      // equipo y el tipo en los tres idiomas (no solo el de la página
      // actual) más el texto real de cada oferta -- así la búsqueda no
      // depende de en qué idioma esté puesta la página, y también
      // encuentra por jugador ("messi"), por variante ("pre-match") o
      // cualquier otra palabra que solo aparezca en el título tal como
      // lo puso la tienda, no en nuestros campos curados.
      const matchesQuery =
        queryWords.length === 0
          ? true
          : (() => {
              // La palabra "retro" (nuestra categoría interna, no el título
              // real de la tienda) solo entra al haystack cuando la prenda
              // es vintage de verdad -- si no, buscar "retro" traería
              // reediciones modernas etiquetadas typeKey:"retro" por error
              // de la minería. El título real de la oferta (offer.title)
              // sigue intacto siempre, diga lo que diga la tienda.
              const typeWords =
                p.typeKey === "retro" && !isVintageRetro(p)
                  ? []
                  : [typeNames[p.typeKey].es, typeNames[p.typeKey].en, typeNames[p.typeKey].pt];
              const haystack = normalizeSearchText(
                [
                  teamNames[p.teamKey].es,
                  teamNames[p.teamKey].en,
                  teamNames[p.teamKey].pt,
                  ...typeWords,
                  p.season,
                  ...p.offers.map((o) => o.title ?? ""),
                ].join(" ")
              );
              return queryWords.every((w) => haystack.includes(w));
            })();
      // "retro" además exige temporada 2006 o anterior -- una camiseta de
      // 2023/24 ya reemplazada por la actual no es "retro" en el sentido
      // en que el usuario espera navegar esa categoría (vintage real, no
      // "temporada pasada reciente").
      const matchesType =
        typeFilter.length === 0 ||
        typeFilter.some((tf) => {
          if (p.typeKey !== tf) return false;
          if (tf === "retro") return seasonSortValue(p.season) <= 2006;
          return true;
        });
      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(teamCategory[p.teamKey]);
      const matchesSeason = seasonFilter.length === 0 || seasonFilter.includes(p.season);
      const matchesAgeGroup =
        ageGroupFilter.length === 0 || ageGroupFilter.includes(getAgeGroup(p));
      const matchesBrand =
        brandFilter.length === 0 || (!!p.brand && brandFilter.includes(p.brand));
      const matchesSize =
        sizeFilter.length === 0 || availableSizes(p).some((s) => sizeFilter.includes(s));
      const matchesColor =
        colorFilter.length === 0 || colorFilter.includes(productColorKey(p));
      const matchesShipping = shipsToCountry(p, countryCode);
      const matchesPriceRange = (() => {
        if (priceRange[0] === PRICE_RANGE_MIN && priceRange[1] === PRICE_RANGE_MAX) return true;
        const best = bestOfferForCountry(p, countryCode);
        if (!best) return false;
        const totalEUR = sortSafeOfferTotalInEUR(best);
        // Llevar la manija de arriba al tope del slider quita el límite
        // superior por completo (ver comentario en SearchFilterContext.tsx).
        const withinMax = priceRange[1] === PRICE_RANGE_MAX || totalEUR <= priceRange[1];
        return totalEUR >= priceRange[0] && withinMax;
      })();
      return (
        matchesQuery &&
        matchesType &&
        matchesCategory &&
        matchesSeason &&
        matchesAgeGroup &&
        matchesBrand &&
        matchesSize &&
        matchesColor &&
        matchesShipping &&
        matchesPriceRange
      );
    });

    if (sortBy === "relevance") {
      // No alcanza con ordenar por popularidad del equipo: eso deja todas
      // las camisetas de un mismo club juntas (ej. 15 del Real Madrid
      // seguidas) antes de pasar al próximo. El usuario pidió una MEZCLA:
      // los equipos más importantes tienen que aparecer primero, pero
      // intercalados entre sí, no en bloques por club. Agrupamos por
      // equipo, ordenamos los grupos por popularidad, y los intercalamos
      // round-robin (una camiseta de cada equipo por vuelta).
      const groups = new Map<TeamKey, Product[]>();
      for (const p of filtered) {
        const g = groups.get(p.teamKey);
        if (g) g.push(p);
        else groups.set(p.teamKey, [p]);
      }
      const orderedGroups = [...groups.entries()].sort(([teamA], [teamB]) => {
        const diff = teamPopularity(teamB) - teamPopularity(teamA);
        if (diff !== 0) return diff;
        return teamNames[teamA][locale].localeCompare(teamNames[teamB][locale]);
      });
      const mixed: Product[] = [];
      let round = 0;
      let remaining = filtered.length;
      while (remaining > 0) {
        for (const [, group] of orderedGroups) {
          if (round < group.length) {
            mixed.push(group[round]);
            remaining--;
          }
        }
        round++;
      }
      return mixed;
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "seasonNewest" || sortBy === "seasonOldest") {
        const diff = seasonSortValue(a.season) - seasonSortValue(b.season);
        return sortBy === "seasonNewest" ? -diff : diff;
      }
      const bestA = bestOfferForCountry(a, countryCode);
      const bestB = bestOfferForCountry(b, countryCode);
      const totalA = bestA ? sortSafeOfferTotalInEUR(bestA) : Infinity;
      const totalB = bestB ? sortSafeOfferTotalInEUR(bestB) : Infinity;
      return sortBy === "priceDesc" ? totalB - totalA : totalA - totalB;
    });
  }, [
    deferredQuery,
    locale,
    typeFilter,
    categoryFilter,
    seasonFilter,
    ageGroupFilter,
    brandFilter,
    sizeFilter,
    colorFilter,
    priceRange,
    countryCode,
    sortBy,
  ]);

  // Cuando el usuario cambia de verdad los filtros/orden/búsqueda mientras
  // está en esta página, volvemos a mostrar solo la primera tanda. OJO:
  // esto NO debe dispararse en el primer render tras un montaje -- entrar
  // a una camiseta y volver (con "volver al catálogo" o con atrás del
  // navegador) desmonta y remonta este componente con los mismos filtros
  // de antes, y ahí es donde queremos CONSERVAR cuántas tandas de "Ver
  // más" había cargado el usuario (visibleCount vive en el contexto de
  // filtros, que no se desmonta, así que sobrevive solo si no lo
  // reseteamos acá).
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setVisibleCount(CATALOG_PAGE_SIZE);
    sessionStorage.removeItem(SCROLL_KEY);
  }, [query, typeFilter, categoryFilter, seasonFilter, ageGroupFilter, brandFilter, sizeFilter, colorFilter, priceRange, countryCode, sortBy]);

  // Restaura la posición de scroll al volver de una camiseta -- Next.js
  // solo restaura scroll nativamente en navegación "atrás" del navegador,
  // no cuando se vuelve por el link "volver al catálogo" (es una
  // navegación nueva, no un pop), así que lo hacemos a mano. Se guarda al
  // desmontar (que es cuando el usuario se va de esta página) y se
  // restaura al montar, después de que las cartas de visibleCount ya
  // restaurado le dieron a la página el mismo alto que tenía antes.
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
    }
    return () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
  }, []);

  const visibleResults = results.slice(0, visibleCount);

  const SORT_OPTIONS: { key: typeof sortBy; label: string }[] = [
    { key: "relevance", label: t.search.sortRelevance },
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
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#675c44] transition-colors hover:bg-black/[0.05] hover:text-[#1a1a1a]"
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
            ref={sortButtonRef}
            onClick={() => setSortOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
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

        {sortOpen && (
          <Portal>
            <div
              ref={sortPanelRef}
              className="fixed z-50 hidden w-64 flex-col gap-1 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] md:flex"
              style={{ top: sortPanelPos.top, right: sortPanelPos.right }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSortBy(opt.key);
                    setSortOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                    sortBy === opt.key
                      ? "bg-[#1B3B2B] text-[#F3E9C9]"
                      : "text-[#3a3a36] hover:bg-black/[0.04]"
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.key && (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </Portal>
        )}

        {(activeFilterCount > 0 || query.trim().length > 0) && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 self-start text-xs font-medium text-[#675c44] transition-colors hover:text-[#1a1a1a]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {t.search.clearFilters}
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-[#8a8a84]">
          {t.search.noResults.replace("{query}", query)}
        </p>
      ) : (
        <>
          <p className="text-xs text-[#675c44]">
            {t.search.resultsCount.replace("{n}", String(results.length))}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {visibleResults.map((product: Product, i) => (
              <div
                key={product.id}
                className="card-rise-in"
                style={{ animationDelay: `${(i % 12) * 35}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {visibleCount < results.length && (
            <button
              onClick={() => setVisibleCount((c) => c + CATALOG_PAGE_SIZE)}
              className="mx-auto flex items-center justify-center gap-2 rounded-full border border-[#C9A24B]/30 bg-[#FFFDF8] px-6 py-3 text-sm font-medium text-[#1a1a1a] shadow-vintage-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1B3B2B]/40 active:scale-95"
            >
              {t.search.loadMore} ({results.length - visibleCount})
            </button>
          )}
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
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-[#675c44] transition-colors hover:text-[#1a1a1a]"
                  >
                    {t.search.clearFilters}
                  </button>
                )}
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label={t.search.clearAria}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#675c44] hover:bg-black/[0.05] hover:text-[#1a1a1a]"
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
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.quickSelectLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  {QUICK_PICK_TEAMS.map((key) => {
                    const active = query.toLowerCase() === teamNames[key].es.toLowerCase();
                    return (
                      <Chip
                        key={key}
                        active={active}
                        onClick={() => setQuery(active ? "" : teamNames[key][locale])}
                        className="flex-shrink-0 whitespace-nowrap"
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
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.nav.categories}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={categoryFilter.length === 0}
                    onClick={() => setCategoryFilter([])}
                    accent="amber"
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  <Chip
                    active={categoryFilter.includes("national")}
                    onClick={() => toggleCategoryFilter("national")}
                    accent="amber"
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.categoryNational}
                  </Chip>
                  <Chip
                    active={categoryFilter.includes("club")}
                    onClick={() => toggleCategoryFilter("club")}
                    accent="amber"
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.categoryClubs}
                  </Chip>
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.typeLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={typeFilter.length === 0}
                    onClick={() => setTypeFilter([])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  {TYPE_FILTERS.map((key) => (
                    <Chip
                      key={key}
                      active={typeFilter.includes(key)}
                      onClick={() => toggleTypeFilter(key)}
                      className="flex-shrink-0 whitespace-nowrap"
                    >
                      {typeNames[key][locale]}
                    </Chip>
                  ))}
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.brandLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={brandFilter.length === 0}
                    onClick={() => setBrandFilter([])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  {BRAND_FILTERS.map((key) => (
                    <Chip
                      key={key}
                      active={brandFilter.includes(key)}
                      onClick={() => toggleBrandFilter(key)}
                      className="flex-shrink-0 whitespace-nowrap"
                    >
                      {brandNames[key]}
                    </Chip>
                  ))}
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.priceRangeLabel}:</span>
                <PriceRangeSlider
                  min={PRICE_RANGE_MIN}
                  max={PRICE_RANGE_MAX}
                  value={priceRange}
                  onChange={setPriceRange}
                  formatLabel={(v, isMax) => (isMax ? `€${v}+` : `€${v}`)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.sizeLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={sizeFilter.length === 0}
                    onClick={() => setSizeFilter([])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  {SIZES.map((size) => (
                    <Chip
                      key={size}
                      active={sizeFilter.includes(size)}
                      onClick={() => toggleSizeFilter(size)}
                      className="flex-shrink-0 whitespace-nowrap"
                    >
                      {size}
                    </Chip>
                  ))}
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.colorLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={colorFilter.length === 0}
                    onClick={() => setColorFilter([])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  {COLOR_ORDER.map((key) => (
                    <Chip
                      key={key}
                      active={colorFilter.includes(key)}
                      onClick={() => toggleColorFilter(key)}
                      className="flex-shrink-0 whitespace-nowrap"
                    >
                      <span
                        className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: COLOR_SWATCH[key] }}
                      />
                      {t.search[COLOR_LABEL_KEY[key]]}
                    </Chip>
                  ))}
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.seasonLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={seasonFilter.length === 0}
                    onClick={() => setSeasonFilter([])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  {SEASONS.map((season) => (
                    <Chip
                      key={season}
                      active={seasonFilter.includes(season)}
                      onClick={() => toggleSeasonFilter(season)}
                      className="flex-shrink-0 whitespace-nowrap"
                    >
                      {season}
                    </Chip>
                  ))}
                </ScrollArrowRow>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-[#675c44]">{t.search.ageGroupLabel}:</span>
                <ScrollArrowRow className="-mx-5 gap-2 px-5">
                  <Chip
                    active={ageGroupFilter.length === 0}
                    onClick={() => setAgeGroupFilter([])}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    {t.search.allCategories}
                  </Chip>
                  {AGE_GROUP_FILTERS.map((key) => (
                    <Chip
                      key={key}
                      active={ageGroupFilter.includes(key)}
                      onClick={() => toggleAgeGroupFilter(key)}
                      className="flex-shrink-0 whitespace-nowrap"
                    >
                      {key === "men"
                        ? t.search.ageGroupMen
                        : key === "women"
                          ? t.search.ageGroupWomen
                          : t.search.ageGroupKids}
                    </Chip>
                  ))}
                </ScrollArrowRow>
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
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSortOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-[#FFFDF8] shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.25)] md:hidden">
            <div className="flex items-center justify-between border-b border-[#C9A24B]/20 px-5 py-4">
              <p className="font-card-title text-lg text-[#1a1a1a]">{t.search.sortLabel}</p>
              <button
                onClick={() => setSortOpen(false)}
                aria-label={t.search.clearAria}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#675c44] hover:bg-black/[0.05] hover:text-[#1a1a1a]"
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
