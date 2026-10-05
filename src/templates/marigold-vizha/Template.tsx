"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
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
// 1. FLOATING MARIGOLD & JASMINE PETALS PARTICLES
// ============================================================================
const MarigoldPetalsOverlay = () => {
  const petals = [
    { id: 1, left: "7%", delay: "0s", duration: "11s", size: 15, anim: "anim-falling-petal-1", type: "marigold" },
    { id: 2, left: "22%", delay: "2.3s", duration: "13s", size: 16, anim: "anim-falling-petal-2", type: "jasmine" },
    { id: 3, left: "38%", delay: "0.9s", duration: "10s", size: 14, anim: "anim-falling-petal-1", type: "marigold" },
    { id: 4, left: "62%", delay: "3.2s", duration: "12s", size: 15, anim: "anim-falling-petal-2", type: "jasmine" },
    { id: 5, left: "78%", delay: "1.5s", duration: "14s", size: 17, anim: "anim-falling-petal-1", type: "marigold" },
    { id: 6, left: "91%", delay: "4.1s", duration: "10.5s", size: 14, anim: "anim-falling-petal-2", type: "jasmine" },
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
          {p.type === "marigold" ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 20 26"
              className="drop-shadow-[0_2px_6px_rgba(212,140,20,0.4)]"
            >
              <path
                d="M10 0 C16 5 20 14 18 20 C16 26 4 26 2 20 C0 14 4 5 10 0 Z"
                fill="url(#marigoldGrad)"
              />
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size * 1.25}
              viewBox="0 0 20 25"
              className="drop-shadow-[0_2px_6px_rgba(200,180,140,0.3)]"
            >
              <path
                d="M10 0 C15 5 19 13 17 19 C15 25 5 25 3 19 C1 13 5 5 10 0 Z"
                fill="url(#jasmineGrad)"
              />
            </svg>
          )}
        </div>
      ))}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="marigoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="jasmineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#fef9ee" />
            <stop offset="100%" stopColor="#ecd6b1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ============================================================================
// 2. ORNAMENTAL GOLD DIVIDER & SECTION VIGNETTE
// ============================================================================
const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
    <span className="text-[#eed57c] text-xs">❖</span>
    <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#eed57c] to-transparent" />
  </div>
);

const SectionVignette = ({ hasSeam = true }: { hasSeam?: boolean }) => (
  <>
    {hasSeam && (
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/40 to-transparent" />
        <span className="absolute px-2.5 py-0.5 rounded-full bg-black/80 border-2 border-[#f59e0b]/50 text-[8px] text-[#eed57c] font-serif shadow-sm">
          ❖
        </span>
      </div>
    )}
  </>
);

