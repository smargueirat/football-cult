"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDisplaySrc } from "@/lib/images";
import { SECTION_PATHS, SECTION_PHOTOS } from "@/lib/sections";

const SLIDE_COUNT = 6;
const AUTO_ADVANCE_MS = 5500;

// Fotos y rutas reales compartidas con CategorySections (mismo orden que
// heroSlides en translations.ts) -- ver src/lib/sections.ts. Nota sobre
// la foto de botas: a diferencia de las camisetas (las tiendas de
// indumentaria SIEMPRE tienen una foto "puesta" en modelo), se buscó en
// Futbol Emotion, Forum Sport, adidas.es y Nike.es una foto de una bota
// puesta en un pie/jugador real, y las cuatro solo publican fotos de
// producto plano (estudio, sin persona) -- es una norma real de cómo se
// fotografía calzado de fútbol en retail, no una limitación nuestra. Se
// usa la mejor foto de producto real disponible en vez de forzar/inventar
// una "on-model".
const CURATED_SLIDE_PHOTOS = SECTION_PHOTOS;
const SLIDE_PATHS = SECTION_PATHS;

export default function HeroCarousel() {
  const { t, locale } = useLanguage();
  const router = useRouter();
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

  function goToSection(index: number) {
    router.push(`/${locale}${SLIDE_PATHS[index]}`);
  }

  return (
    <div
      className="vintage-dark shadow-vintage-lg relative h-[300px] overflow-hidden rounded-2xl sm:h-[460px] sm:rounded-3xl"
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
          className={`absolute inset-0 grid grid-cols-[1fr_auto] content-center items-center gap-3 px-5 py-5 transition-opacity duration-700 ease-out sm:grid-cols-2 sm:gap-8 sm:px-12 sm:py-6 ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          {/* Foto siempre cuadrada (nunca una caja corta y ancha que la
              achicaba) -- mismo layout de 2 columnas en mobile y
              escritorio, la única diferencia es cuánto lugar ocupa cada
              lado. line-clamp en el subtítulo asegura que el bloque de
              texto mida siempre lo mismo sea cual sea el largo real de
              cada slide, así el botón dorado nunca se corre de lugar. */}
          <div className="relative z-10 order-1 flex flex-col items-start gap-1.5 text-left sm:gap-3">
            <span className="font-tagline text-[11px] uppercase text-[#E7C567] sm:text-sm">
              {slide.eyebrow}
            </span>
            <h1 className="font-vintage text-2xl leading-tight text-[#F3E9C9] sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="line-clamp-2 max-w-md text-xs text-[#D9CFAE] sm:max-w-lg sm:text-base">
              {slide.subtitle}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToSection(i);
              }}
              className="shadow-vintage-md relative mt-1 inline-flex items-center gap-2 rounded-full border border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2A2410] transition-transform hover:scale-[1.03] sm:px-6 sm:py-2.5 sm:text-sm"
            >
              {slide.cta}
              <span aria-hidden>→</span>
            </button>
          </div>

          {/* Bug real: "aspect-square" sin prefijo quedaba activo también
              en desktop, y con sm:w-full (ancho fijado por la columna del
              grid) el aspect-ratio forzaba una altura = ese ancho -- casi
              siempre bastante más alta que la caja real del carrusel
              (400px), así que el overflow-hidden del contenedor de afuera
              terminaba recortando la cabeza del modelo. Alto fijo y
              explícito en vez de aspect-square: así object-contain tiene
              un límite real dentro del cual entra la foto completa. */}
          <div className="relative order-2 flex h-[190px] w-full items-center justify-center overflow-hidden sm:h-[400px]">
            {slide.photo && (
              <img
                src={getDisplaySrc(slide.photo, 600)}
                alt=""
                aria-hidden
                className={`h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] ${
                  i === active ? "hero-photo-kenburns" : ""
                }`}
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
