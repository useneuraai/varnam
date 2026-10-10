import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Varnam Invites",
  description:
    "Read the terms and conditions for single template licensing, publishing, and hosting services on Varnam Invites.",
  alternates: {
    canonical: "https://www.varnaminvites.store/terms-of-service",
  },
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
            <Link href="/login" className="text-xs tracking-widest text-zinc-600 hover:text-zinc-900 font-bold uppercase transition-colors">
              SIGN IN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-16 sm:py-20 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900">Terms &amp; Conditions</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-wider">
          Last Updated: October 10, 2026
        </p>

        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-7 text-sm sm:text-[15px] leading-relaxed">
          <p className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">
            Welcome to Varnam Invites (&ldquo;Varnam,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a digital wedding invitation website service operated by an individual in India. These Terms &amp; Conditions govern your access to our website, invitation builder, templates, publishing and hosting services, and related features.
          </p>

          <p>
            By using Varnam or purchasing a license, you agree to these Terms. If you do not agree, please do not use the service.
          </p>

          {/* Section 1 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              1. About Varnam
            </h2>
            <p>
              Varnam allows customers to create, customize, publish, and share digital wedding invitation websites. Depending on the selected template and features, the service may include photo galleries, music, event schedules, venue information, maps, countdowns, RSVPs, and guest wishes.
            </p>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1.5 text-xs sm:text-sm">
              <p><strong className="text-zinc-900">Service operator:</strong> [Insert the operator&apos;s full legal name]</p>
              <p><strong className="text-zinc-900">Business contact:</strong> <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a></p>
              <p><strong className="text-zinc-900">Business address:</strong> [Insert the required business/contact address]</p>
              <p><strong className="text-zinc-900">Website:</strong> <a href="https://www.varnaminvites.store/" className="text-[#916710] underline hover:text-zinc-950 font-medium">https://www.varnaminvites.store/</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              2. Templates, Pricing, and License
            </h2>
            <p>Varnam offers the following one-time license options:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-800">
              <li><strong>Classic Template License:</strong> ₹999 per invitation website.</li>
              <li><strong>Premium 3D Template License:</strong> ₹1,199 per invitation website.</li>
            </ul>
            <p>
              These prices are inclusive of applicable taxes, subject to confirmation of the operator&apos;s tax obligations and checkout configuration.
            </p>
            <p>
              Each purchase grants the customer a non-exclusive, non-transferable license to use the selected template to create and publish one wedding invitation website for the event specified at purchase.
            </p>
            <p>
              Each additional invitation website requires a separate purchase unless Varnam expressly states otherwise.
            </p>
            <p>
              The license does not transfer ownership of Varnam&apos;s templates, source code, visual designs, animations, branding, or other intellectual property.
            </p>
            <p>
              Customers may preview and customize an invitation before payment. Payment is required to activate the purchased publishing service. Any exceptions or additional charges will be clearly disclosed before purchase.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              3. Customer Content and Intellectual Property
            </h2>
            <p>
              Customers retain ownership of the photographs, text, music, and other content they upload, to the extent they own or lawfully control that content.
            </p>
            <p>
              By uploading content, the customer grants Varnam permission to store, process, reproduce, display, and transmit it only as reasonably necessary to operate, publish, host, and support the invitation and related features.
            </p>
            <p>
              Customers are responsible for ensuring they have the necessary rights and permissions to upload and share their content, including photographs, music, and information relating to other individuals.
            </p>
            <p>
              Customers must not upload unlawful, infringing, abusive, deceptive, or otherwise prohibited content. Varnam may restrict or remove content when reasonably necessary to address legal obligations, security concerns, or misuse.
            </p>
            <p>
              Varnam retains all rights in its own templates, code, brand assets, and platform technology.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              4. Hosting, Access, and Archiving
            </h2>
            <p>
              Published invitation websites are intended to remain available on an ongoing basis after purchase, subject to these Terms, technical availability, security requirements, and applicable law.
            </p>
            <p className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-zinc-800 text-xs sm:text-sm">
              <strong>Ongoing Access:</strong> Varnam does not impose an automatic five-day post-wedding expiration under this policy.
            </p>
            <p>
              Customers should retain their own copies of important photographs and other uploaded content. Hosting availability does not guarantee that content will be stored indefinitely.
            </p>
            <p>
              If a customer requests removal of an invitation, Varnam will disable public access within a reasonable operational period and handle the associated data in accordance with the Privacy Policy and applicable law.
            </p>
            <p>
              Varnam may archive an inactive invitation or restrict access where reasonably necessary for security, legal compliance, abuse prevention, or service maintenance. Where practicable, customers will be informed of material changes affecting access.
            </p>
            <p>
              Archived data may be retained for a limited period for restoration, support, security, or legal purposes. Archiving does not necessarily mean permanent preservation or immediate deletion.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              5. Customer Responsibilities
            </h2>
            <p>
              Customers are responsible for checking the accuracy of their invitation before sharing it, including names, dates, times, venue details, contact information, and event schedules.
            </p>
            <p>
              Customers should keep their login credentials secure and notify Varnam if they suspect unauthorized access.
            </p>
            <p>
              Customers must not use Varnam to distribute malware, infringe intellectual property, violate privacy, harass individuals, or engage in unlawful activity.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              6. Payments and Refunds
            </h2>
            <p>
              Payments are processed through the payment provider displayed at checkout. Varnam does not intentionally collect or store full payment-card details.
            </p>
            <p>
              The applicable <Link href="/refund-policy" className="text-[#916710] underline hover:text-zinc-950 font-medium">Cancellation &amp; Refund Policy</Link> forms part of these Terms. Customers retain any rights and remedies available under applicable law.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              7. Service Availability
            </h2>
            <p>
              Varnam uses third-party hosting and infrastructure providers to deliver its services. We take reasonable steps to maintain availability and protect the platform, but uninterrupted service cannot be guaranteed.
            </p>
            <p>
              Temporary downtime may occur because of maintenance, network issues, third-party outages, security incidents, or circumstances beyond our reasonable control.
            </p>
            <p>
              Nothing in these Terms excludes liability or remedies that cannot lawfully be excluded under applicable law.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              8. Suspension and Termination
            </h2>
            <p>
              Varnam may temporarily restrict access when reasonably necessary to investigate suspected abuse, protect customers, address security risks, comply with legal obligations, or prevent harm to the platform.
            </p>
            <p>
              Where appropriate and legally permitted, Varnam will notify the customer and provide an opportunity to resolve the issue.
            </p>
            <p>
              Customers may request removal of their published invitation at any time, subject to any necessary processing of transaction records or other information that must be retained by law.
            </p>
            <p>
              Termination or removal does not eliminate rights or obligations that accrued before termination, including applicable refund rights.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              9. Privacy
            </h2>
            <p>
              Varnam processes personal information as described in its <Link href="/privacy-policy" className="text-[#916710] underline hover:text-zinc-950 font-medium">Privacy Policy</Link>. By using the service, customers acknowledge that relevant information is processed to provide the requested features and operate the platform, subject to applicable law.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              10. Changes to the Service or Terms
            </h2>
            <p>
              Varnam may update its services or these Terms to reflect changes in features, technology, legal requirements, or business operations.
            </p>
            <p>
              Material changes will be communicated through an appropriate notice where required. Updated terms will state their effective date. Changes will not remove rights that customers already have under applicable law.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              11. Governing Law and Disputes
            </h2>
            <p>
              These Terms are governed by the laws of India, subject to applicable consumer-protection requirements and the jurisdiction of competent courts or authorities.
            </p>
            <p>
              Customers may contact Varnam to attempt an informal resolution of a dispute. This does not prevent customers from exercising statutory rights or approaching an appropriate consumer authority.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              12. Contact
            </h2>
            <p>For questions, complaints, or support:</p>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1.5 text-xs sm:text-sm">
              <p><strong className="text-zinc-900">Email:</strong> <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a></p>
              <p><strong className="text-zinc-900">WhatsApp:</strong> <a href="https://wa.me/917200180268" target="_blank" rel="noopener noreferrer" className="text-[#916710] underline hover:text-zinc-950 font-medium">+91 7200180268</a></p>
              <p><strong className="text-zinc-900">Support hours:</strong> Monday–Saturday, 9:00 AM–8:00 PM IST</p>
              <p><strong className="text-zinc-900">Operator:</strong> [Insert full legal name]</p>
              <p><strong className="text-zinc-900">Business address:</strong> [Insert required address]</p>
            </div>
          </section>
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
