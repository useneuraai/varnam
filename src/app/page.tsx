"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Lock,
  ChevronDown,
  Check,
  Sliders,
  Layers,
  Send
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import LiveTemplatePreview from "@/components/LiveTemplatePreview";
import { supabase } from "@/lib/supabase";

// Helpers for the carousel indices
const getWrappedOffset = (index: number, activeIndex: number, total: number) => {
  let diff = index - activeIndex;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
};

const getCardStyles = (offset: number, isMobile: boolean) => {
  const scale = offset === 0 ? 1.0 : offset === 1 || offset === -1 ? 0.85 : 0.72;
  const opacity = offset === 0 ? 1.0 : offset === 1 || offset === -1 ? 0.95 : 0.85;
  const brightness = offset === 0 ? 1.0 : offset === 1 || offset === -1 ? 1.00 : 0.95;
  const grayscale = offset === 0 ? 0 : offset === 1 || offset === -1 ? 0.55 : 0.95;
  const rotate = offset === 0 ? 0 : offset === 1 ? 3 : offset === -1 ? -3 : 0;
  const zIndex = offset === 0 ? 30 : offset === 1 || offset === -1 ? 20 : 10;
  
  let x = 0;
  if (isMobile) {
    x = offset * 135; // Spacing for mobile
  } else {
    x = offset * 250; // Spacing for desktop
  }

  return {
    scale,
    opacity,
    rotate,
    zIndex,
    x,
    brightness,
    grayscale,
  };
};

const getCoupleName = (slug: string) => {
  switch (slug) {
    case "royal-tamil":
      return "Malar";
    case "temple-gold":
      return "Aishwarya & Karthik";
    case "traditional-red":
      return "Devi & Suresh";
    case "floral-luxury":
      return "Zara & Kabir";
    case "modern-minimal":
      return "Riya & Varun";
    case "royal-heritage":
      return "Arundhati & Vikram";
    case "elegant-muslim":
      return "Zara & Faisal";
    case "modern-christian":
      return "Michelle & David";
    case "luxury-floral":
      return "Priya & Rahul";
    default:
      return "Malar";
  }
};

const getCategoryName = (template: any) => {
  switch (template.slug) {
    case "royal-tamil":
    case "temple-gold":
    case "traditional-red":
      return "Traditional Tamil Wedding";
    default:
      return template.category || "Traditional Wedding";
  }
};

const FAQS = [
  {
    q: "How quickly can I create an invitation?",
    a: "Most hosts publish their invitation in 10 to 15 minutes after choosing a template and adding their event details."
  },
  {
    q: "Can I edit after publishing?",
    a: "Yes. You can update venue coordinates, schedule, photos, music, and details until 5 days after the event date."
  },
  {
    q: "Do guests need to install an app?",
    a: "No. Every invitation opens in any modern mobile or desktop browser through a single shareable link."
  },
  {
    q: "Can I share on WhatsApp?",
    a: "Yes. Once payment is successful, you get a clean invitation link ready to copy and share on WhatsApp, email, or social media."
  },
  {
    q: "What does the one-time payment include?",
    a: "One payment of ₹799 unlocks all templates for the same event, unlimited photo slideshows, custom music uploads, Google Maps integration, RSVP guest tracking, and interactive scratch-to-reveal cards."
  },
  {
    q: "What happens after the event?",
    a: "The invitation remains active and editable until 5 days after the event date, after which it is archived and the license is exhausted."
  }
];

