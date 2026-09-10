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
export default function CategorySections() {
  const { t } = useLanguage();

  return (
    <div className="vintage-dark rounded-2xl border border-[#C9A24B]/25 px-3 py-5 sm:rounded-3xl sm:px-6 sm:py-7">
      <p className="font-tagline mb-3 text-center text-[11px] uppercase tracking-[0.15em] text-[#B8933F] sm:mb-4 sm:text-xs">
        {t.botas.exploreSections}
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {SECTION_PATHS.map((path, i) => (
          <Link key={path} href={path} className="group flex flex-col items-center gap-2">
            {/* object-contain, no object-cover: un recorte centrado de una
                foto cuadrada con la persona chica en el medio (mucho
                margen alrededor, normal en foto de producto) dejaba a la
                persona invisible o casi -- reportado real por el
                usuario en 4 de las 6 fotos. Con contain se ve la foto
                entera siempre, aunque no llene el círculo del todo. */}
            <div className="relative aspect-square w-full max-w-[110px] overflow-hidden rounded-full border-2 border-[#C9A24B]/50 bg-[#F3EEDD] shadow-vintage-sm transition-transform group-hover:-translate-y-1 group-hover:border-[#E7C567]">
              <Image
                src={getDisplaySrc(SECTION_PHOTOS[i], 300)}
                alt={t.heroSlides[i]?.eyebrow ?? ""}
                fill
                unoptimized
                className="object-contain p-1.5"
              />
            </div>
            <span className="font-vintage line-clamp-2 text-center text-[10px] leading-tight text-[#F3E9C9] sm:text-sm">
              {t.heroSlides[i]?.eyebrow}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
