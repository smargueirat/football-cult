"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LEGAL } from "@/lib/legalStrings";
import { markGoClicks } from "@/lib/go";
import {
  CONSENT_OPEN_EVENT,
  applyConsent,
  needsReload,
  readConsent,
  setConsentDefaults,
  writeConsent,
  type Consent,
} from "@/lib/consent";

// Banner de cookies. Aceptar / Rechazar / Configurar con el mismo peso
// visual en Aceptar y Rechazar (la AEPD exige que rechazar sea tan fácil
// como aceptar). No bloquea el sitio: es una barra inferior, no un muro.
export default function ConsentBanner() {
  const { locale } = useLanguage();
  const c = LEGAL[locale].consent;
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [affiliate, setAffiliate] = useState(false);
  const firstRef = useRef<HTMLButtonElement>(null);

  // Arranque: defaults denegados siempre; si ya hay elección, se aplica.
  useEffect(() => {
    // Siempre, ANTES y FUERA de cualquier consentimiento: j=1 es un parámetro
    // funcional propio (no cookie, no seguimiento) y el filtro de robots de
    // /go/ lo necesita también de quien rechaza o no responde al banner.
    // Este componente se monta en todas las páginas aunque el banner esté cerrado.
    markGoClicks();
    setConsentDefaults();
    const saved = readConsent();
    if (saved) {
      applyConsent(saved);
    } else {
      // localStorage solo existe en el cliente: el banner se decide después
      // de montar (el HTML del servidor no lo incluye, así no hay mismatch).
      queueMicrotask(() => setOpen(true));
    }
  }, []);

  // Reabrir desde el pie de página.
  useEffect(() => {
    const reopen = () => {
      const saved = readConsent();
      setAnalytics(saved?.analytics ?? false);
      setAffiliate(saved?.affiliate ?? false);
      setPanel(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  // Al reabrir a propósito, el foco va al panel (el usuario lo pidió).
  useEffect(() => {
    if (open && panel) firstRef.current?.focus();
  }, [open, panel]);

  const choose = useCallback((next: Consent) => {
    const reload = needsReload(next);
    writeConsent(next);
    setAnalytics(next.analytics);
    setAffiliate(next.affiliate);
    setOpen(false);
    setPanel(false);
    // Retirar un permiso no deshace scripts ya ejecutados: recargar es la
    // única forma limpia de que dejen de funcionar.
    if (reload) window.location.reload();
    else applyConsent(next);
  }, []);

  if (!open) return null;

  const btn =
    "min-h-11 flex-1 rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9D38F] sm:flex-none";

  return (
    <div
      role="region"
      aria-label={c.region}
      className="fixed inset-x-0 bottom-0 z-[100] max-h-[90vh] overflow-y-auto border-t border-[#C9A24B]/40 bg-[#1b1812] px-4 py-4 text-[#F3E9C9] shadow-[0_-8px_30px_rgba(0,0,0,0.45)] sm:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-base font-semibold text-[#E9D38F]">{c.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-[#D8CFB6]">
          {c.body}{" "}
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-[#F3E9C9]">
            {c.moreInfo}
          </Link>
        </p>

        {panel && (
          <div className="mt-3 flex flex-col gap-3 text-sm">
            <label className="flex items-start gap-3 opacity-80">
              <input type="checkbox" checked disabled className="mt-1 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">{c.necessaryLabel}</span>
                <span className="text-[#B8AF98]">{c.necessaryDesc}</span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[#C9A24B]"
              />
              <span>
                <span className="block font-semibold">{c.analyticsLabel}</span>
                <span className="text-[#B8AF98]">{c.analyticsDesc}</span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={affiliate}
                onChange={(e) => setAffiliate(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[#C9A24B]"
              />
              <span>
                <span className="block font-semibold">{c.affiliateLabel}</span>
                <span className="text-[#B8AF98]">{c.affiliateDesc}</span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            ref={firstRef}
            onClick={() => choose({ analytics: true, affiliate: true })}
            className={`${btn} border-[#C9A24B] bg-[#C9A24B] text-[#1b1812] hover:bg-[#E9D38F]`}
          >
            {c.accept}
          </button>
          <button
            type="button"
            onClick={() => choose({ analytics: false, affiliate: false })}
            className={`${btn} border-[#C9A24B] bg-[#C9A24B] text-[#1b1812] hover:bg-[#E9D38F]`}
          >
            {c.reject}
          </button>
          {panel ? (
            <button
              type="button"
              onClick={() => choose({ analytics, affiliate })}
              className={`${btn} border-[#C9A24B]/60 text-[#F3E9C9] hover:bg-white/10`}
            >
              {c.save}
            </button>
          ) : (
            <button
              type="button"
              aria-expanded={false}
              onClick={() => setPanel(true)}
              className={`${btn} border-[#C9A24B]/60 text-[#F3E9C9] hover:bg-white/10`}
            >
              {c.configure}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
