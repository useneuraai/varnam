"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus } from "lucide-react";
import { CinematicCrest, GoldFoilLeaves, ScrollDrawTimeline, RevealGlowText, CountdownTimer } from "@/components/animations/CinematicEffects";

export default function ElegantMuslimTemplate({ data }: { data: TemplateData }) {
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const initials = `${data.bride_name?.charAt(0) || "Z"}${data.groom_name?.charAt(0) || "F"}`;

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #0d462c 0%, #072517 50%, #020b07 100%)"
      }}
      className="relative min-h-screen text-[#f5e9b3] overflow-x-hidden font-sans border-4 border-[#b3811b]/30 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image (Fixed to bypass mobile browser fixed-attachment bugs) */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-20 mix-blend-overlay"
      />

      {/* Dark overlay for custom background image readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#020b07]/50 to-[#020b07] z-0 pointer-events-none" />

      {/* Falling Gold Dust */}
      <FloatingFlowers type="gold" count={15} />

      {/* Rising Golden Sparkles */}
      <FloatingFlowers type="sparkle" count={25} />

      {/* 3D Parallax Corner Foil Leaves */}
      <GoldFoilLeaves />

      {/* Islamic Arch Border Elements */}
      <div className="absolute inset-4 border border-[#eed57c]/20 pointer-events-none rounded-lg z-10" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center z-10 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full flex flex-col items-center"
        >
          {/* Islamic Calligraphy Text Representation */}
          <motion.div variants={fadeInUp} className="mb-6">
            <h2 className="font-serif text-3xl tracking-[0.2em] text-[#eed57c] luxury-text-shadow">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
            <p className="font-serif text-[10px] tracking-[0.3em] uppercase text-[#eed57c]/60 mt-1">
              In the Name of Allah, the Most Beneficent, the Most Merciful
            </p>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#b3811b] to-transparent mx-auto mt-3" />
          </motion.div>

          <motion.p variants={fadeInUp} className="font-serif text-xs md:text-sm tracking-[0.3em] uppercase text-[#eed57c]/70 mb-4 luxury-text-shadow">
            HEAVENLY NIKAAH CEREMONY INVITATION
          </motion.p>

          {/* Interactive Cinematic Crest */}
          <motion.div variants={fadeInUp} className="flex justify-center w-full my-2">
            <CinematicCrest symbol="﷽" initials={initials} />
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-4xl md:text-5xl text-[#fbf6df] mb-2 luxury-text-shadow">
            The Honor of Your Presence is Requested for the Marriage of
          </motion.p>

          {/* Cinematic Glow Letter Reveal */}
          <motion.div variants={fadeInUp} className="my-6">
            <RevealGlowText text={`${data.bride_name || "Zara"} weds ${data.groom_name || "Faisal"}`} className="text-xl sm:text-3xl md:text-5xl font-bold break-words w-full px-4 text-center" />
          </motion.div>

          {/* Luxury Countdown Timer */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>

          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl font-serif italic text-sm md:text-base text-[#fbf6df]/90 leading-relaxed border-t border-b border-[#b3811b]/30 py-4 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Details Timeline Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center z-10 relative border-t border-[#b3811b]/20">
        <ScrollDrawTimeline />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="w-full flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-[#eed57c] uppercase luxury-text-shadow">Ceremony Timeline</h2>
            <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-[#eed57c] to-transparent mx-auto mt-2" />
          </motion.div>

          {/* SANGEET EVENT (IF PROVIDED) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div variants={fadeInUp} className="glass-card rounded-lg p-6 max-w-lg w-full mb-6 border border-[#eed57c]/30 shadow-2xl relative overflow-hidden group bg-black/40">
              <div className="absolute inset-0 border border-[#eed57c]/10 pointer-events-none m-1 rounded-md" />
              <span className="font-serif text-[10px] tracking-widest text-[#eed57c] uppercase font-bold mb-1 block">MEHENDI & SANGEET</span>
              <p className="font-serif text-sm text-foreground tracking-wide mb-2">
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="font-serif text-xs text-[#fbf6df]/85 whitespace-pre-line leading-relaxed">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* MAIN NIKAAH EVENT */}
          <motion.div variants={fadeInUp} className="glass-card rounded-lg p-6 max-w-lg w-full mb-6 border border-[#eed57c]/30 shadow-2xl relative overflow-hidden group bg-black/50">
            <div className="absolute inset-0 border border-[#eed57c]/10 pointer-events-none m-1 rounded-md" />
            <span className="font-serif text-[10px] tracking-widest text-[#eed57c] uppercase font-bold mb-1 block">THE SACRED NIKAAH</span>
            
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

            <p className="font-serif text-xs text-[#fbf6df]/90 whitespace-pre-line leading-relaxed mt-3 border-t border-[#eed57c]/10 pt-3">
              {data.wedding_venue}
            </p>

            {data.gmap_coordinates && (
              <div className="w-full mt-4 h-48 border border-[#eed57c]/25 overflow-hidden shadow-inner">
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
            <motion.div variants={fadeInUp} className="glass-card rounded-lg p-6 max-w-lg w-full mb-8 border border-[#eed57c]/30 shadow-2xl relative overflow-hidden group bg-black/40">
              <div className="absolute inset-0 border border-[#eed57c]/10 pointer-events-none m-1 rounded-md" />
              <span className="font-serif text-[10px] tracking-widest text-[#eed57c] uppercase font-bold mb-1 block">VALIMA / RECEPTION</span>
              <p className="font-serif text-sm text-foreground tracking-wide mb-2">
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="font-serif text-xs text-[#fbf6df]/85 whitespace-pre-line leading-relaxed">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Family Welcoming */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-4">
              <p className="font-serif text-xs md:text-sm tracking-[0.2em] uppercase text-[#eed57c]/70 mb-2">
                BEST COMPLIMENTS FROM
              </p>
              <p className="font-great-vibes text-3xl text-[#eed57c]">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Slideshow & Dress Code Sections (licensed features) */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center z-10 relative border-t border-[#b3811b]/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="w-full flex flex-col items-center gap-12"
        >
          {/* Photo Slideshow */}
          <motion.div variants={fadeInUp} className="w-full flex flex-col items-center">
            <span className="font-serif text-xs tracking-[0.2em] text-[#eed57c] uppercase mb-2">GALLERY DIARY</span>
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-[#eed57c] uppercase mb-6">Slideshow Showcase</h2>
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </motion.div>

          {/* Dress Code & Travel guidelines */}
          {(data.dress_code || data.transport_info) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-4">
              {data.dress_code && (
                <div className="glass-card p-6 border border-[#eed57c]/15 flex flex-col items-center text-center bg-black/40">
                  <Compass className="w-8 h-8 text-[#eed57c] mb-3 stroke-[1.25]" />
                  <h4 className="font-cinzel text-sm text-[#eed57c] tracking-wider uppercase mb-2">Dress Standard</h4>
                  <p className="font-serif text-xs text-[#f5e9b3]/70 leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && (
                <div className="glass-card p-6 border border-[#eed57c]/15 flex flex-col items-center text-center bg-black/40">
                  <Bus className="w-8 h-8 text-[#eed57c] mb-3 stroke-[1.25]" />
                  <h4 className="font-cinzel text-sm text-[#eed57c] tracking-wider uppercase mb-2">Transport Desk</h4>
                  <p className="font-serif text-xs text-[#f5e9b3]/70 leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {data.custom_message && (
            <motion.p variants={fadeInUp} className="mt-4 max-w-lg font-serif text-sm text-[#f5e9b3]/70 leading-relaxed italic">
              {data.custom_message}
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="mt-8 pt-6 border-t border-[#b3811b]/30 w-full max-w-xs">
              <span className="font-serif text-xs tracking-widest text-[#eed57c]/80 uppercase">Contact Information</span>
              <p className="font-serif text-sm text-[#fbf6df] tracking-wide mt-1">
                Ph: {data.rsvp_phone}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
