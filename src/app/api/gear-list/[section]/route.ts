import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { slimGear, type GearListSection } from "@/lib/gearList";

// Listado completo de cada sección de equipamiento, en versión liviana (ver
// gearListProps). JSON estático generado en el build; la URL lleva ?v= con
// un hash de los datos, así que el navegador lo guarda un año.
export const dynamic = "force-static";
export const dynamicParams = false;

const DATA = { ropa: apparelProducts, entrenamiento: trainingProducts, guantes: gloveProducts, pelotas: ballProducts };

export function generateStaticParams() {
  return Object.keys(DATA).map((section) => ({ section }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return Response.json(slimGear(DATA[section as GearListSection]), {
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
