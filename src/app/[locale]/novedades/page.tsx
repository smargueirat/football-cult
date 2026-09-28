import type { Metadata } from "next";
import { HUB } from "@/lib/hubStrings";
import { NEW_UI, shortDate } from "@/lib/newStrings";
import { newArrivals } from "@/lib/hubs";
import { asLocale, breadcrumbLd, hubMetadata } from "@/lib/hubPages";
import { Crumbs, HubHeader, JerseyGrid, JsonLd } from "@/components/hubs/HubParts";

// Camisetas recién salidas. Cada presentación de una camiseta nueva es un pico
// de búsqueda previsible, y el escaneo nocturno ya la suma en menos de 24 h;
// esta página es la que Google revisita seguido y la que enlaza a esas fichas
// apenas existen, para que las encuentre el mismo día y no semanas después.
export const revalidate = 3600;

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = NEW_UI[locale];
  return hubMetadata(locale, "/novedades", ui.metaTitle, ui.metaDescription);
}

export default async function NewArrivals({ params }: P) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const ui = NEW_UI[locale];
  const items = newArrivals(30).slice(0, 120);
  const badges = Object.fromEntries(items.map((i) => [i.product.id, ui.badge(shortDate(i.since, locale))]));

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <JsonLd data={breadcrumbLd(locale, [{ name: HUB[locale].home, path: "" }, { name: ui.h1 }], "/novedades")} />
      <Crumbs locale={locale} trail={[{ label: ui.h1 }]} />
      <HubHeader h1={ui.h1} intro={items.length ? ui.intro(items.length) : ui.empty} />
      {items.length > 0 && <JerseyGrid items={items} locale={locale} showTeam badges={badges} />}
    </div>
  );
}
