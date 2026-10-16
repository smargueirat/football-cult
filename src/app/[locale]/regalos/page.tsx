import { permanentRedirect } from "next/navigation";
import { asLocale } from "@/lib/hubPages";

// /regalos pasó a /regalos-futbol (2026-10-16): guía de Navidad y Reyes por
// presupuesto y por tipo. 308 para no perder lo que Google ya tenga de aquí.
export default async function GiftsMoved({ params }: { params: Promise<{ locale: string }> }) {
  permanentRedirect(`/${asLocale((await params).locale)}/regalos-futbol`);
}
