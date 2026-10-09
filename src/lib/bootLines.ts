// Líneas de modelo de bota (Mercurial, Predator, Copa...) y edad. Sin datos:
// se puede importar desde componentes de cliente (SearchExplorer) sin
// arrastrar el catálogo (ver el comentario largo de src/lib/offerMoney.ts).
//
// La línea sale del nombre real que publica la tienda; solo cuenta si la
// marca coincide (un "Copa" de otra marca no es la Copa de adidas). Las
// sublíneas (Superfly, Vapor) tienen `parent`: una Superfly está en su hub y
// también en el de Mercurial.

export interface BootLine {
  slug: string;
  /** Slug de marca, como en /botas/marca/[brand] (gearHubs.slugify). */
  brand: string;
  name: string;
  re: RegExp;
  parent?: string;
}

export const BOOT_LINES: BootLine[] = [
  { slug: "mercurial", brand: "nike", name: "Nike Mercurial", re: /\bmercurial\b|\bsuperfly\b|\bvapor\b/i },
  { slug: "mercurial-superfly", brand: "nike", name: "Nike Mercurial Superfly", re: /\bsuperfly\b/i, parent: "mercurial" },
  { slug: "mercurial-vapor", brand: "nike", name: "Nike Mercurial Vapor", re: /\bvapor\b/i, parent: "mercurial" },
  { slug: "phantom", brand: "nike", name: "Nike Phantom", re: /\bphantom\b/i },
  { slug: "tiempo", brand: "nike", name: "Nike Tiempo", re: /\btiempo\b/i },
  { slug: "predator", brand: "adidas", name: "adidas Predator", re: /\bpredator\b/i },
  { slug: "copa", brand: "adidas", name: "adidas Copa", re: /\bcopa\b/i },
  { slug: "f50", brand: "adidas", name: "adidas F50", re: /\bf50\b/i },
  { slug: "x", brand: "adidas", name: "adidas X", re: /\bx[ _]?(crazyfast|speedportal|speedflow|ghosted|crazy)/i },
  { slug: "future", brand: "puma", name: "Puma Future", re: /\bfuture\b/i },
  { slug: "ultra", brand: "puma", name: "Puma Ultra", re: /\bultra\b/i },
  { slug: "king", brand: "puma", name: "Puma King", re: /\bking\b/i },
  { slug: "morelia", brand: "mizuno", name: "Mizuno Morelia", re: /\bmorelia\b/i },
  { slug: "alpha", brand: "mizuno", name: "Mizuno Alpha", re: /\balpha\b/i },
  { slug: "furon", brand: "new-balance", name: "New Balance Furon", re: /\bfuron\b/i },
  { slug: "tekela", brand: "new-balance", name: "New Balance Tekela", re: /\btekela\b/i },
  { slug: "442", brand: "new-balance", name: "New Balance 442", re: /\b442\b/i },
];

export const bootLineBySlug = (slug: string) => BOOT_LINES.find((l) => l.slug === slug);

const brandSlug = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Slugs de las líneas a las que pertenece la bota (puede ser más de una:
 *  "mercurial" y "mercurial-superfly"). */
export function bootLinesOf(b: { brand: string; model: string }): string[] {
  const bs = brandSlug(b.brand);
  return BOOT_LINES.filter((l) => l.brand === bs && l.re.test(b.model)).map((l) => l.slug);
}

/** Bota de niño (campo `ageGroup` que pone el minado, ver mine_boots.py). El
 *  tipo estructural acepta BootProduct con o sin ese campo declarado. */
export const isKidsBoot = (b: { id: string; ageGroup?: string }) => b.ageGroup === "kids";
