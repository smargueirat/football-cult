import type { Metadata } from "next";
import RetroHub, { retroMetadata } from "@/components/hubs/RetroHub";
import { asLocale } from "@/lib/hubPages";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; decade: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, decade } = await params;
  return retroMetadata({ decade }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, decade } = await params;
  return <RetroHub spec={{ decade }} locale={asLocale(locale)} />;
}
