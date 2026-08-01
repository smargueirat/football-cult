export default function Chip({
  active,
  onClick,
  children,
  accent = "green",
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "green" | "amber";
  className?: string;
}) {
  const activeClasses =
    accent === "green"
      ? "border-[#1B3B2B] bg-[#1B3B2B] text-[#F3E9C9] shadow-sm"
      : "border-[#B8923F] bg-gradient-to-b from-[#E7C567] to-[#B8923F] text-[#2A2410] shadow-sm";

  return (
    <button
      onClick={onClick}
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
