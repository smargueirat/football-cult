"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="vintage-dark border-t border-[#C9A24B]/25">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#B8AF98] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-tagline not-italic text-[#E9D38F]">
          © {new Date().getFullYear()} {t.brand}
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link href="/sobre-nosotros" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.about}
          </Link>
          <Link href="/contacto" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.contact}
          </Link>
          <Link href="/privacidad" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.privacy}
          </Link>
          <Link href="/terminos" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.terms}
          </Link>
          <Link href="/guia-de-tallas" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.sizeGuide}
          </Link>
          <Link href="/autenticidad" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.authenticity}
          </Link>
          <Link href="/brasil" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.brazil}
          </Link>
        </nav>
      </div>
      <div className="vintage-divider mx-6 max-w-6xl sm:mx-auto" />
      <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-[#8a836e]">
        {t.footer.disclaimer}
      </p>
    </footer>
  );
}
