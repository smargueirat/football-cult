// Tipo de tapón/suela de la bota -- pedido explícito del usuario, con
// las denominaciones y el significado real de cada una, transcriptos de
// su planilla de referencia (Comparativa_Gamas_Botines_Futbol, pestaña
// "Guía de Suelas y Materiales", sección 1: CLASIFICACIÓN DE SUELAS Y
// COMPATIBILIDAD CON EL TERRENO DE JUEGO). boot.groundType ya viene
// calculado desde el mining (scripts/catalog-mining, frase real del
// nombre/descripción del producto -- "césped natural seco" -> FG, etc.),
// esto solo define qué códigos mostrar como filtro y su texto.
//
// "AG-PRO" (variante Nike, placa más rígida para sintético de nivel
// profesional) y combos reales como "FG/AG"/"FG/MG" (bota homologada
// para más de un terreno) no tienen su propio chip -- se agrupan bajo
// el código base (bootMatchesGroundType hace match por segmento
// separado por "/", más un prefijo "AG-" para "AG-PRO"), evitar
// fragmentar el filtro por un puñado de productos.
export type BootGroundType = "FG" | "AG" | "SG" | "TF" | "MG";

export const BOOT_GROUND_TYPE_ORDER: BootGroundType[] = ["FG", "AG", "SG", "TF", "MG"];

export const BOOT_GROUND_TYPE_INFO: Record<BootGroundType, { label: string; description: string }> = {
  FG: {
    label: "FG · Firme",
    description:
      "Firm Ground (Terreno Firme): césped natural seco o ligeramente húmedo y compacto.",
  },
  AG: {
    label: "AG · Sintético",
    description: "Artificial Grass (Césped Sintético): césped artificial moderno (3G/4G).",
  },
  SG: {
    label: "SG · Blando",
    description:
      "Soft Ground (Terreno Blando): césped natural muy mojado, embarrado o con barro abundante.",
  },
  TF: {
    label: "TF · Turf/Moqueta",
    description:
      "Turf / Moqueta: moqueta sintética, cemento pulido o campos de tierra dura.",
  },
  MG: {
    label: "MG · Múltiple",
    description:
      "Multi-Ground (Terreno Múltiple): híbrido de césped natural duro y césped artificial.",
  },
};

export function bootMatchesGroundType(groundType: string, code: BootGroundType): boolean {
  return groundType
    .split("/")
    .some((segment) => segment === code || segment.startsWith(`${code}-`));
}
