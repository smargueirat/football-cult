import type { Metadata } from "next";
import ClassicHub, { classicMetadata } from "@/components/hubs/ClassicHub";
import { asLocale } from "@/lib/hubPages";

// Clásicas equipo + década (/clasicas/arsenal/2010), ver classicTeamDecadeFacets.
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; team: string; decade: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, team, decade } = await params;
  return classicMetadata({ team, decade }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, team, decade } = await params;
  return <ClassicHub spec={{ team, decade }} locale={asLocale(locale)} />;
}
