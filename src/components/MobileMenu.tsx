"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryKey } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";
import Portal from "./Portal";

export default function MobileMenu() {
  const { t } = useLanguage();
  const { setCategoryFilter, setQuery } = useSearchFilter();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links: { label: string; href: string; category?: CategoryKey | "all" }[] = [
    { label: t.nav.search, href: "/", category: "all" },
    { label: t.categoriesMenu.national, href: "/", category: "national" },
    { label: t.categoriesMenu.clubs, href: "/", category: "club" },
    { label: t.recentlyViewed.title, href: "/vistos-recientemente" },
    { label: t.nav.about, href: "/sobre-nosotros" },
    { label: t.nav.contact, href: "/contacto" },
  ];

  function handleClick(link: (typeof links)[number]) {
    setOpen(false);
    if (link.category) {
      setQuery("");
      setCategoryFilter(link.category);
    }
    router.push(link.href);
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label={t.nav.categories}
        className="flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-[60]">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <div className="solid-panel absolute left-0 top-0 h-screen w-72 border-r border-[#C9A24B]/25 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-vintage text-sm text-[#1B3B2B]">{t.brand}</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t.detail.backToCatalog}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#5b5b57] hover:bg-[#C9A24B]/10"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(link);
                    }}
                    className="rounded-xl px-3 py-2.5 text-base text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
