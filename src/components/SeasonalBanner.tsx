"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { activeSeasonal, bannerText, todayIso } from "@/lib/seasonal";

// Aviso de la página estacional vigente (Black Friday, Navidad/Reyes) en la
// home y los hubs. Caduca solo: la fecha se mira en el navegador, así que una
// página estática generada antes del evento no lo deja colgado después.
// `today` es la fecha con la que se generó el HTML en el servidor (sale en el
// HTML si ya tocaba); sin ella el aviso solo aparece tras hidratar.
// `?fecha=2026-11-20` simula otro día para probarlo (como ?dazn= en DaznLayout).
const noop = () => () => {};
function clientDay(): string {
  const forced = new URLSearchParams(window.location.search).get("fecha");
  return forced && /^\d{4}-\d{2}-\d{2}$/.test(forced) ? forced : todayIso();
}

export default function SeasonalBanner({ today = "" }: { today?: string }) {
  const { locale } = useLanguage();
  const pathname = usePathname() ?? "";
  const day = useSyncExternalStore(noop, clientDay, () => today);
  const events = day ? activeSeasonal(day).filter((e) => !pathname.endsWith(e.path)) : [];
  if (!events.length) return null;
  return (
    <div className="mb-4 flex flex-col gap-2">
      {events.map((e) => (
        <Link
          key={e.id}
          href={`/${locale}${e.path}`}
          className="block rounded-xl border border-[#C9A24B]/50 bg-[#1B3B2B] px-4 py-2.5 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#244d38]"
        >
          {bannerText(e, locale)} →
        </Link>
      ))}
    </div>
  );
}
