import Link from "next/link";
import { Sparkles, Heart, Globe, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us | Varnam Digital Wedding Invitations",
  description: "Learn about Varnam, our mission to create ultra-premium, interactive, and cinematic digital wedding invitation websites for modern couples.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-800 flex flex-col selection:bg-gold-200 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="Varnam" className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm" />
            <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.2em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent">
              VARNAM
            </span>
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
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900">About Us</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Our Story &amp; Craft
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-8">
          Crafting Unforgettable Wedding Invitations for the Digital Age
        </h1>

        <div className="prose prose-zinc max-w-none text-zinc-650 space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="text-base sm:text-lg text-zinc-700 font-normal leading-relaxed">
            Varnam was founded on a simple belief: your wedding invitation shouldn't be a flat paper card or a static PDF. It should be a living, breathing digital experience that captures the joy, elegance, and grandeur of your special day.
          </p>

          <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150">
              <Sparkles className="w-6 h-6 text-[#916710] mb-3" />
              <h2 className="text-base font-bold text-zinc-900 mb-2">Cinematic Artistry</h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                From golden temple arches to interactive scratch-to-reveal cards with falling rose petals, every template is crafted with cinematic micro-animations.
              </p>
            </div>

            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150">
              <Globe className="w-6 h-6 text-[#916710] mb-3" />
              <h2 className="text-base font-bold text-zinc-900 mb-2">Effortless Sharing</h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                One single link to share across WhatsApp, SMS, and Instagram. Your guests get instant access on mobile or desktop without needing to install an app.
              </p>
            </div>

            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150">
              <Heart className="w-6 h-6 text-[#916710] mb-3" />
              <h2 className="text-base font-bold text-zinc-900 mb-2">Interactive Guest Experience</h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Interactive RSVPs, live guest count tracking, blessings wall, Google Maps navigation, and custom background music players tailored to your celebration.
              </p>
            </div>

            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-150">
              <ShieldCheck className="w-6 h-6 text-[#916710] mb-3" />
              <h2 className="text-base font-bold text-zinc-900 mb-2">Transparent Licensing</h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Try before you pay. Customize your template for free, and activate your live link with a simple one-time payment (Classic ₹999 / Premium ₹1,199).
              </p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 pt-4">
            How Varnam Works
          </h2>
          <p>
            Couples can choose from our curated collection of Classic (₹999) and Premium (₹1,199) templates. In our live studio, you can fill in your ceremonial dates, venue coordinates, wedding verses, photo slideshows, and favorite music tracks.
          </p>
          <p>
            Once you are completely satisfied with how your invitation looks and feels, a secure one-time payment publishes your custom URL. Your invitation remains live, active, and freely editable until 5 days after your wedding celebrations conclude.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 pt-4">
            Rooted in Heritage, Built for Tomorrow
          </h2>
          <p>
            Based out of Kanchipuram, Tamil Nadu, we take deep inspiration from India's rich architectural motifs, festive floral traditions, and royal ceremonial heritage, harmonized with cutting-edge modern web animation technology.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-[#fafaf9] border border-zinc-200/80 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Ready to design your wedding invitation?</h2>
          <p className="text-xs text-zinc-600 mb-6">Explore our curated templates and preview your invite for free.</p>
          <Link
            href="/templates"
            className="inline-flex px-8 py-3.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-sm"
          >
            EXPLORE TEMPLATES
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-zinc-150 bg-[#fafaf9] z-10 text-center flex flex-col items-center justify-center gap-3">
        <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] tracking-wider text-zinc-500 font-bold uppercase justify-center">
          <Link href="/about" className="hover:text-zinc-900 transition-colors">About</Link>
          <span>·</span>
          <a href="mailto:hello@varnaminvites.store" className="hover:text-zinc-900 transition-colors">Contact</a>
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
