"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import CreatedByVarnam from "@/components/CreatedByVarnam";

// ============================================================================
// 1. FLOATING ROSE PETALS PARTICLES
// ============================================================================
const RosePetalsOverlay = () => {
  const petals = [
    { id: 1, left: "6%", delay: "0s", duration: "10s", size: 14, anim: "anim-falling-petal-1" },
    { id: 2, left: "20%", delay: "2.2s", duration: "12s", size: 17, anim: "anim-falling-petal-2" },
    { id: 3, left: "36%", delay: "0.8s", duration: "9.5s", size: 13, anim: "anim-falling-petal-1" },
    { id: 4, left: "64%", delay: "3.1s", duration: "11s", size: 15, anim: "anim-falling-petal-2" },
    { id: 5, left: "80%", delay: "1.4s", duration: "13s", size: 18, anim: "anim-falling-petal-1" },
    { id: 6, left: "92%", delay: "3.8s", duration: "10.5s", size: 14, anim: "anim-falling-petal-2" },
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
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 20 26"
            className="drop-shadow-[0_2px_6px_rgba(180,20,30,0.6)]"
          >
            <path
              d="M10 0 C16 6 20 14 18 20 C16 26 4 26 2 20 C0 14 4 6 10 0 Z"
              fill="url(#kovilRoseGrad)"
            />
          </svg>
        </div>
      ))}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="kovilRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="55%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ============================================================================
// 2. ORNAMENTAL GOLD DIVIDER & SEAMLESS SECTION TRANSITION BLENDERS
// ============================================================================
const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
    <span className="text-[#eed57c] text-xs">❖</span>
    <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#eed57c] to-transparent" />
  </div>
);

// Atmospheric vignette gradient masks to seamlessly blend section boundaries
const SectionVignette = ({ hasSeam = true }: { hasSeam?: boolean }) => (
  <>
    {/* Top shadow fade-in from atmospheric darkness */}
    <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
    {/* Bottom shadow fade-out into atmospheric darkness */}
    <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
    {/* Luxury hairline gold seam at the boundary */}
    {hasSeam && (
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/40 to-transparent" />
        <span className="absolute px-2.5 py-0.5 rounded-full bg-black/80 border border-[#eed57c]/40 text-[8px] text-[#eed57c] font-serif shadow-sm">
          ❖
        </span>
      </div>
    )}
  </>
);

