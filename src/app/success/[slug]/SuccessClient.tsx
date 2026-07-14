"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, ExternalLink, Share2, Check, Sparkles, Home } from "lucide-react";
import { motion } from "framer-motion";
import GoldParticles from "@/components/animations/GoldParticles";

interface Invitation {
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

  useEffect(() => {
    // Generate celebration gold confetti burst on mount
    const colors = ["#eed57c", "#d4a325", "#b3811b", "#fffcf9", "#8f6018"];
    const temp: Particle[] = [];
    
    // Confetti starting position centered horizontally, slightly above vertical middle
    const startX = typeof window !== "undefined" ? window.innerWidth / 2 : 300;
    const startY = typeof window !== "undefined" ? window.innerHeight / 2.5 : 250;

    for (let i = 0; i < 70; i++) {
      temp.push({
        id: i,
        x: startX,
        y: startY,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1,
      });
    }
    setConfetti(temp);

    // Gravity loop for particle updates
    let animationFrameId: number;
    let particles = [...temp];

    const update = () => {
      particles = particles
        .map((p) => {
          const vx = Math.cos(p.angle) * p.speed;
          const vy = Math.sin(p.angle) * p.speed + 0.2; // Add gravity
          const newAngle = Math.atan2(vy, vx);
          const newSpeed = Math.sqrt(vx * vx + vy * vy) * 0.98; // Friction

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
    const fullUrl = `${window.location.origin}/invite/${invitation.slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappText = `You are cordially invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}. Please view our cinematic digital invitation here: `;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/invite/${invitation.slug}` : `/invite/${invitation.slug}`;

  return (
    <div className="relative min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
      <GoldParticles count={40} />

      {/* Confetti Render */}
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
              borderRadius: p.id % 2 === 0 ? "50%" : "0px",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
        className="max-w-xl w-full bg-[#120f12]/80 backdrop-blur-xl border border-[#eed57c]/20 p-8 md:p-12 text-center relative z-20 shadow-2xl rounded-[36px]"
      >
        {/* Animated Checkmark and Glowing Ambient */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 150 }}
            className="w-24 h-24 rounded-full border-2 border-[#d4a325] flex items-center justify-center mx-auto bg-gradient-to-br from-[#d4a325]/10 to-[#8f6018]/20 shadow-[0_0_30px_rgba(212,163,37,0.2)]"
          >
            <CheckCircle2 className="w-12 h-12 text-[#d4a325] stroke-[1.5]" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#d4a325]/10 rounded-full blur-2xl -z-10"
          />
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-sans text-2xl md:text-3xl font-black tracking-widest text-[#f5e9b3] uppercase"
        >
          ORDER CONCLUDED
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-sans text-[10px] tracking-widest text-[#eed57c]/60 uppercase mt-2 mb-8 font-bold"
        >
          Your premium digital invitation is live
        </motion.p>

        {/* Couple Card Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="bg-white/[0.02] border border-white/5 py-6 px-4 mb-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#eed57c]/30 to-transparent" />
          <p className="text-[9px] text-[#eed57c]/50 uppercase tracking-widest mb-1.5 font-bold">PREPARED WEDDING INVITATION</p>
          <p className="text-xl md:text-2xl text-[#fbf6df] font-bold tracking-wide uppercase font-sans">
            {invitation.bride_name} &amp; {invitation.groom_name}
          </p>
        </motion.div>

        {/* Copy shareable link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-black/40 border border-[#eed57c]/10 p-4 mb-8 flex flex-col gap-2 rounded-2xl text-left"
        >
          <span className="text-[9px] tracking-widest text-[#eed57c]/60 uppercase font-bold">
            SHARE LINK FOR RELATIVES
          </span>
          <div className="flex items-center justify-between gap-4 font-mono text-xs text-[#fbf6df]/90 truncate">
            <span className="truncate pr-4 select-all">
              {typeof window !== "undefined" ? `${window.location.origin}/invite/${invitation.slug}` : `/invite/${invitation.slug}`}
            </span>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#eed57c] hover:text-[#fbf6df] rounded-xl transition-all font-sans text-[9px] tracking-widest uppercase font-bold cursor-pointer flex items-center gap-1.5 shrink-0 border border-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">COPIED</span>
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

        {/* Action controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              whatsappText + shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-2xl shadow-lg hover:shadow-emerald-950/20"
          >
            <Share2 className="w-4 h-4" />
            WHATSAPP SHARE
          </a>

          <Link
            href={`/invite/${invitation.slug}`}
            target="_blank"
            className="flex-1 py-4 border border-white/10 text-white hover:bg-white/5 font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-2xl"
          >
            <ExternalLink className="w-4 h-4 text-[#eed57c]" />
            VIEW LIVE CARD
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link
            href={`/editor/${invitation.template_slug}?edit=${invitation.slug}`}
            className="py-3.5 border border-[#eed57c]/20 text-[#eed57c] hover:bg-[#eed57c]/5 font-bold text-[9px] tracking-widest uppercase transition-all rounded-2xl flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Modify Invite
          </Link>

          <Link
            href="/dashboard"
            className="py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-[9px] tracking-widest uppercase transition-all rounded-2xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            My Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
