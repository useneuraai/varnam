"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Check,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Send,
  UserCheck
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMethod, setAuthMethod] = useState<"password" | "magic_link">("password");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // Handle Email + Password Login or Sign Up
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!isSupabaseConfigured) {
        console.log("[MOCK MODE] Simulating Email Login.");
        setTimeout(() => {
          router.replace(redirectTo);
        }, 600);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${getRedirectOrigin()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.replace(redirectTo);
        } else {
          setSuccessMessage(
            "Account created! We have sent a confirmation link to your email. Please check your inbox to activate your account."
          );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.replace(redirectTo);
        }
      }
    } catch (err: any) {
      console.error("Email auth error:", err);
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password-Free Magic Link Login
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!isSupabaseConfigured) {
        console.log("[MOCK MODE] Simulating Magic Link Login.");
        setTimeout(() => {
          router.replace(redirectTo);
        }, 600);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${getRedirectOrigin()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;

      setSuccessMessage("Magic link sent! Check your email inbox to log in with one click.");
    } catch (err: any) {
      console.error("Magic link error:", err);
      setError(err.message || "Failed to send magic link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
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
    <div className="w-full max-w-[460px] relative z-10 px-2 sm:px-0">
      {/* Back Link */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors group py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <Link
          href="/templates"
          className="text-xs font-bold uppercase tracking-wider text-[#916710] hover:text-[#72510b] transition-colors py-1"
        >
          Browse Templates
        </Link>
      </div>

      {/* Luxury Glass Card */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-[#eed57c]/40 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-[0_24px_60px_-15px_rgba(212,163,37,0.12),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Top Gold Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#eed57c] via-[#b3811b] to-[#eed57c]" />

        {/* Ambient Warm Sheen */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-100/35 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-orange-100/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Brand Logo */}
          <Link href="/" className="group mb-4 flex flex-col items-center">
            <div className="relative p-2 rounded-2xl bg-gradient-to-b from-[#fff9f0] to-[#fffdfa] border border-[#eed57c]/50 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png?v=lotus-gold"
                alt="Varnam Invites"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_2px_12px_rgba(212,163,37,0.3)]"
              />
            </div>
            <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.22em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent mt-2.5">
              VARNAM
            </span>
          </Link>

          {/* Heading */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fff9f2] border border-[#eed57c]/40 text-[#916710] text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3 text-[#d4a325]" />
            Wedding Studio Access
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 tracking-tight leading-snug mb-1.5">
            {isSignUp ? "Create Your Studio Account" : "Sign In to Your Studio"}
          </h1>
          <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mb-6 font-normal">
            {isSignUp
              ? "Join Varnam to create luxury digital wedding invitations and collect RSVPs."
              : "Access your saved wedding drafts, guest RSVPs, and payments."}
          </p>

          {/* Error Alert */}
          {error && (
            <div className="w-full mb-5 p-3.5 bg-red-50/95 border border-red-200 text-red-700 text-xs text-left leading-relaxed flex items-start gap-2.5 rounded-2xl animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="w-full mb-5 p-3.5 bg-emerald-50/95 border border-emerald-200 text-emerald-800 text-xs text-left leading-relaxed flex items-start gap-2.5 rounded-2xl animate-in fade-in duration-200">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* EMAIL LOGIN FORM */}
          {/* ========================================================================= */}
          <div className="w-full text-left mb-6">
            {authMethod === "password" ? (
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-3.5">
                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 focus:border-[#b3811b] focus:ring-2 focus:ring-[#eed57c]/30 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setAuthMethod("magic_link")}
                        className="text-[10px] text-[#916710] hover:text-[#72510b] font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      className="w-full pl-10 pr-10 py-3 bg-white border border-zinc-200 focus:border-[#b3811b] focus:ring-2 focus:ring-[#eed57c]/30 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Email Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-850 active:scale-[0.99] text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isSignUp ? "Create Studio Account" : "Sign In with Email"}</span>
                  )}
                </button>
              </form>
            ) : (
              /* Password-Free Magic Link Form */
              <form onSubmit={handleMagicLinkSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address for Magic Link
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 focus:border-[#b3811b] focus:ring-2 focus:ring-[#eed57c]/30 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5 leading-normal">
                    We will send a one-click login link to your email. No password needed!
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-850 active:scale-[0.99] text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Magic Sign-In Link</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Mode switchers */}
            <div className="flex items-center justify-between text-[11.5px] mt-4 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setIsSignUp(!isSignUp);
                }}
                className="text-zinc-600 hover:text-zinc-950 font-medium transition-colors cursor-pointer"
              >
                {isSignUp ? (
                  <>
                    Already have an account? <strong className="text-[#916710]">Sign In</strong>
                  </>
                ) : (
                  <>
                    New to Varnam? <strong className="text-[#916710]">Sign Up</strong>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setAuthMethod(authMethod === "password" ? "magic_link" : "password");
                }}
                className="text-[#916710] hover:text-[#72510b] font-medium transition-colors cursor-pointer"
              >
                {authMethod === "password" ? "Use Magic Link" : "Use Password"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 mb-6">
            <div className="flex-grow h-px bg-zinc-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow h-px bg-zinc-200" />
          </div>

          {/* Google Sign In Button - Warm Royal Gold Accent */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full relative py-3.5 px-5 bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] hover:brightness-105 active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(212,163,37,0.3)] hover:shadow-[0_6px_22px_rgba(212,163,37,0.4)] border border-[#eed57c] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {/* Google 'G' Multi-color SVG */}
            <span className="w-5 h-5 rounded-md bg-white flex items-center justify-center p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span className="text-white drop-shadow-xs">Continue with Google</span>
          </button>

          {/* Value Assurances */}
          <div className="w-full mt-6 pt-5 border-t border-zinc-200/70 flex flex-col gap-2.5 text-left">
            <div className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-zinc-700 text-xs font-medium">Auto-saves wedding drafts & RSVP guest counts</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium">
              <div className="w-4 h-4 rounded-full bg-amber-100 text-[#916710] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span className="text-zinc-700 text-xs font-medium">256-bit SSL encrypted secure authentication</span>
            </div>
          </div>

          {/* Legal note */}
          <p className="mt-6 text-[11px] text-zinc-500 leading-relaxed max-w-xs">
            By signing in, you agree to Varnam Invites&apos;{" "}
            <Link href="/terms-of-service" className="underline text-zinc-700 hover:text-zinc-950 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline text-zinc-700 hover:text-zinc-950 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-zinc-800 relative flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 font-sans selection:bg-gold-200 selection:text-black overflow-hidden">
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
