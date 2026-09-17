"use client";

import Link from "@/lib/i18n/LocaleLink";
import Image from "next/image";
import type { TicketProduct, TicketOffer } from "@/data/tickets";
import { formatOfferMoney, ticketOfferTotalInEUR } from "@/lib/offerMoney";
import { trackOfferClick } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useCompare } from "@/lib/compare/CompareContext";
import { getDisplaySrc } from "@/lib/images";

export default function TicketDetailClient({ ticket }: { ticket: TicketProduct }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, maxReached } = useCompare();
  const favorite = isFavorite(ticket.id);

  const sortedOffers = [...ticket.offers].sort(
    (a, b) => ticketOfferTotalInEUR(a) - ticketOfferTotalInEUR(b)
  );
  const cheapest = sortedOffers[0];

  const dateLabel = new Date(`${ticket.date}T${ticket.time}`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeLabel = ticket.time.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-8 sm:px-6">
      <Link
        href="/tickets"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t.detail.backToCatalog}
      </Link>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_2fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image src={getDisplaySrc(ticket.imageUrl, 1200)} alt={ticket.event} fill unoptimized className="object-contain p-6" />
          <button
            onClick={() => toggleFavorite(ticket.id)}
            aria-label={t.nav.favorites}
            className="shadow-vintage-sm absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#B45309] backdrop-blur-md transition-transform hover:scale-110"
          >
            <svg
              className="h-4 w-4"
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
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-[#B8933F]">{ticket.competition}</span>
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{ticket.event}</h1>
          <p className="mt-2 text-sm text-[#675c44]">
            {dateLabel} · {timeLabel} · {ticket.venue}
          </p>
          <p className="mt-2 text-sm text-[#675c44]">
            {t.botas.bestPrice}: {t.botas.from} {formatOfferMoney(cheapest.price, cheapest.currency)}
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {sortedOffers.map((offer: TicketOffer, i) => (
              <div
                key={offer.store}
                className="glass-panel flex w-full items-center justify-between gap-3 rounded-xl border border-[#C9A24B]/25 p-4 text-left"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {offer.store}
                      {i === 0 && (
                        <span className="ml-2 rounded-full bg-[#1B3B2B] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#F3E9C9]">
                          {t.botas.bestPrice}
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleCompare(ticket.id, offer.store)}
                      disabled={!isComparing(ticket.id, offer.store) && maxReached}
                      title={!isComparing(ticket.id, offer.store) && maxReached ? t.compare.maxReached : undefined}
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        isComparing(ticket.id, offer.store)
                          ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
                          : "border-[#C9A24B]/40 bg-white/60 text-[#675c44] hover:border-[#1B3B2B]/40 hover:text-[#1a1a1a]"
                      }`}
                    >
                      {isComparing(ticket.id, offer.store) ? t.compare.remove : t.compare.add}
                    </button>
                  </div>
                  <p className="text-xs text-[#675c44]">{formatOfferMoney(offer.price, offer.currency)}</p>
                </div>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() =>
                    trackOfferClick({ store: offer.store, url: offer.url, price: offer.price, currency: offer.currency })
                  }
                  className="vintage-plaque shrink-0 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  {t.botas.viewOffer}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
