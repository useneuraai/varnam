"use client";

import { motion, Variants } from "framer-motion";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import TempleReveal from "@/components/animations/TempleReveal";
import ScratchReveal from "@/components/animations/ScratchReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Compass, Bus } from "lucide-react";
import { CinematicCrest, GoldFoilLeaves, ScrollDrawTimeline, RevealGlowText, CountdownTimer } from "@/components/animations/CinematicEffects";

export default function RoyalTamilTemplate({ data }: { data: TemplateData }) {
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

  const initials = `${data.bride_name?.charAt(0) || "A"}${data.groom_name?.charAt(0) || "K"}`;

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #b53a18 0%, #5f140d 46%, #1b0504 100%)"
      }}
      className="relative min-h-screen text-[#fbf6df] overflow-x-hidden font-sans border-4 border-double border-gold-600/30 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image (Fixed to bypass mobile browser fixed-attachment bugs) */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-20 mix-blend-overlay"
      />

      {/* Dark overlay for custom background image readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#1b0504]/50 to-[#1b0504] z-0 pointer-events-none" />

      {/* Falling Jasmine Flowers */}
      <FloatingFlowers type="jasmine" count={15} />

      {/* Rising Golden Sparkles */}
      <FloatingFlowers type="sparkle" count={25} />

      {/* 3D Parallax Corner Foil Leaves */}
      <GoldFoilLeaves />

      {/* Decorative Corner Frames */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold-400 opacity-60 pointer-events-none z-10" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-gold-400 opacity-60 pointer-events-none z-10" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-gold-400 opacity-60 pointer-events-none z-10" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold-400 opacity-60 pointer-events-none z-10" />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center z-10 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="font-serif text-2xl tracking-[0.2em] text-gold-300 luxury-text-shadow">ஸ்ரீ கணேஷாய நமஹ</span>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2" />
          </motion.div>

          <motion.p variants={fadeInUp} className="font-serif text-xs md:text-sm tracking-[0.3em] uppercase text-gold-200/80 mb-6 luxury-text-shadow">
            WITH THE BLESSINGS OF THE ALMIGHTY
          </motion.p>

          {/* Interactive Cinematic Crest */}
          <motion.div variants={fadeInUp} className="flex justify-center w-full my-2">
            <CinematicCrest symbol="ॐ" initials={initials} />
          </motion.div>

          <motion.p variants={fadeInUp} className="font-great-vibes text-4xl md:text-5xl text-gold-300 mb-2 luxury-text-shadow">
            We Invite You to Celebrate the Union of
          </motion.p>

          {/* Cinematic Glow Letter Reveal */}
          <motion.div variants={fadeInUp} className="my-6">
            <RevealGlowText text={`${data.bride_name || "Aishwarya"} weds ${data.groom_name || "Karthik"}`} className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold break-words w-full px-4 text-center" />
          </motion.div>

          {/* Luxury Countdown Timer */}
          <motion.div variants={fadeInUp} className="w-full my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>

          {data.quote && (
            <motion.p variants={fadeInUp} className="max-w-xl font-serif italic text-sm md:text-base text-gold-100/90 leading-relaxed border-t border-b border-gold-600/30 py-4 my-4">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          <motion.div variants={fadeInUp} className="w-full my-6 opacity-85 scale-90">
            <TempleReveal />
          </motion.div>
        </motion.div>
      </div>

      {/* Details & Multi-Event Timeline Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center z-10 relative border-t border-gold-600/20">
        {/* Animated Scroll Line */}
        <ScrollDrawTimeline />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="w-full flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="w-16 h-16 rounded-full border border-gold-400/40 flex items-center justify-center mb-2 mx-auto">
              <span className="font-cinzel text-xl text-gold-300">शुभ</span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-gold-400 uppercase luxury-text-shadow">Wedding Timeline</h2>
            <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-2" />
          </motion.div>

          {/* SANGEET EVENT (IF PROVIDED) */}
          {data.sangeet_enabled !== "no" && data.sangeet_date && (
            <motion.div variants={fadeInUp} className="glass-card rounded-lg p-6 max-w-lg w-full mb-6 border border-gold-500/30 shadow-2xl relative overflow-hidden group bg-black/40">
              <div className="absolute inset-0 border border-gold-500/10 pointer-events-none m-1 rounded-md" />
              <span className="font-serif text-[10px] tracking-widest text-gold-400 uppercase font-bold mb-1 block">CELEBRATION ONE</span>
              <h3 className="font-cinzel text-gold-300 tracking-wider text-base mb-2 uppercase">Sangeet & Mehendi</h3>
              <p className="font-serif text-sm text-foreground tracking-wide mb-2">
                {formatDate(data.sangeet_date)}
              </p>
              {data.sangeet_venue && (
                <p className="font-serif text-xs text-gold-200/70 whitespace-pre-line leading-relaxed">
                  {data.sangeet_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* MAIN WEDDING EVENT */}
          <motion.div variants={fadeInUp} className="glass-card rounded-lg p-6 max-w-lg w-full mb-6 border border-gold-500/30 shadow-2xl relative overflow-hidden group bg-black/50">
            <div className="absolute inset-0 border border-gold-500/10 pointer-events-none m-1 rounded-md" />
            <span className="font-serif text-[10px] tracking-widest text-gold-400 uppercase font-bold mb-1 block">MAIN CELEBRATION</span>
            <h3 className="font-cinzel text-gold-300 tracking-wider text-base mb-2 uppercase">Muhurtham Ceremony</h3>
            
            {data.scratch_enabled === "yes" ? (
              <div className="flex justify-center my-4">
                <ScratchReveal dateString={formatDate(data.wedding_date)} />
              </div>
            ) : (
              <p className="font-serif text-sm md:text-base text-foreground tracking-wide my-4">
                {formatDate(data.wedding_date)}
              </p>
            )}

            <p className="font-serif text-xs text-gold-100/90 whitespace-pre-line leading-relaxed mt-3 border-t border-gold-500/10 pt-3">
              {data.wedding_venue}
            </p>

            {data.gmap_coordinates && (
              <div className="w-full mt-4 h-48 border border-gold-500/25 overflow-hidden shadow-inner">
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
            <motion.div variants={fadeInUp} className="glass-card rounded-lg p-6 max-w-lg w-full mb-8 border border-gold-500/30 shadow-2xl relative overflow-hidden group bg-black/40">
              <div className="absolute inset-0 border border-gold-500/10 pointer-events-none m-1 rounded-md" />
              <span className="font-serif text-[10px] tracking-widest text-gold-400 uppercase font-bold mb-1 block">CELEBRATION THREE</span>
              <h3 className="font-cinzel text-gold-300 tracking-wider text-base mb-2 uppercase">Reception Gala</h3>
              <p className="font-serif text-sm text-foreground tracking-wide mb-2">
                {formatDate(data.reception_date)}
              </p>
              {data.reception_venue && (
                <p className="font-serif text-xs text-gold-200/70 whitespace-pre-line leading-relaxed">
                  {data.reception_venue}
                </p>
              )}
            </motion.div>
          )}

          {/* Family Welcoming */}
          {data.family_names && (
            <motion.div variants={fadeInUp} className="mt-4">
              <p className="font-serif text-xs md:text-sm tracking-[0.2em] uppercase text-gold-200/80 mb-2">
                INVITED WITH WARM REGARDS BY
              </p>
              <p className="font-great-vibes text-3xl text-gold-300">
                {data.family_names}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Slideshow & Dress Code Sections (licensed features) */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center z-10 relative border-t border-gold-600/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="w-full flex flex-col items-center gap-12"
        >
          {/* Photo Slideshow */}
          <motion.div variants={fadeInUp} className="w-full flex flex-col items-center">
            <span className="font-serif text-xs tracking-[0.2em] text-gold-400 uppercase mb-2">OUR MEMORIES</span>
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-gold-300 uppercase mb-6">Slideshow Gallery</h2>
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </motion.div>

          {/* Dress Code & Travel guidelines */}
          {(data.dress_code || data.transport_info) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-4">
              {data.dress_code && (
                <div className="glass-card p-6 border border-gold-500/15 flex flex-col items-center text-center">
                  <Compass className="w-8 h-8 text-gold-400 mb-3 stroke-[1.25]" />
                  <h4 className="font-cinzel text-sm text-gold-300 tracking-wider uppercase mb-2">Dress Guidelines</h4>
                  <p className="font-serif text-xs text-gold-200/70 leading-relaxed">
                    {data.dress_code}
                  </p>
                </div>
              )}

              {data.transport_info && (
                <div className="glass-card p-6 border border-gold-500/15 flex flex-col items-center text-center">
                  <Bus className="w-8 h-8 text-gold-400 mb-3 stroke-[1.25]" />
                  <h4 className="font-cinzel text-sm text-gold-300 tracking-wider uppercase mb-2">Travel & Parking</h4>
                  <p className="font-serif text-xs text-gold-200/70 leading-relaxed">
                    {data.transport_info}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {data.custom_message && (
            <motion.p variants={fadeInUp} className="mt-4 max-w-lg font-serif text-sm text-gold-200/70 leading-relaxed italic">
              {data.custom_message}
            </motion.p>
          )}

          {/* RSVP Contact */}
          {data.rsvp_phone && (
            <motion.div variants={fadeInUp} className="mt-4 pt-6 border-t border-gold-600/30 w-full max-w-xs">
              <span className="font-serif text-xs tracking-widest text-gold-300/80 uppercase">RSVP Contact</span>
              <p className="font-serif text-sm text-gold-100 tracking-wide mt-1">
                Ph: {data.rsvp_phone}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
