"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import { getDisplaySrc } from "@/lib/images";

const SLIDE_COUNT = 5;
const AUTO_ADVANCE_MS = 5500;

// Foto exacta curada a mano por slide -- se revisaron las fotos reales
// del catálogo (no cualquier oferta del producto: la URL puntual que
// se ve acá) y se eligió la mejor concreta de cada categoría, con una
// persona puesta la camiseta siempre que existiera esa toma en el
// catálogo (selecciones/clubes/niños/mujer la tienen -- selecciones,
// clubes y niños se encontraron vía la variante "apparel_on_model" que
// algunos feeds de Awin traen; la de mujer es una oferta de eBay del
// Tottenham away con modelo real). Retro es la única sin ninguna foto
// con modelo en todo el catálogo (se revisó a mano), así que ahí queda
// la mejor foto de producto disponible. Se usa la URL de alta
// resolución del proveedor directamente (no el thumbnail chico que
// guarda la oferta) para que se vea nítida a este tamaño.
const CURATED_SLIDE_PHOTOS: string[] = [
  "https://cdn.blazimg.com/1800/product/2/0/2025_11_12_adidas_jm8396_4_apparel_on_model_standard_view_white.webp", // selecciones: Argentina 2026, con modelo
  "https://cdn.blazimg.com/1800/product/a/d/adidas_ji9511_3_apparel_on_model_standard_view_white.webp", // clubes: Arsenal 25/26, con modelo
  "https://cdn.shopify.com/s/files/1/0650/0725/5657/files/Cantona_7_Retro_Manchester_United_Home_Jersey_199294_2.webp?v=1766469606", // retro: Cantona 7, Man United 1992/94
  "https://i.ebayimg.com/images/g/3yYAAOSwN8NniF15/s-l1600.jpg", // mujer: Tottenham away 2024/25, con modelo
  "https://cdn.blazimg.com/1800/product/2/0/2025_adidas_jn8887_3_apparel_on_model_standard_view_white.webp", // niños: Real Madrid, con modelo
];

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
        photo: CURATED_SLIDE_PHOTOS[i],
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
  const justSwiped = useRef(false);
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
    // Un swipe real dispara además un click sintético al soltar el dedo --
    // se lo ignora por un instante para no avanzar dos slides de una.
    justSwiped.current = true;
    setTimeout(() => {
      justSwiped.current = false;
    }, 300);
    goTo(active + (dx < 0 ? 1 : -1));
  }

  // Click en cualquier parte del recuadro (fuera del CTA/puntitos/flechas,
  // que cortan la propagación) avanza al siguiente slide -- pedido
  // explícito para la versión de escritorio, donde antes solo se podía
  // navegar con los puntitos/flechas chicos.
  function handleContainerClick() {
    if (justSwiped.current) return;
    setActive((cur) => (cur + 1) % SLIDE_COUNT);
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
      className="vintage-dark shadow-vintage-lg relative h-[420px] overflow-hidden rounded-2xl sm:h-[400px] sm:rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
    >
      <div className="stadium-beam-a pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {/* Los slides SIEMPRE están en absolute (nunca "relative"/en el
          flujo normal) -- así el tamaño del recuadro nunca depende de
          cuánto texto tenga el slide activo. Antes solo el activo era
          "relative", así que el recuadro crecía o encogía según el
          largo del subtítulo de cada uno al ir cambiando. */}
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 grid grid-cols-1 content-center gap-4 px-6 py-8 transition-opacity duration-700 ease-out sm:grid-cols-2 sm:items-center sm:gap-8 sm:px-12 sm:py-10 ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
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
              onClick={(e) => {
                e.stopPropagation();
                applyFilterAndScroll(i);
              }}
              className="shadow-vintage-md relative mt-1 inline-flex items-center gap-2 rounded-full border border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2A2410] transition-transform hover:scale-[1.03] sm:text-xs"
            >
              {slide.cta}
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="relative order-1 flex aspect-[4/3] items-center justify-center sm:order-2 sm:aspect-square">
            {slide.photo && (
              <img
                src={getDisplaySrc(slide.photo, 600)}
                alt=""
                aria-hidden
                className="h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
              />
            )}
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-4">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            aria-label={`Ver sección ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-[#E7C567]" : "w-1.5 bg-[#F3E9C9]/35"
            }`}
          />
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goTo(active - 1);
        }}
        aria-label="Sección anterior"
        className="absolute left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-[#F3E9C9] backdrop-blur-sm transition-colors hover:bg-black/40 sm:flex"
      >
        ‹
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goTo(active + 1);
        }}
        aria-label="Sección siguiente"
        className="absolute right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-[#F3E9C9] backdrop-blur-sm transition-colors hover:bg-black/40 sm:flex"
      >
        ›
      </button>
    </div>
  );
}
