"use client";

import { motion, Variants } from "framer-motion";
import { MapPin, Calendar, Compass, Clock, Heart } from "lucide-react";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import { CountdownTimer, RevealGlowText } from "@/components/animations/CinematicEffects";

export default function TraditionalRedTemplate({ data }: { data: TemplateData }) {
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

  // Beautiful SVG Kolam component that draws itself using Framer Motion
  const SelfDrawingKolam = () => {
    const draw: Variants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: (i: number) => {
        const delay = 0.2 + i * 0.15;
        return {
          pathLength: 1,
          opacity: 0.8,
          transition: {
            pathLength: { delay, type: "spring" as const, duration: 2.5, bounce: 0, ease: "easeInOut" as const },
            opacity: { delay, duration: 0.5 }
          }
        };
      }
    };

    return (
      <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto flex items-center justify-center pointer-events-none select-none my-6">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full text-gold-400 drop-shadow-[0_0_8px_rgba(224,183,67,0.3)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Central diamond design of Kolam */}
          <motion.path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" custom={1} variants={draw} />
          
          {/* Inner details / intersecting loops */}
          <motion.path d="M 50 20 L 80 50 L 50 80 L 20 50 Z" custom={2} variants={draw} />
          
          {/* Ornamental curves on the corners */}
          <motion.path d="M 50 10 Q 50 30 70 30 Q 50 30 50 10" custom={3} variants={draw} />
          <motion.path d="M 90 50 Q 70 50 70 70 Q 70 50 90 50" custom={4} variants={draw} />
          <motion.path d="M 50 90 Q 50 70 30 70 Q 50 70 50 90" custom={5} variants={draw} />
          <motion.path d="M 10 50 Q 30 50 30 30 Q 30 50 10 50" custom={6} variants={draw} />

          {/* Interlocking corner loops */}
          <motion.path d="M 30 30 C 40 40 60 40 70 30 C 60 40 40 40 30 30" custom={7} variants={draw} />
          <motion.path d="M 70 70 C 60 60 40 60 30 70 C 40 60 60 60 70 70" custom={8} variants={draw} />

          {/* Core dot grid representations (typical for dots kolam) */}
          <motion.circle cx="50" cy="50" r="1.5" fill="currentColor" custom={9} variants={draw} />
          <motion.circle cx="35" cy="35" r="1" fill="currentColor" custom={10} variants={draw} />
          <motion.circle cx="65" cy="35" r="1" fill="currentColor" custom={11} variants={draw} />
          <motion.circle cx="35" cy="65" r="1" fill="currentColor" custom={12} variants={draw} />
          <motion.circle cx="65" cy="65" r="1" fill="currentColor" custom={13} variants={draw} />
        </motion.svg>
      </div>
    );
  };

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #4c0303 0%, #290000 45%, #0d0000 100%)",
      }}
      className="relative min-h-screen text-[#fcf9ea] overflow-x-hidden font-sans border-4 border-double border-gold-600/30 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image Overlay */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-15 mix-blend-overlay"
      />

      {/* Falling Jasmine Flowers */}
      <FloatingFlowers type="jasmine" count={15} />

      {/* Decorative Silk/Fabric texture border overlays */}
      <div className="absolute inset-4 border border-gold-600/20 pointer-events-none rounded-sm" />
      <div className="absolute inset-5 border border-gold-600/5 pointer-events-none rounded-sm" />

      {/* Elegant Golden Frames */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-gold-400 opacity-60 pointer-events-none z-10" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-gold-400 opacity-60 pointer-events-none z-10" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-gold-400 opacity-60 pointer-events-none z-10" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-gold-400 opacity-60 pointer-events-none z-10" />

      {/* Section 1: Animated Kolam */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-serif text-lg tracking-[0.2em] text-gold-300 luxury-text-shadow">மங்களம்</span>
          <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-1" />
          
          <SelfDrawingKolam />

          <p className="font-montserrat text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold-200/80 mt-6">
            WITH WARM HEART AND HOLY PRAYERS
          </p>
        </motion.div>
      </div>

      {/* Section 2: Wedding Announcement */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-center gap-6"
        >
          <span className="font-great-vibes text-3xl text-gold-300 leading-none">Wedding Announcement</span>

          <div className="my-2 py-4 w-full">
            <RevealGlowText
              text={`${data.bride_name || "Devi"} & ${data.groom_name || "Suresh"}`}
              className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider sm:tracking-widest text-[#eed57c] uppercase w-full px-4 break-words text-center"
            />
          </div>

          <CountdownTimer targetDate={data.wedding_date} />

          {data.quote && (
            <p className="max-w-md font-serif italic text-xs md:text-sm text-gold-100/80 leading-relaxed border-t border-b border-gold-600/20 py-4 my-4">
              &ldquo;{data.quote}&rdquo;
            </p>
          )}
        </motion.div>
      </div>

      {/* Section 3: Family Introduction */}
      {data.family_names && (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center bg-[#240101]/60 border border-gold-600/25 p-5 sm:p-8 max-w-xl shadow-xl"
          >
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-gold-400 fill-gold-400/10" />
            </div>
            <span className="font-montserrat text-[9px] tracking-widest text-gold-400 uppercase">INVITATION FROM ELDERS</span>
            <h3 className="font-cinzel text-neutral-100 text-lg font-bold tracking-wider my-3 uppercase">Host Families</h3>
            <p className="font-great-vibes text-3xl text-gold-300 leading-normal mb-2">
              {data.family_names}
            </p>
            <p className="font-serif text-xs text-gold-200/50 leading-relaxed max-w-sm">
              Cordially request the pleasure of your company to share in our celebration and bless the couple.
            </p>
          </motion.div>
        </div>
      )}

      {/* Section 4: Wedding Timeline */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-8">WEDDING SCHEDULE</span>

          <div className="flex flex-col gap-6 w-full max-w-md">
            {/* SANGEET */}
            {data.sangeet_enabled !== "no" && data.sangeet_date && (
              <div className="bg-[#1c0101] border-2 border-double border-gold-500/25 p-5 relative text-left">
                <span className="text-[9px] tracking-widest text-gold-400 font-bold uppercase block mb-1">CELEBRATION ONE</span>
                <h4 className="font-cinzel text-gold-300 text-base font-bold uppercase tracking-wider mb-2">Sangeet & Mehendi</h4>
                <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  <span>{formatDate(data.sangeet_date)}</span>
                </div>
                {data.sangeet_venue && (
                  <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line border-t border-neutral-800 pt-2">
                    {data.sangeet_venue}
                  </p>
                )}
              </div>
            )}

            {/* MUHURTHAM */}
            <div className="bg-[#240101] border-2 border-double border-gold-500/40 p-6 relative text-left shadow-lg">
              <div className="absolute top-4 right-4 bg-gold-600 text-black text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                MAIN CEREMONY
              </div>
              <span className="text-[9px] tracking-widest text-gold-400 font-bold uppercase block mb-1">CELEBRATION TWO</span>
              <h4 className="font-cinzel text-gold-300 text-lg font-bold uppercase tracking-wider mb-3">Muhurtham Ceremony</h4>

              {data.scratch_enabled === "yes" ? (
                <div className="my-3">
                  <ScratchReveal dateString={formatDate(data.wedding_date)} />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-neutral-200 mb-3 bg-black/40 p-2.5 border border-gold-500/10">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span>{formatDate(data.wedding_date)}</span>
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line border-t border-gold-500/10 pt-3">
                {data.wedding_venue}
              </p>
            </div>

            {/* RECEPTION */}
            {data.reception_date && (
              <div className="bg-[#1c0101] border-2 border-double border-gold-500/25 p-5 relative text-left">
                <span className="text-[9px] tracking-widest text-gold-400 font-bold uppercase block mb-1">CELEBRATION THREE</span>
                <h4 className="font-cinzel text-gold-300 text-base font-bold uppercase tracking-wider mb-2">Wedding Reception</h4>
                <div className="flex items-center gap-2 text-xs text-neutral-300 mb-2">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  <span>{formatDate(data.reception_date)}</span>
                </div>
                {data.reception_venue && (
                  <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line border-t border-neutral-800 pt-2">
                    {data.reception_venue}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Section 5: Venue and Directions */}
      {data.gmap_coordinates && (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center"
          >
            <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-8">LOCATE THE VENUE</span>

            {/* Traditional Gold/Red double framed map */}
            <div className="w-full max-w-2xl border-4 border-gold-500/40 p-1.5 bg-[#1c0101] shadow-2xl">
              <div className="w-full h-80 relative bg-neutral-900 border border-gold-500/20">
                <iframe
                  title="Traditional Red Map View"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale opacity-80"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Travel notes */}
            {(data.dress_code || data.transport_info) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mt-8 text-left">
                {data.dress_code && (
                  <div className="border border-gold-500/15 p-4 bg-black/35 flex gap-2">
                    <Compass className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-cinzel text-gold-400 text-[10px] font-bold uppercase tracking-wider block">Dress Code</span>
                      <p className="font-serif text-xs text-gold-200/70 mt-1 leading-relaxed">{data.dress_code}</p>
                    </div>
                  </div>
                )}
                {data.transport_info && (
                  <div className="border border-gold-500/15 p-4 bg-black/35 flex gap-2">
                    <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-cinzel text-gold-400 text-[10px] font-bold uppercase tracking-wider block">Directions & Parking</span>
                      <p className="font-serif text-xs text-gold-200/70 mt-1 leading-relaxed">{data.transport_info}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* RSVP Direct Phone */}
      {data.rsvp_phone && (
        <div className="max-w-xs mx-auto border-t border-gold-500/20 text-center pt-8 pb-12 z-10 relative">
          <span className="font-montserrat text-[9px] tracking-widest text-gold-400 uppercase">RSVP CONTACT</span>
          <p className="font-serif text-sm text-gold-100 tracking-wide mt-1.5">Ph: {data.rsvp_phone}</p>
        </div>
      )}
    </div>
  );
}
