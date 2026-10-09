import type { Metadata } from "next";
import BootListHub, { bootHubMetadata } from "@/components/hubs/BootListHub";
import { asLocale } from "@/lib/hubPages";

// ISR sin prerender (mismo criterio que el resto de los hubs).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; line: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, line } = await params;
  return bootHubMetadata({ line }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, line } = await params;
  return <BootListHub spec={{ line }} locale={asLocale(locale)} />;
}
