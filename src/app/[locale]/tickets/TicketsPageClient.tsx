"use client";

import { useMemo, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { ticketProducts } from "@/data/tickets";
import TicketCard from "@/components/TicketCard";
import Chip from "@/components/Chip";
import ScrollArrowRow from "@/components/ScrollArrowRow";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const PAGE_SIZE = 24;

// Listado propio (no GearListClient -- forma de datos distinta, sin
// talles) ordenado por fecha del partido en vez de precio: para
// entradas, "qué se juega antes" es más útil de entrada que "qué es más
// barato", a diferencia de un producto físico sin fecha de vencimiento.
//
// Filtros agregados 2026-09-18 (pedido explícito del usuario: "filtro
// de ciudad, por club, por fecha, por liga"). Sin filtro de CIUDAD real:
// el feed solo trae el nombre del estadio (`venue`, ej. "Parc des
// Princes"), nunca una ciudad separada -- son 228 estadios reales
// distintos en el catálogo actual, mapear cada uno a su ciudad a mano
// sin poder verificarlos todos es el tipo de dato que no conviene
// inventar. Se filtra por ESTADIO en su lugar (el dato real que sí
// tenemos), que cubre el mismo caso de uso en la práctica. Club: el
// evento es siempre "Equipo A vs Equipo B", separado acá para poder
// filtrar por cualquiera de los dos lados.
function splitTeams(event: string): [string, string] {
  const [a, b] = event.split(/\s+vs\s+/i);
  return [a?.trim() ?? event, b?.trim() ?? ""];
}

export default function TicketsPageClient() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [clubFilter, setClubFilter] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const clubs = useMemo(
    () => [...new Set(ticketProducts.flatMap((tk) => splitTeams(tk.event)))].filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [],
  );
  const leagues = useMemo(
    () => [...new Set(ticketProducts.map((tk) => tk.competition))].sort((a, b) => a.localeCompare(b)),
    [],
  );
  const venues = useMemo(
    () => [...new Set(ticketProducts.map((tk) => tk.venue))].sort((a, b) => a.localeCompare(b)),
    [],
  );
  const dates = useMemo(
    () => [...new Set(ticketProducts.map((tk) => tk.date))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = ticketProducts.filter((tk) => {
      if (q && !`${tk.event} ${tk.competition} ${tk.venue}`.toLowerCase().includes(q)) return false;
      if (clubFilter && !splitTeams(tk.event).includes(clubFilter)) return false;
      if (leagueFilter && tk.competition !== leagueFilter) return false;
      if (venueFilter && tk.venue !== venueFilter) return false;
      if (dateFilter && tk.date !== dateFilter) return false;
      return true;
    });
    return [...base].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [query, clubFilter, leagueFilter, venueFilter, dateFilter]);

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

      {/* Club/Estadio/Fecha: cientos de valores reales distintos (equipos,
          228 estadios, cientos de fechas), demasiados para una fila de
          chips scrolleable -- un <select> nativo es lo que de verdad
          sirve acá. Liga (27 valores) sí entra cómoda como chips. */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={clubFilter}
          onChange={(e) => { setClubFilter(e.target.value); setVisible(PAGE_SIZE); }}
          aria-label={t.tickets.clubLabel}
          className="glass-panel rounded-xl border border-[#C9A24B]/30 px-3 py-2 text-sm text-[#1a1a1a] outline-none"
        >
          <option value="">{t.tickets.clubLabel}: {t.search.allCategories}</option>
          {clubs.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={venueFilter}
          onChange={(e) => { setVenueFilter(e.target.value); setVisible(PAGE_SIZE); }}
          aria-label={t.tickets.venueLabel}
          className="glass-panel rounded-xl border border-[#C9A24B]/30 px-3 py-2 text-sm text-[#1a1a1a] outline-none"
        >
          <option value="">{t.tickets.venueLabel}: {t.search.allCategories}</option>
          {venues.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setVisible(PAGE_SIZE); }}
          aria-label={t.tickets.dateLabel}
          className="glass-panel rounded-xl border border-[#C9A24B]/30 px-3 py-2 text-sm text-[#1a1a1a] outline-none"
        >
          <option value="">{t.tickets.dateLabel}: {t.search.allCategories}</option>
          {dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <span className="text-xs text-[#675c44]">{t.tickets.leagueLabel}:</span>
        <ScrollArrowRow className="-mx-4 gap-2 px-4 sm:-mx-8 sm:px-8">
          <Chip active={leagueFilter === ""} onClick={() => { setLeagueFilter(""); setVisible(PAGE_SIZE); }} className="flex-shrink-0 whitespace-nowrap">
            {t.search.allCategories}
          </Chip>
          {leagues.map((l) => (
            <Chip key={l} active={leagueFilter === l} onClick={() => { setLeagueFilter(l); setVisible(PAGE_SIZE); }} className="flex-shrink-0 whitespace-nowrap">
              {l}
            </Chip>
          ))}
        </ScrollArrowRow>
      </div>

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
