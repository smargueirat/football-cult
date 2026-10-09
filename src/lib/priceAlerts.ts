import { createHmac, timingSafeEqual } from "node:crypto";
import type { RedisClientType } from "redis";
import type { Locale } from "@/lib/i18n/translations";
import { isLocale } from "@/lib/i18n/locales";

// Alertas de precio por email: claves de Redis, enlaces firmados y textos
// de los correos. Lo usan /api/price-alerts (alta, confirmación, baja) y
// scripts/check_price_alerts.mts (el envío semanal, fuera del proceso web).
//
// Los enlaces de confirmación y de baja son tokens firmados con HMAC
// (derivado de AUTH_SECRET), no aleatorios guardados en Redis: así las 9
// suscripciones que ya existían antes de que hubiera enlace de baja
// también reciben uno, sin migrar nada. Si AUTH_SECRET cambia, los enlaces
// de correos ya enviados dejan de valer (la baja se puede pedir igual por
// email, lo dice la política).

export const SITE_URL = "https://football-cult.com";
export const PRODUCT_ID_RE = /^[\w.-]{1,160}$/;
const CONFIRM_TTL_MS = 7 * 24 * 3600 * 1000;

/** Set de emails ACTIVOS por producto (el mismo formato de siempre). */
export const subsKey = (productId: string) => `priceAlertSubscribers:${productId}`;
/** Hash email -> idioma, para escribir el aviso en el idioma de quien se suscribió. */
export const localeKey = (productId: string) => `priceAlertLocale:${productId}`;
/** Hash url de oferta -> precio visto en la última corrida semanal. */
export const lastKey = (productId: string) => `priceAlertLast:${productId}`;

type Action = "c" | "u"; // confirmar alta | darse de baja
export interface AlertToken {
  a: Action;
  e: string;
  p: string;
  l: Locale;
  x?: number; // caducidad (ms), solo en confirmaciones
}

function hmac(body: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return createHmac("sha256", secret).update(`price-alerts:${body}`).digest();
}

export function signToken(t: AlertToken): string {
  const body = Buffer.from(JSON.stringify(t)).toString("base64url");
  return `${body}.${hmac(body).toString("base64url")}`;
}

export function verifyToken(raw: string | null): AlertToken | null {
  const [body, sig] = (raw ?? "").split(".");
  if (!body || !sig) return null;
  const want = hmac(body);
  const got = Buffer.from(sig, "base64url");
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    const t = JSON.parse(Buffer.from(body, "base64url").toString()) as AlertToken;
    if ((t.a !== "c" && t.a !== "u") || !isLocale(t.l) || !PRODUCT_ID_RE.test(t.p)) return null;
    if (t.x && Date.now() > t.x) return null;
    return t;
  } catch {
    return null;
  }
}

export function confirmUrl(email: string, productId: string, locale: Locale) {
  const t = signToken({ a: "c", e: email, p: productId, l: locale, x: Date.now() + CONFIRM_TTL_MS });
  return `${SITE_URL}/api/price-alerts?t=${t}`;
}

export function unsubscribeUrl(email: string, productId: string, locale: Locale) {
  return `${SITE_URL}/api/price-alerts?t=${signToken({ a: "u", e: email, p: productId, l: locale })}`;
}

export async function activate(redis: RedisClientType, email: string, productId: string, locale: Locale) {
  await redis.sAdd(subsKey(productId), email);
  await redis.hSet(localeKey(productId), email, locale);
}

export async function deactivate(redis: RedisClientType, email: string, productId: string) {
  await redis.sRem(subsKey(productId), email);
  await redis.hDel(localeKey(productId), email);
  // Sin nadie suscrito, el precio de referencia ya no sirve para nada.
  if ((await redis.sCard(subsKey(productId))) === 0) await redis.del(lastKey(productId));
}

