"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CategoriesMenu from "./CategoriesMenu";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 text-sm text-black">
            FC
          </span>
          <span>{t.brand}</span>
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
