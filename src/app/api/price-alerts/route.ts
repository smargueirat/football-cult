import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRedis, isRedisConfigured } from "@/lib/redis";

// Registro paralelo al de favoritos (que vive solo en el JWT, sin
// persistencia server-side -- ver comentario en FavoritesContext.tsx) que
// SÍ necesita ser consultable del lado del servidor: /api/cron/check-prices
// necesita poder preguntar "quién quiere que le avise si baja este
// producto" sin depender de que ese usuario tenga una sesión activa en ese
// momento. Un set de emails por producto en Redis alcanza para eso, no
// hace falta una tabla de suscripciones completa.
export async function POST(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { productId?: string; subscribe?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { productId, subscribe } = body;
  if (!productId || typeof subscribe !== "boolean") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Degrada en silencio si Redis todavía no está configurado en este
  // entorno (mismo criterio que /api/cron/check-prices) -- favoritos ya
  // se guardó bien igual, esto es solo el registro extra para poder
  // avisar por mail más adelante.
  if (!isRedisConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const redis = await getRedis();
  const key = `priceAlertSubscribers:${productId}`;
  if (subscribe) {
    await redis.sAdd(key, email);
  } else {
    await redis.sRem(key, email);
  }

  return NextResponse.json({ ok: true });
}