// ============================================================================
// 3. MAIN TEMPLATE COMPONENT
// ============================================================================
export default function KovilThirumanamTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Couple names & text
  const bride = data.bride_name || "Sriya";
  const groom = data.groom_name || "Karthik";
  const quote = data.quote || "A beautiful beginning to forever.";

  // Format wedding date
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
        day: 20,
        month: "DECEMBER",
        year: 2026,
        weekday: "Sunday",
        time: "07:30 AM",
        raw: new Date("2026-12-20T07:30:00"),
      };
    }
  };

  const weddingDateInfo = parseDate(data.wedding_date);

  // --------------------------------------------------------------------------
  // CONTAINER-AWARE SMOOTH SCROLL REVEAL FOR HERO TEMPLE
  // Works both in window scroll and inside overflow-y-auto preview containers
  // --------------------------------------------------------------------------
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
      // Over the first 280px of scroll, progress from 0 to 1
      const progress = Math.min(1, Math.max(0, currentScroll / 260));
      setScrollProgress(progress);
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  // --------------------------------------------------------------------------
  // COUNTDOWN TIMER LOGIC
  // --------------------------------------------------------------------------
  const [timeLeft, setTimeLeft] = useState({
    days: 76,
    hours: 19,
    minutes: 9,
    seconds: 54,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = weddingDateInfo.raw.getTime();
      const now = new Date().getTime();
      const diff = target - now;

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
  }, [data.wedding_date]);

  // --------------------------------------------------------------------------
  // INTERACTIVE SCRATCH CARD LOGIC - PRECISION ALIGNED TO GOLD CARTOUCHE
  // --------------------------------------------------------------------------
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

    // Rich metallic antique gold foil gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#d8af56");
    goldGrad.addColorStop(0.2, "#fae6a2");
    goldGrad.addColorStop(0.45, "#c18c35");
    goldGrad.addColorStop(0.7, "#edd380");
    goldGrad.addColorStop(0.9, "#ab7726");
    goldGrad.addColorStop(1, "#855814");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Stippled foil grain for realistic metallic brush feel
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

    // Inner embossed border on foil
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = "rgba(100, 60, 10, 0.35)";
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Centered instruction text
    ctx.fillStyle = "#3e270c";
    ctx.font = "bold 10px 'Cinzel', serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH WITH FINGER", width / 2, height / 2 - 8);
    ctx.font = "italic 9px serif";
    ctx.fillStyle = "#5c3a12";
    ctx.fillText("to reveal the sacred date", width / 2, height / 2 + 8);
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
    if (!canvasRef.current || isScratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, false);
    ctx.fill();

    // Check scratch completion percentage
    if (Math.random() > 0.4) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) clear++;
        }
        const percent = Math.round((clear / (imgData.data.length / 16)) * 100);
        if (percent > 28) {
          setIsScratched(true);
        }
      } catch {}
    }
  };

  // --------------------------------------------------------------------------
  // OUR MOMENTS (3D POLAROID FAN GALLERY)
  // --------------------------------------------------------------------------
  const defaultMoments = [
    "/images/couples/temple-gold.jpg",
    "/images/couples/mangalam.jpg",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900",
    "/images/couples/temple-grandeur.jpg",
  ];

  const parsedImages = data.slideshow_images
    ? data.slideshow_images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : defaultMoments;
  const momentsList = parsedImages.length >= 5 ? parsedImages : defaultMoments;

  const [activePhotoIdx, setActivePhotoIdx] = useState(2); // Center photo default
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

  // --------------------------------------------------------------------------
  // RSVP INTERACTIVE MODAL / CONFIRMATION
  // --------------------------------------------------------------------------
  const [rsvpStatus, setRsvpStatus] = useState<"none" | "attending" | "declined">("none");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [rsvpSaved, setRsvpSaved] = useState(false);

  // Google Maps navigation link
  const venueLocation =
    data.gmap_coordinates || data.wedding_venue || "Sri Krishna Mahal Chromepet Chennai";
  const gmapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueLocation
  )}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    venueLocation
  )}&t=m&z=15&output=embed&iwloc=near`;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#120b06] text-[#faedd0] font-serif overflow-x-hidden selection:bg-[#c69238] selection:text-black flex flex-col items-center"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, #241407 0%, #0d0704 100%)",
      }}
    >
      {/* Floating 3D Rose Petals Simulation */}
      <RosePetalsOverlay />

      {/* Main Unified Template Card - Seamless portrait stack */}
      <div className="relative w-full max-w-[440px] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION: TEMPLE ENTRANCE & SMOOTH SCROLL REVEAL               */}
        {/* ===================================================================== */}
        <section className="relative w-full aspect-[9/16] min-h-[640px] overflow-hidden flex flex-col items-center justify-between text-center pt-8 pb-6 px-4 bg-cover bg-center">
          {/* Temple Entrance Background with Camera Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 will-change-transform"
            style={{
              backgroundImage: "url('/images/kovil/kovil_temple_entrance.jpg')",
              transform: `scale(${1 + scrollProgress * 0.12})`,
              transformOrigin: "50% 50%",
            }}
          />

          {/* Soft atmospheric gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-[#1e1107] pointer-events-none" />

          {/* Top Venkateswara Sacred Namam */}
          <div
            className="relative z-20 flex flex-col items-center transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `translateY(-${scrollProgress * 35}px)`,
            }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-6 bg-gradient-to-b from-white to-[#f5ebd2] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#e52d27] to-[#b31217] rounded-full shadow-[0_0_12px_rgba(229,45,39,0.95)]" />
              <div className="w-1.5 h-6 bg-gradient-to-b from-white to-[#f5ebd2] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            </div>
            <p className="font-serif text-[11px] tracking-[0.22em] text-[#faedd0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              With the blessings of
            </p>
            <p className="font-serif text-[11px] tracking-[0.22em] text-[#faedd0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              Lord Venkateswara
            </p>
          </div>

          {/* Center Couple Names & Details (Fades & lifts when scrolling down) */}
          <div
            className="relative z-20 w-full flex flex-col items-center px-2 my-auto transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.6),
              transform: `translateY(-${scrollProgress * 50}px)`,
            }}
          >
            <p className="font-serif text-[10px] tracking-[0.35em] text-[#eed57c] uppercase font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              WE&apos;RE GETTING MARRIED
            </p>

            {/* Bride Name */}
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold tracking-[0.18em] text-[#fff9e6] uppercase leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              {bride}
            </h1>

            {/* Weds Divider */}
            <div className="flex items-center justify-center gap-3 my-2 w-full">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
              <span className="font-serif text-xs tracking-[0.25em] text-[#eed57c] uppercase">
                WEDS
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#eed57c] to-transparent" />
            </div>

            {/* Groom Name */}
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold tracking-[0.18em] text-[#fff9e6] uppercase leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              {groom}
            </h1>

            {/* Subtitle */}
            <p className="font-serif text-[11px] tracking-[0.16em] text-[#faedd0]/95 mt-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              Two hearts · One journey · A lifetime together
            </p>
          </div>

          {/* Bottom Scroll Prompt */}
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

          {/* Seamless Bottom Atmospheric Vignette & Transition Seam */}
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-15" />
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/45 to-transparent" />
            <span className="absolute px-2.5 py-0.5 rounded-full bg-black/80 border border-[#eed57c]/50 text-[8px] text-[#eed57c] font-serif shadow-sm">
              ❖
            </span>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. QUOTE SECTION: TALL ROYAL FRAMED MAROON TAPESTRY                  */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_quote_tall_maroon.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[58%] max-w-[260px] flex flex-col items-center px-2 py-6 my-auto"
          >
            {/* Sacred Tamil Calligraphy in Glistening Gold */}
            <h2 className="font-serif text-lg sm:text-xl text-[#fff9e6] font-semibold leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              &ldquo;இரு மனங்கள் இணையும்
              <br />
              இனிய தருணம்.&rdquo;
            </h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent my-3.5"
            />

            {/* Custom English Quote */}
            <p className="font-serif italic text-xs sm:text-sm text-[#eed57c] leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
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
        {/* 3. SCRATCH TO REVEAL: ANTIQUE GOLD FILIGREE PLAQUE (PERFECTLY FITTED) */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center bg-cover bg-center overflow-hidden select-none"
          style={{
            backgroundImage: "url('/images/kovil/kovil_scratch_portrait.jpg')",
          }}
        >
          <SectionVignette />
          {/* Exact Gold Cartouche Box (27.5% left, 45% width, 27.5% top, 40.5% height) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.93 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute rounded-[28px] sm:rounded-[36px] overflow-hidden flex flex-col items-center justify-between py-4 px-3 text-center z-15"
            style={{
              left: "27.5%",
              width: "45%",
              top: "27.5%",
              height: "40.5%",
            }}
          >
            {/* Header Text - Hidden once scratched */}
            {!isScratched ? (
              <div className="flex flex-col items-center pointer-events-none pt-2 transition-opacity duration-500">
                <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.2em] text-[#3e270c] font-extrabold uppercase">
                  Scratch to Reveal
                </span>
                <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.2em] text-[#3e270c] font-bold uppercase">
                  Our Wedding Date
                </span>
                <div className="w-8 h-[1px] bg-[#3e270c]/40 mt-1" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pt-2 text-[#4a2b0b] pointer-events-none animate-fadeIn">
                <div className="w-4 h-[1px] bg-current opacity-60" />
                <span className="text-[8px]">❖</span>
                <span className="font-serif text-[8.5px] sm:text-[9.5px] tracking-[0.22em] text-[#3e2206] uppercase font-bold">
                  Save The Date
                </span>
                <span className="text-[8px]">❖</span>
                <div className="w-4 h-[1px] bg-current opacity-60" />
              </div>
            )}

            {/* Revealed Date Layer with Rich High-Contrast Typography */}
            <div className="flex flex-col items-center justify-center pointer-events-none my-auto">
              <span className="font-serif text-4xl sm:text-5xl font-black text-[#1e0d02] leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] tracking-tight">
                {weddingDateInfo.day}
              </span>
              <span className="font-serif text-xs sm:text-sm font-black tracking-[0.24em] text-[#381a04] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] mt-1">
                {weddingDateInfo.month}
              </span>
              <span className="font-serif text-[11px] sm:text-xs font-black tracking-[0.3em] text-[#522907] mt-0.5">
                {weddingDateInfo.year}
              </span>
              <div className="text-[8px] sm:text-[9px] tracking-wider text-[#3d1c03] font-bold uppercase mt-1.5 px-2.5 py-0.5 rounded-full bg-[#3e270c]/10 border border-[#3e270c]/25">
                {weddingDateInfo.weekday} · {weddingDateInfo.time}
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="flex items-center gap-1.5 pointer-events-none pb-2 text-[#5c3e16]/60">
              <div className="w-4 h-[1px] bg-current" />
              <span className="text-[8px]">❖</span>
              <div className="w-4 h-[1px] bg-current" />
            </div>

            {/* Precision Scratch Canvas Overlay */}
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
              className={`absolute inset-0 w-full h-full rounded-[28px] sm:rounded-[36px] cursor-pointer transition-opacity duration-700 ${
                isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
          </motion.div>

          {/* Click to Reveal fallback button */}
          {!isScratched && (
            <button
              type="button"
              onClick={() => setIsScratched(true)}
              className="absolute bottom-10 z-20 px-4 py-1.5 rounded-full bg-black/75 border border-[#eed57c]/60 text-[#eed57c] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#eed57c] hover:text-black transition cursor-pointer shadow-md"
            >
              Click To Reveal Date
            </button>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 4. OUR MOMENTS: 3D POLAROID FAN PHOTO CAROUSEL                        */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_moments_portrait.jpg')",
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
            <h2 className="font-cinzel text-xl sm:text-2xl text-[#2e1d0f] tracking-wider uppercase font-bold">
              Our Moments
            </h2>
            <p className="font-serif italic text-xs text-[#5c3e16] mb-6">
              A few glimpses of our journey
            </p>

            {/* Grand Borderless Photo Slideshow (No White Polaroid Card) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[370px] sm:max-w-[410px] flex items-center justify-center min-h-[340px] sm:min-h-[380px]"
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
                <div className="absolute inset-0 bg-black/30" />
              </motion.div>

              {/* Center Featured Photo (idx) - Big, crisp, no white border */}
              <div className="relative z-20 w-60 sm:w-68 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-2 border-[#eed57c] select-none transform hover:scale-[1.02] transition-transform duration-300 bg-black">
                <img
                  src={momentsList[activePhotoIdx]}
                  alt="Couple Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Counter Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#eed57c]/60 text-[10px] tracking-widest text-[#eed57c] font-bold">
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
                <div className="absolute inset-0 bg-black/30" />
              </motion.div>

              {/* Chevron Navigation Buttons */}
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
                      ? "w-5 bg-[#966b2d]"
                      : "w-1.5 bg-[#966b2d]/30 hover:bg-[#966b2d]/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 5. COUNTING DOWN TO FOREVER: STONE SANCTUM (NO RED CARPET)            */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_countdown_stone.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[280px] sm:max-w-[300px] flex flex-col items-center py-6 px-3"
          >
            <h3 className="font-cinzel text-lg sm:text-xl text-[#2e1a0d] tracking-wider uppercase font-extrabold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              Counting Down to Forever
            </h3>
            <GoldDivider className="my-2.5 opacity-90" />

            {/* 4 Countdown Boxes with Staggered Modern Animation */}
            <div className="grid grid-cols-2 gap-2.5 w-full mt-3">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINUTES", value: timeLeft.minutes },
                { label: "SECONDS", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: "easeOut" }}
                  className="py-3 px-2 rounded-xl bg-[#261005]/88 border border-[#d4af37]/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-xs flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
                  <span className="font-cinzel text-3xl font-extrabold text-[#fff2b2] tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(238,213,124,0.4)]">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-[9px] tracking-[0.18em] text-[#eed57c] uppercase font-bold mt-1 text-center">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 6. WEDDING PROGRAM / TIMELINE WITH VISIBLE TEMPLE ELEPHANTS           */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[880px] sm:min-h-[940px] text-center flex flex-col items-center justify-center px-2 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_timeline_elephants.jpg')",
          }}
        >
          <SectionVignette />
          {/* Framed within center sandstone column (w-[56%] max-w-[260px]) */}
          {/* Leaving both the left elephant (0-22%) and right elephant (78-100%) 100% visible! */}
          <div className="relative z-15 w-[56%] max-w-[260px] sm:max-w-[280px] flex flex-col items-center mx-auto py-8">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center mb-6"
            >
              <h2 className="font-serif text-base sm:text-lg text-[#1a0b01] tracking-wider uppercase font-black mb-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                Wedding Program
              </h2>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#4a2608] font-bold mb-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                Auspicious Timings
              </p>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#b38827] to-transparent" />
            </motion.div>

            {/* Central Connected Timeline with Gold Markers & One-by-One Staggered Scroll Reveal */}
            <div className="relative w-full flex flex-col items-center space-y-8 sm:space-y-9">
              {/* Vertical connecting gold rod */}
              <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#b8860b]/40 via-[#d4af37] to-[#b8860b]/40" />

              {/* Event 1: Nichayathartham */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center"
              >
                <div className="w-6 h-6 rounded-full bg-[#fcedc7] border-2 border-[#b8860b] shadow-md flex items-center justify-center text-[11px] text-[#542d07] font-black mb-1 ring-2 ring-[#784f18]/20">
                  1
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] text-[#783e0a] uppercase font-black block leading-tight">
                  ENGAGEMENT
                </span>
                <h4 className="font-serif text-base sm:text-lg font-black text-[#1a0b01] leading-snug mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  Nichayathartham
                </h4>
                <div className="mt-1 font-sans text-xs sm:text-sm text-[#240e02] font-black leading-tight">
                  19 Dec 2026 · 06:00 PM
                </div>
                <div className="font-serif text-xs sm:text-[13px] text-[#422005] font-bold leading-tight mt-0.5">
                  Sri Krishna Mahal
                </div>
              </motion.div>

              {/* Event 2: Vratham */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center"
              >
                <div className="w-6 h-6 rounded-full bg-[#fcedc7] border-2 border-[#b8860b] shadow-md flex items-center justify-center text-[11px] text-[#542d07] font-black mb-1 ring-2 ring-[#784f18]/20">
                  2
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] text-[#783e0a] uppercase font-black block leading-tight">
                  SACRED RITUAL
                </span>
                <h4 className="font-serif text-base sm:text-lg font-black text-[#1a0b01] leading-snug mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  Vratham
                </h4>
                <div className="mt-1 font-sans text-xs sm:text-sm text-[#240e02] font-black leading-tight">
                  20 Dec 2026 · 09:00 AM
                </div>
                <div className="font-serif text-xs sm:text-[13px] text-[#422005] font-bold leading-tight mt-0.5">
                  Sri Krishna Mahal
                </div>
              </motion.div>

              {/* Event 3: Kalyana Muhurtham (Apex Highlight) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center"
              >
                <div className="w-7 h-7 rounded-full bg-[#7a0d18] border-2 border-[#eed57c] shadow-lg flex items-center justify-center text-xs text-[#fff2b2] font-black mb-1 ring-2 ring-[#7a0d18]/40">
                  ❖
                </div>
                <span className="font-sans text-[11px] sm:text-xs tracking-[0.24em] text-[#7a0914] uppercase font-black block leading-tight">
                  SACRED MUHURTHAM
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-black text-[#45040b] leading-snug mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  Kalyana Muhurtham
                </h4>
                <div className="mt-1 font-sans text-sm sm:text-base text-[#240307] font-black leading-tight">
                  {weddingDateInfo.day} {weddingDateInfo.month} · {weddingDateInfo.time}
                </div>
                <div className="font-serif text-xs sm:text-sm text-[#5e0710] font-black leading-tight mt-0.5">
                  {data.wedding_venue || "Sri Krishna Mahal"}
                </div>
              </motion.div>

              {/* Event 4: Reception Feast */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full flex flex-col items-center text-center"
              >
                <div className="w-6 h-6 rounded-full bg-[#fcedc7] border-2 border-[#b8860b] shadow-md flex items-center justify-center text-[11px] text-[#542d07] font-black mb-1 ring-2 ring-[#784f18]/20">
                  4
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] text-[#783e0a] uppercase font-black block leading-tight">
                  GALA RECEPTION
                </span>
                <h4 className="font-serif text-base sm:text-lg font-black text-[#1a0b01] leading-snug mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  Reception Feast
                </h4>
                <div className="mt-1 font-sans text-xs sm:text-sm text-[#240e02] font-black leading-tight">
                  {data.reception_date
                    ? parseDate(data.reception_date).day +
                      " " +
                      parseDate(data.reception_date).month +
                      " · " +
                      parseDate(data.reception_date).time
                    : "20 Dec · 06:30 PM"}
                </div>
                <div className="font-serif text-xs sm:text-[13px] text-[#422005] font-bold leading-tight mt-0.5">
                  {data.reception_venue || "Sri Krishna Mahal"}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 7. VENUE & GOOGLE MAPS: SQUARE MAP WITH DETAILS UNDERNEATH             */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_moments_portrait.jpg')",
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
            <h2 className="font-cinzel text-xl sm:text-2xl text-[#1a0f07] tracking-wider uppercase font-black mb-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
              Venue
            </h2>
            <p className="font-serif italic text-xs text-[#4a2e12] font-bold mb-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              We look forward to welcoming you
            </p>

            <div className="w-full flex flex-col items-center">
              {/* Big Square Google Map */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#eed57c] shadow-[0_15px_40px_rgba(0,0,0,0.65)] bg-[#150d06]">
                {/* Map top bar */}
                <div className="absolute top-0 inset-x-0 z-10 px-3 py-1.5 flex items-center justify-between text-xs bg-black/80 backdrop-blur-md border-b border-[#eed57c]/40">
                  <span className="font-serif text-[10px] tracking-wider uppercase font-bold text-[#fff2b2] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#eed57c]" />
                    Interactive Map
                  </span>
                  <a
                    href={gmapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-wider uppercase font-bold text-[#eed57c] hover:underline flex items-center gap-1"
                  >
                    <span>View Larger</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="w-full h-full pt-7">
                  {isPreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/85 text-center p-4">
                      <MapPin className="w-8 h-8 text-[#eed57c] mb-2 animate-bounce" />
                      <span className="font-cinzel text-base text-[#fff2b2] font-bold">
                        {data.wedding_venue || "Sri Krishna Mahal"}
                      </span>
                      <span className="font-serif text-xs text-[#eed57c]/80 mt-1 max-w-[220px]">
                        {data.wedding_venue || "123, GST Road, Chromepet, Chennai - 600044"}
                      </span>
                      <a
                        href={gmapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 px-4 py-1.5 rounded-full bg-[#eed57c]/20 border border-[#eed57c]/60 text-[#eed57c] text-[10px] font-bold uppercase tracking-widest hover:bg-[#eed57c] hover:text-black transition"
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

              {/* Under GMAP: Venue Name, Address & Get Directions Button */}
              <div className="w-full mt-3.5 p-4 rounded-xl bg-[#1c1209]/95 border border-[#eed57c]/60 shadow-2xl flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-2 mb-1 text-[#eed57c]">
                  <div className="w-6 h-[1px] bg-current opacity-60" />
                  <span className="text-xs">❖</span>
                  <div className="w-6 h-[1px] bg-current opacity-60" />
                </div>

                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#fff2b2] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {data.wedding_venue || "Sri Krishna Mahal"}
                </h3>
                <p className="font-serif text-xs sm:text-[13px] text-[#faedd0] mt-1 leading-relaxed max-w-[280px]">
                  {data.wedding_venue || "123, GST Road, Chromepet, Chennai, Tamil Nadu 600044"}
                </p>
                <a
                  href={gmapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] text-[#1c0f05] font-serif text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-[0_4px_15px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-[#1c0f05]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 8. RSVP: REDESIGNED HIGH-CONTRAST TEMPLE CARD                         */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_rsvp_portrait.jpg')",
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
            {/* Royal Temple Card Container */}
            <div className="w-full rounded-2xl bg-[#140b05]/94 backdrop-blur-md border-2 border-[#d4af37]/75 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 flex flex-col items-center text-center relative overflow-hidden">
              {/* Top Inner Gold Accent Line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />

              <h2 className="font-cinzel text-xl sm:text-2xl text-[#fff2b2] tracking-[0.18em] uppercase font-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                RSVP
              </h2>
              <GoldDivider className="my-2 opacity-90" />
              <p className="font-serif italic text-xs text-[#faeed3] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                We would love to have you with us!
              </p>

              {rsvpSaved ? (
                <div className="p-4 rounded-xl bg-black/70 border border-[#eed57c]/60 text-center w-full shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#eed57c]/20 border-2 border-[#eed57c] flex items-center justify-center mx-auto mb-2 text-[#eed57c] shadow-md">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-cinzel text-sm text-[#fff2b2] uppercase tracking-wider font-extrabold">
                    {rsvpStatus === "attending" ? "Joyfully Confirmed!" : "Response Received"}
                  </h4>
                  <p className="font-serif text-xs text-[#faedd0] mt-1.5 leading-relaxed">
                    {rsvpStatus === "attending"
                      ? "Thank you warmly! We look forward to receiving your gracious blessings."
                      : "We will miss your presence, and carry your warm wishes in our hearts."}
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3">
                  {/* Attendance Choice Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("attending")}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-serif text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                        rsvpStatus === "attending"
                          ? "bg-gradient-to-r from-[#eed57c] to-[#c59a3f] text-[#1c0f05] border-2 border-white ring-2 ring-[#eed57c]/50 scale-[1.02]"
                          : "bg-[#251508]/85 text-[#faedd0] hover:bg-[#341d0b] border border-[#eed57c]/50"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Attending</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
                        rsvpStatus === "declined"
                          ? "bg-[#541217] text-[#ffe4e6] border-2 border-[#f87171] ring-2 ring-[#f87171]/40 scale-[1.02]"
                          : "bg-[#251508]/85 text-[#faedd0]/80 hover:bg-[#341d0b] border border-[#eed57c]/50"
                      }`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Can&apos;t Make It</span>
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
                        <label className="block text-[10px] tracking-[0.2em] font-cinzel text-[#eed57c] uppercase font-bold mb-1">
                          Guest / Family Name(s)
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="E.g. Sundaram & Family"
                          className="w-full px-3 py-2 rounded-xl bg-black/75 border-2 border-[#eed57c]/50 text-xs sm:text-sm text-[#fff9e6] placeholder-[#faedd0]/60 font-serif focus:outline-none focus:border-[#eed57c] focus:ring-1 focus:ring-[#eed57c]"
                        />
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] font-cinzel text-[#eed57c] uppercase font-bold mb-1">
                            Number of Attendees
                          </label>
                          <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1c1006] border-2 border-[#eed57c]/50 text-xs sm:text-sm text-[#fff9e6] font-serif focus:outline-none focus:border-[#eed57c]"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 Persons</option>
                            <option value="3">3 Persons</option>
                            <option value="4+">Family (4+ Persons)</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setRsvpSaved(true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#eed57c] via-[#f5e6a8] to-[#c59a3f] text-[#1c0f05] font-serif text-xs uppercase font-black tracking-[0.2em] hover:brightness-110 active:scale-98 transition shadow-[0_4px_16px_rgba(238,213,124,0.4)] cursor-pointer mt-1"
                      >
                        Confirm Response
                      </button>
                    </motion.div>
                  )}

                  {/* RSVP Desk Phone Number */}
                  {data.rsvp_phone && (
                    <div className="pt-2 border-t border-[#eed57c]/30 w-full flex items-center justify-center">
                      <a
                        href={`tel:${data.rsvp_phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#eed57c] hover:text-[#fff2b2] font-semibold transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>RSVP Desk: {data.rsvp_phone}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 9. FOOTER & SIGN-OFF: HIGH-VISIBILITY LUMINOUS TYPOGRAPHY             */}
        {/* ===================================================================== */}
        <footer
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kovil/kovil_footer_portrait.jpg')",
          }}
        >
          <SectionVignette hasSeam={false} />
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-15 w-full max-w-[320px] flex flex-col items-center px-4 py-6 rounded-3xl bg-black/45 backdrop-blur-[2px] border border-[#eed57c]/30 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
          >
            <span className="font-serif italic text-sm text-[#eed57c] block mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              With love,
            </span>
            <h4 className="font-great-vibes text-5xl sm:text-6xl text-[#fff9e6] drop-shadow-[0_4px_16px_rgba(0,0,0,1)] tracking-wide leading-tight">
              {bride} &amp; {groom}
            </h4>

            <div className="flex items-center justify-center gap-2 my-2.5 text-[#eed57c]">
              <div className="w-10 h-[1px] bg-current opacity-80" />
              <Heart className="w-3.5 h-3.5 fill-current" />
              <div className="w-10 h-[1px] bg-current opacity-80" />
            </div>

            {data.family_names && (
              <p className="font-serif text-xs sm:text-[13px] tracking-[0.2em] text-[#faedd0] uppercase font-bold my-1 text-center drop-shadow-[0_2px_6px_rgba(0,0,0,1)] leading-relaxed">
                Cordially invited by {data.family_names}
              </p>
            )}

            {/* Created by Varnam Badge - Highly Visible Clickable Glass Capsule */}
            <div className="mt-3 flex justify-center w-full">
              <div className="rounded-full bg-black/80 backdrop-blur-md border border-[#eed57c]/50 shadow-xl hover:border-[#eed57c] hover:bg-black/95 transition-all hover:scale-105 active:scale-95">
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
