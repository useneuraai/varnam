"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoSlideshowProps {
  imagesString?: string;
}

export default function PhotoSlideshow({ imagesString }: PhotoSlideshowProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse comma-separated images string
  useEffect(() => {
    if (!imagesString) {
      // Default fallbacks if empty
      setImages([
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800"
      ]);
      return;
    }

    const parsed = imagesString
      .split(/,(?=\s*(?:https?:|data:))/i)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (parsed.length > 0) {
      setImages(parsed);
    }
  }, [imagesString]);

  // Handle slideshow intervals
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full max-w-lg aspect-[4/3] md:aspect-[16/10] border border-gold-600/25 p-2 bg-black/40 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Decorative inner frame */}
      <div className="absolute inset-4 border border-gold-500/10 pointer-events-none z-20" />

      {/* Crossfading images */}
      <div className="w-full h-full relative overflow-hidden bg-zinc-950">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Wedding Celebration Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full object-cover select-none"
          />
        </AnimatePresence>
      </div>

      {/* Index dots overlay */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-gold-400 scale-120 w-3" : "bg-gold-200/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
