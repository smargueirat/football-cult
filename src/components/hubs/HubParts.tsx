import Link from "next/link";
import type { ReactNode } from "react";
import type { HubItem } from "@/lib/hubs";
import { HUB } from "@/lib/hubStrings";
import type { HubLocale } from "@/data/teamMeta";
import { getAgeGroup } from "@/lib/productMeta";
import { teamNames, typeNames } from "@/data/products";
import { formatOfferMoney } from "@/lib/offerMoney";
import { getDisplaySrc } from "@/lib/images";

// Piezas de servidor de las páginas hub: HTML puro con <a> reales para
// que Google siga los enlaces sin ejecutar JavaScript.

export function Crumbs({ locale, trail }: { locale: HubLocale; trail: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-[#675c44]">
      <Link href={`/${locale}`} className="hover:text-[#1B3B2B]">
        {HUB[locale].home}
      </Link>
      {trail.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span aria-hidden>›</span>
          {c.href ? (
            <Link href={c.href} className="hover:text-[#1B3B2B]">
              {c.label}
            </Link>
          ) : (
            <span className="font-medium text-[#1B3B2B]">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function HubHeader({ h1, intro }: { h1: string; intro: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-4xl">{h1}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#675c44] sm:text-base">{intro}</p>
    </header>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-vintage mb-4 text-xl text-[#1B3B2B] sm:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export function JerseyGrid({ items, locale, showTeam }: { items: HubItem[]; locale: HubLocale; showTeam?: boolean }) {
  const s = HUB[locale];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
      {items.map(({ product, offer }) => {
        const age = getAgeGroup(product);
        const team = teamNames[product.teamKey][locale];
        const label = `${showTeam ? `${team} · ` : ""}${typeNames[product.typeKey][locale]} ${product.season}`;
        const photo = offer.imageUrl;
        const stores = new Set(product.offers.filter((o) => o.inStock).map((o) => o.store)).size;
        return (
          <li key={product.id}>
            <Link
              href={`/${locale}/camiseta/${product.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fffdf8] p-2">
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getDisplaySrc(photo, 400)}
                    alt={`${team} ${typeNames[product.typeKey][locale]} ${product.season}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                )}
                {age !== "men" && (
                  <span className="vintage-plaque absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    {age === "kids" ? s.kids : s.women}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="text-sm font-medium leading-snug text-[#1B3B2B]">{label}</span>
                <span className="mt-auto text-xs text-[#675c44]">
                  {s.from} {formatOfferMoney(offer.price + offer.shipping, offer.currency)} · {s.stores(stores)}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export interface TeamLink {
  href: string;
  name: string;
  count: number;
  price?: string;
}

export function TeamLinks({ items, locale }: { items: TeamLink[]; locale: HubLocale }) {
  const s = HUB[locale];
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((t) => (
        <li key={t.href}>
          <Link
            href={t.href}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#C9A24B]/35 bg-[#fffdf8] px-4 py-3 text-sm text-[#1B3B2B] transition-colors hover:border-[#C9A24B] hover:bg-[#f6efdd]"
          >
            <span className="font-medium">{t.name}</span>
            <span className="shrink-0 text-xs text-[#675c44]">
              {s.jerseysCount(t.count)}
              {t.price ? ` · ${s.from} ${t.price}` : ""}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
