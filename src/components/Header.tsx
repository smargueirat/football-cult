"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CategoriesMenu from "./CategoriesMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import LoginButton from "./LoginButton";
import FavoritesButton from "./FavoritesButton";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-black/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="text-lg font-semibold tracking-tight text-[#1a1a1a] sm:text-xl">
              {t.brand}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden items-center gap-6 text-sm text-[#5b5b57] sm:flex">
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
          <div className="flex items-center gap-1">
            <LoginButton />
            <FavoritesButton />
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
