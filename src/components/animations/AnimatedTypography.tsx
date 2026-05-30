"use client";

import { motion, Variants } from "framer-motion";

interface AnimatedTypographyProps {
  text: string;
  className?: string;
  variant?: "title" | "subtitle" | "cursive" | "fade";
  delay?: number;
}

export default function AnimatedTypography({
  text,
  className = "",
  variant = "title",
  delay = 0,
}: AnimatedTypographyProps) {
  if (variant === "title") {
    // Split into characters and animate each
    const letters = Array.from(text);
    
    const container: Variants = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: delay * i },
      }),
    };

    const child: Variants = {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 100,
        },
      },
    };

    return (
      <motion.h1
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        variants={container}
        initial="hidden"
        animate="visible"
        className={`font-cinzel tracking-widest text-gold-400 select-none ${className}`}
      >
        {letters.map((letter, index) => (
          <motion.span
            variants={child}
            key={index}
            style={{ display: "inline-block", marginRight: letter === " " ? "0.5em" : "0" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>
    );
  }

  if (variant === "cursive") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: delay,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
        className={`font-great-vibes text-gold-200 ${className}`}
      >
        {text}
      </motion.p>
    );
  }

  if (variant === "subtitle") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          delay: delay,
          ease: "easeOut",
        }}
        className={`font-montserrat uppercase tracking-widest text-foreground/80 ${className}`}
      >
        {text}
      </motion.p>
    );
  }

  // Fallback 'fade'
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
