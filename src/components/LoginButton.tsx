"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Portal from "./Portal";
import SignInOptions from "./SignInOptions";

export default function LoginButton() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.login}
        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full sm:h-9 sm:w-9 text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            fill
            sizes="36px"
            className="object-cover"
          />
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
          <div className="solid-panel fixed right-3 top-14 z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#C9A24B]/25 p-4 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] sm:right-6 sm:top-16">
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
