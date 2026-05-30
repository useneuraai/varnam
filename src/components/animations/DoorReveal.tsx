"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import FloatingFlowers from "./FloatingFlowers";

interface DoorRevealProps {
  brideName: string;
  groomName: string;
  templateSlug: string;
  onOpen: () => void;
}

export default function DoorReveal({ brideName, groomName, templateSlug, onOpen }: DoorRevealProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    // Trigger callback after animation completes
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  // Get theme styles based on template slug
  const getTheme = () => {
    switch (templateSlug) {
      case "temple-gold":
        return {
          doorBg: "bg-gradient-to-br from-[#2a0101] via-[#1a0000] to-[#0d0000]",
          goldBorder: "border-[#eed57c]/30",
          accentColor: "text-[#eed57c]",
          sealBg: "bg-gradient-to-r from-[#b3811b] via-[#eed57c] to-[#b3811b]",
          sealText: "text-black",
          badge: "ॐ",
          sub: "WITH THE BLESSINGS OF LORD GANESHA"
        };
      case "traditional-red":
        return {
          doorBg: "bg-gradient-to-br from-[#4a0404] via-[#2d0202] to-[#150000]",
          goldBorder: "border-[#e0b743]/30",
          accentColor: "text-[#eed57c]",
          sealBg: "bg-gradient-to-r from-[#e0b743] via-[#fff3cc] to-[#e0b743]",
          sealText: "text-black",
          badge: "❀",
          sub: "SHUBH VIVAH"
        };
      case "floral-luxury":
        return {
          doorBg: "bg-gradient-to-br from-[#1e1319] via-[#0f070b] to-[#050103]",
          goldBorder: "border-[#d4af37]/20",
          accentColor: "text-[#fbcfe8]",
          sealBg: "bg-gradient-to-r from-[#fbcfe8] via-[#ffffff] to-[#fbcfe8]",
          sealText: "text-[#831843]",
          badge: "🌸",
          sub: "ELEGANT CELEBRATION"
        };
      case "modern-minimal":
        return {
          doorBg: "bg-gradient-to-br from-[#faf8f5] via-[#f5f2eb] to-[#e8e4d9]",
          goldBorder: "border-[#1c1a17]/10",
          accentColor: "text-[#1c1a17]",
          sealBg: "bg-gradient-to-r from-[#1c1a17] via-[#6b6660] to-[#1c1a17]",
          sealText: "text-white",
          badge: "⚪",
          sub: "THE WEDDING INVITATION"
        };
      case "royal-heritage":
        return {
          doorBg: "bg-gradient-to-br from-[#06241a] via-[#02130d] to-[#000503]",
          goldBorder: "border-[#d4af37]/40",
          accentColor: "text-[#d4af37]",
          sealBg: "bg-gradient-to-r from-[#b3811b] via-[#eed57c] to-[#b3811b]",
          sealText: "text-black",
          badge: "👑",
          sub: "ROYAL WEDDING PROCLAMATION"
        };
      case "royal-tamil":
        return {
          doorBg: "bg-gradient-to-br from-[#3d0202] via-[#240101] to-[#120000]",
          goldBorder: "border-[#d4af37]/30",
          accentColor: "text-[#d4af37]",
          sealBg: "bg-gradient-to-r from-[#b3811b] via-[#eed57c] to-[#b3811b]",
          sealText: "text-black",
          badge: "ॐ",
          sub: "SHUBH VIVAH"
        };
      case "elegant-muslim":
        return {
          doorBg: "bg-gradient-to-br from-[#031d14] via-[#01110b] to-[#000805]",
          goldBorder: "border-[#d9b658]/30",
          accentColor: "text-[#d9b658]",
          sealBg: "bg-gradient-to-r from-[#d9b658] via-[#f7e2c9] to-[#d9b658]",
          sealText: "text-black",
          badge: "﷽",
          sub: "NIKAAH CEREMONY"
        };
      case "modern-christian":
        return {
          doorBg: "bg-gradient-to-br from-[#fbf8f3] via-[#f2ece0] to-[#e5dbcb]",
          goldBorder: "border-[#b39566]/20",
          accentColor: "text-[#8c6d3d]",
          sealBg: "bg-gradient-to-r from-[#8c6d3d] via-[#d6c8a8] to-[#8c6d3d]",
          sealText: "text-white",
          badge: "✝",
          sub: "HOLY MATRIMONY"
        };
      case "luxury-floral":
      default:
        return {
          doorBg: "bg-gradient-to-br from-[#0c0c0d] via-[#060607] to-[#010101]",
          goldBorder: "border-[#c2a353]/30",
          accentColor: "text-[#c2a353]",
          sealBg: "bg-gradient-to-r from-[#c2a353] via-[#f8e0a6] to-[#c2a353]",
          sealText: "text-black",
          badge: "❤",
          sub: "WEDDING CELEBRATION"
        };
    }
  };

  const theme = getTheme();
  
  // Initials (e.g. A & K)
  const initials = `${brideName?.charAt(0) || "B"}&${groomName?.charAt(0) || "G"}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none flex">
      {/* Theme-specific particles before opening */}
      {!isOpening && (
        <>
          {templateSlug === "temple-gold" && <FloatingFlowers type="sparkle" count={25} />}
          {templateSlug === "traditional-red" && <FloatingFlowers type="jasmine" count={20} />}
          {templateSlug === "floral-luxury" && <FloatingFlowers type="rose" count={20} />}
          {templateSlug === "royal-heritage" && <FloatingFlowers type="gold" count={20} />}
        </>
      )}

      {/* Left Door Panel */}
      <motion.div
        initial={{ x: 0 }}
        animate={isOpening ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        className={`w-1/2 h-full ${theme.doorBg} border-r border-gold-500/20 flex items-center justify-end relative`}
      >
        {/* Left Ornate Panels */}
        <div className={`absolute top-8 left-8 bottom-8 right-4 border ${theme.goldBorder} flex flex-col justify-between p-6 pointer-events-none`}>
          <div className={`w-8 h-8 border-t-2 border-l-2 ${theme.accentColor} opacity-60`} />
          <div className={`w-8 h-8 border-b-2 border-l-2 ${theme.accentColor} opacity-60`} />
        </div>
      </motion.div>

      {/* Right Door Panel */}
      <motion.div
        initial={{ x: 0 }}
        animate={isOpening ? { x: "100%" } : { x: 0 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        className={`w-1/2 h-full ${theme.doorBg} border-l border-gold-500/20 flex items-center justify-start relative`}
      >
        {/* Right Ornate Panels */}
        <div className={`absolute top-8 right-8 bottom-8 left-4 border ${theme.goldBorder} flex flex-col justify-between p-6 pointer-events-none`}>
          <div className={`w-8 h-8 border-t-2 border-r-2 ${theme.accentColor} opacity-60`} />
          <div className={`w-8 h-8 border-b-2 border-r-2 ${theme.accentColor} opacity-60`} />
        </div>
      </motion.div>

      {/* Floating Center Wax Seal & Invitation Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full px-6 text-center">
        <motion.div
          animate={isOpening ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full max-w-[90%] sm:max-w-md"
        >
          {/* Ornate Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-8 w-full"
          >
            <span className={`font-montserrat text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] ${theme.accentColor} font-semibold uppercase block mb-1 break-words px-2`}>
              {theme.sub}
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gold-300/40">
              <span className="w-8 h-[1px] bg-gold-600/20" />
              <Sparkles className="w-3.5 h-3.5" />
              <span className="w-8 h-[1px] bg-gold-600/20" />
            </div>
          </motion.div>
 
          {/* Couple Names */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className={`font-cinzel door-couple-names text-lg sm:text-2xl md:text-3xl tracking-wider sm:tracking-widest text-center ${theme.accentColor} mb-8 uppercase font-bold break-words w-full px-4`}
          >
            {brideName} <br />
            <span className="font-great-vibes text-lg sm:text-xl lowercase block my-1">and</span>
            {groomName}
          </motion.h2>
 
          {/* Interactive Wax Seal */}
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${theme.sealBg} ${theme.sealText} shadow-[0_0_30px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center border-4 border-black/10 cursor-pointer relative group`}
          >
            <div className="absolute inset-2 border border-black/10 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
            <span className="text-xl sm:text-2xl font-bold font-cinzel leading-none">{theme.badge}</span>
            <span className="font-montserrat text-[7px] sm:text-[8px] font-extrabold tracking-widest uppercase mt-0.5 sm:mt-1">OPEN</span>
          </motion.button>
 
          {/* Floating Instructions */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`font-serif text-[9px] sm:text-[10px] italic tracking-wider mt-4 ${theme.accentColor} opacity-70`}
          >
            Tap seal to open invitation
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
