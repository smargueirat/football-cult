"use client";

import Image from "next/image";
import Link from "@/lib/i18n/LocaleLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SECTION_PATHS, SECTION_PHOTOS } from "@/lib/sections";
import { getDisplaySrc } from "@/lib/images";
import Portal from "./Portal";

// Emoji antes de cada palabra en el resto del menú (búsqueda, vistos
// recientemente, contacto) -- pedido explícito del usuario después de
// que el menú mezclaba todo en una sola lista plana sin ninguna
// diferencia visual. Las 6 secciones del "Catálogo" en cambio usan la
// misma foto circular real que ya usa el dropdown de escritorio
// (SectionsMenu) -- pedido explícito del usuario: los emoji ahí se
// veían mal, quedan mejor como círculo con foto, igual que en web.
export default function MobileMenu() {
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const sectionLinks = [
    { photo: SECTION_PHOTOS[0], label: t.categoriesMenu.national, href: SECTION_PATHS[0] },
    { photo: SECTION_PHOTOS[1], label: t.categoriesMenu.clubs, href: SECTION_PATHS[1] },
    { photo: SECTION_PHOTOS[2], label: t.categoriesMenu.retro, href: SECTION_PATHS[2] },
    { photo: SECTION_PHOTOS[3], label: t.heroSlides[3]?.eyebrow, href: SECTION_PATHS[3] },
    { photo: SECTION_PHOTOS[4], label: t.heroSlides[4]?.eyebrow, href: SECTION_PATHS[4] },
    { photo: SECTION_PHOTOS[5], label: t.botas.navLabel, href: SECTION_PATHS[5] },
  ];

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label={t.nav.categories}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#1a1a1a] transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-[#C9A24B]/10 sm:h-9 sm:w-9"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[60]">
            {/* Antes tenía backdrop-blur-[2px]: un blur de pantalla
                completa sobre un fondo que ahora anima todo el tiempo
                (los orbes bokeh de StadiumWatermark) es una combinación
                cara para el navegador, y se sentía como que el menú
                tardaba/se trababa al abrir en celulares de gama media.
                Un fondo más oscuro sin blur separa igual de bien sin
                ese costo. */}
            <div
              className="absolute inset-0 bg-black/35"
              onClick={() => setOpen(false)}
            />
            <div className="shadow-vintage-lg solid-panel absolute left-0 top-0 flex h-screen w-72 flex-col overflow-y-auto border-r border-[#C9A24B]/25 p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-vintage text-sm text-[#1B3B2B]">{t.brand}</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t.detail.backToCatalog}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#5b5b57] hover:bg-[#C9A24B]/10"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    go("/");
                  }}
                  className="rounded-xl px-3 py-2.5 text-base text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
                >
                  🔍 {t.nav.search}
                </Link>
              </nav>

              <div className="my-3 h-px bg-[#C9A24B]/20" />

              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  go("/");
                }}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#8a6a1f] transition-colors hover:bg-[#C9A24B]/10"
              >
                🛒 {t.nav.catalog}
              </Link>
              <nav className="mt-1 flex flex-col gap-1">
                {sectionLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="flex items-center gap-3 rounded-xl py-2 pl-6 pr-3 text-base text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
                  >
                    <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#C9A24B]/40 bg-[#F3EEDD]">
                      <Image src={getDisplaySrc(link.photo, 100)} alt="" fill unoptimized className="object-cover" />
                    </span>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="my-3 h-px bg-[#C9A24B]/20" />

              <nav className="flex flex-col gap-1">
                <Link
                  href="/vistos-recientemente"
                  onClick={(e) => {
                    e.preventDefault();
                    go("/vistos-recientemente");
                  }}
                  className="rounded-xl px-3 py-2.5 text-base text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
                >
                  👁️ {t.recentlyViewed.title}
                </Link>
                <Link
                  href="/sobre-nosotros"
                  onClick={(e) => {
                    e.preventDefault();
                    go("/sobre-nosotros");
                  }}
                  className="rounded-xl px-3 py-2.5 text-base text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
                >
                  ℹ️ {t.nav.about}
                </Link>
                <Link
                  href="/contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    go("/contacto");
                  }}
                  className="rounded-xl px-3 py-2.5 text-base text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
                >
                  ✉️ {t.nav.contact}
                </Link>
              </nav>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
