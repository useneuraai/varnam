"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { 
  Calendar, Clock, MapPin, Sparkles, Heart, Compass, Bus, Phone, 
  ChevronDown, CheckCircle2, MessageCircle, Music 
} from "lucide-react";

export default function VizhaTemplate({
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
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.16 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/vizha.jpg";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.wedding_venue || "Mayor Ramanathan Chettiar Kalyana Mandapam, Chennai"
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative min-h-screen bg-[#fffdf9] text-[#2d251e] font-sans overflow-x-hidden selection:bg-[#fa8231] selection:text-white">
      {/* Warm Cream Base with Subtle Festive Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 10%, #fff7eb 0%, #fffdf9 55%, #faedd9 100%)`,
        }}
      />
      
      {/* Floating Orange & Turmeric Marigold Florets */}
      <FloatingFlowers type="marigold" count={26} />

      {/* TOP MARIGOLD GARLAND STRANDS SWAYING */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none select-none overflow-hidden">
        {/* Continuous Swag of Chendumalli (Marigolds) */}
        <div className="w-full flex justify-between items-start h-12 md:h-16 px-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, i % 2 === 0 ? 4 : -4, 0] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center -mx-1"
            >
              {/* String */}
              <div className="w-[1px] h-2 bg-[#d35400]/40" />
              {/* Marigold flower bud */}
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full shadow-md border border-[#e67e22]/50 ${
                  i % 2 === 0
                    ? "bg-gradient-to-br from-[#fed330] via-[#f7b731] to-[#fa8231]"
                    : "bg-gradient-to-br from-[#fa8231] via-[#eb3b5a] to-[#d81b60]"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* FESTIVE PARROT GREEN & TURMERIC CORNER BORDERS */}
      <div className="fixed inset-3 md:inset-6 border-2 border-[#f7b731]/30 pointer-events-none z-30 rounded-3xl">
        {/* Banana Leaf / Kolam Accent Corners */}
        <div className="absolute top-2 left-2 text-xl opacity-70">🌿</div>
        <div className="absolute top-2 right-2 text-xl opacity-70">🌿</div>
        <div className="absolute bottom-2 left-2 text-xl opacity-70">🪷</div>
        <div className="absolute bottom-2 right-2 text-xl opacity-70">🪷</div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: JOYFUL, VIBRANT, MANDAPAM BACKDROP                      */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-12 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto flex flex-col items-center w-full"
        >
          {/* SELF-DRAWING KOLAM MANDALA VECTOR */}
          <motion.div variants={fadeInUp} className="w-20 h-20 md:w-28 md:h-28 mb-4">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              {/* Self-drawing Kolam curves */}
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                stroke="#fa8231"
                strokeWidth="1.5"
                strokeDasharray="280"
                initial={{ strokeDashoffset: 280 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M50 6 Q65 35 94 50 Q65 65 50 94 Q35 65 6 50 Q35 35 50 6 Z"
                stroke="#eb3b5a"
                strokeWidth="1.5"
                strokeDasharray="300"
                initial={{ strokeDashoffset: 300 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3, delay: 0.3, ease: "easeInOut" }}
              />
              <motion.path
                d="M20 20 L80 80 M80 20 L20 80"
                stroke="#20bf6b"
                strokeWidth="1"
                strokeDasharray="180"
                initial={{ strokeDashoffset: 180 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, delay: 0.6 }}
              />
              <circle cx="50" cy="50" r="6" fill="#f7b731" />
            </svg>
          </motion.div>

          {/* Festive Tamil Display Tagline */}
          <motion.div variants={fadeInUp} className="mb-2">
            <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-[#fa8231] via-[#eb3b5a] to-[#fa8231] text-white font-bold text-xs md:text-sm tracking-[0.25em] uppercase shadow-lg">
              கல்யாண வைபவம்!
            </span>
          </motion.div>

          {/* MANDAPAM ARCHED COUPLE PORTRAIT */}
          <motion.div
            variants={fadeInUp}
            className="relative my-4 p-3 rounded-t-[160px] rounded-b-3xl bg-gradient-to-b from-[#f7b731] via-[#eb3b5a] to-[#20bf6b] shadow-[0_20px_50px_rgba(250,130,49,0.3)] border-2 border-white"
          >
            <div className="relative overflow-hidden rounded-t-[152px] rounded-b-2xl w-64 sm:w-80 md:w-96 h-84 sm:h-[400px] md:h-[460px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} & ${data.groom_name}`}
                className="w-full h-full object-cover filter brightness-[1.04] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* Festive Banana Leaf Trunks on Sides */}
            <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-[#20bf6b] border-2 border-white flex items-center justify-center text-sm shadow-md">
              🌴
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#20bf6b] border-2 border-white flex items-center justify-center text-sm shadow-md">
              🌴
            </div>
          </motion.div>

          {/* HUGE ENERGETIC NAMES */}
          <motion.div variants={fadeInUp} className="my-6 w-full">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-wider text-[#d35400] uppercase font-serif drop-shadow-sm">
              {data.groom_name || "VISHNU"}
            </h1>
            <div className="text-xs md:text-sm text-[#eb3b5a] font-bold tracking-[0.3em] my-1">
              விஷ்ணு
            </div>

            <div className="inline-flex items-center justify-center gap-3 my-2">
              <span className="w-12 h-[2px] bg-[#fa8231]" />
              <Heart className="w-6 h-6 text-[#eb3b5a] fill-[#eb3b5a] animate-pulse" />
              <span className="w-12 h-[2px] bg-[#fa8231]" />
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-wider text-[#d35400] uppercase font-serif drop-shadow-sm">
              {data.bride_name || "HARINI"}
            </h1>
            <div className="text-xs md:text-sm text-[#eb3b5a] font-bold tracking-[0.3em] my-1">
              ஹரிணி
            </div>
          </motion.div>

          {/* Auspicious Tagline */}
          {data.quote && (
            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-sm md:text-base text-[#614a3b] font-medium leading-relaxed my-2"
            >
              {data.quote}
            </motion.p>
          )}

          {/* Wedding Date Plaque */}
          <motion.div
            variants={fadeInUp}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#fff4e0] border-2 border-[#fa8231] shadow-md inline-flex items-center gap-2.5"
          >
            <Calendar className="w-4 h-4 text-[#fa8231]" />
            <span className="text-xs md:text-sm tracking-[0.15em] font-bold text-[#c0392b] uppercase">
              {formatDate(data.wedding_date)}
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-12 flex flex-col items-center text-[#fa8231]"
          >
            <span className="text-[10px] tracking-[0.2em] font-bold uppercase mb-1">வாழ்த்த வாருங்கள்</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE CELEBRATION VIBES: FOOD, MUSIC & SAPTAPADI                         */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 bg-[#fff8ed] border-y border-[#fa8231]/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span variants={fadeInUp} className="text-xs tracking-[0.3em] uppercase text-[#eb3b5a] font-black block mb-2">
            CELEBRATION OF HAPPINESS
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2d251e] tracking-tight uppercase mb-8">
            The Joyful Tamil Wedding
          </motion.h2>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#f7b731]/40 shadow-md">
              <div className="text-3xl mb-3">🎺</div>
              <h3 className="font-bold text-base text-[#d35400] mb-1">நாதஸ்வர தவில்</h3>
              <p className="text-xs text-[#6e5848] leading-relaxed">
                Rousing festive beats of Melam & Nadaswaram to welcome our sacred union.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#20bf6b]/40 shadow-md">
              <div className="text-3xl mb-3">🍃</div>
              <h3 className="font-bold text-base text-[#20bf6b] mb-1">தலைவாழை விருந்து</h3>
              <p className="text-xs text-[#6e5848] leading-relaxed">
                Sumptuous 21-course traditional banana leaf feast with Mysore Pak & Payasam.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#eb3b5a]/40 shadow-md">
              <div className="text-3xl mb-3">🌼</div>
              <h3 className="font-bold text-base text-[#eb3b5a] mb-1">மலர் மழை</h3>
              <p className="text-xs text-[#6e5848] leading-relaxed">
                Showers of fresh yellow and orange marigold petals and heartfelt laughter.
              </p>
            </div>
          </motion.div>

          {/* Interactive Scratch-to-Reveal */}
          {data.scratch_enabled === "yes" && (
            <motion.div variants={fadeInUp} className="mt-12">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#d35400] font-bold block mb-3">
                SCRATCH TO REVEAL FESTIVE BLESSING
              </span>
              <ScratchReveal
                dateString={data.wedding_date}
              />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MULTI-EVENT FESTIVE TIMELINE                                           */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-[#eb3b5a] font-black block mb-2">
              சுப முகூர்த்த நிகழ்வுகள்
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2d251e] tracking-tight uppercase">
              The Festive Lineup
            </h2>
            <div className="h-1 w-20 bg-[#fa8231] mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-8">
            {/* Event 1: Janavasam & Sangeet */}
            {data.sangeet_enabled === "yes" && data.sangeet_date && (
              <div className="p-8 rounded-3xl bg-[#fffaf2] border-2 border-[#f7b731] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7b731]/20 text-[#d35400] text-[10px] font-bold uppercase tracking-wider mb-2">
                    ஜானவாசம் & சங்கீத்
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d251e]">
                    Janavasam & Musical Night
                  </h3>
                  <p className="text-xs text-[#705a49] mt-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#fa8231]" />
                    {formatDate(data.sangeet_date)}
                  </p>
                </div>
                {data.sangeet_venue && (
                  <div className="md:text-right text-xs text-[#52463e]">
                    <span className="text-[10px] uppercase tracking-widest text-[#fa8231] font-bold block mb-1">LOCATION</span>
                    <p className="flex items-center md:justify-end gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#fa8231]" />
                      {data.sangeet_venue}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Event 2: Kalyana Muhurtham */}
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#fa8231] via-[#eb3b5a] to-[#d81b60] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 text-3xl opacity-40">🪷</div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-sm">
                சுப முகூர்த்தம் · KALYANA MUHURTHAM
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-wide mb-3">
                The Sacred Marriage Ceremony
              </h3>
              <p className="text-sm text-[#fed330] font-bold flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#fed330]" />
                {formatDate(data.wedding_date)}
              </p>
              <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-sm text-xs md:text-sm text-white leading-relaxed">
                <span className="font-bold text-[#fed330] block mb-1">MANDAPAM ADDRESS:</span>
                {data.wedding_venue || "Mayor Ramanathan Chettiar Kalyana Mandapam, Chennai"}
              </div>
            </div>

            {/* Event 3: Reception */}
            {data.reception_date && (
              <div className="p-8 rounded-3xl bg-[#fffaf2] border-2 border-[#f7b731] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20bf6b]/20 text-[#10ac84] text-[10px] font-bold uppercase tracking-wider mb-2">
                    வரவேற்பு நிகழ்ச்சி
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d251e]">
                    Grand Reception Gala
                  </h3>
                  <p className="text-xs text-[#705a49] mt-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#fa8231]" />
                    {formatDate(data.reception_date)}
                  </p>
                </div>
                {data.reception_venue && (
                  <div className="md:text-right text-xs text-[#52463e]">
                    <span className="text-[10px] uppercase tracking-widest text-[#fa8231] font-bold block mb-1">VENUE</span>
                    <p className="flex items-center md:justify-end gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#fa8231]" />
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
      {/* 4. FESTIVE GALLERY                                                        */}
      {/* ========================================================================= */}
      {data.slideshow_enabled !== "no" && data.slideshow_images && (
        <section className="relative py-24 px-6 md:px-12 z-10 max-w-5xl mx-auto text-center">
          <div className="mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#eb3b5a] font-black block mb-2">
              புகைப்பட தொகுப்பு
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2d251e] tracking-tight uppercase">
              Festive Memories
            </h2>
            <div className="h-1 w-20 bg-[#fa8231] mx-auto mt-4 rounded-full" />
          </div>

          <div className="p-4 rounded-3xl bg-white border-2 border-[#f7b731] shadow-lg">
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. LOCATION & GOOGLE MAPS EMBED                                           */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 max-w-5xl mx-auto">
        <div className="rounded-3xl overflow-hidden border-2 border-[#fa8231]/30 shadow-xl bg-white">
          <div className="w-full h-80 md:h-96">
            <iframe
              title="Venue Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#fffaf2]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] tracking-[0.25em] text-[#fa8231] uppercase font-bold block mb-1">
                KALYANA MANDAPAM
              </span>
              <p className="text-sm md:text-base text-[#2d251e] font-semibold">
                {data.wedding_venue || "Mayor Ramanathan Chettiar Kalyana Mandapam, Chennai"}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.wedding_venue || "MRC Kalyana Mandapam Chennai"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#fa8231] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#e67e22] transition"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FESTIVE RSVP WITH CELEBRATION BURST                                    */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 md:px-12 z-10 bg-[#fff5e6] border-t border-[#fa8231]/20 pb-36">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-[#eb3b5a] font-black block mb-2">
            வருகை உறுதி
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d251e] tracking-tight uppercase mb-4">
            Join The Festivities!
          </h2>
          <p className="text-xs md:text-sm text-[#705a49] leading-relaxed mb-8">
            Bring your biggest smiles and dance moves! Let us know how many members of your family will celebrate with us.
          </p>

          {rsvpSent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-white border-2 border-[#20bf6b] shadow-xl text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-[#20bf6b] mx-auto mb-3" />
              <h3 className="text-2xl font-black text-[#2d251e] mb-1">சூப்பர்! RSVP Confirmed!</h3>
              <p className="text-xs text-[#705a49] leading-relaxed">
                We cannot wait to feast on hot banana leaf meals and celebrate together!
              </p>
            </motion.div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border-2 border-[#fa8231]/40 shadow-xl text-left space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d35400] font-bold mb-1.5">
                  Your Full Name(s) / குடும்பத்தின் பெயர்
                </label>
                <input
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="e.g. Senthil, Meena & Children"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fffdf9] border border-[#fa8231]/30 text-[#2d251e] text-xs focus:outline-none focus:border-[#fa8231]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#d35400] font-bold mb-1.5">
                  How Many Guests Coming?
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fffdf9] border border-[#fa8231]/30 text-[#2d251e] text-xs focus:outline-none focus:border-[#fa8231]"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4+">Whole Family (4+)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setRsvpSent(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#fa8231] via-[#eb3b5a] to-[#fa8231] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition"
              >
                Confirm Attendance & Feast!
              </button>

              {data.rsvp_phone && (
                <div className="pt-4 border-t border-[#fa8231]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#705a49]">
                  <div className="flex items-center gap-1.5 text-[#d35400] font-semibold">
                    <Phone className="w-3.5 h-3.5" />
                    <span>RSVP Desk: {data.rsvp_phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${data.rsvp_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Vanakkam! We are so thrilled to celebrate with ${data.bride_name} & ${data.groom_name}!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366]/10 text-[#25d366] font-bold hover:bg-[#25d366]/20 transition text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp RSVP
                  </a>
                </div>
              )}
            </div>
          )}

          {data.family_names && (
            <p className="mt-8 text-xs tracking-[0.25em] uppercase text-[#eb3b5a] font-bold">
              WELCOMED WITH LOVE BY {data.family_names}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
