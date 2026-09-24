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
// Un mail alcanza. Antes esto exigía sesión iniciada (401 sin ella), así
// que para pedir "avisame si baja" había que crearse una cuenta: la
// fricción más cara del sitio para la función que más retiene. Ahora la
// sesión sigue valiendo si existe (y es el camino de favoritos), pero
// quien no la tiene puede dejar su mail y listo.
//
// Contrapartida asumida: sin doble opt-in, alguien podría dar de alta el
// mail de otro. El daño máximo es un aviso de bajada de precio no pedido,
// con su enlace para darse de baja. Si alguna vez se abusa, el paso
// siguiente es el mail de confirmación -- no volver a exigir cuenta.
const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { productId?: string; subscribe?: boolean; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { productId, subscribe } = body;
  if (!productId || typeof subscribe !== "boolean") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // La sesión manda sobre lo que venga en el cuerpo: si hay usuario
  // identificado, nadie puede dar de alta un mail ajeno desde su sesión.
  const session = await auth();
  const typed = body.email?.trim().toLowerCase();
  const email =
    session?.user?.email ?? (typed && EMAIL_RE.test(typed) ? typed : undefined);
  if (!email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
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
