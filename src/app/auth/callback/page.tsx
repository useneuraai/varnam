"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/dashboard";

  useEffect(() => {
    let isSubscribed = true;

    const handleAuth = async () => {
      try {
        // 1. Direct session check
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session && isSubscribed) {
          router.replace(next);
          return;
        }

        // 2. Parse hash fragment if tokens were returned in hash (#access_token=...&refresh_token=...)
        if (typeof window !== "undefined" && window.location.hash) {
          const hashString = window.location.hash.startsWith("#")
            ? window.location.hash.substring(1)
            : window.location.hash;
          const hashParams = new URLSearchParams(hashString);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken) {
            const { data: tokenSession, error: tokenError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });

            if (!tokenError && tokenSession.session && isSubscribed) {
              router.replace(next);
              return;
            }
          }
        }

        // 3. Handle authorization code if returned in query (?code=...)
        const code = searchParams?.get("code");
        if (code) {
          const { data: codeSession, error: codeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (!codeError && codeSession.session && isSubscribed) {
            router.replace(next);
            return;
          }
        }

        // 4. Listen for auth state change
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session && isSubscribed) {
            router.replace(next);
          }
        });

        // 5. Fallback redirect
        const timeout = setTimeout(() => {
          if (isSubscribed) {
            router.replace(next);
          }
        }, 4000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      } catch (err) {
        console.error("Error processing auth callback:", err);
        if (isSubscribed) {
          router.replace("/login");
        }
      }
    };

    handleAuth();

    return () => {
      isSubscribed = false;
    };
  }, [next, router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold animate-pulse">
        Completing Sign In...
      </p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f3efe9] flex items-center justify-center font-sans text-neutral-850">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold animate-pulse">
              Loading...
            </p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
