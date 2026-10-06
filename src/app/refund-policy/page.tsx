import Link from "next/link";

export const metadata = {
  title: "Cancellation & Refund Policy | Varnam",
  description: "Read our transparent cancellation and refund policy for digital wedding invitation website licensing.",
};

export default function RefundPolicyPage() {
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
      <main className="flex-grow max-w-3xl mx-auto px-6 py-16 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900">Refund Policy</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Customer Assurance
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-4">
          Cancellation &amp; Refund Policy
        </h1>
        <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-wider">
          Last Updated: October 5, 2026
        </p>

        <div className="prose prose-zinc text-zinc-650 space-y-6 text-sm leading-relaxed">
          <p className="text-base text-zinc-700 leading-relaxed font-normal">
            At Varnam, our goal is to ensure you and your guests are delighted with your digital wedding invitation website. We proudly operate on a <strong>"Try Before You Pay"</strong> model: you can customize your invitation, test features, and preview the full interactive website for free before making any financial commitment.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">1. Digital Licensing Model</h2>
          <p>
            Varnam charges a one-time licensing fee per template (Classic at ₹999, Premium at ₹1,199) strictly to activate, publish, and host your live invitation link with unlimited photo uploads, music streaming, and RSVP tracking.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">2. Eligible Refund Circumstances</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700">
            <li>
              <strong>Duplicate Transactions:</strong> If your card or UPI was charged multiple times due to a network glitch during checkout, 100% of the duplicate charge will be refunded immediately without question.
            </li>
            <li>
              <strong>Technical Non-Delivery:</strong> If a technical failure on our platform prevents your customized link from generating or being hosted after payment, and our support team cannot resolve it within 12 hours, you are entitled to a full 100% refund.
            </li>
            <li>
              <strong>Pre-Distribution Cancellation (Within 24 Hours):</strong> If you change your mind within 24 hours of payment and before your invitation link has been actively shared or any RSVPs received, you may request a cancellation and full refund or template credit.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">3. Non-Refundable Circumstances</h2>
          <p>
            Because Varnam provides a fully interactive preview prior to payment and digital hosting resources are provisioned immediately upon publication:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700">
            <li>
              Refunds cannot be issued once the invitation link has been actively shared with guests, visited by attendees, or guest RSVPs/wishes have been logged.
            </li>
            <li>
              Refunds are not granted for typos, date changes, or venue updates — all invitation details remain <strong>freely editable anytime until 5 days after your wedding event</strong> through your Studio dashboard.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">4. Refund Processing Time</h2>
          <p>
            Approved refunds are initiated immediately and credited to the original payment method (Bank Account, Credit/Debit Card, or UPI) within <strong>5 to 7 business days</strong>, subject to your issuing bank's settlement policies.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">5. How to Initiate a Request</h2>
          <p>
            To request assistance or initiate a refund, please contact our concierge team with your order reference ID:
          </p>
          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs space-y-1 text-zinc-700">
            <p><strong>Email:</strong> hello@varnaminvites.store</p>
            <p><strong>WhatsApp:</strong> +91 7200180268</p>
            <p><strong>Operating Hours:</strong> Monday – Saturday, 9:00 AM – 8:00 PM IST</p>
          </div>
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
