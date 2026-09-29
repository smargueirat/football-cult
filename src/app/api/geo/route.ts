import { NextResponse } from "next/server";
import { headers } from "next/headers";

// País del visitante, leído de la cabecera que pone el CDN: Cloudflare
// (cf-ipcountry) desde el 2026-09-29, que el sitio se sirve desde nuestra PC
// por un túnel; Vercel (x-vercel-ip-country) antes. Cloudflare usa "XX" para
// desconocido y "T1" para Tor: ninguno es un país.
//
// Antes esto lo resolvía el proxy, que corría en CADA request para dejar
// un cookie que solo lee el navegador -- o sea que se pagaba una función
// por cada visita de bot (que es casi todo el tráfico) para dejar un
// cookie que el bot nunca iba a leer. Desde Next 16 el proxy corre en el
// runtime de Node, no en el edge, así que eso se veía directo en Fluid
// Active CPU (193% del límite el 2026-09-24).
//
// Ahora lo pide el cliente una sola vez, y solo cuando no tiene ya el
// dato guardado: los bots no ejecutan JavaScript, así que no llaman acá
// nunca. Pasa de ~1 invocación por request a ~1 por visitante nuevo.
export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  const raw = h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? "";
  const country = raw === "XX" || raw === "T1" ? "" : raw;
  return NextResponse.json(
    { country },
    // Es específico de quien pregunta: nunca cachear en un CDN compartido.
    { headers: { "cache-control": "private, no-store" } },
  );
}
