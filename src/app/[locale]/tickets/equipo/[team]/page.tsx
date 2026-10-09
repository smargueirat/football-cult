import type { Metadata } from "next";
import TicketHub, { ticketHubMetadata } from "@/components/hubs/TicketHub";
import { asLocale } from "@/lib/hubPages";

// ISR sin prerender (mismo criterio que el resto de los hubs).
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

type P = { params: Promise<{ locale: string; team: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, team } = await params;
  return ticketHubMetadata({ team }, asLocale(locale));
}

export default async function Page({ params }: P) {
  const { locale, team } = await params;
  return <TicketHub spec={{ team }} locale={asLocale(locale)} />;
}
