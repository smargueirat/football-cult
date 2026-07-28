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
      href: "#",
      available: false,
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
        className="flex items-center gap-1 transition-colors hover:text-white"
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
        <div className="glass absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-2xl p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
          {items.map((item) =>
            item.available ? (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 transition-colors hover:bg-white/5"
              >
                <p className="text-sm font-medium text-zinc-50">{item.label}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </a>
            ) : (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3 opacity-50"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-50">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
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
