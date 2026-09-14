"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { 
  Calendar, Clock, MapPin, Heart, Compass, Bus, Phone, 
  ChevronDown, CheckCircle2, MessageCircle, Sparkles 
} from "lucide-react";

export default function ManamaganTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestCount, setGuestCount] = useState("2");
  const [guestNames, setGuestNames] = useState("");

  const { scrollYProgress } = useScroll();
  // Vine growth factor based on scroll
  const vineOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 0.7, 0.9, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.06]);

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
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  };

  const heroImage = data.bg_image_url || "/images/couples/manamagan.jpg";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.wedding_venue || "The Leela Palace, Adyar, Chennai"
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#2c2724] font-serif overflow-x-hidden selection:bg-[#ebd9ce] selection:text-[#38261e]">
      {/* Warm Ivory & Delicate Texture Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 10%, #ffffff 0%, #faf6f0 55%, #f2eae2 100%)`,
        }}
      />
      
      {/* Floating White Jasmine Petals */}
      <FloatingFlowers type="jasmine" count={28} />

      {/* JASMINE VINES GROWING ALONG THE BORDERS ON SCROLL */}
      <motion.div 
        style={{ opacity: vineOpacity }}
        className="fixed top-0 bottom-0 left-0 w-8 md:w-16 pointer-events-none z-30 select-none overflow-hidden"
      >
        <svg viewBox="0 0 60 800" fill="none" className="h-full w-full opacity-60">
          <path
            d="M20 0 Q45 200 15 400 T30 800"
            stroke="#60725a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Jasmine blossoms along the vine */}
          {[60, 140, 230, 320, 420, 510, 610, 710].map((y, i) => (
            <g key={i} transform={`translate(${i % 2 === 0 ? 25 : 15}, ${y})`}>
              <ellipse cx="0" cy="-6" rx="3" ry="7" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <ellipse cx="6" cy="0" rx="7" ry="3" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <ellipse cx="0" cy="6" rx="3" ry="7" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <ellipse cx="-6" cy="0" rx="7" ry="3" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="2" fill="#e8c86d" />
            </g>
          ))}
        </svg>
      </motion.div>

      <motion.div 
        style={{ opacity: vineOpacity }}
        className="fixed top-0 bottom-0 right-0 w-8 md:w-16 pointer-events-none z-30 select-none overflow-hidden"
      >
        <svg viewBox="0 0 60 800" fill="none" className="h-full w-full opacity-60">
          <path
            d="M40 0 Q15 200 45 400 T30 800"
            stroke="#60725a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {[90, 180, 270, 370, 470, 560, 660, 750].map((y, i) => (
            <g key={i} transform={`translate(${i % 2 === 0 ? 35 : 45}, ${y})`}>
              <ellipse cx="0" cy="-6" rx="3" ry="7" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <ellipse cx="6" cy="0" rx="7" ry="3" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <ellipse cx="0" cy="6" rx="3" ry="7" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <ellipse cx="-6" cy="0" rx="7" ry="3" fill="#ffffff" stroke="#e8dfd8" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="2" fill="#e8c86d" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: FULL-BLEED COUPLE PHOTOGRAPH WITH ETHEREAL TYPOGRAPHY    */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100dvh] flex flex-col justify-end items-center pb-20 px-6 text-center z-10 overflow-hidden">
        {/* Full-Screen Couple Portrait */}
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src={heroImage}
            alt={`${data.bride_name} & ${data.groom_name}`}
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03]"
          />
          {/* Subtle Warm Gradient Overlay at Bottom and Top for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/60 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content Floating Over Image */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Subtle Romance Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#ebdcd3] mb-6 shadow-sm"
          >
            <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#695d54] font-medium">
              TWO PEOPLE · ONE LOVE STORY
            </span>
          </motion.div>

          {/* Thin, Highly Elegant Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-[0.08em] text-[#1f1a17] leading-tight">
              {data.groom_name || "Karthik"}
            </h1>
            <div className="inline-flex items-center justify-center gap-4 my-2">
              <span className="h-[0.5px] w-12 bg-[#8c7e73]/40" />
              <span className="font-serif italic text-2xl md:text-3xl text-[#7a6d63] font-light">&</span>
              <span className="h-[0.5px] w-12 bg-[#8c7e73]/40" />
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-[0.08em] text-[#1f1a17] leading-tight">
              {data.bride_name || "Nila"}
            </h1>
          </motion.div>

          {/* Tamil Script Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#73655b] font-medium mb-3"
          >
            கார்த்திக் & நிலா
          </motion.p>

          {/* Poetic Line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="font-serif italic text-base md:text-lg text-[#524741] max-w-md mx-auto mb-6"
          >
            {data.quote || "A beautiful beginning to forever. Like fresh jasmine at dawn, our love unfolds."}
          </motion.p>

          {/* Clean Thin Date Display */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="px-6 py-2 rounded-full border border-[#d9ccc2] bg-white/60 backdrop-blur-sm text-[11px] md:text-xs tracking-[0.3em] font-medium text-[#3b332d] uppercase shadow-sm"
          >
            {formatDate(data.wedding_date)}
          </motion.div>

          {/* Gentle Floating Jasmine Micro-Indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-10 flex flex-col items-center text-[#82746a] opacity-80"
          >
            <span className="text-[9px] tracking-[0.25em] uppercase mb-1">Scroll to Explore</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE LOVE STORY — EDITORIAL MAGAZINE LAYOUT (1 LARGE, 2 SMALL IMAGES)   */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Column: Intimate Poetic Story */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#7a6b61] font-semibold block">
              OUR JOURNEY · நங்கையின் காதல்
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#221c18] leading-tight tracking-wide">
              Two souls woven in laughter, grace & vows.
            </h2>
            <p className="text-sm md:text-base text-[#5c5047] leading-relaxed font-light">
              From our first quiet coffee overlooking Marina beach to shared family feasts of fragrant payasam, 
              every heartbeat has led us to this sacred dawn. We gather under the canopy of fresh Madurai malli 
              to make promises that will echo through lifetimes.
            </p>
            {data.custom_message && (
              <p className="text-xs md:text-sm text-[#736357] italic border-l-2 border-[#d9ccc2] pl-4 leading-relaxed">
                &ldquo;{data.custom_message}&rdquo;
              </p>
            )}
          </div>

          {/* Right Column: Editorial Photo Composition (2 Staggered Intimate Frames) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/60 group">
              <img
                src={heroImage}
                alt="Couple moment"
                className="w-full h-80 sm:h-96 object-cover filter brightness-[1.01] contrast-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-3 left-4 text-[10px] tracking-[0.25em] text-white/90 uppercase font-medium drop-shadow">
                MOMENT 01 · CHENNAI
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-xl border border-white/60 sm:mt-12 group">
              <img
                src="/images/couples/jasmine-romance.jpg"
                alt="Jasmine garland detail"
                className="w-full h-72 sm:h-84 object-cover filter brightness-[1.01] contrast-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-3 left-4 text-[10px] tracking-[0.25em] text-white/90 uppercase font-medium drop-shadow">
                MOMENT 02 · MALLIPOO
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CEREMONIAL CHAPTERS (AESTHETIC & AIRY)                                 */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 bg-[#f4eee6]/60 border-y border-[#ebdcd3]/70">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#7a6b61] font-semibold block mb-2">
              WEDDING CELEBRATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#221c18] tracking-wide">
              The Celebrations of Love
            </h2>
            <div className="h-[0.5px] w-20 bg-[#a69689] mx-auto mt-4" />
          </motion.div>

          <div className="space-y-12">
            {/* Event 1: Sangeet / Nalangu */}
            {data.sangeet_enabled === "yes" && data.sangeet_date && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="p-8 md:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-[#ebdcd3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#8c7a6e] font-semibold block mb-1">
                    NALANGU & SANGEET
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light text-[#241e1a]">
                    Turmeric & Jasmine Radiance
                  </h3>
                  <p className="text-xs text-[#6e6056] mt-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#8c7a6e]" />
                    {formatDate(data.sangeet_date)}
                  </p>
                </div>
                {data.sangeet_venue && (
                  <div className="md:text-right text-xs text-[#52463e]">
                    <span className="text-[10px] uppercase tracking-widest text-[#8c7a6e] font-bold block mb-1">VENUE</span>
                    <p className="flex items-center md:justify-end gap-1 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#8c7a6e]" />
                      {data.sangeet_venue}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Event 2: The Holy Muhurtham */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-[#ffffff] via-[#fcf9f5] to-[#f7ede6] border-2 border-[#d9ccc2] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 text-xl opacity-60">🌸</div>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#736357] font-semibold block mb-2">
                THE AUSPICIOUS MUHURTHAM · திருக்கல்யாணம்
              </span>
              <h3 className="text-3xl md:text-4xl font-light text-[#221c18] tracking-wide mb-3">
                The Sacred Vows
              </h3>
              <p className="text-sm text-[#4f433b] font-medium flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#8c7a6e]" />
                {formatDate(data.wedding_date)}
              </p>
              <div className="p-4 rounded-xl bg-white/70 border border-[#ebdcd3] text-xs text-[#5c4f46] leading-relaxed">
                <span className="font-bold text-[#3d332b] block mb-1">MANDAPAM LOCATION:</span>
                {data.wedding_venue || "The Leela Palace Seaside Lawns, Adyar, Chennai"}
              </div>
            </motion.div>

            {/* Event 3: Reception Gala */}
            {data.reception_date && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="p-8 md:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-[#ebdcd3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#8c7a6e] font-semibold block mb-1">
                    EVENING CELEBRATION
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light text-[#241e1a]">
                    Starlit Reception Gala
                  </h3>
                  <p className="text-xs text-[#6e6056] mt-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#8c7a6e]" />
                    {formatDate(data.reception_date)}
                  </p>
                </div>
                {data.reception_venue && (
                  <div className="md:text-right text-xs text-[#52463e]">
                    <span className="text-[10px] uppercase tracking-widest text-[#8c7a6e] font-bold block mb-1">VENUE</span>
                    <p className="flex items-center md:justify-end gap-1 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#8c7a6e]" />
                      {data.reception_venue}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PHOTO GALLERY: EDITORIAL PANORAMA & MAGAZINE CAROUSEL                  */}
      {/* ========================================================================= */}
      {data.slideshow_enabled !== "no" && data.slideshow_images && (
        <section className="relative py-28 px-6 md:px-16 z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="mb-10"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#7a6b61] font-semibold block mb-2">
              PORTRAITS OF DEVOTION
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#221c18] tracking-wide">
              The Photo Album
            </h2>
            <div className="h-[0.5px] w-16 bg-[#a69689] mx-auto mt-4" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="p-4 rounded-3xl bg-white/70 border border-[#ebdcd3] shadow-lg"
          >
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </motion.div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. SEASIDE VENUE & LIVE GOOGLE MAPS EMBED                                 */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#7a6b61] font-semibold block mb-2">
            LOCATION & DIRECTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#221c18] tracking-wide">
            The Wedding Venue
          </h2>
          <div className="h-[0.5px] w-16 bg-[#a69689] mx-auto mt-4" />
        </motion.div>

        <div className="rounded-3xl overflow-hidden border border-[#ebdcd3] shadow-lg bg-white">
          <div className="w-full h-80 md:h-[400px]">
            <iframe
              title="Venue Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0 filter saturate-[0.9] brightness-[1.02]"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#faf6f0]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] tracking-[0.25em] text-[#7a6b61] uppercase font-bold block mb-1">
                SEASIDE VENUE
              </span>
              <p className="text-sm md:text-base text-[#2c241f] font-light">
                {data.wedding_venue || "The Leela Palace Seaside Lawns, Adyar Seaface, Chennai"}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.wedding_venue || "The Leela Palace Chennai"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#2c241f] text-white font-light text-xs uppercase tracking-[0.2em] shadow-md hover:bg-black transition"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. JASMINE-FILLED WEDDING EVENING & ROMANTIC RSVP                         */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 md:px-16 z-10 bg-gradient-to-b from-[#faf8f5] via-[#f7ede8] to-[#f0e4dd] border-t border-[#ebdcd3] pb-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="max-w-xl mx-auto text-center"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#7a6b61] font-semibold block mb-2">
            A JASMINE EVENING TO REMEMBER
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#221c18] tracking-wide mb-4">
            Celebrate With Us
          </h2>
          <p className="text-xs md:text-sm text-[#5c5047] font-light leading-relaxed mb-8">
            Your presence completes our joy. Please let us know if you can grace our vows with your warmest love.
          </p>

          {rsvpSent ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-white border border-[#ebdcd3] shadow-md text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-[#60725a] mx-auto mb-3" />
              <h3 className="text-xl font-light text-[#221c18] mb-1">With All Our Love!</h3>
              <p className="text-xs text-[#5c5047] leading-relaxed">
                Your presence has been lovingly recorded. We look forward to embracing you amidst the jasmine blossoms.
              </p>
            </motion.div>
          ) : (
            <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#ebdcd3] shadow-lg text-left space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#695b52] font-semibold mb-1.5">
                  Your Full Name / Family
                </label>
                <input
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="e.g. Anand & Divya"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#ebdcd3] text-[#2c241f] text-xs focus:outline-none focus:border-[#7a6b61]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#695b52] font-semibold mb-1.5">
                  Will You Grace Our Celebrations?
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#ebdcd3] text-[#2c241f] text-xs focus:outline-none focus:border-[#7a6b61]"
                >
                  <option value="1">Joyfully Attending (1 Guest)</option>
                  <option value="2">Joyfully Attending (2 Guests)</option>
                  <option value="3+">Joyfully Attending (Family)</option>
                  <option value="regret">Sending Love & Blessings from Afar</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setRsvpSent(true)}
                className="w-full py-3 rounded-xl bg-[#2c241f] text-white font-light text-xs uppercase tracking-[0.2em] shadow-md hover:bg-black transition"
              >
                Send Your Warm RSVP
              </button>

              {data.rsvp_phone && (
                <div className="pt-4 border-t border-[#ebdcd3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6e6056]">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8c7a6e]" />
                    <span>Direct: {data.rsvp_phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${data.rsvp_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Vanakkam! We are so excited to attend the wedding of ${data.bride_name} & ${data.groom_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366]/10 text-[#25d366] font-medium hover:bg-[#25d366]/20 transition text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp RSVP
                  </a>
                </div>
              )}
            </div>
          )}

          {data.family_names && (
            <p className="mt-8 text-xs tracking-[0.25em] uppercase text-[#7a6b61]">
              WARMLY HOSTED BY {data.family_names}
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
}
