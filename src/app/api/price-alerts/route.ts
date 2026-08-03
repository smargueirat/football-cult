import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@/auth";

// Guarda, por producto, el set de emails que quieren que les avisemos
// si baja el precio. Clave: alerts:{productId} -> Set<email>.
function alertsKey(productId: string) {
  return `alerts:${productId}`;
}

// El KV recién se crea del lado de Vercel; hasta que esté conectado,
// degradamos con gracia en vez de romper el resto del sitio.
function isKvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isKvConfigured()) {
    return NextResponse.json({ productIds: [] });
  }

  try {
    const keys = await kv.keys("alerts:*");
    const productIds: string[] = [];
    for (const key of keys) {
      const isMember = await kv.sismember(key, email);
      if (isMember) {
        productIds.push(key.replace("alerts:", ""));
      }
    }
    return NextResponse.json({ productIds });
  } catch {
    return NextResponse.json({ productIds: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isKvConfigured()) {
    return NextResponse.json({ error: "storage not configured yet" }, { status: 503 });
  }

  const { productId } = await req.json();
  if (!productId || typeof productId !== "string") {
    return NextResponse.json({ error: "invalid productId" }, { status: 400 });
  }

  const key = alertsKey(productId);
  const isMember = await kv.sismember(key, email);
  if (isMember) {
    await kv.srem(key, email);
  } else {
    await kv.sadd(key, email);
  }

  return NextResponse.json({ active: !isMember });
}
