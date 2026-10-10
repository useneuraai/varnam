import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Varnam Invites",
  description:
    "Read our transparent cancellation and refund policy for digital wedding invitation website licensing, activation, and support.",
  alternates: {
    canonical: "https://www.varnaminvites.store/refund-policy",
  },
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
          <span className="text-zinc-900">Refund Policy</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Customer Assurance
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-3">
          Cancellation &amp; Refund Policy
        </h1>
        <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-wider">
          Last Updated: October 10, 2026
        </p>

        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-7 text-sm sm:text-[15px] leading-relaxed">
          <p className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">
            Varnam Invites allows customers to preview and customize a digital wedding invitation before paying to activate and publish it. This policy explains when a cancellation or refund may be requested.
          </p>

          <p>
            This policy should be read together with the <Link href="/terms-of-service" className="text-[#916710] underline hover:text-zinc-950 font-medium">Terms &amp; Conditions</Link>. It does not limit any rights or remedies available under applicable law.
          </p>

          {/* Section 1 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              1. Prices and Digital Service
            </h2>
            <p>Varnam offers the following one-time licenses:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-800">
              <li><strong>Classic Template:</strong> ₹999.</li>
              <li><strong>Premium 3D Template:</strong> ₹1,199.</li>
            </ul>
            <p>
              Prices are intended to be inclusive of applicable taxes, subject to the operator&apos;s tax obligations and checkout configuration.
            </p>
            <p>
              The purchase activates the selected invitation website and the associated publishing and hosting features described at checkout.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              2. Duplicate Payments
            </h2>
            <p>
              If a customer is charged more than once for the same purchase due to a payment or network issue, the customer may contact Varnam with the transaction references.
            </p>
            <p>
              Once the duplicate charge is verified, Varnam will initiate a refund for the duplicate payment.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              3. Technical Non-Delivery
            </h2>
            <p>
              If a verified payment is received but a technical failure prevents Varnam from activating or publishing the purchased invitation, the customer should contact support.
            </p>
            <p>
              Varnam will make reasonable efforts to resolve the issue. If the issue cannot be resolved within 12 hours after the support team has received sufficient details, the customer may request a full refund.
            </p>
            <p className="text-xs text-zinc-500">
              This 12-hour period is a support-resolution target for this refund category and does not limit any statutory rights or remedies that may apply.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              4. Change-of-Mind Requests
            </h2>
            <p>
              Customers may request a change-of-mind cancellation within 24 hours of payment, provided the invitation has not been actively distributed to guests and no guest RSVPs or wishes have been received.
            </p>
            <p>
              Eligible requests may be approved for a refund or, with the customer&apos;s agreement, a credit.
            </p>
            <p>
              Requests outside these conditions may be considered individually. Use of a digital invitation does not remove any legal right to a remedy where the service has not been delivered as promised, is materially defective, or is materially different from its description.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              5. Service Issues and Other Refund Requests
            </h2>
            <p>
              Customers may contact Varnam if the service is materially defective, unavailable in a way that substantially prevents its intended use, or does not conform to the features or terms represented at purchase.
            </p>
            <p>
              Varnam will review the circumstances and determine an appropriate remedy, which may include troubleshooting, correction, restoration, replacement functionality, a credit, or a refund, as appropriate and subject to applicable law.
            </p>
            <p>
              Minor mistakes in customer-provided text, wedding dates, or venue details are generally expected to be corrected through the available editing features. They do not automatically qualify for a refund where the platform is functioning as described.
            </p>
            <p className="font-medium text-zinc-900">
              Nothing in this policy excludes remedies required by law.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              6. Hosting and Cancellation
            </h2>
            <p>
              Published invitation websites are intended to remain available on an ongoing basis. There is no automatic five-day post-wedding expiration under this policy.
            </p>
            <p>
              Customers may request that their invitation be removed from public access. A removal request does not automatically create a right to a refund for a service that has already been provided, but it also does not waive any refund or consumer rights available under applicable law.
            </p>
            <p>
              Following removal, invitation data may be archived for a limited period and handled in accordance with the <Link href="/privacy-policy" className="text-[#916710] underline hover:text-zinc-950 font-medium">Privacy Policy</Link>. Customers should retain copies of important content before requesting removal.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              7. Refund Method and Processing
            </h2>
            <p>
              Approved refunds will generally be initiated to the original payment method through the payment provider.
            </p>
            <p>
              Varnam will communicate the expected processing period when approving the refund. The time taken for the funds to appear may depend on the payment provider, bank, or payment network.
            </p>
            <p>
              No term in this section overrides a processing deadline imposed by applicable law.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              8. How to Request a Cancellation or Refund
            </h2>
            <p>Contact Varnam with the following information:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-800 text-xs sm:text-sm">
              <li>Name and email address associated with the order.</li>
              <li>Order or payment reference.</li>
              <li>Date and amount of payment.</li>
              <li>A brief explanation of the request.</li>
              <li>Relevant screenshots or error details, where helpful.</li>
            </ul>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1.5 text-xs sm:text-sm mt-3">
              <p><strong className="text-zinc-900">Email:</strong> <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a></p>
              <p><strong className="text-zinc-900">WhatsApp:</strong> <a href="https://wa.me/917200180268" target="_blank" rel="noopener noreferrer" className="text-[#916710] underline hover:text-zinc-950 font-medium">+91 7200180268</a></p>
              <p><strong className="text-zinc-900">Support hours:</strong> Monday–Saturday, 9:00 AM–8:00 PM IST</p>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Please avoid sending full card numbers, passwords, or other unnecessary sensitive information.
            </p>
            <p>
              Varnam will review the request and respond within a reasonable period. Any applicable statutory complaint-handling requirements will be followed.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              9. Complaints and Escalation
            </h2>
            <p>
              If a customer is dissatisfied with the handling of a refund or cancellation request, they may ask for the complaint to be reviewed by the responsible operator.
            </p>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1.5 text-xs sm:text-sm">
              <p><strong className="text-zinc-900">Responsible operator:</strong> [Insert full legal name]</p>
              <p><strong className="text-zinc-900">Grievance contact / designation:</strong> [Confirm before publication]</p>
              <p><strong className="text-zinc-900">Email:</strong> <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a></p>
              <p><strong className="text-zinc-900">Business address:</strong> [Insert required address]</p>
            </div>
            <p>
              Customers retain the right to approach the appropriate consumer-protection authority or other competent forum where permitted by law.
            </p>
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
