import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { gearAlias } from "@/lib/gearAliases";
import { ballProducts } from "@/data/balls";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { GearDetailFrame, gearDetailMetadata } from "@/components/GearDetailSeo";
import BallDetailPageClient from "./BallDetailPageClient";

const find = (id: string) => ballProducts.find((p) => p.id === id);

// ISR (2026-09-20): sin generateStaticParams estas páginas eran ƒ
// (cache-control no-store): cada visita de un usuario o de Googlebot
// ejecutaba una función que carga el catálogo entero -- la causa más
// probable de que la cuenta Hobby llegara al 100% de Fluid Active CPU.
// Con esto no se prerenderiza nada (no suma storage al deploy), pero la
// primera visita a cada URL queda cacheada en el CDN por un día.
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const item = find(id);
  return item ? gearDetailMetadata("pelotas", item, locale) : {};
}

export default async function BallDetailPage({ params }: P) {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const item = find(id);
  if (!item?.offers.length) {
    // Ficha fundida o retirada: a la que la reemplaza o, si ya no hay
    // equivalente, al hub más cercano (ver gearAliases.ts).
    const target = gearAlias("pelotas", id);
    if (target?.startsWith("/")) permanentRedirect(`/${locale}${target}`);
    if (target && find(target)) permanentRedirect(`/${locale}/pelotas/${target}`);
    notFound();
  }

  return (
    <GearDetailFrame section="pelotas" item={item} all={ballProducts} locale={locale}>
      <BallDetailPageClient ball={item} />
    </GearDetailFrame>
  );
}
