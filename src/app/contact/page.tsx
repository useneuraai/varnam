import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us | Varnam Digital Wedding Invitations",
  description: "Get in touch with the Varnam support and creative concierge team for wedding invitation assistance, inquiries, or custom design requests.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-800 flex flex-col selection:bg-gold-200 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-widest text-zinc-900">
            VARNAM
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/templates" className="text-xs tracking-widest text-[#b3811b] hover:text-[#916710] font-bold uppercase transition-colors">
              TEMPLATES
            </Link>
            <Link href="/login" className="text-xs tracking-widest text-zinc-500 hover:text-zinc-900 font-bold uppercase transition-colors">
              SIGN IN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 sm:py-20 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900">Contact Us</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Concierge Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-4">
          We're Here to Help Your Big Day Shine
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 mb-12 max-w-2xl leading-relaxed">
          Have questions about customizing a template, payment verification, audio uploads, or need personalized design advice? Reach out directly through any of our channels below.
        </p>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp Direct */}
          <div className="p-6 bg-[#fafaf9] rounded-2xl border border-zinc-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 mb-1">WhatsApp Concierge</h2>
              <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                Fastest support for live order help, music uploads, and template customizations.
              </p>
              <p className="text-sm font-bold text-zinc-900">+91 7200180268</p>
            </div>
            <a
              href="https://wa.me/917200180268?text=Hello%20Varnam%20team,%20I%20have%20an%20inquiry%20regarding%20a%20wedding%20invitation."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-xs"
            >
              CHAT ON WHATSAPP
            </a>
          </div>

          {/* Email Support */}
          <div className="p-6 bg-[#fafaf9] rounded-2xl border border-zinc-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-[#916710]">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 mb-1">Email Support</h2>
              <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                For order receipts, technical questions, partnership requests, or custom requirements.
              </p>
              <p className="text-sm font-bold text-zinc-900">hello@varnaminvites.store</p>
            </div>
            <a
              href="mailto:hello@varnaminvites.store"
              className="mt-6 inline-flex items-center justify-center px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-xs"
            >
              SEND AN EMAIL
            </a>
          </div>

          {/* Studio Address */}
          <div className="p-6 bg-[#fafaf9] rounded-2xl border border-zinc-200/80">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 mb-1">Registered Studio</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              115A, Ekambaranathar Sannathi Street,<br />
              Kanchipuram, Tamil Nadu - 631502,<br />
              India
            </p>
          </div>

          {/* Operating Hours */}
          <div className="p-6 bg-[#fafaf9] rounded-2xl border border-zinc-200/80">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 mb-1">Operating Hours</h2>
            <p className="text-xs text-zinc-600 leading-relaxed mb-2">
              Monday to Saturday: 9:00 AM – 8:00 PM IST
            </p>
            <p className="text-xs text-zinc-500">
              Sunday: Priority WhatsApp desk for same-week weddings.
            </p>
          </div>
        </div>

        {/* Quick FAQ note */}
        <div className="p-6 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-center">
          <p className="text-xs text-zinc-600">
            Looking for answers to common questions about RSVP tracking, editing after publishing, or pricing?{" "}
            <Link href="/#faq" className="text-[#916710] font-bold underline hover:text-zinc-900">
              Check our FAQ section
            </Link>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-zinc-150 bg-[#fafaf9] z-10 text-center flex flex-col items-center justify-center gap-3">
        <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] tracking-wider text-zinc-500 font-bold uppercase justify-center">
          <Link href="/about" className="hover:text-zinc-900 transition-colors">About</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link>
          <span>·</span>
          <Link href="/terms-of-service" className="hover:text-zinc-900 transition-colors">Terms &amp; Conditions</Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/refund-policy" className="hover:text-zinc-900 transition-colors">Refund Policy</Link>
        </div>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
