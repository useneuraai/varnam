"use client";
// Triggering editor refresh

import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Sparkles, Image as ImageIcon, CheckCircle, Clock } from "lucide-react";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import ScratchReveal from "@/components/animations/ScratchReveal";
import { CountdownTimer, RevealGlowText } from "@/components/animations/CinematicEffects";

// SVG Animated Flower Bloom Component
const BloomingFlower = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <div className={`relative pointer-events-none select-none ${className}`}>
    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-pink-300/40 drop-shadow-[0_0_8px_rgba(244,143,177,0.2)]">
      {/* Animated Flower Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <motion.path
          key={angle}
          d="M 50 50 C 40 25 60 25 50 50"
          fill="currentColor"
          stroke="rgba(212,175,55,0.15)"
          strokeWidth="0.5"
          transform={`rotate(${angle} 50 50)`}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1.1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 10,
            delay: delay + idx * 0.1,
            duration: 1.5
          }}
        />
      ))}
      {/* Core Pistil */}
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill="#eed57c"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 1, duration: 0.5 }}
      />
    </svg>
  </div>
);

export default function FloralLuxuryTemplate({ data }: { data: TemplateData }) {
  const itineraryCount = (data.sangeet_enabled !== "no" && data.sangeet_date ? 1 : 0) + 1 + (data.reception_date ? 1 : 0);
  const gridClass = itineraryCount === 3
    ? "md:grid-cols-3"
    : itineraryCount === 2
    ? "md:grid-cols-2 max-w-2xl"
    : "max-w-md mx-auto";

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

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #fffcf8 0%, #fbf3e9 60%, #f3e5d7 100%)",
      }}
      className="relative min-h-screen text-[#5a483a] overflow-x-hidden font-sans border-4 border-double border-pink-200/50 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image Overlay */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-15 mix-blend-overlay"
      />

      {/* Floating Pink Rose Petals */}
      <FloatingFlowers type="rose" count={18} />

      {/* Decorative Ornate Framed Overlay */}
      <div className="absolute inset-4 border border-pink-300/10 pointer-events-none rounded-2xl" />
      <div className="absolute inset-6 border border-gold-600/10 pointer-events-none rounded-2xl" />

      {/* Corner Foliage Decorations */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-gold-500/30 opacity-60 pointer-events-none z-20" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-gold-500/30 opacity-60 pointer-events-none z-20" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-gold-500/30 opacity-60 pointer-events-none z-20" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-gold-500/30 opacity-60 pointer-events-none z-20" />

      {/* Section 1: Hero Blooming Floral Arrangement */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="w-full flex flex-col items-center"
        >
          {/* Top Blooming Floral Arrangement */}
          <div className="flex gap-2 justify-center mb-6">
            <BloomingFlower delay={0.2} />
            <BloomingFlower className="scale-125 -translate-y-2" delay={0} />
            <BloomingFlower delay={0.4} />
          </div>

          <span className="font-montserrat text-[10px] md:text-[11px] tracking-[0.3em] text-[#c0a080] font-bold uppercase block mb-3">
            THE CELEBRATION OF LOVE
          </span>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c0a080] to-transparent mb-8" />

          <p className="font-serif italic text-sm md:text-base text-[#806f60] max-w-md leading-relaxed">
            &ldquo;Joined in heart, we embark on a journey of a lifetime.&rdquo;
          </p>
        </motion.div>
      </div>

      {/* Section 2: Couple Names & Counter */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-pink-200/20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-center gap-6"
        >
          <span className="font-montserrat text-[9px] tracking-widest text-[#a88a6d] uppercase">TOGETHER WITH THEIR FAMILIES</span>

          <div className="py-4 border-y border-[#c0a080]/15 w-full max-w-xl">
            <RevealGlowText
              text={`${data.bride_name || "Zara"} & ${data.groom_name || "Kabir"}`}
              className="text-xl sm:text-3xl md:text-5xl font-bold tracking-wider sm:tracking-widest text-[#a08060] uppercase w-full px-4 break-words text-center"
            />
          </div>

          <div className="w-full max-w-sm my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </div>

          {/* Short Story snippet */}
          <div className="max-w-md p-6 bg-white/40 border border-white/50 backdrop-blur-sm shadow-xl rounded-2xl mt-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f3e5d7] border border-gold-500/20 px-4 py-0.5 rounded-full font-montserrat text-[8px] tracking-widest uppercase font-bold text-[#8a725d]">
              OUR STORY
            </div>
            <p className="font-serif text-xs text-[#6e5d50] leading-relaxed italic">
              &ldquo;We met under a canopy of blossoms, spoke in whispers, and realized our paths were meant to merge. Today, we step forward to weave our dreams together forever.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>

      {/* Section 3: Event details */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-pink-200/20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-[#a08060] uppercase mb-8">WEDDING ITINERARY</span>

          <div className={`grid grid-cols-1 ${gridClass} gap-6 w-full`}>
            {/* SANGEET */}
            {data.sangeet_enabled !== "no" && data.sangeet_date && (
              <div className="bg-white/45 border border-[#eed57c]/40 p-6 backdrop-blur-md rounded-2xl flex flex-col justify-between shadow-lg relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/5 to-transparent pointer-events-none" />
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-[#a88a6d] uppercase block mb-1">CELEBRATION ONE</span>
                  <h4 className="font-cinzel text-neutral-800 text-sm font-bold uppercase tracking-wider mb-3">Sangeet & Dance</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#6e5d50] justify-center mb-3">
                    <Calendar className="w-3.5 h-3.5 text-[#b09070]" />
                    <span>{formatDate(data.sangeet_date)}</span>
                  </div>
                  {data.sangeet_venue && (
                    <p className="text-[11px] text-[#806f60] font-serif leading-relaxed mt-2 border-t border-neutral-200/50 pt-2">
                      {data.sangeet_venue}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* WEDDING */}
            <div className="bg-white/70 border border-[#eed57c]/60 p-6 backdrop-blur-md rounded-2xl flex flex-col justify-between shadow-xl relative scale-102 ring-1 ring-pink-300/10">
              <div className="absolute top-3 right-3 bg-pink-100 border border-pink-200 text-pink-700 text-[6px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                THE VOWS
              </div>
              <div>
                <span className="text-[8px] font-bold tracking-widest text-[#a88a6d] uppercase block mb-1">MAIN CELEBRATION</span>
                <h4 className="font-cinzel text-neutral-900 text-base font-bold uppercase tracking-wider mb-3">Vows Ceremony</h4>

                {data.scratch_enabled === "yes" ? (
                  <div className="my-3 flex justify-center">
                    <ScratchReveal dateString={formatDate(data.wedding_date)} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-800 justify-center mb-3 bg-[#fff9f2] py-2 border border-[#eed57c]/30 rounded-lg">
                    <Clock className="w-4 h-4 text-[#b09070]" />
                    <span>{formatDate(data.wedding_date)}</span>
                  </div>
                )}

                <p className="text-[11px] text-[#605040] font-serif leading-relaxed mt-3 border-t border-neutral-200/60 pt-3">
                  {data.wedding_venue}
                </p>
              </div>
            </div>

            {/* RECEPTION */}
            {data.reception_date && (
              <div className="bg-white/45 border border-[#eed57c]/40 p-6 backdrop-blur-md rounded-2xl flex flex-col justify-between shadow-lg relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/5 to-transparent pointer-events-none" />
                <div>
                  <span className="text-[8px] font-bold tracking-widest text-[#a88a6d] uppercase block mb-1">CELEBRATION THREE</span>
                  <h4 className="font-cinzel text-neutral-800 text-sm font-bold uppercase tracking-wider mb-3">Reception Gala</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#6e5d50] justify-center mb-3">
                    <Calendar className="w-3.5 h-3.5 text-[#b09070]" />
                    <span>{formatDate(data.reception_date)}</span>
                  </div>
                  {data.reception_venue && (
                    <p className="text-[11px] text-[#806f60] font-serif leading-relaxed mt-2 border-t border-neutral-200/50 pt-2">
                      {data.reception_venue}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Invited By */}
          {data.family_names && (
            <div className="mt-12">
              <span className="font-montserrat text-[9px] tracking-widest text-[#a88a6d] uppercase">INVITED WITH LOVE BY</span>
              <p className="font-great-vibes text-3xl text-[#a08060] mt-2">{data.family_names}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Section 4: Photo Gallery */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-pink-200/20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-[#a08060] uppercase mb-2">SHARED MEMORIES</span>
          <h2 className="font-cinzel text-xl md:text-2xl text-[#8a725d] tracking-widest uppercase mb-8 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#b09070]" />
            Photo Slideshow
          </h2>

          <div className="w-full max-w-lg border border-pink-200/60 p-2 bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl">
            <PhotoSlideshow imagesString={data.slideshow_images} />
          </div>
        </motion.div>
      </div>

      {/* Section 5: RSVP Panel */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-pink-200/20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-md bg-white/60 border border-white/80 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-2xl text-center"
        >
          <div className="w-12 h-12 rounded-full border border-pink-300/40 bg-pink-50 flex items-center justify-center mb-4 mx-auto">
            <CheckCircle className="w-5 h-5 text-pink-500" />
          </div>

          <span className="font-montserrat text-[9px] tracking-widest text-[#a88a6d] uppercase block">RSVP ENTRANCE</span>
          <h3 className="font-cinzel text-neutral-800 text-lg font-bold tracking-wider my-2 uppercase">Please Respond</h3>
          <p className="font-serif text-xs text-[#806f60] leading-relaxed mb-6">
            Help us arrange our paradise celebrations by responding to the RSVP form on the floating navigation bar at the bottom.
          </p>

          <div className="w-16 h-[1.5px] bg-[#c0a080]/30 mx-auto mb-6" />

          {/* Map details */}
          {data.gmap_coordinates && (
            <div className="text-center w-full">
              <span className="font-montserrat text-[8px] tracking-widest text-[#a88a6d] uppercase block mb-3">DESTINATION DIRECTIONS</span>
              <div className="w-full h-48 border border-pink-200/40 rounded-xl overflow-hidden shadow-inner">
                <iframe
                  title="Floral Luxury Map View"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=14&output=embed`}
                  className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity duration-300"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Transport note */}
          {data.transport_info && (
            <p className="font-serif text-[10px] text-[#806f60] mt-4 leading-relaxed italic">
              Transport Desk: {data.transport_info}
            </p>
          )}
        </motion.div>
      </div>

      {/* RSVP desk contact */}
      {data.rsvp_phone && (
        <div className="max-w-xs mx-auto border-t border-pink-200/20 text-center pt-8 pb-12 z-10 relative">
          <span className="font-montserrat text-[9px] tracking-widest text-[#a88a6d] uppercase">RSVP ASSISTANCE</span>
          <p className="font-serif text-sm text-[#5a483a] tracking-wide mt-1">Ph: {data.rsvp_phone}</p>
        </div>
      )}
    </div>
  );
}
