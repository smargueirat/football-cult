// Remitente de todos los emails (login, contacto, reportes, alertas de
// precio). football-cult.com quedó VERIFICADO en Resend el 2026-09-21
// (DNS en Namecheap: DKIM + rsend/send + DMARC), así que ya se puede enviar
// a cualquier usuario. Antes era el remitente de prueba de Resend
// (onboarding@resend.dev), que solo entrega al dueño de la cuenta.
// RESEND_FROM permite cambiarlo desde Vercel sin tocar el código.
export const MAIL_FROM = process.env.RESEND_FROM || "Football Cult <contact@football-cult.com>";