export default function LandingPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
    if (isMockSupabase) {
      setUser({ email: "demo.user@varnam.com" });
      return;
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TEMPLATES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TEMPLATES.length);
  };

  const handleCardClick = (idx: number) => {
    setActiveIndex(idx);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="relative min-h-screen bg-white text-zinc-800 flex flex-col selection:bg-gold-200 selection:text-black">
        
        {/* Premium Header */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl md:text-3xl font-black tracking-widest text-zinc-900 group-hover:opacity-80 transition-opacity">
                VARNAM
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-widest text-zinc-500 font-bold uppercase">
              <Link href="/templates" className="hover:text-zinc-900 transition-colors">TEMPLATES</Link>
              <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">HOW IT WORKS</a>
              <a href="#why-choose" className="hover:text-zinc-900 transition-colors">WHY US</a>
              <a href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2 text-[10px] tracking-widest text-[#b3811b] hover:text-[#c59b27] border border-[#eed57c] bg-[#fffcf9] hover:bg-[#fff9f2] transition-all duration-300 font-bold rounded-full uppercase"
                >
                  My Studio
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 text-[10px] tracking-widest text-zinc-500 hover:text-zinc-950 transition-all duration-300 font-bold uppercase"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/templates"
                className="relative px-5 py-2 text-[10px] tracking-widest text-zinc-800 border border-zinc-200 hover:border-zinc-900 bg-transparent hover:bg-zinc-50 transition-all duration-300 font-bold rounded-full"
              >
                BROWSE GALLERY
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-6 pt-16 pb-12 overflow-hidden flex flex-col items-center justify-start text-center bg-white">
          <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 select-none">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-5">
              Premium Digital Event Invitations
            </p>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] text-zinc-900 tracking-tight mb-8">
              Elegant invitations for <br className="hidden sm:inline" />
              <span className="gold-gradient-text drop-shadow-sm">real celebrations</span>
            </h1>

            <p className="max-w-2xl text-zinc-500 text-base sm:text-lg leading-relaxed mb-10 font-normal">
              Create a refined invitation website with an opening reveal, RSVP, photos, music, maps, and guest messages. No clutter, no app installs, just one beautiful link.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/templates?event=Wedding"
                className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-zinc-200/10 min-w-[210px] flex items-center justify-center gap-2 group rounded-full"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/templates/royal-tamil"
                className="px-8 py-4 border border-zinc-200 hover:border-zinc-900 text-zinc-800 hover:bg-zinc-50 font-bold text-xs tracking-widest uppercase transition-all duration-300 min-w-[210px] flex items-center justify-center gap-2 rounded-full"
              >
                View Sample Invite
              </Link>
            </div>
          </div>

          {/* Carousel Section */}
          <div 
            className="w-full relative mt-16 flex flex-col items-center z-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Carousel Container */}
            <div className="relative w-full h-[480px] sm:h-[600px] flex items-center justify-center overflow-x-clip py-4">
              {TEMPLATES.map((tpl, idx) => {
                const offset = getWrappedOffset(idx, activeIndex, TEMPLATES.length);
                const isVisible = Math.abs(offset) <= 2;

                if (!isVisible) return null;

                const cardStyles = getCardStyles(offset, isMobile);
                const isActive = offset === 0;

                return (
                  <motion.div
                    key={tpl.slug}
                    style={{
                      width: isMobile ? 260 : 340,
                      height: isMobile ? 440 : 550,
                      position: "absolute",
                      borderRadius: 20,
                      overflow: "hidden",
                      boxShadow: isActive 
                        ? "0 20px 40px rgba(0, 0, 0, 0.08)" 
                        : "0 10px 20px rgba(0, 0, 0, 0.04)",
                    }}
                    animate={{
                      scale: cardStyles.scale,
                      opacity: cardStyles.opacity,
                      rotate: cardStyles.rotate,
                      x: cardStyles.x,
                      zIndex: cardStyles.zIndex,
                      filter: `grayscale(${cardStyles.grayscale}) brightness(${cardStyles.brightness})`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 24,
                      mass: 0.8,
                    }}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(e, info) => {
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        handleNext();
                      } else if (info.offset.x > threshold) {
                        handlePrev();
                      }
                    }}
                    onClick={() => handleCardClick(idx)}
                    className="cursor-pointer bg-white border border-zinc-150/40 origin-center select-none"
                  >
                    <LiveTemplatePreview slug={tpl.slug} autoScroll={isActive} />
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex items-center gap-8 text-xs tracking-widest text-zinc-500 font-semibold">
              <button 
                onClick={handlePrev}
                className="p-2 hover:text-gold-600 transition-colors text-lg"
              >
                ←
              </button>
              <span className="font-bold">
                {String(activeIndex + 1).padStart(2, "0")} / {String(TEMPLATES.length).padStart(2, "0")}
              </span>
              <button 
                onClick={handleNext}
                className="p-2 hover:text-gold-600 transition-colors text-lg"
              >
                →
              </button>
            </div>

            {/* Active Template Description */}
            <div className="mt-6 text-center select-none max-w-lg px-6">
              <h3 className="text-xl font-bold text-zinc-900">
                {getCoupleName(TEMPLATES[activeIndex].slug)}
              </h3>
              <Link
                href={`/templates/${TEMPLATES[activeIndex].slug}`}
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-700 font-semibold tracking-wider transition-all uppercase group"
              >
                <span>{getCategoryName(TEMPLATES[activeIndex])}</span>
                <span>·</span>
                <span className="underline decoration-gold-500/30 group-hover:decoration-gold-600">Preview invitation →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Minimal Trust & Value Strip */}
        <section className="w-full bg-white border-y border-zinc-100 py-12 px-6 relative z-10 flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <div className="text-xs sm:text-sm tracking-[0.15em] text-zinc-900 font-semibold flex flex-wrap items-center justify-center gap-x-5 gap-y-2 uppercase">
              <span>Choose a design</span>
              <span className="text-gold-500/50">•</span>
              <span>Personalize every detail</span>
              <span className="text-gold-500/50">•</span>
              <span>Share with one beautiful link</span>
            </div>

            <div className="h-[1px] w-24 bg-zinc-100 my-1.5" />
            
            <div className="text-[10px] sm:text-xs tracking-widest text-zinc-500 font-bold flex flex-wrap items-center justify-center gap-x-5 gap-y-2 uppercase">
              <span>No app required</span>
              <span className="text-gold-400/40">•</span>
              <span>Unlimited guests</span>
              <span className="text-gold-400/40">•</span>
              <span>One-time payment</span>
            </div>
          </div>
        </section>

        {/* Why Choose Varnam / Features */}
        <section id="why-choose" className="py-24 px-6 relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:items-center">
            <div>
              <p className="font-semibold text-xs uppercase tracking-widest text-gold-600">
                Why choose varnam
              </p>
              <h2 className="mt-4 max-w-[560px] text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                Premium invitations, kept simple
              </h2>
              <p className="mt-5 max-w-[500px] text-base leading-relaxed text-zinc-500">
                One event workspace for design, media, billing, RSVP, maps, and guest messages. The invitation remains luxurious, while the owner flow stays practical.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50/50 px-5 py-2.5 text-xs font-semibold tracking-wide text-zinc-800 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  Razorpay Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50/50 px-5 py-2.5 text-xs font-semibold tracking-wide text-zinc-800 shadow-sm">
                  <Lock className="w-4 h-4 text-gold-600" />
                  Secure Live Dashboard
                </span>
              </div>

              <Link
                href="/templates"
                className="mt-10 inline-flex items-center gap-2 text-xs font-bold text-gold-600 hover:text-gold-700 transition-colors uppercase tracking-widest"
              >
                Browse wedding templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative border border-zinc-100 bg-zinc-50/50 p-8 shadow-sm rounded-[32px] md:p-10">
              <div className="grid gap-8 divide-y divide-zinc-200/50">
                {[
                  {
                    step: "01",
                    title: "Clear event license",
                    desc: "One event, one plan, and clear rules for editing and archiving. No subscriptions."
                  },
                  {
                    step: "02",
                    title: "Secure checkout",
                    desc: "Payments are safely processed using Razorpay SDK before any invitation link activates."
                  },
                  {
                    step: "03",
                    title: "Guest-ready experience",
                    desc: "Includes online RSVP, guest messaging board, slideshows, maps, and music in one simple link."
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`grid grid-cols-[48px_1fr] gap-5 ${idx > 0 ? "pt-8" : ""}`}>
                    <div className="flex h-12 w-12 items-center justify-center border border-zinc-200 bg-white text-zinc-900 rounded-full text-sm font-bold shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-zinc-200/50 pt-8">
                <p className="text-lg italic text-zinc-800 leading-relaxed font-serif">
                  &ldquo;The design feels high-end, but every guest action is just one tap away.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Templates Gallery */}
        <section className="py-24 px-6 bg-[#fafaf9] border-t border-zinc-100 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
                Our Handcrafted Collection
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900">
                Signature Designs
              </h2>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEMPLATES.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.slug}
                  className="group relative flex flex-col bg-white rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-0"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-zinc-100">
                    <LiveTemplatePreview slug={tpl.slug} autoScroll={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-4 left-4 bg-white/95 text-zinc-900 text-[9px] tracking-widest uppercase px-3 py-1 font-bold shadow-sm rounded-full pointer-events-none">
                      {tpl.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg text-zinc-900 font-bold tracking-tight mb-2">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-6 flex-grow">
                      {tpl.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
                      <span className="text-base text-zinc-900 font-bold">
                        ₹{tpl.price}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          href={`/templates/${tpl.slug}`}
                          className="text-[10px] tracking-widest uppercase font-bold text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-2"
                        >
                          PREVIEW
                        </Link>
                        <Link
                          href={`/editor/${tpl.slug}`}
                          className="bg-zinc-900 text-white text-[10px] tracking-widest uppercase font-bold px-4 py-2 hover:bg-zinc-800 transition-colors shadow-sm rounded-full"
                        >
                          USE THIS
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="py-24 px-6 z-10 border-t border-zinc-150 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
                Simple Creation Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900">
                How It Works
              </h2>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Layers className="w-5 h-5 text-gold-600" />,
                  title: "1. Select Theme",
                  desc: "Choose from our premium Hindu, Muslim, Christian, or Secular cultural template gallery."
                },
                {
                  icon: <Sliders className="w-5 h-5 text-gold-600" />,
                  title: "2. Personalize Details",
                  desc: "Fill in names, schedules, dress codes, music tracks, map coordinates, and upload photos."
                },
                {
                  icon: <CreditCard className="w-5 h-5 text-gold-600" />,
                  title: "3. Complete Payment",
                  desc: "Process a one-time ₹799 activation fee securely using Razorpay checkout SDK."
                },
                {
                  icon: <Send className="w-5 h-5 text-gold-600" />,
                  title: "4. Share with Guests",
                  desc: "Instantly copy your private invitation web link and share it on WhatsApp or email."
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50/50 border border-zinc-100 p-8 flex flex-col items-center text-center rounded-[28px] shadow-sm transition hover:shadow-md hover:border-zinc-200/60 duration-300"
                >
                  <div className="mb-5 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">{step.icon}</div>
                  <h3 className="text-base text-zinc-900 font-bold mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Event License */}
        <section id="pricing" className="py-24 px-6 z-10 border-t border-zinc-150 bg-[#fafaf9] relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
                Bespoke Event Licensing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900">
                Pricing Structure
              </h2>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-8 md:p-12 border border-zinc-100 max-w-lg w-full relative shadow-xl shadow-zinc-250/20 rounded-[32px] flex flex-col items-center text-center">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[10px] font-bold tracking-widest uppercase px-5 py-2 shadow-md rounded-full">
                  SIGNATURE EVENT LICENSE
                </div>

                <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-6 block">
                  ONE-TIME PAYMENT
                </span>
                <div className="flex items-baseline justify-center gap-2.5 my-4">
                  <span className="text-lg line-through text-zinc-300">₹999</span>
                  <span className="text-4xl md:text-5xl font-extrabold text-gold-600">₹799</span>
                  <span className="text-xs text-zinc-500">/ single wedding event</span>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-8 max-w-xs">
                  Unlock all premium templates to build, host, and customize your exquisite interactive invitation webpage.
                </p>

                {/* Features List */}
                <ul className="w-full text-left text-xs text-zinc-600 space-y-3.5 mb-8 border-t border-b border-zinc-100 py-6">
                  {[
                    "1 event hosting license included",
                    "Access to all templates for the licensed event",
                    "Unlimited photo slideshow uploads",
                    "Custom background image overrides",
                    "Custom background music & audio uploads",
                    "Interactive RSVP form and guest wishes board",
                    "Interactive Scratch-to-Reveal event date card",
                    "Multi-event schedule (Muhurtham, Reception, Sangeet)",
                    "Dress code guidelines & transport notes",
                    "Dynamic Google Maps and calendar sync",
                    "Edit details freely until 5 days after event completes",
                    "License exhausted after event archiving"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-gold-600 shrink-0" />
                      <span className="font-medium tracking-wide text-zinc-700">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/templates"
                  className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group shadow-md rounded-full"
                >
                  SELECT TEMPLATE & START
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Accordion FAQ Section */}
        <section id="faq" className="py-24 px-6 z-10 border-t border-zinc-150 bg-white relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-gold-600 uppercase">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900">
                F.A.Q.
              </h2>
              <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4 rounded-full" />
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-zinc-100 bg-zinc-50/20 rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-zinc-850 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gold-600 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed border-t border-zinc-100/50">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-6 border-t border-zinc-100 bg-[#fafaf9] z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-lg font-black tracking-widest text-zinc-900">
                VARNAM
              </span>
              <p className="text-[10px] text-zinc-400">
                © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
              </p>
            </div>

            <div className="flex gap-8 text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
              <Link href="/templates" className="hover:text-zinc-900 transition-colors">GALLERY</Link>
              <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">PROCESS</a>
              <a href="#why-choose" className="hover:text-zinc-900 transition-colors">WHY US</a>
              <a href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</a>
            </div>
          </div>
        </footer>
      </div>
  );
}
