"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Wand2, Smartphone, Tablet, Monitor, Sparkles } from "lucide-react";
import { getTemplateBySlug, getDefaultTemplateData } from "@/lib/templates";
import { templatesMap } from "@/templates";
import MusicToggle from "@/components/animations/MusicToggle";
import DoorReveal from "@/components/animations/DoorReveal";

interface TemplatePreviewClientProps {
  slug: string;
}

export default function TemplatePreviewClient({ slug }: TemplatePreviewClientProps) {
  const router = useRouter();
  const template = getTemplateBySlug(slug);

  // Invitation Card Opening Animation States
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  // Client device classification:
  // "mobile": phone (< 768px)
  // "tablet": tab (768px - 1023px)
  // "laptop": laptop / desktop (>= 1024px)
  const [clientType, setClientType] = useState<"mobile" | "tablet" | "laptop">("laptop");
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if the user already watched the card opening animation in this session
    try {
      const storageKey = `invitation_opened_${slug}`;
      const isAlreadyOpened = sessionStorage.getItem(storageKey) === "true";
      const isReplayRequested =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("replay") === "1";

      if (isAlreadyOpened && !isReplayRequested) {
        setIsDoorOpened(true);
      } else {
        setIsDoorOpened(false);
      }
    } catch (e) {
      console.warn("Session storage check error:", e);
    } finally {
      setHasCheckedSession(true);
    }

    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setClientType("mobile");
        setDevice("mobile");
      } else if (width < 1024) {
        setClientType("tablet");
        setDevice("tablet");
      } else {
        setClientType("laptop");
        // On laptop, default to desktop (or preserve choice)
      }
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, [slug]);

  const handleDoorOpen = () => {
    setIsDoorOpened(true);
    try {
      sessionStorage.setItem(`invitation_opened_${slug}`, "true");
    } catch (e) {
      console.warn("Failed to set session storage:", e);
    }
  };

  const handleReplayCard = () => {
    try {
      sessionStorage.removeItem(`invitation_opened_${slug}`);
    } catch (e) {}
    setIsDoorOpened(false);
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-white text-zinc-800 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-4">Template Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The template you are trying to preview does not exist.</p>
        <Link
          href="/templates"
          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest font-bold uppercase rounded-full"
        >
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  const TemplateComponent = templatesMap[slug];
  const demoData = getDefaultTemplateData(slug);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-white text-zinc-800 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-4">Component Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The render engine for this template is currently under maintenance.</p>
        <Link
          href="/templates"
          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest font-bold uppercase rounded-full"
        >
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 overflow-x-hidden">
      {/* Floating Header Control Bar */}
      <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl bg-white/95 backdrop-blur-md border border-zinc-200/60 px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-lg rounded-full">
        {/* Left Side: Back + Template Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors rounded-full"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex flex-col">
            <span suppressHydrationWarning className="text-xs sm:text-sm text-zinc-800 font-bold tracking-tight line-clamp-1">
              {template.name}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest text-zinc-400 uppercase font-bold">
              {clientType === "mobile"
                ? "MOBILE PREVIEW"
                : clientType === "tablet"
                ? "TABLET PREVIEW"
                : "LIVE PREVIEW"}
            </span>
          </div>
        </div>

        {/* Device Switcher Ports:
            STRICT REQUIREMENT: ONLY shown in laptop/desktop mode (>= 1024px).
            On phone (< 768px): completely removed, phone view only.
            On tablet (768px - 1023px): completely removed, tablet view only. */}
        {mounted && clientType === "laptop" && (
          <div className="hidden lg:flex items-center gap-1 bg-zinc-50 border border-zinc-200/60 p-1 rounded-full shadow-inner">
            {[
              { mode: "mobile", icon: Smartphone, label: "Mobile" },
              { mode: "tablet", icon: Tablet, label: "Tablet" },
              { mode: "desktop", icon: Monitor, label: "Desktop" },
            ].map((item) => {
              const Icon = item.icon;
              const active = device === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setDevice(item.mode as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] uppercase tracking-wider transition-all duration-300 rounded-full cursor-pointer ${
                    active
                      ? "bg-zinc-900 text-white font-bold shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Side: Replay Card + Price + CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Replay Card Button */}
          <button
            onClick={handleReplayCard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-wider text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-full transition-all duration-300 font-bold shadow-sm cursor-pointer"
            title="Replay Invitation Card Opening"
            id="replay-card-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xs:inline">REPLAY CARD</span>
            <span className="xs:hidden">CARD</span>
          </button>

          <span className="hidden sm:inline text-zinc-800 text-xs sm:text-sm font-bold">₹{template.price}</span>
          <Link
            href={`/editor/${template.slug}`}
            className="bg-zinc-900 text-white text-[9.5px] sm:text-xs tracking-widest uppercase font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 hover:bg-zinc-800 transition-all duration-300 flex items-center gap-1.5 rounded-full"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">USE TEMPLATE</span>
            <span className="xs:hidden">USE</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Template Content */}
      <main className="w-full min-h-screen pt-20 sm:pt-24 pb-12 flex items-center justify-center bg-transparent relative z-10">
        {/* CASE 1: Client is on a real Phone (< 768px):
            Full-width native mobile view without an artificial mockup bezel */}
        {clientType === "mobile" ? (
          <div className="w-full min-h-screen template-container preview-mode-mobile">
            <TemplateComponent data={demoData} />
          </div>
        ) : clientType === "tablet" ? (
          /* CASE 2: Client is on a real Tablet (768px - 1023px):
             Comfortable tablet-width presentation without simulated bezel */
          <div className="w-full min-h-screen template-container flex justify-center preview-mode-tablet tablet-view">
            <TemplateComponent data={demoData} />
          </div>
        ) : (
          /* CASE 3: Client is on Laptop/Desktop (>= 1024px):
             Can preview in Mobile mockup, Tablet mockup, or full Desktop */
          device === "desktop" ? (
            <div className="w-full min-h-screen template-container">
              <TemplateComponent data={demoData} />
            </div>
          ) : device === "tablet" ? (
            <div
              data-lenis-prevent
              className="w-full max-w-[768px] h-[85vh] bg-black border-[12px] border-zinc-800 rounded-[32px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] overflow-y-auto relative ring-1 ring-neutral-900/10 scrollbar-none preview-mode-tablet tablet-view"
            >
              <TemplateComponent data={demoData} />
            </div>
          ) : (
            <div
              data-lenis-prevent
              className="w-full max-w-[390px] h-[800px] bg-black border-[12px] border-zinc-800 rounded-[44px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] overflow-y-auto relative ring-1 ring-neutral-900/10 scrollbar-none preview-mode-mobile"
            >
              {/* Speaker/Camera notch for mobile simulation on laptop */}
              <div className="sticky top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-50 flex items-center justify-center pointer-events-none">
                <div className="w-3.5 h-1.5 bg-black rounded-full" />
              </div>
              <TemplateComponent data={demoData} />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-zinc-200/80 bg-white z-20 text-center flex flex-col items-center justify-center gap-3 relative">
        <p className="text-xs text-zinc-600">
          ✉ <a href="mailto:hello@varnaminvites.store" className="hover:text-zinc-950 transition-colors">hello@varnaminvites.store</a>
        </p>
        <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] tracking-wider text-zinc-600 font-bold uppercase justify-center">
          <Link href="/about" className="hover:text-zinc-950 transition-colors">About</Link>
          <span>·</span>
          <a href="mailto:hello@varnaminvites.store" className="hover:text-zinc-950 transition-colors">Contact</a>
          <span>·</span>
          <Link href="/terms-of-service" className="hover:text-zinc-950 transition-colors">Terms &amp; Conditions</Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/refund-policy" className="hover:text-zinc-950 transition-colors">Refund Policy</Link>
        </div>
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
        </p>
      </footer>

      {/* 3D Invitation Card Opening Reveal */}
      {hasCheckedSession && !isDoorOpened && (
        <DoorReveal
          brideName={demoData.bride_name}
          groomName={demoData.groom_name}
          templateSlug={slug}
          bgImageUrl={demoData.bg_image_url}
          onOpen={handleDoorOpen}
        />
      )}

      {/* Floating Ambient Music - Plays smoothly once card is unfolded */}
      {isDoorOpened && (
        <MusicToggle audioUrl={template.previewMusicUrl} autoPlay={true} />
      )}
    </div>
  );
}
