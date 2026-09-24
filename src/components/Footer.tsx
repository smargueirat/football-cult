"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HUB } from "@/lib/hubStrings";
import { SEASON_UI } from "@/lib/seasonStrings";
import { GUIDE_UI } from "@/lib/guideUi";
import { LEAGUES, leagueName } from "@/data/teamMeta";

// Ligas principales enlazadas desde el footer de TODAS las páginas: enlaces
// rastreables sitewide hacia los hubs (ver src/app/[locale]/liga).
const FOOTER_LEAGUES = ["premier-league", "laliga", "serie-a", "bundesliga", "ligue-1", "liga-argentina", "brasileirao", "liga-mx"];

export default function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="vintage-dark border-t border-[#C9A24B]/25">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-4 py-8 sm:px-8 text-sm text-[#B8AF98] sm:flex-row sm:items-center sm:justify-between">
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
          <Link href="/guantes" className="transition-colors hover:text-[#F3E9C9]">
            {t.guantes.navLabel}
          </Link>
          <Link href="/pelotas" className="transition-colors hover:text-[#F3E9C9]">
            {t.pelotas.navLabel}
          </Link>
          <Link href="/tickets" className="transition-colors hover:text-[#F3E9C9]">
            {t.tickets.navLabel}
          </Link>
          <Link href="/ropa" className="transition-colors hover:text-[#F3E9C9]">
            {t.ropa.navLabel}
          </Link>
          <Link href="/entrenamiento" className="transition-colors hover:text-[#F3E9C9]">
            {t.entrenamiento.navLabel}
          </Link>
          <Link href="/estudios/precios-camisetas" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.priceStudy}
          </Link>
          <Link href="/autenticidad" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.authenticity}
          </Link>
          <Link href="/brasil" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.brazil}
          </Link>
          <Link href="/argentina" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.argentina}
          </Link>
          <Link href="/francia" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.france}
          </Link>
          <Link href="/italia" className="transition-colors hover:text-[#F3E9C9]">
            {t.footer.italy}
          </Link>
        </nav>
      </div>
      <nav aria-label={HUB[locale].leaguesIndex} className="mx-auto flex max-w-[1800px] flex-wrap gap-x-4 gap-y-2 px-4 pb-6 text-sm text-[#B8AF98] sm:px-8">
        <Link href="/ligas" className="font-medium text-[#E9D38F] transition-colors hover:text-[#F3E9C9]">
          {HUB[locale].leaguesIndex}
        </Link>
        <Link href="/temporada/2026-27" className="transition-colors hover:text-[#F3E9C9]">
          {SEASON_UI[locale].seasonH1("2026/27")}
        </Link>
        <Link href="/guia" className="transition-colors hover:text-[#F3E9C9]">
          {GUIDE_UI[locale].index}
        </Link>
        <Link href="/ofertas" className="transition-colors hover:text-[#F3E9C9]">
          {SEASON_UI[locale].offersH1}
        </Link>
        {FOOTER_LEAGUES.map((slug) => {
          const l = LEAGUES.find((x) => x.slug === slug);
          return l ? (
            <Link key={slug} href={`/liga/${slug}`} className="transition-colors hover:text-[#F3E9C9]">
              {leagueName(l, locale)}
            </Link>
          ) : null;
        })}
      </nav>
      <div className="vintage-divider mx-4 max-w-[1800px] sm:mx-auto" />
      <p className="mx-auto max-w-[1800px] px-4 py-6 sm:px-8 text-xs text-[#8a836e]">
        {t.footer.disclaimer}
      </p>
    </footer>
  );
}
