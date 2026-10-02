import type { Metadata } from "next";
import { priceIndex, type GroupRow } from "@/lib/priceIndex";
import { INDEX } from "@/lib/priceIndexStrings";
import { LEAGUES, leagueName } from "@/data/teamMeta";
import { brandNames } from "@/lib/productMeta";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";
import { HUB } from "@/lib/hubStrings";
import { studyUnits } from "@/lib/priceStudyStrings";

// Índice de precios: server component puro, sin JavaScript de cliente.
// Es un activo enlazable, así que se lee entero sin ejecutar nada. Los
// números salen de priceIndex() (catálogo + archivo durable de precios);
// no hay ni una cifra escrita a mano.
export const revalidate = 86400;

const PATH = "/estudios/indice-precios";
const pct = (n: number) => `${n.toFixed(1)}%`;
const signed = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

function fill(s: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), s);
}

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const c = INDEX[locale];
  const ix = priceIndex();
  return hubMetadata(locale, PATH, c.metaTitle.replace(" | Football Cult", ""), fill(c.metaDescription, { n: String(ix.sample) }));
}

function Chart({ pts }: { pts: { date: string; index: number }[] }) {
  const W = 600;
  const H = 120;
  const vals = pts.map((p) => p.index);
  const lo = Math.min(...vals, 100);
  const hi = Math.max(...vals, 100);
  const span = hi - lo || 1;
  const xy = pts.map((p, i) => `${((i / (pts.length - 1)) * W).toFixed(1)},${(H - ((p.index - lo) / span) * (H - 8) - 4).toFixed(1)}`);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="index" className="mt-4 h-28 w-full" preserveAspectRatio="none">
      <polyline points={xy.join(" ")} fill="none" stroke="#1B3B2B" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function GroupTable({
  rows,
  label,
  c,
  showChange,
}: {
  rows: GroupRow[];
  label: (key: string) => string;
  c: (typeof INDEX)["es"];
  showChange: boolean;
}) {
  return (
    <div className="vintage-card mt-5 overflow-x-auto rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#C9A24B]/25 text-left text-xs uppercase tracking-wide text-[#675c44]">
            <th className="px-4 py-3 font-medium">{c.colGroup}</th>
            <th className="px-4 py-3 text-right font-medium">{c.colN}</th>
            <th className="px-4 py-3 text-right font-medium">{c.colAvgGap}</th>
            <th className="px-4 py-3 text-right font-medium">{c.colMedianGap}</th>
            {showChange && <th className="px-4 py-3 text-right font-medium">{c.colChange}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-[#C9A24B]/12 last:border-0">
              <td className="px-4 py-2.5 font-medium text-[#1a1a1a]">{label(r.key)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[#675c44]">{r.n}</td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium text-[#1B3B2B]">{pct(r.avgGapPct)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[#675c44]">{pct(r.medianGapPct)}</td>
              {showChange && (
                <td className="px-4 py-2.5 text-right tabular-nums text-[#675c44]">
                  {r.changePct === null ? "–" : signed(r.changePct)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PriceIndexPage({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const c = INDEX[locale];
  const ix = priceIndex();
  const s = ix.series;
  const today = new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  // La variación por grupo solo se muestra con 14+ días de serie: con 4 o 5
  // días un "0,0%" es verdad pero no dice nada, y parece una medición.
  const showChange = !!s && s.days >= 14;
  const archiveDays = ix.archiveFrom
    ? Math.round((Date.parse(ix.archiveTo) - Date.parse(ix.archiveFrom)) / 86_400_000) + 1
    : 0;
  const longHistory = archiveDays >= 60 && !!s && s.days >= 60;
  const rowsShown = s ? s.points.slice(-31) : [];

  const leagueLabel = (slug: string) => {
    const l = LEAGUES.find((x) => x.slug === slug);
    return l ? leagueName(l, locale) : slug;
  };
  const brandLabel = (k: string) => (k === "other" ? c.otherBrand : (brandNames[k as keyof typeof brandNames] ?? k));

  const urlBase = `${SITE_URL}/${locale}${PATH}`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: c.title }], PATH),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: c.title,
            description: fill(c.metaDescription, { n: String(ix.sample) }),
            inLanguage: locale,
            url: urlBase,
            dateModified: ix.archiveTo || undefined,
            creator: { "@type": "Organization", name: "Football Cult", url: SITE_URL },
            isAccessibleForFree: true,
            distribution: [
              { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${urlBase}/datos.csv` },
              { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${urlBase}/datos.json` },
            ],
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: c.title }]} />
      <HubHeader h1={c.title} intro={c.intro} />
      <p className="-mt-5 mb-8 text-xs text-[#9a9a94]">
        {c.updated} {today} · {ix.sample} {studyUnits(locale).shirts}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="vintage-card rounded-2xl p-4 sm:p-5">
          <p className="font-vintage text-2xl text-[#1B3B2B] sm:text-4xl">{pct(ix.avgGapPct)}</p>
          <p className="mt-1 text-sm font-medium text-[#3a3a36]">{c.statGap}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#675c44]">{fill(c.statGapNote, { median: ix.medianGapPct.toFixed(1) })}</p>
        </div>
        <div className="vintage-card rounded-2xl p-4 sm:p-5">
          <p className="font-vintage text-2xl text-[#1B3B2B] sm:text-4xl">{ix.sample}</p>
          <p className="mt-1 text-sm font-medium text-[#3a3a36]">{c.statSample}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#675c44]">{c.statSampleNote}</p>
        </div>
        <div className="vintage-card col-span-2 rounded-2xl p-4 sm:col-span-1 sm:p-5">
          <p className="font-vintage text-2xl text-[#1B3B2B] sm:text-4xl">{s ? s.days : 0}</p>
          <p className="mt-1 text-sm font-medium text-[#3a3a36]">{c.statDays}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#675c44]">{c.statDaysNote}</p>
        </div>
      </div>

      {/* Aviso de historia corta: va arriba y siempre que el archivo cubra
          menos de 60 días. Un índice con 4 puntos que no lo dice engaña. */}
      {!longHistory && (
        <div role="note" className="mt-6 rounded-2xl border border-[#C9A24B]/45 bg-[#fffdf8] p-5">
          <h2 className="font-vintage text-lg text-[#1B3B2B]">{c.honestyTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3a3a36]">
            {s ? c.honestyShort(s.days, s.baseDate, s.lastDate) : c.honestyNone}
          </p>
        </div>
      )}

      {s && (
        <section className="mt-12">
          <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.seriesTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{c.seriesIntro}</p>
          {s.points.length >= 5 ? (
            <Chart pts={s.points} />
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-[#3a3a36]">{c.seriesNoChart(s.points.length)}</p>
          )}
          <div className="vintage-card mt-4 overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#C9A24B]/25 text-left text-xs uppercase tracking-wide text-[#675c44]">
                  <th className="px-4 py-3 font-medium">{c.colDate}</th>
                  <th className="px-4 py-3 text-right font-medium">{c.colIndex}</th>
                </tr>
              </thead>
              <tbody>
                {rowsShown.map((p) => (
                  <tr key={p.date} className="border-b border-[#C9A24B]/12 last:border-0">
                    <td className="px-4 py-2 tabular-nums text-[#3a3a36]">{p.date}</td>
                    <td className="px-4 py-2 text-right tabular-nums font-medium text-[#1B3B2B]">{p.index.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {s.monthly.length >= 2 ? (
            <ul className="mt-3 flex flex-col gap-1 text-sm text-[#3a3a36]">
              {s.monthly.map((p) => (
                <li key={p.date}>
                  {c.colMonth} {p.date.slice(0, 7)}: <strong className="tabular-nums text-[#1B3B2B]">{p.index.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-[#675c44]">{c.seriesMonthlyPending}</p>
          )}
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.leagueTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{c.leagueIntro}</p>
        <GroupTable rows={ix.byLeague} label={leagueLabel} c={c} showChange={showChange} />
      </section>

      <section className="mt-12">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.brandTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{c.brandIntro}</p>
        <GroupTable rows={ix.byBrand} label={brandLabel} c={c} showChange={showChange} />
      </section>

      <section className="mt-12">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.methodTitle}</h2>
        <ul className="mt-4 flex flex-col gap-2.5">
          {c.methodItems.map((m, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[#3a3a36]">
              <span aria-hidden className="mt-0.5 text-[#C9A24B]">▸</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-[#1B3B2B]/20 bg-[#1B3B2B]/5 p-5">
        <h2 className="font-vintage text-lg text-[#1B3B2B]">{c.citeTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#3a3a36]">{c.citeText}</p>
        <p className="mt-3 rounded-lg bg-white/70 px-3.5 py-2.5 text-xs leading-relaxed text-[#675c44]">
          {fill(c.citeLine, { title: c.title, date: today })}
          <br />
          <span className="text-[#8a6a1f]">{urlBase}</span>
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {[
            { href: `/${locale}${PATH}/datos.csv`, label: c.downloadCsv(ix.sample) },
            { href: `/${locale}${PATH}/datos.json`, label: c.downloadJson },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              download
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2 transition-colors hover:text-[#8a6a1f]"
            >
              {l.label} ↓
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
