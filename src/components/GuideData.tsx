import Link from "next/link";
import type { ReactNode } from "react";
import type { HubLocale } from "@/data/teamMeta";
import { findCountry } from "@/data/countries";
import { MARKET, eurText, jerseyName } from "@/lib/seoMeta";
import { bootsByGround, fanVsPlayer, jerseyDropStats, median, seasonGap, worldCupRows } from "@/lib/guideData";
import { GUIDE_DATA } from "@/lib/guideDataStrings";
import { archiveDates } from "@/lib/dealsData";
import { longDate } from "@/lib/dealsStrings";
import { groupThousands } from "@/lib/trustStrip";
import type { GuideSlug } from "@/lib/guides";
import type { QA } from "@/lib/siteFacts";
import { QaList } from "@/components/hubs/HubParts";
import { DealsRelated } from "@/components/hubs/DealParts";

// Bloques de datos de las guías: tablas y respuestas calculadas del catálogo
// de hoy (guideData.ts). Servidor puro, HTML plano. Una guía sin bloque (o
// un bloque sin datos) simplemente no dibuja nada. Las respuestas (guideQa)
// también las publica /llms-full.txt.

const th = "px-2 py-2 text-left font-semibold";
const td = "px-2 py-2 align-top";
const link = "font-medium text-[#1B3B2B] underline decoration-[#C9A24B]/60 underline-offset-2";
const pct = (x: number) => Math.round(Math.abs(x));
const country = (locale: HubLocale) => findCountry(MARKET[locale]).name[locale];

// ------------------------------------------------------------ respuestas

function wcQa(locale: HubLocale): QA[] {
  const s = GUIDE_DATA[locale];
  const { rows, teams } = worldCupRows(locale);
  if (!rows.length) return [];
  const cheapest = rows.reduce((a, b) => (b.price < a.price ? b : a));
  const withPlayer = rows.filter((r) => r.player !== undefined);
  return s.wc.qa({
    min: eurText(cheapest.price, locale),
    team: cheapest.team,
    kit: s.kit[cheapest.kit],
    store: cheapest.store,
    median: eurText(median(rows.map((r) => r.price)), locale),
    n: rows.length,
    teams,
    country: country(locale),
    k: withPlayer.length,
    diff: eurText(median(withPlayer.map((r) => r.player! - r.price)), locale),
  });
}

function fpQa(locale: HubLocale): QA[] {
  const d = fanVsPlayer();
  return d.n ? GUIDE_DATA[locale].fp.qa({ pct: pct((d.ratio - 1) * 100), diff: eurText(d.diff, locale), n: d.n }) : [];
}

const groundLabel = (code: string, locale: HubLocale) => `${code} · ${GUIDE_DATA[locale].ground[code] ?? code}`;

function grQa(locale: HubLocale): QA[] {
  const rows = bootsByGround(locale).filter((r) => r.median > 0);
  if (!rows.length) return [];
  const most = rows.reduce((a, b) => (b.count > a.count ? b : a));
  const cheap = rows.reduce((a, b) => (b.median < a.median ? b : a));
  return GUIDE_DATA[locale].gr.qa({ most: groundLabel(most.code, locale), mostN: groupThousands(most.count, locale), mostFrom: most.from, cheap: groundLabel(cheap.code, locale), cheapMedian: eurText(cheap.median, locale) });
}

function dtQa(locale: HubLocale): QA[] {
  const d = jerseyDropStats();
  const g = seasonGap(locale);
  if (!d.offers) return [];
  const [lo, hi] = [pct(g.p75), pct(g.p25)].sort((a, b) => a - b);
  return GUIDE_DATA[locale].dt
    .qa({
      first: longDate(d.first, locale),
      offers: groupThousands(d.offers, locale),
      withDrop: groupThousands(d.withDrop, locale),
      pct: Math.round((d.withDrop / d.offers) * 100),
      med: Math.round(d.medianDrop),
      p75: Math.round(d.p75Drop),
      n: g.pairs.length,
      lo,
      hi,
      mid: pct(g.median),
    })
    // La 3.ª respuesta dice "sí, en la mayoría": solo si 3 de cada 4 parejas
    // (percentil 75 < 0) tienen la temporada anterior más barata.
    .slice(0, g.pairs.length && g.p75 < 0 ? 3 : 2);
}

