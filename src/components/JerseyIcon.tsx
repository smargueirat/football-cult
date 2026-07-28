export default function JerseyIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        d="M35,8 L20,20 L8,34 L20,46 L26,40 L26,90 L74,90 L74,40 L80,46 L92,34 L80,20 L65,8 C65,8 58,15 50,15 C42,15 35,8 35,8 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  );
}
