"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus, MapPin, Calendar, Clock, ArrowUpRight, Sparkles, Grid } from "lucide-react";
import { CountdownTimer } from "@/components/animations/CinematicEffects";

export default function ModernTamilMinimalTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.14 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/modern-tamil-minimal.jpg";

  return (
    <div className="relative min-h-screen bg-[#fafaf9] text-[#141414] overflow-x-hidden font-sans selection:bg-black selection:text-white select-none">
      {/* Hairline Kolam Dot-Matrix Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `radial-gradient(#141414 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating Micro Monogram / Edition Mark */}
      <header className="fixed top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#b84a39]" />
          <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-500 font-bold">
            VARNAM / EDITORIAL N° 05
          </span>
        </div>
        <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-zinc-400">
          TAMIL MODERNIST
        </span>
      </header>

      {/* HERO SECTION - HIGH FASHION EDITORIAL */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center items-center py-28 px-6 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-5xl mx-auto flex flex-col items-center w-full"
        >
          {/* Editorial Eyebrow Tag */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-block px-4 py-1 rounded-full border border-zinc-200 bg-white text-[10px] tracking-[0.35em] font-mono uppercase text-zinc-600 font-bold shadow-xs">
              WEDDING EDITORIAL
            </span>
          </motion.div>

          {/* Symmetrical Hero Title */}
          <motion.div variants={fadeInUp} className="w-full mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif tracking-tight text-zinc-950 font-normal leading-none">
              {data.bride_name || "Maya"}
            </h1>
            <div className="flex items-center justify-center gap-6 my-4">
              <div className="h-[1px] w-20 bg-zinc-300" />
              <span className="font-mono text-xs tracking-[0.3em] text-[#b84a39] uppercase font-bold">
                AND
              </span>
              <div className="h-[1px] w-20 bg-zinc-300" />
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif tracking-tight text-zinc-950 font-normal leading-none">
              {data.groom_name || "Dev"}
            </h1>
          </motion.div>

          {/* Minimalist Kolam Knot Vector Motif */}
          <motion.div variants={fadeInUp} className="my-2 opacity-60">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#b84a39]">
              <circle cx="24" cy="24" r="2" fill="currentColor" />
              <circle cx="12" cy="24" r="2" fill="currentColor" />
              <circle cx="36" cy="24" r="2" fill="currentColor" />
              <circle cx="24" cy="12" r="2" fill="currentColor" />
              <circle cx="24" cy="36" r="2" fill="currentColor" />
              <path d="M 12 24 C 12 12 24 12 24 24 C 24 36 36 36 36 24 C 36 12 24 12 24 24 C 24 36 12 36 12 24" stroke="currentColor" strokeWidth="1" />
            </svg>
          </motion.div>

          {/* Editorial Portrait with Clean White Double-Bezel Frame */}
          <motion.div
            variants={fadeInUp}
            className="relative my-8 p-3 rounded-3xl bg-white border border-zinc-200 shadow-[0_25px_60px_rgba(0,0,0,0.06)]"
          >
            <div className="relative overflow-hidden rounded-2xl w-64 sm:w-80 md:w-96 h-84 sm:h-[420px] md:h-[480px] bg-zinc-100">
              <img
                src={heroImage}
                alt={`${data.bride_name} and ${data.groom_name}`}
                className="w-full h-full object-cover object-top filter grayscale-[0.1] contrast-[1.03]"
              />
            </div>
          </motion.div>

          {/* Quote / Editorial Verse */}
          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-lg font-serif italic text-sm md:text-base text-zinc-600 leading-relaxed my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          {/* Modern Minimal Countdown */}
          <motion.div variants={fadeInUp} className="w-full my-6">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>
        </motion.div>
      </section>

      {/* EDITORIAL SCHEDULE / MULTI-EVENT */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center items-center py-28 px-6 text-center z-10 border-t border-zinc-200">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-4xl mx-auto flex flex-col items-center w-full"
        >
          <motion.div variants={fadeInUp} className="mb-14">
            <span className="text-[10px] tracking-[0.35em] font-mono uppercase text-[#b84a39] font-bold block mb-2">
              SCHEDULE OF EVENTS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-zinc-950 font-normal">
              The Celebration Itinerary
            </h2>
          </motion.div>

          {/* Sangeet / Pre-Wedding (Optional) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-400 font-semibold">
                  EVENT 01
                </span>
                <span className="text-xs font-mono text-[#b84a39] font-semibold">
                  EVENING GATHERING
                </span>
              </div>
              <h3 className="text-2xl font-serif text-zinc-950 mb-2">
                Sangeet & Cocktail
              </h3>
              <p className="text-sm font-mono text-zinc-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#b84a39]" />
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="text-xs text-zinc-500 whitespace-pre-line leading-relaxed border-t border-zinc-100 pt-3 mt-3">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Main Kalyana Muhurtham Ceremony Card */}
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-xl mb-8 p-8 md:p-10 rounded-3xl bg-white border-2 border-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-left relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-500 font-bold">
                MAIN CEREMONY
              </span>
              <span className="inline-block px-3 py-0.5 rounded-full bg-zinc-900 text-white font-mono text-[9px] tracking-widest uppercase font-semibold">
                MUHURTHAM
              </span>
            </div>

            <h3 className="text-3xl font-serif text-zinc-950 mb-3">
              Sacred Vows Ceremony
            </h3>

            {data.scratch_enabled === "yes" ? (
              <div className="my-4">
                <ScratchReveal dateString={formatDate(data.wedding_date)} />
              </div>
            ) : (
              <p className="text-base font-mono text-zinc-800 font-semibold flex items-center gap-2 my-4">
                <Clock className="w-4 h-4 text-[#b84a39]" />
                {formatDate(data.wedding_date)}
              </p>
            )}

            <div className="border-t border-zinc-200 pt-4 mt-4">
              <span className="text-[10px] tracking-widest font-mono uppercase text-zinc-400 block mb-1">
                VENUE LOCATION
              </span>
              <p className="text-sm font-serif text-zinc-800 whitespace-pre-line leading-relaxed font-medium">
                {data.wedding_venue}
              </p>
            </div>

            {/* Google Maps Coordinates Preview */}
            {data.gmap_coordinates && (
              <div className="w-full mt-5 h-48 rounded-2xl border border-zinc-200 overflow-hidden">
                {isPreview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-center p-4">
                    <MapPin className="w-6 h-6 text-[#b84a39] animate-pulse mb-1" />
                    <span className="text-xs font-mono text-zinc-700">Venue Map Location</span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-0.5">Live on published invitation</span>
                  </div>
                ) : (
                  <iframe
                    title="Modern Minimal Venue Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                    allowFullScreen
                    loading="lazy"
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* Reception Gala */}
          {data.reception_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-400 font-semibold">
                  EVENT 03
                </span>
                <span className="text-xs font-mono text-[#b84a39] font-semibold">
                  EVENING SOIREE
                </span>
              </div>
              <h3 className="text-2xl font-serif text-zinc-950 mb-2">
                Reception Gala Dinner
              </h3>
              <p className="text-sm font-mono text-zinc-600 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#b84a39]" />
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="text-xs text-zinc-500 whitespace-pre-line leading-relaxed border-t border-zinc-100 pt-3 mt-3">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Welcoming Families */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-8">
              <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-400 font-bold block mb-2">
                HOSTED WITH WARMEST REGARDS
              </span>
              <p className="text-2xl font-serif text-zinc-900">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* EDITORIAL GALLERY & GUIDELINES */}
      <section className="relative min-h-[70dvh] flex flex-col justify-center items-center py-24 px-6 text-center z-10 border-t border-zinc-200">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-4xl mx-auto flex flex-col items-center w-full gap-10"
        >
          {/* Photo Slideshow */}
          {data.slideshow_enabled !== "no" && data.slideshow_images && (
            <motion.div variants={fadeInUp} className="w-full flex flex-col items-center">
              <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-400 font-bold mb-2">
                VISUAL ARCHIVE
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 mb-8">
                Selected Photographs
              </h2>
              <PhotoSlideshow imagesString={data.slideshow_images} />
            </motion.div>
          )}

          {/* Dress Code & Travel Guidelines */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-8 rounded-3xl bg-white border border-zinc-200 flex flex-col items-center shadow-xs">
                  <Compass className="w-6 h-6 text-[#b84a39] mb-3" />
                  <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-950 font-bold mb-2">
                    Attire Palette
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-8 rounded-3xl bg-white border border-zinc-200 flex flex-col items-center shadow-xs">
                  <Bus className="w-6 h-6 text-[#b84a39] mb-3" />
                  <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-950 font-bold mb-2">
                    Conveyance & Valet
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Custom Message */}
          {data.custom_message && (
            <motion.p variants={fadeInUp} className="max-w-md font-serif italic text-sm text-zinc-600 leading-relaxed">
              &ldquo;{data.custom_message}&rdquo;
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="pt-8 border-t border-zinc-200 w-full max-w-xs">
              <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-zinc-400 font-bold block mb-1">
                GUEST RSVP DESK
              </span>
              <p className="text-sm font-mono text-zinc-900 font-bold">
                {data.rsvp_phone}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Custom Sections */}
      {(() => {
        if (!data.custom_sections) return null;
        try {
          const sections = JSON.parse(data.custom_sections);
          if (!Array.isArray(sections) || sections.length === 0) return null;
          return sections.map((sec: any, idx: number) => (
            <section key={idx} className="relative py-16 px-6 text-center z-10 border-t border-zinc-200">
              <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-zinc-200 text-left">
                <h3 className="text-xl font-serif text-zinc-950 mb-3">{sec.title}</h3>
                <p className="text-xs md:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">{sec.content}</p>
              </div>
            </section>
          ));
        } catch {
          return null;
        }
      })()}
    </div>
  );
}
