"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SECTION_PATHS, SECTION_PHOTOS } from "@/lib/sections";
import { getDisplaySrc } from "@/lib/images";

// Un solo botón "Categorías" con las 6 secciones adentro, en vez de 6
// links sueltos en la barra -- pedido explícito del usuario. Un SOLO
// mecanismo de apertura (click, con click-afuera para cerrar -- mismo
// patrón ya probado en el dropdown de "Ordenar" de SearchExplorer), a
// propósito: la versión vieja de este menú combinaba hover-para-abrir
// con click-para-toggle, y clickear el botón mientras ya estaba abierto
// por hover lo cerraba en el acto -- de ahí el bug real que se reportó
// ("clickear lo hace desaparecer"). Sin hover acá, no hay forma de que
// eso vuelva a pasar.
export default function SectionsMenu() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Orden alfabético por el label ya traducido (no un orden fijo
  // codificado) + una foto real de esa sección al lado de cada link,
  // más visual que solo texto -- mismas fotos ya curadas del hero y de
  // CategorySections, ninguna nueva.
  const sectionLinks = [
    { label: t.categoriesMenu.national, href: SECTION_PATHS[0], photo: SECTION_PHOTOS[0] },
    { label: t.categoriesMenu.clubs, href: SECTION_PATHS[1], photo: SECTION_PHOTOS[1] },
    { label: t.categoriesMenu.retro, href: SECTION_PATHS[2], photo: SECTION_PHOTOS[2] },
    { label: t.heroSlides[3]?.eyebrow, href: SECTION_PATHS[3], photo: SECTION_PHOTOS[3] },
    { label: t.heroSlides[4]?.eyebrow, href: SECTION_PATHS[4], photo: SECTION_PHOTOS[4] },
    { label: t.botas.navLabel, href: SECTION_PATHS[5], photo: SECTION_PHOTOS[5] },
  ].sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-[#1a1a1a]"
      >
        🛒 {t.nav.categories}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="solid-panel absolute left-1/2 top-full mt-2 w-60 -translate-x-1/2 rounded-2xl border border-[#C9A24B]/25 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]"
        >
          {sectionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
            >
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#C9A24B]/40 bg-[#F3EEDD]">
                <Image src={getDisplaySrc(link.photo, 100)} alt="" fill unoptimized className="object-contain p-0.5" />
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
