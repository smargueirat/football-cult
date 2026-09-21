import type { Metadata } from "next";
import GearHub, { gearMetadata } from "@/components/hubs/GearHub";
import { asLocale } from "@/lib/hubPages";

// ISR sin prerender (mismo criterio que el resto de los hubs).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; brand: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, brand } = await params;
  return gearMetadata({ section: "pelotas", brandSlug: brand }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, brand } = await params;
  return <GearHub spec={{ section: "pelotas", brandSlug: brand }} locale={asLocale(locale)} />;
}
