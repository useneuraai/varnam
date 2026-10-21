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
import ScratchHeartCard from "@/components/ScratchHeartCard";
import RoyalWeddingTimeline from "@/components/RoyalWeddingTimeline";

// ============================================================================
// 1. FLOATING JASMINE & BLUSH MARIGOLD PETALS PARTICLES
// ============================================================================
const JasmineAndMarigoldOverlay = () => {
  const petals = [
    { id: 1, left: "7%", delay: "0s", duration: "11s", size: 14, anim: "anim-falling-petal-1", type: "marigold" },
    { id: 2, left: "22%", delay: "2.3s", duration: "13s", size: 16, anim: "anim-falling-petal-2", type: "jasmine" },
    { id: 3, left: "38%", delay: "0.9s", duration: "10s", size: 13, anim: "anim-falling-petal-1", type: "marigold" },
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
                fill="url(#mandapamMarigoldGrad)"
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
                fill="url(#mandapamJasmineGrad)"
              />
            </svg>
          )}
        </div>
      ))}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="mandapamMarigoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="mandapamJasmineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
export default function KalyanaMandapamTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Couple names & text
  const bride = data.bride_name || "Nila";
  const groom = data.groom_name || "Aravind";
  const quote =
    data.quote ||
    "In the sacred presence of heritage, our lives intertwine in devotion, love, and eternal celebration.";

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
  // CONTAINER-AWARE SMOOTH SCROLL REVEAL FOR HERO MANDAPAM ENTRANCE
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
  // SCRATCH TO REVEAL (HEART CARD & FLORAL BURST)
  // --------------------------------------------------------------------------
  const [isScratched, setIsScratched] = useState(false);

  // --------------------------------------------------------------------------
  // 3D PHOTO CAROUSEL / MOMENTS
  // --------------------------------------------------------------------------
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

  // Mobile swipe support for photo carousel
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
  // RSVP INTERACTIVE STATE
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
      className="relative min-h-screen w-full bg-[#160f09] text-[#faeed3] font-serif overflow-x-hidden selection:bg-[#c69238] selection:text-black flex flex-col items-center"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, #261a10 0%, #0d0704 100%)",
      }}
    >
      {/* Floating Falling Jasmine & Golden Marigold Petals */}
      <JasmineAndMarigoldOverlay />

      {/* Main Unified Mobile-First Template Card - Seamless portrait stack */}
      <div className="relative w-full max-w-[440px] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION: PALACE MANDAPAM ENTRANCE & SMOOTH SCROLL REVEAL      */}
        {/* ===================================================================== */}
        <section className="relative w-full aspect-[9/16] min-h-[640px] overflow-hidden flex flex-col items-center justify-between text-center pt-8 pb-6 px-4 bg-cover bg-center">
          {/* Palace Mandapam Entrance Background with Camera Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 will-change-transform"
            style={{
              backgroundImage: "url('/images/kalyana-mandapam/mandapam_palace_entrance.jpg')",
              transform: `scale(${1 + scrollProgress * 0.12})`,
              transformOrigin: "50% 50%",
            }}
          />

          {/* Soft atmospheric gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-[#1c1208] pointer-events-none" />

          {/* Top Heritage Emblem */}
          <div
            className="relative z-20 flex flex-col items-center transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `translateY(-${scrollProgress * 35}px)`,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1.5 text-[#8a4b08]">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#a87422] to-[#a87422]" />
              <span className="text-xs">❖</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent via-[#a87422] to-[#a87422]" />
            </div>
            <h2 className="font-cinzel text-base sm:text-lg tracking-[0.25em] text-[#260e05] uppercase font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              ROYAL PALACE MANDAPAM
            </h2>
            <span className="font-marcellus text-[10px] sm:text-[11px] tracking-[0.3em] text-[#8a4b08] uppercase font-semibold mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              AN AUSPICIOUS UNION
            </span>
          </div>

          {/* Center Couple Names & Details (Fades & lifts when scrolling down) */}
          <div
            className="relative z-20 w-full flex flex-col items-center px-2 my-auto transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.6),
              transform: `translateY(-${scrollProgress * 50}px)`,
            }}
          >
            <p className="font-marcellus text-xs sm:text-[13px] tracking-[0.32em] text-[#783e0a] uppercase font-bold mb-2.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              WE&apos;RE GETTING MARRIED
            </p>

            {/* Bride Name */}
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.14em] text-[#220d03] uppercase leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]">
              {bride}
            </h1>

            {/* Weds Divider */}
            <div className="flex items-center justify-center gap-3 my-2.5 w-full">
              <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent via-[#b45309] to-transparent" />
              <span className="font-great-vibes text-3xl sm:text-4xl text-[#8a4412] italic drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                weds
              </span>
              <div className="h-[1.5px] w-12 bg-gradient-to-l from-transparent via-[#b45309] to-transparent" />
            </div>

            {/* Groom Name */}
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.14em] text-[#220d03] uppercase leading-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]">
              {groom}
            </h1>
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
        {/* 2. SACRED QUOTE: CARVED SANDSTONE PALACE SANCTUM                      */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_quote_hall.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[78%] max-w-[320px] flex flex-col items-center px-3 py-6 my-auto"
          >
            {/* Sacred English Marriage Blessing */}
            <h2 className="font-cinzel text-xl sm:text-2xl text-[#fff9e6] font-semibold leading-relaxed tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
              &ldquo;Two hearts united in love,
              <br />
              blessed for a lifetime.&rdquo;
            </h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent my-3.5"
            />

            {/* Custom Quote in English */}
            <p className="font-cormorant text-base sm:text-lg text-[#faedd0] leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] font-medium italic">
              {quote}
            </p>

            <div className="flex items-center gap-2 mt-4 text-[#eed57c]/80">
              <div className="w-8 h-[1px] bg-current" />
              <span className="text-xs">❖</span>
              <div className="w-8 h-[1px] bg-current" />
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 3. SCRATCH TO REVEAL: LUXURY HEART-SHAPED CARTOUCHE                  */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden select-none"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_couple_hall.jpg')",
          }}
        >
          <SectionVignette />
          
          <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center">
            <ScratchHeartCard
              weddingDateInfo={weddingDateInfo}
              venueName={data.wedding_venue || "Sri Krishna Mahal"}
              templateType="kalyana"
              isScratched={isScratched}
              setIsScratched={setIsScratched}
              title="✦ AUSPICIOUS MUHURTHAM ✦"
            />
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4. COUNTING DOWN TO FOREVER: INNER MANDAPAM SANCTUM                   */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_countdown_hall.jpg')",
          }}
        >
          <SectionVignette />
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[290px] sm:max-w-[310px] flex flex-col items-center py-6 px-3"
          >
            <h3 className="font-cinzel text-xl sm:text-2xl text-[#220d03] tracking-[0.2em] uppercase font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]">
              AUSPICIOUS MUHURTHAM
            </h3>
            <span className="font-marcellus text-[11px] sm:text-xs tracking-[0.24em] text-[#b45309] uppercase font-semibold mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              Counting Down to Forever
            </span>
            <GoldDivider className="my-2.5 opacity-90" />

            {/* 4 White Countdown Boxes */}
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
                  className="py-4 px-2 rounded-2xl bg-white border border-[#d4af37]/45 shadow-[0_10px_25px_rgba(34,13,3,0.14)] flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                  <span className="font-cormorant text-4xl sm:text-5xl font-bold text-[#220d03] tabular-nums leading-none">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] text-[#783e0a] uppercase font-semibold mt-1.5 text-center">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 5. WEDDING RITUALS / AUSPICIOUS TIMINGS                               */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[760px] sm:min-h-[820px] text-center flex flex-col items-center justify-center py-12 px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_rituals_corridor.jpg')",
          }}
        >
          <SectionVignette />
          <RoyalWeddingTimeline
            eyebrow="AUSPICIOUS TIMINGS"
            title="Wedding Program"
            events={[
              {
                id: 1,
                sequence: 1,
                time: "19 DEC · 06:00 PM",
                name: "Nichayathartham",
                venue: data.wedding_venue || "Sri Krishna Mahal",
                description: "Formal engagement & ring exchange ceremony",
              },
              {
                id: 2,
                sequence: 2,
                time: "20 DEC · 06:00 AM",
                name: "Janavasam & Oonjal",
                venue: data.wedding_venue || "Sri Krishna Mahal",
                description: "Groom procession & traditional swing rituals",
              },
              {
                id: 3,
                sequence: 3,
                time: `${weddingDateInfo.day} ${weddingDateInfo.month} · ${weddingDateInfo.time}`,
                name: "Kalyana Muhurtham",
                venue: data.wedding_venue || "Sri Krishna Mahal",
                description: "Mangalya Dharanam & Saptapadi vows",
                isMuhurtham: true,
              },
              {
                id: 4,
                sequence: 4,
                time: data.reception_date
                  ? `${parseDate(data.reception_date).day} ${parseDate(data.reception_date).month} · ${parseDate(data.reception_date).time}`
                  : "20 DEC · 06:30 PM",
                name: "Nalangu & Reception",
                venue: (data as any).reception_venue || data.wedding_venue || "Sri Krishna Mahal",
                description: "Gala reception & grand celebratory feast",
              },
            ]}
          />
        </section>

        {/* ===================================================================== */}
        {/* 6. OUR MOMENTS: 3D POLAROID FAN PHOTO CAROUSEL                        */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[640px] text-center flex flex-col items-center justify-center px-4 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_moments_courtyard.jpg')",
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
            <h2 className="font-cinzel text-2xl sm:text-3xl text-[#1a0f07] tracking-[0.2em] uppercase font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              SWEET MOMENTS
            </h2>
            <p className="font-cormorant italic text-sm sm:text-base text-[#4a2e12] font-semibold mb-6 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              Cherished glimpses of our beautiful journey together
            </p>

            {/* Grand Borderless Photo Slideshow */}
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

              {/* Center Featured Photo (idx) */}
              <div className="relative z-20 w-60 sm:w-68 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] border-2 border-[#eed57c] select-none transform hover:scale-[1.02] transition-transform duration-300 bg-black">
                <img
                  src={momentsList[activePhotoIdx]}
                  alt="Couple Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Counter Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#eed57c]/60 text-[10px] tracking-widest text-[#eed57c] font-marcellus font-bold">
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
                      ? "w-5 bg-[#c2912e]"
                      : "w-1.5 bg-[#c2912e]/30 hover:bg-[#c2912e]/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 7. VENUE & GOOGLE MAPS: SQUARE MAP WITH DETAILS UNDERNEATH             */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_venue_courtyard.jpg')",
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
            <h2 className="font-cinzel text-2xl sm:text-3xl text-[#1a0f07] tracking-[0.2em] uppercase font-bold mb-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
              WEDDING VENUE
            </h2>
            <p className="font-cormorant italic text-sm sm:text-base text-[#4a2e12] font-semibold mb-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              We look forward to welcoming you
            </p>

            <div className="w-full flex flex-col items-center">
              {/* Big Square Google Map */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#eed57c] shadow-[0_15px_40px_rgba(0,0,0,0.65)] bg-[#150d06]">
                {/* Map top bar */}
                <div className="absolute top-0 inset-x-0 z-10 px-3 py-1.5 flex items-center justify-between text-xs bg-black/80 backdrop-blur-md border-b border-[#eed57c]/40">
                  <span className="font-cinzel text-[10px] tracking-wider uppercase font-semibold text-[#fff2b2] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#eed57c]" />
                    Interactive Map
                  </span>
                  <a
                    href={gmapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-cinzel tracking-wider uppercase font-semibold text-[#eed57c] hover:underline flex items-center gap-1"
                  >
                    <span>View Larger</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="w-full h-full pt-7">
                  {isPreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/85 text-center p-4">
                      <MapPin className="w-8 h-8 text-[#eed57c] mb-2 animate-bounce" />
                      <span className="font-cinzel text-base sm:text-lg text-[#fff2b2] font-semibold">
                        {data.wedding_venue || "Sri Krishna Mahal"}
                      </span>
                      <span className="font-marcellus text-xs sm:text-sm text-[#eed57c]/90 mt-1 max-w-[240px]">
                        {data.wedding_venue || "123, GST Road, Chromepet, Chennai - 600044"}
                      </span>
                      <a
                        href={gmapSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 px-4 py-1.5 rounded-full bg-[#eed57c]/20 border border-[#eed57c]/60 text-[#eed57c] text-[10px] font-cinzel font-semibold uppercase tracking-widest hover:bg-[#eed57c] hover:text-black transition"
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

                <h3 className="font-cinzel text-base sm:text-lg font-semibold text-[#fff2b2] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                  {data.wedding_venue || "Sri Krishna Mahal"}
                </h3>
                <p className="font-marcellus text-xs sm:text-[13px] text-[#faedd0] mt-1.5 leading-relaxed max-w-[280px]">
                  {data.wedding_venue || "123, GST Road, Chromepet, Chennai, Tamil Nadu 600044"}
                </p>
                <a
                  href={gmapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] text-[#1c0f05] font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-[0_4px_15px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-[#1c0f05]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 8. RSVP: REDESIGNED HIGH-CONTRAST PALACE MANDAPAM CARD                */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[660px] text-center flex flex-col items-center justify-center px-4 py-10 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_rsvp_hall.jpg')",
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

              <h2 className="font-cinzel text-2xl sm:text-3xl text-[#fff2b2] tracking-[0.2em] uppercase font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                BLESSINGS &amp; RSVP
              </h2>
              <GoldDivider className="my-2 opacity-90" />
              <p className="font-cormorant text-base sm:text-lg text-[#faeed3] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] font-medium italic">
                We would love to have you celebrate with us!
              </p>

              {rsvpSaved ? (
                <div className="p-4 rounded-xl bg-black/70 border border-[#eed57c]/60 text-center w-full shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#eed57c]/20 border-2 border-[#eed57c] flex items-center justify-center mx-auto mb-2 text-[#eed57c] shadow-md">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-marcellus text-sm text-[#fff2b2] uppercase tracking-wider font-bold">
                    {rsvpStatus === "attending" ? "Joyfully Confirmed!" : "Response Received"}
                  </h4>
                  <p className="font-cormorant text-xs sm:text-sm text-[#faedd0] mt-1.5 leading-relaxed">
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
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-marcellus text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
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
                      className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-marcellus text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md ${
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
                        <label className="block text-[10px] tracking-[0.2em] font-marcellus text-[#eed57c] uppercase font-bold mb-1">
                          Guest / Family Name(s)
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="E.g. Sundaram & Family"
                          className="w-full px-3 py-2 rounded-xl bg-black/75 border-2 border-[#eed57c]/50 text-xs sm:text-sm text-[#fff9e6] placeholder-[#faedd0]/60 font-cormorant focus:outline-none focus:border-[#eed57c] focus:ring-1 focus:ring-[#eed57c]"
                        />
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] font-marcellus text-[#eed57c] uppercase font-bold mb-1">
                            Number of Attendees
                          </label>
                          <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1c1006] border-2 border-[#eed57c]/50 text-xs sm:text-sm text-[#fff9e6] font-cormorant focus:outline-none focus:border-[#eed57c]"
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
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#eed57c] via-[#f5e6a8] to-[#c59a3f] text-[#1c0f05] font-marcellus text-xs uppercase font-bold tracking-[0.2em] hover:brightness-110 active:scale-98 transition shadow-[0_4px_16px_rgba(238,213,124,0.4)] cursor-pointer mt-1"
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
            backgroundImage: "url('/images/kalyana-mandapam/mandapam_footer_sanctum.jpg')",
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
            <span className="font-cinzel text-xs sm:text-sm tracking-[0.25em] text-[#eed57c] block mb-1 uppercase font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
              LOVE • TRADITION • ETERNITY
            </span>
            <h4 className="font-great-vibes text-5xl sm:text-6xl text-[#fff9e6] drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)] tracking-wide leading-tight">
              {bride} &amp; {groom}
            </h4>

            <div className="flex items-center justify-center gap-2 my-2.5 text-[#eed57c]">
              <div className="w-10 h-[1px] bg-current opacity-80" />
              <Heart className="w-3.5 h-3.5 fill-current" />
              <div className="w-10 h-[1px] bg-current opacity-80" />
            </div>

            {data.family_names && (
              <p className="font-marcellus text-xs sm:text-sm tracking-[0.14em] text-[#faedd0] font-semibold my-1 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-relaxed uppercase">
                Warmly Invited By: {data.family_names}
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
