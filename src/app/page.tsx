"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Heart,
  ShieldCheck,
  CreditCard,
  Share2,
  Calendar,
  MapPin,
  MessageSquare,
  Lock,
  ChevronDown,
  Volume2,
  Wand2,
  Music,
  Image as ImageIcon
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

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
    a: "One payment of ₹699 unlocks all templates for the same event, unlimited photo slideshows, custom music uploads, Google Maps integration, RSVP guest tracking, and interactive scratch-to-reveal cards."
  },
  {
    q: "What happens after the event?",
    a: "The invitation remains active and editable until 5 days after the event date, after which it is archived and the license is exhausted."
  }
];

export default function LandingPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="relative min-h-screen bg-[#faf6f0] text-[#1c1a17] font-sans flex flex-col selection:bg-gold-200 selection:text-black">
        
        {/* Premium Header */}
        <header className="sticky top-0 z-40 w-full bg-[#faf6f0]/85 backdrop-blur-xl border-b border-gold-500/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-cinzel text-2xl md:text-3xl font-extrabold tracking-widest bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 bg-clip-text text-transparent group-hover:scale-102 transition-transform duration-300">
                VARNAM
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-10 font-montserrat text-[10px] tracking-[0.25em] text-[#6b6660] font-bold">
              <Link href="/templates" className="hover:text-gold-600 transition-colors">TEMPLATES</Link>
              <a href="#how-it-works" className="hover:text-gold-600 transition-colors">HOW IT WORKS</a>
              <a href="#why-choose" className="hover:text-gold-600 transition-colors">WHY US</a>
              <a href="#faq" className="hover:text-gold-600 transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/templates"
                className="relative px-6 py-2.5 font-montserrat text-[10px] tracking-widest text-[#342c25] border border-gold-600/30 hover:border-gold-600 bg-transparent hover:bg-gold-500/5 transition-all duration-300 font-bold"
              >
                BROWSE GALLERY
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Soft luxury background blooms */}
          <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />
          <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-gold-600/5 blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.25em] text-gold-600 mb-5">
              Premium Digital Event Invitations
            </p>
            
            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.98] text-[#1c1a17] tracking-tight mb-8">
              Elegant invitations for <br className="hidden sm:inline" />
              <span className="gold-gradient-text drop-shadow-sm">real celebrations</span>
            </h1>

            <p className="max-w-2xl font-serif text-[#5d5548] text-base sm:text-lg leading-relaxed mb-10">
              Create a refined invitation website with an opening reveal, RSVP, photos, music, maps, and guest messages. No clutter, no app installs, just one beautiful link.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/templates?event=Wedding"
                className="px-8 py-4 bg-gold-600 hover:bg-gold-500 text-black font-montserrat font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-gold-500/10 min-w-[210px] flex items-center justify-center gap-2 group hover:scale-[1.01]"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/templates/royal-tamil"
                className="px-8 py-4 border border-gold-600/35 hover:border-gold-600 text-[#342c25] hover:bg-gold-500/5 font-montserrat font-bold text-xs tracking-widest uppercase transition-all duration-300 min-w-[210px] flex items-center justify-center gap-2"
              >
                View Sample Invite
              </Link>
            </div>

            {/* Quick Features Row */}
            <div className="mt-16 grid w-full max-w-[580px] grid-cols-3 gap-px border border-gold-500/15 bg-gold-500/15 shadow-sm rounded-xl overflow-hidden">
              {[
                { icon: <Wand2 className="w-4 h-4 text-gold-600" />, label: "Edit details" },
                { icon: <Music className="w-4 h-4 text-gold-600" />, label: "Add music" },
                { icon: <Share2 className="w-4 h-4 text-gold-600" />, label: "Share link" }
              ].map((item, idx) => (
                <div key={idx} className="flex min-h-[80px] flex-col items-center justify-center gap-2.5 bg-[#faf6f0] px-3 text-center transition hover:bg-white duration-200">
                  {item.icon}
                  <span className="font-montserrat text-[10px] font-bold text-[#5d5548] uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Statistics Section */}
        <section className="border-y border-gold-500/15 bg-[#faf6f0] py-16 px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-wider text-gold-600">
                Live platform proof
              </p>
              <h2 className="mt-3 max-w-[440px] font-cinzel text-3xl sm:text-4xl font-bold leading-tight text-[#1c1a17]">
                Premium on the surface. Practical underneath.
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden border border-gold-500/15 bg-gold-500/15 shadow-sm rounded-lg">
              {[
                { val: "22+", label: "Live Templates" },
                { val: "1,280+", label: "Active Invites" },
                { val: "45K+", label: "Guest RSVPs" },
                { val: "940+", label: "Served Couples" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white px-5 py-8 text-center sm:text-left shadow-sm">
                  <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-gold-600 leading-none">
                    {stat.val}
                  </div>
                  <p className="mt-3 font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b6660]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Varnam / Features */}
        <section id="why-choose" className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:items-center">
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-wider text-gold-600">
                Why choose varnam
              </p>
              <h2 className="mt-4 max-w-[560px] font-cinzel text-3xl sm:text-5xl font-bold leading-tight text-[#1c1a17] uppercase">
                Premium invitations, kept simple
              </h2>
              <p className="mt-5 max-w-[500px] font-serif text-sm leading-relaxed text-[#6b6660]">
                One event workspace for design, media, billing, RSVP, maps, and guest messages. The invitation remains luxurious, while the owner flow stays practical.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-2 font-montserrat text-[9px] uppercase tracking-wider text-gold-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                  Razorpay Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-2 font-montserrat text-[9px] uppercase tracking-wider text-[#342c25] font-bold">
                  <Lock className="w-3.5 h-3.5 text-gold-600" />
                  Secure Live Dashboard
                </span>
              </div>

              <Link
                href="/templates"
                className="mt-10 inline-flex items-center gap-2 font-montserrat text-xs font-bold text-gold-600 hover:text-gold-700 transition-colors uppercase tracking-wider"
              >
                Browse wedding templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative border border-gold-500/15 bg-white p-6 shadow-xl shadow-gold-500/5 md:p-8 rounded-2xl">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
              
              <div className="grid gap-6 divide-y divide-gold-500/10">
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
                  <div key={idx} className={`grid grid-cols-[40px_1fr] gap-4 ${idx > 0 ? "pt-6" : ""}`}>
                    <div className="flex h-10 w-10 items-center justify-center border border-gold-500/20 bg-gold-500/5 text-gold-600 rounded-full font-montserrat text-[10px] font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[#1c1a17] uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 font-serif text-xs leading-relaxed text-[#6b6660]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gold-500/10 pt-6">
                <p className="font-serif text-lg italic text-[#342c25] leading-relaxed">
                  &ldquo;The design feels high-end, but every guest action is just one tap away.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Templates Gallery */}
        <section className="py-24 px-6 bg-[#faf8f5] border-t border-gold-500/15 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-gold-600 uppercase">
                Our Handcrafted Collection
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl tracking-widest mt-2 uppercase font-bold text-[#1c1a17]">
                Signature Designs
              </h2>
              <div className="h-[2px] w-20 bg-gold-500 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEMPLATES.slice(0, 4).map((tpl) => (
                <div
                  key={tpl.slug}
                  className="group relative flex flex-col bg-white border border-gold-500/10 rounded-2xl overflow-hidden shadow-md shadow-gold-500/5 transition-all duration-300 hover:shadow-2xl hover:border-gold-500/30"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.thumbnailUrl}
                      alt={tpl.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17]/80 via-transparent to-transparent" />
                    
                    <span className="absolute top-4 left-4 bg-white/95 text-[#1c1a17] text-[9px] tracking-widest uppercase px-3 py-1 font-montserrat font-bold shadow-sm rounded-full">
                      {tpl.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-cinzel text-lg text-[#1c1a17] font-bold tracking-wide mb-1 uppercase">
                      {tpl.name}
                    </h3>
                    <p className="font-serif text-xs text-[#6b6660] leading-relaxed mb-6 flex-grow">
                      {tpl.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-gold-500/10 pt-4 mt-auto">
                      <span className="font-cinzel text-base text-gold-700 font-bold">
                        ₹{tpl.price}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          href={`/templates/${tpl.slug}`}
                          className="text-[9px] tracking-widest uppercase font-montserrat text-[#5d5548] hover:text-gold-600 transition-colors px-3 py-2 font-bold"
                        >
                          PREVIEW
                        </Link>
                        <Link
                          href={`/editor/${tpl.slug}`}
                          className="bg-gold-600 text-black text-[9px] tracking-widest uppercase font-montserrat font-bold px-3 py-2 hover:bg-gold-500 transition-colors shadow-sm rounded-md"
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
        <section id="how-it-works" className="py-24 px-6 z-10 border-t border-gold-500/15 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-gold-600 uppercase">
                Simple Creation Process
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl tracking-widest mt-2 uppercase font-bold text-[#1c1a17]">
                How It Works
              </h2>
              <div className="h-[2px] w-20 bg-gold-500 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-gold-600" />,
                  title: "1. Select Theme",
                  desc: "Choose from our premium Hindu, Muslim, Christian, or Secular cultural template gallery."
                },
                {
                  icon: <Heart className="w-6 h-6 text-gold-600" />,
                  title: "2. Personalize Details",
                  desc: "Fill in names, schedules, dress codes, music tracks, map coordinates, and upload photos."
                },
                {
                  icon: <CreditCard className="w-6 h-6 text-gold-600" />,
                  title: "3. Complete Payment",
                  desc: "Process a one-time ₹699 activation fee securely using Razorpay checkout SDK."
                },
                {
                  icon: <Share2 className="w-6 h-6 text-gold-600" />,
                  title: "4. Share with Guests",
                  desc: "Instantly copy your private invitation web link and share it on WhatsApp or email."
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#faf6f0]/50 border border-gold-500/10 p-8 flex flex-col items-center text-center rounded-2xl shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 p-3.5 bg-gold-500/5 rounded-full border border-gold-500/10">{step.icon}</div>
                  <h3 className="font-cinzel text-base text-[#1c1a17] font-bold uppercase tracking-wider mb-2">{step.title}</h3>
                  <p className="font-serif text-xs text-[#6b6660] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Event License */}
        <section id="pricing" className="py-24 px-6 z-10 border-t border-gold-500/15 bg-[#faf8f5] relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-gold-600 uppercase">
                Bespoke Event Licensing
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl tracking-widest mt-2 uppercase font-bold text-[#1c1a17]">
                Pricing Structure
              </h2>
              <div className="h-[2px] w-20 bg-gold-500 mx-auto mt-4" />
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-8 md:p-12 border border-gold-500/20 max-w-lg w-full relative shadow-2xl rounded-2xl flex flex-col items-center text-center">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gold-600 text-black text-[9px] font-montserrat font-bold tracking-widest uppercase px-4 py-1.5 shadow-md rounded-full">
                  SIGNATURE EVENT LICENSE
                </div>

                <span className="font-montserrat text-[10px] text-[#6b6660] font-bold tracking-widest uppercase mt-4 block">
                  ONE-TIME PAYMENT
                </span>
                <div className="flex items-baseline justify-center gap-1 my-4">
                  <span className="font-cinzel text-4xl md:text-5xl font-extrabold text-gold-600">₹699</span>
                  <span className="font-serif text-xs text-[#6b6660]">/ single wedding event</span>
                </div>
                
                <p className="font-serif text-xs text-[#6b6660] leading-relaxed mb-8 max-w-xs">
                  Unlock all premium templates to build, host, and customize your exquisite interactive invitation webpage.
                </p>

                {/* Features List */}
                <ul className="w-full text-left font-sans text-xs text-[#342c25] space-y-3.5 mb-8 border-t border-b border-gold-500/10 py-6">
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
                      <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
                      <span className="font-medium tracking-wide">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/templates"
                  className="w-full py-4 bg-gold-600 hover:bg-gold-500 text-black font-montserrat font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-gold-500/10 rounded-md"
                >
                  SELECT TEMPLATE & START
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Accordion FAQ Section */}
        <section id="faq" className="py-24 px-6 z-10 border-t border-gold-500/15 bg-white relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-gold-600 uppercase">
                Frequently Asked Questions
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl tracking-widest mt-2 uppercase font-bold text-[#1c1a17]">
                F.A.Q.
              </h2>
              <div className="h-[2px] w-20 bg-gold-500 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gold-500/10 bg-[#faf6f0]/30 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left font-cinzel text-sm sm:text-base font-bold text-[#1c1a17] hover:bg-gold-500/5 transition-colors cursor-pointer"
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
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 font-serif text-xs sm:text-sm text-[#5d5548] leading-relaxed border-t border-gold-500/5">
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
        <footer className="w-full py-12 px-6 border-t border-gold-500/15 bg-white z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="font-cinzel text-xl font-extrabold tracking-widest bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                VARNAM
              </span>
              <p className="font-serif text-[10px] text-[#6b6660]">
                © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
              </p>
            </div>

            <div className="flex gap-8 font-montserrat text-[9px] tracking-widest text-[#5d5548] font-bold">
              <Link href="/templates" className="hover:text-gold-600 transition-colors uppercase">GALLERY</Link>
              <a href="#how-it-works" className="hover:text-gold-600 transition-colors uppercase">PROCESS</a>
              <a href="#why-choose" className="hover:text-gold-600 transition-colors uppercase">WHY US</a>
              <a href="#faq" className="hover:text-gold-600 transition-colors uppercase">FAQ</a>
            </div>
          </div>
        </footer>
      </div>
  );
}
