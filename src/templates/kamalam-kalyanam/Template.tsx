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
  X,
  Phone,
  Navigation,
  ExternalLink,
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
// 1. FLOATING AMBIENT VELVET RED ROSE PETALS & LOTUS PETALS OVERLAY (GPU ACCELERATED)
// ============================================================================
const RedRoseAndLotusOverlay = () => {
  const petals = [
    { id: 1, left: "7%", delay: "0s", duration: "11s", size: 18, anim: "anim-falling-petal-1", type: "redRose" },
    { id: 2, left: "22%", delay: "2.2s", duration: "13s", size: 15, anim: "anim-falling-petal-2", type: "lotus" },
    { id: 3, left: "42%", delay: "0.8s", duration: "10s", size: 19, anim: "anim-falling-petal-1", type: "redRose" },
    { id: 4, left: "60%", delay: "3.4s", duration: "12s", size: 13, anim: "anim-falling-petal-2", type: "gold" },
    { id: 5, left: "76%", delay: "1.6s", duration: "14s", size: 20, anim: "anim-falling-petal-1", type: "redRose" },
    { id: 6, left: "89%", delay: "4.0s", duration: "11.5s", size: 16, anim: "anim-falling-petal-2", type: "lotus" },
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
          {p.type === "redRose" ? (
            <svg
              width={p.size}
              height={p.size * 1.25}
              viewBox="0 0 24 28"
              className="drop-shadow-[0_2px_8px_rgba(225,29,72,0.4)]"
            >
              <path
                d="M12 1 C18 5 24 13 21 21 C18 28 6 28 3 21 C0 13 6 5 12 1 Z"
                fill="url(#velvetRoseGrad)"
              />
            </svg>
          ) : p.type === "lotus" ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 20 26"
              className="drop-shadow-[0_2px_6px_rgba(244,114,182,0.35)]"
            >
              <path
                d="M10 0 C16 5 20 14 18 20 C16 26 4 26 2 20 C0 14 4 5 10 0 Z"
                fill="url(#lotusBlushGrad)"
              />
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-[#eed57c] opacity-80 shadow-[0_0_8px_#eed57c]" />
          )}
        </div>
      ))}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="velvetRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="40%" stopColor="#e11d48" />
            <stop offset="80%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
          <linearGradient id="lotusBlushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf2f8" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ============================================================================
