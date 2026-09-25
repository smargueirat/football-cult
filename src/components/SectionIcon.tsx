// Íconos de sección: lineales, de un solo trazo, sin relleno.
//
// Deliberadamente simples: se ven a 14px dentro de una píldora, así que
// cualquier detalle se pierde y solo ensucia. Usan currentColor para
// heredar el color de la píldora (verde sobre crema, crema sobre verde
// cuando está activa) sin tener que duplicar nada.
//
// El trazo redondeado y algo grueso es lo que les da el aire retro que
// pega con el resto del sitio, en vez del look de icono de sistema.

export type SectionIconName =
  | "all"
  | "jerseys"
  | "boots"
  | "gloves"
  | "balls"
  | "apparel"
  | "training"
  | "tickets";

const PATHS: Record<SectionIconName, React.ReactNode> = {
  // Rejilla: "todo", sin sugerir ningún producto en particular.
  all: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  // Camiseta con hombreras y cuello redondo.
  jerseys: (
    <>
      <path d="M9 3.5 4.5 5.5 3 10l3.5 1.3V20.5h11V11.3L21 10l-1.5-4.5L15 3.5" />
      <path d="M9 3.5a3 3 0 0 0 6 0" />
    </>
  ),
  // Bota de perfil, con los tapones marcados abajo.
  boots: (
    <>
      <path d="M3 8.5v7h10.5l5.5-2.2a2 2 0 0 0-1-3.8l-3.5.4-3-3.4z" />
      <path d="M5 15.5v2.5M9 15.5v2.5M13 15.5v2.5" />
    </>
  ),
  // Guante de arquero: palma y pulgar.
  gloves: (
    <>
      <path d="M7 20.5V9a2 2 0 0 1 4 0V4.5a1.8 1.8 0 0 1 3.5 0V9a2 2 0 0 1 3.5 1.4v4.2c0 3.3-2.4 5.9-5.5 5.9z" />
      <path d="M7 12.5 4.6 14a1.8 1.8 0 0 0-.5 2.6L7 20" />
    </>
  ),
  // Balón clásico: pentágono central y costuras.
  balls: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m12 7.5 3.4 2.5-1.3 4h-4.2l-1.3-4z" />
      <path d="M12 3.5v4M19 10l-3.6 0M16.8 18.4 14.1 14M7.2 18.4 9.9 14M5 10l3.6 0" />
    </>
  ),
  // Pantalón corto.
  apparel: (
    <>
      <path d="M4.5 4.5h15l1 15h-6l-2.5-8-2.5 8h-6z" />
      <path d="M4.5 8h15" />
    </>
  ),
  // Cono de entrenamiento.
  training: (
    <>
      <path d="M12 3.5 18.5 17h-13z" />
      <path d="M2.5 20.5h19" />
      <path d="M9.4 11h5.2" />
    </>
  ),
  // Entrada con los cortes laterales y la línea de troquelado.
  tickets: (
    <>
      <path d="M2.5 7.5h19v3a2 2 0 0 0 0 4v3h-19v-3a2 2 0 0 0 0-4z" />
      <path d="M14.5 8.5v1.5M14.5 12.5v1.5M14.5 16.5v-1.5" />
    </>
  ),
};

export default function SectionIcon({
  name,
  className = "",
}: {
  name: SectionIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
