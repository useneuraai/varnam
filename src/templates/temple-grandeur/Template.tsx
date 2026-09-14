"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import TempleReveal from "@/components/animations/TempleReveal";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus, MapPin, Calendar, Clock, Flame, Shield, Sparkles } from "lucide-react";
import { CountdownTimer } from "@/components/animations/CinematicEffects";

export default function TempleGrandeurTemplate({
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
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.2, 0.9, 0.3, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.18 } },
  };

  const heroImage = data.bg_image_url || "/images/couples/temple-grandeur.jpg";

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #38080c 0%, #170507 50%, #080203 100%)",
      }}
      className="relative min-h-screen text-[#fbf5e6] overflow-x-hidden font-serif selection:bg-[#991b1b] selection:text-[#ffd978] select-none"
    >
      {/* Ancient Granite Stone Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `radial-gradient(#b88a38 0.75px, transparent 0.75px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Floating Sacred Golden Sparkles / Deepam Embers */}
      <FloatingFlowers type="sparkle" count={30} />

      {/* Heavy Dravidian Stone & Aged Bronze Double Frame */}
      <div className="fixed inset-3 md:inset-6 border-2 border-[#b88a38]/40 pointer-events-none z-30">
        <div className="absolute inset-1.5 border border-[#991b1b]/30 pointer-events-none" />
        {/* Sacred Bronze Temple Bell Corner Emblems */}
        <div className="absolute top-1 left-1 text-[#b88a38] text-sm">🛕</div>
        <div className="absolute top-1 right-1 text-[#b88a38] text-sm">🛕</div>
        <div className="absolute bottom-1 left-1 text-[#b88a38] text-sm">🛕</div>
        <div className="absolute bottom-1 right-1 text-[#b88a38] text-sm">🛕</div>
      </div>

      {/* HERO SECTION - MAJESTIC TEMPLE MANDAPAM */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          {/* Sacred Gopuram Invocation */}
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="text-2xl md:text-3xl tracking-[0.3em] text-[#e8c067] font-bold drop-shadow-[0_2px_15px_rgba(184,138,56,0.6)]">
              ஓம் நமச்சிவாய
            </span>
            <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-[#b88a38] to-transparent mx-auto mt-2" />
          </motion.div>

          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#2a060a]/90 border border-[#b88a38]/50 mb-6 shadow-2xl">
            <Flame className="w-3.5 h-3.5 text-[#e8c067] animate-pulse" />
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c067] font-bold">
              MAJESTIC DRAVIDIAN TEMPLE WEDDING
            </span>
          </motion.div>

          {/* Symmetrical Stone Temple Pillar Frame with Couple Portrait */}
          <motion.div
            variants={fadeInUp}
            className="relative my-4 p-3 rounded-t-[180px] rounded-b-2xl bg-gradient-to-b from-[#b88a38] via-[#5c3e10] to-[#24060b] shadow-[0_25px_70px_rgba(0,0,0,0.9)] border-2 border-[#e8c067]/60"
          >
            {/* Left and Right Pillar Relief Lines */}
            <div className="absolute top-1/4 -left-3 w-2 h-32 bg-[#b88a38] rounded-full hidden sm:block opacity-60" />
            <div className="absolute top-1/4 -right-3 w-2 h-32 bg-[#b88a38] rounded-full hidden sm:block opacity-60" />

            <div className="relative overflow-hidden rounded-t-[170px] rounded-b-xl w-64 sm:w-72 md:w-84 h-84 sm:h-96 md:h-[440px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} and ${data.groom_name}`}
                className="w-full h-full object-cover object-top filter brightness-[1.04] contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0204] via-transparent to-transparent opacity-60" />
            </div>

            {/* Bronze Kalasam / Temple Top Element */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#180306] border-2 border-[#e8c067] flex items-center justify-center shadow-xl">
              <span className="text-[#e8c067] text-lg font-bold">🪷</span>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-3xl md:text-4xl text-[#e8c067] mt-8 mb-2 drop-shadow">
            Blessed by the divine sacred fire, we solemnize the wedding of
          </motion.p>

          {/* Symmetrical Grand Names */}
          <motion.div variants={fadeInUp} className="my-2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ffeaa7] via-[#e8c067] to-[#d49f37] drop-shadow-[0_4px_25px_rgba(184,138,56,0.4)]">
              {data.bride_name || "Samyuktha"}
            </h1>
            <div className="inline-flex items-center justify-center gap-4 my-2">
              <div className="h-[1px] w-16 bg-[#b88a38]/60" />
              <span className="font-great-vibes text-3xl md:text-4xl text-[#e8c067]">weds</span>
              <div className="h-[1px] w-16 bg-[#b88a38]/60" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ffeaa7] via-[#e8c067] to-[#d49f37] drop-shadow-[0_4px_25px_rgba(184,138,56,0.4)]">
              {data.groom_name || "Vijay Karthik"}
            </h1>
          </motion.div>

          {/* Sacred Temple Mantra / Quote */}
          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl text-xs md:text-sm italic text-[#ebd9b2] leading-relaxed border-y border-[#b88a38]/40 py-3 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          {/* Temple Stone Reveal Feature */}
          <motion.div variants={fadeInUp} className="w-full my-6 opacity-90 scale-95">
            <TempleReveal />
          </motion.div>

          {/* Countdown in Antique Bronze Styling */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>
        </motion.div>
      </section>

      {/* SACRED TEMPLE TIMELINE & AUSPICIOUS HOURS */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-24 px-4 text-center z-10 border-t border-[#b88a38]/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="w-14 h-14 rounded-full border border-[#e8c067]/60 flex items-center justify-center mb-3 mx-auto bg-[#2b070c]">
              <span className="text-xl text-[#e8c067]">தர்ம</span>
            </div>
            <h2 className="text-2xl md:text-3xl tracking-[0.25em] text-[#e8c067] uppercase font-bold drop-shadow">
              Auspicious Muhurtham Timings
            </h2>
            <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-[#b88a38] to-transparent mx-auto mt-2" />
          </motion.div>

          {/* Sangeet Ceremony (Optional) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-2xl bg-[#1c0408]/90 border border-[#b88a38]/40 shadow-2xl relative overflow-hidden"
            >
              <span className="text-[10px] tracking-[0.25em] text-[#e8c067] uppercase font-bold block mb-1">
                PRE-CEREMONY CELEBRATION
              </span>
              <h3 className="text-lg md:text-xl text-[#fbf5e6] tracking-wider font-bold uppercase mb-2">
                Sangeet & Mehendi
              </h3>
              <p className="text-sm text-[#ebd9b2] tracking-wide mb-2 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-[#e8c067]" />
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="text-xs text-[#d1b88e] whitespace-pre-line leading-relaxed mt-2 border-t border-[#b88a38]/20 pt-2">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Sacred Kalyana Muhurtham in Stone Plaque Card */}
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#2e060d] to-[#140306] border-2 border-[#e8c067]/70 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#e8c067] to-transparent" />
            <span className="text-[10px] tracking-[0.3em] text-[#e8c067] uppercase font-bold block mb-1">
              THE SACRED AUSPICIOUS MOMENT
            </span>
            <h3 className="text-xl md:text-2xl text-[#ffeaa7] tracking-widest font-bold uppercase mb-3">
              Maha Kalyana Muhurtham
            </h3>

            {data.scratch_enabled === "yes" ? (
              <div className="flex justify-center my-4">
                <ScratchReveal dateString={formatDate(data.wedding_date)} />
              </div>
            ) : (
              <p className="text-base md:text-lg text-[#fbf5e6] tracking-wide my-3 font-semibold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#e8c067]" />
                {formatDate(data.wedding_date)}
              </p>
            )}

            <div className="mt-4 border-t border-[#b88a38]/30 pt-4">
              <span className="text-[10px] tracking-widest text-[#e8c067] uppercase block mb-1 font-bold">
                SACRED TEMPLE MANDAPAM
              </span>
              <p className="text-xs md:text-sm text-[#ebd9b2] whitespace-pre-line leading-relaxed font-medium">
                {data.wedding_venue}
              </p>
            </div>

            {/* Google Maps Location */}
            {data.gmap_coordinates && (
              <div className="w-full mt-5 h-44 rounded-xl border border-[#b88a38]/40 overflow-hidden shadow-inner">
                {isPreview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0204] text-center p-4">
                    <MapPin className="w-6 h-6 text-[#e8c067] animate-pulse mb-1" />
                    <span className="text-[11px] text-[#e8c067]">Temple Venue Coordinates</span>
                    <span className="text-[9px] text-[#b39569] mt-0.5">Interactive map active on published invite</span>
                  </div>
                ) : (
                  <iframe
                    title="Temple Grandeur Venue Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                    className="w-full h-full border-0 grayscale opacity-80 hover:opacity-100 transition-opacity"
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
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-2xl bg-[#1c0408]/90 border border-[#b88a38]/40 shadow-2xl relative overflow-hidden"
            >
              <span className="text-[10px] tracking-[0.25em] text-[#e8c067] uppercase font-bold block mb-1">
                CEREMONIAL RECEPTION
              </span>
              <h3 className="text-lg md:text-xl text-[#fbf5e6] tracking-wider font-bold uppercase mb-2">
                Grand Evening Gala
              </h3>
              <p className="text-sm text-[#ebd9b2] tracking-wide mb-2 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-[#e8c067]" />
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="text-xs text-[#d1b88e] whitespace-pre-line leading-relaxed mt-2 border-t border-[#b88a38]/20 pt-2">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Welcoming Dynasties */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-6">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#e8c067] font-bold block mb-1">
                SEEKING YOUR SACRED BLESSINGS
              </span>
              <p className="font-great-vibes text-3xl md:text-4xl text-[#ffeaa7]">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* PHOTO GALLERY & CEREMONIAL DETAILS */}
      <section className="relative min-h-[75dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10 border-t border-[#b88a38]/30">
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
              <span className="text-[10px] tracking-[0.25em] text-[#e8c067] uppercase font-bold mb-1">
                SACRED MEMORIES
              </span>
              <h2 className="text-2xl md:text-3xl tracking-widest text-[#ffeaa7] uppercase font-bold mb-6">
                Temple Gallery
              </h2>
              <PhotoSlideshow imagesString={data.slideshow_images} />
            </motion.div>
          )}

          {/* Attire & Conveyance */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#1c0408]/90 border border-[#b88a38]/40 flex flex-col items-center">
                  <Compass className="w-6 h-6 text-[#e8c067] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#e8c067] font-bold mb-2">
                    Temple Dress Code
                  </h4>
                  <p className="text-xs text-[#ebd9b2] leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#1c0408]/90 border border-[#b88a38]/40 flex flex-col items-center">
                  <Bus className="w-6 h-6 text-[#e8c067] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#e8c067] font-bold mb-2">
                    Temple Parking & Access
                  </h4>
                  <p className="text-xs text-[#ebd9b2] leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Custom Greeting */}
          {data.custom_message && (
            <motion.p variants={fadeInUp} className="max-w-lg text-xs md:text-sm text-[#ebd9b2] italic leading-relaxed">
              &ldquo;{data.custom_message}&rdquo;
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="pt-6 border-t border-[#b88a38]/30 w-full max-w-xs">
              <span className="text-[10px] tracking-[0.25em] text-[#e8c067] uppercase font-bold block mb-1">
                CEREMONIAL RSVP
              </span>
              <p className="text-sm text-[#ffeaa7] font-bold tracking-wider">
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
            <section key={idx} className="relative py-16 px-4 text-center z-10 border-t border-[#b88a38]/30">
              <div className="max-w-xl mx-auto p-6 md:p-8 rounded-2xl bg-[#1c0408]/90 border border-[#b88a38]/40">
                <h3 className="text-lg text-[#ffeaa7] uppercase tracking-widest font-bold mb-4">{sec.title}</h3>
                <p className="text-xs md:text-sm text-[#ebd9b2] leading-relaxed whitespace-pre-line text-left">{sec.content}</p>
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
