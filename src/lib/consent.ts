// Consentimiento de cookies (RGPD + LSSI art. 22.2). La elección vive en
// localStorage; todo acceso va en try/catch porque en ventanas privadas o
// con el almacenamiento bloqueado lanza (entonces el banner reaparece en
// cada página, que es lo correcto: sin elección guardada no se carga nada).
export const CONSENT_KEY = "fc-consent-v1";
export const AFFILIATE_COOKIE = "fc_aff";
export const SKIMLINKS_PUB_ID = "307104X1795379";
/** Evento que dispara el enlace del pie para reabrir el panel. */
export const CONSENT_OPEN_EVENT = "fc:open-consent";

export type Consent = { analytics: boolean; affiliate: boolean };

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Consent>;
    return { analytics: v.analytics === true, affiliate: v.affiliate === true };
  } catch {
    return null;
  }
}

export function writeConsent(c: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, t: Date.now() }));
  } catch {
    /* sin almacenamiento: la elección vale solo para esta carga */
  }
  // Cookie de preferencia (no rastrea): deja que /go/ sepa en el servidor si
  // puede envolver el enlace en Skimlinks.
  document.cookie = `${AFFILIATE_COOKIE}=${c.affiliate ? 1 : 0}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const SKIMLINKS_SRC = `https://s.skimresources.com/js/${SKIMLINKS_PUB_ID}.skimlinks.js`;

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };

/**
 * Consent Mode v2: antes de cualquier elección todo queda en "denied".
 * `gtag` es local a propósito: no se publica en `window` hasta que haya
 * consentimiento de analítica, así trackOfferClick() (que hace
 * `window.gtag?.()`) no encola eventos de quien no aceptó.
 */
function dataLayerGtag() {
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  return function gtag(...args: unknown[]) {
    void args;
    // GA4 exige el objeto `arguments`, no un array.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
}

let defaultsSet = false;
let gaLoaded = false;
let skimLoaded = false;

export function setConsentDefaults(): void {
  if (defaultsSet || typeof window === "undefined") return;
  defaultsSet = true;
  dataLayerGtag()("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
}

export function loadAnalytics(): void {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;
  setConsentDefaults();
  const gtag = dataLayerGtag();
  // Solo analítica: los permisos de publicidad siguen denegados.
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", GA_ID);
  (window as W).gtag = gtag;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function loadSkimlinks(): void {
  if (skimLoaded) return;
  skimLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = SKIMLINKS_SRC;
  document.body.appendChild(s);
}

/** True si el estado nuevo quita algo que ya estaba cargado en esta página. */
export function needsReload(next: Consent): boolean {
  return (gaLoaded && !next.analytics) || (skimLoaded && !next.affiliate);
}

export function applyConsent(c: Consent): void {
  if (c.analytics) loadAnalytics();
  if (c.affiliate) loadSkimlinks();
}
