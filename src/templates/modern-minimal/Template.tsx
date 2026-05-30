"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Compass, User, Clock } from "lucide-react";
import { TemplateData } from "@/lib/templates";
import ScratchReveal from "@/components/animations/ScratchReveal";
import { CountdownTimer, RevealGlowText } from "@/components/animations/CinematicEffects";

export default function ModernMinimalTemplate({ data }: { data: TemplateData }) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const textFadeIn: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        backgroundColor: "#fcfbfa",
      }}
      className="relative min-h-screen text-[#1c1a17] overflow-x-hidden font-sans p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image Overlay */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-5 mix-blend-overlay"
      />

      {/* Thin elegant minimal border */}
      <div className="absolute inset-4 border border-[#1c1a17]/10 pointer-events-none rounded-none" />

      {/* Section 1: Names and Date */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="w-full flex flex-col items-center gap-4"
        >
          <motion.span variants={textFadeIn} className="font-montserrat text-[10px] tracking-[0.25em] text-[#8a857d] uppercase">
            THE WEDDING CELEBRATION
          </motion.span>

          <motion.div variants={textFadeIn} className="py-2 border-t border-b border-[#1c1a17]/10 w-full max-w-lg my-4">
            <RevealGlowText
              text={`${data.bride_name || "Riya"} & ${data.groom_name || "Varun"}`}
              className="text-xl sm:text-3xl md:text-5xl font-normal tracking-wide text-[#1c1a17] uppercase break-words w-full px-4 text-center"
            />
          </motion.div>

          <motion.div variants={textFadeIn} className="text-sm font-light text-[#57534e] tracking-wider mb-6 flex flex-col items-center gap-1.5">
            <span>{formatDate(data.wedding_date)}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#8a857d] font-bold">{data.wedding_venue.split(",")[0]}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Section 2: Love Story */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-[#1c1a17]/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="w-full flex flex-col items-center max-w-2xl gap-6"
        >
          <motion.span variants={textFadeIn} className="font-montserrat text-[9px] tracking-widest text-[#8a857d] uppercase">
            OUR STORY
          </motion.span>

          <motion.h3 variants={textFadeIn} className="font-cinzel text-xl text-[#1c1a17] tracking-wider uppercase">
            How it began
          </motion.h3>

          <motion.p variants={textFadeIn} className="font-serif text-sm text-[#57534e] leading-relaxed max-w-md italic my-4">
            &ldquo;In a world of constant movement, we found a quiet anchor in each other. A journey that started with simple conversations now blooms into a lifelong partnership.&rdquo;
          </motion.p>

          {data.quote && (
            <motion.p variants={textFadeIn} className="font-montserrat text-[10px] tracking-widest text-[#8a857d] uppercase border-t border-[#1c1a17]/10 pt-4 w-40">
              &ldquo;{data.quote}&rdquo;
            </motion.p>
          )}

          <motion.div variants={textFadeIn} className="w-full max-w-sm mt-6">
            <CountdownTimer targetDate={data.wedding_date} />
          </motion.div>
        </motion.div>
      </div>

      {/* Section 3: Event details */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-[#1c1a17]/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="w-full flex flex-col items-center"
        >
          <motion.span variants={textFadeIn} className="font-montserrat text-[10px] tracking-[0.2em] text-[#8a857d] uppercase mb-8">
            SCHEDULE & TIMELINE
          </motion.span>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
            {/* SANGEET */}
            {data.sangeet_enabled !== "no" && data.sangeet_date && (
              <motion.div variants={textFadeIn} className="flex-1 bg-white border border-[#1c1a17]/10 p-6 flex flex-col justify-between text-left rounded-sm min-h-[220px]">
                <div>
                  <span className="text-[9px] tracking-widest text-[#8a857d] font-bold uppercase block mb-1">EVENT ONE</span>
                  <h4 className="font-cinzel text-neutral-800 text-sm font-semibold uppercase tracking-wider mb-2">Sangeet Night</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#57534e] mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#1c1a17]/60" />
                    <span>{formatDate(data.sangeet_date)}</span>
                  </div>
                  {data.sangeet_venue && (
                    <p className="text-[11px] text-[#57534e] mt-2 border-t border-[#1c1a17]/5 pt-2 leading-relaxed">
                      {data.sangeet_venue}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* WEDDING */}
            <motion.div variants={textFadeIn} className="flex-1 bg-[#f5f2eb] border border-[#1c1a17]/25 p-6 flex flex-col justify-between text-left rounded-sm min-h-[220px]">
              <div>
                <span className="text-[9px] tracking-widest text-[#1c1a17]/60 font-bold uppercase block mb-1">MAIN CELEBRATION</span>
                <h4 className="font-cinzel text-neutral-950 text-base font-bold uppercase tracking-wider mb-3">The Muhurtham</h4>

                {data.scratch_enabled === "yes" ? (
                  <div className="my-3">
                    <ScratchReveal dateString={formatDate(data.wedding_date)} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-800 mb-3 bg-white py-1.5 px-3 border border-[#1c1a17]/10 rounded-sm">
                    <Clock className="w-4 h-4 text-[#1c1a17]/60" />
                    <span>{formatDate(data.wedding_date)}</span>
                  </div>
                )}

                <p className="text-[11px] text-[#342c25] mt-3 border-t border-[#1c1a17]/10 pt-3 leading-relaxed">
                  {data.wedding_venue}
                </p>
              </div>
            </motion.div>

            {/* RECEPTION */}
            {data.reception_date && (
              <motion.div variants={textFadeIn} className="flex-1 bg-white border border-[#1c1a17]/10 p-6 flex flex-col justify-between text-left rounded-sm min-h-[220px]">
                <div>
                  <span className="text-[9px] tracking-widest text-[#8a857d] font-bold uppercase block mb-1">EVENT THREE</span>
                  <h4 className="font-cinzel text-neutral-800 text-sm font-semibold uppercase tracking-wider mb-2">Reception Dinner</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#57534e] mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#1c1a17]/60" />
                    <span>{formatDate(data.reception_date)}</span>
                  </div>
                  {data.reception_venue && (
                    <p className="text-[11px] text-[#57534e] mt-2 border-t border-[#1c1a17]/5 pt-2 leading-relaxed">
                      {data.reception_venue}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Invited By */}
          {data.family_names && (
            <motion.div variants={textFadeIn} className="mt-12 text-center">
              <span className="font-montserrat text-[9px] tracking-widest text-[#8a857d] uppercase">INVITED BY</span>
              <p className="font-cinzel text-base font-bold text-[#1c1a17] tracking-wider mt-1">{data.family_names}</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Section 4: Map and RSVP */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-[#1c1a17]/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="w-full flex flex-col items-center max-w-xl"
        >
          <motion.span variants={textFadeIn} className="font-montserrat text-[10px] tracking-[0.25em] text-[#8a857d] uppercase mb-8">
            VENUE NAVIGATION
          </motion.span>

          {data.gmap_coordinates && (
            <motion.div variants={textFadeIn} className="w-full border border-[#1c1a17]/10 p-1 bg-white shadow-md mb-6">
              <div className="w-full h-72 relative bg-neutral-100">
                <iframe
                  title="Modern Minimal Map View"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}

          {/* Details details */}
          {(data.dress_code || data.transport_info) && (
            <motion.div variants={textFadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left mt-4 mb-6">
              {data.dress_code && (
                <div className="border border-[#1c1a17]/10 p-4 bg-white/40 flex gap-2 rounded-sm">
                  <Compass className="w-4 h-4 text-[#1c1a17]/60 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-montserrat text-[9px] font-bold uppercase tracking-wider text-[#1c1a17] block">DRESS CODE</span>
                    <p className="text-xs text-[#57534e] mt-1 font-light leading-relaxed">{data.dress_code}</p>
                  </div>
                </div>
              )}
              {data.transport_info && (
                <div className="border border-[#1c1a17]/10 p-4 bg-white/40 flex gap-2 rounded-sm">
                  <MapPin className="w-4 h-4 text-[#1c1a17]/60 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-montserrat text-[9px] font-bold uppercase tracking-wider text-[#1c1a17] block">TRANSPORT</span>
                    <p className="text-xs text-[#57534e] mt-1 font-light leading-relaxed">{data.transport_info}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Final Call to RSVP */}
          <motion.div variants={textFadeIn} className="border border-[#1c1a17]/10 p-6 w-full text-center bg-[#f5f2eb]/40 rounded-sm">
            <span className="font-montserrat text-[9px] tracking-widest text-[#8a857d] uppercase block">ATTENDANCE CONFIRMATION</span>
            <h4 className="font-cinzel text-neutral-800 text-sm font-semibold uppercase tracking-wider my-2">Please RSVP</h4>
            <p className="text-xs text-[#57534e] mb-4 font-light leading-relaxed">
              Use the interactive RSVP button in the floating panel at the bottom to register your attendance and wishes.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* RSVP Desk */}
      {data.rsvp_phone && (
        <div className="max-w-xs mx-auto border-t border-[#1c1a17]/10 text-center pt-8 pb-12 z-10 relative">
          <span className="font-montserrat text-[9px] tracking-widest text-[#8a857d] uppercase">RSVP DESK</span>
          <p className="text-xs text-[#1c1a17] tracking-wider mt-1.5 font-light">Ph: {data.rsvp_phone}</p>
        </div>
      )}
    </div>
  );
}
