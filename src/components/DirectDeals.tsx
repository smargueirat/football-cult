"use client";

import { useMemo } from "react";
import Link from "@/lib/i18n/LocaleLink";
import type { DirectDeal } from "@/lib/directDeals";
import { CONV } from "@/lib/convStrings";
import { offerShipsTo } from "@/lib/productMeta";
import { formatOfferMoney, shippingNotMeasured } from "@/lib/offerMoney";
import { getDisplaySrc } from "@/lib/images";
import { trackOfferClick } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCountry } from "@/lib/country/CountryContext";

// Fila de tarjetas con botón "Ver en {tienda} — {precio}" que va directo a
// /go/ (un toque hasta la tienda). Las tarjetas llegan armadas del servidor
// (lib/directDeals.ts); aquí solo se elige, por país, la primera oferta que
// envía allí, y la tarjeta desaparece si ninguna envía. La foto reserva su
// cuadrado (sin saltos de layout) y carga en diferido.
export default function DirectDeals({
  deals,
  title,
  eyebrow,
  sub,
  max = 8,
  surface,
}: {
  deals: DirectDeal[];
  title: string;
  eyebrow?: string;
  sub?: string;
  max?: number;
  surface: "home" | "listado" | "alt";
}) {
  const { locale, t } = useLanguage();
  const { countryCode } = useCountry();
  const c = CONV[locale];
  const shown = useMemo(
    () =>
      deals
        .flatMap((d) => {
          const o = d.offers.find((x) => offerShipsTo(x.store, countryCode));
          return o ? [{ d, o }] : [];
        })
        .slice(0, max),
    [deals, countryCode, max],
  );
  if (shown.length === 0) return null;

  return (
    <section className="mt-6" data-testid={`deals-${surface}`}>
      {eyebrow && <span className="font-tagline text-[10px] uppercase text-[#7A5B1E] sm:text-xs">{eyebrow}</span>}
      <h2 className="font-vintage text-lg text-[#1B3B2B] sm:text-2xl">{title}</h2>
      {sub && <p className="mt-0.5 text-xs text-[#675c44] sm:text-sm">{sub}</p>}
      <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {shown.map(({ d, o }, i) => {
          const measured = !shippingNotMeasured(o, countryCode);
          const total = measured ? o.price + o.shipping : o.price;
          const price = formatOfferMoney(total, o.currency);
          return (
            <div key={d.key} className="vintage-card flex w-44 shrink-0 snap-start flex-col overflow-hidden rounded-2xl sm:w-52">
              <Link href={d.path} className="group flex flex-1 flex-col">
                <span className="relative block aspect-square bg-white">
                  {d.img && (
                    <img
                      src={getDisplaySrc(d.img, 260)}
                      srcSet={`${getDisplaySrc(d.img, 260)} 260w, ${getDisplaySrc(d.img, 420)} 420w`}
                      sizes="(max-width: 640px) 176px, 208px"
                      alt={d.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain p-2"
                    />
                  )}
                  {d.tag && o === d.offers[0] && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#B45309] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {d.tag}
                    </span>
                  )}
                </span>
                <span className="line-clamp-2 px-2.5 pt-2 text-xs leading-snug text-[#1a1a1a] group-hover:text-[#1B3B2B] sm:text-sm">
                  {d.name}
                </span>
              </Link>
              <div className="px-2.5 pb-2.5 pt-1">
                <p className="text-[11px] text-[#675c44]">
                  {d.before && o === d.offers[0] ? (
                    <span className="mr-1 line-through">{c.before.replace("{price}", formatOfferMoney(d.before, o.currency))}</span>
                  ) : null}
                  {measured ? t.product.shippingIncluded : t.product.shippingNotIncluded}
                </p>
                <a
                  href={o.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  data-testid="deal-go"
                  onClick={() =>
                    trackOfferClick({ productId: d.key, position: i + 1, isBest: true, store: o.store, url: o.url, price: total, currency: o.currency, surface })
                  }
                  className="mt-1.5 flex min-h-11 items-center justify-center rounded-full bg-[#1B3B2B] px-2 py-1 text-center text-xs font-medium leading-tight text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
                >
                  {c.goWithPrice.replace("{store}", o.store).replace("{price}", price)}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
