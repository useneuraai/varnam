"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import FloatingFlowers from "./FloatingFlowers";

export interface CardTheme {
  name: string;
  heroImage: string;
  badge: string;
  sub: string;
  accentColor: string;
  goldBorder: string;
  sealBg: string;
  sealText: string;
  particleType: "jasmine" | "rose" | "gold" | "sparkle" | "marigold";
  backdropBg: string;
}

export const getCardTheme = (templateSlug: string, customBg?: string): CardTheme => {
  // Normalize slug
  const slug = templateSlug.toLowerCase().trim();

  let baseTheme: CardTheme;

  switch (slug) {
    case "mayura-classic":
    case "peacock-classic":
      baseTheme = {
        name: "Mayura Classic",
        heroImage: "/images/mayura-classic/hero_peacock_arch.jpg",
        badge: "🦚",
        sub: "SHUBH VIVAH · ROYAL PEACOCK INVITATION",
        accentColor: "text-[#eed57c]",
        goldBorder: "border-[#eed57c]/40",
        sealBg: "bg-gradient-to-br from-[#eed57c] via-[#b3811b] to-[#78510d]",
        sealText: "text-[#200207]",
        particleType: "gold",
        backdropBg: "from-[#08121e] via-[#04080e] to-black",
      };
      break;

    case "mayura-palace":
    case "palace-garden":
    case "royal-garden":
    case "mayura-mandapam":
      baseTheme = {
        name: "Palace Garden",
        heroImage: "/images/mayura-palace/hero_peacock_arch.jpg",
        badge: "👑",
        sub: "ROYAL PALACE GARDEN INVITATION",
        accentColor: "text-[#f7e5a9]",
        goldBorder: "border-[#e5c158]/40",
        sealBg: "bg-gradient-to-br from-[#f7e5a9] via-[#c49a31] to-[#73530c]",
        sealText: "text-[#0e2238]",
        particleType: "sparkle",
        backdropBg: "from-[#091b2c] via-[#050e18] to-black",
      };
      break;

    case "kamalam-kalyanam":
    case "crimson-red":
    case "kamalam":
    case "padmam":
    case "padma-kalyanam":
    case "radha-krishna":
      baseTheme = {
        name: "Crimson Red",
        heroImage: "/images/kamalam-kalyanam/hero_lotus_arch.jpg",
        badge: "🪷",
        sub: "திருக்கல்யாண அழைப்பிதழ் · SACRED LOTUS",
        accentColor: "text-[#eed57c]",
        goldBorder: "border-[#d4af37]/45",
        sealBg: "bg-gradient-to-br from-[#eed57c] via-[#b3811b] to-[#78510d]",
        sealText: "text-[#2e0509]",
        particleType: "rose",
        backdropBg: "from-[#290308] via-[#120104] to-black",
      };
      break;

    case "theertha-mandapam":
    case "lotus-swans":
    case "manamagan":
    case "malligai-manam":
    case "jasmine-romance":
    case "floral-luxury":
    case "luxury-floral":
      baseTheme = {
        name: "Lotus & Swans",
        heroImage: "/images/theertha-mandapam/theertha_hero_v6.jpg",
        badge: "🦢",
        sub: "THEERTHA MANDAPAM · SACRED LOTUS & SWANS",
        accentColor: "text-[#e8d595]",
        goldBorder: "border-[#c9a84c]/40",
        sealBg: "bg-gradient-to-br from-[#e8d595] via-[#a88632] to-[#694f13]",
        sealText: "text-[#051c19]",
        particleType: "jasmine",
        backdropBg: "from-[#041a18] via-[#020d0c] to-black",
      };
      break;

    case "marigold-vizha":
    case "marigold-festive":
    case "thiruvizha":
    case "vizha":
    case "chettinad-rajamaligai":
    case "chettinad-vintage":
    case "royal-heritage":
      baseTheme = {
        name: "Marigold Festive",
        heroImage: "/images/marigold-vizha/marigold_hero_v7.jpg",
        badge: "🌼",
        sub: "கல்யாண வைபவம் · AUSPICIOUS FESTIVITY",
        accentColor: "text-[#fde68a]",
        goldBorder: "border-[#f59e0b]/40",
        sealBg: "bg-gradient-to-br from-[#fed330] via-[#fa8231] to-[#b33939]",
        sealText: "text-black",
        particleType: "marigold",
        backdropBg: "from-[#2b0c03] via-[#140501] to-black",
      };
      break;

    case "kadhal-editorial":
    case "classical-gold":
    case "kadhal":
    case "thanjavur-heritage":
    case "modern-tamil-minimal":
    case "gopuram":
    case "modern-minimal":
      baseTheme = {
        name: "Classical Gold",
        heroImage: "/images/kadhal-editorial/veena_hero_v6.jpg",
        badge: "🪕",
        sub: "இணையும் இரு இதயங்கள் · CLASSICAL VEENA",
        accentColor: "text-[#f0dec0]",
        goldBorder: "border-[#d4af37]/35",
        sealBg: "bg-gradient-to-br from-[#f0dec0] via-[#bfa268] to-[#6d572e]",
        sealText: "text-[#120f0c]",
        particleType: "sparkle",
        backdropBg: "from-[#171310] via-[#0b0907] to-black",
      };
      break;

    case "kovil-thirumanam":
    case "temple-heritage":
    case "mangalam":
    case "temple-grandeur":
    case "koyil":
    case "royal-tamil":
    case "temple-gold":
      baseTheme = {
        name: "Temple Heritage",
        heroImage: "/images/kovil/kovil_temple_entrance.jpg",
        badge: "🛕",
        sub: "திருக்கல்யாணம் · TEMPLE SANCTUM BLESSINGS",
        accentColor: "text-[#eed57c]",
        goldBorder: "border-[#e5a93c]/45",
        sealBg: "bg-gradient-to-br from-[#eed57c] via-[#b3811b] to-[#694208]",
        sealText: "text-[#1a0505]",
        particleType: "jasmine",
        backdropBg: "from-[#220707] via-[#100303] to-black",
      };
      break;

    case "kalyana-mandapam":
    case "royal-palace":
    case "traditional-red":
    case "elegant-muslim":
    case "modern-christian":
      baseTheme = {
        name: "Royal Palace",
        heroImage: "/images/kalyana-mandapam/mandapam_palace_entrance.jpg",
        badge: "🏛️",
        sub: "கல்யாண மண்டபம் · ROYAL PALACE MANDAPAM",
        accentColor: "text-[#f5d77f]",
        goldBorder: "border-[#e0b743]/40",
        sealBg: "bg-gradient-to-br from-[#f5d77f] via-[#c2982d] to-[#70520e]",
        sealText: "text-[#1f1005]",
        particleType: "gold",
        backdropBg: "from-[#1d0d04] via-[#0d0601] to-black",
      };
      break;

    case "konaseema-kalyanam":
    case "heritage-courtyard":
      baseTheme = {
        name: "Heritage Courtyard",
        heroImage: "/images/konaseema/konaseema_door_hero.jpg",
        badge: "❖",
        sub: "HERITAGE COURTYARD INVITATION",
        accentColor: "text-[#eed57c]",
        goldBorder: "border-[#d4af37]/40",
        sealBg: "bg-gradient-to-br from-[#eed57c] via-[#b3811b] to-[#78510d]",
        sealText: "text-[#140f08]",
        particleType: "gold",
        backdropBg: "from-[#1a140b] via-[#0c0905] to-black",
      };
      break;

    default:
      baseTheme = {
        name: "Sacred Wedding",
        heroImage: "/images/kamalam-kalyanam/hero_lotus_arch.jpg",
        badge: "ॐ",
        sub: "THE SACRED WEDDING INVITATION",
        accentColor: "text-[#eed57c]",
        goldBorder: "border-[#eed57c]/40",
        sealBg: "bg-gradient-to-br from-[#eed57c] via-[#b3811b] to-[#78510d]",
        sealText: "text-[#200207]",
        particleType: "gold",
        backdropBg: "from-[#140205] via-[#080103] to-black",
      };
      break;
  }

  // If a custom hero background image was provided, use it
  if (customBg && customBg.trim().length > 0) {
    baseTheme.heroImage = customBg;
  }

  return baseTheme;
};

