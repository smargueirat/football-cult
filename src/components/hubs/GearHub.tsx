import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { HubLocale } from "@/data/teamMeta";
import { formatOfferMoney } from "@/lib/offerMoney";
import { getDisplaySrc } from "@/lib/images";
import { translations } from "@/lib/i18n/translations";
import { UI, brandHeadline, groundHeadline, groundName, sectionNoun, typeHeadline } from "@/lib/gearHubStrings";
import {
  brandFacets,
  brandGroundCombos,
  byBrand,
  byBrandGround,
  byGround,
  byType,
  cheapestFirst,
  groundFacets,
  groundFromSlug,
  groundSlug,
  typeFacets,
  type GearItem,
  type GearSection,
} from "@/lib/gearHubs";
import { breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd, Section, TeamLinks } from "@/components/hubs/HubParts";

export interface GearSpec {
  section: GearSection;
  brandSlug?: string;
  ground?: string; // slug de terreno
  type?: string; // tipo de ropa
}

function resolve(spec: GearSpec, locale: HubLocale) {
  const { section } = spec;
  let items: GearItem[] = [];
  let headline = "";
  let path = `/${section}`;
  const ground = spec.ground ? groundFromSlug(spec.ground) : undefined;
  if (spec.ground && !ground) return null;

  if (section === "botas" && spec.brandSlug && ground) {
    items = byBrandGround(spec.brandSlug, ground);
    if (!items.length) return null;
    headline = groundHeadline(ground, locale, items[0].brand);
    path = `/botas/marca/${spec.brandSlug}/${spec.ground}`;
  } else if (section === "botas" && ground) {
    items = byGround(ground);
    headline = groundHeadline(ground, locale);
    path = `/botas/terreno/${spec.ground}`;
  } else if (section === "ropa" && spec.type) {
    items = byType(spec.type);
    const tn = (translations[locale].ropa.types as Record<string, string>)[spec.type];
    if (!tn) return null;
    headline = typeHeadline(tn, locale);
    path = `/ropa/tipo/${spec.type}`;
  } else if (spec.brandSlug) {
    items = byBrand(section, spec.brandSlug);
    if (!items.length) return null;
    headline = brandHeadline(section, items[0].brand, locale);
    path = `/${section}/marca/${spec.brandSlug}`;
  } else return null;
  if (!items.length) return null;
  const stores = new Set(items.flatMap((i) => i.storeNames)).size;
  const min = cheapestFirst(items)[0];
  return { items, headline, path, min, stores };
}

const money = (i: GearItem) => formatOfferMoney(i.price + i.shipping, i.currency);

export function gearMetadata(spec: GearSpec, locale: HubLocale): Metadata {
  const r = resolve(spec, locale);
  if (!r) return {};
  return hubMetadata(locale, r.path, r.headline, UI[locale].meta({ headline: r.headline, n: r.items.length, price: money(r.min) }));
}

export default function GearHub({ spec, locale }: { spec: GearSpec; locale: HubLocale }) {
  const r = resolve(spec, locale);
  if (!r) notFound();
  const ui = UI[locale];
  const { section } = spec;
  const noun = sectionNoun(section, locale);

  // Enlaces cruzados (rastreables) hacia los demás hubs de la sección.
  const brands = brandFacets(section).filter((b) => b.slug !== spec.brandSlug).slice(0, 24);
  const grounds = section === "botas" ? groundFacets() : [];
  const types = section === "ropa" ? typeFacets() : [];

  const sample = cheapestFirst(r.items).slice(0, 60);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: ui.home, path: "" }, { name: noun, path: `/${section}` }, { name: r.headline }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: r.headline,
            url: `${SITE_URL}/${locale}${r.path}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: r.items.length,
              itemListElement: sample.slice(0, 20).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/${locale}/${section}/${it.id}` })),
            },
          },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: noun, href: `/${locale}/${section}` }, { label: r.headline }]} />
      <HubHeader h1={r.headline} intro={ui.intro({ headline: r.headline, n: r.items.length, stores: r.stores, price: money(r.min) })} />

      <Section title={sample.length < r.items.length ? ui.cheapest : ui.all}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {sample.map((it) => (
            <li key={it.id}>
              <Link
                href={`/${locale}/${section}/${it.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#fffdf8] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getDisplaySrc(it.image, 400)} alt={it.model} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <span className="text-sm font-medium leading-snug text-[#1B3B2B]">{it.model}</span>
                  <span className="mt-auto text-xs text-[#675c44]">
                    {ui.from} {money(it)} · {ui.stores(it.stores)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {grounds.length > 0 && (
        <Section title={ui.byGround}>
          <TeamLinks
            locale={locale}
            countLabel={String}
            items={
              spec.brandSlug
                ? brandGroundCombos()
                    .filter((c) => c.brandSlug === spec.brandSlug)
                    .map((c) => ({ href: `/${locale}/botas/marca/${c.brandSlug}/${groundSlug(c.ground)}`, name: groundName(c.ground, locale), count: c.count }))
                : grounds.map((g) => ({ href: `/${locale}/botas/terreno/${g.slug}`, name: groundName(g.name, locale), count: g.count }))
            }
          />
        </Section>
      )}
      {types.length > 0 && (
        <Section title={ui.byType}>
          <TeamLinks
            locale={locale}
            countLabel={String}
            items={types.map((t) => ({ href: `/${locale}/ropa/tipo/${t.slug}`, name: (translations[locale].ropa.types as Record<string, string>)[t.slug] ?? t.slug, count: t.count }))}
          />
        </Section>
      )}
      <Section title={spec.brandSlug ? ui.otherBrands : ui.byBrand}>
        <TeamLinks locale={locale} countLabel={String} items={brands.map((b) => ({ href: `/${locale}/${section}/marca/${b.slug}`, name: b.name, count: b.count }))} />
      </Section>
    </div>
  );
}
