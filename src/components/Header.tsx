"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CategoriesMenu from "./CategoriesMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import LoginButton from "./LoginButton";
import FavoritesButton from "./FavoritesButton";
import CountrySelector from "./CountrySelector";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-black/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2.5 py-2.5 sm:px-6 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-4">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5">
            <Image
              src="/logo-badge.png"
              alt={t.brand}
              width={44}
              height={44}
              className="h-8 w-8 sm:h-11 sm:w-11"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="font-vintage text-sm leading-none text-[#1B3B2B] sm:text-xl">
                {t.brand}
              </span>
              <span className="font-tagline hidden text-[10px] leading-none text-[#B8933F] sm:mt-1 sm:block sm:text-xs">
                {t.brandTagline}
              </span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-5">
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
