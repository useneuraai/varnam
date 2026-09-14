"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { 
  Calendar, Clock, MapPin, Sparkles, Heart, Compass, Bus, Phone, 
  ChevronDown, Flame, CheckCircle2, MessageCircle 
} from "lucide-react";

export default function ThiruvizhaTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestCount, setGuestCount] = useState("2");
  const [guestNames, setGuestNames] = useState("");

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.18 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/thiruvizha.jpg";

  // Google Maps URL generator
  const mapCoordinates = data.gmap_coordinates || "10.7828,79.1318"; // Brihadeeswara default
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.wedding_venue || "Brihadeeswarar Temple, Thanjavur"
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative min-h-screen bg-[#240308] text-[#fcf8f0] font-serif overflow-x-hidden selection:bg-[#c59b27] selection:text-black">
      {/* Deep Maroon & Temple Granite Texture Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 20%, #4a0613 0%, #200207 60%, #0d0103 100%)`,
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 mix-blend-color-dodge z-0"
        style={{
          backgroundImage: `radial-gradient(#d4af37 0.75px, transparent 0.75px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating Golden Sparks & Temple Incense Embers */}
      <FloatingFlowers type="sparkle" count={22} />

      {/* TOP HANGING REALISTIC THORANAM & JASMINE GARLAND */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none select-none">
        {/* Mango Leaves Thoranam Band */}
        <div className="w-full flex justify-around items-start overflow-hidden h-14 md:h-20 opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: [i % 2 === 0 ? -1.5 : 1.5, i % 2 === 0 ? 1.5 : -1.5] }}
              transition={{ duration: 3.5 + (i % 3), repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="relative -mx-1"
            >
              {/* Mango Leaf SVG */}
              <svg width="34" height="64" viewBox="0 0 34 64" fill="none" className="drop-shadow-md">
                <path
                  d="M17 0 C22 15 32 30 28 55 C25 62 17 64 17 64 C17 64 9 62 6 55 C2 30 12 15 17 0Z"
                  fill={i % 3 === 0 ? "#1e4d2b" : i % 2 === 0 ? "#2d6a3f" : "#1b4332"}
                />
                <path d="M17 2 L17 60" stroke="#40916c" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M17 15 L25 24 M17 25 L27 34 M17 35 L24 44" stroke="#52b788" strokeWidth="0.75" strokeOpacity="0.3" />
                <path d="M17 15 L9 24 M17 25 L7 34 M17 35 L10 44" stroke="#52b788" strokeWidth="0.75" strokeOpacity="0.3" />
              </svg>
            </motion.div>
          ))}
        </div>
        {/* Strung Jasmine Flower Swags along the top */}
        <div className="w-full h-3 bg-gradient-to-r from-[#d4af37]/30 via-[#fff8db] to-[#d4af37]/30 shadow-[0_2px_8px_rgba(212,175,55,0.4)] relative -top-3">
          <div className="flex justify-between items-center px-4 w-full h-full">
            {Array.from({ length: 30 }).map((_, idx) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-[#fffff8] shadow-[0_0_4px_#fff] border border-[#d4af37]/40" />
            ))}
          </div>
        </div>
      </div>

      {/* CARVED DRAVIDIAN TEMPLE PILLARS (LEFT & RIGHT ARCHITECTURAL BORDERS) */}
      <div className="hidden lg:block fixed top-0 bottom-0 left-0 w-12 xl:w-16 pointer-events-none z-30 opacity-75 border-r border-[#c59b27]/30 bg-gradient-to-r from-[#170104] via-[#230208] to-transparent shadow-[4px_0_24px_rgba(0,0,0,0.9)]">
        {/* Carved Pillar Stone Relief Details */}
        <div className="h-full flex flex-col justify-between py-12 px-2 items-center text-[#c59b27]/40">
          <div className="text-xl">🛕</div>
          <div className="w-[1px] h-32 bg-gradient-to-b from-[#c59b27] via-transparent to-[#c59b27]" />
          <div className="text-xs tracking-widest [writing-mode:vertical-rl] rotate-180 uppercase font-bold text-[#c59b27]/60">
            தஞ்சாவூர் திருக்கல்யாணம்
          </div>
          <div className="w-[1px] h-32 bg-gradient-to-b from-[#c59b27] via-transparent to-[#c59b27]" />
          <div className="text-xl">🪷</div>
        </div>
      </div>
      <div className="hidden lg:block fixed top-0 bottom-0 right-0 w-12 xl:w-16 pointer-events-none z-30 opacity-75 border-l border-[#c59b27]/30 bg-gradient-to-l from-[#170104] via-[#230208] to-transparent shadow-[-4px_0_24px_rgba(0,0,0,0.9)]">
        <div className="h-full flex flex-col justify-between py-12 px-2 items-center text-[#c59b27]/40">
          <div className="text-xl">🛕</div>
          <div className="w-[1px] h-32 bg-gradient-to-b from-[#c59b27] via-transparent to-[#c59b27]" />
          <div className="text-xs tracking-widest [writing-mode:vertical-rl] uppercase font-bold text-[#c59b27]/60">
            மங்கள வைபவம்
          </div>
          <div className="w-[1px] h-32 bg-gradient-to-b from-[#c59b27] via-transparent to-[#c59b27]" />
          <div className="text-xl">🪷</div>
        </div>
      </div>

      {/* ORNAMENTAL INNER TEMPLE FRAME */}
      <div className="fixed inset-3 md:inset-6 border border-[#c59b27]/25 pointer-events-none z-20">
        <div className="absolute inset-1 border border-[#c59b27]/10" />
        {/* Brass Bell Corner Emblems */}
        <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#3d0611] border border-[#d4af37] flex items-center justify-center text-[9px] text-[#eed57c] shadow-lg">
          🔔
        </div>
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#3d0611] border border-[#d4af37] flex items-center justify-center text-[9px] text-[#eed57c] shadow-lg">
          🔔
        </div>
        <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-[#3d0611] border border-[#d4af37] flex items-center justify-center text-[9px] text-[#eed57c] shadow-lg">
          🪷
        </div>
        <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-[#3d0611] border border-[#d4af37] flex items-center justify-center text-[9px] text-[#eed57c] shadow-lg">
          🪷
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-12 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto flex flex-col items-center w-full"
        >
          {/* Subtle Temple Gopuram Silhouette Vector */}
          <motion.div
            variants={fadeInUp}
            className="w-24 md:w-32 mb-4 opacity-85 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            <svg viewBox="0 0 100 80" fill="none" className="w-full h-auto stroke-[#d4af37]">
              {/* Kalasam finials on top */}
              <path d="M46 12 L46 6 M50 10 L50 3 M54 12 L54 6" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M42 12 C42 12 45 10 50 10 C55 10 58 12 58 12 L58 16 L42 16 Z" fill="#4a0815" strokeWidth="1" />
              {/* Tier 1 */}
              <path d="M38 18 L62 18 L65 26 L35 26 Z" fill="#36050e" strokeWidth="1" />
              {/* Tier 2 */}
              <path d="M32 28 L68 28 L72 38 L28 38 Z" fill="#2d040c" strokeWidth="1" />
              {/* Tier 3 with decorative niches */}
              <path d="M25 40 L75 40 L80 54 L20 54 Z" fill="#240308" strokeWidth="1" />
              {/* Grand Temple Gate Base */}
              <path d="M16 56 L84 56 L88 76 L12 76 Z" fill="#1b0206" strokeWidth="1.2" />
              {/* Sanctum Arch Opening */}
              <path d="M42 76 L42 62 C42 58 58 58 58 62 L58 76" strokeWidth="1.5" fill="#0d0103" />
            </svg>
          </motion.div>

          {/* SACRED TAMIL CALLIGRAPHY: "திருமணம்" */}
          <motion.div variants={fadeInUp} className="mb-2">
            <span className="text-2xl md:text-3xl lg:text-4xl tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#e5b842] to-[#ffcf66] drop-shadow-[0_4px_24px_rgba(212,175,55,0.6)]">
              திருமணம்
            </span>
            <div className="h-[1.5px] w-36 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2" />
          </motion.div>

          {/* Auspicious Chants Ribbon */}
          <motion.p
            variants={fadeInUp}
            className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#e6caa0] font-medium mt-1 mb-6"
          >
            மங்கள நாண் பூட்டும் சுப முகூர்த்த அழைப்பிதழ்
          </motion.p>

          {/* COUPLE ARCHITECTURAL PORTRAIT WITH CARVED TEMPLE FRAME */}
          <motion.div
            variants={fadeInUp}
            className="relative my-4 p-3 rounded-t-[160px] rounded-b-3xl bg-gradient-to-b from-[#c59b27] via-[#8c6717] to-[#3a0610] shadow-[0_25px_70px_rgba(0,0,0,0.9)] border-2 border-[#e8c86d]/40"
          >
            {/* Inner Portrait Image */}
            <div className="relative overflow-hidden rounded-t-[152px] rounded-b-2xl w-64 sm:w-80 md:w-96 h-84 sm:h-[420px] md:h-[480px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} and ${data.groom_name}`}
                className="w-full h-full object-cover object-top filter brightness-[1.03] contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f0207] via-transparent to-transparent opacity-75" />
            </div>

            {/* Brass Deepams Flanking the Portrait */}
            <div className="absolute -bottom-3 -left-4 w-10 h-10 rounded-full bg-[#2a040b] border border-[#d4af37] flex items-center justify-center text-sm shadow-[0_0_16px_#c59b27]">
              🪔
            </div>
            <div className="absolute -bottom-3 -right-4 w-10 h-10 rounded-full bg-[#2a040b] border border-[#d4af37] flex items-center justify-center text-sm shadow-[0_0_16px_#c59b27]">
              🪔
            </div>
          </motion.div>

          {/* COUPLE NAMES IN ANTIQUE GOLD DISPLAY TYPOGRAPHY */}
          <motion.div variants={fadeInUp} className="mt-8 mb-4 w-full">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fff3cc] via-[#d4af37] to-[#e6be58] drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)] uppercase">
              {data.groom_name || "ARUN"}
            </h1>
            <div className="text-sm md:text-base text-[#e8c86d] font-medium tracking-[0.3em] my-1">
              அருண்
            </div>

            <div className="inline-flex items-center justify-center gap-4 my-2">
              <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#c59b27]" />
              <span className="text-2xl md:text-3xl text-[#eed57c] font-light italic">weds</span>
              <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#c59b27]" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fff3cc] via-[#d4af37] to-[#e6be58] drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)] uppercase">
              {data.bride_name || "KAVYA"}
            </h1>
            <div className="text-sm md:text-base text-[#e8c86d] font-medium tracking-[0.3em] my-1">
              காவ்யா
            </div>
          </motion.div>

          {/* Sacred Ceremony Blessing Quote */}
          {data.quote && (
            <motion.div
              variants={fadeInUp}
              className="max-w-xl mx-auto my-4 p-4 rounded-xl bg-[#36050e]/60 border border-[#c59b27]/30 shadow-inner"
            >
              <p className="text-xs md:text-sm text-[#f5ebd7] leading-relaxed italic">
                &ldquo;{data.quote}&rdquo;
              </p>
            </motion.div>
          )}

          {/* Auspicious Muhurtham Date Plaque */}
          <motion.div
            variants={fadeInUp}
            className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#38060f] via-[#5c0b1a] to-[#38060f] border border-[#d4af37]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] inline-flex items-center gap-3"
          >
            <Calendar className="w-4 h-4 text-[#eed57c]" />
            <span className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#fff5d6] uppercase">
              {formatDate(data.wedding_date)}
            </span>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 flex flex-col items-center opacity-70 text-[#eed57c]"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase mb-1">வாழ்த்துகிறோம்</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WEDDING STORY & SACRED TRADITION                                       */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 md:px-12 z-10 border-t border-[#c59b27]/25">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-[#e8c86d]" />
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c86d] font-bold">
              SACRED TRADITION & HERITAGE
            </span>
            <Flame className="w-4 h-4 text-[#e8c86d]" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-[#fff3cc] uppercase mb-6"
          >
            The Sacred Union
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            className="relative p-6 md:p-10 rounded-2xl bg-gradient-to-b from-[#35050e]/90 to-[#1d0207]/90 border border-[#c59b27]/40 shadow-2xl backdrop-blur-sm"
          >
            {/* Top Ornamental Emblem */}
            <div className="w-12 h-12 mx-auto -mt-12 mb-4 rounded-full bg-[#4a0815] border-2 border-[#d4af37] flex items-center justify-center text-xl shadow-lg">
              🪷
            </div>

            <p className="text-sm md:text-base text-[#f5ebd7] leading-relaxed mb-6 font-light">
              Under the sacred sanctum of our ancestral heritage, with the divine blessings of Lord Shiva & Parvati, 
              and the resounding melodies of nadaswaram and thavil, we take the seven sacred steps (Saptapadi) around the holy fire.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#c59b27]/25 text-xs text-[#e8c86d]">
              <div className="p-3 rounded-lg bg-[#27030a] border border-[#c59b27]/20">
                <span className="block font-bold text-sm text-[#fff5d6] mb-1">கெட்டிமேளம்</span>
                Mangalya Dharanam with triple rhythm blessings
              </div>
              <div className="p-3 rounded-lg bg-[#27030a] border border-[#c59b27]/20">
                <span className="block font-bold text-sm text-[#fff5d6] mb-1">சப்தபதி</span>
                Seven sacred vows uniting body, mind, and soul
              </div>
              <div className="p-3 rounded-lg bg-[#27030a] border border-[#c59b27]/20">
                <span className="block font-bold text-sm text-[#fff5d6] mb-1">அறுசுவை விருந்து</span>
                Traditional banana leaf feast with heartfelt love
              </div>
            </div>
          </motion.div>

          {/* Scratch-to-Reveal Sacred Blessing (If enabled) */}
          {data.scratch_enabled === "yes" && (
            <motion.div variants={fadeInUp} className="mt-10">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#e8c86d] font-bold block mb-3">
                SCRATCH TO REVEAL CEREMONY SECRET
              </span>
              <ScratchReveal
                dateString={data.wedding_date}
              />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CEREMONIAL FUNCTIONS TIMELINE (SCROLL EXPERIENCE)                      */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 md:px-12 z-10 border-t border-[#c59b27]/25">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c86d] font-bold block mb-2">
              சுப நிகழ்வுகள்
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-[#fff3cc] uppercase">
              Wedding Functions
            </h2>
            <div className="h-[1.5px] w-28 bg-[#c59b27] mx-auto mt-3" />
          </motion.div>

          <div className="w-full space-y-6">
            {/* Function 1: Sangeet / Janavasam */}
            {data.sangeet_enabled === "yes" && data.sangeet_date && (
              <motion.div
                variants={fadeInUp}
                className="p-6 md:p-8 rounded-2xl bg-[#2e040c]/90 border border-[#c59b27]/40 shadow-xl relative overflow-hidden backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a0815] border border-[#c59b27]/30 text-[10px] tracking-[0.2em] uppercase text-[#eed57c] font-bold mb-2">
                      மாலையீடல் & சங்கீதம்
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#fff3cc] uppercase">
                      Janavasam & Musical Evening
                    </h3>
                    <p className="text-xs text-[#d8c3a1] mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#eed57c]" />
                      {formatDate(data.sangeet_date)}
                    </p>
                  </div>
                  {data.sangeet_venue && (
                    <div className="md:text-right border-t md:border-t-0 md:border-l border-[#c59b27]/25 pt-3 md:pt-0 md:pl-6">
                      <p className="text-xs text-[#f5ebd7] font-medium flex items-center md:justify-end gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#eed57c]" />
                        {data.sangeet_venue}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Function 2: Kalyana Muhurtham (The Main Event) */}
            <motion.div
              variants={fadeInUp}
              className="p-6 md:p-10 rounded-2xl bg-gradient-to-r from-[#4d0917]/95 via-[#3b0610]/95 to-[#4d0917]/95 border-2 border-[#eed57c] shadow-[0_15px_40px_rgba(212,175,55,0.25)] relative overflow-hidden backdrop-blur-md"
            >
              {/* Auspicious Stamp */}
              <div className="absolute top-4 right-4 text-2xl opacity-60">🛕</div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6a0f23] border border-[#eed57c] text-[10px] tracking-[0.25em] uppercase text-[#fff5d6] font-bold mb-3">
                சுப முகூர்த்தம் · KALYANA MUHURTHAM
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#fff5d6] uppercase tracking-wide mb-2">
                Sacred Wedding Ceremony
              </h3>
              <p className="text-sm text-[#eed57c] font-semibold flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#eed57c]" />
                {formatDate(data.wedding_date)}
              </p>
              <div className="p-4 rounded-xl bg-[#250308]/80 border border-[#c59b27]/30 text-xs md:text-sm text-[#f5ebd7] leading-relaxed">
                <span className="font-bold text-[#eed57c] block mb-1">MANDAPAM VENUE:</span>
                {data.wedding_venue || "Brihadeeswarar Temple Kalyana Mandapam, Thanjavur"}
              </div>
            </motion.div>

            {/* Function 3: Reception Gala */}
            {data.reception_date && (
              <motion.div
                variants={fadeInUp}
                className="p-6 md:p-8 rounded-2xl bg-[#2e040c]/90 border border-[#c59b27]/40 shadow-xl relative overflow-hidden backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a0815] border border-[#c59b27]/30 text-[10px] tracking-[0.2em] uppercase text-[#eed57c] font-bold mb-2">
                      மங்கள வரவேற்பு
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#fff3cc] uppercase">
                      Grand Reception Gala
                    </h3>
                    <p className="text-xs text-[#d8c3a1] mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#eed57c]" />
                      {formatDate(data.reception_date)}
                    </p>
                  </div>
                  {data.reception_venue && (
                    <div className="md:text-right border-t md:border-t-0 md:border-l border-[#c59b27]/25 pt-3 md:pt-0 md:pl-6">
                      <p className="text-xs text-[#f5ebd7] font-medium flex items-center md:justify-end gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#eed57c]" />
                        {data.reception_venue}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TEMPLE VENUE & LIVE GOOGLE MAPS EMBED                                  */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 md:px-12 z-10 border-t border-[#c59b27]/25">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c86d] font-bold block mb-2">
              திருத்தல வழிகாட்டி
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#fff3cc] uppercase">
              Temple Venue & Directions
            </h2>
            <div className="h-[1.5px] w-24 bg-[#c59b27] mx-auto mt-3" />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="rounded-3xl overflow-hidden border-2 border-[#c59b27]/40 shadow-2xl bg-[#28040a]"
          >
            {/* Live Interactive Google Map */}
            <div className="w-full h-72 md:h-96 relative">
              <iframe
                title="Temple Location Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                loading="lazy"
                allowFullScreen
              />
            </div>
            {/* Address Banner */}
            <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#35050e]">
              <div className="text-center sm:text-left">
                <span className="text-[10px] tracking-[0.25em] text-[#eed57c] uppercase font-bold block mb-1">
                  CEREMONIAL LOCATION
                </span>
                <p className="text-sm md:text-base text-[#fff5d6] font-medium leading-relaxed">
                  {data.wedding_venue || "Brihadeeswarar Temple Kalyana Mandapam, Thanjavur, Tamil Nadu"}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  data.wedding_venue || "Brihadeeswarar Temple Thanjavur"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#eed57c] text-[#240308] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition shrink-0"
              >
                Open in Maps
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PHOTO SLIDESHOW IN GILDED THANJAVUR FRAME                              */}
      {/* ========================================================================= */}
      {data.slideshow_enabled !== "no" && data.slideshow_images && (
        <section className="relative py-20 px-4 md:px-12 z-10 border-t border-[#c59b27]/25">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c86d] font-bold block mb-2">
                அழகு தருணங்கள்
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#fff3cc] uppercase">
                Moments of Grace
              </h2>
              <div className="h-[1.5px] w-24 bg-[#c59b27] mx-auto mt-3" />
            </motion.div>

            <motion.div variants={fadeInUp} className="p-3 md:p-6 rounded-3xl bg-[#31040d] border-2 border-[#d4af37]/50 shadow-2xl">
              <PhotoSlideshow imagesString={data.slideshow_images} />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. ATTIRE, CONVEYANCE & WELCOMING FAMILIES                                */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 md:px-12 z-10 border-t border-[#c59b27]/25">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center space-y-12"
        >
          {/* Dress Code & Travel Guidelines */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#31040d]/90 border border-[#c59b27]/40 flex flex-col items-center">
                  <Compass className="w-6 h-6 text-[#eed57c] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#eed57c] font-bold mb-2">
                    பாரம்பரிய ஆடை முறை (Dress Code)
                  </h4>
                  <p className="text-xs text-[#f5ebd7] leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#31040d]/90 border border-[#c59b27]/40 flex flex-col items-center">
                  <Bus className="w-6 h-6 text-[#eed57c] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#eed57c] font-bold mb-2">
                    பயண வழிகாட்டுதல் (Conveyance)
                  </h4>
                  <p className="text-xs text-[#f5ebd7] leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Welcoming Lineages */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="pt-4">
              <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#eed57c] font-bold block mb-2">
                இவண் அன்புடன் அழைக்கும்
              </span>
              <p className="text-2xl md:text-4xl text-[#fff3cc] font-serif tracking-wider font-bold">
                {data.family_names}
              </p>
            </motion.div>
          )}

          {/* Custom Greeting Note */}
          {data.custom_message && (
            <motion.p variants={fadeInUp} className="max-w-lg mx-auto text-xs md:text-sm text-[#f5ebd7] italic leading-relaxed">
              &ldquo;{data.custom_message}&rdquo;
            </motion.p>
          )}
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CEREMONIAL RSVP DESK & BLESSINGS RESPONSE                              */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 md:px-12 z-10 border-t border-[#c59b27]/25 pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c86d] font-bold block mb-2">
              நிகழ்வு வருகை உறுதி
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#fff3cc] uppercase">
              Blessings & RSVP
            </h2>
            <div className="h-[1.5px] w-24 bg-[#c59b27] mx-auto mt-3" />
          </motion.div>

          {rsvpSent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-[#3b0610] border-2 border-[#eed57c] shadow-2xl text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-[#eed57c] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#fff3cc] mb-1">மிக்க நன்றி! RSVP Confirmed</h3>
              <p className="text-xs text-[#f5ebd7] leading-relaxed">
                We are overjoyed to welcome you with warm hugs, pattu shawls, and sacred temple blessings.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              className="p-6 md:p-8 rounded-3xl bg-[#31040d]/95 border-2 border-[#c59b27]/50 shadow-2xl text-left"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#eed57c] font-bold mb-1">
                    Your Name(s) / குடும்பத்தின் பெயர்
                  </label>
                  <input
                    type="text"
                    value={guestNames}
                    onChange={(e) => setGuestNames(e.target.value)}
                    placeholder="e.g. Ramesh & Family"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#200207] border border-[#c59b27]/40 text-[#fff5d6] text-xs focus:outline-none focus:border-[#eed57c]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#eed57c] font-bold mb-1">
                    Number of Guests Attending
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#200207] border border-[#c59b27]/40 text-[#fff5d6] text-xs focus:outline-none focus:border-[#eed57c]"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4+">Family (4+ Persons)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setRsvpSent(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#eed57c] to-[#d4af37] text-[#240308] font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition"
                >
                  Confirm Auspicious Attendance
                </button>
              </div>

              {/* Direct Phone & WhatsApp Callouts */}
              {data.rsvp_phone && (
                <div className="mt-6 pt-6 border-t border-[#c59b27]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-[#eed57c] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>RSVP Desk: {data.rsvp_phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${data.rsvp_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Vanakkam! We are happy to confirm our presence for the wedding of ${data.bride_name} & ${data.groom_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366]/20 border border-[#25d366]/40 text-[#25d366] font-semibold hover:bg-[#25d366]/30 transition text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp RSVP
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
