"use client";

import Link from "@/lib/i18n/LocaleLink";
import { useEffect, useRef, useState } from "react";
import type { TicketProduct } from "@/data/tickets";
import { formatOfferMoney, ticketOfferTotalInEUR } from "@/lib/offerMoney";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc, prefetchDetailPhoto } from "@/lib/images";

// Mismo "chrome" visual que BootCard/GearCard, pero con fecha/venue en
// vez de talles (un ticket no tiene talla) y comparando 3 monedas
// reales en vez de una sola (ver ticketOfferTotalInEUR).
export default function TicketCard({ ticket, priority = false }: { ticket: TicketProduct; priority?: boolean }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const favorite = isFavorite(ticket.id);
  const cheapest = ticket.offers.reduce((a, b) =>
    ticketOfferTotalInEUR(a) <= ticketOfferTotalInEUR(b) ? a : b
  );
  const photo = ticket.imageUrl;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef.current?.complete) setImageLoaded(true);
  }, [photo]);

  const prefetched = useRef(false);
  function handlePrefetchPhoto() {
    if (prefetched.current) return;
    prefetched.current = true;
    prefetchDetailPhoto(photo);
  }

  const dateLabel = new Date(`${ticket.date}T${ticket.time}`).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      onMouseEnter={handlePrefetchPhoto}
      onTouchStart={handlePrefetchPhoto}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] shadow-[0_14px_28px_-10px_rgba(43,32,10,0.45)] transition-transform duration-150 ease-out hover:-translate-y-0.5"
    >
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-2.5 sm:p-4 lg:p-6"
        style={{ background: "linear-gradient(135deg, #fffdf8, #C9A24B22, #1B3B2B11)" }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 h-full w-full animate-pulse bg-[#C9A24B]/10" />
        )}
        <img
          ref={imgRef}
          src={getDisplaySrc(photo, 500)}
          alt={ticket.event}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`absolute inset-0 h-full w-full object-contain drop-shadow-sm ${imageLoaded ? "photo-settle-in" : "opacity-0"}`}
        />

        <span className="absolute left-3 top-3 flex flex-col items-start gap-1">
          <span className="vintage-plaque rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {ticket.competition}
          </span>
        </span>

        <div className="shadow-vintage-md absolute bottom-3 right-3 flex flex-col items-end gap-0.5 rounded-2xl border border-[#8a6a1f]/40 bg-gradient-to-br from-[#F3D889] to-[#B8923F] px-3 py-1.5 text-[#2A2410]">
          <span className="text-sm font-semibold">
            {t.botas.from} {formatOfferMoney(cheapest.price, cheapest.currency)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(ticket.id);
          }}
          aria-label={t.nav.favorites}
          className="shadow-vintage-sm absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#B45309] backdrop-blur-md transition-transform hover:scale-110 active:scale-90 sm:h-11 sm:w-11"
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            viewBox="0 0 24 24"
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(ticket.id, cheapest.store);
          }}
          disabled={!isComparing(ticket.id, cheapest.store) && maxReached}
          aria-label={isComparing(ticket.id, cheapest.store) ? t.compare.remove : t.compare.add}
          title={!isComparing(ticket.id, cheapest.store) && maxReached ? t.compare.maxReached : undefined}
          className={`shadow-vintage-sm absolute right-2 top-11 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:top-14 sm:h-11 sm:w-11 ${
            isComparing(ticket.id, cheapest.store)
              ? "bg-[#1B3B2B] text-[#F3E9C9]"
              : "bg-white/80 text-[#1B3B2B]"
          }`}
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
        </button>
      </div>

      <div className="vintage-divider" />

      <div className="flex flex-col gap-0.5 px-2 py-1.5 sm:p-4">
        <h3 className="font-card-title text-xs leading-snug text-[#1a1a1a] sm:text-lg">
          {ticket.event}
        </h3>
        <p className="text-[10px] text-[#675c44] sm:text-xs">
          {dateLabel} · {ticket.venue}
        </p>
      </div>
    </Link>
  );
}
