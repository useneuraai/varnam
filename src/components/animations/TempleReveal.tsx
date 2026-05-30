"use client";

import { motion, Variants } from "framer-motion";

export default function TempleReveal() {
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.8,
      transition: { duration: 3, ease: "easeInOut" },
    },
  };

  const centerVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 1.5, duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative flex items-center justify-center w-full h-[300px] md:h-[400px]">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-[400px] overflow-visible text-gold-400 drop-shadow-[0_0_15px_rgba(212,163,37,0.3)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Outer Frame - Archway */}
        <motion.path
          d="M 50,380 L 50,180 C 50,80 150,50 200,50 C 250,50 350,80 350,180 L 350,380"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Inner Arch Details */}
        <motion.path
          d="M 70,380 L 70,180 C 70,100 150,80 200,80 C 250,80 330,100 330,180 L 330,380"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Pillar Details Left */}
        <motion.path
          d="M 40,380 L 80,380 M 40,350 L 80,350 M 60,350 L 60,380"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Pillar Details Right */}
        <motion.path
          d="M 320,380 L 360,380 M 320,350 L 360,350 M 340,350 L 340,380"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Dome Mandala Elements */}
        <motion.circle
          cx="200"
          cy="200"
          r="60"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.circle
          cx="200"
          cy="200"
          r="40"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.circle
          cx="200"
          cy="200"
          r="20"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Petals / Spoke lines of Mandala */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 20;
          const y1 = 200 + Math.sin(rad) * 20;
          const x2 = 200 + Math.cos(rad) * 60;
          const y2 = 200 + Math.sin(rad) * 60;
          return (
            <motion.line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
            />
          );
        })}

        {/* Ornate flourishes */}
        <motion.path
          d="M 200,30 L 200,10 M 190,20 L 210,20 M 200,10 L 195,15 M 200,10 L 205,15"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />

        <motion.path
          d="M 120,110 C 130,90 150,90 160,110 C 170,130 150,140 200,140 C 250,140 230,130 240,110 C 250,90 270,90 280,110"
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>

      {/* Decorative center glowing light */}
      <motion.div
        variants={centerVariants}
        initial="hidden"
        animate="visible"
        className="absolute w-24 h-24 bg-gold-500/10 rounded-full blur-xl pointer-events-none"
      />
    </div>
  );
}
