"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import SkyLanterns from "@/components/animations/SkyLanterns";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { 
  Calendar, Clock, MapPin, Sparkles, Heart, Compass, Bus, Phone, 
  ChevronDown, CheckCircle2, MessageCircle, Play, Pause, Volume2, VolumeX 
} from "lucide-react";

export default function ThanjavurHeritageTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestCount, setGuestCount] = useState("2");
  const [guestNames, setGuestNames] = useState("");

  const { scrollYProgress } = useScroll();
  const gopuramY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  // Audio setup
  const musicUrl = data.music_url || "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3";

  useEffect(() => {
    if (typeof window !== "undefined") {
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
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log("Audio play blocked:", e);
      });
    }
  };

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
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.16 } },
  };

  const groomName = data.groom_name || "VISHU";
  const brideName = data.bride_name || "KAVYA";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.wedding_venue || "Brihadeeswarar Temple Kalyana Mandapam, Thanjavur"
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative min-h-screen bg-[#073b54] text-[#fbf7ed] font-serif overflow-x-hidden selection:bg-[#f39c12] selection:text-white">
      {/* PAINTED AZURE TWILIGHT SKY BACKGROUND WITH CANVAS TEXTURE */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 25%, #157296 0%, #0c4e68 50%, #073549 100%)`,
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0"
        style={{
          backgroundImage: `radial-gradient(#ffffff 0.8px, transparent 0.8px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* FLOATING GLOWING SKY LANTERNS */}
      <SkyLanterns count={22} />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: SKY WITH FLOATING LANTERNS, NAMES & TOWERING GOPURAM     */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between items-center pt-16 pb-0 px-4 text-center z-10 overflow-hidden">
        {/* TOP SECTION: COUPLE NAMES FLOATING IN THE TWILIGHT SKY */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 max-w-3xl mx-auto flex flex-col items-center mt-6"
        >
          {/* Subtle Auspicious Chants Ribbon */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-sm">
            <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#fcedc7] font-semibold">
              திருக்கல்யாண வைபவம் · SACRED WEDDING INVITATION
            </span>
          </div>

          {/* Monumental White Serif Typography (Identical to reference screenshot) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-[0.14em] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-none">
            {groomName}
          </h1>

          <div className="inline-flex items-center justify-center gap-4 my-2 sm:my-3">
            <span className="h-[1px] w-12 bg-white/50" />
            <span className="text-lg sm:text-2xl md:text-3xl font-serif tracking-[0.25em] text-[#fed330] font-light uppercase drop-shadow">
              WEDS
            </span>
            <span className="h-[1px] w-12 bg-white/50" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-[0.14em] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-none">
            {brideName}
          </h1>

          {/* Tamil Script Names */}
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#fffae6] font-medium mt-3 drop-shadow">
            விஷ்ணு & காவ்யா
          </p>
        </motion.div>

        {/* TOWERING COLORFUL SOUTH INDIAN TEMPLE GOPURAM (MATCHING REFERENCE EXACTLY) */}
        <motion.div
          style={{ y: gopuramY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center mt-6 -mb-4"
        >
          {/* Golden Kalasams Finials Row atop the Gopuram */}
          <div className="flex justify-center items-end gap-1.5 sm:gap-2.5 mb-[-2px] relative z-20">
            {[14, 20, 26, 32, 38, 32, 26, 20, 14].map((h, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2.5, delay: idx * 0.1, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                {/* Brass Kalasam Urn SVG */}
                <svg width="20" height={h + 12} viewBox="0 0 20 44" fill="none" className="drop-shadow-[0_0_12px_rgba(254,211,48,0.7)]">
                  {/* Pointed spire tip */}
                  <path d="M10 0 L10 10" stroke="#fff3cc" strokeWidth="2" strokeLinecap="round" />
                  {/* Kalasam bulbous tier 1 */}
                  <circle cx="10" cy="14" r="5" fill="url(#kalasamGold)" />
                  {/* Tier 2 */}
                  <ellipse cx="10" cy="24" rx="7" ry="5" fill="url(#kalasamGold)" />
                  {/* Base pedestal */}
                  <path d="M4 32 L16 32 L18 44 L2 44 Z" fill="#d4a325" />
                  <defs>
                    <linearGradient id="kalasamGold" x1="0" y1="0" x2="20" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fff3cc" />
                      <stop offset="0.5" stopColor="#fed330" />
                      <stop offset="1" stopColor="#b3811b" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Multicolored Sculpted Gopuram Tower Graphic / Cutout */}
          <div className="relative w-full overflow-hidden shadow-[0_-15px_40px_rgba(0,0,0,0.5)] rounded-t-3xl border-t-2 border-[#eed57c]/60">
            <img
              src="/images/gopuram/temple_gopuram.jpg"
              alt="South Indian Temple Gopuram"
              className="w-full h-auto object-cover object-top filter brightness-[1.03] contrast-[1.06] drop-shadow-2xl"
            />
            {/* Subtle Gradient Blend into the bottom section */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#062c3e] via-transparent to-transparent opacity-80" />
          </div>

          {/* Scroll Down Invitation Prompt (As seen at bottom of reference Image 1) */}
          <div className="mt-[-28px] relative z-30 flex flex-col items-center">
            <div className="px-6 py-2 rounded-full bg-[#062c3e]/90 backdrop-blur-md border border-[#fed330]/60 shadow-xl inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-[#fff3cc]">
              <span>Here&apos;s how you can celebrate with us</span>
              <ChevronDown className="w-4 h-4 text-[#fed330] animate-bounce" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WEDDING INVITATION ANNOUNCEMENT & AUSPICIOUS DATE                      */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 bg-gradient-to-b from-[#062c3e] via-[#083d56] to-[#0a4866] border-t border-[#eed57c]/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Sacred Invocation */}
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#fed330] drop-shadow">
              ஸ்ரீ கணேஷாய நமஹ · ஓம் நமச்சிவாய
            </span>
            <div className="h-[1.5px] w-32 bg-gradient-to-r from-transparent via-[#fed330] to-transparent mx-auto mt-2" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-white uppercase mb-4"
          >
            The Sacred Wedding
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xs sm:text-sm md:text-base text-[#f5ecd5] font-light leading-relaxed max-w-xl mx-auto mb-8"
          >
            Under the divine golden grace of the Almighty and amidst the sacred resonating rhythms of Nadaswaram, 
            we invite you to grace the holy wedding ceremonies of our children.
          </motion.p>

          {/* Auspicious Muhurtham Date Plaque */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-[#031d2b]/90 border-2 border-[#fed330] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8"
          >
            <Calendar className="w-5 h-5 text-[#fed330]" />
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#eed57c] font-bold block">
                MUHURTHAM DATE & TIME
              </span>
              <span className="text-sm sm:text-base font-bold text-white tracking-wider">
                {formatDate(data.wedding_date)}
              </span>
            </div>
          </motion.div>

          {/* Couple Blessing Note */}
          {data.quote && (
            <motion.div
              variants={fadeInUp}
              className="p-5 rounded-2xl bg-[#042232]/80 border border-[#eed57c]/30 text-xs sm:text-sm text-[#fff4d1] leading-relaxed italic max-w-lg mx-auto"
            >
              &ldquo;{data.quote}&rdquo;
            </motion.div>
          )}

          {/* Interactive Scratch-to-Reveal (If enabled) */}
          {data.scratch_enabled === "yes" && (
            <motion.div variants={fadeInUp} className="mt-10">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#eed57c] font-bold block mb-3">
                SCRATCH TO REVEAL CEREMONY SECRET
              </span>
              <ScratchReveal dateString={data.wedding_date} />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MULTI-EVENT CEREMONIAL TIMELINE                                        */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 bg-[#07354c] border-y border-[#eed57c]/25">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#fed330] font-bold block mb-2">
              சுப முகூர்த்த நிகழ்வுகள்
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-white uppercase">
              Ceremonial Schedule
            </h2>
            <div className="h-[1.5px] w-24 bg-[#fed330] mx-auto mt-3" />
          </div>

          <div className="space-y-6">
            {/* Event 1: Janavasam & Sangeet */}
            {data.sangeet_enabled === "yes" && data.sangeet_date && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#052738]/90 border border-[#eed57c]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-sm">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fed330]/20 text-[#fed330] text-[10px] font-bold uppercase tracking-wider mb-2">
                    01 · ஜானவாசம் & சங்கீத்
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Janavasam & Musical Evening
                  </h3>
                  <p className="text-xs text-[#e0d3b6] mt-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#fed330]" />
                    {formatDate(data.sangeet_date)}
                  </p>
                </div>
                {data.sangeet_venue && (
                  <div className="sm:text-right text-xs text-[#e8dac1] border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#fed330] font-bold block mb-1">MANDAPAM VENUE</span>
                    <p className="flex items-center sm:justify-end gap-1 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#fed330]" />
                      {data.sangeet_venue}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Event 2: Kalyana Muhurtham (Crown Event) */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0c4e68] via-[#106283] to-[#0c4e68] border-2 border-[#fed330] shadow-[0_15px_40px_rgba(254,211,48,0.25)] relative overflow-hidden text-white">
              <div className="absolute top-4 right-4 text-3xl opacity-40">🛕</div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-[#fed330] text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-sm">
                சுப முகூர்த்தம் · KALYANA MUHURTHAM
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-wide mb-3 text-white">
                The Sacred Marriage Vows
              </h3>
              <p className="text-sm text-[#fed330] font-bold flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#fed330]" />
                {formatDate(data.wedding_date)}
              </p>
              <div className="p-4 rounded-2xl bg-[#052738]/80 backdrop-blur-sm text-xs sm:text-sm text-[#f5ecd5] leading-relaxed border border-white/15">
                <span className="font-bold text-[#fed330] block mb-1">KALYANA MANDAPAM:</span>
                {data.wedding_venue || "Brihadeeswarar Temple Kalyana Mandapam, Thanjavur"}
              </div>
            </div>

            {/* Event 3: Reception Gala */}
            {data.reception_date && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#052738]/90 border border-[#eed57c]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-sm">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fed330]/20 text-[#fed330] text-[10px] font-bold uppercase tracking-wider mb-2">
                    03 · வரவேற்பு விழா
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Grand Wedding Reception
                  </h3>
                  <p className="text-xs text-[#e0d3b6] mt-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#fed330]" />
                    {formatDate(data.reception_date)}
                  </p>
                </div>
                {data.reception_venue && (
                  <div className="sm:text-right text-xs text-[#e8dac1] border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#fed330] font-bold block mb-1">RECEPTION VENUE</span>
                    <p className="flex items-center sm:justify-end gap-1 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#fed330]" />
                      {data.reception_venue}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TEMPLE VENUE LOCATION & LIVE GOOGLE MAP                                */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.3em] uppercase text-[#fed330] font-bold block mb-2">
            திருத்தல வழிகாட்டி
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-white uppercase">
            Temple Mandapam & Map
          </h2>
          <div className="h-[1.5px] w-20 bg-[#fed330] mx-auto mt-3" />
        </div>

        <div className="rounded-3xl overflow-hidden border-2 border-[#eed57c]/40 shadow-2xl bg-[#052738]">
          <div className="w-full h-80 md:h-[420px]">
            <iframe
              title="Temple Venue Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0 filter contrast-[1.05]"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#041d2b]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] tracking-[0.25em] text-[#fed330] uppercase font-bold block mb-1">
                KALYANA MANDAPAM
              </span>
              <p className="text-sm sm:text-base text-white font-medium">
                {data.wedding_venue || "Sri Brihadeeswarar Temple Kalyana Mandapam, Thanjavur"}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.wedding_venue || "Brihadeeswarar Temple Thanjavur"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4a325] via-[#fed330] to-[#d4a325] text-[#062c3e] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition shrink-0"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PHOTO GALLERY: MEMORIES & MOMENTS                                      */}
      {/* ========================================================================= */}
      {data.slideshow_enabled !== "no" && data.slideshow_images && (
        <section className="relative py-24 px-6 md:px-12 z-10 max-w-5xl mx-auto text-center">
          <div className="mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#fed330] font-bold block mb-2">
              அழகு தருணங்கள்
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-white uppercase">
              Cherished Moments
            </h2>
            <div className="h-[1.5px] w-20 bg-[#fed330] mx-auto mt-3" />
          </div>

          <div className="p-4 rounded-3xl bg-[#052738]/90 border-2 border-[#eed57c]/50 shadow-2xl">
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. CEREMONIAL ATTIRE, CONVEYANCE & RSVP DESK                              */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 bg-[#062c3e] border-t border-[#eed57c]/25 pb-36">
        <div className="max-w-xl mx-auto text-center space-y-12">
          {/* Dress code and transport */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#041d2b] border border-[#eed57c]/30">
                  <Compass className="w-5 h-5 text-[#fed330] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#fed330] font-bold mb-1">
                    பாரம்பரிய ஆடை முறை (Attire)
                  </h4>
                  <p className="text-xs text-[#e8dac1] leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#041d2b] border border-[#eed57c]/30">
                  <Bus className="w-5 h-5 text-[#fed330] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#fed330] font-bold mb-1">
                    பயண வழிகாட்டுதல் (Travel)
                  </h4>
                  <p className="text-xs text-[#e8dac1] leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Welcoming Families */}
          {data.family_names && (
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#eed57c] font-bold block mb-2">
                இவண் அன்புடன் அழைக்கும்
              </span>
              <p className="text-2xl sm:text-3xl text-[#fff3cc] font-bold tracking-wider">
                {data.family_names}
              </p>
            </div>
          )}

          {/* RSVP Card */}
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#fed330] font-bold block mb-2">
              நிகழ்வு வருகை உறுதி
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-widest text-white uppercase mb-6">
              Confirm Auspicious Presence
            </h2>

            {rsvpSent ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-3xl bg-[#041d2b] border-2 border-[#fed330] shadow-2xl text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-[#fed330] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">மிக்க நன்றி! RSVP Confirmed</h3>
                <p className="text-xs text-[#f5ecd5] leading-relaxed">
                  We eagerly look forward to welcoming you with traditional temple honors, pattu shawls, and heartfelt love.
                </p>
              </motion.div>
            ) : (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#052738]/95 border-2 border-[#eed57c]/40 shadow-2xl text-left space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fed330] font-bold mb-1">
                    Your Name / குடும்பத்தின் பெயர்
                  </label>
                  <input
                    type="text"
                    value={guestNames}
                    onChange={(e) => setGuestNames(e.target.value)}
                    placeholder="e.g. Ramesh & Family"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#031924] border border-[#eed57c]/40 text-white text-xs focus:outline-none focus:border-[#fed330]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fed330] font-bold mb-1">
                    Guests Attending
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#031924] border border-[#eed57c]/40 text-white text-xs focus:outline-none focus:border-[#fed330]"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4+">Whole Family (4+ Persons)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setRsvpSent(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4a325] via-[#fed330] to-[#d4a325] text-[#062c3e] font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition"
                >
                  Confirm Auspicious Attendance
                </button>

                {data.rsvp_phone && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="text-[#eed57c] flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>RSVP Desk: {data.rsvp_phone}</span>
                    </div>
                    <a
                      href={`https://wa.me/${data.rsvp_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Vanakkam! We are happy to confirm our presence for the wedding of ${brideName} & ${groomName}.`
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
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FLOATING RED MUSIC PLAY BUTTON IN BOTTOM RIGHT (EXACT TO REFERENCE)       */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="relative w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(229,9,20,0.6)] border-2 border-white/80 transition-transform"
        >
          {/* Animated soundwave ring when playing */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border-2 border-[#e50914] animate-ping opacity-75 pointer-events-none" />
          )}
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white text-white" />
          ) : (
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
