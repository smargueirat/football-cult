"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Portal from "./Portal";

export default function LoginButton() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.login}
        className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full sm:h-9 sm:w-9 text-[#1a1a1a] transition-colors hover:bg-[#C9A24B]/10"
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
                <p className="text-xs text-[#8a7a5a]">{t.loginPanel.signedInAs}</p>
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
                <p className="mt-1 text-xs text-[#8a7a5a]">{t.loginPanel.text}</p>
                <button
                  onClick={() => signIn("google")}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B3B2B] py-2 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 40.5 16.2 45 24 45z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41 35.5 43 30.4 43 24c0-1.2-.1-2.3-.4-3.5z"
                    />
                  </svg>
                  {t.loginPanel.googleCta}
                </button>
              </>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}
