"use client";

import type { TicketProduct } from "@/data/tickets";
import TicketDetailClient from "@/components/TicketDetailClient";

export default function TicketDetailPageClient({ ticket }: { ticket: TicketProduct }) {
  return <TicketDetailClient ticket={ticket} />;
}
