import type { Metadata } from "next";
import RetroHub, { retroMetadata } from "@/components/hubs/RetroHub";
import { asLocale } from "@/lib/hubPages";

// ISR sin prerender (mismo criterio que /equipo/[team]).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; team: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, team } = await params;
  return retroMetadata({ team }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, team } = await params;
  return <RetroHub spec={{ team }} locale={asLocale(locale)} />;
}
