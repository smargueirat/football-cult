// Datos del titular del sitio (LSSI-CE art. 10, RGPD art. 13). ÚNICO lugar
// donde viven: el aviso legal y la política de privacidad leen de acá.
//
// PENDIENTE_DUEÑO = dato que el dueño todavía no entregó. No se inventa
// nada: un campo pendiente NO se renderiza en producción (se oculta en vez
// de mostrar el marcador), y en desarrollo se ve el marcador para no
// olvidarlo. Para completar un dato, reemplazar el marcador por el valor.
export const PENDING = "PENDIENTE_DUEÑO";

export const LEGAL_ENTITY = {
  /** Persona física titular (autónomo en España). */
  name: "Santiago Margueirat",
  /** Nombre comercial / sitio. */
  brand: "Football Cult",
  domain: "football-cult.com",
  /** Mismo buzón que ya publica /contacto y que usa MAIL_FROM. */
  email: "contact@football-cult.com",
  /** NIF/DNI/NIE del titular. */
  nif: "Z0372360H",
  /** Domicilio completo (calle, CP, localidad, provincia, país). */
  address: "Agatha Christie 6, 28523 Rivas-Vaciamadrid (Madrid), España",
  /** Fecha de la última revisión de los textos legales. */
  updated: "2026-10-02",
} as const;

export type EntityField = "nif" | "address";

/** Valor listo para renderizar, o null si falta (producción oculta el campo). */
export function entityValue(field: EntityField): string | null {
  const v: string = LEGAL_ENTITY[field];
  if (v !== PENDING) return v;
  return process.env.NODE_ENV === "production" ? null : PENDING;
}
