import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, GUIDE_SLUGS, GUIDE_UI, type GuideSlug } from "@/lib/guides";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata, SITE_URL } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; slug: string }> };

const isSlug = (s: string): s is GuideSlug => (GUIDE_SLUGS as readonly string[]).includes(s);

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  if (!isSlug(slug)) return {};
  const g = GUIDES[slug][locale];
  return hubMetadata(locale, `/guia/${slug}`, g.title, g.description);
}

export default async function GuidePage({ params }: P) {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  if (!isSlug(slug)) notFound();
  const g = GUIDES[slug][locale];
  const ui = GUIDE_UI[locale];
  const other = GUIDE_SLUGS.find((s) => s !== slug)!;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
      <JsonLd
        data={[
          breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.index, path: "/guia" }, { name: g.title }]),
          { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, inLanguage: locale, mainEntityOfPage: `${SITE_URL}/${locale}/guia/${slug}`, publisher: { "@type": "Organization", name: "Football Cult" } },
        ]}
      />
      <Crumbs locale={locale} trail={[{ label: ui.index, href: `/${locale}/guia` }, { label: g.title }]} />
      <HubHeader h1={g.title} intro={g.intro} />
      <article className="space-y-8">
        {g.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-vintage mb-2 text-xl text-[#1B3B2B] sm:text-2xl">{s.h}</h2>
            {s.p.map((t, i) => (
              <p key={i} className="mb-3 text-sm leading-relaxed text-[#3a3a36] sm:text-base">
                {t}
              </p>
            ))}
          </section>
        ))}
      </article>
      <aside className="mt-10 rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8] p-5">
        <h2 className="font-vintage mb-3 text-lg text-[#1B3B2B]">{ui.related}</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#1B3B2B]">
          <li><Link className="underline" href={`/${locale}/guia/${other}`}>{GUIDES[other][locale].title}</Link></li>
          <li><Link className="underline" href={`/${locale}/guia-de-tallas`}>{ui.sizes}</Link></li>
          <li><Link className="underline" href={`/${locale}/autenticidad`}>{ui.auth}</Link></li>
          <li><Link className="underline" href={`/${locale}/ofertas`}>{ui.deals}</Link></li>
          <li><Link className="underline" href={`/${locale}/ligas`}>{HUB[locale].leaguesIndex}</Link></li>
        </ul>
      </aside>
    </div>
  );
}
