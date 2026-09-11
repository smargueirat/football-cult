"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SectionsMenu from "./SectionsMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import LoginButton from "./LoginButton";

// dynamic() en vez de un import estático directo: el Header se manda en
// TODAS las páginas (hasta "términos" o "sobre nosotros"). Ya no
// importan products.ts directo (ver el split
// FavoritesButton/FavoritesPanelContent y el fix de CountrySelector a
// @/data/countries), pero se deja el dynamic() igual -- separa su JS
// del bundle inicial del Header sin costo real, y evita tener que
// revertirlo si alguno vuelve a crecer.
const FavoritesButton = dynamic(() => import("./FavoritesButton"), { ssr: false });
const CountrySelector = dynamic(() => import("./CountrySelector"), { ssr: false });

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-[#C9A24B]/25">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-3 py-2 sm:px-8 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-1 sm:gap-4">
          <MobileMenu />
          <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            {/* unoptimized: renders on every page, was burning the 5K/mo
                Vercel Image Optimization quota by itself (see lib/images.ts
                for the same fix applied to product photos). */}
            <Image
              src="/logo-badge.png"
              alt={t.brand}
              width={56}
              height={56}
              className="h-10 w-10 shrink-0 sm:h-14 sm:w-14"
              priority
              unoptimized
            />
            {/* min-w-0 + truncate: en mobile angosto el nombre chocaba con
                los íconos de la derecha (login, favoritos, idioma) --
                sin esto, un span de texto dentro de un flex item no se
                achica solo, se sigue estirando por más ancho de lo que
                el header le puede dar. */}
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-vintage truncate text-sm leading-none text-[#1B3B2B] sm:text-xl">
                {t.brand}
              </span>
              <span className="font-tagline hidden text-[10px] leading-none text-[#B8933F] sm:mt-1 sm:block sm:text-xs">
                {t.brandTagline}
              </span>
            </span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-5">
          <nav className="hidden items-center gap-5 text-sm text-[#5b5b57] lg:flex">
            <Link href="/" className="transition-colors hover:text-[#1a1a1a]">
              🔍 {t.nav.search}
            </Link>
            <SectionsMenu />
          </nav>
          <div className="flex items-center border-l border-black/[0.08] pl-1 sm:gap-1 sm:pl-4">
            <LoginButton />
            <FavoritesButton />
          </div>
          <CountrySelector />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
