"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus, MapPin, Calendar, Clock, Heart, Flower2, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/animations/CinematicEffects";

export default function JasmineRomanceTemplate({
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
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.16 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/jasmine-romance.jpg";

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #fffdfa 0%, #fdf6f7 50%, #f6eff1 100%)",
      }}
      className="relative min-h-screen text-[#4a393d] overflow-x-hidden font-serif selection:bg-[#f3d3da] selection:text-[#38262a] select-none"
    >
      {/* Cascading Fresh White Jasmine Flowers Animation */}
      <FloatingFlowers type="jasmine" count={22} />

      {/* Floating Gentle Petals / Sparkles */}
      <FloatingFlowers type="rose" count={12} />

      {/* Subtle Pearl Border Frame */}
      <div className="fixed inset-3 md:inset-6 border border-[#e8d2d6]/50 pointer-events-none z-30">
        <div className="absolute inset-1 border border-[#dfcb9f]/30 pointer-events-none" />
        {/* Delicate Floral Corner Vignettes */}
        <div className="absolute top-1 left-1 text-[#caa86b]/40"><Flower2 className="w-4 h-4" /></div>
        <div className="absolute top-1 right-1 text-[#caa86b]/40"><Flower2 className="w-4 h-4" /></div>
        <div className="absolute bottom-1 left-1 text-[#caa86b]/40"><Flower2 className="w-4 h-4" /></div>
        <div className="absolute bottom-1 right-1 text-[#caa86b]/40"><Flower2 className="w-4 h-4" /></div>
      </div>

      {/* HERO SECTION - JASMINE BLOSSOM ROMANCE */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          {/* Jasmine Blossom Top Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/90 border border-[#dfcb9f]/50 shadow-sm mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#caa86b]" />
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#73595f] font-semibold">
              MADURAI MALLI POO ROMANCE
            </span>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#9e7647] font-semibold mb-2">
            TOGETHER WITH THEIR FAMILIES
          </motion.p>

          {/* Dreamy Soft-Focus Oval Photo Frame with Jasmine Garland Framing */}
          <motion.div
            variants={fadeInUp}
            className="relative my-4 p-3 rounded-[160px] bg-gradient-to-b from-[#ffffff] via-[#fbf3f5] to-[#f4e4e7] shadow-[0_20px_50px_rgba(180,140,150,0.18)] border border-[#e8d2d6]"
          >
            <div className="relative overflow-hidden rounded-[150px] w-64 sm:w-72 md:w-80 h-80 sm:h-96 md:h-[420px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} and ${data.groom_name}`}
                className="w-full h-full object-cover object-top filter brightness-[1.03] contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4a393d]/30 via-transparent to-transparent opacity-40" />
            </div>

            {/* Jasmine Floral Emblem */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/95 border border-[#dfcb9f] shadow-md flex items-center gap-1.5">
              <Flower2 className="w-3.5 h-3.5 text-[#caa86b]" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#866344]">
                SACRED UNION
              </span>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-3xl md:text-4xl text-[#caa86b] mt-8 mb-1">
            Celebrate the wedding celebration of
          </motion.p>

          {/* Couple Names */}
          <motion.div variants={fadeInUp} className="my-2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-wide text-[#2e1d22]">
              {data.bride_name || "Ananya"}
            </h1>
            <div className="inline-flex items-center justify-center gap-4 my-2">
              <div className="h-[1px] w-12 bg-[#dfcb9f]" />
              <span className="font-great-vibes text-3xl md:text-4xl text-[#caa86b]">and</span>
              <div className="h-[1px] w-12 bg-[#dfcb9f]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-wide text-[#2e1d22]">
              {data.groom_name || "Aditya"}
            </h1>
          </motion.div>

          {/* Poetic Quote */}
          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl text-xs md:text-sm italic text-[#6d555a] leading-relaxed border-y border-[#dfcb9f]/40 py-3 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          {/* Countdown in Ivory & Champagne Styling */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>
        </motion.div>
      </section>

      {/* POETIC WEDDING TIMELINE */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-24 px-4 text-center z-10 border-t border-[#dfcb9f]/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#9e7647] uppercase font-bold block mb-1">
              THE CELEBRATION
            </span>
            <h2 className="text-2xl md:text-3xl tracking-[0.2em] text-[#2e1d22] uppercase font-bold">
              Wedding Itinerary
            </h2>
            <div className="h-[1.5px] w-24 bg-[#dfcb9f] mx-auto mt-2" />
          </motion.div>

          {/* Sangeet / Pre-Wedding (Optional) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-3xl bg-white/80 border border-[#e8d2d6] shadow-[0_10px_30px_rgba(200,160,170,0.1)] relative backdrop-blur-sm"
            >
              <span className="text-[10px] tracking-[0.25em] text-[#caa86b] uppercase font-bold block mb-1">
                MEHENDI & SANGEET
              </span>
              <h3 className="text-lg md:text-xl text-[#2e1d22] font-bold tracking-wide uppercase mb-2">
                An Evening of Jasmine & Music
              </h3>
              <p className="text-xs md:text-sm text-[#5a4449] flex items-center justify-center gap-2 mb-2 font-medium">
                <Calendar className="w-4 h-4 text-[#caa86b]" />
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="text-xs text-[#7d6167] whitespace-pre-line leading-relaxed mt-2 border-t border-[#f0e0e3] pt-2">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Main Kalyana Muhurtham Ceremony Card */}
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white to-[#fbf2f4] border-2 border-[#dfcb9f]/80 shadow-[0_15px_40px_rgba(180,130,140,0.15)] relative overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#caa86b] to-transparent absolute top-0 left-0" />

            <span className="text-[10px] tracking-[0.3em] text-[#caa86b] uppercase font-bold block mb-1">
              THE SACRED CEREMONY
            </span>
            <h3 className="text-xl md:text-2xl text-[#2e1d22] font-bold tracking-wider uppercase mb-3">
              Kalyana Muhurtham
            </h3>

            {data.scratch_enabled === "yes" ? (
              <div className="flex justify-center my-4">
                <ScratchReveal dateString={formatDate(data.wedding_date)} />
              </div>
            ) : (
              <p className="text-base md:text-lg text-[#3a2228] font-semibold flex items-center justify-center gap-2 my-3">
                <Clock className="w-4 h-4 text-[#caa86b]" />
                {formatDate(data.wedding_date)}
              </p>
            )}

            <div className="mt-4 border-t border-[#e8d2d6] pt-3">
              <span className="text-[10px] tracking-widest text-[#9e7647] uppercase font-bold block mb-1">
                SEASIDE VENUE
              </span>
              <p className="text-xs md:text-sm text-[#5a4449] whitespace-pre-line leading-relaxed font-medium">
                {data.wedding_venue}
              </p>
            </div>

            {/* Google Maps Location */}
            {data.gmap_coordinates && (
              <div className="w-full mt-4 h-44 rounded-2xl border border-[#dfcb9f]/60 overflow-hidden shadow-sm">
                {isPreview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdf5f6] text-center p-4">
                    <MapPin className="w-6 h-6 text-[#caa86b] animate-pulse mb-1" />
                    <span className="text-[11px] text-[#2e1d22] font-semibold">Venue Map Location</span>
                    <span className="text-[9px] text-[#7d6167] mt-0.5">Visible on published invitation</span>
                  </div>
                ) : (
                  <iframe
                    title="Jasmine Romance Venue Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                    className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity"
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
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-3xl bg-white/80 border border-[#e8d2d6] shadow-[0_10px_30px_rgba(200,160,170,0.1)] relative backdrop-blur-sm"
            >
              <span className="text-[10px] tracking-[0.25em] text-[#caa86b] uppercase font-bold block mb-1">
                TWILIGHT BANQUET
              </span>
              <h3 className="text-lg md:text-xl text-[#2e1d22] font-bold tracking-wide uppercase mb-2">
                Evening Reception
              </h3>
              <p className="text-xs md:text-sm text-[#5a4449] flex items-center justify-center gap-2 mb-2 font-medium">
                <Calendar className="w-4 h-4 text-[#caa86b]" />
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="text-xs text-[#7d6167] whitespace-pre-line leading-relaxed mt-2 border-t border-[#f0e0e3] pt-2">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Inviting Families */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-6">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#9e7647] font-bold block mb-1">
                INVITED WITH WARM WISHES BY
              </span>
              <p className="font-great-vibes text-3xl md:text-4xl text-[#2e1d22]">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* GALLERY & INTIMATE DETAILS */}
      <section className="relative min-h-[75dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10 border-t border-[#dfcb9f]/30">
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
              <span className="text-[10px] tracking-[0.25em] text-[#9e7647] uppercase font-bold mb-1">
                OUR JOURNEY
              </span>
              <h2 className="text-2xl md:text-3xl tracking-widest text-[#2e1d22] uppercase font-bold mb-6">
                Memories in Bloom
              </h2>
              <PhotoSlideshow imagesString={data.slideshow_images} />
            </motion.div>
          )}

          {/* Dress Code & Travel */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-6 rounded-3xl bg-white/90 border border-[#e8d2d6] flex flex-col items-center shadow-sm">
                  <Compass className="w-6 h-6 text-[#caa86b] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#2e1d22] font-bold mb-2">
                    Dress Palette
                  </h4>
                  <p className="text-xs text-[#6d555a] leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-6 rounded-3xl bg-white/90 border border-[#e8d2d6] flex flex-col items-center shadow-sm">
                  <Bus className="w-6 h-6 text-[#caa86b] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#2e1d22] font-bold mb-2">
                    Conveyance
                  </h4>
                  <p className="text-xs text-[#6d555a] leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Custom Message */}
          {data.custom_message && (
            <motion.p variants={fadeInUp} className="max-w-lg text-xs md:text-sm text-[#6d555a] italic leading-relaxed">
              &ldquo;{data.custom_message}&rdquo;
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="pt-6 border-t border-[#dfcb9f]/40 w-full max-w-xs">
              <span className="text-[10px] tracking-[0.25em] text-[#9e7647] uppercase font-bold block mb-1">
                KINDLY RSVP TO
              </span>
              <p className="text-sm text-[#2e1d22] font-bold tracking-wider">
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
            <section key={idx} className="relative py-16 px-4 text-center z-10 border-t border-[#dfcb9f]/30">
              <div className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-white/90 border border-[#e8d2d6] shadow-sm">
                <h3 className="text-lg text-[#2e1d22] uppercase tracking-widest font-bold mb-4">{sec.title}</h3>
                <p className="text-xs md:text-sm text-[#6d555a] leading-relaxed whitespace-pre-line text-left">{sec.content}</p>
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
