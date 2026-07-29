"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LoginButton from "./LoginButton";
import FavoritesButton from "./FavoritesButton";
import CartButton from "./CartButton";

export default function MobileMenu() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { label: t.nav.search, href: "/" },
    { label: t.categoriesMenu.national, href: "/" },
    { label: t.categoriesMenu.clubs, href: "/" },
    { label: t.nav.about, href: "/sobre-nosotros" },
    { label: t.nav.contact, href: "/contacto" },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label={t.nav.categories}
        className="flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 text-[#1a1a1a] transition-colors hover:bg-black/[0.05]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="solid-panel absolute left-0 top-0 h-full w-72 border-r border-black/[0.06] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-[#5b5b57]">{t.brand}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.detail.backToCatalog}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#5b5b57] hover:bg-black/[0.05]"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4 flex items-center gap-1 border-b border-black/[0.06] pb-4 sm:hidden">
              <LoginButton />
              <FavoritesButton />
              <CartButton />
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-base text-[#1a1a1a] transition-colors hover:bg-black/[0.05]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