interface DoorRevealProps {
  brideName?: string;
  groomName?: string;
  templateSlug: string;
  bgImageUrl?: string;
  onOpen: () => void;
}

export default function DoorReveal({
  brideName = "Sriya",
  groomName = "Karthik",
  templateSlug,
  bgImageUrl,
  onOpen,
}: DoorRevealProps) {
  const [isOpening, setIsOpening] = useState(false);

  const theme = getCardTheme(templateSlug, bgImageUrl);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Smooth transition: fire callback once card doors swing open
    setTimeout(() => {
      onOpen();
    }, 1250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none flex items-center justify-center bg-gradient-to-b ${theme.backdropBg} transition-opacity duration-700 ${
        isOpening ? "pointer-events-none" : ""
      }`}
    >
      {/* Subtle Ambient Vignette & Backing Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90 pointer-events-none" />

      {/* Floating ceremonial particles */}
      {!isOpening && <FloatingFlowers type={theme.particleType} count={28} />}

      {/* Main 3D Card Stage / Viewport Frame */}
      <div
        className="relative w-full max-w-[460px] h-[92vh] max-h-[820px] aspect-[9/16] flex items-center justify-center shadow-[0_30px_100px_rgba(0,0,0,0.95)]"
        style={{ perspective: "1500px" }}
      >
        {/* Interior Reveal Glow (gently visible as doors swing open) */}
        <div className="absolute inset-0 bg-[#0d0705] border border-gold-500/20 rounded-none overflow-hidden flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-gold-500/10 blur-3xl animate-pulse" />
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold-400/40 uppercase">
            Entering Celebration...
          </span>
        </div>

        {/* ================================================================= */}
        {/* LEFT CARD DOOR (Left 50% of the Hero Section Card)               */}
        {/* ================================================================= */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={
            isOpening
              ? { rotateY: -110, x: "-6%", opacity: 0 }
              : { rotateY: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          className="absolute top-0 left-0 w-1/2 h-full overflow-hidden shadow-[inset_-8px_0_20px_rgba(0,0,0,0.65)] border-r border-gold-400/40 cursor-pointer"
          onClick={handleOpen}
        >
          {/* Hero background image - Left 50% */}
          <div
            className="absolute top-0 left-0 w-[200%] h-full bg-cover bg-center pointer-events-none transition-transform duration-700"
            style={{
              backgroundImage: `url(${theme.heroImage})`,
              filter: "brightness(0.92) contrast(1.05)",
            }}
          />

          {/* Left Door Foil Accent & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-black/45 pointer-events-none" />

          {/* Left Door Ornate Inset Border */}
          <div className="absolute top-4 left-4 bottom-4 right-2 border-t border-l border-b border-gold-400/35 pointer-events-none flex flex-col justify-between p-3">
            <div className={`w-5 h-5 border-t-2 border-l-2 ${theme.accentColor} opacity-75`} />
            <div className={`w-5 h-5 border-b-2 border-l-2 ${theme.accentColor} opacity-75`} />
          </div>

          {/* Left Center Seam Gold Trim */}
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#eed57c] to-transparent pointer-events-none opacity-80" />
        </motion.div>

        {/* ================================================================= */}
        {/* RIGHT CARD DOOR (Right 50% of the Hero Section Card)             */}
        {/* ================================================================= */}
        <motion.div
          initial={{ rotateY: 0, x: 0 }}
          animate={
            isOpening
              ? { rotateY: 110, x: "6%", opacity: 0 }
              : { rotateY: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
          className="absolute top-0 right-0 w-1/2 h-full overflow-hidden shadow-[inset_8px_0_20px_rgba(0,0,0,0.65)] border-l border-gold-400/40 cursor-pointer"
          onClick={handleOpen}
        >
          {/* Hero background image - Right 50% */}
          <div
            className="absolute top-0 right-0 w-[200%] h-full bg-cover bg-center pointer-events-none transition-transform duration-700"
            style={{
              backgroundImage: `url(${theme.heroImage})`,
              filter: "brightness(0.92) contrast(1.05)",
            }}
          />

          {/* Right Door Foil Accent & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/15 to-black/45 pointer-events-none" />

          {/* Right Door Ornate Inset Border */}
          <div className="absolute top-4 right-4 bottom-4 left-2 border-t border-r border-b border-gold-400/35 pointer-events-none flex flex-col justify-between p-3">
            <div className={`w-5 h-5 border-t-2 border-r-2 ${theme.accentColor} opacity-75`} />
            <div className={`w-5 h-5 border-b-2 border-r-2 ${theme.accentColor} opacity-75`} />
          </div>

          {/* Right Center Seam Gold Trim */}
          <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#eed57c] to-transparent pointer-events-none opacity-80" />
        </motion.div>

        {/* ================================================================= */}
        {/* CENTER WAX SEAL & INVITATION CALLOUTS                             */}
        {/* ================================================================= */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 w-full px-5 pointer-events-none">
          <motion.div
            animate={
              isOpening
                ? { opacity: 0, scale: 0.65, y: -10 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center w-full max-w-sm text-center"
          >
            {/* Auspicious Sacred Sub-Header */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="text-center mb-6 w-full px-3"
            >
              <span
                className={`font-montserrat text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] ${theme.accentColor} font-bold uppercase block mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
              >
                {theme.sub}
              </span>
              <div className="flex items-center justify-center gap-2 text-xs text-gold-300/60">
                <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-gold-400/70" />
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-gold-400/70" />
              </div>
            </motion.div>

            {/* Couple Names */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="mb-8 w-full px-2"
            >
              <h2
                className={`font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wider sm:tracking-widest text-center ${theme.accentColor} font-bold uppercase drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)]`}
              >
                {brideName}
              </h2>
              <span className="font-great-vibes text-xl sm:text-2xl lowercase text-gold-200 block my-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                and
              </span>
              <h2
                className={`font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wider sm:tracking-widest text-center ${theme.accentColor} font-bold uppercase drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)]`}
              >
                {groomName}
              </h2>
            </motion.div>

            {/* Interactive Royal Wax Seal Button */}
            <motion.button
              id="card-open-seal-btn"
              onClick={handleOpen}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`pointer-events-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full ${theme.sealBg} ${theme.sealText} shadow-[0_0_40px_rgba(212,175,55,0.55),0_12px_24px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center border-4 border-amber-300/40 cursor-pointer relative group transition-transform duration-300`}
            >
              {/* Outer pulsing gold halo */}
              <span className="absolute -inset-2 rounded-full border border-gold-400/40 animate-ping opacity-40 pointer-events-none" />

              {/* Rotating inner dashed decorative ring */}
              <div className="absolute inset-2 border border-black/20 rounded-full border-dashed animate-[spin_35s_linear_infinite]" />

              {/* Insignia / Emblem */}
              <span className="text-2xl sm:text-3xl font-bold font-cinzel leading-none drop-shadow-sm select-none">
                {theme.badge}
              </span>

              {/* Tap to Open Action Label */}
              <span className="font-montserrat text-[8px] sm:text-[9px] font-extrabold tracking-[0.2em] uppercase mt-1 drop-shadow-sm">
                OPEN
              </span>
            </motion.button>

            {/* Hint & Instructions */}
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className={`font-serif text-[10px] sm:text-[11px] italic tracking-wider mt-5 ${theme.accentColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
            >
              Tap seal to unfold the invitation
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
