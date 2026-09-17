"use client";

import { useMemo, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { ticketProducts } from "@/data/tickets";
import TicketCard from "@/components/TicketCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const PAGE_SIZE = 24;

// Listado propio (no GearListClient -- forma de datos distinta, sin
// talles) ordenado por fecha del partido en vez de precio: para
// entradas, "qué se juega antes" es más útil de entrada que "qué es más
// barato", a diferencia de un producto físico sin fecha de vencimiento.
export default function TicketsPageClient() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? ticketProducts.filter((tk) => `${tk.event} ${tk.competition} ${tk.venue}`.toLowerCase().includes(q))
      : ticketProducts;
    return [...base].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <Link
        href="/"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{t.tickets.pageTitle}</h1>
      <p className="mt-1 text-sm text-[#675c44]">{t.tickets.pageSubtitle.replace("{n}", String(ticketProducts.length))}</p>

      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setVisible(PAGE_SIZE);
        }}
        placeholder={t.nav.search}
        className="glass-panel mt-5 w-full max-w-sm rounded-xl border border-[#C9A24B]/30 px-4 py-2 text-sm text-[#1a1a1a] outline-none placeholder:text-[#675c44]/60"
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.slice(0, visible).map((ticket, i) => (
          <TicketCard key={ticket.id} ticket={ticket} priority={i < 4} />
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="vintage-plaque rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            {t.search.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
