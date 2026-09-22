"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HUB } from "@/lib/hubStrings";
import { LEAGUES, leagueName } from "@/data/teamMeta";

// Acceso visible a las páginas de liga desde la portada: una fila de
// atajos con las ligas principales + "ver todas". Solo importa teamMeta
// (datos chicos), nunca el catálogo (ver src/lib/offerMoney.ts).
// Orden de las ligas según el idioma del visitante: primero las de su
// propio mercado (Serie A para italiano, Primeira Liga y Brasileirão para
// portugués, etc.), después el resto.
const TOP_BY_LOCALE: Record<string, string[]> = {
  es: ["laliga", "liga-argentina", "premier-league", "liga-mx", "serie-a", "bundesliga", "ligue-1", "brasileirao", "mls", "eredivisie", "primeira-liga", "super-lig"],
  en: ["premier-league", "efl", "laliga", "serie-a", "bundesliga", "ligue-1", "mls", "scottish-premiership", "eredivisie", "primeira-liga", "liga-argentina", "brasileirao"],
  pt: ["primeira-liga", "brasileirao", "premier-league", "laliga", "serie-a", "bundesliga", "ligue-1", "liga-argentina", "liga-mx", "mls", "eredivisie", "super-lig"],
  fr: ["ligue-1", "ligue-2", "premier-league", "laliga", "serie-a", "bundesliga", "primeira-liga", "eredivisie", "liga-argentina", "brasileirao", "mls", "super-lig"],
  it: ["serie-a", "serie-b", "premier-league", "laliga", "bundesliga", "ligue-1", "primeira-liga", "eredivisie", "liga-argentina", "brasileirao", "mls", "super-lig"],
};

export default function LeagueShortcuts() {
  const { locale } = useLanguage();
  const s = HUB[locale];
  const leagues = (TOP_BY_LOCALE[locale] ?? TOP_BY_LOCALE.es).map((slug) => LEAGUES.find((l) => l.slug === slug)).filter((l): l is (typeof LEAGUES)[number] => !!l);

  return (
    <section aria-label={s.browseLeagues} className="mx-auto w-full max-w-[1800px] px-4 pt-6 sm:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{s.browseLeagues}</h2>
        <Link href="/ligas" className="shrink-0 text-sm font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2 hover:text-[#8a6a1f]">
          {s.leaguesIndex} →
        </Link>
      </div>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
        {leagues.map((l) => (
          <li key={l.slug} className="shrink-0">
            <Link
              href={`/liga/${l.slug}`}
              className="inline-block rounded-full border border-[#C9A24B]/40 bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#1B3B2B] transition-colors hover:border-[#C9A24B] hover:bg-[#f6efdd]"
            >
              {leagueName(l, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
