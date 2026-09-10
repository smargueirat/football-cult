"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SECTION_PATHS } from "@/lib/sections";

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

  const sectionLinks = [
    { label: t.categoriesMenu.national, href: SECTION_PATHS[0] },
    { label: t.categoriesMenu.clubs, href: SECTION_PATHS[1] },
    { label: t.categoriesMenu.retro, href: SECTION_PATHS[2] },
    { label: t.heroSlides[3]?.eyebrow, href: SECTION_PATHS[3] },
    { label: t.heroSlides[4]?.eyebrow, href: SECTION_PATHS[4] },
    { label: "Botas", href: SECTION_PATHS[5] },
  ];

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
        {t.nav.categories}
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
          className="solid-panel absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-2xl border border-[#C9A24B]/25 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]"
        >
          {sectionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
