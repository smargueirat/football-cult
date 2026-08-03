import { NextRequest, NextResponse } from "next/server";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { auth } from "@/auth";

// Guarda, por producto, el set de emails que quieren que les avisemos
// si baja el precio. Clave: alerts:{productId} -> Set<email>.
function alertsKey(productId: string) {
  return `alerts:${productId}`;
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isRedisConfigured()) {
    return NextResponse.json({ productIds: [] });
  }

  try {
    const redis = await getRedis();
    const keys = await redis.keys("alerts:*");
    const productIds: string[] = [];
    for (const key of keys) {
      const isMember = await redis.sIsMember(key, email);
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
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: "storage not configured yet" }, { status: 503 });
  }

  const { productId } = await req.json();
  if (!productId || typeof productId !== "string") {
    return NextResponse.json({ error: "invalid productId" }, { status: 400 });
  }

  const redis = await getRedis();
  const key = alertsKey(productId);
  const isMember = await redis.sIsMember(key, email);
  if (isMember) {
    await redis.sRem(key, email);
  } else {
    await redis.sAdd(key, email);
  }

  return NextResponse.json({ active: !isMember });
}
