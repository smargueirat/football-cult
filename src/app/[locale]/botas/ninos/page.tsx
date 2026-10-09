import type { Metadata } from "next";
import BootListHub, { bootHubMetadata } from "@/components/hubs/BootListHub";
import { asLocale } from "@/lib/hubPages";

export const revalidate = 86400;

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return bootHubMetadata({ kids: true }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale } = await params;
  return <BootListHub spec={{ kids: true }} locale={asLocale(locale)} />;
}
