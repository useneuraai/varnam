"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface PhotoSlideshowProps {
  imagesString?: string;
  theme?: "dark" | "light" | "gold" | "rose" | "minimal";
  className?: string;
}

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
];

export default function PhotoSlideshow({
  imagesString,
  theme = "gold",
  className = "",
}: PhotoSlideshowProps) {
  const [images, setImages] = useState<string[]>(DEFAULT_FALLBACK_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!imagesString) {
      setImages(DEFAULT_FALLBACK_IMAGES);
      return;
    }

    const parsed = imagesString
      .split(/,(?=\s*(?:https?:|data:))/i)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (parsed.length > 0) {
      setImages(parsed);
      setCurrentIndex(0);
    } else {
      setImages(DEFAULT_FALLBACK_IMAGES);
    }
  }, [imagesString]);

  // Auto-play interval
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const borderColor =
    theme === "rose"
      ? "border-[#d68b99]/40"
      : theme === "light"
      ? "border-[#f7b731]/50"
      : theme === "minimal"
      ? "border-zinc-300"
      : "border-[#eed57c]/40";

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto my-6 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer frame */}
      <div
        className={`relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border-2 ${borderColor} shadow-2xl bg-zinc-950`}
      >
        {/* Images with crossfade animation */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Wedding Celebration Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Subtle dark gradient overlay at bottom for controls */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Left Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-7 bg-[#eed57c] shadow-[0_0_8px_#eed57c]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter label top-right */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white tracking-widest uppercase">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
