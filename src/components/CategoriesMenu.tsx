"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CategoryKey } from "@/data/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";

export default function CategoriesMenu() {
  const { t } = useLanguage();
  const { setCategoryFilter, setTypeFilter, setQuery } = useSearchFilter();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }

  const items: {
    label: string;
    desc: string;
    category: CategoryKey;
    available: boolean;
  }[] = [
    {
      label: t.categoriesMenu.national,
      desc: t.categoriesMenu.nationalDesc,
      category: "national",
      available: true,
    },
    {
      label: t.categoriesMenu.clubs,
      desc: t.categoriesMenu.clubsDesc,
      category: "club",
      available: true,
    },
  ];

  function goToCategory(category: CategoryKey) {
    setQuery("");
    setCategoryFilter(category);
    setOpen(false);
    router.push("/");
  }

  function goToRetro() {
    setQuery("");
    setCategoryFilter("all");
    setTypeFilter("retro");
    setOpen(false);
    router.push("/");
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 transition-colors hover:text-[#1a1a1a]"
        aria-expanded={open}
      >
        {t.nav.categories}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="solid-panel absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-2xl border border-[#C9A24B]/25 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => goToCategory(item.category)}
              className="block w-full rounded-xl px-4 py-3 text-left transition-colors hover:bg-black/[0.03]"
            >
              <p className="text-sm font-medium text-[#1a1a1a]">{item.label}</p>
              <p className="text-xs text-[#8a7a5a]">{item.desc}</p>
            </button>
          ))}
          <button
            onClick={goToRetro}
            className="block w-full rounded-xl px-4 py-3 text-left transition-colors hover:bg-black/[0.03]"
          >
            <p className="text-sm font-medium text-[#1a1a1a]">{t.categoriesMenu.retro}</p>
            <p className="text-xs text-[#8a7a5a]">{t.categoriesMenu.retroDesc}</p>
          </button>
        </div>
      )}
    </div>
  );
}
