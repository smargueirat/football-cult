export default function Chip({
  active,
  onClick,
  children,
  accent = "green",
  className = "",
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "green" | "amber";
  className?: string;
  // Tooltip nativo del navegador (atributo title de <button>) -- se usa
  // para el significado completo de cada tipo de tapón de bota (FG, AG,
  // etc.), sin agregar ningún componente/lib nueva para algo que el
  // navegador ya resuelve solo.
  title?: string;
}) {
  const activeClasses =
    accent === "green"
      ? "shadow-vintage-sm border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9]"
      : "shadow-vintage-sm border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] text-[#2A2410]";

  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? activeClasses
          : "border-[#C9A24B]/30 bg-[#FFFDF8] text-[#5b5442] hover:border-[#C9A24B]/70 hover:text-[#1a1a1a]"
      } ${className}`}
    >
      {children}
    </button>
  );
}