// 2. ROSE PETALS CELEBRATION SHOWER ON SCRATCH
// ============================================================================
const RosePetalShower = ({ trigger }: { trigger: boolean }) => {
  const showerPetals = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      startX: (Math.random() - 0.5) * 240,
      startY: (Math.random() - 0.5) * 60,
      endX: (Math.random() - 0.5) * 360,
      endY: 480 + Math.random() * 400,
      size: 16 + Math.random() * 15,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 720,
      duration: 2.6 + Math.random() * 2.2,
      delay: Math.random() * 0.9,
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
            scale: [0.5, 1.1, 0.9, 0.7],
            rotate: p.rotateEnd,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute left-1/2 top-[38%] will-change-transform"
        >
          <svg
            width={p.size}
            height={p.size * 1.3}
            viewBox="0 0 24 28"
            className="drop-shadow-[0_4px_12px_rgba(225,29,72,0.55)]"
          >
            <path
              d="M12 0 C18 4 24 12 21 21 C18 28 6 28 3 21 C0 12 6 4 12 0 Z"
              fill="url(#showerRoseGrad)"
            />
            <defs>
              <linearGradient id="showerRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="35%" stopColor="#e11d48" />
                <stop offset="75%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// 3. LOTUS ON SIDES (BOTANICAL CORNER / MARGIN FLOURISH)
// ============================================================================
const SideLotusFlourish = ({
  side = "left",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) => (
  <div
    className={`absolute ${
      side === "left" ? "left-1 sm:left-2" : "right-1 sm:right-2 scale-x-[-1]"
    } z-10 pointer-events-none select-none opacity-85 anim-float-subtle ${className}`}
  >
    <svg width="48" height="74" viewBox="0 0 44 68" fill="none">
      <path
        d="M6 68 C8 45 20 32 30 18 C34 12 30 4 22 2"
        stroke="#eed57c"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <path
        d="M20 36 C12 36 6 42 8 48 C10 54 22 50 20 36 Z"
        fill="url(#sideLeafGrad)"
        fillOpacity="0.85"
      />
      <path
        d="M28 20 C24 14 26 6 32 4 C38 6 40 14 36 20 C34 23 30 23 28 20 Z"
        fill="url(#sideLotusGrad)"
      />
      <path
        d="M22 18 C18 14 20 8 26 8 C28 12 28 16 22 18 Z"
        fill="url(#sideLotusLightGrad)"
      />
      <path
        d="M42 18 C46 14 44 8 38 8 C36 12 36 16 42 18 Z"
        fill="url(#sideLotusLightGrad)"
      />
      <circle cx="32" cy="11" r="2.5" fill="#fef08a" />
      <defs>
        <linearGradient id="sideLotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="sideLotusLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="sideLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// ============================================================================
// 4. REFINED MINIMAL DIVIDER & SEAMS
// ============================================================================
const MinimalGoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#eed57c]/70 to-transparent" />
    <span className="text-[#eed57c] text-xs opacity-90">❖</span>
    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#eed57c]/70 to-transparent" />
  </div>
);

const SectionSeam = () => (
  <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pointer-events-none">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/25 to-transparent" />
  </div>
);

// Swaying Hanging Brass Lotus Lamp for Hero (GPU Accelerated)
const SwayingHangingLamp = ({ side = "left" }: { side: "left" | "right" }) => (
  <div
    className={`absolute top-0 ${
      side === "left" ? "left-4 sm:left-6 anim-lamp-sway-left" : "right-4 sm:right-6 anim-lamp-sway-right"
    } z-20 pointer-events-none flex flex-col items-center select-none`}
  >
    <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-[#fae6a2] via-[#d4af37] to-[#8c5d13]" />
    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-[#fae6a2] to-[#ab7726] my-0.5" />
    <div className="relative">
      <div className="w-6 h-5 rounded-b-full bg-gradient-to-b from-[#eed57c] via-[#c69238] to-[#855814] flex items-center justify-center shadow-md border border-[#fae6a2]/40">
        <span className="text-[8px] text-[#fff2b2]">🪷</span>
      </div>
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-gradient-to-t from-[#f59e0b] via-[#fef08a] to-white rounded-full blur-[1px] shadow-[0_0_10px_#f59e0b] anim-flame-glow" />
    </div>
  </div>
);

// ============================================================================
// 5. MAIN TEMPLATE COMPONENT: KAMALAM KALYANAM
// ============================================================================
export default function KamalamKalyanamTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Minimal Clean English Text
  const bride = data.bride_name || "Meenakshi";
  const groom = data.groom_name || "Sundar";
  const quote =
    data.quote || "Two souls united in love and sacred devotion.";

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
        day: 28,
        month: "NOVEMBER",
        year: 2026,
        weekday: "Saturday",
        time: "07:30 AM",
        raw: new Date("2026-11-28T07:30:00"),
      };
    }
  };

  const weddingDateInfo = useMemo(() => parseDate(data.wedding_date), [data.wedding_date]);

  // Calendar Integration (Google Calendar)
  const handleAddToCalendar = () => {
    try {
      const date = weddingDateInfo.raw;
      const title = `Wedding: ${bride} & ${groom}`;
      const location = data.wedding_venue || "Sri Padmavathi Palace, Chennai";
      const startTime = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
      const endTime = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
        `You're invited to celebrate the wedding union of ${bride} & ${groom}.`
      )}&location=${encodeURIComponent(location)}`;

      window.open(gcalUrl, "_blank");
    } catch (e) {
      console.error(e);
    }
  };

  // WhatsApp Share Integration
  const handleShare = () => {
    const inviteUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `You're cordially invited to celebrate the wedding of ${bride} & ${groom} on ${weddingDateInfo.weekday}, ${weddingDateInfo.month} ${weddingDateInfo.day}, ${weddingDateInfo.year}. View the digital invitation here: ${inviteUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Scroll Progress Tracker for Parallax
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
    days: 64,
    hours: 14,
    minutes: 30,
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

  // Scratch Canvas Logic & Rose Petal Shower Trigger
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

    // Elegant antique gold metallic gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, "#d4af37");
    goldGrad.addColorStop(0.25, "#fae6a2");
    goldGrad.addColorStop(0.5, "#b37d22");
    goldGrad.addColorStop(0.75, "#fae6a2");
    goldGrad.addColorStop(1, "#8a5814");

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle fine stardust
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() > 0.8 ? 2 : 1, Math.random() > 0.8 ? 2 : 1);
    }

    // Hairline border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.fillStyle = "#340510";
    ctx.font = "bold 12px 'Cinzel', serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SAVE THE DATE", width / 2, height / 2 - 12);
    ctx.font = "italic 11px serif";
    ctx.fillStyle = "#4a0b18";
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
      time: "07:30 AM",
      title: "Kalyana Muhurtham",
      subtitle: "The sacred union & exchange of vows",
      details: "Conducted in the sacred presence of the Agni homam with traditional nadaswaram mangala isai.",
      icon: Flame,
    },
    {
      time: "10:00 AM",
      title: "Mangala Aashirwad",
      subtitle: "Parental blessings & Talambralu",
      details: "Elders and guests shower the newlyweds with sacred akshata and divine heartfelt blessings.",
      icon: Sparkles,
    },
    {
      time: "12:00 PM",
      title: "Traditional Wedding Feast",
      subtitle: "Festive South Indian plantain leaf lunch",
      details: "A grand authentic 24-delicacy banquet celebrating auspicious South Indian culinary traditions.",
      icon: Utensils,
    },
    {
      time: "06:30 PM",
      title: "Grand Evening Reception",
      subtitle: "Music, toasts & dinner banquet",
      details: "Live classical fusion ensemble, couple felicitation, celebratory toast, and evening feast.",
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
    data.gmap_coordinates || data.wedding_venue || "Sri Padmavathi Palace, Chennai";
  const gmapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueLocation
  )}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    venueLocation
  )}&t=m&z=15&output=embed&iwloc=near`;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#150207] text-[#faedd0] font-serif overflow-x-hidden selection:bg-[#d4af37] selection:text-black flex flex-col items-center"
    >
      {/* 1. Ambient Red Rose & Lotus Petals Overlay */}
      <RedRoseAndLotusOverlay />

      {/* Floating Minimal Sound Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e020a]/85 backdrop-blur-md border border-[#eed57c]/40 shadow-lg text-[#eed57c] hover:border-[#eed57c] hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Toggle Music"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-[#eed57c] animate-pulse" />
              <span className="text-[10px] sm:text-xs tracking-widest font-marcellus font-semibold uppercase text-[#faedd0]">
                Sound On
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] sm:text-xs tracking-widest font-marcellus text-zinc-400 uppercase">
                Sound Off
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Mobile-First Portrait Stack */}
      <div className="relative w-full max-w-[440px] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col bg-[#22040d]">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION: THE PICTURE YOU GAVE (ROYAL CRIMSON LOTUS ARCH)       */}
        {/* ===================================================================== */}
        <section className="relative w-full aspect-[9/16] min-h-[680px] overflow-hidden flex flex-col items-center justify-between text-center pt-9 pb-8 px-5 bg-cover bg-center">
          {/* Hero Arch Background Image with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 will-change-transform"
            style={{
              backgroundImage: "url('/images/kamalam-kalyanam/hero_lotus_arch.jpg')",
              transform: `scale(${1 + scrollProgress * 0.1})`,
              transformOrigin: "50% 50%",
            }}
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Animated Swaying Brass Hanging Lamps */}
          <SwayingHangingLamp side="left" />
          <SwayingHangingLamp side="right" />

          {/* Top Minimal Callout */}
          <div
            className="relative z-20 flex flex-col items-center transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.5),
              transform: `translateY(-${scrollProgress * 30}px)`,
            }}
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.35em] text-[#eed57c] uppercase font-bold drop-shadow-sm">
              WEDDING INVITATION
            </span>
          </div>

          {/* Center Minimal Couple Typography */}
          <div
            className="relative z-20 w-full flex flex-col items-center px-4 my-auto transition-all duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.6),
              transform: `translateY(-${scrollProgress * 45}px)`,
            }}
          >
            <p className="font-marcellus text-xs sm:text-sm tracking-[0.32em] text-[#eed57c]/90 uppercase font-medium mb-3">
              TOGETHER WITH THEIR FAMILIES
            </p>

            <h1 className="font-marcellus text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.12em] text-[#fff6db] uppercase leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              {bride}
            </h1>

            <div className="flex items-center justify-center gap-3 my-2.5 w-full">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#eed57c]/80 to-transparent" />
              <span className="font-great-vibes text-2xl sm:text-3xl text-[#fbcfe8] italic">
                and
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#eed57c]/80 to-transparent" />
            </div>

            <h1 className="font-marcellus text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.12em] text-[#fff6db] uppercase leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              {groom}
            </h1>
          </div>

          {/* Minimal Scroll Cue */}
          <div
            className="relative z-20 flex flex-col items-center gap-1.5 opacity-80 animate-bounce transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
          >
            <span className="text-[10px] tracking-[0.3em] text-[#eed57c] uppercase font-medium">
              SCROLL
            </span>
            <div className="w-4 h-6 rounded-full border border-[#eed57c]/70 flex items-start justify-center p-0.5">
              <div className="w-1.5 h-2 rounded-full bg-[#eed57c]" />
            </div>
          </div>

          <SectionSeam />
        </section>

        {/* ===================================================================== */}
        {/* 2. SACRED BLESSINGS: LUSH ROSE CORNER & SIDE FRAME                   */}
        {/* ===================================================================== */}
        <section
          className="relative w-full aspect-[9/16] min-h-[660px] text-center flex flex-col items-center justify-center px-6 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kamalam-kalyanam/rose_side_frame.jpg')",
          }}
        >
          <SectionSeam />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[320px] ml-auto mr-2 sm:mr-4 p-6 rounded-2xl bg-[#1b030a]/85 backdrop-blur-md border border-[#eed57c]/40 shadow-2xl flex flex-col items-center"
          >
            <span className="text-2xl mb-3 text-[#eed57c] opacity-90">🕉️</span>

            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-2">
              DIVINE BLESSINGS
            </span>

            <MinimalGoldDivider className="my-2" />

            <h2 className="font-marcellus text-2xl sm:text-3xl text-[#fff3cb] font-normal leading-relaxed tracking-wide mt-2">
              A Sacred Union
            </h2>

            <p className="font-cormorant italic text-base sm:text-lg text-[#faedd0]/95 leading-relaxed mt-3.5 max-w-[280px]">
              &ldquo;{quote}&rdquo;
            </p>

            {data.custom_message && (
              <p className="font-cormorant text-sm sm:text-base text-[#eed57c]/85 mt-3 leading-relaxed max-w-[260px]">
                {data.custom_message}
              </p>
            )}
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 3. SCRATCH TO REVEAL: DATE + ROSE PETAL SHOWER ANIMATION              */}
        {/* ===================================================================== */}
        <section className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center bg-[#1f030b] overflow-hidden select-none">
          <SectionSeam />

          {/* Lotuses on Sides */}
          <SideLotusFlourish side="left" className="top-14" />
          <SideLotusFlourish side="right" className="top-14" />

          {/* Dynamic Rose Petal Shower on Scratch Effect */}
          <RosePetalShower trigger={triggerShower} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-4">
              AUSPICIOUS MUHURTHAM
            </span>

            {/* The Scratch Frame */}
            <div className="relative w-64 sm:w-72 h-80 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] border border-[#eed57c]/65 bg-[#2d0512]">
              {/* Underlying Revealed Card Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center pointer-events-none select-none">
                <div className="font-marcellus text-xs tracking-[0.25em] text-[#eed57c] uppercase font-semibold">
                  MUHURTHAM DATE
                </div>

                <div className="my-auto flex flex-col items-center">
                  <div className="font-cormorant text-7xl sm:text-8xl font-normal text-[#fff4ce] leading-none tracking-tight">
                    {weddingDateInfo.day}
                  </div>
                  <div className="font-marcellus text-sm sm:text-base tracking-[0.25em] text-[#eed57c] uppercase mt-1.5 font-medium">
                    {weddingDateInfo.month} {weddingDateInfo.year}
                  </div>
                  <div className="w-10 h-[1px] bg-[#eed57c]/60 my-2.5" />
                  <div className="font-marcellus text-xs sm:text-sm text-[#faedd0] tracking-wider">
                    {weddingDateInfo.weekday} · {weddingDateInfo.time}
                  </div>
                </div>

                <div className="text-[10px] sm:text-xs tracking-[0.2em] font-marcellus text-[#eed57c]/90 uppercase font-medium">
                  {data.wedding_venue || "Sri Padmavathi Palace"}
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
                  <span className="px-3 py-1 rounded-full bg-black/75 border border-[#eed57c]/40 text-[9px] sm:text-[10px] font-marcellus text-[#faedd0] tracking-widest uppercase">
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
                  className="px-5 py-2 rounded-full bg-[#2a0510] border border-[#eed57c]/60 text-[#eed57c] text-xs tracking-[0.2em] uppercase font-marcellus font-semibold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Click to Reveal</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCalendar}
                    className="px-5 py-2 rounded-full bg-[#eed57c] text-[#1c0409] text-xs tracking-[0.18em] uppercase font-marcellus font-bold hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#1c0409]" />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTriggerShower((prev) => !prev)}
                    className="px-4 py-2 rounded-full bg-[#2a0510] border border-[#eed57c]/50 text-[#eed57c] text-xs tracking-[0.16em] uppercase font-marcellus font-medium hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    title="Shower rose petals again"
                  >
                    <span>🌹 Shower Petals</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 4. COUNTDOWN TIMER (MINIMAL CRIMSON)                                  */}
        {/* ===================================================================== */}
        <section className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center bg-[#25040e] overflow-hidden">
          <SectionSeam />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-2">
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
                  className="py-3.5 px-1.5 rounded-xl bg-[#1b030a] border border-[#eed57c]/35 shadow-md flex flex-col items-center justify-center"
                >
                  <span className="font-cormorant text-3xl sm:text-4xl font-normal text-[#fff4ce] tabular-nums leading-none">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="font-marcellus text-[9px] sm:text-[10px] tracking-[0.16em] text-[#eed57c] uppercase font-semibold mt-1.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 5. INTERACTIVE CEREMONIAL TIMELINE: ROSE BRANCHES SIDE FRAME          */}
        {/* ===================================================================== */}
        <section
          className="relative w-full min-h-[780px] py-18 px-5 text-center flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/kamalam-kalyanam/rose_branches_frame.jpg')",
          }}
        >
          <SectionSeam />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[360px] flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-1">
              THE CELEBRATION
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#fff3cb] tracking-wide font-normal">
              Wedding Itinerary
            </h3>
            <p className="font-cormorant italic text-sm text-[#faedd0]/75 mt-1">
              Tap any ceremony to view details
            </p>

            <MinimalGoldDivider className="my-3.5" />

            {/* Timeline with central glowing spine and interactive event cards */}
            <div className="relative w-full flex flex-col space-y-4 mt-2">
              {/* Vertical glowing timeline line */}
              <div className="absolute left-6 top-3 bottom-3 w-[1.5px] bg-gradient-to-b from-[#eed57c]/30 via-[#eed57c] to-[#eed57c]/30 pointer-events-none" />

              {timelineEvents.map((evt, idx) => {
                const IconComponent = evt.icon;
                const isSelected = activeEventIdx === idx;

                return (
                  <motion.div
                    key={idx}
                    onClick={() => setActiveEventIdx(isSelected ? null : idx)}
                    className={`relative z-10 w-full pl-13 pr-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "bg-[#330615] border-[#eed57c] shadow-[0_4px_20px_rgba(238,213,124,0.22)]"
                        : "bg-[#27040e]/95 border-[#eed57c]/30 hover:border-[#eed57c]/60"
                    }`}
                  >
                    {/* Glowing timeline node */}
                    <div
                      className={`absolute left-4 top-4.5 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#eed57c] ring-4 ring-[#eed57c]/30"
                          : "bg-[#1f030b] border-2 border-[#eed57c]/60"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-[#1c0409]" : "bg-[#eed57c]"
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs tracking-[0.2em] font-marcellus text-[#eed57c] uppercase font-bold">
                        <Clock className="w-3 h-3 text-[#eed57c]" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#1b0208] border border-[#eed57c]/35 flex items-center justify-center text-[#eed57c]">
                        <IconComponent className="w-3 h-3" />
                      </div>
                    </div>

                    <h4 className="font-marcellus text-base sm:text-lg font-medium text-[#fff4ce] mt-1">
                      {evt.title}
                    </h4>
                    <p className="font-cormorant italic text-sm text-[#faedd0]/90">
                      {evt.subtitle}
                    </p>

                    {/* Expandable Ceremony Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-2.5 mt-2.5 border-t border-[#eed57c]/25"
                        >
                          <p className="font-cormorant text-sm text-[#faedd0]/85 leading-relaxed">
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
        {/* 6. OUR CHERISHED MOMENTS (MINIMAL PHOTO GALLERY)                      */}
        {/* ===================================================================== */}
        <section className="relative w-full py-18 px-4 text-center flex flex-col items-center justify-center bg-[#25040e] overflow-hidden">
          <SectionSeam />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-1">
              GALLERY
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#fff3cb] tracking-wide font-normal">
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
                className="absolute left-1 w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-[#eed57c]/35 opacity-40 hover:opacity-75 transition cursor-pointer scale-90 z-10 bg-black"
              >
                <img
                  src={momentsList[(activePhotoIdx - 1 + momentsList.length) % momentsList.length]}
                  alt="Moments"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Active Image */}
              <div className="relative z-20 w-56 sm:w-60 aspect-[3/4] rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] border border-[#eed57c] bg-black">
                <img
                  src={momentsList[activePhotoIdx]}
                  alt="Couple Moment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/80 text-xs tracking-widest text-[#eed57c] font-marcellus font-semibold">
                  {activePhotoIdx + 1} / {momentsList.length}
                </div>
              </div>

              {/* Next Image */}
              <div
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-1 w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-[#eed57c]/35 opacity-40 hover:opacity-75 transition cursor-pointer scale-90 z-10 bg-black"
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
                className="absolute left-0 z-30 w-9 h-9 rounded-full bg-black/75 border border-[#eed57c]/70 text-[#eed57c] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next Photo"
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % momentsList.length)}
                className="absolute right-0 z-30 w-9 h-9 rounded-full bg-black/75 border border-[#eed57c]/70 text-[#eed57c] flex items-center justify-center hover:bg-[#eed57c] hover:text-black transition shadow-lg cursor-pointer"
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
                      ? "w-5 bg-[#eed57c]"
                      : "w-2 bg-[#eed57c]/30 hover:bg-[#eed57c]/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 7. VENUE & NAVIGATION (MINIMAL CRIMSON)                                */}
        {/* ===================================================================== */}
        <section className="relative w-full py-18 px-6 text-center flex flex-col items-center justify-center bg-[#1f030b] overflow-hidden">
          <SectionSeam />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-1">
              THE VENUE
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#fff3cb] tracking-wide font-normal">
              Location &amp; Directions
            </h3>

            <MinimalGoldDivider className="my-3.5" />

            <div className="w-full rounded-xl overflow-hidden border border-[#eed57c]/45 shadow-lg bg-[#28040f] mt-1">
              <div className="w-full h-48">
                {isPreview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 p-4">
                    <MapPin className="w-7 h-7 text-[#eed57c] mb-1.5" />
                    <span className="font-marcellus text-base text-[#fff4ce]">
                      {data.wedding_venue || "Sri Padmavathi Palace"}
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
                <h4 className="font-marcellus text-base sm:text-lg font-medium text-[#fff4ce]">
                  {data.wedding_venue || "Sri Padmavathi Palace"}
                </h4>
                <p className="font-cormorant text-sm sm:text-base text-[#faedd0]/85 mt-1 max-w-[260px] leading-relaxed">
                  {data.wedding_venue || "GST Road, Chromepet, Chennai - 600044"}
                </p>

                <a
                  href={gmapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-[#eed57c] text-[#1c0409] font-marcellus text-xs sm:text-sm font-semibold uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-[#1c0409]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 8. RSVP DESK + WHATSAPP SHARE OPTION                                  */}
        {/* ===================================================================== */}
        <section className="relative w-full py-18 px-6 text-center flex flex-col items-center justify-center bg-[#25040e] overflow-hidden">
          <SectionSeam />

          {/* Lotuses on sides */}
          <SideLotusFlourish side="left" className="top-12" />
          <SideLotusFlourish side="right" className="top-12" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center relative z-10"
          >
            <span className="font-marcellus text-xs sm:text-[13px] tracking-[0.3em] text-[#eed57c] uppercase font-bold mb-1">
              R. S. V. P.
            </span>
            <h3 className="font-marcellus text-2xl sm:text-3xl text-[#fff3cb] tracking-wide font-normal">
              Kindly Respond
            </h3>

            <MinimalGoldDivider className="my-3.5" />

            <div className="w-full rounded-2xl bg-[#1d030a] border border-[#eed57c]/45 p-5 sm:p-6 flex flex-col items-center shadow-lg">
              {rsvpSaved ? (
                <div className="py-4 text-center w-full">
                  <div className="w-10 h-10 rounded-full bg-[#eed57c]/20 border border-[#eed57c] flex items-center justify-center mx-auto mb-2 text-[#eed57c]">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="font-marcellus text-base text-[#fff4ce] uppercase tracking-wider">
                    Thank You
                  </h4>
                  <p className="font-cormorant text-sm sm:text-base text-[#faedd0]/90 mt-1.5">
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
                          ? "bg-[#eed57c] text-[#1c0409] font-bold shadow-md"
                          : "bg-[#290510] text-[#faedd0] border border-[#eed57c]/35 hover:bg-[#340715]"
                      }`}
                    >
                      Attending
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-marcellus uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        rsvpStatus === "declined"
                          ? "bg-[#4a0d18] text-[#fecdd3] border border-[#fda4af] font-bold shadow-md"
                          : "bg-[#290510] text-[#faedd0] border border-[#eed57c]/35 hover:bg-[#340715]"
                      }`}
                    >
                      Declining
                    </button>
                  </div>

                  {rsvpStatus !== "none" && (
                    <div className="w-full space-y-3 text-left mt-1">
                      <div>
                        <label className="block text-xs tracking-[0.2em] font-marcellus text-[#eed57c] uppercase mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Mr. & Mrs. Raghavan"
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#eed57c]/45 text-sm sm:text-base text-[#faedd0] placeholder-[#faedd0]/40 font-serif focus:outline-none focus:border-[#eed57c]"
                        />
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="block text-xs tracking-[0.2em] font-marcellus text-[#eed57c] uppercase mb-1">
                            Number of Guests
                          </label>
                          <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#140207] border border-[#eed57c]/45 text-sm sm:text-base text-[#faedd0] font-serif focus:outline-none focus:border-[#eed57c]"
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
                        className="w-full py-2.5 rounded-lg bg-[#eed57c] text-[#1c0409] font-marcellus text-xs sm:text-sm uppercase font-bold tracking-[0.18em] hover:brightness-110 active:scale-98 transition shadow-md cursor-pointer mt-1"
                      >
                        Confirm RSVP
                      </button>
                    </div>
                  )}

                  {data.rsvp_phone && (
                    <div className="pt-2.5 border-t border-[#eed57c]/25 w-full flex items-center justify-center">
                      <a
                        href={`tel:${data.rsvp_phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#eed57c]/90 hover:text-[#fff4ce] transition"
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
              className="mt-4 px-5 py-2 rounded-full bg-[#28040f] border border-[#eed57c]/45 text-[#eed57c] text-xs tracking-[0.18em] uppercase font-marcellus font-medium hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#eed57c]" />
              <span>Share Invitation</span>
            </button>
          </motion.div>
        </section>

        {/* ===================================================================== */}
        {/* 9. MINIMAL FOOTER & BLESSINGS + GIFT NOTE                             */}
        {/* ===================================================================== */}
        <footer className="relative w-full py-18 px-6 text-center flex flex-col items-center justify-center bg-[#1c0209] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[340px] flex flex-col items-center"
          >
            {/* Blessings Note */}
            <div className="flex items-center justify-center gap-1.5 text-xs tracking-widest text-[#eed57c] uppercase font-marcellus mb-2 font-medium">
              <Gift className="w-3.5 h-3.5 text-[#eed57c]" />
              <span>GIFT OF BLESSINGS</span>
            </div>
            <p className="font-cormorant italic text-sm sm:text-base text-[#faedd0]/80 mb-6 max-w-[280px] leading-relaxed">
              Your love, presence, and heartfelt prayers are the greatest gift we could ever receive.
            </p>

            <span className="font-cormorant italic text-base sm:text-lg text-[#eed57c]/85 block mb-1">
              With love and gratitude,
            </span>

            <h4 className="font-great-vibes text-5xl sm:text-6xl text-[#fff4ce] tracking-wide leading-tight">
              {bride} &amp; {groom}
            </h4>

            <div className="flex items-center justify-center gap-2 my-2.5 text-[#eed57c]/70">
              <div className="w-10 h-[1px] bg-current" />
              <Heart className="w-3.5 h-3.5 fill-current" />
              <div className="w-10 h-[1px] bg-current" />
            </div>

            {data.family_names && (
              <p className="font-marcellus text-xs sm:text-sm tracking-[0.2em] text-[#faedd0]/90 uppercase font-medium mt-1">
                {data.family_names}
              </p>
            )}

            <div className="mt-7 flex justify-center w-full">
              <CreatedByVarnam
                theme="gold"
                className="py-1 px-4 text-[#eed57c]/70 hover:text-[#eed57c]"
              />
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
