"use client";

import { useMemo, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { ticketProducts } from "@/data/tickets";
import TicketCard from "@/components/TicketCard";
import Chip from "@/components/Chip";
import ScrollArrowRow from "@/components/ScrollArrowRow";
import FilterSheet from "@/components/FilterSheet";
import SortDropdown from "@/components/SortDropdown";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const PAGE_SIZE = 24;

// Listado propio (no GearListClient -- forma de datos distinta, sin
// talles). Filtros y formato de Filtros/Orden agregados 2026-09-18
// (pedido explícito del usuario: primero "filtro de ciudad, por club,
// por fecha, por liga", después "los filtros tienen que tener este
// formato siempre, como hiciste con los botines" -- mismo FilterSheet/
// SortDropdown que ya usan guantes/pelotas/ropa, ver esos archivos).
//
// Sin filtro de CIUDAD real: el feed solo trae el nombre del estadio
// (`venue`, ej. "Parc des Princes"), nunca una ciudad separada -- son
// 228 estadios reales distintos en el catálogo actual, mapear cada uno
// a su ciudad a mano sin poder verificarlos todos es el tipo de dato
// que no conviene inventar. Se filtra por ESTADIO en su lugar (el dato
// real que sí tenemos), que cubre el mismo caso de uso en la práctica.
// Club: el evento es siempre "Equipo A vs Equipo B", separado acá para
// poder filtrar por cualquiera de los dos lados.
function splitTeams(event: string): [string, string] {
  const [a, b] = event.split(/\s+vs\s+/i);
  return [a?.trim() ?? event, b?.trim() ?? ""];
}

type SortKey = "dateAsc" | "dateDesc";

export default function TicketsPageClient() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("dateAsc");
  const [clubFilter, setClubFilter] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const activeFilterCount = [clubFilter, leagueFilter, venueFilter, dateFilter].filter(Boolean).length;
  function clearAllFilters() {
    setClubFilter("");
    setLeagueFilter("");
    setVenueFilter("");
    setDateFilter("");
    setVisible(PAGE_SIZE);
  }

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
    return [...base].sort((a, b) => {
      const cmp = `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
      return sortBy === "dateAsc" ? cmp : -cmp;
    });
  }, [query, clubFilter, leagueFilter, venueFilter, dateFilter, sortBy]);

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

      <div className="vintage-card mt-5 flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="tickets-search" className="font-tagline text-sm not-italic text-[#5b5442]">
            {t.search.label}
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a8926a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              id="tickets-search"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder={t.search.placeholder}
              className="w-full rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-4 pl-12 pr-11 text-base text-[#1a1a1a] placeholder-[#a8926a] outline-none transition focus:border-[#1B3B2B]/40 focus:bg-white focus:ring-2 focus:ring-[#1B3B2B]/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="relative flex items-center justify-center gap-2 rounded-2xl border border-[#C9A24B]/30 bg-[#FFFDF8] py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:border-[#1B3B2B]/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
            </svg>
            {t.search.filtersButton}
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D97706] text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { key: "dateAsc", label: t.tickets.soonestFirst },
              { key: "dateDesc", label: t.tickets.latestFirst },
            ]}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-[#675c44]">{t.search.resultsCountAll.replace("{n}", String(filtered.length))}</p>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        activeCount={activeFilterCount}
        onClear={clearAllFilters}
      >
        {/* Club/Estadio/Fecha: cientos de valores reales distintos
            (equipos, 228 estadios, cientos de fechas), demasiados para
            una fila de chips -- un <select> nativo es lo que de verdad
            sirve acá. Liga (27 valores) sí entra cómoda como chips. */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.tickets.clubLabel}:</span>
          <select
            value={clubFilter}
            onChange={(e) => { setClubFilter(e.target.value); setVisible(PAGE_SIZE); }}
            aria-label={t.tickets.clubLabel}
            className="rounded-xl border border-[#C9A24B]/30 bg-[#FFFDF8] px-3 py-2 text-sm text-[#1a1a1a] outline-none"
          >
            <option value="">{t.search.allCategories}</option>
            {clubs.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.tickets.venueLabel}:</span>
          <select
            value={venueFilter}
            onChange={(e) => { setVenueFilter(e.target.value); setVisible(PAGE_SIZE); }}
            aria-label={t.tickets.venueLabel}
            className="rounded-xl border border-[#C9A24B]/30 bg-[#FFFDF8] px-3 py-2 text-sm text-[#1a1a1a] outline-none"
          >
            <option value="">{t.search.allCategories}</option>
            {venues.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.tickets.dateLabel}:</span>
          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setVisible(PAGE_SIZE); }}
            aria-label={t.tickets.dateLabel}
            className="rounded-xl border border-[#C9A24B]/30 bg-[#FFFDF8] px-3 py-2 text-sm text-[#1a1a1a] outline-none"
          >
            <option value="">{t.search.allCategories}</option>
            {dates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#675c44]">{t.tickets.leagueLabel}:</span>
          <ScrollArrowRow className="-mx-5 gap-2 px-5">
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
      </FilterSheet>
    </div>
  );
}
