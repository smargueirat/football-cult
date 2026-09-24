"use client";

import { useState } from "react";
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
export default function HeroSearch({ suggestions }: { suggestions: HeroSuggestion[] }) {
  const { t } = useLanguage();
  const { setQuery } = useSearchFilter();
  const [value, setValue] = useState("");

  function run(q: string) {
    setQuery(q);
    setValue(q);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mt-6 sm:mt-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value.trim());
        }}
        className="flex max-w-2xl flex-wrap gap-2"
        role="search"
      >
        <label className="sr-only" htmlFor="hero-search">
          {t.search.label}
        </label>
        <input
          id="hero-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.hero.searchPlaceholder}
          className="min-w-0 flex-1 rounded-full border border-[#C9A24B]/50 bg-white/90 px-5 py-3 text-[15px] text-[#1a1a1a] shadow-sm outline-none transition-colors focus:border-[#1B3B2B]"
        />
        <button
          type="submit"
          className="vintage-plaque shrink-0 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide"
        >
          {t.hero.searchCta}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-tagline text-[10px] uppercase text-[#B8933F]">
          {t.hero.searchTry}
        </span>
        {suggestions.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => run(s.query)}
            className="font-card-title rounded-full border border-[#C9A24B]/45 bg-white/60 px-3 py-1 text-[11px] tracking-wide text-[#5b5442] transition-colors hover:border-[#1B3B2B]/50 hover:text-[#1a1a1a] sm:text-xs"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
