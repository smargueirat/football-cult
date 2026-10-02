"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

// Reabre el panel de cookies (pie de página y política de privacidad).
export default function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      {label}
    </button>
  );
}
