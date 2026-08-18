// Bucketea el colorHex (RGB libre, ~5400 valores distintos en el catálogo)
// en un puñado de colores con nombre para poder filtrar por color. No usa
// colorHexSecondary -- el pedido fue por el color PRINCIPAL de la camiseta.
export type ColorKey =
  | "black"
  | "white"
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "navy"
  | "purple"
  | "pink";

export const COLOR_ORDER: ColorKey[] = [
  "black",
  "white",
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "navy",
  "purple",
  "pink",
];

// Un hex representativo por bucket, para pintar el punto de color en el chip
// del filtro (no es el hex real de ningún producto en particular).
export const COLOR_SWATCH: Record<ColorKey, string> = {
  black: "#161616",
  white: "#f5f5f0",
  gray: "#8a8a86",
  red: "#D62828",
  orange: "#E07A2C",
  yellow: "#E8C332",
  green: "#2E7D46",
  teal: "#1CA893",
  blue: "#3C8FD6",
  navy: "#1B2A5B",
  purple: "#7B4FA0",
  pink: "#D66BA0",
};

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    default:
      h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

export function classifyColor(hex: string): ColorKey {
  if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) return "gray";
  const { h, s, l } = hexToHsl(hex);

  if (l > 0.92) return "white";
  if (l < 0.13) return "black";
  if (s < 0.15) return "gray";

  if (h >= 185 && h < 255) {
    // Dentro del rango de azules, separamos "celeste" (claro/vivo) de
    // "azul marino" (oscuro/apagado) -- son colores de club muy distintos
    // (ej. Argentina/Manchester City vs Boca/Newell's).
    return l < 0.32 ? "navy" : "blue";
  }
  if (h < 15 || h >= 345) return "red";
  if (h < 45) return "orange";
  if (h < 65) return "yellow";
  if (h < 160) return "green";
  if (h < 185) return "teal";
  if (h < 290) return "purple";
  return "pink";
}
