import type { Metadata } from "next";
import TicketHub, { ticketHubMetadata } from "@/components/hubs/TicketHub";
import { asLocale } from "@/lib/hubPages";

export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; comp: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, comp } = await params;
  return ticketHubMetadata({ competition: comp }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, comp } = await params;
  return <TicketHub spec={{ competition: comp }} locale={asLocale(locale)} />;
}
