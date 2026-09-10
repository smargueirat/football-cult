"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDisplaySrc } from "@/lib/images";
import { SECTION_PATHS, HERO_PHOTOS, SECTION_HERO_FIT, SECTION_HERO_POSITION, SECTION_HERO_TRANSFORM } from "@/lib/sections";

const SLIDE_COUNT = 6;
const AUTO_ADVANCE_MS = 5500;

// Rutas reales compartidas con CategorySections (mismo orden que
// heroSlides en translations.ts) -- ver src/lib/sections.ts. Las fotos
// del hero (HERO_PHOTOS) son un set aparte de SECTION_PHOTOS: acá
// necesitan ser panorámicas de verdad, no fotos de producto cuadradas.
// Nota sobre la foto de botas: a diferencia de las camisetas (las
// tiendas de indumentaria SIEMPRE tienen una foto "puesta" en modelo),
// se buscó en Futbol Emotion, Forum Sport, adidas.es y Nike.es una foto
// de una bota puesta en un pie/jugador real, y las cuatro solo publican
// fotos de producto plano (estudio, sin persona) -- es una norma real
// de cómo se fotografía calzado de fútbol en retail, no una limitación
// nuestra. Se usa la mejor foto de producto real disponible en vez de
// forzar/inventar una "on-model".
const CURATED_SLIDE_PHOTOS = HERO_PHOTOS;
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
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          {/* Foto a pantalla completa cuando la composición lo permite
              (object-cover) -- pero en una foto cuadrada de estudio con
              la persona centrada, cover en un recuadro ancho SOLO
              recorta arriba/abajo (el ancho ya encaja), así que la
              persona siempre cae centrada horizontalmente, exactamente
              donde vive el degradé sólido del texto -- quedaba
              prácticamente tapada (bug real, encontrado inspeccionando
              el render en vivo). Solución real: HERO_PHOTOS reemplazó
              las 4 fotos de estudio (clubes/retro/mujer/niños) por
              fotos de campaña panorámicas de verdad, con gente
              repartida en todo el ancho (ver sections.ts) -- las 6
              secciones usan "cover" ahora. SECTION_HERO_FIT queda como
              interruptor por si en algún momento hace falta volver a
              "contain" para alguna foto puntual.

              Bug real #2, encontrado después: en "contain" el alto del
              banner es SIEMPRE el lado que manda la escala (el recuadro
              es mucho más ancho que alto), así que la foto termina
              tocando el borde de arriba y de abajo del banner sin nada
              de aire -- técnicamente no recorta un solo píxel, pero
              visualmente se ve igual de "cortada" que si recortara de
              verdad. El padding de acá le da a "contain" menos alto
              disponible para trabajar, dejando un margen real arriba y
              abajo (y de paso centra la foto en vez de pegarla arriba
              con object-top, que en "contain" no tiene ningún efecto
              porque no había margen vertical para desplazar). */}
          {/* SECTION_HERO_TRANSFORM (sólo botas) va en este wrapper, no
              en la foto -- la foto ya tiene su propia animación
              (hero-photo-kenburns) puesta por transform, y un transform
              inline en el mismo elemento se pisaría con las keyframes
              de la animación mientras corre. Poniéndolo en un wrapper
              separado que sólo envuelve a la foto, los dos transforms
              se combinan en vez de pisarse: la foto sigue haciendo su
              zoom lento de siempre, y el wrapper la corre/agranda un
              poco más para revelar más bota, pedido explícito del
              usuario (ver sections.ts para el porqué del valor). */}
          {slide.photo && (
            <div className="absolute inset-0" style={{ transform: SECTION_HERO_TRANSFORM[i] }}>
              <img
                src={getDisplaySrc(slide.photo, 1600)}
                alt=""
                aria-hidden
                className={`absolute inset-0 h-full w-full ${
                  SECTION_HERO_FIT[i] === "contain" ? "object-contain object-center p-8 sm:p-14" : "object-cover"
                } ${i === active ? "hero-photo-kenburns" : ""}`}
                style={SECTION_HERO_FIT[i] === "cover" ? { objectPosition: SECTION_HERO_POSITION[i] } : undefined}
              />
            </div>
          )}

          {/* Scrim para que el texto siga siendo legible pase lo que pase
              en la foto de abajo. Bug real la primera vez: un gradiente
              con "via" a mitad de camino empezaba a desvanecerse justo
              donde vive el texto (max-w-[52%] en escritorio), así que en
              fotos con zonas claras ahí (una cara, una camiseta blanca)
              el texto se veía "doble" / con la foto peleando contra las
              letras. Ahora es sólido (misma opacidad, sin degradé) hasta
              bien pasado el ancho del bloque de texto, y recién ahí
              empieza a desvanecerse -- así el fondo del texto es siempre
              parejo sea cual sea la foto de atrás. */}
          <div
            className="absolute inset-0 sm:hidden"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.92) 34%, transparent 58%)" }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{ background: "linear-gradient(to right, #14261c 0%, #14261c 48%, transparent 68%)" }}
          />

          <div className="relative z-10 flex h-full flex-col items-start justify-end gap-1.5 px-5 py-5 text-left sm:max-w-[52%] sm:justify-center sm:gap-3 sm:px-12 sm:py-6">
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
