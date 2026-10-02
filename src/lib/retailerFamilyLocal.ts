// TODO: reemplazar por src/lib/retailerFamily.ts cuando ese módulo exista (otro agente lo exporta).
//
// Mínimo local: "FootStoreES"/"FootStoreFR", "eBay GB"/"eBay IT" o
// "Pro:Direct ES"/"Pro:Direct Soccer" son la misma empresa vendiendo desde
// espejos por país, no dos tiendas distintas. Quitar el sufijo de país
// alcanza para las que hoy hay en el catálogo.
export function retailerFamilyLocal(store: string): string {
  const n = store.toLowerCase().replace(/[^a-z0-9]/g, "");
  const stripped = n.replace(/(soccer|es|fr|it|gb|uk|us|pt|de|ch|ar|cl|br|ie)$/, "");
  return stripped.length >= 4 ? stripped : n;
}
