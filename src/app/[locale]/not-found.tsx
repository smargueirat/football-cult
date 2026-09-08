"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="vintage-plaque rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
        404
      </span>
      <h1 className="font-vintage text-3xl text-[#1B3B2B] sm:text-4xl">
        {t.notFound.title}
      </h1>
      <p className="text-[#6b5f47]">{t.notFound.text}</p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1B3B2B] px-5 py-2.5 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
      >
        {t.notFound.cta}
      </Link>
    </div>
  );
}
