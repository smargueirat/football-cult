import { formatOfferMoney, offerTotalInEUR, type OfferCurrencyCode } from "@/lib/offerMoney";
import { LEGAL_ENTITY, entityValue } from "@/lib/legalEntity";
import type { Locale } from "@/lib/i18n/translations";

// Correo de "ha bajado de precio" (HTML + texto plano) y la regla de cuándo
// avisar. Función pura, sin catálogo ni Redis: lo usa
// scripts/check_price_alerts.mts y lo comprueba scripts/check_price_alert_email.mts.
//
// HTML de correo: tablas, estilos en línea, 600 px, sin JS ni imágenes de
// fondo. El modo oscuro va en un <style> con prefers-color-scheme (Apple Mail,
// Outlook.com; Gmail invierte los colores por su cuenta y el diseño aguanta).

const SITE = "https://football-cult.com";

/** Avisar si la bajada llega a un 5 % o a 5 EUR (lo que ocurra primero) sobre la referencia. */
export const MIN_DROP_PCT = 0.05;
export const MIN_DROP_EUR = 5;
export const MAX_ITEMS = 5;

export interface DropCheck { pct: number; hit: boolean }

/** ¿Es `price` una bajada que merece aviso respecto a `ref`? (importe en EUR para umbral absoluto) */
export function checkDrop(ref: number, price: number, currency: OfferCurrencyCode): DropCheck {
  if (!(ref > 0) || !(price > 0) || price >= ref) return { pct: 0, hit: false };
  const pct = (ref - price) / ref;
  const eur = offerTotalInEUR({ price: ref - price, shipping: 0, currency });
  return { pct, hit: pct >= MIN_DROP_PCT - 1e-9 || eur >= MIN_DROP_EUR - 1e-9 };
}

/**
 * Precio de referencia tras mirar una oferta. Solo baja: se fija la primera vez
 * y cuando salta un aviso. Las bajadas pequeñas no lo tocan, así que varias
 * seguidas se acumulan hasta superar el umbral; una subida tampoco lo mueve.
 */
export function nextReference(ref: number | undefined, price: number, currency: OfferCurrencyCode) {
  if (!ref) return { ref: price, alert: false };
  const { hit } = checkDrop(ref, price, currency);
  return hit ? { ref: price, alert: true } : { ref, alert: false };
}

/** Un solo correo por persona: las bajadas más grandes primero, hasta MAX_ITEMS. */
export function pickDigest<T extends { pct: number }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.pct - a.pct).slice(0, MAX_ITEMS);
}

export interface RelatedItem { name: string; price: number; currency: OfferCurrencyCode; url: string; image?: string }
export interface AlertItem {
  name: string;
  store: string;
  currency: OfferCurrencyCode;
  from: number;
  to: number;
  /** Ficha en el sitio (sin utm; se añaden aquí). */
  url: string;
  /** Foto de la oferta; sin ella el correo va sin imagen. */
  image?: string;
  /** "free" = envío incluido (dato real), "check" = a calcular en la tienda, número = coste. */
  shipping: "free" | "check" | number;
  /** Enlace de baja de esta suscripción (página con botón). */
  unsub: string;
  related?: RelatedItem[];
}

interface Copy {
  subject1: (name: string, price: string) => string;
  subjectN: (n: number) => string;
  intro1: string;
  introN: (n: number) => string;
  at: string;
  was: string;
  shipFree: string;
  shipPaid: (x: string) => string;
  shipCheck: string;
  cta: string;
  related: string;
  why: string;
  unsubOne: string;
  unsub: string;
  unsubEach: string;
  preheader: (a: { pct: string; store: string; from: string }) => string;
}

