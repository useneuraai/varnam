import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Varnam",
  description: "Read the rules, terms, and agreements for hosting your digital invites on Varnam.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-800 selection:bg-gold-200 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-widest text-zinc-900">
            VARNAM
          </Link>
          <Link href="/templates" className="text-[11px] tracking-widest text-zinc-650 hover:text-zinc-900 transition-colors font-bold uppercase">
            TEMPLATES
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-8">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-8 font-bold">Last Updated: July 15, 2026</p>
        
        <div className="prose prose-zinc text-zinc-650 space-y-6 text-sm leading-relaxed">
          <p>
            Welcome to Varnam! These Terms of Service govern your use of our digital wedding invitation building tools, websites, and related hosting services.
          </p>
          
          <h2 className="text-lg font-bold text-zinc-900 pt-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms. If you do not agree to all of the terms, you may not access the service.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">2. Event Licensing & Payment</h2>
          <p>
            Varnam operates on a one-time pay-per-event licensing model. For a fee of ₹799, you receive a single active license to publish one digital wedding invitation website. Drafting templates is free; payment is required to activate and publish the invitation URL.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">3. Content Ownership & Responsibility</h2>
          <p>
            You retain all rights to any images, music, or text you upload to your custom invitation website. You are solely responsible for ensuring you have the legal right to upload and share this content, and that it does not violate any third-party intellectual property rights.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">4. Event Archiving & Active License Term</h2>
          <p>
            Your dynamic wedding invitation website remains active, editable, and accessible to guests until 5 days after your scheduled wedding date. After this 5-day grace period, the invitation is locked, archived securely, and your license is considered exhausted.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">5. Disclaimer</h2>
          <p>
            Varnam services are provided "as is" and we offer no guarantees regarding absolute uptime or data permanence. We reserve the right to suspend accounts violating acceptable use policies.
          </p>
        </div>
      </main>
    </div>
  );
}
