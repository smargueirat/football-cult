"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CategoriesMenu from "./CategoriesMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="font-display text-lg uppercase tracking-wide text-zinc-50 sm:text-xl">
            {t.brand}
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
            <Link href="/" className="transition-colors hover:text-white">
              {t.nav.search}
            </Link>
            <CategoriesMenu />
            <Link href="/sobre-nosotros" className="transition-colors hover:text-white">
              {t.nav.about}
            </Link>
            <Link href="/contacto" className="transition-colors hover:text-white">
              {t.nav.contact}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
