"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Phone,
  Navigation,
  ExternalLink,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";
import CreatedByVarnam from "@/components/CreatedByVarnam";

// ============================================================================
// 1. FLOATING PEACOCK SPARKLES, JASMINE & BLUSH GOLD PETALS OVERLAY
// ============================================================================
const PeacockPetalsOverlay = () => {
  const petals = [
    { id: 1, left: "8%", delay: "0s", duration: "11s", size: 15, anim: "anim-falling-petal-1", type: "peacockGold" },
    { id: 2, left: "24%", delay: "2.4s", duration: "13s", size: 16, anim: "anim-falling-petal-2", type: "jasmine" },
    { id: 3, left: "42%", delay: "1.0s", duration: "10.5s", size: 14, anim: "anim-falling-petal-1", type: "peacockTeal" },
    { id: 4, left: "64%", delay: "3.5s", duration: "12.5s", size: 16, anim: "anim-falling-petal-2", type: "goldMarigold" },
    { id: 5, left: "82%", delay: "1.6s", duration: "14s", size: 18, anim: "anim-falling-petal-1", type: "jasmine" },
    { id: 6, left: "93%", delay: "4.2s", duration: "11.5s", size: 15, anim: "anim-falling-petal-2", type: "peacockGold" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
          className={`absolute ${p.anim}`}
        >
          {p.type === "peacockGold" ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 20 26"
              className="drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]"
            >
              <path
                d="M10 0 C16 5 20 14 18 20 C16 26 4 26 2 20 C0 14 4 5 10 0 Z"
                fill="url(#mayuraGoldGrad)"
              />
            </svg>
          ) : p.type === "peacockTeal" ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 20 26"
              className="drop-shadow-[0_2px_6px_rgba(13,148,136,0.5)]"
            >
              <path
                d="M10 0 C16 5 20 14 18 20 C16 26 4 26 2 20 C0 14 4 5 10 0 Z"
                fill="url(#mayuraTealGrad)"
              />
            </svg>
          ) : p.type === "goldMarigold" ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 20 26"
              className="drop-shadow-[0_2px_6px_rgba(245,158,11,0.4)]"
            >
              <path
                d="M10 0 C16 5 20 14 18 20 C16 26 4 26 2 20 C0 14 4 5 10 0 Z"
                fill="url(#mayuraMarigoldGrad)"
              />
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size * 1.25}
              viewBox="0 0 20 25"
              className="drop-shadow-[0_2px_6px_rgba(255,255,255,0.35)]"
            >
              <path
                d="M10 0 C15 5 19 13 17 19 C15 25 5 25 3 19 C1 13 5 5 10 0 Z"
                fill="url(#mayuraJasmineGrad)"
              />
            </svg>
          )}
        </div>
      ))}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="mayuraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2b2" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8f6018" />
          </linearGradient>
          <linearGradient id="mayuraTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
          <linearGradient id="mayuraMarigoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="mayuraJasmineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fef9ee" />
            <stop offset="100%" stopColor="#faecd0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ============================================================================
// 2. ORNAMENTAL GOLD PEACOCK DIVIDERS & SECTION BOUNDARY BLENDERS
// ============================================================================
const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
    <span className="text-[#eed57c] text-xs">❖</span>
    <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#eed57c] to-transparent" />
  </div>
);

// High-contrast vignette masks to seamlessly blend between sections
const SectionVignette = ({ hasSeam = true }: { hasSeam?: boolean }) => (
  <>
    {/* Top shadow fade-in */}
    <div className="absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
    {/* Bottom shadow fade-out */}
    <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
    {/* Hairline gold transition seam */}
    {hasSeam && (
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/45 to-transparent" />
        <span className="absolute px-2.5 py-0.5 rounded-full bg-black/80 border border-[#eed57c]/50 text-[8px] text-[#eed57c] font-serif shadow-sm">
          ❖
        </span>
      </div>
    )}
  </>
);

