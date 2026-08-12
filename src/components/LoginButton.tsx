"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Portal from "./Portal";
import SignInOptions from "./SignInOptions";
import { useAnchoredDropdown } from "@/lib/useAnchoredDropdown";

export default function LoginButton() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const position = useAnchoredDropdown(buttonRef, open);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.login}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#1a1a1a] transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-[#C9A24B]/10 sm:h-9 sm:w-9"
      >
        {session?.user?.image ? (
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <Image
              src={session.user.image}
              alt={session.user.name ?? ""}
              fill
              sizes="36px"
              unoptimized
              className="object-cover"
            />
          </span>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            style={{ top: position?.top ?? 56, right: position?.right ?? 12 }}
            className="solid-panel fixed z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#C9A24B]/25 p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
          >
            {status === "authenticated" && session.user ? (
              <>
                <p className="text-xs text-[#675c44]">{t.loginPanel.signedInAs}</p>
                <p className="mt-0.5 truncate text-sm font-medium text-[#1a1a1a]">
                  {session.user.name ?? session.user.email}
                </p>
                <button
                  onClick={() => signOut()}
                  className="mt-3 w-full rounded-xl border border-[#C9A24B]/30 py-2 text-sm font-medium text-[#3a3a36] transition-colors hover:bg-[#C9A24B]/10"
                >
                  {t.loginPanel.signOut}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-[#1a1a1a]">{t.loginPanel.title}</p>
                <p className="mt-1 text-xs text-[#675c44]">{t.loginPanel.text}</p>
                <div className="mt-3">
                  <SignInOptions />
                </div>
              </>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}
