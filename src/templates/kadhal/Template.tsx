"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { 
  Calendar, Clock, MapPin, ArrowUpRight, CheckCircle2, MessageCircle, Phone 
} from "lucide-react";

export default function KadhalTemplate({
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
  const heroImageScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.12]);
  const textParallax = useTransform(scrollYProgress, [0, 0.4], [0, 60]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  };

  const heroImage = data.bg_image_url || "/images/couples/kadhal.jpg";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.wedding_venue || "The Glass House Pavilion, Chennai"
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative min-h-screen bg-[#f7f6f2] text-[#0d0d0d] font-sans overflow-x-hidden selection:bg-[#d63031] selection:text-white">
      {/* Editorial Grid Rules */}
      <div className="fixed inset-0 pointer-events-none z-20 flex justify-between px-6 md:px-16 opacity-10">
        <div className="w-[1px] h-full bg-black" />
        <div className="hidden md:block w-[1px] h-full bg-black" />
        <div className="hidden lg:block w-[1px] h-full bg-black" />
        <div className="w-[1px] h-full bg-black" />
      </div>

      {/* Floating Vertical Label (Vogue Style) */}
      <div className="hidden md:block fixed top-1/2 -translate-y-1/2 right-4 z-30 [writing-mode:vertical-rl] text-[9px] uppercase tracking-[0.4em] text-[#8e8e93] select-none font-mono">
        VARNAM EDITORIAL · ISSUE NO. 05
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: FULL-SCREEN PHOTOGRAPH + MONUMENTAL EDITORIAL TYPE      */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between p-6 md:p-16 z-10 overflow-hidden">
        {/* Full-bleed Photo with Smooth Zoom on Scroll */}
        <motion.div 
          style={{ scale: heroImageScale }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src={heroImage}
            alt={`${data.bride_name} & ${data.groom_name}`}
            className="w-full h-full object-cover filter grayscale contrast-[1.08] brightness-[0.92]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f6f2] via-[#f7f6f2]/40 to-black/30" />
        </motion.div>

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] md:text-xs tracking-[0.25em] text-white/90 uppercase drop-shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d63031]" />
            <span>KADHAL · CHENNAI</span>
          </div>
          <div>13.0827° N, 80.2707° E</div>
        </div>

        {/* Monumental Hero Typography Floating Bottom */}
        <motion.div 
          style={{ y: textParallax }}
          className="relative z-10 max-w-5xl mt-auto pt-32"
        >
          {/* Subtle Poetic Tamil Phrase */}
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#d63031]" />
            <span className="text-xs md:text-sm font-serif tracking-[0.3em] uppercase text-[#d63031] font-semibold">
              இணையும் இரு இதயங்கள்
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light tracking-[-0.04em] text-[#0d0d0d] leading-[0.88] uppercase">
            {data.groom_name || "ADITHYA"}
          </h1>
          <div className="text-3xl sm:text-5xl md:text-7xl font-serif italic text-[#8e8e93] font-light my-2">
            ×
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light tracking-[-0.04em] text-[#0d0d0d] leading-[0.88] uppercase">
            {data.bride_name || "MEERA"}
          </h1>

          {/* Bottom Coordinates & Date Strip */}
          <div className="mt-8 pt-6 border-t border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs tracking-widest text-[#333]">
            <div>
              <span className="text-[#8e8e93] block text-[9px] uppercase">CEREMONY DATE</span>
              <span className="font-semibold uppercase text-black">{formatDate(data.wedding_date)}</span>
            </div>
            <div className="sm:text-right">
              <span className="text-[#8e8e93] block text-[9px] uppercase">VENUE & CITY</span>
              <span className="font-semibold uppercase text-black">{data.wedding_venue || "Chennai, Tamil Nadu"}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. EDITORIAL PROLOGUE: ASYMMETRIC MAGAZINE LAYOUT                         */}
      {/* ========================================================================= */}
      <section className="relative py-32 px-6 md:px-16 z-10 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Micro Column Indicator */}
          <div className="lg:col-span-3 font-mono text-xs tracking-widest text-[#8e8e93] space-y-4">
            <div className="text-[10px] uppercase text-[#d63031] font-bold">[PROLOGUE]</div>
            <p className="leading-relaxed">
              Modern love, timeless heritage. A celebration designed around intimacy, art, and intentional presence.
            </p>
            <div className="w-10 h-[1px] bg-black" />
          </div>

          {/* Main Statement */}
          <div className="lg:col-span-9 space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-[#0d0d0d] leading-tight">
              A contemporary chapter where ancient Tamil rhythms meet high editorial grace.
            </h2>
            <p className="text-sm md:text-lg text-[#555] font-light leading-relaxed max-w-2xl">
              {data.quote || "Two individuals. One shared vision of quiet luxury, unconditional joy, and lifelong discovery."}
            </p>
          </div>
        </motion.div>

        {/* Overlapping Photography Spread (Editorial Magazine Style) */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7 relative overflow-hidden bg-black shadow-2xl">
            <img
              src={heroImage}
              alt="Editorial frame"
              className="w-full h-[460px] md:h-[580px] object-cover filter contrast-[1.05]"
            />
            <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-widest text-white/80 uppercase">
              PLATE 01 · THE PORTRAIT
            </div>
          </div>
          <div className="md:col-span-5 md:-ml-12 relative z-10 p-8 md:p-12 bg-white shadow-xl border border-black/10 space-y-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#d63031] font-bold block">
              THE CONTEXT
            </span>
            <h3 className="text-2xl font-light text-[#0d0d0d] leading-snug">
              &ldquo;We wanted our wedding to feel like an intimate art gallery rather than a crowded convention.&rdquo;
            </h3>
            <p className="text-xs text-[#666] leading-relaxed font-light">
              Join us for hand-poured South Indian filter coffee, acoustic indie melodies, silk saree draping, and vows under the open sky.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MINIMAL CEREMONIAL TIMELINE                                            */}
      {/* ========================================================================= */}
      <section className="relative py-32 px-6 md:px-16 z-10 border-t border-black/10 bg-[#f2f0eb]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#d63031] font-bold block mb-2">
                SCHEDULE OF EVENTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#0d0d0d] uppercase">
                The Itinerary
              </h2>
            </div>
            <div className="font-mono text-xs text-[#8e8e93]">
              [ALL TIMINGS IN IST]
            </div>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {/* Event 1: Nalangu */}
            {data.sangeet_enabled === "yes" && data.sangeet_date && (
              <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-2 font-mono text-xs text-[#8e8e93]">01 / PRELUDE</div>
                <div className="md:col-span-6">
                  <h3 className="text-2xl font-light text-[#0d0d0d]">Nalangu & Acoustic Evening</h3>
                  <p className="text-xs text-[#666] mt-1">{formatDate(data.sangeet_date)}</p>
                </div>
                <div className="md:col-span-4 md:text-right font-mono text-xs text-[#333]">
                  {data.sangeet_venue || "Courtyard Pavilion"}
                </div>
              </div>
            )}

            {/* Event 2: Muhurtham */}
            <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white/60 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="md:col-span-2 font-mono text-xs text-[#d63031] font-bold">02 / CEREMONY</div>
              <div className="md:col-span-6">
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#d63031] text-white text-[9px] font-mono uppercase tracking-wider mb-2">
                  THE MAIN UNION
                </div>
                <h3 className="text-3xl font-light text-[#0d0d0d]">The Sacred Muhurtham</h3>
                <p className="text-xs text-[#666] mt-1 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#d63031]" />
                  {formatDate(data.wedding_date)}
                </p>
              </div>
              <div className="md:col-span-4 md:text-right font-mono text-xs text-[#111]">
                <p className="font-semibold">{data.wedding_venue || "The Glass House, Chennai"}</p>
                <p className="text-[#8e8e93] text-[10px] mt-0.5">Traditional Silk Veshti & Saree Attire</p>
              </div>
            </div>

            {/* Event 3: Reception */}
            {data.reception_date && (
              <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-2 font-mono text-xs text-[#8e8e93]">03 / CELEBRATION</div>
                <div className="md:col-span-6">
                  <h3 className="text-2xl font-light text-[#0d0d0d]">Contemporary Soirée</h3>
                  <p className="text-xs text-[#666] mt-1">{formatDate(data.reception_date)}</p>
                </div>
                <div className="md:col-span-4 md:text-right font-mono text-xs text-[#333]">
                  {data.reception_venue || "Seaside Grand Lawn"}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HIGH-DESIGN PHOTO GALLERY                                              */}
      {/* ========================================================================= */}
      {data.slideshow_enabled !== "no" && data.slideshow_images && (
        <section className="relative py-32 px-6 md:px-16 z-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 font-mono text-xs tracking-widest text-[#8e8e93]">
            <span>[VISUAL ARCHIVES]</span>
            <span>MOMENTS IN TIME</span>
          </div>
          <div className="p-3 bg-white border border-black/10 shadow-2xl">
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. LOCATION PROTOCOL & MAP                                                */}
      {/* ========================================================================= */}
      <section className="relative py-32 px-6 md:px-16 z-10 max-w-5xl mx-auto">
        <div className="border border-black bg-white shadow-xl">
          <div className="w-full h-80 md:h-[420px]">
            <iframe
              title="Venue Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0 filter grayscale contrast-[1.1]"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-black">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8e8e93] block mb-1">
                VENUE COORDINATES
              </span>
              <p className="text-lg font-light text-black">
                {data.wedding_venue || "The Glass House Pavilion, Chennai, Tamil Nadu"}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.wedding_venue || "Chennai"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-[#d63031] transition shrink-0"
            >
              <span>Navigation</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EDITORIAL RSVP PROTOCOL                                                */}
      {/* ========================================================================= */}
      <section className="relative py-32 px-6 md:px-16 z-10 border-t border-black/10 pb-40">
        <div className="max-w-xl mx-auto text-center">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#d63031] font-bold block mb-3">
            [PROTOCOL 04 / CONFIRMATION]
          </span>
          <h2 className="text-4xl sm:text-5xl font-light text-[#0d0d0d] tracking-tight uppercase mb-4">
            Will You Join Us?
          </h2>
          <p className="text-xs md:text-sm text-[#666] font-light leading-relaxed mb-8">
            Please confirm your attendance so our culinary and seating curation can be tailored for you.
          </p>

          {rsvpSent ? (
            <div className="p-8 bg-white border border-black shadow-xl text-center">
              <CheckCircle2 className="w-10 h-10 text-[#d63031] mx-auto mb-3" />
              <h3 className="text-xl font-light text-black mb-1">Response Recorded</h3>
              <p className="text-xs text-[#666] font-mono">
                Thank you. We look forward to an unforgettable evening in Chennai.
              </p>
            </div>
          ) : (
            <div className="p-8 bg-white border border-black shadow-2xl text-left space-y-5">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#333] mb-1.5">
                  Guest Name(s)
                </label>
                <input
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="e.g. Meera Raman & Tarun"
                  className="w-full px-4 py-2.5 rounded-none bg-[#f7f6f2] border border-black/20 text-black text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#333] mb-1.5">
                  Attendance Number
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-none bg-[#f7f6f2] border border-black/20 text-black text-xs font-mono focus:outline-none focus:border-black"
                >
                  <option value="1">Attending (Solo)</option>
                  <option value="2">Attending (Pair / 2 Persons)</option>
                  <option value="3+">Attending (Group / Family)</option>
                  <option value="regrets">Regretfully Decline</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setRsvpSent(true)}
                className="w-full py-3.5 bg-black text-white font-mono text-xs uppercase tracking-[0.25em] hover:bg-[#d63031] transition"
              >
                Submit RSVP Protocol
              </button>

              {data.rsvp_phone && (
                <div className="pt-4 border-t border-black/10 flex items-center justify-between font-mono text-[11px] text-[#666]">
                  <div>RSVP: {data.rsvp_phone}</div>
                  <a
                    href={`https://wa.me/${data.rsvp_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hey! RSVP confirmation for ${data.bride_name} & ${data.groom_name}'s wedding celebration.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d63031] font-semibold hover:underline"
                  >
                    WhatsApp Direct →
                  </a>
                </div>
              )}
            </div>
          )}

          {data.family_names && (
            <p className="mt-8 font-mono text-[10px] tracking-[0.25em] uppercase text-[#8e8e93]">
              HOSTED BY {data.family_names}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
