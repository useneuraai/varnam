"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"magic-link" | "password">("magic-link");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check if already logged in, redirect to dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
      const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
      if (isMockSupabase) {
        console.log("[MOCK MODE] Simulating Google Login.");
        router.push(`/auth/callback?next=${encodeURIComponent(redirectTo)}`);
        return;
      }

      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to start Google sign-in.");
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

    try {
      if (isMockSupabase) {
        console.log("[MOCK MODE] Simulating Email Login.");
        router.push(`/auth/callback?next=${encodeURIComponent(redirectTo)}`);
        return;
      }

      if (loginMethod === "magic-link") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;
        setMessage("We've sent a magic login link to your email address! Please check your inbox.");
      } else {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            },
          });
          if (error) throw error;
          setMessage("Account created! Please check your email for confirmation link or sign in.");
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          router.replace(redirectTo);
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <Link
        href="/templates"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Templates
      </Link>

      {/* Main card */}
      <div className="bg-white border border-zinc-150 p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <span className="font-sans text-xs tracking-widest text-[#b3811b] font-bold block mb-1">
              WELCOME TO VARNAM
            </span>
            <h1 className="font-sans text-2xl font-black tracking-widest text-zinc-900">
              SIGN IN
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-sans">
              Access your wedding invitations, timelines, RSVPs, and payments.
            </p>
          </div>

          {/* Error and Info Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide leading-relaxed flex gap-2.5 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs tracking-wide leading-relaxed flex gap-2.5 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Social Google Login Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-800 text-xs uppercase font-bold tracking-wider py-3.5 px-4 rounded-xl transition-all duration-300 shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
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
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] bg-zinc-200 flex-1" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">OR</span>
            <div className="h-[1px] bg-zinc-200 flex-1" />
          </div>

          {/* Tab Switchers */}
          <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("magic-link");
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-2 font-montserrat text-[10px] tracking-wider uppercase font-bold rounded-xl transition-all cursor-pointer ${
                loginMethod === "magic-link"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-2 font-montserrat text-[10px] tracking-wider uppercase font-bold rounded-xl transition-all cursor-pointer ${
                loginMethod === "password"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Password
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-montserrat text-[9px] tracking-widest uppercase text-zinc-500 font-bold">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-zinc-200 text-zinc-800 text-xs px-10 py-3 rounded-xl focus:border-zinc-900 focus:outline-none transition-colors placeholder-zinc-400"
                />
                <Mail className="w-4 h-4 text-zinc-450 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {loginMethod === "password" && (
              <div className="flex flex-col gap-1.5">
                <label className="font-montserrat text-[9px] tracking-widest uppercase text-zinc-500 font-bold flex justify-between">
                  <span>Password</span>
                </label>
                <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-zinc-800 text-xs px-10 py-3 rounded-xl focus:border-zinc-900 focus:outline-none transition-colors placeholder-zinc-400"
                    />
                  <Lock className="w-4 h-4 text-zinc-450 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {loginMethod === "password" && (
              <div className="flex items-center justify-end text-[10px] font-bold text-[#b3811b] hover:text-[#c59b27] transition-colors">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="cursor-pointer uppercase tracking-wider"
                >
                  {isSignUp ? "Need to Sign In?" : "Create an Account?"}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs uppercase font-bold tracking-widest py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : loginMethod === "magic-link" ? (
                "Send Login Link"
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] flex items-center justify-center px-6 py-12 font-sans selection:bg-gold-200 selection:text-black">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold animate-pulse">
            Loading sign in...
          </p>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}
