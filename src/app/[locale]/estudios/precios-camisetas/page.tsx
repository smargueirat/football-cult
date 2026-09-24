import type { Metadata } from "next";
import { priceStudy } from "@/lib/priceStudy";
import { STUDY, studyUnits } from "@/lib/priceStudyStrings";
import { teamNames, typeNames } from "@/data/products";
import { formatOfferMoney } from "@/lib/offerMoney";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";
import { HUB } from "@/lib/hubStrings";

// Página de estudio: server component puro, sin JavaScript de cliente.
// Es contenido pensado para ser citado y enlazado, así que tiene que
// leerse entero sin ejecutar nada (Google, lectores de RSS, quien copie
// la tabla). Los números salen de priceStudy(), que los calcula en build
// desde el catálogo real -- no hay ni un número escrito a mano.
export const revalidate = 86400;

const PATH = "/estudios/precios-camisetas";
const eur = (n: number) => formatOfferMoney(n, "EUR");
const pct = (n: number) => `${n.toFixed(1)}%`;

function fill(s: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), s);
}

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const s = priceStudy();
  const c = STUDY[locale];
  const vars = {
    n: String(s.products),
    stores: String(s.stores),
    avg: s.avgGapPct.toFixed(0),
    max: s.maxGapAbs.toFixed(0),
  };
  return hubMetadata(locale, PATH, fill(c.metaTitle, vars).replace(" | Football Cult", ""), fill(c.metaDescription, vars));
}

export default async function PriceStudyPage({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const s = priceStudy();
  const c = STUDY[locale];
  const units = studyUnits(locale);
  const today = new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });

  const shirtName = (e: (typeof s.examples)[number]) =>
    `${teamNames[e.teamKey as keyof typeof teamNames]?.[locale] ?? e.teamKey} ${
      typeNames[e.typeKey as keyof typeof typeNames]?.[locale] ?? e.typeKey
    } ${e.season}`;

  const stats = [
    { big: pct(s.avgGapPct), label: c.statAvgGap, note: c.statAvgGapNote },
    { big: `${s.shareOver20.toFixed(0)}%`, label: c.statOver20, note: c.statOver20Note },
    { big: eur(s.maxGapAbs), label: c.statMaxGap, note: c.statMaxGapNote },
    { big: `${s.shareSamePrice.toFixed(0)}%`, label: c.statSamePrice, note: c.statSamePriceNote },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: c.title }]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.title,
            description: fill(c.metaDescription, {
              n: String(s.products),
              stores: String(s.stores),
              avg: s.avgGapPct.toFixed(0),
              max: s.maxGapAbs.toFixed(0),
            }),
            inLanguage: locale,
            datePublished: "2026-09-24",
            dateModified: new Date().toISOString().slice(0, 10),
            mainEntityOfPage: `${SITE_URL}/${locale}${PATH}`,
            publisher: { "@type": "Organization", name: "Football Cult" },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: c.title }]} />
      <HubHeader h1={c.title} intro={c.intro} />
      <p className="-mt-5 mb-8 text-xs text-[#9a9a94]">
        {c.updated} {today} · {s.products} {units.shirts} · {s.stores} {units.stores}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((st) => (
          <div key={st.label} className="vintage-card rounded-2xl p-4 sm:p-5">
            <p className="font-vintage text-2xl text-[#1B3B2B] sm:text-4xl">{st.big}</p>
            <p className="mt-1 text-sm font-medium text-[#3a3a36]">{st.label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#675c44]">{st.note}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.examplesTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{c.examplesIntro}</p>
        <div className="mt-5 flex flex-col gap-2.5">
          {s.examples.map((e) => (
            <div key={e.id} className="vintage-card rounded-xl p-3.5 sm:p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-medium text-[#1a1a1a]">{shirtName(e)}</span>
                <span className="font-vintage text-lg text-[#8a6a1f]">
                  +{eur(e.gapAbs)} <span className="text-xs text-[#675c44]">({e.gapPct.toFixed(0)}%)</span>
                </span>
              </div>
              {/* Barra proporcional: ancho = precio barato sobre el caro.
                  Es la forma más directa de ver el hueco sin un gráfico. */}
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#C9A24B]/20">
                <div className="h-full rounded-full bg-[#1B3B2B]" style={{ width: `${(e.low / e.high) * 100}%` }} />
              </div>
              <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-xs text-[#675c44]">
                <span>
                  {c.colCheapest}: <strong className="text-[#1B3B2B]">{eur(e.low)}</strong> · {e.lowStore}
                </span>
                <span>
                  {c.colDearest}: <strong className="text-[#1a1a1a]">{eur(e.high)}</strong> · {e.highStore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.storesTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{c.storesIntro}</p>
        <div className="vintage-card mt-5 overflow-x-auto rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C9A24B]/25 text-left text-xs uppercase tracking-wide text-[#675c44]">
                <th className="px-4 py-3 font-medium">{c.colStore}</th>
                <th className="px-4 py-3 text-right font-medium">{c.colWins}</th>
                <th className="px-4 py-3 text-right font-medium">{c.colWinPct}</th>
              </tr>
            </thead>
            <tbody>
              {s.storeRanking.map((r) => (
                <tr key={r.store} className="border-b border-[#C9A24B]/12 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-[#1a1a1a]">{r.store}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-[#675c44]">
                    {r.wins} / {r.appearances}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-medium text-[#1B3B2B]">
                    {r.winPct.toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8] p-5">
          <h3 className="font-vintage text-lg text-[#1B3B2B]">{c.brandTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#3a3a36]">{c.brandText}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-vintage text-xl text-[#1B3B2B] sm:text-2xl">{c.methodTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{c.methodIntro}</p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {[c.method1, c.method2, c.method3, c.method4].map((m, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[#3a3a36]">
              <span aria-hidden className="mt-0.5 text-[#C9A24B]">▸</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-[#1B3B2B]/20 bg-[#1B3B2B]/5 p-5">
        <h2 className="font-vintage text-lg text-[#1B3B2B]">{c.citeTitle}</h2>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-[#3a3a36]">{c.citeText}</p>
            <p className="mt-3 rounded-lg bg-white/70 px-3.5 py-2.5 text-xs leading-relaxed text-[#675c44]">
              {fill(c.citeLine, { title: c.title, date: today })}
              <br />
              <span className="text-[#8a6a1f]">
                {SITE_URL}/{locale}
                {PATH}
              </span>
            </p>
          </div>
          {/* Tarjeta con las cifras, para guardar o compartir. Se sirve a
              1000x1500 (ver tarjeta.png/route.tsx) aunque se muestre
              chica: ese es el tamaño que necesita Pinterest, que además
              busca <img> en el HTML y no lee la og:image. */}
          <a
            href={`/${locale}${PATH}/tarjeta.png`}
            className="shrink-0 self-center sm:self-start"
            aria-label={c.cardAlt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${locale}${PATH}/tarjeta.png`}
              alt={c.cardAlt}
              width={1000}
              height={1500}
              loading="lazy"
              className="h-auto w-[160px] rounded-xl border border-[#C9A24B]/40 shadow-sm"
            />
          </a>
        </div>
      </section>
    </div>
  );
}