// ============================================================================
// 3. MAIN TEMPLATE COMPONENT: MAYURA CLASSIC
// ============================================================================
export default function MayuraClassicTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Names & custom copy
  const bride = data.bride_name || "Ananya";
  const groom = data.groom_name || "Siddharth";
  const quote =
    data.quote ||
    "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.";
  const familyNames = data.family_names || "The Sundararajan & Ranganathan Families";
  const rsvpPhone = data.rsvp_phone || "+91 98401 23456";
  const venueName =
    data.wedding_venue && data.wedding_venue.includes(",")
      ? data.wedding_venue.split(",")[0].trim()
      : data.wedding_venue || "The Leela Palace Courtyard";
  const venueAddress =
    data.wedding_venue && data.wedding_venue.includes(",")
      ? data.wedding_venue.split(",").slice(1).join(",").trim()
      : "MRC Nagar, Adyar Seaface, Chennai, Tamil Nadu - 600028";

  // Music Player
  const [isPlaying, setIsPlaying] = useState(false);
  const musicUrl =
    data.music_url ||
    "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3";

  useEffect(() => {
    if (!audioRef.current && musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Date Parsing with Hydration Safety
  const parseDate = (dateStr?: string) => {
    try {
      if (!dateStr) throw new Error();
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) throw new Error();
      return {
        day: d.getDate(),
        month: d.toLocaleString("en-US", { month: "long" }).toUpperCase(),
        year: d.getFullYear(),
        weekday: d.toLocaleString("en-US", { weekday: "long" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        raw: d,
      };
    } catch {
      return {
        day: 28,
        month: "NOVEMBER",
        year: 2026,
        weekday: "Saturday",
        time: "08:42 AM",
        raw: new Date("2026-11-28T08:42:00"),
      };
    }
  };

  const weddingDateInfo = useMemo(() => parseDate(data.wedding_date), [data.wedding_date]);

  // Smooth scroll progress for hero reveal
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let scrollParent: HTMLElement | Window = window;
    let node = containerRef.current?.parentElement;
    while (node) {
      const style = window.getComputedStyle(node);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        scrollParent = node;
        break;
      }
      node = node.parentElement;
    }

    const handleScroll = () => {
      let currentScroll = 0;
      if (scrollParent === window) {
        currentScroll = window.scrollY;
      } else {
        currentScroll = (scrollParent as HTMLElement).scrollTop;
      }
      const progress = Math.min(1, Math.max(0, currentScroll / 260));
      setScrollProgress(progress);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 64,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  const targetTimestamp = weddingDateInfo.raw.getTime();

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  // Interactive Scratch Card
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawing = useRef(false);

  const initCanvas = (w?: number, h?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = Math.round(w || rect.width || canvas.clientWidth || 190));
    const height = (canvas.height = Math.round(h || rect.height || canvas.clientHeight || 280));
    if (width <= 0 || height <= 0) return;

    // Metallic royal gold gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#d8af56");
    goldGrad.addColorStop(0.25, "#fae6a2");
    goldGrad.addColorStop(0.5, "#c18c35");
    goldGrad.addColorStop(0.75, "#edd380");
    goldGrad.addColorStop(1, "#855814");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Stippled foil grain
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() > 0.8 ? 2 : 1, Math.random() > 0.8 ? 2 : 1);
    }
    ctx.fillStyle = "rgba(90, 50, 10, 0.2)";
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 1, 1);
    }

    // Inner embossed border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = "rgba(100, 60, 10, 0.4)";
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Centered instruction text in English
    ctx.fillStyle = "#2c1505";
    ctx.font = "700 12px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ MAYURA MUHURTHAM ✦", width / 2, height / 2 - 14);
    ctx.font = "600 10px 'Cinzel', serif";
    ctx.fillText("SWIPE TO REVEAL DATE", width / 2, height / 2 + 4);
    ctx.font = "italic 9.5px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "#4a2406";
    ctx.fillText("Scratch to unveil auspicious wedding date", width / 2, height / 2 + 20);
  };

  useEffect(() => {
    if (isScratched) return;

    const tryInit = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width || canvas.offsetWidth);
      const h = Math.round(rect.height || canvas.offsetHeight);
      if (w > 20 && h > 20) {
        initCanvas(w, h);
      }
    };

    tryInit();
    const raf = requestAnimationFrame(tryInit);
    const t1 = setTimeout(tryInit, 80);
    const t2 = setTimeout(tryInit, 300);
    const t3 = setTimeout(tryInit, 700);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!isScratched) tryInit();
          })
        : null;
    if (canvasRef.current && ro) ro.observe(canvasRef.current);

    window.addEventListener("resize", tryInit);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", tryInit);
    };
  }, [isScratched]);

  const handleScratchMove = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Threshold check
    if (Math.random() > 0.5) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) clear++;
        }
        const percent = Math.round((clear / (imgData.data.length / 16)) * 100);
        if (percent > 35) {
          setIsScratched(true);
        }
      } catch {}
    }
  };

  // Photo Carousel
  const defaultMoments = [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=900",
  ];

  const parsedImages = data.slideshow_images
    ? data.slideshow_images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : defaultMoments;
  const momentsList = parsedImages.length > 0 ? parsedImages : defaultMoments;

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Mobile swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      setActivePhotoIdx((prev) => (prev + 1) % momentsList.length);
    } else if (diff < -40) {
      setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length);
    }
    touchStartX.current = null;
  };

  // RSVP State
  const [rsvpStatus, setRsvpStatus] = useState<"none" | "attending" | "declined">("none");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [rsvpSaved, setRsvpSaved] = useState(false);

  // Google Maps
  const venueLocation =
    data.gmap_coordinates ||
    data.wedding_venue ||
    "The Leela Palace Courtyard, MRC Nagar, Chennai - 600028";
  const gmapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueLocation
  )}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    venueLocation
  )}&t=m&z=15&output=embed&iwloc=near`;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#081217] text-[#faeed3] font-serif overflow-x-hidden selection:bg-[#d4af37] selection:text-black flex flex-col items-center"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, #0f242e 0%, #060e12 100%)",
      }}
    >
      {/* Floating Ambient Peacock Petals & Sparkles Overlay */}
      <PeacockPetalsOverlay />

      {/* Floating Audio Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#eed57c]/70 shadow-[0_4px_18px_rgba(0,0,0,0.8)] text-[#eed57c] hover:border-white hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Toggle Music"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#eed57c] animate-pulse" />
              <span className="text-[10px] tracking-widest font-marcellus font-bold uppercase text-[#fff2b2]">
                Sound On
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10px] tracking-widest font-marcellus text-zinc-400 uppercase">
                Sound Off
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Responsive Mobile & Tablet Template Container */}
      <div className="relative w-full max-w-[440px] md:max-w-[580px] lg:max-w-[440px] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION: JAI GURUJI (ROYAL ARCH, PEACH PALACE & MAJESTIC PEACOCK) */}
        {/* ===================================================================== */}
        <section className="relative w-full aspect-[9/16] min-h-[660px] overflow-hidden flex flex-col items-center justify-between text-center pt-8 pb-4 px-4 bg-cover bg-center">
          {/* Background Image: Jai Guruji with gentle camera zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 will-change-transform"
            style={{
              backgroundImage: "url('/images/mayura-classic/hero_peacock_arch.jpg')",
              transform: `scale(${1 + scrollProgress * 0.1})`,
              transformOrigin: "50% 30%",
            }}
          />

          {/* Subtle top shade for top arch badge clarity */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none" />

          {/* Top Emblem (Shifted slightly below into open arch window while keeping couple names still) */}
          <div
            className="relative z-20 flex flex-col items-center transition-all duration-300 pt-9 sm:pt-11"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `translateY(${20 - scrollProgress * 30}px)`,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1 text-[#fff2b2]">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#eed57c] to-[#eed57c]" />
              <span className="text-xs text-[#eed57c]">❖</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent via-[#eed57c] to-[#eed57c]" />
            </div>
            <h2 className="font-cinzel text-xs sm:text-sm tracking-[0.3em] text-[#fff2b2] uppercase font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              AN AUSPICIOUS CELEBRATION
            </h2>
            <span className="font-marcellus text-[9.5px] sm:text-[10.5px] tracking-[0.25em] text-[#783e0a] uppercase font-semibold mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              SHUBHA VIVAHA MUHURTHAM
            </span>
          </div>

          {/* Center Couple Names: Floating Directly on Background (NO BOX), Sized Generously */}
          <div
            className="relative z-20 w-full max-w-[360px] flex flex-col items-center my-auto py-2 px-4 transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.6),
              transform: `translateY(-${scrollProgress * 45}px)`,
            }}
          >
            <p className="font-marcellus text-[10.5px] sm:text-[12px] tracking-[0.32em] text-[#783e0a] uppercase font-bold mb-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              WE ARE GETTING MARRIED
            </p>

            {/* Bride Name - Bigger, Free of Box */}
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-[42px] font-bold tracking-[0.1em] text-[#250d03] uppercase leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] text-center px-2">
              {bride}
            </h1>

            {/* Weds Divider */}
            <div className="flex items-center justify-center gap-3 my-1.5 w-full">
              <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent via-[#9c6a1e] to-transparent" />
              <span className="font-great-vibes text-3xl sm:text-4xl text-[#824610] italic drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                weds
              </span>
              <div className="h-[1.5px] w-12 bg-gradient-to-l from-transparent via-[#9c6a1e] to-transparent" />
            </div>

            {/* Groom Name - Bigger, Free of Box */}
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-[42px] font-bold tracking-[0.1em] text-[#250d03] uppercase leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] text-center px-2">
              {groom}
            </h1>

            <div className="mt-3 text-[#783e0a] text-[10px] sm:text-[11px] font-cinzel tracking-[0.24em] uppercase font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              ❖ ROYAL WEDDING CELEBRATION ❖
            </div>
          </div>

          {/* Bottom Floating Scroll Indicator (Positioned elegantly above the peacock) */}
          <div
            className="relative z-20 flex flex-col items-center gap-1 transition-opacity duration-300 pb-1"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
          >
            <span className="text-[9px] tracking-[0.3em] text-[#fff2b2] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              SCROLL TO CELEBRATE
            </span>
            <div className="w-4 h-6 rounded-full border border-[#eed57c] bg-black/40 flex items-start justify-center p-1 shadow-md">
              <div className="w-1 h-2 rounded-full bg-[#eed57c] animate-bounce" />
            </div>
          </div>

          {/* Bottom Seam to Next Section */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-15" />
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/60 to-transparent" />
            <span className="absolute px-2.5 py-0.5 rounded-full bg-black/85 border border-[#eed57c]/60 text-[8px] text-[#eed57c] font-serif shadow-sm">
              ❖
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. SACRED VERSE: PEACOCK PLUME & MANDALA FRAME (WEDDING INVITATION CARD) */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center px-5 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-classic/peacock_frame_bg.jpg')",
          }}
        >
          <SectionVignette />
          {/* Central Frosted Parchment Halo:
              Ensures text NEVER overlaps the dark peacock plumes at the top-right
              or bottom-left, guaranteeing 100% crystal-clear legibility! */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-[85%] max-w-[315px] flex flex-col items-center px-5 py-7 my-auto rounded-2xl bg-[#fffdf8]/90 backdrop-blur-[2px] border border-[#c89b38]/45 shadow-[0_12px_36px_rgba(20,10,3,0.18)]"
          >
            {/* Fine Inner Decorative Border */}
            <div className="absolute inset-1.5 border border-[#8f5e1a]/25 rounded-xl pointer-events-none" />

            {/* Top Auspicious Header in Deep Royal Bronze */}
            <span className="font-cinzel text-[10.5px] sm:text-[11px] tracking-[0.26em] text-[#783e0a] uppercase font-bold mb-1">
              ✦ DIVINE INVOCATION ✦
            </span>

            {/* Sacred Marriage Verse in Ultra-Clear Dark Ink */}
            <h2 className="font-cinzel text-lg sm:text-xl text-[#1a0a01] font-bold leading-relaxed tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              &ldquo;United by destiny,
              <br />
              blessed by grace.&rdquo;
            </h2>

            {/* Gold Filigree Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#96631b] to-transparent my-2.5"
            />

            {/* Custom Quote - Deep, Crisp Espresso Text, 100% Legible */}
            <p className="font-cormorant text-sm sm:text-base text-[#261003] leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold italic">
              {quote}
            </p>

            {/* Welcoming Parents & Families Note if present - Kept Safely Inside Card */}
            {familyNames && (
              <div className="mt-3.5 pt-2.5 border-t border-[#96631b]/30 w-full">
                <span className="text-[9.5px] font-cinzel tracking-widest text-[#783e0a] uppercase font-bold block mb-0.5">
                  With Heartfelt Blessings
                </span>
                <p className="font-marcellus text-xs text-[#2c1304] font-bold tracking-wider leading-snug">
                  {familyNames}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 text-[#8a5518]">
              <div className="w-8 h-[1px] bg-current" />
              <span className="text-xs">❖</span>
              <div className="w-8 h-[1px] bg-current" />
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 3. SCRATCH TO REVEAL: ROYAL PEACOCK GOLD CARTOUCHE (CUSTOM DESIGN)   */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center bg-[#071318] bg-cover bg-center overflow-hidden select-none"
          style={{
            backgroundImage: "radial-gradient(ellipse at center, #0f2b36 0%, #051015 100%)",
          }}
        >
          <SectionVignette />

          {/* Heading Above Scratch Card */}
          <div className="relative z-20 mb-4 flex flex-col items-center">
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] text-[#eed57c] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ✦ AUSPICIOUS INVITATION ✦
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fff2b2] tracking-[0.18em] uppercase mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Save The Date
            </h3>
            <GoldDivider className="mt-1.5 opacity-80" />
          </div>

          {/* Centered Antique Gold Cartouche Scratch Box */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[26px] sm:rounded-[30px] overflow-hidden flex flex-col items-center justify-center text-center z-15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#d4af37]"
            style={{
              width: "60%",
              height: "44%",
            }}
          >
            {/* 1. Underlying Revealed Luxury Card Backing */}
            <div
              className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-between py-4 px-3 text-center pointer-events-none select-none z-0 bg-[#fffbf2]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #fffcf5 0%, #faedd3 50%, #f4dec0 100%)",
              }}
            >
              {/* Inner Gold Hairline Frame */}
              <div className="absolute inset-2 border border-[#b8860b]/40 rounded-2xl pointer-events-none" />

              {/* Header inside Card */}
              <div className="flex flex-col items-center pt-1 z-10">
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.24em] text-[#7a3407] font-bold uppercase">
                  ✦ AUSPICIOUS MUHURTHAM ✦
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#9e6b22] to-transparent mt-0.5" />
              </div>

              {/* Center Date Details - Ultra high-contrast & crisp */}
              <div className="flex flex-col items-center justify-center my-auto px-1 z-10">
                <div className="font-cormorant text-5xl sm:text-6xl font-bold text-[#200d02] leading-none tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                  {weddingDateInfo.day}
                </div>
                <div className="font-cinzel text-xs sm:text-sm tracking-[0.28em] text-[#381603] font-bold uppercase mt-1">
                  {weddingDateInfo.month} {weddingDateInfo.year}
                </div>
                <div className="flex items-center gap-1.5 my-1 text-[#9e6b22]">
                  <div className="w-4 h-[1px] bg-current" />
                  <span className="text-[7px]">❖</span>
                  <div className="w-4 h-[1px] bg-current" />
                </div>
                <div className="font-marcellus text-[10.5px] sm:text-[11.5px] text-[#422005] font-bold tracking-wider">
                  {weddingDateInfo.weekday} · {weddingDateInfo.time}
                </div>
                <div className="font-marcellus text-[10px] sm:text-[11px] text-[#633208] font-bold mt-0.5 line-clamp-1 max-w-[170px]">
                  {data.wedding_venue || "The Leela Palace Courtyard"}
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="pb-1 text-[8.5px] tracking-[0.22em] font-cinzel text-[#783e0a] uppercase font-bold z-10">
                ❖ An Auspicious Union ❖
              </div>
            </div>

            {/* 2. Top Scratch Canvas Layer */}
            <canvas
              ref={canvasRef}
              style={{ touchAction: "none" }}
              onMouseDown={() => (isDrawing.current = true)}
              onMouseUp={() => (isDrawing.current = false)}
              onMouseLeave={() => (isDrawing.current = false)}
              onMouseMove={(e) => {
                if (isDrawing.current) handleScratchMove(e.clientX, e.clientY);
              }}
              onTouchStart={() => (isDrawing.current = true)}
              onTouchEnd={() => (isDrawing.current = false)}
              onTouchMove={(e) => {
                if (e.touches[0]) {
                  handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              className={`absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-700 ${
                isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />

            {/* 3. Subtle Animated Scratch Hint Badge */}
            {!isScratched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.75, 1, 0.75], y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="absolute bottom-2.5 pointer-events-none z-20 px-2.5 py-0.5 rounded-full bg-black/75 border border-[#eed57c]/70 text-[8px] font-marcellus text-[#fff2b2] tracking-widest uppercase flex items-center gap-1 shadow-md"
              >
                <span>✨ Swipe To Reveal</span>
              </motion.div>
            )}
          </motion.div>

          {/* Click to Reveal fallback button */}
          {!isScratched && (
            <button
              type="button"
              onClick={() => setIsScratched(true)}
              className="relative mt-5 z-20 px-5 py-2 rounded-full bg-gradient-to-r from-[#1e343d] via-[#2d4d59] to-[#1e343d] border border-[#eed57c] text-[#fff2b2] text-[10px] sm:text-[10.5px] tracking-[0.22em] uppercase font-cinzel font-bold hover:scale-105 hover:border-white active:scale-95 transition-all shadow-[0_4px_18px_rgba(0,0,0,0.8)] cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#eed57c]" />
              <span>Click To Reveal Date</span>
            </button>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 4. COUNTDOWN TIMER: PEACOCK BLUE MARBLE & PLUMES (DOWNLOAD 31)         */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-classic/peacock_blue_bg.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[320px] flex flex-col items-center py-6 px-3"
          >
            {/* Top Luminous Badge */}
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] text-[#eed57c] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              ✦ AUSPICIOUS MUHURTHAM ✦
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl text-[#fff2b2] tracking-[0.2em] uppercase font-bold mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Counting Down
            </h3>
            <span className="font-marcellus text-xs tracking-[0.24em] text-[#5eead4] uppercase font-semibold mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              To Eternal Togetherness
            </span>
            <GoldDivider className="my-2.5 opacity-90" />

            {/* 4 Glowing Countdown Boxes against Deep Peacock Blue */}
            <div className="grid grid-cols-2 gap-2.5 w-full mt-3">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINUTES", value: timeLeft.minutes },
                { label: "SECONDS", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.08, ease: "easeOut" }}
                  className="py-3.5 px-2 rounded-xl bg-black/75 border border-[#eed57c]/60 shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
                  <span className="font-cormorant text-4xl sm:text-5xl font-bold text-[#fff2b2] tabular-nums leading-none drop-shadow-[0_2px_8px_rgba(238,213,124,0.5)]">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.22em] text-[#eed57c] uppercase font-bold mt-1.5 text-center">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Auspicious Time Pill */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-black/80 border border-[#eed57c]/50 text-center shadow-md">
              <span className="font-marcellus text-xs text-[#faedd0] font-semibold tracking-wider">
                {weddingDateInfo.weekday}, {weddingDateInfo.day} {weddingDateInfo.month} · {weddingDateInfo.time}
              </span>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 5. PROGRAM TIMELINE: GOLD MANDALA SUNBURST & PARCHMENT (DOWNLOAD 30) */}
        {/* LIES DIRECTLY ON THE IMAGE (NO SEPARATE BOX) - EXACTLY 3 PROGRAMS    */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[820px] sm:min-h-[860px] text-center flex flex-col items-center justify-between px-4 bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-classic/timeline_mandala_bg.jpg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <SectionVignette />

          {/* Header centered over top mandala arch (0% to ~23.5%) */}
          <div className="w-full flex flex-col items-center justify-center pt-8 pb-3 z-15 min-h-[175px] sm:min-h-[190px]">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <span className="font-cinzel text-[10.5px] sm:text-[11.5px] tracking-[0.28em] text-[#fff2b2] uppercase font-bold mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                ✦ SACRED RITUALS ✦
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#fff2b2] tracking-[0.16em] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Wedding Program
              </h2>
              <div className="flex items-center gap-2 mt-1 text-[#eed57c] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                <div className="w-8 h-[1px] bg-current" />
                <span className="text-[9px]">❖</span>
                <div className="w-8 h-[1px] bg-current" />
              </div>
            </motion.div>
          </div>

          {/* 3 Programs Centered Directly on Natural Parchment Field (23.5% to 75.3%) */}
          <div className="relative w-[92%] max-w-[340px] my-auto py-2 flex flex-col items-center justify-center z-15">
            {/* Vertical connecting gold rod */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[1.5px] bg-gradient-to-b from-[#a8781a]/40 via-[#b8860b] to-[#a8781a]/40" />

            <div className="relative w-full flex flex-col items-center space-y-3 sm:space-y-3.5 z-10">
              {/* Program 1: Mangala Snanam */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center py-2 px-3 rounded-xl bg-[#faedd3]/80 border border-[#b8860b]/40 shadow-xs backdrop-blur-xs"
              >
                <div className="w-5.5 h-5.5 rounded-full bg-[#faedd3] border-2 border-[#b8860b] shadow-md flex items-center justify-center text-[9px] text-[#4a2406] font-cinzel font-bold mb-0.5 ring-2 ring-[#b8860b]/30">
                  1
                </div>
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.22em] text-[#783e0a] uppercase font-bold block leading-tight">
                  MANGALA SNANAM
                </span>
                <h4 className="font-marcellus text-xs sm:text-sm font-bold text-[#1a0a01] leading-snug mt-0.5">
                  Auspicious Sacred Dawn Prayers
                </h4>
                <div className="mt-0.5 font-cormorant text-xs sm:text-sm text-[#240e02] font-bold leading-tight">
                  07:00 AM
                </div>
                <div className="font-marcellus text-[11px] sm:text-xs text-[#522a07] font-semibold leading-tight mt-0.5">
                  {venueName}
                </div>
              </motion.div>

              {/* Program 2: Kalyana Muhurtham (Apex Highlight) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center py-2.5 px-3.5 rounded-xl bg-[#8b1e1e]/20 border-2 border-[#8b1e1e]/50 shadow-md backdrop-blur-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#8b1e1e] border-2 border-[#eed57c] shadow-lg flex items-center justify-center text-[10px] text-[#fff2b2] font-bold mb-0.5">
                  ❖
                </div>
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.24em] text-[#8b1e1e] uppercase font-bold block leading-tight">
                  SACRED MUHURTHAM
                </span>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#3d0f04] leading-snug mt-0.5">
                  Mangalya Dharanam &amp; Saptapadi
                </h4>
                <div className="mt-0.5 font-cormorant text-sm sm:text-base text-[#240307] font-bold leading-tight">
                  {weddingDateInfo.time || "08:42 AM"}
                </div>
                <div className="font-marcellus text-xs text-[#8b1e1e] font-bold leading-tight mt-0.5">
                  {venueName}
                </div>
              </motion.div>

              {/* Program 3: Kalyana Virundhu & Reception */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center py-2 px-3 rounded-xl bg-[#faedd3]/90 border border-[#b8860b]/50 shadow-xs backdrop-blur-xs"
              >
                <div className="w-5.5 h-5.5 rounded-full bg-[#faedd3] border-2 border-[#b8860b] shadow-md flex items-center justify-center text-[9px] text-[#4a2406] font-cinzel font-bold mb-0.5 ring-2 ring-[#b8860b]/30">
                  3
                </div>
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.22em] text-[#783e0a] uppercase font-bold block leading-tight">
                  VIRUNDHU &amp; RECEPTION
                </span>
                <h4 className="font-marcellus text-xs sm:text-sm font-bold text-[#1a0a01] leading-snug mt-0.5">
                  Traditional Feast &amp; Celebrations
                </h4>
                <div className="mt-0.5 font-cormorant text-xs sm:text-sm text-[#240e02] font-bold leading-tight">
                  12:30 PM &amp; 06:30 PM
                </div>
                <div className="font-marcellus text-[11px] sm:text-xs text-[#522a07] font-bold leading-tight mt-0.5">
                  The Leela Palace Banquet Hall
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Decorative Indicator centered in bottom mandala (75.3% to 100%) */}
          <div className="w-full flex items-center justify-center pb-8 pt-3 z-15 min-h-[175px] sm:min-h-[190px] text-[#eed57c] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            <div className="w-8 h-[1px] bg-current" />
            <span className="text-[10px]">❖</span>
            <div className="w-8 h-[1px] bg-current" />
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6. SWEET MOMENTS: 3D PHOTO FAN CAROUSEL (CUSTOM PEACOCK LUXURY)       */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(ellipse at center, #0e2733 0%, #061217 100%)",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center z-15"
          >
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] text-[#eed57c] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ✦ CHERISHED GLIMPSES ✦
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-[#fff2b2] tracking-[0.18em] uppercase font-bold mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Sweet Moments
            </h2>
            <p className="font-cormorant italic text-sm sm:text-base text-[#faedd0] font-semibold mb-5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Treasured memories of our journey together
            </p>

            {/* 3D Borderless Photo Fan Slideshow */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[370px] sm:max-w-[410px] flex items-center justify-center min-h-[340px] sm:min-h-[370px]"
            >
              {/* Left Photo (idx - 1) */}
              <motion.div
                initial={{ opacity: 0, x: -20, rotate: -10 }}
                whileInView={{ opacity: 0.45, x: 0, rotate: -6 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length)
                }
                className="absolute left-1 sm:left-2 w-36 sm:w-42 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#d4af37]/50 hover:opacity-80 transition cursor-pointer scale-90 z-10 select-none bg-black"
              >
                <img
                  src={momentsList[(activePhotoIdx - 1 + momentsList.length) % momentsList.length]}
                  alt="Moments"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
              </motion.div>

              {/* Center Featured Photo (idx) */}
              <div className="relative z-20 w-60 sm:w-68 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-[#eed57c] select-none transform hover:scale-[1.02] transition-transform duration-300 bg-black">
                <img
                  src={momentsList[activePhotoIdx]}
                  alt="Couple Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Counter Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-[#eed57c]/60 text-[10px] tracking-widest text-[#eed57c] font-marcellus font-bold">
                  {activePhotoIdx + 1} / {momentsList.length}
                </div>
              </div>

              {/* Right Photo (idx + 1) */}
              <motion.div
                initial={{ opacity: 0, x: 20, rotate: 10 }}
                whileInView={{ opacity: 0.45, x: 0, rotate: 6 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-1 sm:right-2 w-36 sm:w-42 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#d4af37]/50 hover:opacity-80 transition cursor-pointer scale-90 z-10 select-none bg-black"
              >
                <img
                  src={momentsList[(activePhotoIdx + 1) % momentsList.length]}
                  alt="Moments"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
              </motion.div>

              {/* Navigation Chevrons */}
              <button
                type="button"
                aria-label="Previous Photo"
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length)
                }
                className="absolute left-0 sm:left-1 z-30 w-9 h-9 rounded-full bg-black/85 border border-[#eed57c] text-[#eed57c] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-xl cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next Photo"
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-0 sm:right-1 z-30 w-9 h-9 rounded-full bg-black/85 border border-[#eed57c] text-[#eed57c] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-xl cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots Pagination */}
            <div className="flex gap-1.5 justify-center mt-4">
              {momentsList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Photo ${idx + 1}`}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activePhotoIdx === idx
                      ? "w-5 bg-[#eed57c]"
                      : "w-1.5 bg-[#eed57c]/30 hover:bg-[#eed57c]/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 7. VENUE & GOOGLE MAPS: UNIFIED SINGLE CARD WITH SMALL VENUE & MAP     */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-12 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(ellipse at top, #112d3b 0%, #061117 100%)",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[330px] sm:max-w-[350px] flex flex-col items-center"
          >
            <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] text-[#eed57c] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ✦ CEREMONY LOCATION ✦
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-[#fff2b2] tracking-[0.18em] uppercase font-bold mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Wedding Venue
            </h2>
            <GoldDivider className="mb-4 opacity-80" />

            {/* ONE SINGLE UNIFIED LUXURY VENUE CARD:
                Venue name small at top -> Address -> Embedded Map -> Get Directions Button */}
            <div className="w-full rounded-2xl bg-[#09171f]/95 border-2 border-[#eed57c]/70 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />

              {/* 1. Venue Name (Small, Clean, Elegant) */}
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#fff2b2] tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {venueName}
              </h3>

              {/* 2. Venue Address (Small, Crisp) */}
              <p className="font-marcellus text-xs sm:text-[13px] text-[#faedd0]/90 mt-1 mb-3.5 leading-relaxed max-w-[280px]">
                {venueAddress}
              </p>

              {/* 3. Google Map (Embedded Below Venue Name) */}
              <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-[#eed57c]/50 shadow-md bg-[#0a161c] mb-3.5">
                {/* Map Top Bar */}
                <div className="absolute top-0 inset-x-0 z-10 px-3 py-1 flex items-center justify-between text-[10px] bg-black/85 backdrop-blur-md border-b border-[#eed57c]/30">
                  <span className="font-cinzel tracking-wider uppercase font-semibold text-[#fff2b2] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#eed57c]" />
                    Interactive Map
                  </span>
                  <a
                    href={gmapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-cinzel tracking-wider uppercase font-semibold text-[#eed57c] hover:underline flex items-center gap-1"
                  >
                    <span>View Larger</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="w-full h-full pt-6">
                  {isPreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/85 text-center p-3">
                      <MapPin className="w-7 h-7 text-[#eed57c] mb-1.5 animate-bounce" />
                      <span className="font-cinzel text-sm text-[#fff2b2] font-semibold line-clamp-1">
                        {data.wedding_venue || "The Leela Palace Courtyard"}
                      </span>
                      <a
                        href={gmapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 px-3 py-1 rounded-full bg-[#eed57c]/20 border border-[#eed57c]/60 text-[#eed57c] text-[9.5px] font-cinzel font-semibold uppercase tracking-widest hover:bg-[#eed57c] hover:text-black transition"
                      >
                        Open in Maps ↗
                      </a>
                    </div>
                  ) : (
                    <iframe
                      title="Venue Map"
                      src={mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* 4. Get Directions Button */}
              <a
                href={gmapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] text-[#1c0f05] font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-[0_4px_15px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 fill-[#1c0f05]" />
                <span>Get Directions</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 8. BLESSINGS & RSVP: HIGH-CONTRAST CARD WITH INTERACTIVE FEEDBACK      */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[680px] text-center flex flex-col items-center justify-center px-4 py-12 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(ellipse at bottom, #0e2733 0%, #051015 100%)",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[315px] sm:max-w-[335px] flex flex-col items-center"
          >
            {/* Card Container */}
            <div className="w-full rounded-2xl bg-[#09171f]/95 backdrop-blur-md border-2 border-[#d4af37]/75 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />

              <span className="font-cinzel text-[10px] tracking-[0.24em] text-[#eed57c] uppercase font-bold">
                ✦ WARM WISHES ✦
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-[#fff2b2] tracking-[0.18em] uppercase font-bold mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                Blessings &amp; RSVP
              </h2>
              <GoldDivider className="my-2 opacity-90" />
              <p className="font-cormorant text-base sm:text-lg text-[#faedd0] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] font-medium italic">
                Please grace our celebration with your presence &amp; blessings
              </p>

              {rsvpSaved ? (
                <div className="p-4 rounded-xl bg-black/75 border border-[#eed57c]/60 text-center w-full shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#eed57c]/20 border-2 border-[#eed57c] flex items-center justify-center mx-auto mb-2 text-[#eed57c] shadow-md">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-cinzel text-base text-[#fff2b2] uppercase tracking-wider font-bold">
                    {rsvpStatus === "attending" ? "Thank You!" : "Response Received"}
                  </h4>
                  <p className="font-cormorant text-sm sm:text-base text-[#faedd0] mt-1.5 leading-relaxed font-medium">
                    {rsvpStatus === "attending"
                      ? "We eagerly look forward to celebrating with you and receiving your heartfelt blessings."
                      : "Thank you for sending your warm wishes and blessings."}
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  {/* Attendance Choice Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("attending")}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-cinzel text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                        rsvpStatus === "attending"
                          ? "bg-gradient-to-r from-[#eed57c] to-[#c59a3f] text-[#1c0f05] border-2 border-white ring-2 ring-[#eed57c]/50 scale-[1.02]"
                          : "bg-[#142630] text-[#faedd0] hover:bg-[#1d3542] border border-[#eed57c]/50"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Attending</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-cinzel text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                        rsvpStatus === "declined"
                          ? "bg-[#541217] text-[#ffe4e6] border-2 border-[#f87171] ring-2 ring-[#f87171]/40 scale-[1.02]"
                          : "bg-[#142630] text-[#faedd0]/80 hover:bg-[#1d3542] border border-[#eed57c]/50"
                      }`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Declining</span>
                    </button>
                  </div>

                  {/* Form Content */}
                  {rsvpStatus !== "none" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full space-y-3 text-left mt-1"
                    >
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] font-cinzel text-[#eed57c] uppercase font-bold mb-1">
                          Guest / Family Name
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Sundaram & Family"
                          className="w-full px-3 py-2 rounded-xl bg-black/80 border-2 border-[#eed57c]/50 text-sm text-[#fff9e6] placeholder-[#faedd0]/50 font-cormorant focus:outline-none focus:border-[#eed57c] focus:ring-1 focus:ring-[#eed57c]"
                        />
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] font-cinzel text-[#eed57c] uppercase font-bold mb-1">
                            Number of Guests
                          </label>
                          <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0c1c24] border-2 border-[#eed57c]/50 text-sm text-[#fff9e6] font-cormorant focus:outline-none focus:border-[#eed57c]"
                          >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4+">Family (4+ Guests)</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setRsvpSaved(true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#eed57c] via-[#f5e6a8] to-[#c59a3f] text-[#1c0f05] font-cinzel text-xs uppercase font-bold tracking-[0.2em] hover:brightness-110 active:scale-98 transition shadow-[0_4px_16px_rgba(238,213,124,0.4)] cursor-pointer mt-1"
                      >
                        Confirm RSVP
                      </button>
                    </motion.div>
                  )}

                  {/* RSVP Desk Phone Number */}
                  {rsvpPhone && (
                    <div className="pt-2 border-t border-[#eed57c]/30 w-full flex items-center justify-center">
                      <a
                        href={`tel:${rsvpPhone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#eed57c] hover:text-[#fff2b2] font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="font-marcellus tracking-wider">RSVP Helpline: {rsvpPhone}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 9. FOOTER & SIGN-OFF: WITH GORGEOUS PEACOCK BLUE BACKGROUND & IMAGE   */}
        {/* ===================================================================== */}
        <footer
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-classic/peacock_blue_bg.jpg')",
          }}
        >
          {/* Atmospheric Darker Vignette over background */}
          <SectionVignette hasSeam={false} />
          <div className="absolute inset-0 bg-black/45 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[325px] flex flex-col items-center px-4 py-7 rounded-3xl bg-black/75 backdrop-blur-md border border-[#eed57c]/50 shadow-[0_16px_50px_rgba(0,0,0,0.9)]"
          >
            {/* Featured Royal Image Frame in Footer */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#eed57c] shadow-[0_8px_25px_rgba(0,0,0,0.85)] mb-3 p-1 bg-gradient-to-tr from-[#d4af37] via-[#fff2b2] to-[#8f6018]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img
                  src={momentsList[0] || "/images/mayura-classic/hero_peacock_arch.jpg"}
                  alt={`${bride} & ${groom}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <span className="font-cinzel text-xs sm:text-sm tracking-[0.26em] text-[#eed57c] block mb-1 uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              LOVE • TRADITION • ETERNITY
            </span>
            <h4 className="font-great-vibes text-4xl sm:text-5xl text-[#fff9e6] drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] tracking-wide leading-tight">
              {bride} &amp; {groom}
            </h4>

            <div className="flex items-center justify-center gap-2 my-2 text-[#eed57c]">
              <div className="w-10 h-[1px] bg-current opacity-80" />
              <Heart className="w-3.5 h-3.5 fill-current" />
              <div className="w-10 h-[1px] bg-current opacity-80" />
            </div>

            {familyNames && (
              <p className="font-marcellus text-xs sm:text-sm tracking-[0.14em] text-[#faedd0] font-semibold my-1 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-relaxed uppercase">
                Warmly Invited By: {familyNames}
              </p>
            )}

            {/* Created by Varnam Badge */}
            <div className="mt-3 flex justify-center w-full">
              <div className="rounded-full bg-black/85 backdrop-blur-md border border-[#eed57c]/60 shadow-xl hover:border-[#eed57c] hover:bg-black transition-all hover:scale-105 active:scale-95">
                <CreatedByVarnam
                  theme="gold"
                  className="py-1 px-4 text-[#fff2b2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                />
              </div>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
