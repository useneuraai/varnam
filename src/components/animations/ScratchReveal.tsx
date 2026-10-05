"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";

interface ScratchRevealProps {
  dateString: string;
  theme?: "dark" | "light" | "gold" | "rose" | "minimal";
  className?: string;
}

export default function ScratchReveal({
  dateString,
  theme = "gold",
  className = "",
}: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratchedOff, setIsScratchedOff] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Format dateString into human-friendly format
  const formattedDate = (() => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 340;
      const height = rect?.height || 130;
      canvas.width = width;
      canvas.height = height;
      drawFoil(width, height);
    };

    const drawFoil = (width: number, height: number) => {
      if (!ctx) return;
      ctx.save();

      // Theme-based gradient foil
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (theme === "rose") {
        grad.addColorStop(0, "#8a4b56");
        grad.addColorStop(0.3, "#d68b99");
        grad.addColorStop(0.5, "#fad2da");
        grad.addColorStop(0.7, "#d68b99");
        grad.addColorStop(1, "#8a4b56");
      } else if (theme === "minimal") {
        grad.addColorStop(0, "#27272a");
        grad.addColorStop(0.5, "#52525b");
        grad.addColorStop(1, "#27272a");
      } else if (theme === "light") {
        grad.addColorStop(0, "#d9822b");
        grad.addColorStop(0.3, "#f39c12");
        grad.addColorStop(0.5, "#fed330");
        grad.addColorStop(0.7, "#f39c12");
        grad.addColorStop(1, "#d9822b");
      } else {
        // Gold Luxury
        grad.addColorStop(0, "#7a5214");
        grad.addColorStop(0.25, "#c59b27");
        grad.addColorStop(0.5, "#ffea9f");
        grad.addColorStop(0.75, "#c59b27");
        grad.addColorStop(1, "#7a5214");
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Foil border frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, 6, width - 12, height - 12);

      // Center text
      ctx.fillStyle = theme === "minimal" ? "#ffffff" : "#1a1005";
      ctx.font = "bold 11px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦ SCRATCH TO REVEAL DATE ✦", width / 2, height / 2 - 8);

      ctx.font = "9px Montserrat, sans-serif";
      ctx.fillStyle = theme === "minimal" ? "#a1a1aa" : "#4a320f";
      ctx.fillText("Touch & swipe or use mouse", width / 2, height / 2 + 14);

      ctx.restore();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const percentage = (transparentPixels / (pixels.length / 4)) * 100;
      if (percentage > 40) {
        setIsScratchedOff(true);
      }
    } catch (e) {
      console.error("Error reading canvas image data:", e);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    scratch(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    checkScratchPercentage();
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  return (
    <div className={`flex flex-col items-center my-6 ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full max-w-[360px] h-[130px] rounded-2xl overflow-hidden border border-[#eed57c]/40 shadow-2xl bg-black/80 flex items-center justify-center select-none"
      >
        {/* Underlying revealed wedding date */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none bg-gradient-to-b from-black/80 via-black/90 to-black">
          <div className="flex items-center gap-1.5 text-[#eed57c] mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-montserrat text-[10px] tracking-[0.25em] uppercase font-bold">
              Wedding Ceremony Date
            </span>
          </div>
          <p className="font-serif text-sm sm:text-base text-white tracking-wide font-bold max-w-[90%] leading-snug">
            {formattedDate}
          </p>
          <span className="text-[9px] text-[#eed57c]/70 tracking-widest uppercase mt-1">
            ✨ Auspicious Muhurtham ✨
          </span>
        </div>

        {/* Canvas scratch layer */}
        <AnimatePresence>
          {!isScratchedOff && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4 } }}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={scratch}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={scratch}
              className="absolute inset-0 z-10 cursor-pointer block touch-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Quick reveal button */}
      {!isScratchedOff && (
        <button
          type="button"
          onClick={() => setIsScratchedOff(true)}
          className="mt-2.5 text-[10px] uppercase tracking-[0.2em] text-[#eed57c]/80 hover:text-[#eed57c] font-bold underline transition-colors cursor-pointer"
        >
          Click to reveal date instantly
        </button>
      )}
    </div>
  );
}
