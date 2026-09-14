"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { 
  Calendar, Clock, MapPin, Sparkles, Compass, Bus, Phone, 
  ChevronDown, CheckCircle2, MessageCircle, ShieldCheck, Key 
} from "lucide-react";

export default function MangalamTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const [doorsOpen, setDoorsOpen] = useState(false);
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
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/mangalam.jpg";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.wedding_venue || "Madurai Meenakshi Temple Mandapam"
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative min-h-screen bg-[#0a090b] text-[#f7eed9] font-serif overflow-x-hidden selection:bg-[#d4af37] selection:text-black">
      {/* Dark Charcoal / Near-Black Obsidian Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 15%, #1f1418 0%, #0c090d 55%, #050406 100%)`,
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none opacity-10 mix-blend-screen z-0"
        style={{
          backgroundImage: `radial-gradient(#d4af37 0.6px, transparent 0.6px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating Micro Gold Sparks */}
      <FloatingFlowers type="sparkle" count={20} />

      {/* ULTRA-LUXURY THIN GOLD JEWELLERY BORDERS */}
      <div className="fixed inset-3 md:inset-8 border border-[#d4af37]/30 pointer-events-none z-30">
        <div className="absolute inset-1 border border-[#d4af37]/15" />
        {/* Jewellery Corner Motifs */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE TEMPLE DOORS OVERLAY (CAN BE OPENED ON CLICK OR SCROLL)       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!doorsOpen && !isPreview && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] } }}
            className="fixed inset-0 z-50 flex overflow-hidden pointer-events-auto select-none"
          >
            {/* Left Temple Door Leaf */}
            <motion.div
              exit={{ x: "-100%", transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] } }}
              className="w-1/2 h-full bg-gradient-to-r from-[#0d090b] via-[#1a1116] to-[#25151e] border-r border-[#d4af37]/40 relative flex items-center justify-end pr-4 sm:pr-10 shadow-2xl"
            >
              {/* Brass Studs & Architectural Panels */}
              <div className="absolute inset-6 border border-[#d4af37]/25 pointer-events-none flex flex-col justify-around items-center opacity-60">
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37]">🛕</div>
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37]">⚜️</div>
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37]">🪷</div>
              </div>
              {/* Left Brass Door Ring */}
              <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] bg-[#140b10] flex items-center justify-center text-xl text-[#eed57c] shadow-[0_0_20px_#d4af37]">
                🗝️
              </div>
            </motion.div>

            {/* Right Temple Door Leaf */}
            <motion.div
              exit={{ x: "100%", transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] } }}
              className="w-1/2 h-full bg-gradient-to-l from-[#0d090b] via-[#1a1116] to-[#25151e] border-l border-[#d4af37]/40 relative flex items-center justify-start pl-4 sm:pr-10 shadow-2xl"
            >
              <div className="absolute inset-6 border border-[#d4af37]/25 pointer-events-none flex flex-col justify-around items-center opacity-60">
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37]">🛕</div>
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37]">⚜️</div>
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37]">🪷</div>
              </div>
              {/* Right Brass Door Ring */}
              <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] bg-[#140b10] flex items-center justify-center text-xl text-[#eed57c] shadow-[0_0_20px_#d4af37]">
                🗝️
              </div>
            </motion.div>

            {/* Central Temple Seal & Open Trigger */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="pointer-events-auto flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#170a0f] border-2 border-[#eed57c] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.7)] mb-6">
                  <span className="text-3xl text-[#ffe49e] drop-shadow-[0_0_10px_#d4af37]">ॐ</span>
                </div>
                <span className="text-[11px] tracking-[0.4em] uppercase text-[#eed57c] font-bold mb-2">
                  THE SANCTUM EXPERIENCE
                </span>
                <h2 className="text-2xl sm:text-3xl font-light tracking-widest text-[#fff5db] uppercase mb-8 text-center px-4">
                  {data.groom_name || "ARJUN"} × {data.bride_name || "DHANYA"}
                </h2>
                <button
                  onClick={() => setDoorsOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b3811b] via-[#eed57c] to-[#b3811b] text-[#12070c] font-bold text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(238,213,124,0.5)] hover:scale-105 transition-transform"
                >
                  Enter The Sacred Sanctum
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO: DARK LUXURY SANCTUM                                     */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto flex flex-col items-center w-full"
        >
          {/* Radiant Sacred Symbol */}
          <motion.div variants={fadeInUp} className="mb-4">
            <div className="w-16 h-16 rounded-full border border-[#d4af37]/50 bg-[#170e13] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(212,175,55,0.35)]">
              <span className="text-2xl text-[#eed57c] font-bold">ॐ</span>
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4" />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#eed57c] font-medium mb-4"
          >
            THE SACRED MATRIMONY OF
          </motion.p>

          {/* Couple Portrait in Fine Museum Jewellery Frame */}
          <motion.div
            variants={fadeInUp}
            className="relative my-6 p-2 rounded-2xl bg-gradient-to-b from-[#d4af37]/60 via-[#402a14] to-[#120a0e] shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-[#eed57c]/30"
          >
            <div className="relative overflow-hidden rounded-xl w-64 sm:w-80 md:w-96 h-80 sm:h-96 md:h-[440px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} & ${data.groom_name}`}
                className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a090b] via-transparent to-transparent opacity-80" />
            </div>
          </motion.div>

          {/* Majestic High-Society Serif Typography */}
          <motion.div variants={fadeInUp} className="my-4 w-full">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#fff3cc] via-[#eed57c] to-[#e6be58] uppercase drop-shadow-[0_4px_24px_rgba(212,175,55,0.3)]">
              {data.groom_name || "ARJUN"}
            </h1>
            <div className="text-xs tracking-[0.35em] text-[#eed57c]/80 my-1 uppercase">
              அர்ஜுன்
            </div>

            <div className="inline-flex items-center justify-center gap-4 my-2">
              <div className="h-[0.5px] w-12 bg-[#d4af37]/40" />
              <span className="text-xl md:text-2xl text-[#eed57c] font-light italic">×</span>
              <div className="h-[0.5px] w-12 bg-[#d4af37]/40" />
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#fff3cc] via-[#eed57c] to-[#e6be58] uppercase drop-shadow-[0_4px_24px_rgba(212,175,55,0.3)]">
              {data.bride_name || "DHANYA"}
            </h1>
            <div className="text-xs tracking-[0.35em] text-[#eed57c]/80 my-1 uppercase">
              தான்யா
            </div>
          </motion.div>

          {data.quote && (
            <motion.p
              variants={fadeInUp}
              className="max-w-lg text-xs md:text-sm text-[#e8dac1] leading-relaxed italic mt-2 mb-6"
            >
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          {/* Muhurtham Date Plaque */}
          <motion.div
            variants={fadeInUp}
            className="px-8 py-2.5 rounded-full border border-[#d4af37]/60 bg-[#170e13]/80 backdrop-blur-md inline-flex items-center gap-3 shadow-lg"
          >
            <Calendar className="w-4 h-4 text-[#eed57c]" />
            <span className="text-xs md:text-sm tracking-[0.25em] font-medium text-[#fff3cc] uppercase">
              {formatDate(data.wedding_date)}
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 flex flex-col items-center text-[#eed57c] opacity-60"
          >
            <span className="text-[9px] tracking-[0.3em] uppercase mb-1">Explore The Chapters</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 4 CEREMONIAL CHAPTERS (LUXURY PRESENTATION)                        */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 border-t border-[#d4af37]/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#eed57c] font-medium block mb-2">
              THE SOLEMN LITURGY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest text-[#fff5db] uppercase">
              Ceremonial Chapters
            </h2>
            <div className="h-[1px] w-24 bg-[#d4af37] mx-auto mt-4" />
          </motion.div>

          <div className="space-y-10">
            {/* Chapter 01: Nichayathartham */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#140c10] via-[#1c1117] to-[#140c10] border border-[#d4af37]/40 shadow-2xl relative overflow-hidden backdrop-blur-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] tracking-[0.35em] uppercase text-[#eed57c] font-bold block mb-1">
                    CHAPTER 01
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light text-[#fff5db] tracking-wide uppercase">
                    Nichayathartham · The Auspicious Accord
                  </h3>
                  <p className="text-xs text-[#d6c7b0] mt-2 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#eed57c]" />
                    Auspicious Evening Accord & Exchange of Silk Thamboolam
                  </p>
                </div>
                <div className="md:text-right border-t md:border-t-0 md:border-l border-[#d4af37]/20 pt-4 md:pt-0 md:pl-8">
                  <span className="text-[10px] tracking-widest uppercase text-[#eed57c] block mb-1">ATTIRE</span>
                  <p className="text-xs text-[#eed57c] font-medium">Fine Kanchipuram Brocade</p>
                </div>
              </div>
            </motion.div>

            {/* Chapter 02: Vratham & Ancestral Rites */}
            {data.sangeet_enabled === "yes" && data.sangeet_date && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#140c10] via-[#1c1117] to-[#140c10] border border-[#d4af37]/40 shadow-2xl relative overflow-hidden backdrop-blur-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#eed57c] font-bold block mb-1">
                      CHAPTER 02
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-[#fff5db] tracking-wide uppercase">
                      Vratham & Ancestral Invocations
                    </h3>
                    <p className="text-xs text-[#d6c7b0] mt-2 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#eed57c]" />
                      {formatDate(data.sangeet_date)}
                    </p>
                  </div>
                  {data.sangeet_venue && (
                    <div className="md:text-right border-t md:border-t-0 md:border-l border-[#d4af37]/20 pt-4 md:pt-0 md:pl-8">
                      <span className="text-[10px] tracking-widest uppercase text-[#eed57c] block mb-1">SANCTUM VENUE</span>
                      <p className="text-xs text-[#f7eed9] flex items-center md:justify-end gap-1 font-light">
                        <MapPin className="w-3.5 h-3.5 text-[#eed57c]" />
                        {data.sangeet_venue}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Chapter 03: Kalyana Muhurtham (The Crown Chapter) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="p-8 md:p-14 rounded-3xl bg-gradient-to-r from-[#2a131c] via-[#1e0e15] to-[#2a131c] border-2 border-[#eed57c] shadow-[0_20px_50px_rgba(212,175,55,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 text-2xl opacity-50">👑</div>
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#eed57c] font-bold block mb-2">
                CHAPTER 03 · THE CROWN CEREMONY
              </span>
              <h3 className="text-3xl md:text-4xl font-light text-[#fff5db] tracking-wide uppercase mb-3">
                Kalyana Muhurtham & Mangalya Dharanam
              </h3>
              <p className="text-sm text-[#eed57c] font-semibold flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-[#eed57c]" />
                {formatDate(data.wedding_date)}
              </p>
              <div className="p-5 rounded-2xl bg-[#0e070a]/90 border border-[#d4af37]/40 text-xs md:text-sm text-[#f7eed9] leading-relaxed">
                <span className="font-bold text-[#eed57c] block mb-1 tracking-wider uppercase">HOLY SANCTUM:</span>
                {data.wedding_venue || "Grand Temple Sanctum Mandapam, Madurai"}
              </div>
            </motion.div>

            {/* Chapter 04: Raja Virundhu & Reception */}
            {data.reception_date && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#140c10] via-[#1c1117] to-[#140c10] border border-[#d4af37]/40 shadow-2xl relative overflow-hidden backdrop-blur-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[11px] tracking-[0.35em] uppercase text-[#eed57c] font-bold block mb-1">
                      CHAPTER 04
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-[#fff5db] tracking-wide uppercase">
                      Raja Virundhu & Reception Gala
                    </h3>
                    <p className="text-xs text-[#d6c7b0] mt-2 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#eed57c]" />
                      {formatDate(data.reception_date)}
                    </p>
                  </div>
                  {data.reception_venue && (
                    <div className="md:text-right border-t md:border-t-0 md:border-l border-[#d4af37]/20 pt-4 md:pt-0 md:pl-8">
                      <span className="text-[10px] tracking-widest uppercase text-[#eed57c] block mb-1">VENUE</span>
                      <p className="text-xs text-[#f7eed9] flex items-center md:justify-end gap-1 font-light">
                        <MapPin className="w-3.5 h-3.5 text-[#eed57c]" />
                        {data.reception_venue}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LUXURY GALLERY: JEWELLERY CASE FRAMING                                  */}
      {/* ========================================================================= */}
      {data.slideshow_enabled !== "no" && data.slideshow_images && (
        <section className="relative py-28 px-6 md:px-16 z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="mb-12"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#eed57c] font-medium block mb-2">
              ROYAL ARCHIVES
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-widest text-[#fff5db] uppercase">
              The Portrait Gallery
            </h2>
            <div className="h-[1px] w-20 bg-[#d4af37] mx-auto mt-4" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="p-4 rounded-3xl bg-[#130b10] border-2 border-[#d4af37]/40 shadow-2xl"
          >
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </motion.div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. TEMPLE SANCTUM MAP & VENUE                                             */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 max-w-5xl mx-auto">
        <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl bg-[#140b10]">
          <div className="w-full h-80 md:h-96">
            <iframe
              title="Temple Sanctum Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[1.2]"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#1a0f15]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] tracking-[0.25em] text-[#eed57c] uppercase font-bold block mb-1">
                SANCTUM LOCATION
              </span>
              <p className="text-sm md:text-base text-[#fff5db] font-light">
                {data.wedding_venue || "Grand Temple Sanctum Mandapam, Madurai"}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.wedding_venue || "Madurai Meenakshi Temple"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#eed57c] text-[#12070c] font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition"
            >
              Sanctum Navigation
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CEREMONIAL PROTOCOL & RSVP CONCIERGE                                   */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 border-t border-[#d4af37]/20 pb-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="max-w-xl mx-auto text-center"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#eed57c] font-medium block mb-2">
            SOLEMN CONFIRMATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-widest text-[#fff5db] uppercase mb-4">
            RSVP Concierge
          </h2>
          <p className="text-xs text-[#d6c7b0] leading-relaxed mb-8">
            Please confirm your honored presence so that ceremonial arrangements, floral honors, and feast seating can be impeccably prepared.
          </p>

          {rsvpSent ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-[#1c1117] border border-[#eed57c] shadow-2xl text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-[#eed57c] mx-auto mb-3" />
              <h3 className="text-xl font-light text-[#fff5db] mb-1">Your Auspicious Presence is Recorded</h3>
              <p className="text-xs text-[#d6c7b0] leading-relaxed">
                We await your divine presence at the sacred mandapam.
              </p>
            </motion.div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#170e14]/95 border border-[#d4af37]/50 shadow-2xl text-left space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#eed57c] font-semibold mb-1.5">
                  Guest / Family Name(s)
                </label>
                <input
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="e.g. Dr. K. Viswanathan & Family"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c070a] border border-[#d4af37]/40 text-[#fff5db] text-xs focus:outline-none focus:border-[#eed57c]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#eed57c] font-semibold mb-1.5">
                  Attendance Details
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c070a] border border-[#d4af37]/40 text-[#fff5db] text-xs focus:outline-none focus:border-[#eed57c]"
                >
                  <option value="1">Attending (1 Guest)</option>
                  <option value="2">Attending (2 Guests)</option>
                  <option value="3+">Attending (Family Lineage)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setRsvpSent(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b3811b] via-[#eed57c] to-[#b3811b] text-[#12070c] font-bold text-xs uppercase tracking-[0.25em] shadow-xl hover:brightness-110 transition"
              >
                Confirm Royal Presence
              </button>

              {data.rsvp_phone && (
                <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#d6c7b0]">
                  <div className="flex items-center gap-1.5 text-[#eed57c]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Concierge: {data.rsvp_phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${data.rsvp_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Vanakkam. We are honored to confirm our attendance for the wedding of ${data.bride_name} & ${data.groom_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366]/20 text-[#25d366] font-semibold hover:bg-[#25d366]/30 transition text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Concierge
                  </a>
                </div>
              )}
            </div>
          )}

          {data.family_names && (
            <p className="mt-8 text-xs tracking-[0.3em] uppercase text-[#eed57c]">
              ROYAL LINEAGES OF {data.family_names}
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
}
