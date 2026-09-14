"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus, MapPin, Calendar, Clock, Bookmark, Building, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/animations/CinematicEffects";

export default function ChettinadVintageTemplate({
  data,
  isPreview = false,
}: {
  data: TemplateData;
  isPreview?: boolean;
}) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/chettinad-vintage.jpg";

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #2e1c14 0%, #1c100b 60%, #0e0705 100%)",
      }}
      className="relative min-h-screen text-[#fbf7ee] overflow-x-hidden font-serif selection:bg-[#a9442a] selection:text-white select-none"
    >
      {/* Subtle Athangudi Tile Geometric Matrix Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: `radial-gradient(#d8a238 1px, transparent 1px), radial-gradient(#a9442a 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          backgroundPosition: "0 0, 18px 18px",
        }}
      />

      {/* Chettinad Teakwood Arch Frame Border */}
      <div className="fixed inset-3 md:inset-6 border border-[#d8a238]/25 pointer-events-none z-30">
        <div className="absolute inset-1.5 border border-[#a9442a]/20 pointer-events-none" />
        {/* Brass corner brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#d8a238]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#d8a238]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#d8a238]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#d8a238]" />
      </div>

      {/* HERO SECTION - CHETTINAD WEDDING ALBUM */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          {/* Header Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#3d2319]/80 border border-[#d8a238]/40 mb-6 shadow-sm">
            <Building className="w-3.5 h-3.5 text-[#d8a238]" />
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c67c] font-semibold">
              CHETTINAD HERITAGE UNION
            </span>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#d8a238] font-bold mb-3">
            HERITAGE OF DEVOTION & LINEAGE
          </motion.p>

          {/* Vintage Chettinad Courtyard Photo Frame */}
          <motion.div
            variants={fadeInUp}
            className="relative my-4 p-3 md:p-4 rounded-xl bg-[#26160f] border-2 border-[#d8a238]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Vintage Photo Corner Clasps */}
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d8a238]" />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d8a238]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d8a238]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d8a238]" />

            <div className="relative overflow-hidden rounded-lg w-64 sm:w-72 md:w-80 h-80 sm:h-96 md:h-[420px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} and ${data.groom_name}`}
                className="w-full h-full object-cover object-top filter sepia-[0.12] contrast-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e09] via-transparent to-transparent opacity-60" />
            </div>

            {/* Brass Monogram Stamp */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1c100b] border border-[#d8a238] flex items-center gap-2 shadow-xl">
              <Bookmark className="w-3.5 h-3.5 text-[#d8a238]" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#e8c67c]">
                ESTD {new Date(data.wedding_date || Date.now()).getFullYear()}
              </span>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-3xl md:text-4xl text-[#d8a238] mt-8 mb-2">
            The Family of
          </motion.p>

          {/* Couple Names */}
          <motion.div variants={fadeInUp} className="my-2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#fbf7ee]">
              {data.bride_name || "Meenakshi Achi"}
            </h1>
            <div className="inline-flex items-center justify-center gap-4 my-2">
              <div className="h-[1px] w-12 bg-[#d8a238]/40" />
              <span className="font-great-vibes text-3xl text-[#d8a238]">&amp;</span>
              <div className="h-[1px] w-12 bg-[#d8a238]/40" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-[#fbf7ee]">
              {data.groom_name || "Chidambaram Chettiar"}
            </h1>
          </motion.div>

          {/* Quote */}
          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl text-xs md:text-sm italic text-[#ecdcb9] leading-relaxed border-y border-[#d8a238]/25 py-3 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          {/* Countdown */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>
        </motion.div>
      </section>

      {/* ARCHITECTURAL COURTYARD TIMELINE */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-24 px-4 text-center z-10 border-t border-[#d8a238]/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#d8a238] uppercase font-bold block mb-1">
              HERITAGE EVENTS
            </span>
            <h2 className="text-2xl md:text-3xl tracking-[0.25em] text-[#fbf7ee] uppercase font-bold">
              Wedding Album & Schedule
            </h2>
            <div className="h-[1.5px] w-28 bg-[#a9442a] mx-auto mt-2" />
          </motion.div>

          {/* Sangeet / Pre-Wedding (Optional) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-xl bg-[#22130c] border border-[#a9442a]/40 shadow-xl relative overflow-hidden"
            >
              <div className="text-left border-l-2 border-[#d8a238] pl-4">
                <span className="text-[10px] tracking-[0.2em] text-[#d8a238] uppercase font-bold block mb-1">
                  CELEBRATION ONE
                </span>
                <h3 className="text-lg md:text-xl text-[#fbf7ee] font-bold tracking-wide uppercase mb-1">
                  Sangeet & Mehendi Night
                </h3>
                <p className="text-xs md:text-sm text-[#ecdcb9] flex items-center gap-2 my-2">
                  <Calendar className="w-4 h-4 text-[#d8a238]" />
                  {formatDate(data.sangeet_date)}
                </p>
                {data.sangeet_venue && (
                  <p className="text-xs text-[#c4b08f] leading-relaxed mt-2 whitespace-pre-line">
                    {data.sangeet_venue}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Kalyana Muhurtham */}
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-xl bg-[#2a170f] border-2 border-[#d8a238]/60 shadow-2xl relative overflow-hidden"
          >
            {/* Top Athangudi Pattern Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#a9442a] via-[#d8a238] to-[#a9442a] absolute top-0 left-0" />

            <div className="text-left border-l-2 border-[#a9442a] pl-4 mt-2">
              <span className="text-[10px] tracking-[0.25em] text-[#d8a238] uppercase font-bold block mb-1">
                AUSPICIOUS CEREMONY
              </span>
              <h3 className="text-xl md:text-2xl text-[#fbf7ee] font-bold tracking-wider uppercase mb-2">
                Auspicious Kalyana Muhurtham
              </h3>

              {data.scratch_enabled === "yes" ? (
                <div className="my-4">
                  <ScratchReveal dateString={formatDate(data.wedding_date)} />
                </div>
              ) : (
                <p className="text-sm md:text-base text-[#fbf7ee] font-semibold flex items-center gap-2 my-3">
                  <Clock className="w-4 h-4 text-[#d8a238]" />
                  {formatDate(data.wedding_date)}
                </p>
              )}

              <div className="mt-4 border-t border-[#d8a238]/20 pt-3">
                <span className="text-[10px] tracking-widest text-[#d8a238] uppercase font-bold block mb-1">
                  HERITAGE VENUE
                </span>
                <p className="text-xs md:text-sm text-[#ecdcb9] whitespace-pre-line leading-relaxed">
                  {data.wedding_venue}
                </p>
              </div>

              {/* Coordinates Map */}
              {data.gmap_coordinates && (
                <div className="w-full mt-4 h-44 rounded-lg border border-[#d8a238]/30 overflow-hidden">
                  {isPreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#180c07] text-center p-4">
                      <MapPin className="w-6 h-6 text-[#d8a238] animate-pulse mb-1" />
                      <span className="text-[11px] text-[#e8c67c]">Heritage Venue Location</span>
                      <span className="text-[9px] text-[#a49074] mt-0.5">Active on published wedding invite</span>
                    </div>
                  ) : (
                    <iframe
                      title="Chettinad Palace Venue Location"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                      className="w-full h-full border-0 grayscale opacity-80 hover:opacity-100 transition-opacity"
                      allowFullScreen
                      loading="lazy"
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Reception Gala */}
          {data.reception_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-xl bg-[#22130c] border border-[#a9442a]/40 shadow-xl relative overflow-hidden"
            >
              <div className="text-left border-l-2 border-[#d8a238] pl-4">
                <span className="text-[10px] tracking-[0.2em] text-[#d8a238] uppercase font-bold block mb-1">
                  CELEBRATION THREE
                </span>
                <h3 className="text-lg md:text-xl text-[#fbf7ee] font-bold tracking-wide uppercase mb-1">
                  Heritage Dinner & Reception
                </h3>
                <p className="text-xs md:text-sm text-[#ecdcb9] flex items-center gap-2 my-2">
                  <Calendar className="w-4 h-4 text-[#d8a238]" />
                  {formatDate(data.reception_date)}
                </p>
                {data.reception_venue && (
                  <p className="text-xs text-[#c4b08f] leading-relaxed mt-2 whitespace-pre-line">
                    {data.reception_venue}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Inviting Dynasties */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-6">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#d8a238] font-bold block mb-1">
                HOSTED WITH WARMEST REGARDS BY
              </span>
              <p className="font-great-vibes text-3xl md:text-4xl text-[#fbf7ee]">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* PHOTO ALBUM & PRACTICAL DETAILS */}
      <section className="relative min-h-[75dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10 border-t border-[#d8a238]/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full gap-10"
        >
          {/* Photo Slideshow */}
          {data.slideshow_enabled !== "no" && data.slideshow_images && (
            <motion.div variants={fadeInUp} className="w-full flex flex-col items-center">
              <span className="text-[10px] tracking-[0.25em] text-[#d8a238] uppercase font-bold mb-1">
                CHERISHED RETROSPECTIVE
              </span>
              <h2 className="text-2xl md:text-3xl tracking-widest text-[#fbf7ee] uppercase font-bold mb-6">
                Chettinad Album Memories
              </h2>
              <PhotoSlideshow imagesString={data.slideshow_images} />
            </motion.div>
          )}

          {/* Dress & Travel */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-6 rounded-xl bg-[#22130c] border border-[#d8a238]/30 flex flex-col items-center">
                  <Compass className="w-6 h-6 text-[#d8a238] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#d8a238] font-bold mb-2">
                    Attire Recommendation
                  </h4>
                  <p className="text-xs text-[#ecdcb9] leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-6 rounded-xl bg-[#22130c] border border-[#d8a238]/30 flex flex-col items-center">
                  <Bus className="w-6 h-6 text-[#d8a238] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#d8a238] font-bold mb-2">
                    Travel & Arrival
                  </h4>
                  <p className="text-xs text-[#ecdcb9] leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Custom Message */}
          {data.custom_message && (
            <motion.p variants={fadeInUp} className="max-w-lg text-xs md:text-sm text-[#ecdcb9] italic leading-relaxed">
              &ldquo;{data.custom_message}&rdquo;
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="pt-6 border-t border-[#d8a238]/25 w-full max-w-xs">
              <span className="text-[10px] tracking-[0.25em] text-[#d8a238] uppercase font-bold block mb-1">
                FAMILY DESK RSVP
              </span>
              <p className="text-sm text-[#fbf7ee] font-bold tracking-wider">
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
            <section key={idx} className="relative py-16 px-4 text-center z-10 border-t border-[#d8a238]/20">
              <div className="max-w-xl mx-auto p-6 md:p-8 rounded-xl bg-[#22130c] border border-[#d8a238]/30">
                <h3 className="text-lg text-[#fbf7ee] uppercase tracking-widest font-bold mb-4">{sec.title}</h3>
                <p className="text-xs md:text-sm text-[#ecdcb9] leading-relaxed whitespace-pre-line text-left">{sec.content}</p>
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