const COPY: Record<Locale, Copy> = {
  es: {
    subject1: (n, p) => `Bajó ${n}: ahora ${p}`,
    subjectN: (n) => `Han bajado ${n} productos que sigues`,
    intro1: "Ha bajado de precio algo que sigues.",
    introN: (n) => `Han bajado ${n} productos de tu lista.`,
    at: "en",
    was: "Antes",
    shipFree: "envío incluido",
    shipPaid: (x) => `+ ${x} de envío`,
    shipCheck: "envío a calcular en la tienda",
    cta: "Ver oferta",
    related: "Otras ofertas parecidas",
    why: "Recibes este email porque pediste una alerta de precio en football-cult.com.",
    unsubOne: "Darte de baja de esta alerta",
    unsub: "Darte de baja",
    unsubEach: "Cada producto tiene su propio enlace de baja.",
    preheader: (a) => `${a.pct} en ${a.store}. Antes ${a.from}.`,
  },
  en: {
    subject1: (n, p) => `Price drop: ${n}, now ${p}`,
    subjectN: (n) => `${n} products you follow got cheaper`,
    intro1: "Something you follow just got cheaper.",
    introN: (n) => `${n} products on your list got cheaper.`,
    at: "at",
    was: "Was",
    shipFree: "shipping included",
    shipPaid: (x) => `+ ${x} shipping`,
    shipCheck: "shipping calculated at the store",
    cta: "See the deal",
    related: "Similar deals",
    why: "You're getting this because you asked for a price alert on football-cult.com.",
    unsubOne: "Unsubscribe from this alert",
    unsub: "Unsubscribe",
    unsubEach: "Each product has its own unsubscribe link.",
    preheader: (a) => `${a.pct} at ${a.store}. Was ${a.from}.`,
  },
  pt: {
    subject1: (n, p) => `Baixou ${n}: agora ${p}`,
    subjectN: (n) => `${n} produtos que segues baixaram de preço`,
    intro1: "Baixou de preço algo que segues.",
    introN: (n) => `${n} produtos da tua lista baixaram de preço.`,
    at: "em",
    was: "Antes",
    shipFree: "frete incluído",
    shipPaid: (x) => `+ ${x} de frete`,
    shipCheck: "frete a calcular na loja",
    cta: "Ver oferta",
    related: "Outras ofertas parecidas",
    why: "Recebes este e-mail porque pediste um alerta de preço em football-cult.com.",
    unsubOne: "Cancelar este alerta",
    unsub: "Cancelar",
    unsubEach: "Cada produto tem o seu próprio link de cancelamento.",
    preheader: (a) => `${a.pct} em ${a.store}. Antes ${a.from}.`,
  },
  fr: {
    subject1: (n, p) => `${n} a baissé : désormais ${p}`,
    subjectN: (n) => `${n} produits que vous suivez ont baissé`,
    intro1: "Un produit que vous suivez a baissé de prix.",
    introN: (n) => `${n} produits de votre liste ont baissé de prix.`,
    at: "chez",
    was: "Avant",
    shipFree: "livraison incluse",
    shipPaid: (x) => `+ ${x} de livraison`,
    shipCheck: "livraison calculée sur le site",
    cta: "Voir l'offre",
    related: "Offres similaires",
    why: "Vous recevez cet e-mail car vous avez demandé une alerte de prix sur football-cult.com.",
    unsubOne: "Se désinscrire de cette alerte",
    unsub: "Se désinscrire",
    unsubEach: "Chaque produit a son propre lien de désinscription.",
    preheader: (a) => `${a.pct} chez ${a.store}. Avant ${a.from}.`,
  },
  it: {
    subject1: (n, p) => `Prezzo sceso: ${n}, ora ${p}`,
    subjectN: (n) => `${n} prodotti che segui sono scesi di prezzo`,
    intro1: "Un prodotto che segui è sceso di prezzo.",
    introN: (n) => `${n} prodotti della tua lista sono scesi di prezzo.`,
    at: "su",
    was: "Prima",
    shipFree: "spedizione inclusa",
    shipPaid: (x) => `+ ${x} di spedizione`,
    shipCheck: "spedizione calcolata sul sito",
    cta: "Vedi l'offerta",
    related: "Offerte simili",
    why: "Ricevi questa email perché hai chiesto un avviso di prezzo su football-cult.com.",
    unsubOne: "Annulla questo avviso",
    unsub: "Cancellati",
    unsubEach: "Ogni prodotto ha il proprio link di cancellazione.",
    preheader: (a) => `${a.pct} su ${a.store}. Prima ${a.from}.`,
  },
};

