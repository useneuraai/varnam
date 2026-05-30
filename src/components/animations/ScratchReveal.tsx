"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScratchRevealProps {
  dateString: string;
}

export default function ScratchReveal({ dateString }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratchedOff, setIsScratchedOff] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions based on parent container
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      canvas.width = rect?.width || 320;
      canvas.height = rect?.height || 120;
      drawFoil();
    };

    const drawFoil = () => {
      if (!ctx || !canvas) return;
      ctx.save();
      
      // Draw luxury gold gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#8f6018");
      grad.addColorStop(0.3, "#d4a325");
      grad.addColorStop(0.5, "#eed57c");
      grad.addColorStop(0.7, "#d4a325");
      grad.addColorStop(1, "#8f6018");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a gold border frame
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      // Add text label
      ctx.fillStyle = "#080708";
      ctx.font = "bold 11px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "2px";
      ctx.fillText("SCRATCH TO REVEAL DATE", canvas.width / 2, canvas.height / 2);
      
      ctx.restore();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Helper to calculate how much of the foil has been scratched
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
      if (percentage > 45) {
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
    
    // Check if touch event
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
    e.preventDefault();
    setIsDrawing(true);
    scratch(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    checkScratchPercentage();
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.save();
    // Erase the drawing path
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-[320px] h-[100px] border border-gold-600/20 bg-black/60 flex items-center justify-center select-none"
    >
      {/* Underlying wedding date (revealed) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
        <span className="font-montserrat text-[10px] tracking-widest text-gold-400 uppercase font-bold mb-1">
          Wedding Ceremony Date
        </span>
        <p className="font-cinzel text-base md:text-lg text-foreground tracking-wide font-bold">
          {dateString}
        </p>
      </div>

      {/* Canvas scratch layer */}
      <AnimatePresence>
        {!isScratchedOff && (
          <motion.canvas
            ref={canvasRef}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
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
  );
}
