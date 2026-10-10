"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ArrowLeft, AlertCircle, ShieldCheck, Check, Sparkles } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRedirectOrigin = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      if (!window.location.origin.includes("localhost") && !window.location.origin.includes("127.0.0.1")) {
        return window.location.origin;
      }
    }
    return process.env.NEXT_PUBLIC_SITE_URL || "https://www.varnaminvites.store";
  };

  // If already logged in, redirect to dashboard or intended target
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace(redirectTo);
      }
    };
    checkUser();
  }, [redirectTo, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        console.log("[MOCK MODE] Simulating Google Login.");
        router.push(`/auth/callback?next=${encodeURIComponent(redirectTo)}`);
        return;
      }

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("auth_redirect_to", redirectTo);
          localStorage.setItem("auth_redirect_to", redirectTo);
        } catch (_) {}
      }

      const redirectUrl = `${getRedirectOrigin()}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to start Google sign-in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] relative z-10">
      {/* Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <Link
          href="/templates"
          className="text-xs font-bold uppercase tracking-wider text-[#916710] hover:text-[#72510b] transition-colors"
        >
          Browse Templates
        </Link>
      </div>

      {/* Luxury Glass Card */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-[#eed57c]/40 rounded-[28px] sm:rounded-[32px] p-8 sm:p-11 shadow-[0_24px_60px_-15px_rgba(212,163,37,0.12),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Subtle Top Gold Decorative Gradient Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#eed57c] via-[#b3811b] to-[#eed57c]" />

        {/* Ambient Warm Corner Sheen */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-100/35 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-orange-100/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Brand Logo with Gold Drop Shadow */}
          <Link href="/" className="group mb-5 flex flex-col items-center">
            <div className="relative p-2 rounded-2xl bg-gradient-to-b from-[#fff9f0] to-[#fffdfa] border border-[#eed57c]/50 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png?v=lotus-gold"
                alt="Varnam Invites"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_2px_12px_rgba(212,163,37,0.3)]"
              />
            </div>
            <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.22em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent mt-3">
              VARNAM
            </span>
          </Link>

          {/* Heading & Subtitle */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff9f2] border border-[#eed57c]/40 text-[#916710] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-[#d4a325]" />
            Wedding Studio Access
          </div>

          <h1 className="text-2xl sm:text-[1.75rem] font-bold font-serif text-zinc-900 tracking-tight leading-snug mb-2.5">
            Sign In to Your Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm mb-8 font-normal">
            Access your personalized wedding templates, live RSVP attendance tracker, and custom audio players in one place.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="w-full mb-6 p-4 bg-red-50/90 border border-red-200 text-red-700 text-xs text-left leading-relaxed flex items-start gap-3 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full relative py-4 px-6 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg border border-[#eed57c]/40 hover:border-[#eed57c] flex items-center justify-center gap-3.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#eed57c] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#eed57c]">Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Official Google 'G' Multi-color SVG */}
                <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center p-1 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.48 3.77v3.13h4.01c2.34-2.16 3.68-5.32 3.68-8.75z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.13c-1.12.75-2.55 1.19-3.92 1.19-3.02 0-5.58-2.04-6.49-4.79H1.4v3.25C3.39 21.56 7.42 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.51 14.36A7.16 7.16 0 0 1 5.12 12c0-.82.14-1.62.39-2.36V6.39H1.4a11.94 11.94 0 0 0 0 11.22l4.11-3.25z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.42 0 3.39 2.44 1.4 6.39l4.11 3.25c.91-2.75 3.47-4.79 6.49-4.79z"
                    />
                  </svg>
                </span>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Value Assurances */}
          <div className="w-full mt-8 pt-6 border-t border-zinc-100 flex flex-col gap-2.5 text-left">
            <div className="flex items-center gap-2.5 text-xs text-zinc-650 font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span>One-click sign in — no password to memorize</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-650 font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span>Auto-saves drafts, guest RSVPs, and payments</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-650 font-medium">
              <div className="w-4 h-4 rounded-full bg-amber-50 text-[#916710] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span>256-bit encrypted authentication by Google</span>
            </div>
          </div>

          {/* Legal note */}
          <p className="mt-8 text-[11px] text-zinc-400 leading-relaxed max-w-xs">
            By signing in, you agree to Varnam Invites&apos;{" "}
            <Link href="/terms-of-service" className="underline hover:text-zinc-700 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline hover:text-zinc-700 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] relative flex items-center justify-center px-4 sm:px-6 py-12 font-sans selection:bg-gold-200 selection:text-black overflow-hidden">
      {/* Warm Ambient Luxury Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/40 via-orange-50/15 to-transparent blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#916710] font-bold animate-pulse">
              Loading Wedding Studio...
            </p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
