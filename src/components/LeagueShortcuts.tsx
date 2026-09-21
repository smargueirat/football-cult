"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HUB } from "@/lib/hubStrings";
import { LEAGUES, leagueName } from "@/data/teamMeta";

// Acceso visible a las páginas de liga desde la portada: una fila de
// atajos con las ligas principales + "ver todas". Solo importa teamMeta
// (datos chicos), nunca el catálogo (ver src/lib/offerMoney.ts).
const TOP = ["premier-league", "laliga", "serie-a", "bundesliga", "ligue-1", "liga-argentina", "brasileirao", "liga-mx", "mls", "eredivisie", "primeira-liga", "super-lig"];

export default function LeagueShortcuts() {
  const { locale } = useLanguage();
  const s = HUB[locale];
  const leagues = TOP.map((slug) => LEAGUES.find((l) => l.slug === slug)).filter((l): l is (typeof LEAGUES)[number] => !!l);

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
