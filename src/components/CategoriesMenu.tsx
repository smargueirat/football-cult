"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CategoriesMenu() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }

  const items = [
    {
      label: t.categoriesMenu.national,
      desc: t.categoriesMenu.nationalDesc,
      href: "/",
      available: true,
    },
    {
      label: t.categoriesMenu.clubs,
      desc: t.categoriesMenu.clubsDesc,
      href: "/",
      available: true,
    },
    {
      label: t.categoriesMenu.retro,
      desc: t.categoriesMenu.retroDesc,
      href: "#",
      available: false,
    },
  ];

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
        <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-2xl border border-black/[0.06] bg-white/80 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-lg">
          {items.map((item) =>
            item.available ? (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-black/[0.03]"
              >
                <p className="text-sm font-medium text-[#1a1a1a]">{item.label}</p>
                <p className="text-xs text-[#8a8a84]">{item.desc}</p>
              </a>
            ) : (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3 opacity-50"
              >
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{item.label}</p>
                  <p className="text-xs text-[#8a8a84]">{item.desc}</p>
                </div>
                <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-[#6b6b66]">
                  {t.categoriesMenu.soon}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
