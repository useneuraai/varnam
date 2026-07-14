"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/dashboard";

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            router.replace(next);
          }
        });
        
        // Timeout redirect if no session is captured
        const timeout = setTimeout(() => {
          router.replace("/login");
        }, 5000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      }
    };
    handleAuth();
  }, [next, router]);

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
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold animate-pulse">
            Loading...
          </p>
        </div>
      }>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
