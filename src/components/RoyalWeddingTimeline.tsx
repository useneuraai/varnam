"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export interface TimelineItem {
  id: string | number;
  sequence: number;
  time: string;
  name: string;
  venue: string;
  description?: string;
  isMuhurtham?: boolean;
}

export interface RoyalWeddingTimelineProps {
  eyebrow?: string;
  title?: string;
  events: TimelineItem[];
  className?: string;
}

export default function RoyalWeddingTimeline({
  eyebrow = "AUSPICIOUS TIMINGS",
  title = "Wedding Program",
  events,
  className = "",
}: RoyalWeddingTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-15 w-[92%] max-w-[340px] sm:max-w-[365px] my-auto py-6 sm:py-7 px-4 sm:px-6 rounded-2xl sm:rounded-3xl bg-[#fdfbf7]/94 sm:bg-[#faf6ee]/92 backdrop-blur-md border border-[#d4af37]/55 shadow-[0_20px_50px_rgba(20,10,3,0.22)] flex flex-col items-center select-none ${className}`}
    >
      {/* Real Royal Gold Corner Flourishes on Ivory Panel */}
      <img
        src="/images/elements/gold_corner_tl.webp"
        alt="Filigree"
        className="absolute top-1.5 left-1.5 w-8 h-auto object-contain opacity-75 pointer-events-none select-none"
      />
      <img
        src="/images/elements/gold_corner_tr.webp"
        alt="Filigree"
        className="absolute top-1.5 right-1.5 w-8 h-auto object-contain opacity-75 pointer-events-none select-none"
      />
      <img
        src="/images/elements/gold_corner_bl.webp"
        alt="Filigree"
        className="absolute bottom-1.5 left-1.5 w-8 h-auto object-contain opacity-75 pointer-events-none select-none"
      />
      <img
        src="/images/elements/gold_corner_br.webp"
        alt="Filigree"
        className="absolute bottom-1.5 right-1.5 w-8 h-auto object-contain opacity-75 pointer-events-none select-none"
      />

      {/* ===================================================================== */}
      {/* SCENE 1: Eyebrow + Single Clear Heading + Fine Gold Divider           */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-5"
      >
        <img
          src="/images/elements/gold_flower_bloom.webp"
          alt="Gold Flower"
          className="w-8 h-8 object-contain mb-1 drop-shadow-sm pointer-events-none select-none"
        />
        <span className="font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.28em] text-[#9a6a24] uppercase font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
          ✦ {eyebrow} ✦
        </span>
        <h2 className="font-cinzel text-xl sm:text-[22px] font-bold text-[#240e02] tracking-[0.14em] uppercase mt-1 leading-tight">
          {title}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-[#b38827]">
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#b38827] to-transparent" />
          <span className="text-[8px]">❖</span>
          <div className="w-10 h-[1px] bg-gradient-to-l from-transparent via-[#b38827] to-transparent" />
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* SCENE 2 & 3: Connected Vertical Gold Line + Sequential Event Reveal  */}
      {/* ===================================================================== */}
      <div className="relative w-full flex flex-col items-start pl-1 sm:pl-2">
        {/* Fine gold connecting line that draws itself downward */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0 }}
          className="absolute left-[18px] sm:left-[21px] top-3 bottom-6 w-[1.5px] bg-gradient-to-b from-[#d4af37] via-[#eed57c] to-[#b8860b]"
        />

        {/* Event Items */}
        <div className="relative w-full flex flex-col space-y-4 z-10">
          {events.map((evt, idx) => {
            const isLast = idx === events.length - 1;

            return (
              <motion.div
                key={evt.id || idx}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: 0.12 + idx * 0.12,
                  ease: "easeOut",
                }}
                className="relative flex items-start w-full group"
              >
                {/* 1. Sequence: Small numbered gold medallion */}
                <div
                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    evt.isMuhurtham
                      ? "bg-gradient-to-br from-[#7a0d18] to-[#991b1b] border-[#eed57c] text-[#fff2b2] text-[10px] ring-2 ring-[#eed57c]/40 font-bold"
                      : "bg-gradient-to-br from-[#f8df8c] via-[#d4af37] to-[#aa7d1e] border-[#fff6d1] text-[#2a1204] text-[10px] font-cinzel font-bold"
                  }`}
                >
                  {evt.isMuhurtham ? "❖" : evt.sequence}
                </div>

                {/* Event Information Card */}
                <div
                  className={`flex-1 pl-3.5 text-left transition-all ${
                    evt.isMuhurtham
                      ? "rounded-xl bg-[#fef7e6]/80 border border-[#d4af37]/45 p-2.5 -ml-1 shadow-xs"
                      : "py-0.5"
                  }`}
                >
                  {/* 2. Time: Small uppercase text, muted gold */}
                  <div className="font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.2em] text-[#936625] font-bold uppercase leading-none">
                    {evt.time}
                  </div>

                  {/* 3. Event name: Elegant serif, larger and dark brown */}
                  <h3
                    className={`font-cormorant text-lg sm:text-xl font-bold leading-tight mt-1 ${
                      evt.isMuhurtham ? "text-[#5e0710]" : "text-[#240e02]"
                    }`}
                  >
                    {evt.name}
                  </h3>

                  {/* Optional short description */}
                  {evt.description && (
                    <p className="font-marcellus text-[10.5px] text-[#633a17] italic leading-tight mt-0.5">
                      {evt.description}
                    </p>
                  )}

                  {/* 4. Venue: Small location icon + readable venue name */}
                  <div className="font-marcellus text-[11px] sm:text-xs text-[#522b10] font-semibold flex items-center gap-1.5 mt-1.5">
                    <MapPin className="w-3 h-3 text-[#9a6a24] shrink-0" />
                    <span className="line-clamp-1">{evt.venue}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* SCENE 4: Terminal Gold Ornament leading into Venue Section           */}
        {/* ===================================================================== */}
        <div className="relative flex items-center justify-center w-full pt-4 pb-1">
          <div className="flex items-center gap-2 text-[#b38827]/80">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#b38827] to-transparent" />
            <span className="text-[8px]">❖</span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-[#b38827] to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