interface Copy {
  confirmSubject: string;
  confirmBody: (link: string, productId: string) => string;
  alertSubject: (name: string) => string;
  alertBody: (a: { name: string; from: string; to: string; store: string; url: string; unsub: string }) => string;
}

export const EMAIL_COPY: Record<Locale, Copy> = {
  es: {
    confirmSubject: "Confirma tu alerta de precio",
    confirmBody: (link, p) =>
      `Has pedido que te avisemos por email cuando baje el precio de este producto en Football Cult (${p}).\n\nPara activar la alerta, confirma aquí:\n${link}\n\nSi no lo has pedido tú, ignora este mensaje: no te volveremos a escribir.`,
    alertSubject: (name) => `Ha bajado de precio: ${name}`,
    alertBody: (a) =>
      `${a.name} ha bajado de ${a.from} a ${a.to} en ${a.store}.\n\nVer: ${a.url}\n\n--\nRecibes este email porque pediste una alerta de precio para este producto en football-cult.com.\nDarte de baja (un clic): ${a.unsub}`,
  },
  en: {
    confirmSubject: "Confirm your price alert",
    confirmBody: (link, p) =>
      `You asked us to email you when the price of this product drops on Football Cult (${p}).\n\nTo turn the alert on, confirm here:\n${link}\n\nIf you didn't ask for this, just ignore this email: we won't write again.`,
    alertSubject: (name) => `Price drop: ${name}`,
    alertBody: (a) =>
      `${a.name} dropped from ${a.from} to ${a.to} at ${a.store}.\n\nSee it: ${a.url}\n\n--\nYou're getting this because you asked for a price alert for this product on football-cult.com.\nUnsubscribe (one click): ${a.unsub}`,
  },
  pt: {
    confirmSubject: "Confirma o teu alerta de preço",
    confirmBody: (link, p) =>
      `Pediste que te avisemos por e-mail quando o preço deste produto baixar na Football Cult (${p}).\n\nPara ativar o alerta, confirma aqui:\n${link}\n\nSe não foste tu, ignora esta mensagem: não voltaremos a escrever-te.`,
    alertSubject: (name) => `Baixou de preço: ${name}`,
    alertBody: (a) =>
      `${a.name} baixou de ${a.from} para ${a.to} em ${a.store}.\n\nVer: ${a.url}\n\n--\nRecebes este e-mail porque pediste um alerta de preço para este produto em football-cult.com.\nCancelar (um clique): ${a.unsub}`,
  },
  fr: {
    confirmSubject: "Confirmez votre alerte de prix",
    confirmBody: (link, p) =>
      `Vous avez demandé à être prévenu par e-mail quand le prix de ce produit baisse sur Football Cult (${p}).\n\nPour activer l'alerte, confirmez ici :\n${link}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message : nous ne vous écrirons plus.`,
    alertSubject: (name) => `Baisse de prix : ${name}`,
    alertBody: (a) =>
      `${a.name} est passé de ${a.from} à ${a.to} chez ${a.store}.\n\nVoir : ${a.url}\n\n--\nVous recevez cet e-mail car vous avez demandé une alerte de prix pour ce produit sur football-cult.com.\nSe désinscrire (un clic) : ${a.unsub}`,
  },
  it: {
    confirmSubject: "Conferma il tuo avviso di prezzo",
    confirmBody: (link, p) =>
      `Hai chiesto di essere avvisato via email quando il prezzo di questo prodotto scende su Football Cult (${p}).\n\nPer attivare l'avviso, conferma qui:\n${link}\n\nSe non sei stato tu, ignora questo messaggio: non ti scriveremo più.`,
    alertSubject: (name) => `Prezzo sceso: ${name}`,
    alertBody: (a) =>
      `Il prezzo di ${a.name} è sceso da ${a.from} a ${a.to} su ${a.store}.\n\nVedi: ${a.url}\n\n--\nRicevi questa email perché hai chiesto un avviso di prezzo per questo prodotto su football-cult.com.\nCancellati (un clic): ${a.unsub}`,
  },
};
