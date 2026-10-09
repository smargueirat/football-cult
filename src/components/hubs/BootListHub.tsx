import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { HubLocale } from "@/data/teamMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import { UI, brandHeadline, groundName, sectionNoun } from "@/lib/gearHubStrings";
import { MIN_HUB_ITEMS, brandFacets, cheapestFirst, gearFacts, groundFacets, type GearItem } from "@/lib/gearHubs";
import { bootLineBySlug } from "@/lib/bootLines";
import { futsalItems, kidsBootItems, lineFacets, lineItems, lineKidsCount } from "@/lib/extraHubs";
import { EXTRA } from "@/lib/extraHubStrings";
import { breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { HUB } from "@/lib/hubStrings";
import { Crumbs, HubHeader, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";
import HubFaq from "@/components/hubs/HubFaq";
import HubCatalog from "@/components/hubs/HubCatalog";
import { AllItemLinks, LinkChipRow } from "@/components/hubs/HubLinkParts";

// Hubs de botas con listado filtrable: línea de modelo (/botas/linea/x),
// niño (/botas/ninos) y fútbol sala (/botas/futbol-sala). Mismas piezas que
// GearHub (cabecera, preguntas, enlaces cruzados) más el SearchExplorer de
// /botas recortado al hub, para que haya Filtros y Ordenar.
export type BootHubSpec = { line: string } | { kids: true } | { futsal: true };

function resolve(spec: BootHubSpec, locale: HubLocale) {
  const ui = EXTRA[locale];
  if ("line" in spec) {
    const line = bootLineBySlug(spec.line);
    if (!line) return null;
    const items = lineItems(line.slug);
    if (items.length < MIN_HUB_ITEMS) return null;
    return { items, line, headline: brandHeadline("botas", line.name, locale), path: `/botas/linea/${line.slug}`, kidsCount: lineKidsCount(line.slug) };
  }
  const kids = "kids" in spec;
  const items = kids ? kidsBootItems() : futsalItems();
  if (items.length < MIN_HUB_ITEMS) return null;
  return { items, line: undefined, headline: kids ? ui.kidsH1 : ui.futsalH1, path: kids ? "/botas/ninos" : "/botas/futbol-sala", kidsCount: 0 };
}

// En EUR (total con envío convertido), no en la moneda de la tienda: un
// "Desde BRL 99,99" en /es no le dice nada a nadie (seo-tecnico F4).
const money = (i: GearItem) => formatOfferMoney(i.eur, "EUR");

export function bootHubMetadata(spec: BootHubSpec, locale: HubLocale): Metadata {
  const r = resolve(spec, locale);
  if (!r) return {};
  return hubMetadata(locale, r.path, r.headline, UI[locale].meta({ headline: r.headline, n: r.items.length, price: money(cheapestFirst(r.items)[0]) }));
}

export default function BootListHub({ spec, locale }: { spec: BootHubSpec; locale: HubLocale }) {
  const r = resolve(spec, locale);
  if (!r) notFound();
  const ui = UI[locale];
  const x = EXTRA[locale];
  const noun = sectionNoun("botas", locale);
  const stores = new Set(r.items.flatMap((i) => i.storeNames)).size;
  const sorted = cheapestFirst(r.items);

  // Migas: Botas > [Marca] > [Línea madre] > hub.
  const brand = r.line ? brandFacets("botas").find((b) => b.slug === r.line!.brand) : undefined;
  const parent = r.line?.parent ? bootLineBySlug(r.line.parent) : undefined;
  const trail = [
    { name: noun, path: "/botas" },
    ...(brand ? [{ name: brandHeadline("botas", brand.name, locale), path: `/botas/marca/${brand.slug}` }] : []),
    ...(parent ? [{ name: brandHeadline("botas", parent.name, locale), path: `/botas/linea/${parent.slug}` }] : []),
  ];

  const lines = lineFacets().filter((l) => l.slug !== r.line?.slug);
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: ui.home, path: "" }, ...trail, { name: r.headline }], r.path),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: r.headline,
            url: `${SITE_URL}/${locale}${r.path}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: r.items.length,
              itemListElement: sorted.slice(0, 20).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/botas/${it.id}` })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[...trail.map((c) => ({ label: c.name, href: `/${locale}${c.path}` })), { label: r.headline }]} />
      <HubHeader h1={r.headline} intro={ui.intro({ headline: r.headline, n: r.items.length, stores, price: money(sorted[0]) })} />
      {r.kidsCount > 0 && (
        <p className="-mt-5 mb-6 text-sm text-[#675c44]">
          {x.lineKidsNote(r.kidsCount)}{" "}
          <Link className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2" href={`/${locale}/botas/ninos`}>
            {x.kidsH1}
          </Link>
          .
        </p>
      )}

      <HubCatalog
        forcedSection="boots"
        forcedBootLine={r.line?.slug}
        forcedBootKids={"kids" in spec ? true : undefined}
        forcedBootGround={"futsal" in spec ? "IC" : undefined}
      />

      <HubFaq locale={locale} subject={r.headline} facts={gearFacts(r.items)} variant="gear" />
      <AllItemLinks title={x.allModels(r.items.length)} items={[...r.items].sort((a, b) => a.model.localeCompare(b.model)).map((i) => ({ href: `/${locale}/botas/${i.id}`, label: i.model }))} />

      {lines.length > 0 && (
        <Section title={x.byLine}>
          <TeamLinks
            locale={locale}
            countLabel={String}
            items={lines.map((l) => ({ href: `/${locale}/botas/linea/${l.slug}`, name: brandHeadline("botas", l.name, locale), count: l.count }))}
          />
        </Section>
      )}
      <nav aria-label={ui.explore}>
        <LinkChipRow
          title={x.kidsAndFutsal}
          items={[
            ...(!("kids" in spec) ? [{ href: `/${locale}/botas/ninos`, label: x.kidsH1 }] : []),
            ...(!("futsal" in spec) ? [{ href: `/${locale}/botas/futbol-sala`, label: x.futsalH1 }] : []),
          ]}
        />
        <LinkChipRow title={ui.byGround} items={groundFacets().map((g) => ({ href: `/${locale}/botas/terreno/${g.slug}`, label: groundName(g.name, locale) }))} />
        <LinkChipRow title={ui.byBrand} items={brandFacets("botas").slice(0, 30).map((b) => ({ href: `/${locale}/botas/marca/${b.slug}`, label: b.name }))} />
        <p className="text-sm">
          <a
            className="font-medium text-[#1B3B2B] underline decoration-[#C9A24B] underline-offset-2 transition-colors hover:text-[#8a6a1f]"
            href={`/${locale}/guia/tapones-botas-segun-terreno`}
          >
            {HUB[locale].studsGuideLink} →
          </a>
        </p>
      </nav>
    </div>
  );
}
