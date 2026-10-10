import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, MapPin, Clock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Varnam Invites",
  description:
    "Get in touch with the Varnam Invites team. We provide dedicated concierge assistance for digital wedding invitations, template customization, and event inquiries.",
  alternates: {
    canonical: "https://www.varnaminvites.store/contact",
  },
  openGraph: {
    title: "Contact Us | Varnam Invites",
    description:
      "Reach out to Varnam Invites for dedicated support on digital wedding invitation websites.",
    url: "https://www.varnaminvites.store/contact",
    type: "website",
    images: ["https://www.varnaminvites.store/og-image.jpg"],
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Varnam Invites",
  description: "Official contact page for Varnam Invites digital wedding invitation platform.",
  url: "https://www.varnaminvites.store/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Varnam Invites",
    url: "https://www.varnaminvites.store/",
    logo: "https://www.varnaminvites.store/logo.png",
    email: "hello@varnaminvites.store",
    sameAs: ["https://www.instagram.com/varnaminvites"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@varnaminvites.store",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil", "Hindi", "Telugu"],
    },
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-800 flex flex-col selection:bg-gold-200 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png?v=lotus-gold"
              alt="Varnam Invites"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
            />
            <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.2em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent">
              VARNAM
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/templates"
              className="text-xs tracking-widest text-[#b3811b] hover:text-[#916710] font-bold uppercase transition-colors"
            >
              TEMPLATES
            </Link>
            <Link
              href="/about"
              className="text-xs tracking-widest text-zinc-500 hover:text-zinc-900 font-bold uppercase transition-colors"
            >
              ABOUT
            </Link>
            <Link
              href="/login"
              className="text-xs tracking-widest text-zinc-500 hover:text-zinc-900 font-bold uppercase transition-colors"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 sm:py-20 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-900">Contact</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Concierge Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-4">
          Get in Touch with Varnam Invites
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed mb-10 max-w-2xl">
          Whether you need assistance choosing a template, configuring your custom music, or have questions about publishing your invitation link, we are here to help.
        </p>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Email Support Card */}
          <div className="p-7 bg-[#fffdfa] rounded-2xl border border-amber-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#916710] mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-1">Official Email</h2>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                For order inquiries, custom branding requests, and technical assistance.
              </p>
            </div>
            <a
              href="mailto:hello@varnaminvites.store"
              className="text-sm font-bold text-[#916710] hover:text-[#72510b] transition-colors flex items-center gap-1.5"
            >
              hello@varnaminvites.store
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* WhatsApp Concierge Card */}
          <div className="p-7 bg-[#fbfbfb] rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-1">WhatsApp Concierge</h2>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Instant chat support for couples customizing their live wedding invitations.
              </p>
            </div>
            <a
              href="https://wa.me/919342277028?text=Hello%20Varnam%20Invites%20Team,%20I%20have%20an%20inquiry%20regarding%20digital%20wedding%20invitations."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5"
            >
              Chat on WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Studio Location */}
          <div className="p-7 bg-[#fbfbfb] rounded-2xl border border-zinc-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Creative Studio</h2>
            <p className="text-xs text-zinc-600 leading-relaxed mb-2">
              Based in Kanchipuram, Tamil Nadu, India.
            </p>
            <p className="text-xs text-zinc-500">
              Operating globally with online invitations shared across India, the US, UK, Canada, UAE, Singapore, and Malaysia.
            </p>
          </div>

          {/* Business Hours */}
          <div className="p-7 bg-[#fbfbfb] rounded-2xl border border-zinc-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Support Hours</h2>
            <p className="text-xs text-zinc-600 leading-relaxed mb-2">
              Monday – Sunday: 9:00 AM – 9:00 PM IST
            </p>
            <p className="text-xs text-zinc-500">
              Our automated publishing and RSVP tracking platform operates 24/7/365 without interruption.
            </p>
          </div>
        </div>

        {/* Assurance Box */}
        <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-[#916710] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Try Any Template Before You Pay</h3>
              <p className="text-xs text-zinc-600">
                You can personalize any template for free in our live studio. No payment required until you decide to publish.
              </p>
            </div>
          </div>
          <Link
            href="/templates"
            className="px-6 py-3 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-sm shrink-0"
          >
            EXPLORE TEMPLATES
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-zinc-150 bg-[#fafaf9] z-10 text-center flex flex-col items-center justify-center gap-3">
        <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] tracking-wider text-zinc-500 font-bold uppercase justify-center">
          <Link href="/about" className="hover:text-zinc-900 transition-colors">
            About
          </Link>
          <span>·</span>
          <Link href="/templates" className="hover:text-zinc-900 transition-colors">
            Templates
          </Link>
          <span>·</span>
          <a
            href="https://www.instagram.com/varnaminvites"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            Instagram
          </a>
          <span>·</span>
          <Link href="/terms-of-service" className="hover:text-zinc-900 transition-colors">
            Terms &amp; Conditions
          </Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/refund-policy" className="hover:text-zinc-900 transition-colors">
            Refund Policy
          </Link>
        </div>
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Varnam Invites. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
