import type { Metadata } from "next";
import ClassicHub, { classicMetadata } from "@/components/hubs/ClassicHub";
import { asLocale } from "@/lib/hubPages";

// ISR sin prerender (mismo criterio que /retro/[team]).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; team: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, team } = await params;
  return classicMetadata({ team }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, team } = await params;
  return <ClassicHub spec={{ team }} locale={asLocale(locale)} />;
}
