"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// 1. Premium Interactive SVG Crest with pulsing glow
export function CinematicCrest({ symbol = "❤", initials = "W" }: { symbol?: string; initials?: string }) {
  return (
    <div className="relative flex items-center justify-center w-36 h-36 my-6 select-none pointer-events-auto group">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,163,37,0.25)_0%,transparent_70%)] rounded-full blur-xl animate-[pulse_4s_infinite]" />
      
      {/* Outer Rotating Dotted Border */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute w-full h-full text-gold-500/40"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 4" fill="none" />
      </motion.svg>

      {/* Inner Rotating Floral Frame */}
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute w-[86%] h-[86%] text-gold-400/60 drop-shadow-[0_0_8px_rgba(212,163,37,0.3)]"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        {/* Ornate interlocking loops */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle} 50 50)`}
            d="M 50,8 C 45,22 55,22 50,30 C 45,22 55,22 50,8"
          />
        ))}
        <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="0.5" />
      </motion.svg>

      {/* Center stationary core badge */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        className="z-10 w-[60%] h-[60%] rounded-full bg-black/60 backdrop-blur-md border border-gold-500/35 flex flex-col items-center justify-center shadow-2xl relative"
      >
        <span className="font-cinzel text-xs text-gold-400 font-extrabold tracking-widest leading-none mt-1">
          {initials}
        </span>
        <div className="w-5 h-[1px] bg-gold-500/30 my-1.5" />
        <span className="text-base text-gold-300 font-bold leading-none animate-[pulse_2s_infinite]">
          {symbol}
        </span>
      </motion.div>
    </div>
  );
}

// 2. Parallax Corner Foliage (Foil Leaves) that moves on scroll
export function GoldFoilLeaves() {
  const { scrollY } = useScroll();
  
  // Transform scrolls into slight translations and rotations
  const tlY = useTransform(scrollY, [0, 1000], [0, -45]);
  const trY = useTransform(scrollY, [0, 1000], [0, -35]);
  const blY = useTransform(scrollY, [0, 1500], [0, 60]);
  const brY = useTransform(scrollY, [0, 1500], [0, 50]);

  const leafPathLeft = "M 0 0 C 20 40 40 40 60 20 C 40 10 20 10 0 0 M 20 20 C 35 45 60 50 80 30 C 55 20 35 15 20 20";
  const leafPathRight = "M 100 0 C 80 40 60 40 40 20 C 60 10 80 10 100 0 M 80 20 C 65 45 40 50 20 30 C 45 20 65 15 80 20";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Top Left Leaf Group */}
      <motion.div style={{ y: tlY }} className="absolute top-2 left-2 w-28 h-28 text-gold-500/25">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d={leafPathLeft} />
          <path d="M 0 0 Q 30 10 50 40 Q 20 30 0 0" />
        </svg>
      </motion.div>

      {/* Top Right Leaf Group */}
      <motion.div style={{ y: trY }} className="absolute top-2 right-2 w-28 h-28 text-gold-500/25">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d={leafPathRight} />
          <path d="M 100 0 Q 70 10 50 40 Q 80 30 100 0" />
        </svg>
      </motion.div>

      {/* Bottom Left Leaf Group */}
      <motion.div style={{ y: blY }} className="absolute bottom-10 left-2 w-28 h-28 text-gold-500/20">
        <svg viewBox="0 0 100 100" fill="currentColor" className="rotate-180">
          <path d={leafPathLeft} />
        </svg>
      </motion.div>

      {/* Bottom Right Leaf Group */}
      <motion.div style={{ y: brY }} className="absolute bottom-10 right-2 w-28 h-28 text-gold-500/20">
        <svg viewBox="0 0 100 100" fill="currentColor" className="rotate-180">
          <path d={leafPathRight} />
        </svg>
      </motion.div>
    </div>
  );
}

// 3. Scroll-drawn vertical timeline connector
export function ScrollDrawTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  return (
    <div ref={containerRef} className="absolute left-1/2 -translate-x-1/2 top-40 bottom-24 w-1 pointer-events-none z-0">
      {/* Background tracking line */}
      <div className="absolute inset-0 bg-gold-600/10 w-[2px] left-[1px]" />
      
      {/* Interactive drawing line */}
      <svg className="w-2 h-full overflow-visible text-gold-500/80" viewBox="0 0 2 100" preserveAspectRatio="none">
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="100"
          style={{ pathLength }}
        />
      </svg>
      
      {/* Decorative pulse points along scroll */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold-500/40 ring-4 ring-gold-500/10 animate-[ping_3s_infinite]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold-500/40 ring-4 ring-gold-500/10 animate-[ping_3s_infinite]" />
    </div>
  );
}

// 4. Reveal Glow Title text with shimmering mask
export function RevealGlowText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9,
      filter: "blur(4px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring" as const, 
        damping: 18, 
        stiffness: 90 
      }
    }
  };

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`font-cinzel couple-names-title tracking-wider sm:tracking-widest text-center select-none flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 relative ${className}`}
    >
      {/* Text Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-100/15 to-transparent -translate-x-full animate-[shimmer_6s_infinite] pointer-events-none" />
      
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-normal break-words sm:whitespace-nowrap">
          {Array.from(word).map((char, cIdx) => (
            <motion.span
              key={cIdx}
              variants={letterVariants}
              style={{ display: "inline-block" }}
              className="gold-gradient-text drop-shadow-[0_4px_12px_rgba(212,163,37,0.25)] hover:scale-105 transition-transform duration-300"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

// 5. Luxury Modular Countdown Timer
export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="font-cinzel text-xs text-gold-300 tracking-widest mt-6 bg-black/40 px-4 py-2 border border-gold-500/20 rounded-none shadow-lg">
        THE CELEBRATION HAS COMMENCED
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-4 mt-6 select-none justify-center">
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HRS", value: timeLeft.hours },
        { label: "MINS", value: timeLeft.minutes },
        { label: "SECS", value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-md border border-gold-500/30 flex flex-col items-center justify-center shadow-lg relative group overflow-hidden">
            {/* Hover sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="font-cinzel text-lg md:text-xl font-bold text-gold-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="font-montserrat text-[8px] md:text-[9px] tracking-widest text-gold-400/80 mt-1.5 uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
