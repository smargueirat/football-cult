"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Product,
  getAgeGroup,
  isVintageRetro,
  products,
  teamCategory,
} from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import { getDisplaySrc } from "@/lib/images";

const SLIDE_COUNT = 5;
const AUTO_ADVANCE_MS = 5500;

// Equipos que preferimos mostrar como protagonistas de cada slide (si
// el catálogo tiene foto real de alguno) -- selecciones/clubes muy
// reconocibles primero, resto elegido por el pool general.
const PREFERRED_TEAMS: string[][] = [
  ["argentina", "brasil", "espana", "francia"],
  ["realmadrid", "barcelona", "manutd", "boca"],
  [],
  [],
  [],
];

function matchesSlide(index: number, p: Product): boolean {
  switch (index) {
    case 0:
      return teamCategory[p.teamKey] === "national";
    case 1:
      return teamCategory[p.teamKey] === "club";
    case 2:
      return isVintageRetro(p);
    case 3:
      return getAgeGroup(p) === "women";
    default:
      return getAgeGroup(p) === "kids";
  }
}

// Se calcula una sola vez a nivel módulo (no en cada render): el
// catálogo no cambia en caliente durante una sesión, y es la misma
// lógica de "elegí una foto real de oferta" que ya usa ProductCard.
function pickSlideProduct(index: number): Product | undefined {
  const pool = products.filter(
    (p) => matchesSlide(index, p) && p.offers.some((o) => o.imageUrl)
  );
  if (pool.length === 0) return undefined;
  for (const team of PREFERRED_TEAMS[index]) {
    const found = pool.find((p) => p.teamKey === team);
    if (found) return found;
  }
  return pool[0];
}

const SLIDE_PRODUCTS = Array.from({ length: SLIDE_COUNT }, (_, i) => pickSlideProduct(i));

export default function HeroCarousel() {
  const { t } = useLanguage();
  const filters = useSearchFilter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = setInterval(() => {
      setActive((cur) => (cur + 1) % SLIDE_COUNT);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slides = useMemo(
    () =>
      t.heroSlides.map((text, i) => ({
        ...text,
        product: SLIDE_PRODUCTS[i],
      })),
    [t.heroSlides]
  );

  function goTo(index: number) {
    setActive(((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }

  // Swipe táctil (celular): se guarda dónde arrancó el dedo y, si se
  // suelta habiendo recorrido lo suficiente en horizontal (y más en
  // horizontal que en vertical, para no robarle el swipe al scroll de
  // la página), se cambia de slide. Umbral bajo a propósito -- es la
  // única forma de navegar el carrusel en celular además de los
  // puntitos, que son chicos para el dedo.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 40;

  function handleTouchStart(e: React.TouchEvent) {
    const t0 = e.touches[0];
    touchStart.current = { x: t0.clientX, y: t0.clientY };
    setPaused(true);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    setPaused(false);
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const end = e.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    goTo(active + (dx < 0 ? 1 : -1));
  }

  function applyFilterAndScroll(index: number) {
    filters.setQuery("");
    filters.clearAllFilters();
    if (index === 0) filters.setCategoryFilter(["national"]);
    else if (index === 1) filters.setCategoryFilter(["club"]);
    else if (index === 2) filters.setTypeFilter(["retro"]);
    else if (index === 3) filters.setAgeGroupFilter(["women"]);
    else filters.setAgeGroupFilter(["kids"]);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="vintage-dark shadow-vintage-lg relative min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[360px] sm:rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="stadium-beam-a pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`grid gap-4 px-6 py-8 transition-opacity duration-700 ease-out sm:grid-cols-2 sm:items-center sm:gap-8 sm:px-12 sm:py-10 ${
            i === active ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <div className="relative z-10 order-2 flex flex-col items-start gap-2 text-left sm:order-1">
            <span className="font-tagline text-[10px] uppercase text-[#E7C567] sm:text-xs">
              {slide.eyebrow}
            </span>
            <h1 className="font-vintage text-2xl leading-tight text-[#F3E9C9] sm:text-4xl">
              {slide.title}
            </h1>
            <p className="max-w-md text-xs text-[#D9CFAE] sm:text-sm">{slide.subtitle}</p>
            <button
              onClick={() => applyFilterAndScroll(i)}
              className="shadow-vintage-md relative mt-1 inline-flex items-center gap-2 rounded-full border border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2A2410] transition-transform hover:scale-[1.03] sm:text-xs"
            >
              {slide.cta}
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="relative order-1 flex aspect-[4/3] items-center justify-center sm:order-2 sm:aspect-square">
            {slide.product ? (
              <img
                src={getDisplaySrc(
                  slide.product.offers.find((o) => o.imageUrl)!.imageUrl!,
                  600
                )}
                alt=""
                aria-hidden
                className="h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
              />
            ) : null}
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            onClick={() => goTo(i)}
            aria-label={`Ver sección ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-[#E7C567]" : "w-1.5 bg-[#F3E9C9]/35"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => goTo(active - 1)}
        aria-label="Sección anterior"
        className="absolute left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-[#F3E9C9] backdrop-blur-sm transition-colors hover:bg-black/40 sm:flex"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(active + 1)}
        aria-label="Sección siguiente"
        className="absolute right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-[#F3E9C9] backdrop-blur-sm transition-colors hover:bg-black/40 sm:flex"
      >
        ›
      </button>
    </div>
  );
}
