import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES } from "@/lib/i18n/locales";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";
import { CATALOG_INDEX } from "@/lib/catalogIndexStrings";
import { INDEX_SECTIONS, indexEntries, pageRanges } from "@/lib/catalogIndex";
import sitemap, { generateSitemaps } from "@/app/sitemap";
import { products, teamNames, typeNames } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { ticketProducts } from "@/data/tickets";
import { LEAGUES, leagueName, type HubLocale } from "@/data/teamMeta";
import { translations } from "@/lib/i18n/translations";
import { brandFacets, groundFromSlug } from "@/lib/gearHubs";
import { groundName, sectionNoun } from "@/lib/gearHubStrings";
import { GUIDES, type GuideSlug } from "@/lib/guides";

// MAPA DEL SITIO (2026-10-09). Enlazado desde el pie de TODAS las páginas,
// así que todo lo que lista queda a 2 clics de la home: las páginas del
// índice de cada sección (y por ellas cada ficha, a 3) y todos los hubs
// del sitemap -- el crawl del 08-10 encontró 62 hubs del sitemap sin ningún
// enlace entrante (13 tipos de entrenamiento, 34 selecciones...).
//
// Los hubs salen del propio sitemap (generateSitemaps + sitemap), no de una
// lista escrita a mano: un hub nuevo que se agregue al sitemap (líneas de
// bota, retro por equipo...) aparece acá solo.
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const ui = CATALOG_INDEX[locale];
  return hubMetadata(locale, "/indice", ui.index, ui.intro);
}

const FICHA_BASES: [string, readonly { id: string }[]][] = [
  ["camiseta", products],
  ["botas", bootProducts],
  ["guantes", gloveProducts],
  ["pelotas", ballProducts],
  ["ropa", apparelProducts],
  ["entrenamiento", trainingProducts],
  ["tickets", ticketProducts],
];

async function hubPaths(): Promise<string[]> {
  const fichas = new Set(FICHA_BASES.flatMap(([base, items]) => items.map((i) => `/${base}/${i.id}`)));
  const out = new Set<string>();
  for (const { id } of await generateSitemaps()) {
    for (const e of await sitemap({ id: Promise.resolve(String(id)) })) {
      const path = new URL(e.url).pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
      if (path && !fichas.has(path) && !path.startsWith("/indice/")) out.add(path);
    }
  }
  return [...out];
}

const humanize = (s: string) => s.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

/** Texto del enlace: el nombre real cuando lo sabemos, si no el slug. */
function label(path: string, locale: HubLocale): string {
  const seg = path.split("/").filter(Boolean);
  const [a, b, c, d] = seg;
  const team = (k: string) => (teamNames as Record<string, Record<HubLocale, string>>)[k]?.[locale];
  if (a === "equipo" && b) return team(b) ?? humanize(b);
  if (a === "pais" && b) return team(b) ?? humanize(b);
  if (a === "liga" && b) {
    const l = LEAGUES.find((x) => x.slug === b);
    return l ? leagueName(l, locale) : humanize(b);
  }
  if (a === "temporada" && b) {
    const season = b.replace("-", "/");
    const kit = c ? ((typeNames as Record<string, Record<HubLocale, string>>)[c]?.[locale] ?? humanize(c)) : "";
    return kit ? `${season} · ${kit}` : `${HUB[locale].seasonLabel} ${season}`;
  }
  if (a === "guia" && b) return GUIDES[b as GuideSlug]?.[locale]?.title ?? humanize(b);
  if ((a === "botas" || a === "guantes" || a === "pelotas" || a === "ropa" || a === "entrenamiento") && b === "marca" && c) {
    const name = brandFacets(a).find((f) => f.slug === c)?.name ?? humanize(c);
    const g = d ? groundFromSlug(d) : undefined;
    return g ? `${name} · ${groundName(g, locale)}` : name;
  }
  if (a === "botas" && b === "terreno" && c) {
    const g = groundFromSlug(c);
    return g ? groundName(g, locale) : humanize(c);
  }
  if ((a === "ropa" || a === "entrenamiento") && b === "tipo" && c) {
    return (translations[locale][a].types as Record<string, string>)[c] ?? humanize(c);
  }
  if (!b && (a === "botas" || a === "guantes" || a === "pelotas" || a === "ropa" || a === "entrenamiento")) return sectionNoun(a, locale);
  return humanize(seg[seg.length - 1] ?? path);
}

export default async function SiteIndex({ params }: P) {
  const locale = asLocale((await params).locale);
  const ui = CATALOG_INDEX[locale];

  const groups = new Map<string, { href: string; label: string }[]>();
  for (const path of await hubPaths()) {
    const first = path.split("/")[1];
    const key = ui.groups[first] ? first : "";
    groups.set(key, [...(groups.get(key) ?? []), { href: `/${locale}${path}`, label: label(path, locale) }]);
  }
  const ordered = [...groups.entries()]
    .filter(([k]) => k)
    .sort((a, b) => b[1].length - a[1].length)
    .concat(groups.has("") ? [["", groups.get("")!]] : []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
      <JsonLd data={breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.index }], "/indice")} />
      <Crumbs locale={locale} trail={[{ label: ui.index }]} />
      <HubHeader h1={ui.index} intro={ui.intro} />

      {INDEX_SECTIONS.map((section) => (
        <section key={section} className="mb-8">
          <h2 className="font-vintage mb-3 text-xl text-[#1B3B2B]">
            {ui.section[section]} <span className="text-sm text-[#675c44]">· {ui.count.replace("{n}", String(indexEntries(section, locale).length))}</span>
          </h2>
          <ul className="flex flex-wrap gap-1.5 text-sm">
            {pageRanges(section).map((r) => (
              <li key={r.page}>
                <Link
                  href={`/${locale}/indice/${section}/${r.page}`}
                  className="inline-block rounded-full border border-[#C9A24B]/40 bg-[#fffdf8] px-3 py-1 text-[#1B3B2B] hover:border-[#1B3B2B]"
                >
                  {r.page} <span className="text-xs text-[#675c44]">{r.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2 className="font-vintage mb-4 mt-12 text-2xl text-[#1B3B2B]">{ui.hubs}</h2>
      {ordered.map(([key, links]) => (
        <section key={key || "more"} className="mb-6">
          <h3 className="mb-2 font-medium text-[#1B3B2B]">{key ? ui.groups[key] : ui.more}</h3>
          <ul className="columns-2 gap-x-6 text-sm sm:columns-3 lg:columns-4">
            {links
              .sort((x, y) => x.label.localeCompare(y.label))
              .map((l) => (
                <li key={l.href} className="mb-1 break-inside-avoid">
                  <Link href={l.href} className="text-[#1B3B2B] underline decoration-[#C9A24B]/50 underline-offset-2 hover:decoration-[#C9A24B]">
                    {l.label}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
