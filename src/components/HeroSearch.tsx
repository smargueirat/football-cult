"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import type { HeroSuggestion } from "@/lib/heroSuggestions";

// Buscador en el hero.
//
// El catálogo y sus filtros ya vivían abajo del todo, después del
// carrusel, las categorías, las ligas y las bajadas de precio: había que
// hacer bastante scroll antes de poder buscar nada. Esto no duplica el
// buscador -- escribe en el MISMO estado compartido (SearchFilterContext)
// y lleva al catálogo, así que no hay dos búsquedas que puedan
// contradecirse.
//
// Los atajos salen del catálogo (ver heroSuggestions.ts), no escritos a
// mano: si no, en unas semanas alguno deja de devolver resultados.
//
// El input está atado directo a `query` del contexto y ya no a un useState
// local. El local era un segundo estado que decía lo mismo, y se notaba:
// al entrar por un link con ?q= (ver SearchQueryUrlSync) el catálogo
// aparecía filtrado pero esta caja quedaba vacía, sin explicar por qué.
export default function HeroSearch({ suggestions }: { suggestions: HeroSuggestion[] }) {
  const { t } = useLanguage();
  const { query, setQuery } = useSearchFilter();

  function run(q: string) {
    setQuery(q);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Buscador grande (52 px, botón con lupa) y atajos en UNA fila con
  // scroll lateral: antes se partían en filas desiguales y la etiqueta
  // "Prueba" iba en 10 px dorado claro, casi invisible (2026-10-17).
  return (
    <div className="mt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query.trim());
        }}
        className="flex h-[52px] max-w-2xl items-center rounded-full border border-[#C9A24B]/60 bg-white p-1 shadow-sm transition-colors focus-within:border-[#1B3B2B] focus-within:ring-2 focus-within:ring-[#1B3B2B]/20"
        role="search"
      >
        <label className="sr-only" htmlFor="hero-search">
          {t.search.label}
        </label>
        <input
          id="hero-search"
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.hero.searchPlaceholder}
          className="h-full min-w-0 flex-1 bg-transparent pl-4 pr-2 text-base text-[#1a1a1a] outline-none placeholder:text-[#6b6455]"
        />
        <button
          type="submit"
          className="flex h-full shrink-0 items-center gap-1.5 rounded-full bg-[#1B3B2B] px-4 text-sm font-semibold text-[#F3E9C9] transition-colors hover:bg-[#15301f] sm:px-5"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current" strokeWidth={2.2} strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          {t.hero.searchCta}
        </button>
      </form>

      <div className="-mx-4 mt-2 flex items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" data-hero="suggest">
        <span className="shrink-0 text-xs font-semibold text-[#5b4a1f]">{t.hero.searchTry}</span>
        {suggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => run(s.query)}
            className="min-h-11 shrink-0 whitespace-nowrap rounded-full px-1.5 text-[13px] text-[#1B3B2B] underline decoration-[#C9A24B] decoration-1 underline-offset-4 transition-colors hover:text-[#8a6a1f]"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
