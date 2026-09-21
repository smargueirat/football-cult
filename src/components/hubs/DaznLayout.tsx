"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DAZN_BY_COUNTRY, creativeHref, creativeImg, landingHref, type DaznProgramme } from "@/data/daznAds";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Publicidad de DAZN (afiliados Awin) en las páginas de liga: columna a la
// derecha en escritorio y tarjeta arriba en celular. Solo se muestra si el
// visitante está en un país con programa (España, Francia) Y la liga está
// entre las que DAZN tiene ahí; en cualquier otro caso devuelve el
// contenido tal cual, sin columna vacía.
const STORAGE_KEY = "football-cult-country";
const GEO_COOKIE = "football-cult-geo-country";

function visitorCountry(): string | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return stored.toUpperCase();
  } catch {
    /* localStorage bloqueado: seguimos con la cookie */
  }
  const m = document.cookie.match(new RegExp(`(?:^|; )${GEO_COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]).toUpperCase() : null;
}

const T = {
  es: { ad: "Publicidad · enlace de afiliado", title: (l: string) => `Mirá ${l} en DAZN`, body: "Suscripción de pago de un servicio de terceros.", cta: "Ver en DAZN" },
  en: { ad: "Advertisement · affiliate link", title: (l: string) => `Watch ${l} on DAZN`, body: "Paid subscription from a third-party service.", cta: "Watch on DAZN" },
  pt: { ad: "Publicidade · link de afiliado", title: (l: string) => `Veja ${l} na DAZN`, body: "Assinatura paga de um serviço de terceiros.", cta: "Ver na DAZN" },
  fr: { ad: "Publicité · lien d'affiliation", title: (l: string) => `Regardez ${l} sur DAZN`, body: "Abonnement payant d'un service tiers.", cta: "Voir sur DAZN" },
  it: { ad: "Pubblicità · link di affiliazione", title: (l: string) => `Guarda ${l} su DAZN`, body: "Abbonamento a pagamento di un servizio di terze parti.", cta: "Guarda su DAZN" },
} as const;

function PromoCard({ programme, leagueName, big }: { programme: DaznProgramme; leagueName: string; big: boolean }) {
  const { locale } = useLanguage();
  const t = T[locale];
  const banner = programme.banners.length ? (big ? programme.banners[0] : programme.banners[1] ?? programme.banners[0]) : null;

  return (
    <div className="mx-auto w-fit max-w-full">
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-[#8a836e]">{t.ad}</p>
      {banner ? (
        <a href={creativeHref(programme, banner)} target="_blank" rel="sponsored nofollow noopener" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={creativeImg(programme, banner)} width={banner.w} height={banner.h} alt={t.title(leagueName)} loading="lazy" className="block max-w-full" style={{ height: "auto", aspectRatio: `${banner.w} / ${banner.h}` }} />
        </a>
      ) : (
        <a
          href={landingHref(programme)}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="block w-[300px] max-w-full rounded-2xl border border-[#C9A24B]/40 bg-gradient-to-b from-[#1B3B2B] to-[#10261b] p-5 text-[#F3E9C9] shadow-md transition-transform hover:-translate-y-0.5"
        >
          <span className="font-vintage block text-xl leading-snug">{t.title(leagueName)}</span>
          <span className="mt-2 block text-xs text-[#B8AF98]">{t.body}</span>
          <span className="mt-4 inline-block rounded-full bg-[#C9A24B] px-4 py-2 text-sm font-semibold text-[#1B3B2B]">{t.cta} →</span>
        </a>
      )}
    </div>
  );
}

export default function DaznLayout({ league, leagueName, children }: { league: string; leagueName: string; children: ReactNode }) {
  const [programme, setProgramme] = useState<DaznProgramme | null>(null);

  useEffect(() => {
    const c = visitorCountry();
    const p = c ? DAZN_BY_COUNTRY[c] : undefined;
    setProgramme(p && p.leagues.includes(league) ? p : null);
  }, [league]);

  if (!programme) return <>{children}</>;
  return (
    <>
      <div className="mb-6 lg:hidden">
        <PromoCard programme={programme} leagueName={leagueName} big={false} />
      </div>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div>{children}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PromoCard programme={programme} leagueName={leagueName} big />
          </div>
        </aside>
      </div>
    </>
  );
}
