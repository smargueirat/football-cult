// Remitente de todos los emails (login, contacto, reportes, alertas de
// precio). Por defecto el remitente de prueba de Resend, que SOLO entrega
// al dueño de la cuenta: para que lleguen a otros usuarios hay que verificar
// football-cult.com en Resend y setear RESEND_FROM en Vercel, p. ej.
// RESEND_FROM="Football Cult <hola@football-cult.com>".
export const MAIL_FROM = process.env.RESEND_FROM || "Football Cult <onboarding@resend.dev>";
