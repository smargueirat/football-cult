import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { SEASON_UI } from "@/lib/seasonStrings";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { priceDrops } from "@/lib/seasonHubs";
import { Crumbs, HubHeader, JerseyGrid, JsonLd } from "@/components/hubs/HubParts";

// Se recalcula cada hora: los precios se controlan una vez al día pero la
// lista debe quedar al día apenas corre el scan diario.
export const revalidate = 3600;

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  return hubMetadata(locale, "/ofertas", SEASON_UI[locale].offersH1, SEASON_UI[locale].offersMeta);
}

export default async function Offers({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = SEASON_UI[locale];
  const drops = priceDrops().slice(0, 120);
  const badges = Object.fromEntries(drops.map((d) => [d.product.id, `-${d.pct}%`]));

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd data={breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.offersH1 }])} />
      <Crumbs locale={locale} trail={[{ label: ui.offersH1 }]} />
      <HubHeader h1={ui.offersH1} intro={drops.length ? ui.offersIntro(drops.length) : ui.offersEmpty} />
      {drops.length > 0 && <JerseyGrid items={drops} locale={locale} showTeam badges={badges} />}
    </div>
  );
}
