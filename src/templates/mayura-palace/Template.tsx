"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import {
  MapPin,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Navigation,
  Heart,
  Volume2,
  VolumeX,
  Calendar,
  Share2,
  Flame,
  Utensils,
  Music,
  Gift,
} from "lucide-react";
import CreatedByVarnam from "@/components/CreatedByVarnam";

// ============================================================================
// 1. FLOATING AMBIENT HYDRANGEA & ROSE PETALS OVERLAY (GPU ACCELERATED)
// ============================================================================
const HydrangeaAndRoseOverlay = () => {
  const petals = [
    { id: 1, left: "6%", delay: "0s", duration: "11.5s", size: 16, anim: "anim-falling-petal-1", type: "hydrangea" },
    { id: 2, left: "22%", delay: "2.5s", duration: "13.5s", size: 18, anim: "anim-falling-petal-2", type: "rose" },
    { id: 3, left: "40%", delay: "1.1s", duration: "10.5s", size: 14, anim: "anim-falling-petal-1", type: "jasmine" },
    { id: 4, left: "60%", delay: "3.7s", duration: "12s", size: 17, anim: "anim-falling-petal-2", type: "hydrangea" },
    { id: 5, left: "76%", delay: "1.8s", duration: "14s", size: 19, anim: "anim-falling-petal-1", type: "rose" },
    { id: 6, left: "89%", delay: "4.2s", duration: "11s", size: 15, anim: "anim-falling-petal-2", type: "peacockGold" },
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
          {p.type === "hydrangea" ? (
            // Delicate 4-petal powder blue hydrangea floret
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              className="drop-shadow-[0_2px_8px_rgba(93,142,196,0.5)]"
            >
              <circle cx="12" cy="7" r="4.5" fill="url(#hydrangeaBlueGradMP)" />
              <circle cx="7" cy="12" r="4.5" fill="url(#hydrangeaBlueGradMP)" />
              <circle cx="17" cy="12" r="4.5" fill="url(#hydrangeaBlueGradMP)" />
              <circle cx="12" cy="17" r="4.5" fill="url(#hydrangeaBlueGradMP)" />
              <circle cx="12" cy="12" r="2.2" fill="#fef9ee" />
            </svg>
          ) : p.type === "rose" ? (
            // Soft English tea rose petal (blush pink)
            <svg
              width={p.size}
              height={p.size * 1.25}
              viewBox="0 0 24 28"
              className="drop-shadow-[0_2px_8px_rgba(244,114,182,0.4)]"
            >
              <path
                d="M12 1 C18 5 24 13 21 21 C18 28 6 28 3 21 C0 13 6 5 12 1 Z"
                fill="url(#englishRoseGradMP)"
              />
            </svg>
          ) : p.type === "jasmine" ? (
            // White pearl blossom floret
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 20 20"
              className="drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]"
            >
              <path
                d="M10 0 C12 6 18 8 20 10 C18 12 12 14 10 20 C8 14 2 12 0 10 C2 8 8 6 10 0 Z"
                fill="url(#pearlJasmineGradMP)"
              />
            </svg>
          ) : (
            // Iridescent golden teal sparkle
            <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#2dd4bf] via-[#eed57c] to-[#fef08a] opacity-85 shadow-[0_0_10px_#2dd4bf]" />
          )}
        </div>
      ))}

      {/* Shared Gradient Definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="hydrangeaBlueGradMP" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="40%" stopColor="#93c5fd" />
            <stop offset="85%" stopColor="#4f86c6" />
            <stop offset="100%" stopColor="#315c92" />
          </linearGradient>
          <linearGradient id="englishRoseGradMP" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf2f8" />
            <stop offset="35%" stopColor="#f9a8d4" />
            <stop offset="80%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id="pearlJasmineGradMP" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ============================================================================
// 2. CELEBRATION SHOWER ON SCRATCH UNVEIL (PEACOCK & PETALS)
// ============================================================================
const PeacockAndPetalsShower = ({ trigger }: { trigger: boolean }) => {
  const showerPetals = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      startX: (Math.random() - 0.5) * 260,
      startY: (Math.random() - 0.5) * 60,
      endX: (Math.random() - 0.5) * 400,
      endY: 480 + Math.random() * 420,
      size: 15 + Math.random() * 16,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 720,
      duration: 2.5 + Math.random() * 2.2,
      delay: Math.random() * 0.9,
      type: i % 3 === 0 ? "hydrangea" : i % 3 === 1 ? "rose" : "peacockTeal",
    }));
  }, [trigger]);

  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {showerPetals.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: p.startX,
            y: p.startY,
            opacity: 0,
            scale: 0.5,
            rotate: p.rotateStart,
          }}
          animate={{
            x: p.endX,
            y: p.endY,
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.15, 0.95, 0.7],
            rotate: p.rotateEnd,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute left-1/2 top-[38%] will-change-transform"
        >
          {p.type === "hydrangea" ? (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              className="drop-shadow-[0_4px_12px_rgba(93,142,196,0.65)]"
            >
              <circle cx="12" cy="7" r="4.5" fill="#93c5fd" />
              <circle cx="7" cy="12" r="4.5" fill="#60a5fa" />
              <circle cx="17" cy="12" r="4.5" fill="#3b82f6" />
              <circle cx="12" cy="17" r="4.5" fill="#2563eb" />
              <circle cx="12" cy="12" r="2" fill="#fff" />
            </svg>
          ) : p.type === "rose" ? (
            <svg
              width={p.size}
              height={p.size * 1.25}
              viewBox="0 0 24 28"
              className="drop-shadow-[0_4px_12px_rgba(244,114,182,0.6)]"
            >
              <path
                d="M12 0 C18 4 24 12 21 21 C18 28 6 28 3 21 C0 12 6 4 12 0 Z"
                fill="url(#showerRoseGradMP2)"
              />
              <defs>
                <linearGradient id="showerRoseGradMP2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbcfe8" />
                  <stop offset="40%" stopColor="#f472b6" />
                  <stop offset="85%" stopColor="#db2777" />
                  <stop offset="100%" stopColor="#9d174d" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 22 28"
              className="drop-shadow-[0_4px_12px_rgba(45,212,191,0.65)]"
            >
              <ellipse cx="11" cy="14" rx="9" ry="13" fill="url(#peacockFeatherShowerGradMP)" />
              <circle cx="11" cy="14" r="5" fill="#0284c7" />
              <circle cx="11" cy="14" r="2.5" fill="#facc15" />
              <defs>
                <linearGradient id="peacockFeatherShowerGradMP" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="45%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// 3. BLUE BOTANICAL FLOWER VINE ON SIDES FOR EACH SECTION (IMAGE-DRIVEN)
// ============================================================================
const SideBlueFloralFlourish = ({
  side = "left",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) => (
  <div
    className={`absolute ${
      side === "left" ? "left-0" : "right-0 scale-x-[-1]"
    } z-10 pointer-events-none select-none w-16 sm:w-20 h-64 sm:h-84 overflow-hidden opacity-95 anim-float-subtle ${className}`}
  >
    <img
      src="/images/mayura-palace/blue_floral_side_vine.jpg"
      alt="Blue floral flourish"
      className="w-full h-full object-cover object-left mix-blend-multiply drop-shadow-xs"
    />
  </div>
);

// ============================================================================
// 4. REFINED MINIMAL GOLD DIVIDERS & SEAMS
// ============================================================================
const MinimalGoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#b3811b]/80 to-transparent" />
    <span className="text-[#8a6314] text-xs">❖</span>
    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#b3811b]/80 to-transparent" />
  </div>
);

const SectionSeam = () => (
  <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#b3811b]/35 to-transparent" />
  </div>
);

// ============================================================================
// 5. MAIN TEMPLATE COMPONENT: MAYURA PALACE (PALACE GARDEN)
// ============================================================================
export default function MayuraPalaceTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Graceful English Typography
  const bride = data.bride_name || "Ananya";
  const groom = data.groom_name || "Siddharth";
  const quote =
    data.quote ||
    "Two souls united amidst royal gardens and serene waters, blessed with lifelong love and grace.";

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
        day: 18,
        month: "DECEMBER",
        year: 2026,
        weekday: "Friday",
        time: "08:30 AM",
        raw: new Date("2026-12-18T08:30:00"),
      };
    }
  };

  const weddingDateInfo = useMemo(() => parseDate(data.wedding_date), [data.wedding_date]);

  // Calendar Integration (Google Calendar)
  const handleAddToCalendar = () => {
    try {
      const date = weddingDateInfo.raw;
      const title = `Wedding: ${bride} & ${groom}`;
      const location = data.wedding_venue || "The Leela Palace Courtyard, Chennai";
      const startTime = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
      const endTime = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        `You're cordially invited to celebrate the wedding union of ${bride} & ${groom}.`
      )}&location=${encodeURIComponent(location)}`;

      window.open(gcalUrl, "_blank");
    } catch (e) {
      console.error(e);
    }
  };

  // WhatsApp Share Integration
  const handleShare = () => {
    const inviteUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `You're cordially invited to celebrate the royal wedding union of ${bride} & ${groom} on ${weddingDateInfo.weekday}, ${weddingDateInfo.month} ${weddingDateInfo.day}, ${weddingDateInfo.year}. View our digital invitation here: ${inviteUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Scroll Progress Tracker for Hero Parallax
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
    days: 72,
    hours: 18,
    minutes: 45,
    seconds: 20,
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

  // Scratch Canvas Logic & Celebration Shower Trigger
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [triggerShower, setTriggerShower] = useState(false);
  const isDrawing = useRef(false);

  const unveilDate = () => {
    setIsScratched(true);
    setTriggerShower(true);
  };

  const initCanvas = (w?: number, h?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = Math.round(w || rect.width || canvas.clientWidth || 220));
    const height = (canvas.height = Math.round(h || rect.height || canvas.clientHeight || 300));
    if (width <= 0 || height <= 0) return;

    // Elegant antique royal gold metallic gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#d4af37");
    goldGrad.addColorStop(0.25, "#fae6a2");
    goldGrad.addColorStop(0.5, "#b37d22");
    goldGrad.addColorStop(0.75, "#fae6a2");
    goldGrad.addColorStop(1, "#8a5814");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle fine stardust particles
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() > 0.8 ? 2 : 1, Math.random() > 0.8 ? 2 : 1);
    }

    // Elegant filigree border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.fillStyle = "#0b2135";
    ctx.font = "bold 12px 'Cinzel', serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SAVE THE DATE", width / 2, height / 2 - 12);
    ctx.font = "italic 11px serif";
    ctx.fillStyle = "#1e3a8a";
    ctx.fillText("Swipe to unveil", width / 2, height / 2 + 12);
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
    const t = setTimeout(tryInit, 250);
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
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    if (Math.random() > 0.5) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) clear++;
        }
        const percent = Math.round((clear / (imgData.data.length / 16)) * 100);
        if (percent > 35) {
          unveilDate();
        }
      } catch {}
    }
  };

  // Interactive Timeline Highlight State
  const [activeEventIdx, setActiveEventIdx] = useState<number | null>(0);

  const timelineEvents = [
    {
      time: "08:30 AM",
      title: "Kalyana Muhurtham",
      subtitle: "The sacred union & exchange of vows",
      details: "Performed amidst fragrant flowers and sacred Agni homam with traditional mangala nadaswaram melodies.",
      icon: Flame,
    },
    {
      time: "10:30 AM",
      title: "Mangala Aashirwad",
      subtitle: "Talambralu & floral blessing shower",
      details: "Elders, family, and loved ones shower sacred pearl-hued akshata and pastel flower petals upon the couple.",
      icon: Sparkles,
    },
    {
      time: "12:30 PM",
      title: "Royal Garden Feast",
      subtitle: "Celebratory royal banquet luncheon",
      details: "A grand authentic feast featuring exquisite delicacies served in the palace courtyard pavilion.",
      icon: Utensils,
    },
    {
      time: "06:30 PM",
      title: "Sangeet & Reception Gala",
      subtitle: "Music, toasts & evening celebration",
      details: "Live classical fusion ensemble, crystal chandeliers aglow, celebratory toasts, and joyful dancing.",
      icon: Music,
    },
  ];

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
    data.gmap_coordinates || data.wedding_venue || "The Leela Palace Courtyard, Chennai";
  const gmapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueLocation
  )}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    venueLocation
  )}&t=m&z=15&output=embed&iwloc=near`;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#eef3f5] text-[#0b2135] font-serif overflow-x-hidden selection:bg-[#93c5fd] selection:text-black flex flex-col items-center"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, #f5f8fb 0%, #dbe5ee 100%)",
      }}
    >
      {/* 1. Ambient Hydrangea & Rose Petals Overlay */}
      <HydrangeaAndRoseOverlay />

      {/* Floating Sound Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#eed57c] shadow-[0_4px_18px_rgba(11,33,53,0.14)] text-[#0b2135] hover:border-[#b3811b] hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Toggle Music"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#2563eb] animate-pulse" />
              <span className="text-[10px] tracking-widest font-marcellus font-bold uppercase text-[#0b2135]">
                Sound On
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] tracking-widest font-marcellus text-zinc-500 uppercase font-semibold">
                Sound Off
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Mobile-First Portrait Stack */}
      <div className="relative w-full max-w-[440px] shadow-[0_0_90px_rgba(15,35,55,0.22)] overflow-hidden flex flex-col bg-[#fdfefe] border-x border-[#eed57c]/30">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION: PALATIAL JHAROKHA WITH CHANDELIER & PEACOCK           */}
        {/* ===================================================================== */}
        <section className="relative w-full aspect-[9/16] min-h-[690px] overflow-hidden flex flex-col items-center justify-between text-center pt-8 pb-7 px-4 bg-cover bg-center">
          {/* Hero Jharokha Background with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 will-change-transform"
            style={{
              backgroundImage: "url('/images/mayura-palace/hero_peacock_arch.jpg')",
              transform: `scale(${1 + scrollProgress * 0.1})`,
              transformOrigin: "50% 50%",
            }}
          />

          {/* Blue Flower Garlands on Left & Right Sides */}
          <SideBlueFloralFlourish side="left" className="top-12 opacity-85" />
          <SideBlueFloralFlourish side="right" className="top-12 opacity-85" />

          {/* Top Royal Callout */}
          <div
            className="relative z-20 flex flex-col items-center transition-all duration-300 mt-1"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `translateY(-${scrollProgress * 30}px)`,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1 text-[#8a6314]">
              <div className="w-8 h-[1px] bg-current opacity-80" />
              <span className="text-xs">❖</span>
              <div className="w-8 h-[1px] bg-current opacity-80" />
            </div>
            <span className="font-marcellus text-[11px] sm:text-xs tracking-[0.35em] text-[#8a6314] uppercase font-bold drop-shadow-sm">
              WEDDING INVITATION
            </span>
          </div>

          {/* Center Couple Names: High-Contrast Royal Typography with Soft Frost Halo */}
          <div
            className="relative z-20 w-full flex flex-col items-center px-2 my-auto transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.6),
              transform: `translateY(-${scrollProgress * 45}px)`,
            }}
          >
            <div className="w-full max-w-[325px] py-6 px-4 rounded-3xl bg-white/75 backdrop-blur-[4px] border border-[#eed57c]/60 shadow-[0_12px_36px_rgba(11,33,53,0.12)] flex flex-col items-center">
              <p className="font-marcellus text-[10px] sm:text-[11px] tracking-[0.32em] text-[#8a6314] uppercase font-bold mb-2">
                TOGETHER WITH THEIR FAMILIES
              </p>

              <h1 className="font-marcellus text-3xl sm:text-4xl md:text-[40px] font-bold tracking-[0.12em] text-[#0b2135] uppercase leading-tight drop-shadow-xs">
                {bride}
              </h1>

              <div className="flex items-center justify-center gap-3 my-2 w-full">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
                <span className="font-great-vibes text-2xl sm:text-3xl text-[#2563eb] italic">
                  and
                </span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#eed57c] to-transparent" />
              </div>

              <h1 className="font-marcellus text-3xl sm:text-4xl md:text-[40px] font-bold tracking-[0.12em] text-[#0b2135] uppercase leading-tight drop-shadow-xs">
                {groom}
              </h1>

              <div className="mt-3.5 pt-2.5 border-t border-[#eed57c]/50 w-full flex items-center justify-center">
                <p className="font-marcellus text-xs sm:text-[13px] tracking-[0.22em] text-[#8a6314] uppercase font-bold">
                  {weddingDateInfo.weekday}, {weddingDateInfo.month} {weddingDateInfo.day}, {weddingDateInfo.year}
                </p>
              </div>
            </div>
          </div>

          {/* Minimal Scroll Cue */}
          <div
            className="relative z-20 flex flex-col items-center gap-1 opacity-90 animate-bounce transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
          >
            <span className="text-[9px] tracking-[0.35em] text-[#8a6314] uppercase font-bold">
              SCROLL
            </span>
            <div className="w-4 h-6 rounded-full border border-[#eed57c] flex items-start justify-center p-0.5 bg-white/60 shadow-xs">
              <div className="w-1.5 h-2 rounded-full bg-[#8a6314]" />
            </div>
          </div>

          <SectionSeam />
        </section>

        {/* ===================================================================== */}
        {/* 2. SACRED BLESSINGS: BLUE HYDRANGEA & ROYAL ARCH FRAME                 */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-palace/blue_hydrangea_arch.jpg')",
          }}
        >
          <SectionSeam />

          {/* Side Floral Garlands */}
          <SideBlueFloralFlourish side="left" className="top-8" />
          <SideBlueFloralFlourish side="right" className="top-8" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[325px] mx-auto p-6 rounded-3xl bg-white/92 backdrop-blur-md border-2 border-[#eed57c]/70 shadow-[0_16px_40px_rgba(11,33,53,0.14)] flex flex-col items-center"
          >
            <span className="text-3xl mb-2 drop-shadow-sm">🦚</span>

            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-1">
              DIVINE BLESSINGS
            </span>

            <MinimalGoldDivider className="my-2" />

            <h2 className="font-marcellus text-2xl sm:text-3xl text-[#0b2135] font-bold leading-relaxed tracking-wide mt-1">
              Grace &amp; Devotion
            </h2>

            <p className="font-cormorant italic text-base sm:text-lg text-[#1e293b] leading-relaxed mt-3 max-w-[280px]">
              &ldquo;{quote}&rdquo;
            </p>

            {data.custom_message && (
              <p className="font-cormorant text-sm sm:text-base text-[#475569] mt-3 leading-relaxed max-w-[260px]">
                {data.custom_message}
              </p>
            )}
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 3. SCRATCH TO REVEAL: DATE + CELEBRATION SHOWER                       */}
        {/* ===================================================================== */}
        <section className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center bg-[#f7fafb] overflow-hidden select-none">
          <SectionSeam />

          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-12" />
          <SideBlueFloralFlourish side="right" className="top-12" />

          {/* Dynamic Peacock & Hydrangea Shower Effect */}
          <PeacockAndPetalsShower trigger={triggerShower} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-4">
              AUSPICIOUS MUHURTHAM
            </span>

            {/* The Scratch Frame */}
            <div className="relative w-64 sm:w-72 h-80 rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(11,33,53,0.16)] border-2 border-[#eed57c] bg-white">
              {/* Underlying Revealed Card Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center pointer-events-none select-none">
                <div className="font-marcellus text-xs tracking-[0.25em] text-[#8a6314] uppercase font-bold">
                  MUHURTHAM DATE
                </div>

                <div className="my-auto flex flex-col items-center">
                  <div className="font-cormorant text-7xl sm:text-8xl font-bold text-[#0b2135] leading-none tracking-tight">
                    {weddingDateInfo.day}
                  </div>
                  <div className="font-marcellus text-sm sm:text-base tracking-[0.25em] text-[#8a6314] uppercase mt-1.5 font-bold">
                    {weddingDateInfo.month} {weddingDateInfo.year}
                  </div>
                  <div className="w-10 h-[1.5px] bg-[#eed57c] my-2.5" />
                  <div className="font-marcellus text-xs sm:text-sm text-[#334155] tracking-wider font-semibold">
                    {weddingDateInfo.weekday} · {weddingDateInfo.time}
                  </div>
                </div>

                <div className="text-[10px] sm:text-xs tracking-[0.2em] font-marcellus text-[#8a6314] uppercase font-bold">
                  {data.wedding_venue || "The Leela Palace Courtyard"}
                </div>
              </div>

              {/* Interactive Scratch Canvas Foil */}
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
                <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-20">
                  <span className="px-3.5 py-1 rounded-full bg-white/90 border border-[#eed57c] text-[9px] sm:text-[10px] font-marcellus text-[#8a6314] tracking-widest uppercase font-bold shadow-sm">
                    ✨ Swipe to reveal
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons: Reveal & Add to Calendar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              {!isScratched ? (
                <button
                  type="button"
                  onClick={unveilDate}
                  className="px-5 py-2.5 rounded-full bg-white border-2 border-[#eed57c] text-[#8a6314] text-xs tracking-[0.2em] uppercase font-marcellus font-bold hover:bg-[#fef9ee] hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Click to Reveal</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCalendar}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4a325] via-[#eed57c] to-[#c59b27] text-[#0b2135] text-xs tracking-[0.18em] uppercase font-marcellus font-bold hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#0b2135]" />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTriggerShower((prev) => !prev)}
                    className="px-4 py-2.5 rounded-full bg-white border border-[#eed57c] text-[#0b2135] text-xs tracking-[0.16em] uppercase font-marcellus font-semibold hover:bg-zinc-50 active:scale-95 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    title="Shower petals again"
                  >
                    <span>🦚 Shower Petals</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 4. COUNTDOWN TIMER                                                    */}
        {/* ===================================================================== */}
        <section className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center bg-[#f0f5f7] overflow-hidden">
          <SectionSeam />

          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-10" />
          <SideBlueFloralFlourish side="right" className="top-10" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-2">
              THE COUNTDOWN
            </span>

            <MinimalGoldDivider className="my-2" />

            <div className="grid grid-cols-4 gap-2.5 w-full mt-4">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINS", value: timeLeft.minutes },
                { label: "SECS", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="py-3.5 px-1.5 rounded-2xl bg-white border border-[#eed57c]/60 shadow-[0_6px_20px_rgba(11,33,53,0.08)] flex flex-col items-center justify-center"
                >
                  <span className="font-cormorant text-3xl sm:text-4xl font-bold text-[#0b2135] tabular-nums leading-none">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="font-marcellus text-[9px] sm:text-[10px] tracking-[0.16em] text-[#8a6314] uppercase font-bold mt-1.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 5. INTERACTIVE WEDDING ITINERARY: BANQUET PAVILION FRAME              */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[790px] py-18 px-5 text-center flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-palace/garden_banquet_pavilion.jpg')",
          }}
        >
          <SectionSeam />

          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-12" />
          <SideBlueFloralFlourish side="right" className="top-12" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[360px] flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-1 drop-shadow-sm">
              THE CELEBRATION
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#0b2135] tracking-wide font-bold drop-shadow-sm">
              Wedding Itinerary
            </h3>
            <p className="font-cormorant italic text-sm text-[#334155] mt-1 font-medium">
              Tap any ceremony to view details
            </p>

            <MinimalGoldDivider className="my-3.5" />

            {/* Timeline with central glowing spine and interactive event cards */}
            <div className="relative w-full flex flex-col space-y-4 mt-2">
              <div className="absolute left-6 top-3 bottom-3 w-[1.5px] bg-gradient-to-b from-[#eed57c]/40 via-[#b3811b] to-[#eed57c]/40 pointer-events-none" />

              {timelineEvents.map((evt, idx) => {
                const IconComponent = evt.icon;
                const isSelected = activeEventIdx === idx;

                return (
                  <motion.div
                    key={idx}
                    onClick={() => setActiveEventIdx(isSelected ? null : idx)}
                    className={`relative z-10 w-full pl-13 pr-4 py-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 backdrop-blur-md ${
                      isSelected
                        ? "bg-white/95 border-[#b3811b] shadow-[0_8px_25px_rgba(179,129,27,0.22)]"
                        : "bg-white/88 border-[#eed57c]/60 hover:border-[#b3811b]/80 shadow-sm"
                    }`}
                  >
                    {/* Timeline node */}
                    <div
                      className={`absolute left-4 top-4.5 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#eed57c] ring-4 ring-[#eed57c]/40 border border-[#b3811b]"
                          : "bg-white border-2 border-[#b3811b]"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-[#0b2135]" : "bg-[#b3811b]"
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs tracking-[0.2em] font-marcellus text-[#8a6314] uppercase font-bold">
                        <Clock className="w-3 h-3 text-[#8a6314]" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white border border-[#eed57c] flex items-center justify-center text-[#8a6314] shadow-xs">
                        <IconComponent className="w-3 h-3" />
                      </div>
                    </div>

                    <h4 className="font-marcellus text-base sm:text-lg font-bold text-[#0b2135] mt-1">
                      {evt.title}
                    </h4>
                    <p className="font-cormorant italic text-sm text-[#475569]">
                      {evt.subtitle}
                    </p>

                    {/* Expandable Ceremony Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-2.5 mt-2.5 border-t border-[#eed57c]/40"
                        >
                          <p className="font-cormorant text-sm text-[#1e293b] leading-relaxed">
                            {evt.details}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 6. CHERISHED MOMENTS (PHOTO GALLERY CAROUSEL)                         */}
        {/* ===================================================================== */}
        <section className="relative w-full py-18 px-4 text-center flex flex-col items-center justify-center bg-[#f0f5f7] overflow-hidden">
          <SectionSeam />

          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-12" />
          <SideBlueFloralFlourish side="right" className="top-12" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-1">
              GALLERY
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#0b2135] tracking-wide font-bold">
              Cherished Moments
            </h3>

            <MinimalGoldDivider className="my-3.5" />

            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[370px] flex items-center justify-center min-h-[320px] mt-2"
            >
              {/* Previous Image */}
              <div
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length)
                }
                className="absolute left-1 w-32 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#eed57c]/60 opacity-40 hover:opacity-75 transition cursor-pointer scale-90 z-10 bg-black"
              >
                <img
                  src={momentsList[(activePhotoIdx - 1 + momentsList.length) % momentsList.length]}
                  alt="Moments"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Active Image */}
              <div className="relative z-20 w-56 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(11,33,53,0.18)] border-2 border-[#eed57c] bg-black">
                <img
                  src={momentsList[activePhotoIdx]}
                  alt="Couple Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white/90 text-xs tracking-widest text-[#0b2135] font-marcellus font-bold shadow-md">
                  {activePhotoIdx + 1} / {momentsList.length}
                </div>
              </div>

              {/* Next Image */}
              <div
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-1 w-32 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#eed57c]/60 opacity-40 hover:opacity-75 transition cursor-pointer scale-90 z-10 bg-black"
              >
                <img
                  src={momentsList[(activePhotoIdx + 1) % momentsList.length]}
                  alt="Moments"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation Chevrons */}
              <button
                type="button"
                aria-label="Previous Photo"
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev - 1 + momentsList.length) % momentsList.length)
                }
                className="absolute left-0 z-30 w-9 h-9 rounded-full bg-white/90 border border-[#eed57c] text-[#0b2135] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next Photo"
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-0 z-30 w-9 h-9 rounded-full bg-white/90 border border-[#eed57c] text-[#0b2135] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-md cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 justify-center mt-3.5">
              {momentsList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Photo ${idx + 1}`}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activePhotoIdx === idx
                      ? "w-5 bg-[#8a6314]"
                      : "w-2 bg-[#8a6314]/30 hover:bg-[#8a6314]/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 7. VENUE & DIRECTIONS: LAKESIDE MANDAP TERRACE FRAME                  */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[720px] py-18 px-6 text-center flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/mayura-palace/lakeside_mandap_terrace.jpg')",
          }}
        >
          <SectionSeam />

          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-10" />
          <SideBlueFloralFlourish side="right" className="top-10" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-1 drop-shadow-sm">
              THE VENUE
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#0b2135] tracking-wide font-bold drop-shadow-sm">
              Location &amp; Directions
            </h3>

            <MinimalGoldDivider className="my-3.5" />

            <div className="w-full rounded-3xl overflow-hidden border-2 border-[#eed57c]/70 shadow-2xl bg-white/95 backdrop-blur-md mt-1">
              <div className="w-full h-48">
                {isPreview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 p-4">
                    <MapPin className="w-7 h-7 text-[#8a6314] mb-1.5" />
                    <span className="font-marcellus text-base text-[#0b2135] font-bold">
                      {data.wedding_venue || "The Leela Palace Courtyard"}
                    </span>
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

              <div className="p-4 sm:p-5 flex flex-col items-center text-center">
                <h4 className="font-marcellus text-base sm:text-lg font-bold text-[#0b2135]">
                  {data.wedding_venue || "The Leela Palace Courtyard"}
                </h4>
                <p className="font-cormorant text-sm sm:text-base text-[#334155] mt-1 max-w-[260px] leading-relaxed">
                  {data.wedding_venue || "Adyar Seaface, MRC Nagar, Chennai - 600028"}
                </p>

                <a
                  href={gmapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#d4a325] via-[#eed57c] to-[#c59b27] text-[#0b2135] font-marcellus text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-105 active:scale-98 transition shadow-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-[#0b2135]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 8. RSVP DESK + WHATSAPP SHARE OPTION                                  */}
        {/* ===================================================================== */}
        <section className="relative w-full py-18 px-6 text-center flex flex-col items-center justify-center bg-[#f7fafb] overflow-hidden">
          <SectionSeam />

          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-12" />
          <SideBlueFloralFlourish side="right" className="top-12" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#8a6314] uppercase font-bold mb-1">
              R. S. V. P.
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#0b2135] tracking-wide font-bold">
              Kindly Respond
            </h3>

            <MinimalGoldDivider className="my-3.5" />

            <div className="w-full rounded-3xl bg-white border-2 border-[#eed57c]/60 p-5 sm:p-6 flex flex-col items-center shadow-[0_16px_40px_rgba(11,33,53,0.1)]">
              {rsvpSaved ? (
                <div className="py-4 text-center w-full">
                  <div className="w-10 h-10 rounded-full bg-[#eed57c]/30 border border-[#b3811b] flex items-center justify-center mx-auto mb-2 text-[#8a6314]">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-marcellus text-base text-[#0b2135] font-bold uppercase tracking-wider">
                    Thank You
                  </h4>
                  <p className="font-cormorant text-sm sm:text-base text-[#334155] mt-1.5">
                    {rsvpStatus === "attending"
                      ? "Your response has been recorded with joy."
                      : "Thank you for sending your warm wishes."}
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("attending")}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-marcellus uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        rsvpStatus === "attending"
                          ? "bg-[#eed57c] text-[#0b2135] font-bold shadow-md"
                          : "bg-zinc-50 text-[#0b2135] border border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      Attending
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-marcellus uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        rsvpStatus === "declined"
                          ? "bg-[#fee2e2] text-[#991b1b] border border-[#f87171] font-bold shadow-md"
                          : "bg-zinc-50 text-[#0b2135] border border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      Declining
                    </button>
                  </div>

                  {rsvpStatus !== "none" && (
                    <div className="w-full space-y-3 text-left mt-1">
                      <div>
                        <label className="block text-xs tracking-[0.2em] font-marcellus text-[#8a6314] uppercase font-bold mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Mr. & Mrs. Sharma"
                          className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] border border-[#eed57c]/80 text-sm sm:text-base text-[#0b2135] placeholder-zinc-400 font-serif focus:outline-none focus:border-[#b3811b]"
                        />
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="block text-xs tracking-[0.2em] font-marcellus text-[#8a6314] uppercase font-bold mb-1">
                            Number of Guests
                          </label>
                          <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] border border-[#eed57c]/80 text-sm sm:text-base text-[#0b2135] font-serif focus:outline-none focus:border-[#b3811b]"
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
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4a325] via-[#eed57c] to-[#c59b27] text-[#0b2135] font-marcellus text-xs sm:text-sm uppercase font-bold tracking-[0.18em] hover:brightness-105 active:scale-98 transition shadow-md cursor-pointer mt-1"
                      >
                        Confirm RSVP
                      </button>
                    </div>
                  )}

                  {data.rsvp_phone && (
                    <div className="pt-2.5 border-t border-[#eed57c]/40 w-full flex items-center justify-center">
                      <a
                        href={`tel:${data.rsvp_phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#8a6314] font-bold hover:text-[#0b2135] transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contact: {data.rsvp_phone}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Share Invitation Button */}
            <button
              type="button"
              onClick={handleShare}
              className="mt-4 px-5 py-2.5 rounded-full bg-white border border-[#eed57c] text-[#0b2135] text-xs tracking-[0.18em] uppercase font-marcellus font-bold hover:bg-zinc-50 active:scale-95 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8a6314]" />
              <span>Share Invitation</span>
            </button>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 9. ROYAL BLESSINGS & GIFT NOTE FOOTER (END OF TEMPLATE WITH FLOWERS)  */}
        {/* ===================================================================== */}
        <footer className="relative w-full pt-16 pb-8 px-4 text-center flex flex-col items-center justify-center bg-[#fdfefe] overflow-hidden">
          {/* Blue Flower Garlands on Sides */}
          <SideBlueFloralFlourish side="left" className="top-8" />
          <SideBlueFloralFlourish side="right" className="top-8" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center relative z-10"
          >
            {/* Blessings Note */}
            <div className="flex items-center justify-center gap-1.5 text-xs tracking-widest text-[#8a6314] uppercase font-marcellus mb-2 font-bold">
              <Gift className="w-3.5 h-3.5 text-[#8a6314]" />
              <span>GIFT OF BLESSINGS</span>
            </div>
            <p className="font-cormorant italic text-sm sm:text-base text-[#475569] mb-5 max-w-[280px] leading-relaxed">
              Your love, presence, and heartfelt prayers are the greatest gift we could ever receive.
            </p>

            <span className="font-cormorant italic text-base sm:text-lg text-[#8a6314] block mb-1">
              With love and gratitude,
            </span>

            <h4 className="font-great-vibes text-5xl sm:text-6xl text-[#0b2135] tracking-wide leading-tight">
              {bride} &amp; {groom}
            </h4>

            <div className="flex items-center justify-center gap-2 my-2.5 text-[#b3811b]">
              <div className="w-10 h-[1px] bg-current" />
              <Heart className="w-3.5 h-3.5 fill-current text-[#b3811b]" />
              <div className="w-10 h-[1px] bg-current" />
            </div>

            {data.family_names && (
              <p className="font-marcellus text-xs sm:text-sm tracking-[0.2em] text-[#334155] uppercase font-bold mt-1">
                {data.family_names}
              </p>
            )}
          </motion.div>

          {/* Bottom Blooming Blue Hydrangea & Garden Rose Garland (End of Template) */}
          <div className="w-full max-w-[420px] px-2 mt-6 -mb-1 pointer-events-none select-none overflow-hidden flex justify-center">
            <img
              src="/images/mayura-palace/blue_floral_bottom_border.jpg"
              alt="Blue floral bottom border"
              className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xs"
            />
          </div>

          <div className="mt-5 flex justify-center w-full relative z-10">
            <CreatedByVarnam
              theme="gold"
              className="py-1 px-4 text-[#8a6314] hover:text-[#b3811b]"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
