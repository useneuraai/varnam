"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface WeddingDateInfo {
  day: number | string;
  month: string;
  year: number | string;
  weekday?: string;
  time?: string;
}

export interface GoldenWaxSealCardProps {
  weddingDateInfo: WeddingDateInfo;
  venueName?: string;
  templateType?: string;
  isScratched: boolean;
  setIsScratched: (scratched: boolean) => void;
  title?: string;
  className?: string;
}

interface WaxParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: "dust" | "flake";
}

export default function GoldenWaxSealCard({
  weddingDateInfo,
  venueName,
  templateType = "classic",
  isScratched,
  setIsScratched,
  title = "Save the Date",
  className = "",
}: GoldenWaxSealCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const hasTriggeredReveal = useRef(false);
  const particlesRef = useRef<WaxParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const sealImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Seal dimensions (circular 175px on mobile, 185px on sm+)
  const SEAL_SIZE = 180;

  // --------------------------------------------------------------------------
  // 1. PARTICLES ENGINE: Champagne Gold Dust & Subtle Wax Flakes
  // --------------------------------------------------------------------------
  const spawnParticles = useCallback((x: number, y: number, count: number, isBurst = false) => {
    const goldPalette = ["#f5e6a3", "#eed57c", "#d4af37", "#c59b27", "#b38827", "#e8c872"];
    const waxPalette = ["#aa7d1e", "#c59b27", "#8c5f18", "#d4af37"];

    for (let i = 0; i < count; i++) {
      const angle = isBurst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI * 2;
      const speed = isBurst ? 1.5 + Math.random() * 4.5 : 0.8 + Math.random() * 2.2;
      const isFlake = Math.random() > 0.65;

      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isBurst ? 1.8 : 0.4),
        size: isFlake ? 3 + Math.random() * 3.5 : 1.5 + Math.random() * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 0.95,
        color: isFlake
          ? waxPalette[Math.floor(Math.random() * waxPalette.length)]
          : goldPalette[Math.floor(Math.random() * goldPalette.length)],
        type: isFlake ? "flake" : "dust",
      });
    }

    if (!animFrameRef.current) {
      animateParticles();
    }
  }, []);

  const animateParticles = useCallback(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const active: WaxParticle[] = [];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gentle gravity
      p.vx *= 0.97;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.type === "flake" ? 0.016 : 0.022;

      if (p.opacity > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "dust") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Angular wax flake
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(-p.size, -p.size * 0.7);
          ctx.lineTo(p.size * 0.8, -p.size * 0.5);
          ctx.lineTo(p.size, p.size * 0.8);
          ctx.lineTo(-p.size * 0.6, p.size);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
        active.push(p);
      }
    }

    particlesRef.current = active;

    if (active.length > 0) {
      animFrameRef.current = requestAnimationFrame(animateParticles);
    } else {
      animFrameRef.current = null;
    }
  }, []);

  // --------------------------------------------------------------------------
  // 2. SEAL CANVAS INITIALIZATION: Render Golden Wax Seal Image
  // --------------------------------------------------------------------------
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = SEAL_SIZE * dpr;
    canvas.height = SEAL_SIZE * dpr;
    ctx.scale(dpr, dpr);

    // If seal image is loaded, draw it crisply
    if (sealImageRef.current && sealImageRef.current.complete) {
      ctx.clearRect(0, 0, SEAL_SIZE, SEAL_SIZE);
      ctx.drawImage(sealImageRef.current, 0, 0, SEAL_SIZE, SEAL_SIZE);
    } else {
      // Fallback embossed gold disc while image loads
      const grad = ctx.createRadialGradient(
        SEAL_SIZE * 0.45,
        SEAL_SIZE * 0.42,
        10,
        SEAL_SIZE * 0.5,
        SEAL_SIZE * 0.5,
        SEAL_SIZE * 0.5
      );
      grad.addColorStop(0, "#f8e28f");
      grad.addColorStop(0.35, "#d4af37");
      grad.addColorStop(0.7, "#aa7d1e");
      grad.addColorStop(1, "#7d550c");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(SEAL_SIZE / 2, SEAL_SIZE / 2, SEAL_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [SEAL_SIZE]);

  // Preload wax seal image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/golden-wax-seal.png";
    img.onload = () => {
      sealImageRef.current = img;
      setImageLoaded(true);
      if (!isScratched) {
        initCanvas();
      }
    };
    img.onerror = () => {
      // If png fails, try webp
      img.src = "/images/golden-wax-seal.webp";
    };
  }, [initCanvas, isScratched]);

  // Particle canvas setup
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    canvas.width = 360;
    canvas.height = 360;
  }, []);

  // --------------------------------------------------------------------------
  // 3. SCRATCH INTERACTION & THRESHOLD CHECKING
  // --------------------------------------------------------------------------
  const checkRevealThreshold = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredReveal.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentCount = 0;
      let totalSampled = 0;

      // Sample a circular region inside the seal
      const radius = (canvas.width / 2) * 0.85;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Step by 16 pixels for fast, smooth sampling
      const step = Math.round(16 * dpr);
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy <= radius * radius) {
            totalSampled++;
            const alphaIndex = (y * canvas.width + x) * 4 + 3;
            if (data[alphaIndex] < 60) {
              transparentCount++;
            }
          }
        }
      }

      const ratio = totalSampled > 0 ? transparentCount / totalSampled : 0;

      // Threshold: 18% erased triggers complete elegant dissolution
      if (ratio > 0.18 && !hasTriggeredReveal.current) {
        hasTriggeredReveal.current = true;
        setIsScratched(true);
        // Gentle burst of gold dust from center
        spawnParticles(180, 180, 36, true);
      }
    } catch {
      // ignore
    }
  }, [setIsScratched, spawnParticles]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number, isInitial = false) => {
      const canvas = canvasRef.current;
      if (!canvas || hasTriggeredReveal.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 38 * dpr;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (isInitial || !lastPoint.current) {
        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, 20 * dpr, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x * dpr, lastPoint.current.y * dpr);
        ctx.lineTo(x * dpr, y * dpr);
        ctx.stroke();
      }

      ctx.restore();
      lastPoint.current = { x, y };

      // Spawn 2-3 delicate wax flakes/dust at the particle canvas coordinates
      const pCanvas = particleCanvasRef.current;
      if (pCanvas) {
        const pRect = pCanvas.getBoundingClientRect();
        const px = clientX - pRect.left;
        const py = clientY - pRect.top;
        spawnParticles(px, py, 2);
      }

      checkRevealThreshold();
    },
    [checkRevealThreshold, spawnParticles]
  );

  // Direct click / tap reveal handler
  const handleSealClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasTriggeredReveal.current) return;
      // Single click performs a scratch hole and progresses reveal
      scratchAt(e.clientX, e.clientY, true);
    },
    [scratchAt]
  );

  // If externally marked as scratched
  useEffect(() => {
    if (isScratched && !hasTriggeredReveal.current) {
      hasTriggeredReveal.current = true;
      spawnParticles(180, 180, 36, true);
    }
  }, [isScratched, spawnParticles]);

  return (
    <div
      ref={containerRef}
      className={`relative w-[92%] max-w-[340px] sm:max-w-[365px] my-auto py-7 px-5 sm:px-6 rounded-2xl sm:rounded-3xl bg-[#fdfbf7]/94 sm:bg-[#faf6ee]/92 backdrop-blur-md border border-[#d4af37]/55 shadow-[0_20px_50px_rgba(20,10,3,0.22)] flex flex-col items-center select-none text-center ${className}`}
    >
      {/* Real Royal Gold Corner Flourishes on Ivory Card */}
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
      {/* 1. ELEGANT HEADINGS: Clean, Non-Competing Hierarchy                  */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-4"
      >
        <img
          src="/images/elements/gold_flower_bloom.webp"
          alt="Gold Flower"
          className="w-8 h-8 object-contain mb-1 drop-shadow-sm pointer-events-none select-none"
        />
        <span className="font-cinzel text-[9.5px] sm:text-[10px] tracking-[0.28em] text-[#9a6a24] uppercase font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
          ✦ A MOMENT TO REMEMBER ✦
        </span>
        <h2 className="font-cinzel text-2xl sm:text-[26px] font-bold text-[#240e02] tracking-[0.14em] uppercase mt-1 leading-tight">
          Save the Date
        </h2>
        <p className="font-cormorant italic text-sm sm:text-[15px] text-[#6f4b23] mt-0.5">
          A beautiful beginning awaits
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 text-[#b38827]">
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#b38827] to-transparent" />
          <span className="text-[8px]">❖</span>
          <div className="w-10 h-[1px] bg-gradient-to-l from-transparent via-[#b38827] to-transparent" />
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* 2. CENTRAL INTERACTIVE AREA: Ivory Parchment Underneath + Wax Seal On Top */}
      {/* ===================================================================== */}
      <div className="relative flex flex-col items-center justify-center my-1">
        {/* Subtle Label Above Seal */}
        <span className="font-cinzel text-[9px] tracking-[0.26em] text-[#936625] uppercase font-bold mb-2">
          {isScratched ? "THE WEDDING DAY" : "OUR SPECIAL DATE"}
        </span>

        {/* 180x180 Box Housing Date & Wax Seal */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: `${SEAL_SIZE}px`, height: `${SEAL_SIZE}px` }}
        >
          {/* UNDERNEATH LAYER: The Hidden Wedding Date on Warm Ivory Parchment */}
          <div className="absolute inset-0 rounded-full bg-[#fcfaf5] border border-[#d4af37]/45 shadow-[inset_0_2px_8px_rgba(30,15,4,0.08)] flex flex-col items-center justify-center text-center p-3 select-none">
            {/* Grand Auspicious Day Number */}
            <div className="font-cormorant text-5xl sm:text-6xl font-bold leading-none text-[#240e02] tracking-tight my-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
              {weddingDateInfo.day}
            </div>

            {/* Auspicious Month & Year */}
            <div className="font-cinzel text-xs sm:text-[13px] tracking-[0.22em] font-bold text-[#8c6227] uppercase mt-1 leading-tight">
              {weddingDateInfo.month} {weddingDateInfo.year}
            </div>

            {/* Weekday / Time if available */}
            {weddingDateInfo.weekday && (
              <div className="font-marcellus text-[9px] sm:text-[9.5px] tracking-[0.16em] text-[#633a17] uppercase mt-1">
                {weddingDateInfo.weekday}
                {weddingDateInfo.time ? ` · ${weddingDateInfo.time}` : ""}
              </div>
            )}

            {/* Filigree Ornament */}
            <div className="text-[8px] text-[#b38827] mt-1.5 opacity-80">❖</div>
          </div>

          {/* TOP LAYER: Golden Wax Seal Canvas (Scratches to reveal, then dissolves) */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: isScratched ? 0 : 1,
              scale: isScratched ? 1.08 : 1,
              filter: isScratched ? "blur(3px)" : "blur(0px)",
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 z-10 flex items-center justify-center ${
              isScratched ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: `${SEAL_SIZE}px`,
                height: `${SEAL_SIZE}px`,
                touchAction: "none",
              }}
              onClick={handleSealClick}
              onMouseDown={(e) => {
                isDrawing.current = true;
                lastPoint.current = null;
                scratchAt(e.clientX, e.clientY, true);
              }}
              onMouseUp={() => {
                isDrawing.current = false;
                lastPoint.current = null;
              }}
              onMouseLeave={() => {
                isDrawing.current = false;
                lastPoint.current = null;
              }}
              onMouseMove={(e) => {
                if (isDrawing.current) scratchAt(e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                isDrawing.current = true;
                lastPoint.current = null;
                if (e.touches[0]) scratchAt(e.touches[0].clientX, e.touches[0].clientY, true);
              }}
              onTouchEnd={() => {
                isDrawing.current = false;
                lastPoint.current = null;
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) scratchAt(e.touches[0].clientX, e.touches[0].clientY);
              }}
              className="cursor-pointer filter drop-shadow-[0_8px_20px_rgba(30,15,4,0.32)] transition-transform duration-200 active:scale-[0.98]"
            />
          </motion.div>

          {/* Particle Canvas for Falling Wax Flakes & Gold Dust */}
          <canvas
            ref={particleCanvasRef}
            className="absolute -inset-16 w-[calc(100%+128px)] h-[calc(100%+128px)] pointer-events-none z-20"
          />
        </div>

        {/* ===================================================================== */}
        {/* 3. INSTRUCTION / COMPLETION MESSAGE: Restrained & Premium            */}
        {/* ===================================================================== */}
        <div className="relative mt-3 min-h-[36px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isScratched ? (
              <motion.div
                key="scratch-prompt"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-1.5 text-[#936625] text-[9.5px] sm:text-[10px] font-cinzel font-semibold tracking-[0.2em] uppercase"
              >
                <Sparkles className="w-3 h-3 text-[#b38827] animate-pulse" />
                <span>Gently scratch the seal to reveal</span>
              </motion.div>
            ) : (
              <motion.div
                key="revealed-message"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <span className="font-cormorant italic text-[15px] sm:text-base text-[#4a2609] font-medium leading-tight">
                  A date worth waiting for
                </span>
                <span className="font-cinzel text-[8.5px] sm:text-[9px] tracking-[0.24em] text-[#936625] uppercase font-bold mt-0.5">
                  ✦ We can&apos;t wait to celebrate with you ✦
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Alias exports for backward compatibility across all templates
export { GoldenWaxSealCard as ScratchHeartCard };