const QAS: Partial<Record<GuideSlug, (l: HubLocale) => QA[]>> = {
  "camisetas-mundial-2026": wcQa,
  "talla-fan-vs-jugador": fpQa,
  "tapones-botas-segun-terreno": grQa,
  "cuando-bajan-de-precio-las-camisetas": dtQa,
};

/** Respuestas con cifras de hoy de una guía ([] si no tiene datos). */
export const guideQa = (slug: GuideSlug, locale: HubLocale): QA[] => QAS[slug]?.(locale) ?? [];

/** true si la guía tiene datos del catálogo (fecha de modificación = la del archivo). */
export const hasGuideData = (slug: GuideSlug) => slug in QAS;

// ------------------------------------------------------------ tablas

function Table({ cols, children, min = 560 }: { cols: string[]; children: ReactNode; min?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8]">
      <table className="w-full text-sm text-[#3a3a36]" style={{ minWidth: min }}>
        <thead className="bg-[#f6efdd] text-[#1B3B2B]">
          <tr>
            {cols.map((c) => (
              <th key={c} className={th}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Block({ h2, children }: { h2: string; children: ReactNode }) {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{h2}</h2>
      {children}
    </section>
  );
}

const Note = ({ children }: { children: ReactNode }) => <p className="text-xs leading-relaxed text-[#675c44]">{children}</p>;

function WorldCup({ locale }: { locale: HubLocale }) {
  const s = GUIDE_DATA[locale];
  const { rows } = worldCupRows(locale);
  if (!rows.length) return null;
  return (
    <Block h2={s.wc.h2}>
      <QaList items={wcQa(locale)} />
      <Note>{s.wc.note(country(locale))}</Note>
      <Table cols={s.wc.cols} min={720}>
        {rows.map((r) => (
          <tr key={r.product.id} className="border-t border-[#C9A24B]/20">
            <td className={td}>
              <Link className={link} href={`/${locale}/camiseta/${r.product.id}`}>
                {r.team}
              </Link>
            </td>
            <td className={td}>{s.kit[r.kit]}</td>
            <td className={`${td} font-semibold text-[#1B3B2B]`}>{eurText(r.price, locale)}</td>
            <td className={td}>{r.store}</td>
            <td className={td}>{r.stores}</td>
            <td className={td}>{r.sizes.join(", ")}</td>
            <td className={td}>{r.player !== undefined ? eurText(r.player, locale) : "—"}</td>
          </tr>
        ))}
      </Table>
    </Block>
  );
}

function FanPlayer({ locale }: { locale: HubLocale }) {
  const s = GUIDE_DATA[locale].fp;
  const d = fanVsPlayer();
  if (!d.n) return null;
  return (
    <Block h2={s.h2}>
      <QaList items={fpQa(locale)} />
      <Note>{s.note}</Note>
      <Table cols={s.cols} min={420}>
        {d.rows.map((r) => (
          <tr key={r.brand} className="border-t border-[#C9A24B]/20">
            <td className={td}>{r.brand}</td>
            <td className={td}>{r.n}</td>
            <td className={td}>×{r.ratio.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td className={td}>+{eurText(r.diff, locale)}</td>
          </tr>
        ))}
      </Table>
      <h3 className="font-semibold text-[#1B3B2B]">{s.examples}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {d.examples.map((x) => (
          <li key={x.product.id}>
            <Link className={link} href={`/${locale}/camiseta/${x.product.id}`}>
              {s.ex(jerseyName(x.product, locale), eurText(x.fan, locale), eurText(x.player, locale))}
            </Link>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Grounds({ locale }: { locale: HubLocale }) {
  const s = GUIDE_DATA[locale];
  const rows = bootsByGround(locale);
  if (!rows.length) return null;
  return (
    <Block h2={s.gr.h2}>
      <QaList items={grQa(locale)} />
      <Note>{s.gr.note(country(locale))}</Note>
      <Table cols={s.gr.cols} min={640}>
        {rows.map((r) => (
          <tr key={r.slug} className="border-t border-[#C9A24B]/20">
            <td className={td}>
              <Link className={link} href={`/${locale}/botas/terreno/${r.slug}`}>
                {groundLabel(r.code, locale)}
              </Link>
            </td>
            <td className={td}>{r.count}</td>
            <td className={td}>{r.from || "—"}</td>
            <td className={td}>{r.median > 0 ? eurText(r.median, locale) : "—"}</td>
            <td className={td}>
              {r.lines.map((l, i) => (
                <span key={l.slug}>
                  {i > 0 && ", "}
                  <Link className={link} href={`/${locale}/botas/linea/${l.slug}`}>
                    {l.name}
                  </Link>{" "}
                  ({l.count})
                </span>
              ))}
            </td>
          </tr>
        ))}
      </Table>
      <p className="flex flex-wrap gap-4 text-sm">
        <Link className={link} href={`/${locale}/botas/ninos`}>
          {s.gr.kids} →
        </Link>
        <Link className={link} href={`/${locale}/botas/futbol-sala`}>
          {s.gr.futsal} →
        </Link>
      </p>
    </Block>
  );
}

function DropTiming({ locale }: { locale: HubLocale }) {
  const s = GUIDE_DATA[locale].dt;
  const d = jerseyDropStats();
  const g = seasonGap(locale);
  if (!d.offers) return null;
  return (
    <>
      <Block h2={s.h2}>
        <QaList items={dtQa(locale)} />
        <h3 className="font-semibold text-[#1B3B2B]">{s.storesH}</h3>
        <Table cols={s.storeCols} min={420}>
          {d.stores.map((x) => (
            <tr key={x.store} className="border-t border-[#C9A24B]/20">
              <td className={td}>{x.store}</td>
              <td className={td}>{x.offers}</td>
              <td className={td}>
                {x.withDrop} ({Math.round((x.withDrop / x.offers) * 100)} %)
              </td>
            </tr>
          ))}
        </Table>
      </Block>
      {g.pairs.length > 0 && (
        <Block h2={s.seasonH}>
          <Note>{s.seasonNote}</Note>
          <Table cols={s.seasonCols} min={600}>
            {g.pairs.slice(0, 15).map((p) => (
              <tr key={p.cur.id} className="border-t border-[#C9A24B]/20">
                <td className={td}>{p.team}</td>
                <td className={td}>{GUIDE_DATA[locale].kit[p.kit as "home"] ?? p.kit}</td>
                <td className={td}>
                  <Link className={link} href={`/${locale}/camiseta/${p.prev.id}`}>
                    {p.prev.season}: {eurText(p.prevPrice, locale)}
                  </Link>
                </td>
                <td className={td}>
                  <Link className={link} href={`/${locale}/camiseta/${p.cur.id}`}>
                    {p.cur.season}: {eurText(p.curPrice, locale)}
                  </Link>
                </td>
                <td className={td}>{Math.round((p.prevPrice / p.curPrice - 1) * 100)} %</td>
              </tr>
            ))}
          </Table>
        </Block>
      )}
    </>
  );
}

const BLOCKS: Partial<Record<GuideSlug, (p: { locale: HubLocale }) => ReactNode>> = {
  "camisetas-mundial-2026": WorldCup,
  "talla-fan-vs-jugador": FanPlayer,
  "tapones-botas-segun-terreno": Grounds,
  "cuando-bajan-de-precio-las-camisetas": DropTiming,
};

export default function GuideData({ slug, locale }: { slug: GuideSlug; locale: HubLocale }) {
  const B = BLOCKS[slug];
  if (!B) return null;
  return (
    <div>
      <B locale={locale} />
      <Note>{GUIDE_DATA[locale].asOf(longDate(archiveDates().last, locale))}</Note>
      {slug === "cuando-bajan-de-precio-las-camisetas" && <DealsRelated locale={locale} current="" />}
    </div>
  );
}
