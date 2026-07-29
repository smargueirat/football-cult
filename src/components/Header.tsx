"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CategoriesMenu from "./CategoriesMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import LoginButton from "./LoginButton";
import FavoritesButton from "./FavoritesButton";
import CartButton from "./CartButton";
import CountrySelector from "./CountrySelector";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-black/[0.06]">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-4">
        {/* Fila 1: siempre visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-4">
            <MobileMenu />
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
              <Logo className="h-7 w-7 sm:h-9 sm:w-9" />
              <span className="font-vintage text-lg leading-none text-[#1B3B2B] sm:text-2xl">
                {t.brand}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-5">
            <nav className="hidden items-center gap-6 text-sm text-[#5b5b57] lg:flex">
              <Link href="/" className="transition-colors hover:text-[#1a1a1a]">
                {t.nav.search}
              </Link>
              <CategoriesMenu />
              <Link href="/sobre-nosotros" className="transition-colors hover:text-[#1a1a1a]">
                {t.nav.about}
              </Link>
              <Link href="/contacto" className="transition-colors hover:text-[#1a1a1a]">
                {t.nav.contact}
              </Link>
            </nav>
            {/* Desktop: login/favoritos/carrito en la misma fila */}
            <div className="hidden items-center gap-1 border-l border-black/[0.08] pl-4 sm:flex">
              <LoginButton />
              <FavoritesButton />
              <CartButton />
            </div>
            <CountrySelector />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Fila 2: solo mobile, para que login/favoritos/carrito no dependan del menú hamburguesa */}
        <div className="mt-2 flex items-center justify-center gap-2 border-t border-black/[0.06] pt-2 sm:hidden">
          <LoginButton />
          <FavoritesButton />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
