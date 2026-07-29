export default function Chip({
  active,
  onClick,
  children,
  accent = "green",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "green" | "amber";
}) {
  const activeClasses =
    accent === "green"
      ? "border-[#1F6F4C] bg-[#1F6F4C]/10 text-[#1F6F4C]"
      : "border-[#B45309] bg-[#B45309]/10 text-[#B45309]";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? activeClasses
          : "border-black/[0.08] bg-white text-[#5b5b57] hover:border-black/20 hover:text-[#1a1a1a]"
      }`}
    >
      {children}
    </button>
  );
}
