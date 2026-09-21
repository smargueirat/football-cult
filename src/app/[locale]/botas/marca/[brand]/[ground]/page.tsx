import type { Metadata } from "next";
import GearHub, { gearMetadata } from "@/components/hubs/GearHub";
import { asLocale } from "@/lib/hubPages";

// ISR sin prerender (mismo criterio que el resto de los hubs).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; brand: string; ground: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, brand, ground } = await params;
  return gearMetadata({ section: "botas", brandSlug: brand, ground: ground }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, brand, ground } = await params;
  return <GearHub spec={{ section: "botas", brandSlug: brand, ground: ground }} locale={asLocale(locale)} />;
}
