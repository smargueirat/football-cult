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

/** CollectionPage + ItemList con las fichas enlazadas (las primeras 50). Solo
 *  URL y nombre: el Product/Offer con precio vive en cada ficha (marcar
 *  productos en una página de listado va contra las pautas de Google). */
export function listLd(locale: HubLocale, name: string, path: string, items: { href: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${SITE_URL}/${locale}${path}`,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      // Lo que de verdad lista el marcado, no el total de la página.
      numberOfItems: Math.min(items.length, 50),
      itemListElement: items.slice(0, 50).map((x, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${x.href}`, name: x.name })),
    },
  };
}

export const dealsListLd = (rows: DealRow[], locale: HubLocale, name: string, path: string) =>
  listLd(locale, name, path, rows.map((r) => ({ href: dealHref(r, locale), name: dealName(r, locale) })));

export type DealPage = "/ofertas" | "/bajadas-de-precio" | "/ofertas-de-la-semana" | "/minimos-historicos" | "/black-friday" | "/regalos-futbol";

export function DealsRelated({ locale, current }: { locale: HubLocale; current: DealPage | "" }) {
  const n = DEALS_NAV[locale];
  const items = [
    { href: "/ofertas-de-la-semana", label: n.week },
    { href: "/bajadas-de-precio", label: n.drops },
    { href: "/minimos-historicos", label: n.lows },
    { href: "/black-friday", label: n.bf },
    { href: "/regalos-futbol", label: n.gifts },
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
