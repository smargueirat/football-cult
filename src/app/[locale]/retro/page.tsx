import { Metadata } from "next";
import CategoryCatalogPage from "@/components/CategoryCatalogPage";
import { buildCategoryMetadata } from "@/lib/categoryMeta";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { asLocale } from "@/lib/hubPages";
import { retroDecadeFacets, retroTeamFacets } from "@/lib/extraHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { teamName } from "@/lib/hubs";
import { LinkChipRow } from "@/components/hubs/HubLinkParts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return buildCategoryMetadata(locale, 2, "/retro");
}

export default async function RetroPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const x = EXTRA[locale];
  return (
    <>
      <CategoryCatalogPage
        sectionIndex={2}
        type="retro"
        guideSlug="que-es-una-camiseta-retro"
      />
      {/* Hubs retro por década y por equipo (2026-10-09): enlaces de
          servidor, rastreables sin JS. */}
      <nav aria-label={x.explore} className="mx-auto w-full max-w-[1800px] px-4 pb-10 sm:px-8">
        <LinkChipRow title={x.retroByDecade} items={retroDecadeFacets().map((d) => ({ href: `/${locale}/retro/decada/${d.decade}`, label: x.decadeName(d.decade) }))} />
        <LinkChipRow title={x.retroByTeam} items={retroTeamFacets()
            .map((t) => ({ href: `/${locale}/retro/${t.team}`, label: teamName(t.team, locale) }))
            .sort((a, b) => a.label.localeCompare(b.label))} />
      </nav>
    </>
  );
}
