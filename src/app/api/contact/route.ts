import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Mismo patrón que /api/report-product: sin auth (un formulario de
// contacto no debería exigir cuenta), así que el único resguardo real
// contra abuso es un tope de largo en los campos.
const MAX_MESSAGE_LENGTH = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REPORT_EMAIL_TO;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      // Mismo remitente sandbox que /api/report-product hasta que el
      // dominio football-cult.com esté verificado en Resend.
      from: "Football Cult <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Contacto: ${name}`,
      text: [`De: ${name} <${email}>`, ``, message].join("\n"),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "send_failed", message: (err as Error).message },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
