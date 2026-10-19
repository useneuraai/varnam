"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Share2, Check, Sparkles, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface Invitation {
  id?: string;
  bride_name: string;
  groom_name: string;
  template_slug: string;
  slug: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export default function SuccessClient({ invitation }: { invitation: Invitation }) {
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [fullShareUrl, setFullShareUrl] = useState("");
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";

  const inviteIdentifier = invitation.id || invitation.slug;
  const relativeShareUrl = `/invite/${inviteIdentifier}`;

  useEffect(() => {
    setMounted(true);
    setFullShareUrl(`${window.location.origin}${relativeShareUrl}`);
  }, [relativeShareUrl]);

  useEffect(() => {
    // Elegant champagne gold confetti burst on mount
    const colors = ["#eed57c", "#d4a325", "#b3811b", "#f5e9b3", "#916710"];
    const temp: Particle[] = [];
    
    const startX = typeof window !== "undefined" ? window.innerWidth / 2 : 300;
    const startY = typeof window !== "undefined" ? window.innerHeight / 3 : 250;

    for (let i = 0; i < 50; i++) {
      temp.push({
        id: i,
        x: startX,
        y: startY,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        opacity: 0.9,
      });
    }
    setConfetti(temp);

    let animationFrameId: number;
    let particles = [...temp];

    const update = () => {
      particles = particles
        .map((p) => {
          const vx = Math.cos(p.angle) * p.speed;
          const vy = Math.sin(p.angle) * p.speed + 0.18;
          const newAngle = Math.atan2(vy, vx);
          const newSpeed = Math.sqrt(vx * vx + vy * vy) * 0.98;

          return {
            ...p,
            x: p.x + vx,
            y: p.y + vy,
            speed: newSpeed,
            angle: newAngle,
            rotation: p.rotation + p.rotationSpeed,
            opacity: Math.max(0, p.opacity - 0.012),
          };
        })
        .filter((p) => p.opacity > 0);

      setConfetti(particles);

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleCopy = () => {
    const textToCopy = fullShareUrl || (typeof window !== "undefined" ? `${window.location.origin}${relativeShareUrl}` : relativeShareUrl);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappText = `You are cordially invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}. Please view our digital invitation here: `;
  const activeShareUrl = fullShareUrl || relativeShareUrl;

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Subtle warm ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-orange-50/20 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Gentle Gold Confetti */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {confetti.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: `rotate(${p.rotation}deg)`,
              borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.25 }}
        className="max-w-lg w-full bg-white border border-[#eed57c]/40 p-6 sm:p-10 md:p-12 text-center relative z-20 shadow-[0_12px_48px_rgba(212,163,37,0.08)] rounded-[28px] sm:rounded-[36px]"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <img
            src="/logo.png?v=lotus-gold"
            alt="Varnam"
            className="w-8 h-8 object-contain drop-shadow-xs"
          />
          <span className="font-cinzel text-lg font-bold tracking-[0.22em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent">
            VARNAM
          </span>
        </div>

        {/* Elegant Gold Checkmark Seal */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 150 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#fdfaf2] border-2 border-[#eed57c] flex items-center justify-center mx-auto shadow-xs"
          >
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-[#916710]" strokeWidth={2.2} />
          </motion.div>
        </div>

        {/* Title & Subtitle */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 uppercase"
        >
          {isEdit ? "Changes Saved" : "Order Concluded"}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-xs sm:text-sm text-zinc-500 font-normal mt-2 mb-6 sm:mb-8"
        >
          {isEdit
            ? "Your digital wedding invitation has been updated successfully."
            : "Your premium digital wedding invitation is now live."}
        </motion.p>

        {/* Couple Name Display Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring" }}
          className="bg-[#fdfcf9] border border-[#eed57c]/35 py-4 sm:py-5 px-4 rounded-2xl mb-6 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#eed57c] to-transparent" />
          <p className="text-[10px] text-[#916710] uppercase tracking-[0.2em] mb-1 font-bold">
            PREPARED WEDDING INVITATION
          </p>
          <p className="text-xl sm:text-2xl text-zinc-900 font-bold tracking-wide font-serif">
            {invitation.bride_name} &amp; {invitation.groom_name}
          </p>
        </motion.div>

        {/* Shareable Link Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="bg-[#faf8f5] border border-zinc-200/80 p-3.5 sm:p-4 mb-6 flex flex-col gap-1.5 rounded-2xl text-left"
        >
          <span className="text-[10px] font-bold tracking-[0.18em] text-zinc-500 uppercase">
            SHARE LINK FOR RELATIVES
          </span>
          <div className="flex items-center justify-between gap-3 font-mono text-xs text-zinc-800">
            <span suppressHydrationWarning className="truncate pr-2 select-all font-medium">
              {mounted && fullShareUrl ? fullShareUrl : relativeShareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-white hover:bg-[#fffcf7] border border-[#eed57c] text-[#916710] hover:text-[#744c19] rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Primary Action Buttons (White & Gold Luxury) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-3 mb-3.5"
        >
          {/* WhatsApp Share: Elegant Black & Gold instead of neon green */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              whatsappText + activeShareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 sm:py-4 bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white font-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border border-[#eed57c] shadow-sm hover:shadow-md"
          >
            <Share2 className="w-4 h-4 text-[#eed57c]" />
            WhatsApp Share
          </a>

          {/* View Live Card: Pure White & Gold Accent */}
          <Link
            href={`/invite/${invitation.id || invitation.slug}`}
            target="_blank"
            className="flex-1 py-3.5 sm:py-4 bg-white hover:bg-[#fffdfa] active:scale-[0.98] border border-zinc-200 hover:border-[#eed57c] text-zinc-800 hover:text-zinc-950 font-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 rounded-xl shadow-2xs"
          >
            <ExternalLink className="w-4 h-4 text-[#916710]" />
            View Live Card
          </Link>
        </motion.div>

        {/* Secondary Action Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link
            href={`/editor/${invitation.template_slug}?edit=${invitation.slug}`}
            className="py-3 bg-white hover:bg-[#fffcf7] active:scale-[0.98] border border-[#eed57c]/60 text-[#916710] font-bold text-[11px] tracking-wider uppercase transition-all rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b3811b]" />
            Modify Invite
          </Link>

          <Link
            href="/dashboard"
            className="py-3 bg-[#faf8f5] hover:bg-zinc-100 active:scale-[0.98] border border-zinc-200 text-zinc-700 font-bold text-[11px] tracking-wider uppercase transition-all rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Home className="w-3.5 h-3.5 text-zinc-500" />
            My Studio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
