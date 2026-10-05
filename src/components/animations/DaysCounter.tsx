"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DaysCounterProps {
  targetDate: string;
  theme?: "dark" | "light" | "gold" | "rose" | "minimal";
  className?: string;
}

export default function DaysCounter({
  targetDate,
  theme = "gold",
  className = "",
}: DaysCounterProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (isNaN(target)) {
        setTimeLeft({ days: 30, hours: 12, minutes: 0, seconds: 0, isPast: false });
        return;
      }

      if (diff <= 0) {
        // If event date has passed, celebrate days of togetherness!
        const elapsed = Math.abs(diff);
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const seconds = Math.floor((elapsed / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isPast: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Color & styling variations based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case "light":
        return {
          boxBg: "bg-white/90 border-[#d9ccc2]/80 shadow-md text-[#2c2724]",
          numColor: "text-[#c0392b]",
          labelColor: "text-[#8a725d]",
          headerColor: "text-[#c0392b]",
          accentLine: "bg-[#fa8231]",
        };
      case "minimal":
        return {
          boxBg: "bg-[#f5f5f3] border-zinc-300 shadow-sm text-zinc-900",
          numColor: "text-zinc-950",
          labelColor: "text-zinc-500",
          headerColor: "text-zinc-900",
          accentLine: "bg-zinc-900",
        };
      case "rose":
        return {
          boxBg: "bg-white/80 border-[#eed5c9] shadow-md text-[#4a3b32]",
          numColor: "text-[#b05d6f]",
          labelColor: "text-[#9c7a72]",
          headerColor: "text-[#b05d6f]",
          accentLine: "bg-[#b05d6f]",
        };
      case "dark":
      case "gold":
      default:
        return {
          boxBg: "bg-black/60 border-[#d4af37]/35 shadow-[0_8px_25px_rgba(0,0,0,0.5)] text-white backdrop-blur-md",
          numColor: "text-[#f3e5ab] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]",
          labelColor: "text-[#d4af37]/80",
          headerColor: "text-[#f3e5ab]",
          accentLine: "bg-[#d4af37]",
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`w-full max-w-2xl mx-auto my-8 px-4 text-center select-none ${className}`}>
      {/* Header Tagline */}
      <div className="mb-4">
        <span className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold ${styles.headerColor}`}>
          {timeLeft.isPast ? "CELEBRATING TOGETHER FOREVER" : "COUNTING DOWN FOREVER TO OUR SPECIAL DAY"}
        </span>
        <div className={`h-[1px] w-16 mx-auto mt-2 opacity-60 ${styles.accentLine}`} />
      </div>

      {/* 4-Unit Counter Blocks */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
        {[
          { label: "DAYS", value: timeLeft.days },
          { label: "HOURS", value: timeLeft.hours },
          { label: "MINUTES", value: timeLeft.minutes },
          { label: "SECONDS", value: timeLeft.seconds },
        ].map((unit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04 }}
            className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl border ${styles.boxBg} transition-transform duration-300`}
          >
            <span className={`text-2xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight ${styles.numColor}`}>
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className={`text-[8px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold mt-1 ${styles.labelColor}`}>
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Subtitle note */}
      <p className="text-[11px] sm:text-xs mt-3 opacity-70 tracking-wider italic">
        {timeLeft.isPast
          ? "Every moment since our sacred vows is cherished forever."
          : "Every second brings us closer to a lifetime of love and joy."}
      </p>
    </div>
  );
}
