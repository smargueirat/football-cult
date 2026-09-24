"use client";

import Image from "next/image";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SECTION_PATHS, SECTION_PHOTOS } from "@/lib/sections";
import { getDisplaySrc } from "@/lib/images";

// Nav de secciones, deliberadamente distinta a una tarjeta de producto:
// foto circular (no cuadrada como ProductCard3D/BootCard), fondo oscuro
// tipo "steps" (no la card blanca de un producto en venta), y el mismo
// font-vintage grande de los títulos H1 en vez de la tipografía de
// producto (font-card-title) -- pedido explícito del usuario después de
// que esta fila se confundía visualmente con las tarjetas de camisetas
// de abajo.
// Solo retro lleva distintivo. "Ofertas" también se quería destacar,
// pero /ofertas no es una de estas secciones: tiene su propio bloque en
// el home (PriceDropsSection), así que un distintivo acá nunca se
// renderizaría. Ponerle uno a todas no destacaría ninguna.
const HIGHLIGHT: Partial<Record<string, "vintage">> = {
  "/retro": "vintage",
};

export default function CategorySections() {
  const { t } = useLanguage();

  return (
    <div className="vintage-dark rounded-2xl border border-[#C9A24B]/25 px-3 py-5 sm:rounded-3xl sm:px-6 sm:py-7">
      <p className="font-tagline mb-3 text-center text-[11px] uppercase tracking-[0.15em] text-[#B8933F] sm:mb-4 sm:text-xs">
        {t.botas.exploreSections}
      </p>
      {/* Menos columnas y círculos más grandes: con 6 en escritorio las
          fotos quedaban tan chicas que no se distinguía la camiseta, que
          es lo único que hace útil a esta fila. Se mantiene el círculo
          sobre panel oscuro a propósito -- es lo que la separa de las
          tarjetas de producto de abajo, con las que antes se confundía. */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6">
        {SECTION_PATHS.map((path, i) => (
          <Link key={path} href={path} className="group flex flex-col items-center gap-2">
            {/* object-cover, no object-contain: contain dejaba ver el
                borde recto de la foto adentro del círculo (una foto
                cuadrada dentro de un marco redondo, con una costura
                fea) -- reportado real por el usuario. Antes se había
                cambiado a contain por un problema de la persona tapada,
                pero probado de forma aislada con el contenedor
                realmente cuadrado (confirmado 110x110 acá), cover se ve
                perfecto en las fotos de campaña (las 3 nuevas de
                guantes/pelotas/tickets son foto de producto cuadrada
                pura, así que ya encajan sin recorte real): el recorte
                de un círculo es
                parejo en las 4 direcciones desde el centro, no solo
                arriba/abajo como en el banner ancho (ver
                SECTION_HERO_FIT en sections.ts, ese es un problema
                distinto y real, pero no aplica acá). */}
            <div className="relative aspect-square w-full max-w-[150px] overflow-hidden rounded-full border-2 border-[#C9A24B]/50 bg-[#F3EEDD] shadow-vintage-sm transition-transform group-hover:-translate-y-1 group-hover:border-[#E7C567]">
              <Image
                src={getDisplaySrc(SECTION_PHOTOS[i], 300)}
                alt={t.heroSlides[i]?.eyebrow ?? ""}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <span className="font-vintage line-clamp-2 text-center text-[11px] leading-tight text-[#F3E9C9] sm:text-sm">
              {t.heroSlides[i]?.eyebrow}
            </span>
            {/* Solo retro y ofertas llevan distintivo: son las dos
                secciones que nos diferencian de comprar en la tienda.
                Ponerle uno a todas no destacaría ninguna. */}
            {HIGHLIGHT[path] && (
              <span className="font-card-title -mt-0.5 rounded-full bg-[#C9A24B]/20 px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#E7C567] sm:text-[10px]">
                {t.sections[HIGHLIGHT[path]]}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
