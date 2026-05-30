"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Calendar, MessageSquare, Send, Heart, Clock } from "lucide-react";
import { TemplateData } from "@/lib/templates";
import FloatingFlowers from "@/components/animations/FloatingFlowers";
import TempleReveal from "@/components/animations/TempleReveal";
import ScratchReveal from "@/components/animations/ScratchReveal";
import { RevealGlowText, CountdownTimer } from "@/components/animations/CinematicEffects";

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

const DEFAULT_WISHES: Wish[] = [
  { id: "1", name: "Srinivasan & Meenakshi", message: "May Lord Ganesha shower his choicest blessings upon you both. Congratulations!", timestamp: "Just now" },
  { id: "2", name: "Ananya Swaminathan", message: "So happy for you, Aishwarya and Karthik! Wishing you a lifetime of laughter and love.", timestamp: "2 hours ago" },
  { id: "3", name: "Rajesh Kumar", message: "Congratulations! Wishing you a wonderful journey ahead. See you at the wedding!", timestamp: "1 day ago" }
];

export default function TempleGoldTemplate({ data }: { data: TemplateData }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishMessage, setNewWishMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("varnam-wishes-temple-gold");
    if (saved) {
      try {
        setWishes(JSON.parse(saved));
      } catch (e) {
        setWishes(DEFAULT_WISHES);
      }
    } else {
      setWishes(DEFAULT_WISHES);
      localStorage.setItem("varnam-wishes-temple-gold", JSON.stringify(DEFAULT_WISHES));
    }
  }, []);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;

    const wish: Wish = {
      id: Date.now().toString(),
      name: newWishName.trim(),
      message: newWishMessage.trim(),
      timestamp: "Just now"
    };

    const updated = [wish, ...wishes];
    setWishes(updated);
    localStorage.setItem("varnam-wishes-temple-gold", JSON.stringify(updated));
    setNewWishName("");
    setNewWishMessage("");
  };

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

  // Diya (Brass Lamp) SVG Component
  const Diya = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-gold-400 drop-shadow-[0_0_10px_rgba(238,213,124,0.4)]">
        {/* Flame */}
        <motion.path
          d="M 50 15 C 40 35 60 35 50 15 Z"
          fill="#ff9900"
          animate={{
            scale: [1, 1.1, 0.95, 1.05, 1],
            y: [0, -1, 1, -0.5, 0],
            opacity: [0.9, 1, 0.85, 1, 0.9]
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M 50 18 C 45 30 55 30 50 18 Z"
          fill="#ffcc00"
          animate={{
            scale: [1, 1.05, 0.98, 1.02, 1],
            opacity: [0.95, 1, 0.9, 1, 0.95]
          }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
        {/* Brass Diya Bowl */}
        <path d="M 15 45 C 15 70 85 70 85 45 C 80 40 20 40 15 45 Z" fill="url(#brassGrad)" stroke="#b3811b" strokeWidth="1" />
        <path d="M 15 45 Q 50 50 85 45" fill="none" stroke="#eed57c" strokeWidth="0.5" />
        {/* Brass Stand */}
        <path d="M 40 62 L 35 85 L 65 85 L 60 62 Z" fill="url(#brassGrad)" />
        <ellipse cx="50" cy="85" rx="20" ry="5" fill="url(#brassGrad)" stroke="#b3811b" strokeWidth="1" />
        <defs>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8f6018" />
            <stop offset="30%" stopColor="#eed57c" />
            <stop offset="70%" stopColor="#b3811b" />
            <stop offset="100%" stopColor="#8f6018" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const bgImage = data.bg_image_url || "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=1200";

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 0%, #3a0202 0%, #1a0000 50%, #070000 100%)"
      }}
      className="relative min-h-screen text-[#fbf6df] overflow-x-hidden font-sans border-4 border-double border-gold-600/30 p-4 md:p-8 select-none z-10"
    >
      {/* Custom Background Image Overlay */}
      <div
        style={{ backgroundImage: `url(${bgImage})` }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-15 mix-blend-overlay"
      />

      {/* Background Sparkles */}
      <FloatingFlowers type="sparkle" count={25} />

      {/* Decorative Golden Corner Borders */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold-400/40 opacity-70 pointer-events-none z-20" />

      {/* Floating Diyas (Left & Right Sides) */}
      <div className="hidden lg:block fixed left-8 top-1/3 z-20"><Diya /></div>
      <div className="hidden lg:block fixed right-8 top-1/3 z-20"><Diya /></div>
      <div className="hidden lg:block fixed left-16 top-2/3 z-20"><Diya /></div>
      <div className="hidden lg:block fixed right-16 top-2/3 z-20"><Diya /></div>

      {/* Section 1: Divine Temple Entrance */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="w-full flex flex-col items-center"
        >
          <div className="mb-4">
            <span className="font-serif text-xl tracking-[0.25em] text-[#eed57c] drop-shadow-[0_0_8px_rgba(238,213,124,0.3)]">ஸ்ரீ கணேஷாய நமஹ</span>
            <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2" />
          </div>

          <p className="font-montserrat text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-gold-300/80 mb-8">
            WITH THE BLESSINGS OF LORD GANESHA
          </p>

          {/* Temple Gopuram Entrance Animation */}
          <div className="w-full max-w-[320px] md:max-w-[400px] mb-8 bg-black/20 p-4 border border-gold-500/10 rounded-sm">
            <TempleReveal />
          </div>

          <p className="font-great-vibes text-3xl md:text-4xl text-gold-300/90 tracking-wide mt-4">
            We invite you to share our joy as we begin our new journey.
          </p>
        </motion.div>
      </div>

      {/* Section 2: Shimmering Names Reveal */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col items-center gap-6"
        >
          <span className="font-montserrat text-[9px] tracking-[0.25em] text-gold-400 uppercase">THE UNION OF</span>

          {/* Golden Letter Sweep Reveal */}
          <div className="py-6 border-y border-gold-500/10 w-full max-w-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#eed57c]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-out pointer-events-none" />
            <RevealGlowText
              text={`${data.bride_name || "Aishwarya"} weds ${data.groom_name || "Karthik"}`}
              className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider sm:tracking-widest leading-relaxed uppercase break-words w-full px-4 text-center"
            />
          </div>

          {/* Countdown Clock */}
          <div className="w-full max-w-md my-4">
            <CountdownTimer targetDate={data.wedding_date} />
          </div>

          {data.quote && (
            <p className="max-w-lg font-serif italic text-sm md:text-base text-gold-200/80 leading-relaxed border-t border-b border-gold-600/20 py-5 mt-4">
              &ldquo;{data.quote}&rdquo;
            </p>
          )}
        </motion.div>
      </div>

      {/* Section 3: Stone Engraved Plaque Details */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-8">CELEBRATION DETAILS</span>

          {/* Carved Stone Plaque Card */}
          <div
            className="w-full max-w-xl p-5 sm:p-8 md:p-12 relative overflow-hidden border-2 border-neutral-700/50 shadow-2xl rounded-sm bg-neutral-900/90 text-neutral-300"
            style={{
              backgroundImage: "radial-gradient(circle, #2d2d2d 0%, #1e1e1e 100%)",
              boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.9), 0 20px 40px rgba(0, 0, 0, 0.7)"
            }}
          >
            {/* Stone plag chiseled border overlay */}
            <div className="absolute inset-2 border border-neutral-800/80 pointer-events-none rounded-sm" />
            <div className="absolute inset-4 border border-gold-600/10 pointer-events-none rounded-sm" />

            {/* Plaque Header Ornament */}
            <div className="flex justify-center mb-6 text-gold-400/40">
              <svg viewBox="0 0 100 20" className="w-36 h-8">
                <path d="M 10 10 L 40 10 A 10 10 0 0 1 50 20 A 10 10 0 0 1 60 10 L 90 10" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="10" r="3" fill="currentColor" />
              </svg>
            </div>

            {/* SANGEET EVENT (IF PROVIDED) */}
            {data.sangeet_enabled !== "no" && data.sangeet_date && (
              <div className="mb-8 border-b border-neutral-800 pb-8 text-center">
                <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase block mb-1">SANGEET CELEBRATION</span>
                <h4 className="font-cinzel text-neutral-100 text-lg font-bold tracking-wider mb-2 uppercase">Gala & Music</h4>
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  <span>{formatDate(data.sangeet_date)}</span>
                </div>
                {data.sangeet_venue && (
                  <p className="text-xs text-neutral-400 font-serif whitespace-pre-line leading-relaxed max-w-md mx-auto">
                    {data.sangeet_venue}
                  </p>
                )}
              </div>
            )}

            {/* MAIN WEDDING IN MUHURTHAM */}
            <div className="mb-8 text-center">
              <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase block mb-1">THE MUHURTHAM</span>
              <h3 className="font-cinzel text-gold-300 text-2xl font-bold tracking-wider mb-3 uppercase">Ceremony Vows</h3>

              {data.scratch_enabled === "yes" ? (
                <div className="flex justify-center my-4">
                  <ScratchReveal dateString={formatDate(data.wedding_date)} />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-200 mb-4 bg-black/30 py-2.5 px-4 max-w-xs mx-auto border border-neutral-800 rounded-sm">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span className="font-serif tracking-wide">{formatDate(data.wedding_date)}</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mt-2 mb-2">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="font-serif leading-relaxed max-w-md">{data.wedding_venue}</span>
              </div>
            </div>

            {/* RECEPTION EVENT (IF PROVIDED) */}
            {data.reception_date && (
              <div className="mt-8 border-t border-neutral-800 pt-8 text-center">
                <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase block mb-1">WEDDING RECEPTION</span>
                <h4 className="font-cinzel text-neutral-100 text-lg font-bold tracking-wider mb-2 uppercase">Reception Gala</h4>
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  <span>{formatDate(data.reception_date)}</span>
                </div>
                {data.reception_venue && (
                  <p className="text-xs text-neutral-400 font-serif whitespace-pre-line leading-relaxed max-w-md mx-auto">
                    {data.reception_venue}
                  </p>
                )}
              </div>
            )}

            {/* Plaque Footer Ornament */}
            <div className="flex justify-center mt-6 text-gold-400/40 rotate-180">
              <svg viewBox="0 0 100 20" className="w-36 h-8">
                <path d="M 10 10 L 40 10 A 10 10 0 0 1 50 20 A 10 10 0 0 1 60 10 L 90 10" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="10" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Invited By */}
          {data.family_names && (
            <div className="mt-12 text-center">
              <span className="font-montserrat text-[9px] tracking-widest text-gold-400 uppercase">INVITED WITH LOVE BY</span>
              <p className="font-great-vibes text-3xl text-gold-300 mt-2">{data.family_names}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Section 4: Brass Framed Interactive Map */}
      {data.gmap_coordinates && (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center"
          >
            <span className="font-montserrat text-[10px] tracking-[0.20em] text-gold-400 uppercase mb-2">VENUE NAVIGATION</span>
            <h2 className="font-cinzel text-xl md:text-2xl text-gold-300 tracking-widest uppercase mb-8">Location Map</h2>

            {/* Brass Framed Map Container */}
            <div className="w-full max-w-2xl border-8 border-double border-[#b3811b] bg-black p-1 shadow-2xl relative">
              {/* Ornate corner leaf scrolls */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-gold-400 pointer-events-none z-10" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-gold-400 pointer-events-none z-10" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-gold-400 pointer-events-none z-10" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-gold-400 pointer-events-none z-10" />

              <div className="w-full h-80 relative overflow-hidden bg-neutral-900">
                <iframe
                  title="Temple Gold Map View"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.gmap_coordinates)}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale opacity-80 hover:opacity-100 transition-opacity duration-300"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Travel Guidelines */}
            {data.transport_info && (
              <p className="mt-6 max-w-md font-serif text-xs text-gold-200/60 leading-relaxed italic">
                Note: {data.transport_info}
              </p>
            )}
          </motion.div>
        </div>
      )}

      {/* Section 5: Blessings Wall */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-16 px-4 text-center relative z-10 border-t border-gold-500/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center max-w-2xl"
        >
          <span className="font-montserrat text-[10px] tracking-[0.2em] text-gold-400 uppercase mb-2">SHOWER YOUR LOVE</span>
          <h2 className="font-cinzel text-xl md:text-2xl text-gold-300 tracking-widest uppercase mb-2">Blessings Wall</h2>
          <p className="font-serif text-xs text-gold-200/50 mb-8">Leave your prayers & wishes for the bride & groom</p>

          {/* Submit Wish Box */}
          <form onSubmit={handleAddWish} className="w-full bg-black/40 border border-gold-500/20 p-5 md:p-6 mb-8 text-left rounded-sm">
            <h4 className="font-cinzel text-gold-400 text-xs tracking-wider uppercase mb-4 flex items-center gap-1.5 font-bold">
              <MessageSquare className="w-4 h-4" />
              Write Blessings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="wish-name" className="font-montserrat text-[8px] tracking-wider uppercase text-gold-300/60">Your Name</label>
                <input
                  id="wish-name"
                  type="text"
                  required
                  value={newWishName}
                  onChange={(e) => setNewWishName(e.target.value)}
                  placeholder="E.g. Uncle Sundar"
                  className="w-full bg-black border border-gold-500/15 text-[#fbf6df] px-3.5 py-2 text-xs focus:border-gold-500/60 focus:outline-none placeholder-gold-300/10 rounded-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="wish-msg" className="font-montserrat text-[8px] tracking-wider uppercase text-gold-300/60">Your Wish / Blessings</label>
                <input
                  id="wish-msg"
                  type="text"
                  required
                  value={newWishMessage}
                  onChange={(e) => setNewWishMessage(e.target.value)}
                  placeholder="E.g. Wishing you both a lifetime of happiness!"
                  className="w-full bg-black border border-gold-500/15 text-[#fbf6df] px-3.5 py-2 text-xs focus:border-gold-500/60 focus:outline-none placeholder-gold-300/10 rounded-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-black font-montserrat font-bold text-[9px] tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 rounded-none"
            >
              <Send className="w-3.5 h-3.5" />
              Send Blessings
            </button>
          </form>

          {/* Wishes List */}
          <div className="w-full space-y-4 max-h-96 overflow-y-auto scrollbar-none pr-1">
            <AnimatePresence>
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full bg-[#150000] border-l-2 border-gold-500 border border-gold-500/10 p-4 text-left relative group rounded-sm shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-cinzel text-gold-300 text-xs font-bold uppercase tracking-wider">{wish.name}</span>
                    <span className="text-[8px] text-gold-500/40 font-montserrat">{wish.timestamp}</span>
                  </div>
                  <p className="font-serif text-xs text-gold-200/70 leading-relaxed pr-6">{wish.message}</p>
                  <Heart className="w-3 h-3 text-gold-500/20 absolute bottom-3 right-3 group-hover:scale-125 group-hover:text-gold-500/50 transition-all duration-300" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* RSVP Contact Section */}
      {data.rsvp_phone && (
        <div className="max-w-xs mx-auto border-t border-gold-500/20 text-center pt-8 pb-12 z-10 relative">
          <span className="font-montserrat text-[9px] tracking-widest text-gold-400 uppercase">RSVP CONTACT</span>
          <p className="font-serif text-sm text-[#fbf6df] tracking-wide mt-1.5">Ph: {data.rsvp_phone}</p>
        </div>
      )}
    </div>
  );
}
