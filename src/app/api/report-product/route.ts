import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const REASON_LABELS: Record<string, string> = {
  wrongPhoto: "La foto no corresponde",
  wrongPrice: "El precio está mal",
  wrongName: "El nombre o equipo está mal",
  brokenLink: "El link a la tienda no funciona",
  other: "Otro",
};

// Basic anti-spam: cap request size and require the fields to be
// present and plausible, since this endpoint has no auth (reporting
// shouldn't require creating an account).
const MAX_DETAILS_LENGTH = 2000;

export async function POST(req: NextRequest) {
  let body: {
    productId?: string;
    productUrl?: string;
    reason?: string;
    details?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { productId, productUrl, reason, details } = body;
  if (!productId || !reason || !REASON_LABELS[reason]) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (details && details.length > MAX_DETAILS_LENGTH) {
    return NextResponse.json({ error: "details_too_long" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REPORT_EMAIL_TO;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const reasonLabel = REASON_LABELS[reason];
  const detailsText = details?.trim() || "(sin detalle adicional)";

  try {
    await resend.emails.send({
      from: "Football Cult <reportes@football-cult.com>",
      to,
      subject: `Reporte de producto: ${productId}`,
      text: [
        `Producto: ${productId}`,
        `URL: ${productUrl ?? "(no disponible)"}`,
        `Motivo: ${reasonLabel}`,
        ``,
        `Detalle:`,
        detailsText,
      ].join("\n"),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "send_failed", message: (err as Error).message },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
