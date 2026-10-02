import { LOCALES } from "@/lib/i18n/locales";
import { priceStudy } from "@/lib/priceStudy";
import { priceIndex } from "@/lib/priceIndex";
import { INDEX } from "@/lib/priceIndexStrings";
import { teamNames, typeNames, brandNames } from "@/lib/productMeta";
import { asLocale } from "@/lib/hubPages";
import { leagueName, leagueOfTeam } from "@/data/teamMeta";

// Tabla del índice, una fila por camiseta comparada (la misma muestra del
// estudio de precios), con su variación desde la fecha base si la serie
// existe. force-static: 5 archivos generados en build.
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function cell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ix = priceIndex();
  const lines = [INDEX[locale].csvHead.join(",")];
  for (const r of priceStudy().rows) {
    const l = leagueOfTeam(r.teamKey);
    const ch = ix.changeById[r.id];
    lines.push(
      [
        teamNames[r.teamKey as keyof typeof teamNames]?.[locale] ?? r.teamKey,
        l ? leagueName(l, locale) : "",
        brandNames[r.brand as keyof typeof brandNames] ?? r.brand,
        r.season,
        typeNames[r.typeKey as keyof typeof typeNames]?.[locale] ?? r.typeKey,
        r.low.toFixed(2),
        r.high.toFixed(2),
        r.gapPct.toFixed(1),
        ch === undefined ? "" : ch.toFixed(2),
        `https://football-cult.com/${locale}/camiseta/${r.id}`,
      ]
        .map(cell)
        .join(","),
    );
  }
  return new Response("﻿" + lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="football-cult-indice-precios.csv"`,
      Link: '<https://creativecommons.org/licenses/by/4.0/>; rel="license"',
    },
  });
}
