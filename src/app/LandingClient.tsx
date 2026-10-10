"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, PanInfo } from "framer-motion";

const FAQSection = dynamic(() => import("@/components/FAQSection"), {
  ssr: true,
  loading: () => (
    <div className="py-24 text-center">
      <div className="w-6 h-6 rounded-full border-2 border-zinc-200 border-t-[#eed57c] animate-spin mx-auto" />
    </div>
  )
});
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Lock,
  ChevronDown,
  Check,
  Sliders,
  Layers,
  Send,
  Menu,
  X
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import LiveTemplatePreview from "@/components/LiveTemplatePreview";
import { supabase } from "@/lib/supabase";

// Helpers for the carousel indices
const getWrappedOffset = (index: number, activeIndex: number, total: number) => {
  let diff = index - activeIndex;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
};

const getCardStyles = (offset: number, isMobile: boolean) => {
  const scale = offset === 0 ? 1.0 : offset === 1 || offset === -1 ? 0.85 : 0.72;
  const opacity = offset === 0 ? 1.0 : offset === 1 || offset === -1 ? 0.95 : 0.85;
  const brightness = offset === 0 ? 1.0 : offset === 1 || offset === -1 ? 1.00 : 0.95;
  const grayscale = offset === 0 ? 0 : offset === 1 || offset === -1 ? 0.55 : 0.95;
  const rotate = offset === 0 ? 0 : offset === 1 ? 3 : offset === -1 ? -3 : 0;
  const zIndex = offset === 0 ? 30 : offset === 1 || offset === -1 ? 20 : 10;
  
  let x = 0;
  if (isMobile) {
    x = offset * 135; // Spacing for mobile
  } else {
    x = offset * 250; // Spacing for desktop
  }

  return {
    scale,
    opacity,
    rotate,
    zIndex,
    x,
    brightness,
    grayscale,
  };
};

const getCoupleName = (slug: string) => {
  switch (slug) {
    case "mayura-classic":
    case "peacock-classic":
    case "mayura-palace":
    case "palace-garden":
      return "Ananya & Siddharth";
    case "kamalam-kalyanam":
      return "Meenakshi & Sundar";
    case "kovil-thirumanam":
      return "Sriya & Karthik";
    case "kalyana-mandapam":
      return "Nila & Aravind";
    case "konaseema-kalyanam":
      return "Tejaswi & Aditya";
    case "theertha-mandapam":
    case "malligai-manam":
      return "Eleanor & Alexander";
    case "marigold-vizha":
    case "chettinad-rajamaligai":
      return "Victoria & Julian";
    case "kadhal-editorial":
    case "thanjavur-heritage":
      return "Clara & Sebastian";
    default:
      return "Meenakshi & Sundar";
  }
};

const getCategoryName = (template: any) => {
  switch (template.slug) {
    case "mayura-classic":
    case "peacock-classic":
      return "Royal Peacock Classic";
    case "mayura-palace":
    case "palace-garden":
      return "Royal Garden & Peacock";
    case "kamalam-kalyanam":
      return "Royal Lotus & Crimson";
    case "kovil-thirumanam":
      return "Temple Mandapam";
    case "kalyana-mandapam":
      return "Palace Mandapam";
    case "konaseema-kalyanam":
      return "River Heritage";
    case "theertha-mandapam":
    case "malligai-manam":
      return "Royal Swan & Lotus";
    case "marigold-vizha":
    case "chettinad-rajamaligai":
      return "Marigold Celebration";
    case "kadhal-editorial":
    case "thanjavur-heritage":
      return "Classical Melodies";
    default:
      return template.category || "Wedding Template";
  }
};

