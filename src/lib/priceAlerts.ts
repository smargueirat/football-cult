import { randomBytes } from "node:crypto";
import type { RedisClientType } from "redis";
import type { Locale } from "@/lib/i18n/translations";

// Alertas de precio por email: claves de Redis, enlaces y textos de los
// correos. Lo usan /api/price-alerts (alta, confirmación, baja), la página
// /[locale]/alerta-precio y scripts/check_price_alerts.mts (el envío
// semanal, fuera del proceso web).
//
// Los enlaces llevan un token aleatorio opaco guardado en Redis (nunca el
// email en la URL). El enlace abre una página con un botón y la acción va
// por POST: los escáneres de correo que abren los enlaces solos no
// confirman ni dan de baja a nadie. La única acción directa es el POST
// "one-click" de List-Unsubscribe (RFC 8058), que solo hace un cliente de
// correo a petición del usuario.

export const SITE_URL = "https://football-cult.com";
export const PRODUCT_ID_RE = /^[\w.-]{1,160}$/;
const TOKEN_RE = /^[\w-]{24}$/;
const CONFIRM_TTL_S = 7 * 24 * 3600;

/** Set de emails ACTIVOS por producto (el mismo formato de siempre). */
export const subsKey = (productId: string) => `priceAlertSubscribers:${productId}`;
/** Hash email -> idioma, para escribir el aviso en el idioma de quien se suscribió. */
export const localeKey = (productId: string) => `priceAlertLocale:${productId}`;
/** Hash url de oferta -> precio visto en la última corrida semanal. */
export const lastKey = (productId: string) => `priceAlertLast:${productId}`;
/** Hash email -> token de baja (uno por suscripción, se reutiliza en cada aviso). */
const unsubKey = (productId: string) => `priceAlertUnsub:${productId}`;
/** Token -> {acción, email, producto, idioma}. Confirmaciones caducan a los 7 días. */
const tokenKey = (token: string) => `priceAlertToken:${token}`;

export interface AlertToken {
  a: "c" | "u"; // confirmar alta | darse de baja
  e: string;
  p: string;
  l: Locale;
}

const newToken = () => randomBytes(18).toString("base64url"); // 24 caracteres

export const pageUrl = (token: string, locale: Locale) => `${SITE_URL}/${locale}/alerta-precio?t=${token}`;
/** Destino de List-Unsubscribe: acepta el POST one-click y, con GET, lleva a la página. */
export const oneClickUrl = (token: string) => `${SITE_URL}/api/price-alerts?t=${token}`;

export async function createConfirmToken(redis: RedisClientType, e: string, p: string, l: Locale) {
  const token = newToken();
  await redis.set(tokenKey(token), JSON.stringify({ a: "c", e, p, l }), { EX: CONFIRM_TTL_S });
  return token;
}

export async function unsubscribeToken(redis: RedisClientType, e: string, p: string, l: Locale) {
  const existing = await redis.hGet(unsubKey(p), e);
  if (existing) return existing;
  const token = newToken();
  await redis.set(tokenKey(token), JSON.stringify({ a: "u", e, p, l }));
  await redis.hSet(unsubKey(p), e, token);
  return token;
}

export async function readToken(redis: RedisClientType, token: string | null | undefined) {
  if (!token || !TOKEN_RE.test(token)) return null;
  const raw = await redis.get(tokenKey(token));
  return raw ? (JSON.parse(raw) as AlertToken) : null;
}

/** Ejecuta lo que pide el token (y lo consume). Devuelve null si no existe o caducó. */
export async function applyToken(redis: RedisClientType, token: string | null) {
  const t = await readToken(redis, token);
  if (!t) return null;
  if (t.a === "c") {
    await activate(redis, t.e, t.p, t.l);
    await redis.del(tokenKey(token!));
  } else {
    await deactivate(redis, t.e, t.p);
  }
  return t;
}

export async function activate(redis: RedisClientType, email: string, productId: string, locale: Locale) {
  await redis.sAdd(subsKey(productId), email);
  await redis.hSet(localeKey(productId), email, locale);
}

export async function deactivate(redis: RedisClientType, email: string, productId: string) {
  await redis.sRem(subsKey(productId), email);
  await redis.hDel(localeKey(productId), email);
  const token = await redis.hGet(unsubKey(productId), email);
  if (token) {
    await redis.del(tokenKey(token));
    await redis.hDel(unsubKey(productId), email);
  }
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
      `${a.name} ha bajado de ${a.from} a ${a.to} en ${a.store}.\n\nVer: ${a.url}\n\n--\nRecibes este email porque pediste una alerta de precio para este producto en football-cult.com.\nDarte de baja: ${a.unsub}`,
  },
  en: {
    confirmSubject: "Confirm your price alert",
    confirmBody: (link, p) =>
      `You asked us to email you when the price of this product drops on Football Cult (${p}).\n\nTo turn the alert on, confirm here:\n${link}\n\nIf you didn't ask for this, just ignore this email: we won't write again.`,
    alertSubject: (name) => `Price drop: ${name}`,
    alertBody: (a) =>
      `${a.name} dropped from ${a.from} to ${a.to} at ${a.store}.\n\nSee it: ${a.url}\n\n--\nYou're getting this because you asked for a price alert for this product on football-cult.com.\nUnsubscribe: ${a.unsub}`,
  },
  pt: {
    confirmSubject: "Confirma o teu alerta de preço",
    confirmBody: (link, p) =>
      `Pediste que te avisemos por e-mail quando o preço deste produto baixar na Football Cult (${p}).\n\nPara ativar o alerta, confirma aqui:\n${link}\n\nSe não foste tu, ignora esta mensagem: não voltaremos a escrever-te.`,
    alertSubject: (name) => `Baixou de preço: ${name}`,
    alertBody: (a) =>
      `${a.name} baixou de ${a.from} para ${a.to} em ${a.store}.\n\nVer: ${a.url}\n\n--\nRecebes este e-mail porque pediste um alerta de preço para este produto em football-cult.com.\nCancelar: ${a.unsub}`,
  },
  fr: {
    confirmSubject: "Confirmez votre alerte de prix",
    confirmBody: (link, p) =>
      `Vous avez demandé à être prévenu par e-mail quand le prix de ce produit baisse sur Football Cult (${p}).\n\nPour activer l'alerte, confirmez ici :\n${link}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message : nous ne vous écrirons plus.`,
    alertSubject: (name) => `Baisse de prix : ${name}`,
    alertBody: (a) =>
      `${a.name} est passé de ${a.from} à ${a.to} chez ${a.store}.\n\nVoir : ${a.url}\n\n--\nVous recevez cet e-mail car vous avez demandé une alerte de prix pour ce produit sur football-cult.com.\nSe désinscrire : ${a.unsub}`,
  },
  it: {
    confirmSubject: "Conferma il tuo avviso di prezzo",
    confirmBody: (link, p) =>
      `Hai chiesto di essere avvisato via email quando il prezzo di questo prodotto scende su Football Cult (${p}).\n\nPer attivare l'avviso, conferma qui:\n${link}\n\nSe non sei stato tu, ignora questo messaggio: non ti scriveremo più.`,
    alertSubject: (name) => `Prezzo sceso: ${name}`,
    alertBody: (a) =>
      `Il prezzo di ${a.name} è sceso da ${a.from} a ${a.to} su ${a.store}.\n\nVedi: ${a.url}\n\n--\nRicevi questa email perché hai chiesto un avviso di prezzo per questo prodotto su football-cult.com.\nCancellati: ${a.unsub}`,
  },
};
