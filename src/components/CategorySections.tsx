"use client";

import Image from "next/image";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SECTION_PATHS, SECTION_PHOTOS } from "@/lib/sections";
import { getDisplaySrc } from "@/lib/images";

// Fila de tarjetas por sección debajo del hero -- mismas fotos/rutas
// reales que las slides del carrusel (src/lib/sections.ts), un acceso
// directo más visible a cada página dedicada.
export default function CategorySections() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
      {SECTION_PATHS.map((path, i) => (
        <Link
          key={path}
          href={path}
          className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-vintage-sm transition-transform hover:-translate-y-0.5"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#F3EEDD]">
            <Image
              src={getDisplaySrc(SECTION_PHOTOS[i], 300)}
              alt={t.heroSlides[i]?.eyebrow ?? ""}
              fill
              unoptimized
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <span className="line-clamp-2 p-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#1B3B2B] sm:text-xs">
            {t.heroSlides[i]?.eyebrow}
          </span>
        </Link>
      ))}
    </div>
  );
}
