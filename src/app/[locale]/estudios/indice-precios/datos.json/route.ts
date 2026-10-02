import { LOCALES } from "@/lib/i18n/locales";
import { priceIndex } from "@/lib/priceIndex";
import { asLocale, SITE_URL } from "@/lib/hubPages";
import { LEAGUES, leagueName } from "@/data/teamMeta";
import { brandNames } from "@/lib/productMeta";

// Todo el índice en JSON: metadatos, serie, grupos. Mismos números que la
// página (salen de la misma función). force-static, un archivo por idioma.
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ix = priceIndex();
  const round = (n: number | null, d = 2) => (n === null ? null : Number(n.toFixed(d)));
  const body = {
    name: "Football Cult - football shirt price index",
    url: `${SITE_URL}/${locale}/estudios/indice-precios`,
    currency: "EUR",
    license: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/", attribution: "Football Cult (football-cult.com)" },
    archive: { from: ix.archiveFrom, to: ix.archiveTo },
    sample: { shirts: ix.sample, avg_gap_pct: round(ix.avgGapPct, 1), median_gap_pct: round(ix.medianGapPct, 1) },
    series: ix.series && {
      base_date: ix.series.baseDate,
      last_date: ix.series.lastDate,
      days: ix.series.days,
      panel: ix.series.panel,
      points: ix.series.points.map((p) => ({ date: p.date, index: round(p.index) })),
      closed_months: ix.series.monthly.map((p) => ({ month: p.date.slice(0, 7), index: round(p.index) })),
    },
    by_league: ix.byLeague.map((g) => {
      const l = LEAGUES.find((x) => x.slug === g.key);
      return { league: l ? leagueName(l, locale) : g.key, slug: g.key, shirts: g.n, avg_gap_pct: round(g.avgGapPct, 1), median_gap_pct: round(g.medianGapPct, 1), change_since_base_pct: round(g.changePct) };
    }),
    by_brand: ix.byBrand.map((g) => ({
      brand: brandNames[g.key as keyof typeof brandNames] ?? g.key,
      shirts: g.n,
      avg_gap_pct: round(g.avgGapPct, 1),
      median_gap_pct: round(g.medianGapPct, 1),
      change_since_base_pct: round(g.changePct),
    })),
  };
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="football-cult-indice-precios.json"`,
      Link: '<https://creativecommons.org/licenses/by/4.0/>; rel="license"',
    },
  });
}
