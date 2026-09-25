import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES, GUIDE_SLUGS, GUIDE_UI } from "@/lib/guides";
import { HUB } from "@/lib/hubStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { Crumbs, HubHeader, JsonLd } from "@/components/hubs/HubParts";

export const revalidate = 86400;

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  return hubMetadata(locale, "/guia", GUIDE_UI[locale].index, GUIDE_UI[locale].indexIntro);
}

export default async function GuidesIndex({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = GUIDE_UI[locale];
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
      <JsonLd data={breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.index }], "/guia")} />
      <Crumbs locale={locale} trail={[{ label: ui.index }]} />
      <HubHeader h1={ui.index} intro={ui.indexIntro} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {GUIDE_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/${locale}/guia/${slug}`} className="block h-full rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8] p-5 transition-colors hover:border-[#C9A24B] hover:bg-[#f6efdd]">
              <span className="font-vintage block text-lg text-[#1B3B2B]">{GUIDES[slug][locale].title}</span>
              <span className="mt-2 block text-sm text-[#675c44]">{GUIDES[slug][locale].description}</span>
              <span className="mt-3 inline-block text-sm font-medium text-[#1B3B2B] underline">{ui.read} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
