"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {t.brand}</p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/sobre-nosotros" className="transition-colors hover:text-white">
            {t.footer.about}
          </Link>
          <Link href="/contacto" className="transition-colors hover:text-white">
            {t.footer.contact}
          </Link>
          <Link href="/privacidad" className="transition-colors hover:text-white">
            {t.footer.privacy}
          </Link>
          <Link href="/terminos" className="transition-colors hover:text-white">
            {t.footer.terms}
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-6 pb-8 text-xs text-zinc-600">
        {t.footer.disclaimer}
      </p>
    </footer>
  );
}
