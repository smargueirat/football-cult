import type { Metadata } from "next";
import RetroHub, { retroMetadata } from "@/components/hubs/RetroHub";
import { asLocale } from "@/lib/hubPages";

// Retro equipo + década (/retro/manutd/1990), ver retroTeamDecadeFacets.
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; team: string; decade: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, team, decade } = await params;
  return retroMetadata({ team, decade }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, team, decade } = await params;
  return <RetroHub spec={{ team, decade }} locale={asLocale(locale)} />;
}
