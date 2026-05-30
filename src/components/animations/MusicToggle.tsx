"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MusicToggleProps {
  audioUrl?: string;
  autoPlay?: boolean;
}

export default function MusicToggle({
  audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  autoPlay = false,
}: MusicToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    if (autoPlay) {
      const playAudio = () => {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay blocked by browser policy. Waiting for user interaction.", err);
          });
      };
      
      playAudio();
      
      // Setup window listeners to trigger play on first user interaction if blocked
      const triggerPlay = () => {
        if (audioRef.current && !isPlaying) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              cleanup();
            })
            .catch((err) => {
              console.log("Interaction play interrupted or blocked:", err);
            });
        }
      };

      const cleanup = () => {
        window.removeEventListener("click", triggerPlay);
        window.removeEventListener("touchstart", triggerPlay);
        window.removeEventListener("keydown", triggerPlay);
      };

      window.addEventListener("click", triggerPlay);
      window.addEventListener("touchstart", triggerPlay);
      window.addEventListener("keydown", triggerPlay);

      return () => {
        cleanup();
        audio.pause();
        audioRef.current = null;
      };
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl, autoPlay]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Toggle play interrupted or blocked:", err);
        });
    }
  };

  return (
    <button
      onClick={togglePlay}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full border border-gold-400/30 bg-black/60 text-gold-400 backdrop-blur-md transition-all duration-500 hover:scale-115 hover:border-gold-400 focus:outline-none ${
        isPlaying ? "animate-music-spin shadow-[0_0_15px_rgba(212,163,37,0.4)]" : "shadow-none"
      }`}
      aria-label="Toggle Background Music"
      id="music-toggle-btn"
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-gold-300" />
      ) : (
        <VolumeX className="w-5 h-5 text-gold-500/80" />
      )}
      
      {/* Decorative pulse ring when not playing to prompt user */}
      {!isPlaying && (
        <span className="absolute inset-0 rounded-full border border-gold-400/50 animate-ping opacity-30 pointer-events-none" />
      )}
    </button>
  );
}
