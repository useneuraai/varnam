import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Varnam",
  description: "Learn how we handle your personal data and invitation details securely.",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8 font-bold">Last Updated: July 15, 2026</p>
        
        <div className="prose prose-zinc text-zinc-650 space-y-6 text-sm leading-relaxed">
          <p>
            At Varnam, accessible from https://varnam-invites.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Varnam and how we use it.
          </p>
          
          <h2 className="text-lg font-bold text-zinc-900 pt-4">1. Information We Collect</h2>
          <p>
            When you create a digital wedding invitation on Varnam, we collect the details you provide to populate the invitation, including bride and groom names, event dates, venues, contact details, and uploads (images and audio files).
          </p>
          <p>
            For registration and login, we collect your email address via Supabase Authentication. We do not store or process your payment card information directly; all financial transactions are processed securely through Razorpay.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to publish and display your wedding invitation page, process transactions, manage RSVPs, display guest wish boards, and improve our services.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">3. Data Retention</h2>
          <p>
            All custom invitations, photos, and RSVP details are retained on our servers and are editable up to 5 days after the completed event date. After this archive period, the license is exhausted and the invitation is archived securely.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 pt-4">4. Security</h2>
          <p>
            We prioritize secure data transmission and use Industry Standard encryption protocols. However, please remember that no method of transmission over the Internet is 100% secure.
          </p>
        </div>
      </main>
    </div>
  );
}
