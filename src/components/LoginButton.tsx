"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LoginButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.login}
        className="flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 text-[#1a1a1a] transition-colors hover:bg-black/[0.05]"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="solid-panel absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-black/[0.06] p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]">
            <p className="text-sm font-medium text-[#1a1a1a]">{t.loginPanel.title}</p>
            <p className="mt-1 text-xs text-[#8a8a84]">{t.loginPanel.text}</p>
          </div>
        </>
      )}
    </div>
  );
}
