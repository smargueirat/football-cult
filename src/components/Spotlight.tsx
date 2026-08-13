// Brillo cálido que sigue al mouse dentro de la tarjeta -- pedido como
// alternativa liviana a un componente de escena 3D (Spline) que no
// pegaba con el sitio (no usa shadcn, y una escena 3D genérica no tiene
// nada que ver con la estética vintage de acá). En vez de traer
// framer-motion solo para esto, el padre (ProductCard3D, que ya
// escucha mousemove para la inclinación 3D) actualiza las variables
// CSS --spot-x/--spot-y/--spot-opacity; este componente solo las lee,
// mismo patrón sin librerías que ya usa el resto del sitio (tilt de
// las tarjetas, fondo del estadio).
export default function Spotlight({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${className}`}
      style={{
        opacity: "var(--spot-opacity, 0)",
        background:
          "radial-gradient(circle 180px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(231, 197, 103, 0.35), transparent 70%)",
      }}
    />
  );
}
