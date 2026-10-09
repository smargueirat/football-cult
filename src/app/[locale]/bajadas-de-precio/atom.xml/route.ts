import { LOCALES } from "@/lib/i18n/locales";
import { asLocale, SITE_URL } from "@/lib/hubPages";
import { archiveDates, dealHref, dealName, verifiedDropRows } from "@/lib/dealsData";
import { DEALS } from "@/lib/dealsStrings";
import { formatOfferMoney } from "@/lib/offerMoney";
import { offerHash } from "@/lib/go";

// Feed Atom de las bajadas verificadas, las más recientes primero (para
// lectores, agregadores y para publicar en Telegram/X). Los enlaces llevan
// UTM: los lectores no mandan referer y sin esto todo cae en "Direct".
export const revalidate = 3600;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const MAX = 100;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const s = DEALS[locale];
  const rows = [...verifiedDropRows()]
    .filter((r) => r.section !== "tickets" || r.eur <= 1000)
    .sort((a, b) => b.since.localeCompare(a.since) || b.pct - a.pct)
    .slice(0, MAX);
  const updated = `${archiveDates().last || new Date().toISOString().slice(0, 10)}T06:00:00Z`;
  const self = `${SITE_URL}/${locale}/bajadas-de-precio/atom.xml`;
  const entries = rows.map((r) => {
    const url = `${SITE_URL}${dealHref(r, locale)}?utm_source=atom&utm_medium=feed&utm_campaign=bajadas`;
    const title = s.feedEntry({
      name: dealName(r, locale),
      before: formatOfferMoney(r.before, r.currency),
      now: formatOfferMoney(r.price, r.currency),
      pct: Math.round(r.pct),
      store: r.store,
    });
    return `  <entry>
    <id>tag:football-cult.com,${r.since}:${r.section}/${r.item.id}/${offerHash(r.offerUrl)}</id>
    <title>${esc(title)}</title>
    <link href="${esc(url)}"/>
    <updated>${r.since}T06:00:00Z</updated>
    <category term="${r.section}"/>
    <summary>${esc(title)}</summary>
  </entry>`;
  });
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">
  <id>${self}</id>
  <title>${esc(s.feedTitle)}</title>
  <subtitle>${esc(s.feedSubtitle)}</subtitle>
  <link rel="self" href="${self}"/>
  <link rel="alternate" type="text/html" href="${SITE_URL}/${locale}/bajadas-de-precio"/>
  <updated>${updated}</updated>
  <author><name>Football Cult</name><uri>${SITE_URL}</uri></author>
${entries.join("\n")}
</feed>
`;
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