const C = { green: "#1B3B2B", gold: "#C9A24B", cream: "#f0e6d2", card: "#fffaf0", ink: "#201d16", muted: "#675c44", line: "#e0d3b6" };
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Arial,Helvetica,sans-serif";

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);
/** Solo http(s) en href/src: el resto (javascript:, data:) se descarta. */
const safeUrl = (u: string | undefined) => (u && /^https?:\/\//i.test(u) ? esc(u) : "");
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

const withUtm = (url: string, content?: string) => {
  const u = new URL(url, SITE);
  u.searchParams.set("utm_source", "alerta");
  u.searchParams.set("utm_medium", "email");
  if (content) u.searchParams.set("utm_content", content);
  return u.toString();
};
/** Mismo proxy de imágenes que el sitio, pero en JPG: Outlook de escritorio no lee WebP. */
const photo = (url: string | undefined, w: number) =>
  url ? `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${w}&output=jpg` : undefined;

const money = (n: number, c: OfferCurrencyCode) => formatOfferMoney(n, c);
const pctLabel = (l: Locale, pct: number) => `−${Math.round(pct * 100)}${l === "en" ? "%" : " %"}`;

function shipLine(c: Copy, i: AlertItem) {
  return i.shipping === "free" ? c.shipFree : i.shipping === "check" ? c.shipCheck : c.shipPaid(money(i.shipping, i.currency));
}

function button(href: string, label: string, small = false) {
  const pad = small ? "10px 22px" : "15px 40px";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:${small ? 12 : 22}px 0 0"><tr><td align="center" bgcolor="${C.gold}" style="border-radius:4px;background:${C.gold}"><a href="${href}" style="display:inline-block;padding:${pad};font:700 ${small ? 14 : 17}px ${SANS};color:${C.green};text-decoration:none;border-radius:4px">${esc(label)}</a></td></tr></table>`;
}

function itemBlock(l: Locale, c: Copy, i: AlertItem, big: boolean) {
  const pct = (i.from - i.to) / i.from;
  const href = safeUrl(withUtm(i.url));
  const img = safeUrl(photo(i.image, big ? 960 : 240));
  const prices =
    `<p style="margin:0 0 2px;font:14px ${SANS};color:${C.muted}" class="mut">${esc(c.was)} <span style="text-decoration:line-through">${esc(money(i.from, i.currency))}</span>` +
    ` &nbsp;<span style="display:inline-block;padding:2px 8px;border-radius:3px;background:${C.gold};color:${C.green};font:700 13px ${SANS}">${esc(pctLabel(l, pct))}</span></p>` +
    `<p style="margin:0;font:700 ${big ? 38 : 28}px/1.15 ${SERIF};color:${C.green}" class="new">${esc(money(i.to, i.currency))}</p>`;
  const meta = `<p style="margin:6px 0 0;font:14px/1.4 ${SANS};color:${C.muted}" class="mut">${esc(c.at)} <strong>${esc(i.store)}</strong> · ${esc(shipLine(c, i))}</p>`;
  const title = (sz: number) => `<p style="margin:0 0 10px;font:700 ${sz}px/1.25 ${SERIF};color:${C.ink}" class="ink">${esc(i.name)}</p>`;
  if (big) {
    return (
      (img ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#ffffff" style="background:#ffffff;border:1px solid ${C.line};padding:12px"><a href="${href}"><img src="${img}" alt="${esc(i.name)}" width="400" style="display:block;width:100%;max-width:400px;height:auto;border:0;margin:0 auto"></a></td></tr></table><div style="height:20px;line-height:20px">&nbsp;</div>` : "") +
      title(24) + prices + meta + button(href, c.cta)
    );
  }
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    (img ? `<td width="96" valign="top" style="width:96px"><table role="presentation" width="96" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#ffffff" style="background:#ffffff;border:1px solid ${C.line};padding:4px"><a href="${href}"><img src="${img}" alt="${esc(i.name)}" width="86" style="display:block;width:86px;height:auto;border:0"></a></td></tr></table></td>` : "") +
    `<td valign="top" style="padding-left:${img ? 14 : 0}px">${title(16)}${prices}${meta}${button(href, c.cta, true)}` +
    `<p style="margin:10px 0 0;font:12px ${SANS}"><a href="${safeUrl(i.unsub)}" style="color:${C.muted}" class="mut">${esc(c.unsubOne)}</a></p></td></tr></table>`
  );
}

function relatedBlock(l: Locale, c: Copy, items: RelatedItem[]) {
  if (items.length === 0) return "";
  const rows = items
    .map((r) => {
      const href = safeUrl(withUtm(r.url, "relacionadas"));
      const img = safeUrl(photo(r.image, 120));
      return `<tr><td style="padding:8px 0;border-top:1px solid ${C.line}" class="ln"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
        (img ? `<td width="56" valign="middle" style="width:56px"><a href="${href}"><img src="${img}" alt="" width="48" style="display:block;width:48px;height:auto;border:0;background:#ffffff"></a></td>` : "") +
        `<td valign="middle" style="font:14px/1.35 ${SANS}"><a href="${href}" style="color:${C.ink};text-decoration:none;font-weight:700" class="ink">${esc(r.name)}</a><br><span style="color:${C.green}" class="new">${esc(money(r.price, r.currency))}</span></td></tr></table></td></tr>`;
    })
    .join("");
  return `<div style="height:26px;line-height:26px">&nbsp;</div><p style="margin:0 0 6px;font:700 13px ${SANS};letter-spacing:1.5px;text-transform:uppercase;color:${C.muted}" class="mut">${esc(c.related)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
}

export interface RenderedAlert { subject: string; html: string; text: string }

export function renderAlertEmail(l: Locale, items: AlertItem[]): RenderedAlert {
  const c = COPY[l];
  const n = items.length;
  const first = items[0];
  const subject = oneLine(n === 1 ? c.subject1(first.name, money(first.to, first.currency)) : c.subjectN(n));
  const intro = n === 1 ? c.intro1 : c.introN(n);
  const pre = n === 1
    ? c.preheader({ pct: pctLabel(l, (first.from - first.to) / first.from), store: first.store, from: money(first.from, first.currency) })
    : intro;
  const address = entityValue("address");
  const legal = [LEGAL_ENTITY.brand + " · " + LEGAL_ENTITY.domain, LEGAL_ENTITY.name, address].filter(Boolean).join(" · ");
  const body = items
    .map((i, k) => `<tr><td style="padding:${k === 0 ? 0 : 20}px 0 20px;${k === 0 ? "" : `border-top:1px solid ${C.line}`}" class="ln">${itemBlock(l, c, i, n === 1)}</td></tr>`)
    .join("");

  const html = `<!doctype html>
<html lang="${l}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(subject)}</title>
<style>
@media (prefers-color-scheme: dark) {
  .bg { background:#121c17 !important; }
  .card { background:#1c2a23 !important; }
  .ink { color:#f0e6d2 !important; }
  .mut { color:#bfb398 !important; }
  .new { color:#e3be6a !important; }
  .ln { border-color:#34473d !important; }
}
@media only screen and (max-width: 480px) {
  .pad { padding-left:16px !important; padding-right:16px !important; }
}
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.cream}">${esc(pre)}</div>
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.cream}" style="background:${C.cream}"><tr><td align="center" style="padding:16px 8px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
<tr><td align="center" bgcolor="${C.green}" style="background:${C.green};padding:22px 16px;border-bottom:3px solid ${C.gold}"><a href="${SITE}/${l}" style="font:700 24px ${SERIF};letter-spacing:4px;text-transform:uppercase;color:${C.gold};text-decoration:none">Football Cult</a></td></tr>
<tr><td class="card pad" bgcolor="${C.card}" style="background:${C.card};padding:28px 32px">
<p style="margin:0 0 18px;font:16px/1.45 ${SANS};color:${C.ink}" class="ink">${esc(intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table>
${n === 1 ? relatedBlock(l, c, first.related ?? []) : ""}
</td></tr>
<tr><td class="pad" style="padding:20px 32px;font:12px/1.55 ${SANS};color:${C.muted}"><span class="mut">
${esc(c.why)}${n > 1 ? " " + esc(c.unsubEach) : ""}<br>
${n === 1 ? `<a href="${safeUrl(first.unsub)}" class="mut" style="color:${C.muted}">${esc(c.unsub)}</a><br>` : ""}
${esc(legal)}</span></td></tr>
</table>
</td></tr></table>
</body>
</html>`;

  const lines = items.map((i) => {
    const pct = pctLabel(l, (i.from - i.to) / i.from);
    return [
      `${i.name}`,
      `${c.was} ${money(i.from, i.currency)} → ${money(i.to, i.currency)} (${pct}) ${c.at} ${i.store} · ${shipLine(c, i)}`,
      `${c.cta}: ${withUtm(i.url)}`,
      ...(n > 1 ? [`${c.unsubOne}: ${i.unsub}`] : []),
    ].join("\n");
  });
  const rel = n === 1 && first.related?.length
    ? [`\n${c.related}:`, ...first.related.map((r) => `- ${r.name} · ${money(r.price, r.currency)} · ${withUtm(r.url, "relacionadas")}`)]
    : [];
  const text = [
    intro, "", lines.join("\n\n"), ...rel, "", "--", c.why + (n > 1 ? " " + c.unsubEach : ""),
    ...(n === 1 ? [`${c.unsub}: ${first.unsub}`] : []), legal,
  ].join("\n");

  return { subject, html, text };
}
