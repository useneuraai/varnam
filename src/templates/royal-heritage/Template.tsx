"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Compass, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import ScratchReveal from "@/components/animations/ScratchReveal";
import { CountdownTimer, RevealGlowText, CinematicCrest } from "@/components/animations/CinematicEffects";

export default function RoyalHeritageTemplate({ data }: { data: TemplateData }) {
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const initials = `${data.bride_name?.charAt(0) || "A"}${data.groom_name?.charAt(0) || "V"}`;

  const itineraryCount = (data.sangeet_enabled !== "no" && data.sangeet_date ? 1 : 0) + (data.reception_date ? 1 : 0);
  const gridClass = itineraryCount === 2 ? "md:grid-cols-2 max-w-2xl" : "max-w-md mx-auto";

  // Interactive Canvas Fireworks for the Grand Finale
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || (typeof window !== "undefined" ? Math.min(400, window.innerWidth - 64) : 280));
    let height = (canvas.height = 300);
    let animationFrameId: number;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      gravity: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.gravity = 0.04;
      }

      update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      particles: Particle[];
      exploded: boolean;

      constructor() {
        this.x = Math.random() * (width - 60) + 30;
        this.y = height;
        this.targetY = Math.random() * (height / 2 - 40) + 40;
        this.vy = -(Math.random() * 3 + 4);
        const colors = ["#eed57c", "#fca5a5", "#fde047", "#86efac", "#93c5fd", "#f472b6"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.particles = [];
        this.exploded = false;
      }

      update() {
        if (!this.exploded) {
          this.y += this.vy;
          if (this.y <= this.targetY) {
            this.exploded = true;
            this.explode();
          }
        } else {
          for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].alpha <= 0) {
              this.particles.splice(i, 1);
            }
          }
        }
      }

      explode() {
        for (let i = 0; i < 40; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw() {
        if (!ctx) return;
        if (!this.exploded) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = this.color;
          ctx.fill();
          ctx.restore();
        } else {
          for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
          }
        }
      }
    }

    let fireworks: Firework[] = [];

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const fw = new Firework();
      fw.x = x;
      fw.targetY = y;
      fw.exploded = true;
      fw.explode();
      fireworks.push(fw);
    };

    canvas.addEventListener("click", handleCanvasClick);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || (typeof window !== "undefined" ? Math.min(400, window.innerWidth - 64) : 280);
    };
    window.addEventListener("resize", handleResize);

    let spawnTimer = 0;
    const animate = () => {
      ctx.fillStyle = "rgba(10, 2, 2, 0.25)"; // Trails background color
      ctx.fillRect(0, 0, width, height);

      // Launch automated fireworks periodically
      spawnTimer++;
      if (spawnTimer > 45) {
        fireworks.push(new Firework());
        spawnTimer = 0;
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
          fireworks.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #031c14 0%, #0c0209 50%, #020002 100%)",
      }}
      className="relative min-h-screen text-[#fbf6df] overflow-x-hidden font-sans border-4 border-double border-gold-600/30 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image Overlay */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-15 mix-blend-overlay"
      />

      {/* Floating Gold sparkles */}
      <FloatingFlowers type="gold" count={20} />

      {/* Ornate corner borders */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />

      {/* Section 1: Palace Reveal / Hero */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full flex flex-col items-center"
        >
          {/* Decorative Chandelier SVG */}
          <div className="w-20 h-24 mb-6 text-gold-400/30 animate-[pulse_3s_infinite] pointer-events-none">
            <svg viewBox="0 0 100 120" className="w-full h-full">
              <line x1="50" y1="0" x2="50" y2="40" stroke="currentColor" strokeWidth="2" />
              <path d="M 20,40 Q 50,70 80,40" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 35,40 Q 50,60 65,40" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="40" r="4" fill="currentColor" />
              <circle cx="20" cy="40" r="3" fill="currentColor" />
              <circle cx="80" cy="40" r="3" fill="currentColor" />
              {/* Dangling crystals */}
              {[20, 35, 50, 65, 80].map((cx, idx) => (
                <line key={idx} x1={cx} y1="40" x2={cx} y2={cx === 50 ? 90 : 70} stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              ))}
            </svg>
          </div>

          <span className="font-montserrat text-[10px] tracking-[0.35em] text-[#eed57c] font-bold uppercase block mb-1">
            ROYAL MATRIMONIAL PROCLAMATION
          </span>

          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2 mb-8" />

          {/* Palace outline display */}
          <div className="w-full max-w-[280px] h-32 border border-gold-500/10 rounded-sm p-4 relative overflow-hidden flex items-center justify-center bg-black/10">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#eed57c]/5 pointer-events-none" />
            <svg viewBox="0 0 200 80" className="w-full h-full text-gold-500/25 fill-none stroke-current stroke-[0.75]">
              {/* Palace Arch Gate drawing */}
              <path d="M 10,75 L 10,40 C 10,20 40,10 100,10 C 160,10 190,20 190,40 L 190,75" />
              <path d="M 30,75 L 30,50 C 30,35 60,25 100,25 C 140,25 170,35 170,50 L 170,75" />
              <path d="M 80,75 C 80,60 90,55 100,55 C 110,55 120,60 120,75" />
              <line x1="100" y1="10" x2="100" y2="0" />
            </svg>
          </div>

          <p className="font-great-vibes text-3xl text-gold-300 mt-8 tracking-wide">
            Under the auspicious sky of Royal Heritage
          </p>
        </motion.div>
      </div>

      {/* Section 2: Couple introduction */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-center gap-6"
        >
          <span className="font-montserrat text-[9px] tracking-widest text-[#a88a6d] uppercase">HEIR AND HEIRESS OF THE ESTATES</span>

          <div className="flex justify-center w-full my-2">
            <CinematicCrest symbol="👑" initials={initials} />
          </div>

          <div className="my-2">
            <RevealGlowText
              text={`${data.bride_name || "Arundhati"} & ${data.groom_name || "Vikram"}`}
              className="text-xl sm:text-3xl md:text-5xl font-bold tracking-wider sm:tracking-widest text-[#eed57c] uppercase leading-relaxed break-words w-full px-4 text-center"
            />
          </div>

          <div className="w-full max-w-sm my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </div>
        </motion.div>
      </div>

      {/* Section 3: Royal Invitation Scroll Unfolds */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-8">ROYAL ANNOUNCEMENT</span>

          {/* Interactive Unfolding Scroll */}
          <motion.div
            ref={scrollRef}
            initial={{ scaleY: 0.1, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full max-w-lg origin-top relative rounded-lg"
            style={{
              backgroundImage: "radial-gradient(circle, #fbf7eb 0%, #ecdcb0 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              border: "1px solid #c2a353"
            }}
          >
            {/* Scroll Handles */}
            <div className="h-4 w-full bg-gradient-to-r from-[#5a3a0e] via-[#b58c4c] to-[#5a3a0e] rounded-t-sm shadow-md" />

            {/* Scroll Contents */}
            <div className="p-5 sm:p-8 md:p-10 text-[#4c3a1e] font-serif flex flex-col gap-6 text-left">
              <div className="text-center border-b border-[#c2a353]/30 pb-4">
                <span className="font-montserrat text-[9px] tracking-widest text-[#8a6828] font-bold uppercase block mb-1">PROCLAMATION DECREE</span>
                <h3 className="font-cinzel text-lg font-bold text-neutral-800 uppercase tracking-wide">The Royal Invitation</h3>
              </div>

              {data.quote && (
                <p className="italic text-xs md:text-sm text-center font-serif leading-relaxed text-[#68532f] my-2">
                  &ldquo;{data.quote}&rdquo;
                </p>
              )}

              <div className="space-y-4 text-xs leading-relaxed border-t border-[#c2a353]/20 pt-4">
                <p>
                  We proclaim by Royal Decree that the auspicious alliance of our Houses shall take place on the appointed hour. We request the high honor of your presence and witness.
                </p>
                <div className="bg-black/5 p-4 border border-[#c2a353]/20 space-y-2.5 rounded-sm">
                  <div className="flex gap-2">
                    <Calendar className="w-4 h-4 text-[#8a6828] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-cinzel text-[10px] tracking-wide block uppercase text-neutral-800">Muhurtham Auspicious Hour</strong>
                      <span>{formatDate(data.wedding_date)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-[#c2a353]/15 pt-2">
                    <MapPin className="w-4 h-4 text-[#8a6828] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-cinzel text-[10px] tracking-wide block uppercase text-neutral-800">Royal Pavilions Venue</strong>
                      <span>{data.wedding_venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {data.family_names && (
                <div className="text-center mt-6 pt-4 border-t border-[#c2a353]/25">
                  <span className="font-montserrat text-[8px] tracking-widest text-[#8a6828] uppercase">SUBSCRIBED UNDER SEAL BY</span>
                  <p className="font-great-vibes text-2xl text-[#8f6018] mt-1.5">{data.family_names}</p>
                </div>
              )}
            </div>

            {/* Scroll bottom handle */}
            <div className="h-4 w-full bg-gradient-to-r from-[#5a3a0e] via-[#b58c4c] to-[#5a3a0e] rounded-b-sm shadow-inner" />
          </motion.div>
        </motion.div>
      </div>

      {/* Section 4: Itinerary details */}
      {((data.sangeet_enabled !== "no" && data.sangeet_date) || data.reception_date) && (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center"
          >
            <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-8">ROYAL SCHEDULE OF EVENTS</span>

            <div className={`grid grid-cols-1 ${gridClass} gap-8 w-full text-left`}>
              {/* SANGEET */}
              {data.sangeet_enabled !== "no" && data.sangeet_date && (
                <div className="border border-gold-500/20 bg-black/40 p-6 rounded-md relative shadow-lg">
                  <span className="text-[9px] tracking-widest text-gold-400 font-bold uppercase block mb-1">CELEBRATION ONE</span>
                  <h4 className="font-cinzel text-gold-300 text-sm font-bold uppercase tracking-wider mb-2">Sangeet Gala</h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <span>{formatDate(data.sangeet_date)}</span>
                  </div>
                  {data.sangeet_venue && (
                    <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-800 pt-2.5">
                      {data.sangeet_venue}
                    </p>
                  )}
                </div>
              )}

              {/* RECEPTION */}
              {data.reception_date && (
                <div className="border border-gold-500/20 bg-black/40 p-6 rounded-md relative shadow-lg">
                  <span className="text-[9px] tracking-widest text-gold-400 font-bold uppercase block mb-1">CELEBRATION TWO</span>
                  <h4 className="font-cinzel text-gold-300 text-sm font-bold uppercase tracking-wider mb-2">Reception Dinner</h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <span>{formatDate(data.reception_date)}</span>
                  </div>
                  {data.reception_venue && (
                    <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-800 pt-2.5">
                      {data.reception_venue}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Section 5: Fireworks Grand Finale */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center max-w-xl"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-2">THE CELEBRATIONS BEGIN</span>
          <h2 className="font-cinzel text-xl md:text-2xl text-gold-300 tracking-widest uppercase mb-2">Grand Finale</h2>
          <p className="font-serif text-xs text-gold-200/50 mb-6">Click on the canvas to trigger extra fireworks!</p>

          {/* Interactive Fireworks Canvas inside a gilded border */}
          <div className="w-full border-4 border-gold-500/35 p-1 bg-black shadow-2xl relative">
            <canvas ref={fireworksCanvasRef} className="w-full h-80 block cursor-pointer bg-[#0a0202]" />
            <div className="absolute inset-0 pointer-events-none border border-gold-500/10" />
          </div>

          {/* Dress guidelines & map */}
          {(data.dress_code || data.transport_info) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left mt-8">
              {data.dress_code && (
                <div className="border border-gold-500/15 p-4 bg-black/40 flex gap-2">
                  <Compass className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-cinzel text-gold-400 text-[10px] font-bold uppercase tracking-wider block">Royal Dress Guidelines</span>
                    <p className="font-serif text-xs text-gold-200/70 mt-1 leading-relaxed">{data.dress_code}</p>
                  </div>
                </div>
              )}
              {data.transport_info && (
                <div className="border border-gold-500/15 p-4 bg-black/40 flex gap-2">
                  <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-cinzel text-gold-400 text-[10px] font-bold uppercase tracking-wider block">Arrival Instructions</span>
                    <p className="font-serif text-xs text-gold-200/70 mt-1 leading-relaxed">{data.transport_info}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* RSVP Desk */}
      {data.rsvp_phone && (
        <div className="max-w-xs mx-auto border-t border-gold-500/20 text-center pt-8 pb-12 z-10 relative">
          <span className="font-montserrat text-[9px] tracking-widest text-gold-400 uppercase">RSVP PROTOCOL</span>
          <p className="font-serif text-sm text-gold-100 tracking-wide mt-1.5">Ph: {data.rsvp_phone}</p>
        </div>
      )}
    </div>
  );
}
