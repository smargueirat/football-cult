import Link from "next/link";
import type { HubLocale } from "@/data/teamMeta";
import { dealHref, dealName, type DealRow } from "@/lib/dealsData";
import { DEALS, longDate } from "@/lib/dealsStrings";
import { DEALS_NAV } from "@/lib/dealsNav";
import { SEASON_UI } from "@/lib/seasonStrings";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/hubPages";
import { formatOfferMoney } from "@/lib/offerMoney";
import { LinkChipRow } from "@/components/hubs/HubLinkParts";
import { goHref, type GoKind } from "@/lib/go";
import { CONV } from "@/lib/convStrings";

const GO_KIND: Record<DealRow["section"], GoKind> = { camiseta: "j", botas: "b", tickets: "t", ropa: "a", guantes: "g", pelotas: "p", entrenamiento: "e" };

// Piezas de servidor de las páginas de bajadas y mínimos: tabla en HTML plano
// (citable tal cual por un buscador o un asistente) y enlaces entre ellas.

export function DealTable({ rows, locale, mode }: { rows: DealRow[]; locale: HubLocale; mode: "drop" | "low" }) {
  const c = DEALS[locale].col;
  const th = "px-2 py-2 text-left font-semibold";
  const td = "px-2 py-2 align-top";
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8]">
      <table className="w-full min-w-[640px] text-sm text-[#3a3a36]">
        <thead className="bg-[#f6efdd] text-[#1B3B2B]">
          <tr>
            <th className={th}>{c.product}</th>
            <th className={th}>{c.store}</th>
            <th className={th}>{mode === "drop" ? c.before : c.usual}</th>
            <th className={th}>{c.now}</th>
            <th className={th}>{mode === "drop" ? c.drop : c.below}</th>
            <th className={th}>{c.since}</th>
            {mode === "low" && <th className={th}>{c.days}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.section}/${r.item.id}`} className="border-t border-[#C9A24B]/20">
              <td className={td}>
                <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B]/60 underline-offset-2" href={dealHref(r, locale)}>
                  {dealName(r, locale)}
                </Link>
                {/* Directo a la tienda: la tabla era solo enlaces a fichas. */}
                <a
                  href={goHref({ kind: GO_KIND[r.section], productId: r.item.id, url: r.offerUrl, locale, origin: "bajadas" })}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="mt-1.5 flex min-h-11 w-fit items-center rounded-full bg-[#1B3B2B] px-3 py-1 text-xs font-medium text-[#F3E9C9] hover:bg-[#15301f]"
                >
                  {CONV[locale].goStore.replace("{store}", r.store)} →
                </a>
              </td>
              <td className={td}>{r.store}</td>
              <td className={`${td} text-[#675c44] line-through`}>{formatOfferMoney(r.before, r.currency)}</td>
              <td className={`${td} font-semibold text-[#1B3B2B]`}>{formatOfferMoney(r.price, r.currency)}</td>
              <td className={`${td} font-semibold text-[#B45309]`}>-{Math.round(r.pct)} %</td>
              <td className={`${td} whitespace-nowrap`}>{longDate(r.since, locale)}</td>
              {mode === "low" && <td className={td}>{r.days}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** ItemList con las fichas enlazadas (las primeras 50). */
export function dealsListLd(rows: DealRow[], locale: HubLocale, name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${SITE_URL}/${locale}${path}`,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: rows.length,
      itemListElement: rows.slice(0, 50).map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${dealHref(r, locale)}`, name: dealName(r, locale) })),
    },
  };
}

export type DealPage = "/ofertas" | "/bajadas-de-precio" | "/ofertas-de-la-semana" | "/minimos-historicos";

export function DealsRelated({ locale, current }: { locale: HubLocale; current: DealPage | "" }) {
  const n = DEALS_NAV[locale];
  const items = [
    { href: "/ofertas-de-la-semana", label: n.week },
    { href: "/bajadas-de-precio", label: n.drops },
    { href: "/minimos-historicos", label: n.lows },
    { href: "/ofertas", label: SEASON_UI[locale].offersH1 },
    { href: "/guia/cuando-bajan-de-precio-las-camisetas", label: GUIDES["cuando-bajan-de-precio-las-camisetas"][locale].title },
  ].filter((i) => i.href !== current);
  return (
    <nav aria-label={DEALS[locale].related} className="mt-10">
      <LinkChipRow title={DEALS[locale].related} items={items.map((i) => ({ href: `/${locale}${i.href}`, label: i.label }))} />
      <FeedLink locale={locale} />
    </nav>
  );
}

export const feedPath = (locale: HubLocale) => `/${locale}/bajadas-de-precio/atom.xml`;

/** <a> normal, no <Link>: es un XML, no una página de la app. */
export function FeedLink({ locale }: { locale: HubLocale }) {
  return (
    <p className="text-sm">
      <a className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={feedPath(locale)} type="application/atom+xml">
        {DEALS[locale].feedLink}
      </a>
    </p>
  );
}

/** Captura de vuelta en las páginas de bajadas: canal, bot por equipo y la
 *  alerta por correo de cada ficha. */
export function DealsCapture({ locale }: { locale: HubLocale }) {
  const c = CONV[locale];
  const pill = "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold";
  return (
    <div className="mt-4 rounded-2xl border border-[#C9A24B]/50 bg-[#fffaf0] p-4" data-testid="return-capture">
      <p className="font-semibold text-[#1B3B2B]">{c.dropsCaptureTitle}</p>
      <p className="mt-1 text-sm text-[#675c44]">{c.dropsCaptureBody}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="https://t.me/FootballCultOfertas" target="_blank" rel="noopener noreferrer" className={`${pill} bg-[#1B3B2B] text-[#F3E9C9]`}>
          {c.tgChannel}
        </a>
        <a href="https://t.me/FootballCultBot" target="_blank" rel="nofollow noopener noreferrer" className={`${pill} border border-[#1B3B2B]/30 bg-white text-[#1B3B2B]`}>
          {c.tgBot}
        </a>
      </div>
    </div>
  );
}
