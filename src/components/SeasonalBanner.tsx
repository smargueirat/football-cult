"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDisplaySrc } from "@/lib/images";
import { activeSeasonal, bannerParts, todayIso } from "@/lib/seasonal";

// Aviso de la página estacional vigente (Black Friday, Navidad/Reyes) en la
// home y los hubs. Caduca solo: la fecha se mira en el navegador, así que una
// página estática generada antes del evento no lo deja colgado después.
// `today` es la fecha con la que se generó el HTML en el servidor (sale en el
// HTML si ya tocaba); sin ella el aviso solo aparece tras hidratar.
// `?fecha=2026-11-20` simula otro día para probarlo (como ?dazn= en DaznLayout).
//
// Diseño 2026-11-10 (pedido del dueño: "no se ve"): pasó de una tira fina de
// una línea a una tarjeta con etiqueta, fechas, titular, botón y, si la página
// la trae del servidor, una fila de fotos de las mayores bajadas. Las fotos
// llegan por prop (este componente es de cliente y no puede importar el
// catálogo); en los hubs, sin fotos, queda la tarjeta de texto.
const noop = () => () => {};
function clientDay(): string {
  const forced = new URLSearchParams(window.location.search).get("fecha");
  return forced && /^\d{4}-\d{2}-\d{2}$/.test(forced) ? forced : todayIso();
}

export interface BannerPhoto {
  src: string;
  alt: string;
  pct: number;
}

export default function SeasonalBanner({ today = "", photos = [] }: { today?: string; photos?: BannerPhoto[] }) {
  const { locale } = useLanguage();
  const pathname = usePathname() ?? "";
  const day = useSyncExternalStore(noop, clientDay, () => today);
  const events = day ? activeSeasonal(day).filter((e) => !pathname.endsWith(e.path)) : [];
  if (!events.length) return null;
  return (
    <div className="mb-5 flex flex-col gap-3">
      {events.map((e) => {
        const p = bannerParts(e, locale);
        const pics = e.id === "black-friday" ? photos.slice(0, 4) : [];
        return (
          <Link
            key={e.id}
            href={`/${locale}${e.path}`}
            className="group relative flex items-stretch overflow-hidden rounded-2xl border border-[#C9A24B]/60 bg-gradient-to-br from-[#14261c] via-[#1B3B2B] to-[#244d38] shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="stadium-beam-a pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-2 px-5 py-4 sm:gap-3 sm:px-8 sm:py-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-tagline text-xs uppercase tracking-wider text-[#E7C567] sm:text-sm">{p.eyebrow}</span>
                <span className="rounded-full border border-[#E7C567]/50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#F3E9C9] sm:text-xs">
                  {p.dates}
                </span>
              </div>
              <p className="font-vintage text-xl leading-tight text-[#F3E9C9] sm:text-3xl lg:text-4xl">{p.headline}</p>
              {p.tag && <p className="text-xs text-[#D9CFAE] sm:text-base">{p.tag}</p>}
              <span className="shadow-vintage-md mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#2A2410] transition-transform group-hover:scale-[1.03] sm:px-6 sm:py-2.5 sm:text-sm">
                {p.cta}
                <span aria-hidden>→</span>
              </span>
            </div>
            {pics.length > 0 && (
              <div className="relative z-10 hidden items-center gap-3 py-4 pr-5 sm:flex lg:pr-8">
                {pics.map((ph, i) => (
                  <div key={ph.src} className={`relative aspect-[4/5] w-24 overflow-hidden rounded-xl border border-[#C9A24B]/40 bg-white p-1.5 shadow-md lg:w-32 ${i > 1 ? "hidden lg:block" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getDisplaySrc(ph.src, 260)} alt={ph.alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-[#B45309] px-1.5 py-0.5 text-[10px] font-semibold text-white">-{ph.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
