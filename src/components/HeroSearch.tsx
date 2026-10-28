"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import type { HeroSuggestion } from "@/lib/heroSuggestions";
import { getDisplaySrc } from "@/lib/images";
import { matchTypeahead, prepare, TYPEAHEAD_UI, type Prepared } from "@/lib/search/typeahead";

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
//
// Autocompletado (2026-10-28): desde 2 letras se abre una lista de equipos,
// selecciones, ligas y productos que lleva directo a su página. El índice
// (/api/search-index/[locale], JSON estático, ~127 KB gzip) se pide recién al
// enfocar la caja: quien no busca no lo descarga. Enter sin nada resaltado
// sigue filtrando el catálogo de abajo como antes. Sin debounce: el cruce es
// local y tarda menos de un milisegundo (ver matchTypeahead).
export default function HeroSearch({ suggestions }: { suggestions: HeroSuggestion[] }) {
  const { t, locale } = useLanguage();
  const { query, setQuery } = useSearchFilter();
  const router = useRouter();
  const [index, setIndex] = useState<Prepared[] | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const loading = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();

  const results = useMemo(() => (index ? matchTypeahead(index, query) : []), [index, query]);
  const shown = open && results.length > 0;
  const optId = (i: number) => `${id}-o${i}`;

  function load() {
    if (loading.current) return;
    loading.current = true;
    fetch(`/api/search-index/${locale}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((e) => setIndex(prepare(e)))
      // Sin índice el buscador sigue filtrando el catálogo; se reintenta al
      // volver a enfocar.
      .catch(() => (loading.current = false));
  }

  // Cierra al tocar fuera.
  useEffect(() => {
    if (!shown) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [shown]);

  useEffect(() => {
    if (active >= 0) document.getElementById(`${id}-o${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, id]);

  function run(q: string) {
    setOpen(false);
    setQuery(q);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const n = results.length;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!n) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (shown && a >= 0 ? (a + step + n) % n : step > 0 ? 0 : n - 1));
    } else if (e.key === "Enter" && shown && active >= 0) {
      e.preventDefault();
      setOpen(false);
      router.push(`/${locale}${results[active].h}`);
    } else if (e.key === "Escape" && shown) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  }

  // Buscador grande (52 px, botón con lupa) y atajos en UNA fila con
  // scroll lateral: antes se partían en filas desiguales y la etiqueta
  // "Prueba" iba en 10 px dorado claro, casi invisible (2026-10-17).
  const ui = TYPEAHEAD_UI[locale];
  return (
    <div className="mt-4">
      <div ref={box} className="relative max-w-2xl">
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
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => {
              load();
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={shown}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={shown && active >= 0 ? optId(active) : undefined}
            autoComplete="off"
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

        {/* Panel absoluto: se superpone a lo de abajo, no lo empuja. */}
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={t.search.label}
          hidden={!shown}
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-[min(70vh,30rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[#C9A24B]/50 bg-white py-1 shadow-lg"
        >
          {shown &&
            results.map((r, i) => (
              <li key={r.h} role="none">
                {(i === 0 || results[i - 1].g !== r.g) && (
                  <div aria-hidden className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[#5b4a1f]">
                    {ui[r.g]}
                  </div>
                )}
                <Link
                  id={optId(i)}
                  role="option"
                  aria-selected={i === active}
                  tabIndex={-1}
                  href={`/${locale}${r.h}`}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex min-h-11 items-center gap-3 px-4 py-1.5 text-sm text-[#1B3B2B] ${i === active ? "bg-[#F3E9C9]" : ""}`}
                >
                  <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#fffdf8] text-2xl">
                    {r.f ??
                      (r.i && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getDisplaySrc(r.i, 80)} alt="" width={40} height={40} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                      ))}
                  </span>
                  <span className="line-clamp-2 min-w-0 leading-snug">{r.n}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>

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
