import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES } from "@/lib/i18n/locales";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";
import { CATALOG_INDEX } from "@/lib/catalogIndexStrings";
import {
  INDEX_SECTIONS,
  PER_PAGE,
  indexEntries,
  indexPaths,
  pageCount,
  pageRanges,
  type IndexSection,
} from "@/lib/catalogIndex";

// Estáticas a propósito (ver el comentario largo en catalogIndex.ts): son
// ~240 páginas por idioma y se sirven desde la CDN, sin invocar función.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    indexPaths().map(({ section, page }) => ({
      locale,
      seccion: section,
      pagina: String(page),
    })),
  );
}

type P = { params: Promise<{ locale: string; seccion: string; pagina: string }> };

function parse(seccion: string, pagina: string) {
  const section = INDEX_SECTIONS.find((s) => s === seccion);
  const page = Number(pagina);
  if (!section || !Number.isInteger(page) || page < 1) return undefined;
  return { section: section as IndexSection, page };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, seccion, pagina } = await params;
  const locale = asLocale(raw);
  const parsed = parse(seccion, pagina);
  if (!parsed) return {};
  const ui = CATALOG_INDEX[locale];
  const total = pageCount(parsed.section, locale);
  const title = `${ui.section[parsed.section]} — ${ui.index} (${ui.page} ${parsed.page} ${ui.of} ${total})`;
  return hubMetadata(locale, `/indice/${parsed.section}/${parsed.page}`, title, ui.intro);
}

export default async function CatalogIndexPage({ params }: P) {
  const { locale: raw, seccion, pagina } = await params;
  const locale = asLocale(raw);
  const parsed = parse(seccion, pagina);
  if (!parsed) notFound();
  const { section, page } = parsed;

  const ui = CATALOG_INDEX[locale];
  const entries = indexEntries(section, locale);
  const total = Math.max(1, Math.ceil(entries.length / PER_PAGE));
  if (page > total) notFound();
  const slice = entries.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: HUB[locale].home, path: "" },
          { name: ui.index, path: "/indice" },
          { name: ui.section[section] },
        ], `/indice/${section}/${page}`)}
      />
      <Crumbs locale={locale} trail={[{ label: ui.index, href: `/${locale}/indice` }, { label: ui.section[section] }]} />
      <HubHeader
        h1={`${ui.section[section]} — ${ui.index}`}
        intro={`${ui.intro} ${ui.count.replace("{n}", String(entries.length))}.`}
      />

      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        {INDEX_SECTIONS.map((s) => (
          <Link
            key={s}
            href={`/${locale}/indice/${s}/1`}
            className={`rounded-full border px-3 py-1 transition-colors ${
              s === section
                ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
                : "border-[#C9A24B]/40 bg-white/60 text-[#675c44] hover:border-[#1B3B2B]/40"
            }`}
          >
            {ui.section[s]}
          </Link>
        ))}
      </nav>

      <ul className="columns-1 gap-x-8 text-sm sm:columns-2">
        {slice.map((e) => (
          <li key={e.href} className="mb-1.5 break-inside-avoid">
            <Link href={`/${locale}${e.href}`} className="text-[#1B3B2B] underline decoration-[#C9A24B]/50 underline-offset-2 hover:decoration-[#C9A24B]">
              {e.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Todas las páginas de la sección, no solo anterior/siguiente: la
          cadena prev/next dejaba la página 70 de ropa a 71 clics. */}
      <nav aria-label={ui.pages} className="mt-8 text-sm">
        <h2 className="mb-2 font-medium text-[#1B3B2B]">
          {ui.page} {page} {ui.of} {total}
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {pageRanges(section).map((r) => (
            <li key={r.page}>
              {r.page === page ? (
                <span className="inline-block rounded-full border border-[#1B3B2B] bg-[#1B3B2B] px-3 py-1 text-[#F3E9C9]">{r.page}</span>
              ) : (
                <Link
                  href={`/${locale}/indice/${section}/${r.page}`}
                  title={r.label}
                  className="inline-block rounded-full border border-[#C9A24B]/40 px-3 py-1 text-[#1B3B2B] hover:border-[#1B3B2B]"
                >
                  {r.page}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
