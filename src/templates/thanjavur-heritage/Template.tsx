"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import TempleReveal from "@/components/animations/TempleReveal";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus, MapPin, Sparkles, Heart, Crown, Calendar, Clock } from "lucide-react";
import { CinematicCrest, ScrollDrawTimeline, RevealGlowText, CountdownTimer } from "@/components/animations/CinematicEffects";

export default function ThanjavurHeritageTemplate({
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
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.18 } },
  };

  const initials = `${data.bride_name?.charAt(0) || "A"}&${data.groom_name?.charAt(0) || "S"}`;
  const heroImage = data.bg_image_url || "/images/couples/thanjavur-heritage.jpg";

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #4a0916 0%, #25040a 55%, #120205 100%)",
      }}
      className="relative min-h-screen text-[#fbf5e6] overflow-x-hidden font-serif selection:bg-[#c59b27] selection:text-black select-none"
    >
      {/* Handcrafted Antique Paper & Gold Foil Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0"
        style={{
          backgroundImage: `radial-gradient(#c59b27 0.75px, transparent 0.75px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating Golden Sparks / Embers */}
      <FloatingFlowers type="sparkle" count={28} />

      {/* Ornate Thanjavur Gold-Foil Border Frame */}
      <div className="fixed inset-2 md:inset-4 border-2 border-[#c59b27]/30 pointer-events-none z-30">
        <div className="absolute inset-1 border border-[#c59b27]/15 pointer-events-none" />
        {/* Gem-Studded Corner Accents */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-[#9b111e] border border-[#f3d375] rounded-full shadow-[0_0_8px_#c59b27]" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#9b111e] border border-[#f3d375] rounded-full shadow-[0_0_8px_#c59b27]" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-[#046307] border border-[#f3d375] rounded-full shadow-[0_0_8px_#c59b27]" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-[#046307] border border-[#f3d375] rounded-full shadow-[0_0_8px_#c59b27]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          {/* Sacred Invocation */}
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="text-xl md:text-2xl tracking-[0.25em] text-[#e8c86d] font-bold drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
              ஸ்ரீ கணேஷாய நமஹ
            </span>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent mx-auto mt-2" />
          </motion.div>

          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#3d0711]/80 border border-[#c59b27]/40 mb-6">
            <Crown className="w-3.5 h-3.5 text-[#e8c86d]" />
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#e8c86d] font-semibold">
              ROYAL THANJAVUR WEDDING ANNOUNCEMENT
            </span>
          </motion.div>

          {/* Majestic Thanjavur Arched Frame with Couple Portrait */}
          <motion.div
            variants={fadeInUp}
            className="relative my-4 p-2.5 rounded-t-[140px] rounded-b-2xl bg-gradient-to-b from-[#c59b27] via-[#8c6717] to-[#450914] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#e8c86d]/40"
          >
            <div className="relative overflow-hidden rounded-t-[132px] rounded-b-xl w-64 sm:w-72 md:w-80 h-80 sm:h-96 md:h-[420px]">
              <img
                src={heroImage}
                alt={`${data.bride_name} and ${data.groom_name}`}
                className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25040a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Temple Arch Crown Element */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#25040a] border-2 border-[#e8c86d] flex items-center justify-center shadow-lg">
              <span className="text-[#e8c86d] text-lg font-bold">ॐ</span>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-3xl md:text-4xl text-[#e8c86d] mt-6 mb-2">
            With the divine blessings of our ancestors, we invite you to celebrate
          </motion.p>

          {/* Couple Names in Golden Glow */}
          <motion.div variants={fadeInUp} className="my-2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#e5b842] to-[#ffcf66] drop-shadow-[0_4px_20px_rgba(212,175,55,0.35)]">
              {data.bride_name || "Arundhati Devi"}
            </h1>
            <div className="inline-flex items-center justify-center gap-4 my-2">
              <div className="h-[1px] w-12 bg-[#c59b27]/40" />
              <span className="font-great-vibes text-3xl md:text-4xl text-[#e8c86d]">weds</span>
              <div className="h-[1px] w-12 bg-[#c59b27]/40" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#e5b842] to-[#ffcf66] drop-shadow-[0_4px_20px_rgba(212,175,55,0.35)]">
              {data.groom_name || "Sundaram Varma"}
            </h1>
          </motion.div>

          {/* Royal Blessing Quote */}
          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl italic text-xs md:text-sm text-[#ecdab4] leading-relaxed border-y border-[#c59b27]/30 py-3 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          {/* Sacred Countdown Timer */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>
        </motion.div>
      </section>

      {/* CEREMONIAL EVENTS & TIMELINE */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center py-24 px-4 text-center z-10 border-t border-[#c59b27]/20">
        <ScrollDrawTimeline />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-3xl mx-auto flex flex-col items-center w-full"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="w-14 h-14 rounded-full border border-[#c59b27]/50 flex items-center justify-center mb-3 mx-auto bg-[#360710]">
              <span className="text-xl text-[#e8c86d]">சுப</span>
            </div>
            <h2 className="text-2xl md:text-3xl tracking-[0.25em] text-[#e8c86d] uppercase font-bold drop-shadow">
              Ceremonial Timeline
            </h2>
            <div className="h-[1.5px] w-36 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent mx-auto mt-2" />
          </motion.div>

          {/* Sangeet / Mehendi (Optional) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div
              variants={fadeInUp}
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-2xl bg-[#26040b]/90 border border-[#c59b27]/40 shadow-2xl relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
              <span className="text-[10px] tracking-[0.25em] text-[#e8c86d] uppercase font-bold block mb-1">
                PRE-WEDDING CELEBRATION
              </span>
              <h3 className="text-lg md:text-xl text-[#fbf5e6] tracking-wider font-bold uppercase mb-2">
                Sangeet & Mehendi
              </h3>
              <p className="text-sm text-[#ecdab4] tracking-wide mb-2 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-[#e8c86d]" />
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="text-xs text-[#d1b88e] whitespace-pre-line leading-relaxed mt-2 border-t border-[#c59b27]/20 pt-2">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Main Muhurtham Ceremony Card */}
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#3a0712]/95 to-[#22040a]/95 border-2 border-[#e8c86d]/60 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e8c86d] to-transparent" />
            <span className="text-[10px] tracking-[0.3em] text-[#e8c86d] uppercase font-bold block mb-1">
              THE SACRED AUSPICIOUS CEREMONY
            </span>
            <h3 className="text-xl md:text-2xl text-[#ffe5a3] tracking-widest font-bold uppercase mb-3">
              Kalyana Muhurtham
            </h3>

            {data.scratch_enabled === "yes" ? (
              <div className="flex justify-center my-4">
                <ScratchReveal dateString={formatDate(data.wedding_date)} />
              </div>
            ) : (
              <p className="text-base md:text-lg text-[#fbf5e6] tracking-wide my-3 font-semibold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#e8c86d]" />
                {formatDate(data.wedding_date)}
              </p>
            )}

            <div className="mt-4 border-t border-[#c59b27]/30 pt-4">
              <span className="text-[10px] tracking-widest text-[#e8c86d] uppercase block mb-1 font-bold">
                MANDAPAM VENUE
              </span>
              <p className="text-xs md:text-sm text-[#ecdab4] whitespace-pre-line leading-relaxed font-medium">
                {data.wedding_venue}
              </p>
            </div>

            {/* Google Maps Embed */}
            {data.gmap_coordinates && (
              <div className="w-full mt-5 h-44 rounded-xl border border-[#c59b27]/30 overflow-hidden shadow-inner">
                {isPreview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#170206] text-center p-4">
                    <MapPin className="w-6 h-6 text-[#e8c86d] animate-pulse mb-1" />
                    <span className="text-[11px] text-[#e8c86d]">Mandapam Map Coordinates</span>
                    <span className="text-[9px] text-[#a8906c] mt-0.5">Live map active on published invitation</span>
                  </div>
                ) : (
                  <iframe
                    title="Muhurtham Mandapam Location"
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
              className="w-full max-w-xl mb-8 p-6 md:p-8 rounded-2xl bg-[#26040b]/90 border border-[#c59b27]/40 shadow-2xl relative overflow-hidden backdrop-blur-sm"
            >
              <span className="text-[10px] tracking-[0.25em] text-[#e8c86d] uppercase font-bold block mb-1">
                ROYAL BANQUET
              </span>
              <h3 className="text-lg md:text-xl text-[#fbf5e6] tracking-wider font-bold uppercase mb-2">
                Reception Gala
              </h3>
              <p className="text-sm text-[#ecdab4] tracking-wide mb-2 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-[#e8c86d]" />
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="text-xs text-[#d1b88e] whitespace-pre-line leading-relaxed mt-2 border-t border-[#c59b27]/20 pt-2">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Inviting Family Names */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-6">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#e8c86d] font-bold block mb-1">
                WELCOMED WITH WARM REGARDS BY
              </span>
              <p className="font-great-vibes text-3xl md:text-4xl text-[#ffe49e]">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* GALLERY & CEREMONIAL DETAILS */}
      <section className="relative min-h-[80dvh] flex flex-col items-center justify-center py-20 px-4 text-center z-10 border-t border-[#c59b27]/20">
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
              <span className="text-[10px] tracking-[0.25em] text-[#e8c86d] uppercase font-bold mb-1">
                ROYAL MOMENTS
              </span>
              <h2 className="text-2xl md:text-3xl tracking-widest text-[#ffe5a3] uppercase font-bold mb-6">
                Photo Gallery
              </h2>
              <PhotoSlideshow imagesString={data.slideshow_images} />
            </motion.div>
          )}

          {/* Dress Code & Travel Guidelines */}
          {((data.dress_code && data.dress_code_enabled !== "no") ||
            (data.transport_info && data.transport_enabled !== "no")) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
              {data.dress_code && data.dress_code_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#26040b]/90 border border-[#c59b27]/30 flex flex-col items-center">
                  <Compass className="w-6 h-6 text-[#e8c86d] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#e8c86d] font-bold mb-2">
                    Attire Etiquette
                  </h4>
                  <p className="text-xs text-[#ecdab4] leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && data.transport_enabled !== "no" && (
                <div className="p-6 rounded-2xl bg-[#26040b]/90 border border-[#c59b27]/30 flex flex-col items-center">
                  <Bus className="w-6 h-6 text-[#e8c86d] mb-2" />
                  <h4 className="text-xs uppercase tracking-widest text-[#e8c86d] font-bold mb-2">
                    Valet & Conveyance
                  </h4>
                  <p className="text-xs text-[#ecdab4] leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Custom Greeting Message */}
          {data.custom_message && (
            <motion.p variants={fadeInUp} className="max-w-lg text-xs md:text-sm text-[#ecdab4] italic leading-relaxed">
              &ldquo;{data.custom_message}&rdquo;
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="pt-6 border-t border-[#c59b27]/30 w-full max-w-xs">
              <span className="text-[10px] tracking-[0.25em] text-[#e8c86d] uppercase font-bold block mb-1">
                CEREMONY RSVP
              </span>
              <p className="text-sm text-[#ffe5a3] font-bold tracking-wider">
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
            <section key={idx} className="relative py-16 px-4 text-center z-10 border-t border-[#c59b27]/20">
              <div className="max-w-xl mx-auto p-6 md:p-8 rounded-2xl bg-[#26040b]/90 border border-[#c59b27]/30">
                <h3 className="text-lg text-[#ffe5a3] uppercase tracking-widest font-bold mb-4">{sec.title}</h3>
                <p className="text-xs md:text-sm text-[#ecdab4] leading-relaxed whitespace-pre-line text-left">{sec.content}</p>
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
