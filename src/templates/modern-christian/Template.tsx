"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus } from "lucide-react";
import { CinematicCrest, GoldFoilLeaves, ScrollDrawTimeline, RevealGlowText, CountdownTimer } from "@/components/animations/CinematicEffects";

export default function ModernChristianTemplate({ data }: { data: TemplateData }) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const initials = `${data.bride_name?.charAt(0) || "M"}${data.groom_name?.charAt(0) || "D"}`;

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #4f2130 0%, #210d14 50%, #0a0305 100%)"
      }}
      className="relative min-h-screen text-[#fbf6df] overflow-x-hidden font-sans border-4 border-rose-900/20 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image (Fixed to bypass mobile browser fixed-attachment bugs) */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-20 mix-blend-overlay"
      />

      {/* Dark overlay for custom background image readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#0a0305]/50 to-[#0a0305] z-0 pointer-events-none" />

      {/* Falling Rose Petals */}
      <FloatingFlowers type="rose" count={15} />

      {/* Rising Golden Sparkles */}
      <FloatingFlowers type="sparkle" count={25} />

      {/* 3D Parallax Corner Foil Leaves */}
      <GoldFoilLeaves />

      {/* Modern thin borders */}
      <div className="absolute inset-6 border border-rose-300/10 pointer-events-none rounded-sm z-10" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center z-10 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full flex flex-col items-center"
        >
          {/* Holy Cross symbol representation */}
          <motion.div variants={fadeInUp} className="mb-6 flex flex-col items-center">
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 text-rose-300/60 drop-shadow-[0_0_8px_rgba(212,163,37,0.2)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="50" y1="20" x2="50" y2="80" />
              <line x1="30" y1="40" x2="70" y2="40" />
            </svg>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-rose-300/40 to-transparent mt-2" />
          </motion.div>

          <motion.p variants={fadeInUp} className="font-serif text-xs md:text-sm tracking-[0.3em] uppercase text-rose-200/70 mb-4 luxury-text-shadow">
            CELEBRATING COVENANT MATRIMONY
          </motion.p>

          {/* Interactive Cinematic Crest */}
          <motion.div variants={fadeInUp} className="flex justify-center w-full my-2">
            <CinematicCrest symbol="✝" initials={initials} />
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-4xl md:text-5xl text-rose-200 mb-2 luxury-text-shadow">
            You are Cordially Invited to Witness the Wedding of
          </motion.p>

          {/* Cinematic Glow Letter Reveal */}
          <motion.div variants={fadeInUp} className="my-6">
            <RevealGlowText text={`${data.bride_name || "Michelle"} & ${data.groom_name || "David"}`} className="text-xl sm:text-3xl md:text-5xl font-bold break-words w-full px-4 text-center" />
          </motion.div>

          {/* Luxury Countdown Timer */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>

          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl font-serif italic text-sm md:text-base text-rose-100/80 leading-relaxed border-t border-b border-rose-300/10 py-4 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Details Timeline Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center z-10 relative border-t border-rose-300/10">
        <ScrollDrawTimeline />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="w-full flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-rose-200 uppercase luxury-text-shadow">The Timeline</h2>
            <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-rose-300/30 to-transparent mx-auto mt-2" />
          </motion.div>

          {/* SANGEET EVENT (IF PROVIDED) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div variants={fadeInUp} className="glass-card rounded-md p-6 max-w-lg w-full mb-6 border border-rose-300/30 shadow-2xl relative overflow-hidden group bg-black/40">
              <div className="absolute inset-0 border border-rose-300/10 pointer-events-none m-1 rounded-md" />
              <span className="font-serif text-[10px] tracking-widest text-rose-300 uppercase font-bold mb-1 block">REHEARSAL & BRIDAL SHOWER</span>
              <p className="font-serif text-sm text-foreground tracking-wide mb-2">
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="font-serif text-xs text-rose-100/85 whitespace-pre-line leading-relaxed">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* MAIN SOLEMNIZATION EVENT */}
          <motion.div variants={fadeInUp} className="glass-card rounded-md p-6 max-w-lg w-full mb-6 border border-rose-300/30 shadow-2xl relative overflow-hidden group bg-black/50">
            <div className="absolute inset-0 border border-rose-300/10 pointer-events-none m-1 rounded-md" />
            <span className="font-serif text-[10px] tracking-widest text-rose-300 uppercase font-bold mb-1 block">HOLY MATRIMONY</span>
            
            {/* Scratch to reveal check */}
            {data.scratch_enabled === "yes" ? (
              <div className="flex justify-center my-4">
                <ScratchReveal dateString={formatDate(data.wedding_date)} />
              </div>
            ) : (
              <p className="font-serif text-sm md:text-base text-foreground tracking-wide">
                {formatDate(data.wedding_date)}
              </p>
            )}

            <p className="font-serif text-xs text-rose-100/95 whitespace-pre-line leading-relaxed mt-3 border-t border-rose-300/10 pt-3">
              {data.wedding_venue}
            </p>

            {data.gmap_coordinates && (
              <div className="w-full mt-4 h-48 border border-rose-300/15 overflow-hidden shadow-inner">
                <iframe
                  title="GMap Venue Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale opacity-75 hover:opacity-100 transition-opacity duration-500"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </motion.div>

          {/* RECEPTION EVENT (IF PROVIDED) */}
          {data.reception_date && (
            <motion.div variants={fadeInUp} className="glass-card rounded-md p-6 max-w-lg w-full mb-8 border border-rose-300/30 shadow-2xl relative overflow-hidden group bg-black/40">
              <div className="absolute inset-0 border border-rose-300/10 pointer-events-none m-1 rounded-md" />
              <span className="font-serif text-[10px] tracking-widest text-rose-300 uppercase font-bold mb-1 block">RECEPTION DINNER</span>
              <p className="font-serif text-sm text-foreground tracking-wide mb-2">
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="font-serif text-xs text-rose-100/85 whitespace-pre-line leading-relaxed">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Family Welcoming */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-4">
              <p className="font-serif text-xs md:text-sm tracking-[0.2em] uppercase text-rose-300/70 mb-2">
                SHARING THE JOY OF THE FAMILIES
              </p>
              <p className="font-great-vibes text-3xl text-rose-100">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Slideshow & Dress Code Sections (licensed features) */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center z-10 relative border-t border-rose-300/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="w-full flex flex-col items-center gap-12"
        >
          {/* Photo Slideshow */}
          <motion.div variants={fadeInUp} className="w-full flex flex-col items-center">
            <span className="font-serif text-xs tracking-[0.2em] text-rose-300 uppercase mb-2">MEMORIES CAROUSEL</span>
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-rose-300 uppercase mb-6">Gallery Slideshow</h2>
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </motion.div>

          {/* Dress Code & Travel guidelines */}
          {(data.dress_code || data.transport_info) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-4">
              {data.dress_code && (
                <div className="glass-card p-6 border border-rose-300/10 flex flex-col items-center text-center bg-black/35">
                  <Compass className="w-8 h-8 text-rose-300 mb-3 stroke-[1.25]" />
                  <h4 className="font-cinzel text-sm text-rose-300 tracking-wider uppercase mb-2">Attire Code</h4>
                  <p className="font-serif text-xs text-rose-200/70 leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && (
                <div className="glass-card p-6 border border-rose-300/10 flex flex-col items-center text-center bg-black/35">
                  <Bus className="w-8 h-8 text-rose-300 mb-3 stroke-[1.25]" />
                  <h4 className="font-cinzel text-sm text-rose-300 tracking-wider uppercase mb-2">Travel & Parking</h4>
                  <p className="font-serif text-xs text-rose-200/70 leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {data.custom_message && (
            <motion.p variants={fadeInUp} className="mt-4 max-w-lg font-serif text-sm text-rose-200/70 leading-relaxed italic">
              {data.custom_message}
            </motion.p>
          )}

          {/* RSVP Detail */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="mt-8 pt-6 border-t border-rose-300/10 w-full max-w-xs">
              <span className="font-serif text-xs tracking-widest text-rose-300/80 uppercase">RSVP Contacts</span>
              <p className="font-serif text-sm text-rose-100 tracking-wide mt-1">
                Ph: {data.rsvp_phone}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