// ============================================================================
// 3. MAIN TEMPLATE COMPONENT: MARIGOLD VIZHA (TAMIL CLASSIC)
// ============================================================================
export default function MarigoldVizhaTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bride = data.bride_name || "வித்யா (Vidhya)";
  const groom = data.groom_name || "கார்த்திக் (Karthik)";
  const quote =
    data.quote ||
    "அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை பண்பும் பயனும் அது — இரு மனங்கள் இணையும் இல்லறத் தொடக்கம்.";

  // Audio Playback
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
        day: 24,
        month: "NOVEMBER",
        year: 2026,
        weekday: "Tuesday",
        time: "07:30 AM",
        raw: new Date("2026-11-24T07:30:00"),
      };
    }
  };

  const weddingDateInfo = useMemo(() => parseDate(data.wedding_date), [data.wedding_date]);

  // Scroll Progress Tracker
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

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 60,
    hours: 12,
    minutes: 25,
    seconds: 30,
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

  // Scratch Canvas Logic
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

    // Metallic gold marigold gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#d8af56");
    goldGrad.addColorStop(0.2, "#fae6a2");
    goldGrad.addColorStop(0.45, "#c18c35");
    goldGrad.addColorStop(0.7, "#edd380");
    goldGrad.addColorStop(0.9, "#ab7726");
    goldGrad.addColorStop(1, "#855814");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() > 0.8 ? 2 : 1, Math.random() > 0.8 ? 2 : 1);
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = "rgba(100, 60, 10, 0.35)";
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.fillStyle = "#3e270c";
    ctx.font = "bold 11px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ செவ்வந்தி சுபமுகூர்த்தம் ✦", width / 2, height / 2 - 12);
    ctx.font = "bold 9px 'Cinzel', serif, sans-serif";
    ctx.fillText("SWIPE TO REVEAL DATE", width / 2, height / 2 + 6);
    ctx.font = "italic 8.5px serif";
    ctx.fillStyle = "#5c3a12";
    ctx.fillText("Scratch to unveil the sacred date", width / 2, height / 2 + 20);
  };

  useEffect(() => {
    if (isScratched) return;
    const tryInit = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width || canvas.offsetWidth);
      const h = Math.round(rect.height || canvas.offsetHeight);
      if (w > 20 && h > 20) initCanvas(w, h);
    };
    tryInit();
    const t = setTimeout(tryInit, 200);
    window.addEventListener("resize", tryInit);
    return () => {
      clearTimeout(t);
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

    if (Math.random() > 0.5) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) clear++;
        }
        const percent = Math.round((clear / (imgData.data.length / 16)) * 100);
        if (percent > 35) setIsScratched(true);
      } catch {}
    }
  };

  // Moments Carousel
  const defaultMoments = [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=900",
  ];

  const parsedImages = data.slideshow_images
    ? data.slideshow_images.split(",").map((s) => s.trim()).filter(Boolean)
    : defaultMoments;
  const momentsList = parsedImages.length > 0 ? parsedImages : defaultMoments;
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) setActivePhotoIdx((prev) => (prev + 1) % momentsList.length);
    else if (diff < -40) setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length);
    touchStartX.current = null;
  };

  // RSVP State
  const [rsvpStatus, setRsvpStatus] = useState<"none" | "attending" | "declined">("none");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [rsvpSaved, setRsvpSaved] = useState(false);

  const venueLocation =
    data.gmap_coordinates || data.wedding_venue || "ஸ்ரீ கிருஷ்ணா திருமண மஹால், சென்னை";
  const gmapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueLocation
  )}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    venueLocation
  )}&t=m&z=15&output=embed&iwloc=near`;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#170e06] text-[#faeed3] font-serif overflow-x-hidden selection:bg-[#c69238] selection:text-black flex flex-col items-center"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, #29180a 0%, #0d0702 100%)",
      }}
    >
      <MarigoldPetalsOverlay />

      {/* Floating Sound Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#eed57c]/60 shadow-[0_4px_18px_rgba(0,0,0,0.7)] text-[#eed57c] hover:border-[#eed57c] hover:scale-105 transition-all duration-300"
          title="Toggle Music"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#eed57c] animate-pulse" />
              <span className="text-[10px] tracking-widest font-marcellus font-bold uppercase text-[#2b1704]">
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

      {/* Main Unified Mobile-First Portrait Stack */}
      <div className="relative w-full max-w-[440px] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION: MARIGOLD & PEACOCK TEMPLE ARCH                      */}
        {/* ===================================================================== */}
        <section className="relative w-full aspect-[9/16] min-h-[640px] overflow-hidden flex flex-col items-center justify-between text-center pt-8 pb-6 px-4 bg-cover bg-center">
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 will-change-transform"
            style={{
              backgroundImage: "url('/images/marigold-vizha/marigold_hero_v7.jpg')",
              transform: `scale(${1 + scrollProgress * 0.12})`,
              transformOrigin: "50% 50%",
            }}
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* Top Emblem */}
          <div
            className="relative z-20 flex flex-col items-center transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `translateY(-${scrollProgress * 35}px)`,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1 text-[#eed57c]">
              <div className="w-8 h-[1px] bg-current opacity-80" />
              <span className="text-xs">❖</span>
              <div className="w-8 h-[1px] bg-current opacity-80" />
            </div>
            <h2 className="font-marcellus text-[11px] sm:text-xs tracking-[0.3em] text-[#2b1704] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              மங்கள செவ்வந்தி விழா
            </h2>
            <span className="font-marcellus text-[9px] sm:text-[9.5px] tracking-[0.35em] text-[#eed57c] uppercase font-bold">
              MARIGOLD HERITAGE WEDDING
            </span>
          </div>

          {/* Center Couple Names */}
          <div
            className="relative z-20 w-full flex flex-col items-center px-2 my-auto transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.6),
              transform: `translateY(-${scrollProgress * 50}px)`,
            }}
          >
            <p className="font-marcellus text-[10px] tracking-[0.32em] text-[#eed57c] uppercase font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              WE&apos;RE GETTING MARRIED
            </p>

            <h1 className="font-marcellus text-2xl sm:text-3xl md:text-[34px] font-semibold tracking-[0.14em] text-[#2b1704] uppercase leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              {bride}
            </h1>

            <div className="flex items-center justify-center gap-3 my-1.5 w-full">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
              <span className="font-great-vibes text-lg sm:text-xl text-[#eed57c] italic">
                weds
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#eed57c] to-transparent" />
            </div>

            <h1 className="font-marcellus text-2xl sm:text-3xl md:text-[34px] font-semibold tracking-[0.14em] text-[#2b1704] uppercase leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              {groom}
            </h1>

            <p className="font-marcellus text-xs sm:text-[13px] tracking-[0.2em] text-[#faedd0] uppercase font-bold mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              {weddingDateInfo.weekday}, {weddingDateInfo.day} {weddingDateInfo.month} {weddingDateInfo.year}
            </p>
          </div>

          {/* Scroll Prompt */}
          <div
            className="relative z-20 flex flex-col items-center gap-1 opacity-85 animate-bounce transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
          >
            <span className="text-[9px] tracking-[0.35em] text-[#eed57c] uppercase font-bold">
              SCROLL
            </span>
            <div className="w-4 h-6 rounded-full border border-[#eed57c]/70 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#eed57c] animate-pulse" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/45 to-transparent" />
            <span className="absolute px-2.5 py-0.5 rounded-full bg-black/80 border border-[#eed57c]/50 text-[8px] text-[#eed57c] font-serif shadow-sm">
              ❖
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. SACRED QUOTE & INVOCATION                                          */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_quote_v7.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[76%] max-w-[310px] flex flex-col items-center px-4 py-7 my-auto bg-[#fffdf9]/95 backdrop-blur-md rounded-3xl border-2 border-[#f59e0b]/50 shadow-[0_16px_40px_rgba(120,53,15,0.14)]"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-[#d97706]">
              <div className="w-6 h-[1px] bg-current" />
              <span className="text-xs">🌼</span>
              <div className="w-6 h-[1px] bg-current" />
            </div>
            <h2 className="font-marcellus text-lg sm:text-xl text-[#2b1704] font-bold leading-relaxed tracking-wide text-center">
              &ldquo;இரு மனங்கள் இணையும்
              <br />
              மங்கள செவ்வந்தித் தொடக்கம்&rdquo;
            </h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent my-3.5"
            />

            <p className="font-cormorant italic text-sm sm:text-base text-[#78350f] leading-relaxed text-center font-medium">
              {quote}
            </p>

            <div className="flex items-center gap-2 mt-3.5 text-[#eed57c]/80">
              <div className="w-8 h-[1px] bg-current" />
              <span className="text-xs">❖</span>
              <div className="w-8 h-[1px] bg-current" />
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 3. SCRATCH TO REVEAL: GOLD CARTOUCHE                                  */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center bg-cover bg-center overflow-hidden select-none"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_scratch_v7.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute rounded-[26px] sm:rounded-[32px] overflow-hidden flex flex-col items-center justify-center text-center z-15 shadow-[0_16px_40px_rgba(0,0,0,0.85)] border-2 border-[#d4af37]/70"
            style={{
              left: "24%",
              width: "52%",
              top: "26%",
              height: "44%",
            }}
          >
            {/* Card Backing */}
            <div
              className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-between py-3 px-2 text-center pointer-events-none select-none z-0"
              style={{
                backgroundImage: "url('/images/marigold-vizha/marigold_card_backing_v4.jpg')",
              }}
            >
              <div className="flex flex-col items-center pt-2">
                <span className="font-marcellus text-[8.5px] sm:text-[9.5px] tracking-[0.24em] text-[#7a3407] font-bold uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                  ✦ AUSPICIOUS MUHURTHAM ✦
                </span>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#9e6b22] to-transparent mt-0.5" />
              </div>

              <div className="flex flex-col items-center justify-center my-auto px-1">
                <div className="font-cormorant text-5xl sm:text-6xl font-bold text-[#230d02] leading-none tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  {weddingDateInfo.day}
                </div>
                <div className="font-marcellus text-xs sm:text-sm tracking-[0.28em] text-[#3b1704] font-bold uppercase mt-1">
                  {weddingDateInfo.month} {weddingDateInfo.year}
                </div>
                <div className="flex items-center gap-1.5 my-1 text-[#9e6b22]/70">
                  <div className="w-4 h-[1px] bg-current" />
                  <span className="text-[7px]">❖</span>
                  <div className="w-4 h-[1px] bg-current" />
                </div>
                <div className="font-marcellus text-[9.5px] sm:text-[10.5px] text-[#4a2406] font-bold tracking-wider">
                  {weddingDateInfo.weekday} · {weddingDateInfo.time}
                </div>
                <div className="font-cormorant italic text-[9.5px] sm:text-[10px] text-[#6b3509] font-semibold mt-0.5 line-clamp-1 max-w-[140px]">
                  {data.wedding_venue || "Sri Krishna Mahal"}
                </div>
              </div>

              <div className="pb-1 text-[7.5px] tracking-[0.2em] font-marcellus text-[#8a5518] uppercase font-bold">
                ❖ Save The Date ❖
              </div>
            </div>

            {/* Scratch Canvas */}
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
                if (e.touches[0]) handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              className={`absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-700 ${
                isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />

            {!isScratched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.75, 1, 0.75], y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="absolute bottom-2 pointer-events-none z-20 px-2.5 py-0.5 rounded-full bg-black/70 border border-[#eed57c]/60 text-[8px] font-marcellus text-[#2b1704] tracking-widest uppercase flex items-center gap-1 shadow-md"
              >
                <span>✨ Swipe To Reveal</span>
              </motion.div>
            )}
          </motion.div>

          {!isScratched && (
            <button
              type="button"
              onClick={() => setIsScratched(true)}
              className="absolute bottom-8 z-20 px-5 py-2 rounded-full bg-gradient-to-r from-[#241105] via-[#432009] to-[#241105] border border-[#eed57c] text-[#2b1704] text-[9.5px] tracking-[0.22em] uppercase font-marcellus font-bold hover:scale-105 hover:border-white active:scale-95 transition-all shadow-[0_4px_18px_rgba(0,0,0,0.85)] cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#eed57c]" />
              <span>Click To Reveal Date</span>
            </button>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 4. COUNTDOWN TIMER                                                    */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_countdown_v7.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[310px] sm:max-w-[330px] flex flex-col items-center py-7 px-4 bg-[#fffdf9]/95 backdrop-blur-md rounded-3xl border-2 border-[#f59e0b]/50 shadow-[0_20px_50px_rgba(120,53,15,0.18)]"
          >
            <div className="flex items-center justify-center gap-2 mb-1 text-[#d97706]">
              <div className="w-6 h-[1px] bg-current" />
              <span className="text-xs">❖</span>
              <div className="w-6 h-[1px] bg-current" />
            </div>
            <h3 className="font-marcellus text-lg sm:text-xl text-[#2b1704] tracking-[0.16em] uppercase font-bold">
              முஹூர்த்த கவுண்டவுன்
            </h3>
            <span className="font-marcellus text-[9px] tracking-[0.25em] text-[#b45309] uppercase font-bold mt-0.5">
              COUNTING DOWN TO FOREVER
            </span>
            <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent my-2.5" />

            <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
              {[
                { label: "DAYS (நாட்கள்)", value: timeLeft.days },
                { label: "HOURS (மணி)", value: timeLeft.hours },
                { label: "MINUTES (நிமிடம்)", value: timeLeft.minutes },
                { label: "SECONDS (நொடி)", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: "easeOut" }}
                  className="py-3.5 px-2 rounded-2xl bg-gradient-to-b from-[#ffffff] to-[#fff7ed] border border-[#f59e0b]/60 shadow-md flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />
                  <span className="font-cormorant text-4xl sm:text-5xl font-bold text-[#78350f] tabular-nums leading-none drop-shadow-xs">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="font-marcellus text-[8.5px] tracking-[0.15em] text-[#b45309] uppercase font-bold mt-1 text-center">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 5. WEDDING PROGRAM PARCHMENT SCROLL                                   */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[920px] text-center flex flex-col items-center justify-center px-3 py-12 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_program_v7.jpg')",
          }}
        >
          <div className="relative z-15 w-[94%] max-w-[340px] sm:max-w-[365px] mx-auto py-7 px-4 sm:px-5 rounded-3xl bg-[#fffdf9]/95 backdrop-blur-md border-2 border-[#f59e0b]/60 shadow-[0_20px_50px_rgba(120,53,15,0.18)] flex flex-col items-center">
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1.5 text-[#d97706]">
                <div className="w-8 h-[1px] bg-current" />
                <span className="text-sm">🌼</span>
                <div className="w-8 h-[1px] bg-current" />
              </div>
              <span className="font-marcellus text-[9px] tracking-[0.25em] text-[#b45309] uppercase font-bold mb-0.5">
                ✦ திருமண சுபநிகழ்ச்சிகள் ✦
              </span>
              <h2 className="font-marcellus text-xl sm:text-2xl text-[#2b1704] tracking-[0.16em] uppercase font-bold">
                Wedding Program
              </h2>
              <p className="font-cormorant italic text-xs sm:text-sm text-[#78350f] font-medium mt-0.5">
                Auspicious Traditional Rituals &amp; Celebrations
              </p>
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent mt-2.5" />
            </div>

            <div className="relative w-full flex flex-col items-center space-y-4 sm:space-y-5 z-10">
              <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[1.5px] bg-gradient-to-b from-[#f59e0b]/30 via-[#d97706] to-[#f59e0b]/30" />

              {/* Ritual 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full p-3.5 rounded-2xl bg-white/90 border border-[#fcd34d]/80 shadow-sm flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-1.5 text-[#b45309] text-[9.5px] font-marcellus font-bold tracking-wider uppercase mb-1">
                  <Clock className="w-3 h-3 text-[#d97706]" />
                  <span>காலை 06:00 AM - 07:30 AM</span>
                </div>
                <h4 className="font-marcellus text-sm font-bold text-[#2b1704] tracking-wide">
                  செவ்வந்தி சுபமுகூர்த்தம் (Muhurtham)
                </h4>
                <p className="font-cormorant italic text-xs text-[#78350f] font-medium mt-0.5">
                  மங்கல நாண் பூட்டுதல் &amp; அம்மி மிதித்தல்
                </p>
              </motion.div>

              {/* Ritual 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 w-full p-3.5 rounded-2xl bg-white/90 border border-[#fcd34d]/80 shadow-sm flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-1.5 text-[#b45309] text-[9.5px] font-marcellus font-bold tracking-wider uppercase mb-1">
                  <Clock className="w-3 h-3 text-[#d97706]" />
                  <span>காலை 08:30 AM onwards</span>
                </div>
                <h4 className="font-marcellus text-sm font-bold text-[#2b1704] tracking-wide">
                  திருமண விருந்து (Traditional Feast)
                </h4>
                <p className="font-cormorant italic text-xs text-[#78350f] font-medium mt-0.5">
                  தலைவாழை இலை அறுசுவை உணவு
                </p>
              </motion.div>

              {/* Ritual 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 w-full p-3.5 rounded-2xl bg-white/90 border border-[#fcd34d]/80 shadow-sm flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-1.5 text-[#b45309] text-[9.5px] font-marcellus font-bold tracking-wider uppercase mb-1">
                  <Clock className="w-3 h-3 text-[#d97706]" />
                  <span>மாலை 06:30 PM onwards</span>
                </div>
                <h4 className="font-marcellus text-sm font-bold text-[#2b1704] tracking-wide">
                  மங்கள வரவேற்பு (Reception)
                </h4>
                <p className="font-cormorant italic text-xs text-[#78350f] font-medium mt-0.5">
                  இனிய சங்கீத நாதம் &amp; ஆசீர்வாதம்
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6. OUR MOMENTS CAROUSEL                                               */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_moments_v7.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center z-15"
          >
            <h2 className="font-marcellus text-xl sm:text-2xl text-[#2b1704] tracking-[0.18em] uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              மகிழ்ச்சியான தருணங்கள்
            </h2>
            <p className="font-cormorant italic text-xs sm:text-sm text-[#eed57c] font-semibold mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
              Glimpses of our journey together
            </p>

            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[370px] sm:max-w-[410px] flex items-center justify-center min-h-[340px] sm:min-h-[380px]"
            >
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
                <div className="absolute inset-0 bg-black/30" />
              </motion.div>

              <div className="relative z-20 w-60 sm:w-68 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] border-2 border-[#eed57c] select-none transform hover:scale-[1.02] transition-transform duration-300 bg-black">
                <img
                  src={momentsList[activePhotoIdx]}
                  alt="Couple Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#eed57c]/60 text-[10px] tracking-widest text-[#eed57c] font-marcellus font-bold">
                  {activePhotoIdx + 1} / {momentsList.length}
                </div>
              </div>

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
                <div className="absolute inset-0 bg-black/30" />
              </motion.div>

              <button
                type="button"
                aria-label="Previous Photo"
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length)
                }
                className="absolute left-0 sm:left-1 z-30 w-9 h-9 rounded-full bg-black/80 border border-[#eed57c] text-[#eed57c] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-xl cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next Photo"
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-0 sm:right-1 z-30 w-9 h-9 rounded-full bg-black/80 border border-[#eed57c] text-[#eed57c] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-xl cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-1.5 justify-center mt-4">
              {momentsList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Photo ${idx + 1}`}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activePhotoIdx === idx
                      ? "w-5 bg-[#c2912e]"
                      : "w-1.5 bg-[#c2912e]/30 hover:bg-[#c2912e]/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 7. VENUE & GOOGLE MAPS                                                */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_venue_v7.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center"
          >
            <h2 className="font-marcellus text-xl sm:text-2xl text-[#2b1704] tracking-[0.18em] uppercase font-bold mb-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              திருமண மஹால்
            </h2>
            <p className="font-cormorant italic text-xs sm:text-sm text-[#eed57c] font-semibold mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              Wedding Venue &amp; Navigation
            </p>

            <div className="w-full flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#eed57c] shadow-[0_15px_40px_rgba(0,0,0,0.65)] bg-[#fef8ee]">
                <div className="absolute top-0 inset-x-0 z-10 px-3 py-1.5 flex items-center justify-between text-xs bg-black/80 backdrop-blur-md border-b border-[#eed57c]/40">
                  <span className="font-marcellus text-[9.5px] tracking-wider uppercase font-bold text-[#2b1704] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#eed57c]" />
                    Interactive Map
                  </span>
                  <a
                    href={gmapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9.5px] font-marcellus tracking-wider uppercase font-bold text-[#eed57c] hover:underline flex items-center gap-1"
                  >
                    <span>View Larger</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="w-full h-full pt-7">
                  {isPreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/85 text-center p-4">
                      <MapPin className="w-8 h-8 text-[#eed57c] mb-2 animate-bounce" />
                      <span className="font-marcellus text-base text-[#2b1704] font-bold">
                        {data.wedding_venue || "ஸ்ரீ கிருஷ்ணா திருமண மஹால்"}
                      </span>
                      <span className="font-cormorant text-xs sm:text-sm text-[#eed57c]/90 mt-1 max-w-[220px]">
                        {data.wedding_venue || "123, ஜிஎസ്ടி சாலை, குரோம்பேட்டை, சென்னை - 600044"}
                      </span>
                      <a
                        href={gmapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 px-4 py-1.5 rounded-full bg-[#eed57c]/20 border border-[#eed57c]/60 text-[#eed57c] text-[9.5px] font-marcellus font-bold uppercase tracking-widest hover:bg-[#eed57c] hover:text-black transition"
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

              <div className="w-full mt-3.5 p-4 rounded-xl bg-[#1c1209]/95 border border-[#eed57c]/60 shadow-2xl flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 mb-1 text-[#eed57c]">
                  <div className="w-6 h-[1px] bg-current opacity-60" />
                  <span className="text-xs">❖</span>
                  <div className="w-6 h-[1px] bg-current opacity-60" />
                </div>

                <h3 className="font-marcellus text-base sm:text-lg font-bold text-[#2b1704] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {data.wedding_venue || "ஸ்ரீ கிருஷ்ணா திருமண மஹால்"}
                </h3>
                <p className="font-cormorant text-xs sm:text-[13px] text-[#faedd0] mt-1 leading-relaxed max-w-[280px]">
                  {data.wedding_venue || "123, ஜிஎസ്ടி சாலை, குரோம்பேட்டை, சென்னை - 600044"}
                </p>
                <a
                  href={gmapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] text-[#1c0f05] font-marcellus text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-[0_4px_15px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-[#1c0f05]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 8. RSVP CONCIERGE                                                     */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_rsvp_v7.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[310px] sm:max-w-[330px] flex flex-col items-center"
          >
            <div className="w-full rounded-2xl bg-[#140b05]/94 backdrop-blur-md border-2 border-[#f59e0b]/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />

              <h2 className="font-marcellus text-xl sm:text-2xl text-[#2b1704] tracking-[0.2em] uppercase font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                வருகையை உறுதிசெய்க
              </h2>
              <GoldDivider className="my-2 opacity-90" />
              <p className="font-cormorant italic text-sm text-[#faeed3] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                தங்கள் நல்வரவை ஆவலுடன் எதிர்நோக்குகிறோம்
              </p>

              {rsvpSaved ? (
                <div className="p-4 rounded-xl bg-black/70 border border-[#eed57c]/60 text-center w-full shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#eed57c]/20 border-2 border-[#eed57c] flex items-center justify-center mx-auto mb-2 text-[#eed57c] shadow-md">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-marcellus text-sm text-[#2b1704] uppercase tracking-wider font-bold">
                    {rsvpStatus === "attending" ? "நன்றியுடன் பதிவு செய்யப்பட்டது!" : "தகவல் பெறப்பட்டது"}
                  </h4>
                  <p className="font-cormorant text-xs sm:text-sm text-[#faedd0] mt-1.5 leading-relaxed">
                    {rsvpStatus === "attending"
                      ? "தங்கள் வருகைக்கும் நல்லாசிகளுக்கும் எங்கள் மனமார்ந்த நன்றிகள்."
                      : "தங்களின் அன்பான வாழ்த்துகள் எங்கள் நெஞ்சில் நிலைத்திருக்கும்."}
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("attending")}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-marcellus text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                        rsvpStatus === "attending"
                          ? "bg-gradient-to-r from-[#eed57c] to-[#c59a3f] text-[#1c0f05] border-2 border-white ring-2 ring-[#eed57c]/50 scale-[1.02]"
                          : "bg-[#251508]/85 text-[#faedd0] hover:bg-[#341d0b] border border-[#eed57c]/50"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>வருகை தருகிறோம்</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-marcellus text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                        rsvpStatus === "declined"
                          ? "bg-[#541217] text-[#ffe4e6] border-2 border-[#f87171] ring-2 ring-[#f87171]/40 scale-[1.02]"
                          : "bg-[#251508]/85 text-[#faedd0]/80 hover:bg-[#341d0b] border border-[#eed57c]/50"
                      }`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>இயலவில்லை</span>
                    </button>
                  </div>

                  {rsvpStatus !== "none" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full space-y-3 text-left mt-1"
                    >
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] font-marcellus text-[#eed57c] uppercase font-bold mb-1">
                          அழைப்பாளர் / குடும்பப் பெயர்
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="எ.கா. சுந்தரம் & குடும்பத்தினர்"
                          className="w-full px-3 py-2 rounded-xl bg-black/75 border-2 border-[#eed57c]/50 text-xs sm:text-sm text-[#2b1704] placeholder-[#faedd0]/60 font-cormorant focus:outline-none focus:border-[#eed57c]"
                        />
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] font-marcellus text-[#eed57c] uppercase font-bold mb-1">
                            வருகையாளர்கள் எண்ணிக்கை
                          </label>
                          <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1c1006] border-2 border-[#eed57c]/50 text-xs sm:text-sm text-[#2b1704] font-cormorant focus:outline-none focus:border-[#eed57c]"
                          >
                            <option value="1">1 நபர்</option>
                            <option value="2">2 நபர்கள்</option>
                            <option value="3">3 நபர்கள்</option>
                            <option value="4+">குடும்பத்தினர் (4+ நபர்கள்)</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setRsvpSaved(true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#eed57c] via-[#f5e6a8] to-[#c59a3f] text-[#1c0f05] font-marcellus text-xs uppercase font-bold tracking-[0.2em] hover:brightness-110 active:scale-98 transition shadow-[0_4px_16px_rgba(238,213,124,0.4)] cursor-pointer mt-1"
                      >
                        உறுதிப்படுத்துக (Confirm RSVP)
                      </button>
                    </motion.div>
                  )}

                  {data.rsvp_phone && (
                    <div className="pt-2 border-t border-[#eed57c]/30 w-full flex items-center justify-center">
                      <a
                        href={`tel:${data.rsvp_phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#eed57c] hover:text-[#2b1704] font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>தொடர்புக்கு: {data.rsvp_phone}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 9. FOOTER & BLESSINGS SIGN-OFF                                        */}
        {/* ===================================================================== */}
        <footer
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/marigold-vizha/marigold_footer_v7.jpg')",
          }}
        >
          <SectionVignette hasSeam={false} />
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[320px] flex flex-col items-center px-4 py-7 rounded-3xl bg-[#fffdf9]/95 backdrop-blur-md border-2 border-[#f59e0b]/50 shadow-[0_16px_40px_rgba(120,53,15,0.18)]"
          >
            <span className="font-cormorant italic text-sm sm:text-base text-[#eed57c] block mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              எங்கள் இல்லத் திருமண விழாவிற்கு வருகை தந்து வாழ்த்த வேண்டுகிறோம்,
            </span>
            <h4 className="font-great-vibes text-5xl sm:text-6xl text-[#2b1704] drop-shadow-[0_4px_16px_rgba(0,0,0,1)] tracking-wide leading-tight">
              {bride} &amp; {groom}
            </h4>

            <div className="flex items-center justify-center gap-2 my-2.5 text-[#eed57c]">
              <div className="w-10 h-[1px] bg-current opacity-80" />
              <Heart className="w-3.5 h-3.5 fill-current" />
              <div className="w-10 h-[1px] bg-current opacity-80" />
            </div>

            {data.family_names && (
              <p className="font-marcellus text-xs sm:text-[13px] tracking-[0.22em] text-[#faedd0] uppercase font-bold my-1 text-center drop-shadow-[0_2px_6px_rgba(0,0,0,1)] leading-relaxed">
                அன்புடன் அழைக்கும் {data.family_names}
              </p>
            )}

            <div className="mt-3 flex justify-center w-full">
              <div className="rounded-full bg-black/80 backdrop-blur-md border border-[#eed57c]/50 shadow-xl hover:border-[#eed57c] hover:bg-black/95 transition-all hover:scale-105 active:scale-95">
                <CreatedByVarnam
                  theme="gold"
                  className="py-1 px-4 text-[#2b1704] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                />
              </div>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
