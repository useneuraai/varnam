import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Varnam",
  description: "Read the terms and conditions for single template licensing and hosting on Varnam.",
};

export default function TermsOfServicePage() {
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

      {/* Content */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-16 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900">Terms &amp; Conditions</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-4">Terms &amp; Conditions</h1>
        <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-wider">Last Updated: October 5, 2026</p>
        
        <div className="prose prose-zinc text-zinc-650 space-y-6 text-sm leading-relaxed">
          <p>
            Welcome to Varnam! These Terms &amp; Conditions govern your use of our digital wedding invitation website builder, hosting services, and related features.
          </p>
          
          <h2 className="text-lg font-bold text-zinc-900 pt-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these terms, you may not access or use the platform.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">2. Single Template Licensing &amp; Pricing</h2>
          <p>
            Varnam operates on a transparent single-template licensing model:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700">
            <li><strong>Classic Template License:</strong> ₹999 per single wedding invitation website.</li>
            <li><strong>Premium 3D Template License:</strong> ₹1,199 per single wedding invitation website.</li>
            <li>Each payment grants a license to customize, publish, and host <strong>one specific invitation website</strong> using the purchased template. Each additional template or event requires an independent license purchase.</li>
            <li>Drafting, customizing details, uploading photos, and previewing any template is 100% free; payment is required only to activate and publish your shareable live link.</li>
          </ul>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">3. Content Ownership &amp; Upload Rights</h2>
          <p>
            You retain complete ownership of all personal images, music tracks, stories, and text uploaded to your invitation website. You are solely responsible for ensuring you have lawful authorization to use and share the uploaded content.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">4. Active Hosting &amp; Archival Period</h2>
          <p>
            Your dynamic wedding invitation website remains fully live, active, and editable until <strong>5 days after your scheduled wedding date</strong>. After this 5-day grace period, the invitation is locked, archived securely, and your license is considered exhausted.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">5. Disclaimer &amp; Service Availability</h2>
          <p>
            Varnam services are delivered over high-speed cloud infrastructure. While we strive for 99.9% uptime, services are provided on an "as is" and "as available" basis without warranties of uninterrupted availability.
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
