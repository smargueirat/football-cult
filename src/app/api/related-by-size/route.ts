import { NextRequest, NextResponse } from "next/server";
import { CountryCode, countries } from "@/data/countries";
import { Size, availableSizesForCountry, products } from "@/data/products";

// "Otros productos que tengan esta talla" depende de una talla elegida
// EN VIVO por el usuario (después de cargar la página) y del país
// detectado en su navegador -- no es algo que se pueda precalcular una
// sola vez del lado del servidor como sameTeamProducts (ver
// page.tsx). Antes JerseyDetailClient.tsx importaba el array `products`
// entero para filtrarlo client-side ante cada cambio de talla -- mismo
// bug de bundling ya documentado en src/lib/offerMoney.ts, arrastraba
// el catálogo entero de camisetas al cliente solo por esto. Este
// endpoint corre del lado del servidor (nunca se manda al bundle) y
// hace exactamente el mismo filtro, pero solo cuando el usuario
// realmente elige una talla -- no en cada carga de página.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const size = searchParams.get("size") as Size | null;
  const country = searchParams.get("country") as CountryCode | null;

  if (!productId || !size || !country || !countries.some((c) => c.code === country)) {
    return NextResponse.json({ products: [] }, { status: 400 });
  }

  const related = products
    .filter((p) => p.id !== productId && availableSizesForCountry(p, country).includes(size))
    .slice(0, 10);

  return NextResponse.json({ products: related });
}