export default function LandingClient() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intercept OAuth hash tokens if redirected to root (e.g. from Supabase default site URL)
    if (typeof window !== "undefined" && window.location.hash && window.location.hash.includes("access_token")) {
      if (window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")) {
        window.location.replace(`https://www.varnaminvites.store/auth/callback${window.location.hash}`);
        return;
      }
      window.location.replace(`/auth/callback${window.location.hash}`);
      return;
    }

    setMounted(true);
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
    if (isMockSupabase) {
      setUser({ email: "demo.user@varnam.com" });
      return;
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        setWindowWidth(window.innerWidth);
      });
      const handleResize = () => {
        requestAnimationFrame(() => {
          setWindowWidth(window.innerWidth);
        });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TEMPLATES.length);
    }, 6000); // 6.0s balanced medium slideshow interval
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TEMPLATES.length);
  };

  const handleCardClick = (idx: number) => {
    setActiveIndex(idx);
  };

  return (
    <div className="relative min-h-screen bg-white text-zinc-800 flex flex-col selection:bg-gold-200 selection:text-black">
        
        {/* Premium Header */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 sm:gap-4 group">
              <img
                src="/logo.png?v=lotus-gold"
                alt="Varnam"
                className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_2px_10px_rgba(212,163,37,0.3)] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold tracking-[0.22em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                VARNAM
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-10 text-xs tracking-widest text-zinc-600 font-bold uppercase">
              <Link href="/templates" className="py-2.5 hover:text-zinc-950 transition-colors">TEMPLATES</Link>
              <a href="#how-it-works" className="py-2.5 hover:text-zinc-950 transition-colors">HOW IT WORKS</a>
              <a href="#why-choose" className="py-2.5 hover:text-zinc-950 transition-colors">WHY US</a>
              <a href="#faq" className="py-2.5 hover:text-zinc-950 transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                {mounted && user ? (
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 text-xs tracking-widest text-[#b3811b] hover:text-[#9a6f14] border border-[#eed57c] bg-[#fffcf9] hover:bg-[#fff9f2] transition-all duration-300 font-bold rounded-xl uppercase min-h-[40px] flex items-center"
                  >
                    My Studio
                  </Link>
                ) : mounted ? (
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-xs tracking-widest text-zinc-600 hover:text-zinc-950 transition-all duration-300 font-bold uppercase min-h-[40px] flex items-center"
                  >
                    Sign In
                  </Link>
                ) : (
                  <div className="w-14 h-4 bg-zinc-100 rounded animate-pulse" />
                )}
              </div>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 md:hidden text-zinc-800 hover:text-zinc-950 focus:outline-none transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile navigation dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-md absolute top-20 left-0 w-full shadow-lg z-50 flex flex-col px-6 py-6 gap-4 select-none">
              <Link
                href="/templates"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold tracking-wider text-zinc-800 py-2 border-b border-zinc-50"
              >
                TEMPLATES
              </Link>
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold tracking-wider text-zinc-800 py-2 border-b border-zinc-50"
              >
                HOW IT WORKS
              </a>
              <a
                href="#why-choose"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold tracking-wider text-zinc-800 py-2 border-b border-zinc-50"
              >
                WHY US
              </a>
              <a
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold tracking-wider text-zinc-800 py-2 border-b border-zinc-50"
              >
                FAQ
              </a>
              
              <div className="pt-2 flex flex-col gap-2">
                {mounted && user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-5 py-3 text-xs tracking-widest text-[#b3811b] border border-[#eed57c] bg-[#fffcf9] font-bold rounded-xl uppercase min-h-[44px] flex items-center justify-center"
                  >
                    My Studio
                  </Link>
                ) : mounted ? (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-5 py-3 text-xs tracking-widest text-zinc-800 border border-zinc-200 bg-zinc-50 font-bold rounded-xl uppercase min-h-[44px] flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                ) : (
                  <div className="w-full h-10 bg-zinc-100 rounded-xl animate-pulse" />
                )}
              </div>
            </div>
          )}
        </header>

        <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 pt-8 sm:pt-16 pb-8 sm:pb-12 overflow-hidden flex flex-col items-center justify-start text-center bg-white">
          {/* Subtle warm luxury ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] sm:h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-orange-50/15 to-transparent blur-3xl pointer-events-none -z-0" />

          <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10 select-text">
            <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-widest text-[#916710] mb-3 sm:mb-5">
              Varnam Invites • Premium Digital Wedding Invitations
            </p>
            
            <h1 className="text-[1.28rem] min-[360px]:text-[1.42rem] min-[390px]:text-[1.58rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-bold leading-[1.2] sm:leading-[1.12] text-zinc-900 tracking-tight mb-4 sm:mb-6 font-serif max-w-5xl">
              <span className="hidden sm:block sm:whitespace-nowrap">Premium Digital Wedding Invitations</span>
              <span className="hidden sm:block gold-gradient-text drop-shadow-sm mt-1 sm:mt-2 sm:whitespace-nowrap">Online in Minutes</span>

              <span className="block sm:hidden whitespace-nowrap">Premium Digital Wedding</span>
              <span className="block sm:hidden gold-gradient-text drop-shadow-sm mt-0.5 whitespace-nowrap">Invitations Online</span>
            </h1>

            {/* Subtitle: simple, clear copy that anyone can understand */}
            <p className="block sm:hidden text-zinc-600 text-[12px] min-[360px]:text-[13px] leading-[1.5] mb-5 font-normal max-w-sm mx-auto px-1">
              Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, and Google Maps venue navigation.
            </p>

            <p className="hidden sm:block max-w-3xl text-zinc-600 sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 font-normal">
              Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, and Google Maps venue navigation — ready to share in minutes.
            </p>

            <div className="inline-flex items-center justify-center text-[11px] sm:text-xs font-bold text-[#916710] bg-[#fff9f2] px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full sm:rounded-xl border border-[#eed57c]/35 mb-6 sm:mb-8 shadow-xs max-w-full">
              <span className="hidden sm:inline">Try before you pay — customize your invitation for free, with plans starting at ₹999!</span>
              <span className="inline sm:hidden whitespace-nowrap">Customize for free • Plans from ₹999!</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link
                href="/templates"
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white font-extrabold text-xs tracking-widest uppercase transition-all duration-200 border border-[#eed57c] shadow-sm min-w-0 sm:min-w-[210px] min-h-[46px] sm:min-h-[48px] flex items-center justify-center gap-2 group rounded-xl max-w-xs sm:max-w-none"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#eed57c]" />
              </Link>
              <Link
                href="/templates/kovil-thirumanam"
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 border border-zinc-300 hover:border-zinc-800 active:scale-[0.98] text-zinc-700 hover:bg-zinc-50 font-bold text-xs tracking-widest uppercase transition-all duration-200 min-w-0 sm:min-w-[210px] min-h-[46px] sm:min-h-[48px] flex items-center justify-center gap-2 rounded-xl max-w-xs sm:max-w-none"
              >
                View Sample Invite
              </Link>
            </div>
          </div>

          {/* Carousel Section */}
          <div 
            className="w-full relative mt-8 sm:mt-16 flex flex-col items-center z-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsHovered(false), 5000);
            }}
          >
            {/* Carousel Container */}
            <div className="relative w-full h-[450px] sm:h-[600px] flex items-center justify-center overflow-x-clip py-2 sm:py-4">
              {TEMPLATES.map((tpl, idx) => {
                const offset = getWrappedOffset(idx, activeIndex, TEMPLATES.length);
                const isVisible = Math.abs(offset) <= 2;

                if (!isVisible) return null;

                const cardStyles = getCardStyles(offset, isMobile);
                const isActive = offset === 0;

                return (
                  <motion.div
                    key={tpl.slug}
                    style={{
                      width: mounted && isMobile ? Math.min(windowWidth - 48, 280) : 340,
                      height: mounted && isMobile ? Math.min((windowWidth - 48) * 1.55, 435) : 550,
                      position: "absolute",
                      borderRadius: 20,
                      overflow: "hidden",
                      boxShadow: isActive 
                        ? "0 20px 40px rgba(0, 0, 0, 0.08)" 
                        : "0 10px 20px rgba(0, 0, 0, 0.04)",
                    }}
                    animate={{
                      scale: cardStyles.scale,
                      opacity: cardStyles.opacity,
                      rotate: cardStyles.rotate,
                      x: cardStyles.x,
                      zIndex: cardStyles.zIndex,
                      filter: `grayscale(${cardStyles.grayscale}) brightness(${cardStyles.brightness})`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 24,
                      mass: 0.8,
                    }}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(e: any, info: PanInfo) => {
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        handleNext();
                      } else if (info.offset.x > threshold) {
                        handlePrev();
                      }
                    }}
                    onClick={() => handleCardClick(idx)}
                    className="cursor-pointer bg-white border border-zinc-150/40 origin-center select-none"
                  >
                    {isActive ? (
                      <LiveTemplatePreview slug={tpl.slug} autoScroll={true} />
                    ) : (
                      <div className="w-full h-full relative overflow-hidden bg-zinc-950">
                        <img
                          src={tpl.thumbnailUrl}
                          alt={tpl.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center select-none"
                        />
                        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 sm:mt-8 flex items-center gap-6 sm:gap-8 text-xs tracking-widest text-zinc-500 font-semibold">
              <button 
                onClick={handlePrev}
                className="p-2 hover:text-gold-600 active:scale-90 transition-all text-lg"
                aria-label="Previous template"
              >
                ←
              </button>
              <span className="font-bold font-mono">
                {String(activeIndex + 1).padStart(2, "0")} / {String(TEMPLATES.length).padStart(2, "0")}
              </span>
              <button 
                onClick={handleNext}
                className="p-2 hover:text-gold-600 active:scale-90 transition-all text-lg"
                aria-label="Next template"
              >
                →
              </button>
            </div>

            {/* Active Template Description */}
            <div className="mt-3 sm:mt-6 text-center select-none max-w-lg px-4 sm:px-6">
              <div className="text-lg sm:text-xl font-bold text-zinc-900">
                {getCoupleName(TEMPLATES[activeIndex].slug)}
              </div>
              <Link
                href={`/templates/${TEMPLATES[activeIndex].slug}`}
                className="mt-1 inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-700 font-semibold tracking-wider transition-all uppercase group"
              >
                <span>{getCategoryName(TEMPLATES[activeIndex])}</span>
                <span>·</span>
                <span className="underline decoration-gold-500/30 group-hover:decoration-gold-600">Preview invitation →</span>
              </Link>
            </div>
          </div>
        </section>


        {/* Social Proof & Platform Stats */}
        <section className="w-full bg-[#fafaf9] py-10 sm:py-16 px-4 sm:px-6 relative z-10 border-b border-zinc-100">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { label: "Couples Trusted", value: "1,200+" },
              { label: "RSVPs Tracked", value: "85,000+" },
              { label: "Active Guest Books", value: "98%" },
              { label: "Guest Satisfaction", value: "4.9/5" }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-white rounded-2xl border border-zinc-150/70 shadow-xs hover:border-[#eed57c]/50 transition-colors"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-[#916710] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs tracking-wider text-zinc-500 font-bold uppercase mt-1 sm:mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Varnam / Features */}
        <section id="why-choose" className="py-14 sm:py-24 px-4 sm:px-6 relative bg-white overflow-hidden scroll-mt-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 lg:items-center">
            <div>
              <p className="font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#916710]">
                Why choose varnam
              </p>
              <h2 className="mt-3 sm:mt-4 max-w-[560px] text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight font-serif">
                Premium Indian Wedding Invitation Platform
              </h2>
              <p className="mt-4 sm:mt-5 max-w-[500px] text-sm sm:text-base leading-relaxed text-zinc-600 font-normal">
                Varnam provides a premium, all-in-one digital wedding invitation maker. Easily personalize your wedding templates, custom music, photo galleries, Google Maps location, and guest messages from a secure live dashboard.
              </p>
              
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-4">
                <a
                  href="https://razorpay.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/70 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold tracking-wide text-zinc-800 hover:text-zinc-950 hover:border-zinc-300 transition-colors shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#916710]" />
                  Razorpay Verified
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/70 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold tracking-wide text-zinc-800 shadow-2xs">
                  <Lock className="w-4 h-4 text-[#916710]" />
                  Secure Live Dashboard
                </span>
              </div>

              <Link
                href="/templates"
                className="mt-8 sm:mt-10 inline-flex items-center gap-2 text-xs font-bold text-[#b3811b] hover:text-[#9a6f14] transition-colors uppercase tracking-widest"
              >
                Browse wedding templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative border border-zinc-200/70 bg-gradient-to-br from-zinc-50/70 to-[#fffdf9] p-6 sm:p-8 md:p-10 shadow-xs rounded-[24px] sm:rounded-[32px]">
              <div className="grid gap-6 sm:gap-8 divide-y divide-zinc-200/60">
                {[
                  {
                    step: "01",
                    title: "One-Time Event License",
                    desc: "1 template license for your event. No subscriptions or recurring fees."
                  },
                  {
                    step: "02",
                    title: "Secure Razorpay Checkout",
                    desc: "Activate your premium digital wedding card immediately after a safe, secure payment."
                  },
                  {
                    step: "03",
                    title: "Interactive Guest Experience",
                    desc: "Engage guests with real-time online RSVP, scratch-to-reveal event cards, dynamic maps, photo galleries, and guest wish boards."
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`grid grid-cols-[40px_1fr] sm:grid-cols-[48px_1fr] gap-4 sm:gap-5 ${idx > 0 ? "pt-6 sm:pt-8" : ""}`}>
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border border-zinc-200 bg-white text-[#916710] font-serif rounded-full text-xs sm:text-sm font-bold shadow-2xs">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 border-t border-zinc-200/60 pt-6 sm:pt-8">
                <p className="text-base sm:text-lg italic text-zinc-800 leading-relaxed font-serif">
                  &ldquo;The design feels high-end, but every guest action is just one tap away.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Templates Gallery */}
        <section className="py-14 sm:py-24 px-4 sm:px-6 bg-[#fafaf9] border-t border-zinc-150 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#916710] uppercase">
                Our Handcrafted Collection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900 font-serif">
                Signature Wedding Invitation Templates
              </h2>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-3 sm:mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {TEMPLATES.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.slug}
                  className="group relative flex flex-col bg-white rounded-[22px] sm:rounded-[24px] overflow-hidden border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(179,129,27,0.08)] hover:border-[#eed57c]/60 transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    role="img"
                    aria-label={`${tpl.name} wedding invitation preview`}
                    className="relative h-60 sm:h-64 overflow-hidden bg-zinc-50 border-b border-zinc-100"
                  >
                    {tpl.thumbnailUrl ? (
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                      />
                    ) : (
                      <LiveTemplatePreview slug={tpl.slug} autoScroll={false} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Category label */}
                    <span className="absolute top-3.5 left-3.5 bg-zinc-950/90 backdrop-blur-md text-[#eed57c] text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 font-bold rounded-md shadow-xs pointer-events-none">
                      {tpl.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h3 suppressHydrationWarning className="text-lg sm:text-xl text-zinc-900 font-bold font-serif tracking-wide mb-1.5 sm:mb-2">
                      {tpl.name}
                    </h3>
                    <p suppressHydrationWarning className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-5 sm:mb-6 flex-grow font-normal line-clamp-3 sm:line-clamp-none">
                      {tpl.description}
                    </p>

                    <div className="flex flex-col gap-3 sm:gap-4 border-t border-zinc-100 pt-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold">Single License</span>
                        <span className="text-lg sm:text-xl text-zinc-950 font-extrabold font-serif">₹{tpl.price}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full">
                        <Link
                          href={`/editor/${tpl.slug}`}
                          className="w-full bg-zinc-950 hover:bg-[#b3811b] active:scale-[0.98] text-white text-xs font-bold tracking-widest uppercase py-3 sm:py-3.5 transition-all duration-200 border border-zinc-900 hover:border-[#b3811b] rounded-xl flex items-center justify-center min-h-[44px] shadow-2xs"
                        >
                          Customize Template
                        </Link>
                        <Link
                          href={`/templates/${tpl.slug}`}
                          className="w-full text-xs tracking-widest uppercase font-bold text-zinc-600 hover:text-zinc-950 active:scale-[0.98] border border-zinc-200 hover:border-zinc-800 bg-white transition-all duration-200 py-3 sm:py-3.5 rounded-xl flex items-center justify-center min-h-[44px]"
                          aria-label={`Preview ${tpl.name} template`}
                        >
                          Live Preview
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="py-14 sm:py-24 px-4 sm:px-6 z-10 border-t border-zinc-150 bg-white relative scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#916710] uppercase">
                Simple Creation Process
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900 font-serif">
                How to Create Your WhatsApp Invite
              </h2>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-3 sm:mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: <Layers className="w-5 h-5 text-[#916710]" />,
                  title: "1. Select Wedding Template",
                  desc: "Choose a design from our curated collection of classic and premium cinematic wedding templates."
                },
                {
                  icon: <Sliders className="w-5 h-5 text-[#916710]" />,
                  title: "2. Customize Your Details",
                  desc: "Fill in the couple details, event schedules, dress codes, music tracks, map coordinates, and photos."
                },
                {
                  icon: <CreditCard className="w-5 h-5 text-[#916710]" />,
                  title: "3. Secure One-Time Payment",
                  desc: "Complete your one-time event licensing fee securely via Razorpay (Classic ₹999 / Premium ₹1,199)."
                },
                {
                  icon: <Send className="w-5 h-5 text-[#916710]" />,
                  title: "4. Share on WhatsApp & Email",
                  desc: "Instantly copy your custom digital wedding invitation link and share it with guests on WhatsApp."
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50/70 border border-zinc-200/70 p-6 sm:p-8 flex flex-col items-center text-center rounded-[22px] sm:rounded-[28px] shadow-2xs transition hover:shadow-xs hover:border-[#eed57c]/60 duration-300"
                >
                  <div className="mb-4 sm:mb-5 p-3.5 sm:p-4 bg-white rounded-2xl border border-zinc-150 shadow-2xs">{step.icon}</div>
                  <h3 className="text-base text-zinc-900 font-bold mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Event License */}
        <section id="pricing" className="py-14 sm:py-24 px-4 sm:px-6 z-10 border-t border-zinc-150 bg-[#fafaf9] relative scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#916710] uppercase">
                Transparent Event Licensing
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900 font-serif">
                Digital Wedding Invitation Pricing
              </h2>
              <p className="mt-3 text-sm text-zinc-600 max-w-lg mx-auto">
                One-time payment per event. Customize everything for free, pay only when you are ready to publish and share with your guests.
              </p>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Classic Tier Card */}
              <div className="bg-white p-6 sm:p-10 border border-zinc-200/80 rounded-[24px] sm:rounded-[28px] shadow-sm flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-bold tracking-widest uppercase">
                    CLASSIC TIER
                  </span>
                  <span className="bg-zinc-100 text-zinc-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    Standard
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 mb-2">Classic License</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Timeless traditional and floral wedding templates with all essential interactive features.
                </p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold font-serif text-zinc-900">₹999</span>
                  <span className="text-xs text-zinc-500 font-medium">/ one-time event</span>
                </div>

                {/* Features List */}
                <ul className="text-left text-xs text-zinc-700 space-y-3 mb-8 border-t border-b border-zinc-100 py-6 flex-grow">
                  {[
                    "1 event hosting license included",
                    "1 Classic template license of your choice",
                    "Unlimited photo slideshow uploads",
                    "Custom background music & audio",
                    "Interactive RSVP tracker & blessings wall",
                    "Full multi-event schedule & timeline",
                    "Google Maps venue integration & calendar sync",
                    "Shareable WhatsApp link with custom preview",
                    "Edit details freely until 5 days after event",
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-zinc-700">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/templates"
                  className="w-full py-3.5 sm:py-4 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.98] text-zinc-900 font-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 rounded-xl min-h-[48px]"
                >
                  SELECT CLASSIC (₹999)
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Premium Tier Card (Featured) */}
              <div className="bg-white p-6 sm:p-10 border-2 border-[#b3811b] rounded-[24px] sm:rounded-[28px] shadow-lg flex flex-col relative">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-zinc-950 text-[#eed57c] text-[9.5px] sm:text-[10px] font-bold tracking-widest uppercase px-4 sm:px-5 py-1.5 sm:py-2 shadow-sm rounded-full border border-[#eed57c]/40">
                  MOST POPULAR • CINEMATIC 3D
                </div>

                <div className="flex items-center justify-between mb-4 mt-2 sm:mt-0">
                  <span className="text-[10px] sm:text-xs text-[#916710] font-bold tracking-widest uppercase">
                    PREMIUM TIER
                  </span>
                  <span className="bg-[#fff9f2] text-[#916710] border border-[#eed57c]/40 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    Flagship
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 mb-2">Premium License</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Ultra-luxurious 3D scroll experiences with animated temple archways, scratch reveal, and falling petals.
                </p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold font-serif text-[#916710]">₹1,199</span>
                  <span className="text-xs text-zinc-500 font-medium">/ one-time event</span>
                </div>

                {/* Features List */}
                <ul className="text-left text-xs text-zinc-700 space-y-3 mb-8 border-t border-b border-zinc-100 py-6 flex-grow">
                  {[
                    "Everything in Classic, plus:",
                    "1 Premium 3D template license of your choice",
                    "Interactive Scratch-to-Reveal date with falling petals",
                    "Cinematic temple archways & 3D scroll motion",
                    "Interactive expanding ceremony agenda cards",
                    "Live countdown timer with custom typography",
                    "Priority WhatsApp concierge support",
                    "Ultra-high resolution asset rendering",
                    "Edit details freely until 5 days after event",
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#916710] shrink-0" />
                      <span className={`text-zinc-700 ${idx === 0 ? "font-bold text-zinc-900" : "font-medium"}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/templates"
                  className="w-full py-3.5 sm:py-4 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white font-extrabold text-xs tracking-widest uppercase transition-all duration-200 border border-[#eed57c] flex items-center justify-center gap-2 group shadow-sm min-h-[48px] rounded-xl"
                >
                  SELECT PREMIUM (₹1,199)
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#eed57c]" />
                </Link>
              </div>
            </div>

            {/* Assurance strip */}
            <div className="mt-6 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-center text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Free to customize
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Pay only to publish
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Edit anytime
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 100% secure payment
              </span>
            </div>
          </div>
        </section>


        {/* Accordion FAQ Section */}
        <FAQSection />
        </main>

        {/* Footer */}
        <footer className="w-full py-10 sm:py-12 px-4 sm:px-6 border-t border-zinc-150 bg-[#fafaf9] z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-3">
                <img src="/logo.png?v=lotus-gold" alt="Varnam" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm" />
                <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.2em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent">
                  VARNAM
                </span>
              </div>
              <p className="text-xs text-zinc-600 max-w-sm mt-2 leading-relaxed text-center md:text-left">
                Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, and Google Maps venue navigation.
              </p>
              <p className="text-xs text-zinc-500 mt-2 text-center md:text-left">
                ✉ <a href="mailto:hello@varnaminvites.store" className="hover:text-zinc-900 transition-colors">hello@varnaminvites.store</a>
              </p>
              <p className="text-[11px] text-zinc-400 mt-2 text-center md:text-left">
                © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-3 text-xs tracking-wider text-zinc-600 font-bold uppercase">
              <Link href="/about" className="hover:text-zinc-950 transition-colors">ABOUT</Link>
              <Link href="/contact" className="hover:text-zinc-950 transition-colors">CONTACT</Link>
              <a
                href="https://www.instagram.com/varnaminvites"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 transition-colors"
              >
                INSTAGRAM
              </a>
              <Link href="/terms-of-service" className="hover:text-zinc-950 transition-colors">TERMS &amp; CONDITIONS</Link>
              <Link href="/privacy-policy" className="hover:text-zinc-950 transition-colors">PRIVACY POLICY</Link>
              <Link href="/refund-policy" className="hover:text-zinc-950 transition-colors">REFUND POLICY</Link>
            </div>
          </div>
        </footer>
      </div>
  );
}
