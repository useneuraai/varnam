import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Varnam Invites",
  description:
    "Learn what personal information Varnam Invites collects, how it is used, and how your wedding invitation data is handled securely.",
  alternates: {
    canonical: "https://www.varnaminvites.store/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
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
          <span className="text-zinc-900">Privacy Policy</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-[#916710] uppercase block mb-3">
          Data Protection
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-wider">
          Last Updated: October 10, 2026
        </p>

        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-7 text-sm sm:text-[15px] leading-relaxed">
          <p className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">
            Varnam Invites (&ldquo;Varnam,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates <a href="https://www.varnaminvites.store/" className="text-[#916710] underline hover:text-zinc-950 font-medium">https://www.varnaminvites.store/</a> and provides digital wedding invitation creation, publishing, hosting, and related services.
          </p>

          <p>
            This Privacy Policy explains what personal information we collect, why we use it, how it may be shared, and how customers and visitors can contact us about their information.
          </p>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1.5 text-xs sm:text-sm">
            <p><strong className="text-zinc-900">Data controller / responsible operator:</strong> [Insert full legal name]</p>
            <p><strong className="text-zinc-900">Contact email:</strong> <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a></p>
            <p><strong className="text-zinc-900">Business address:</strong> [Insert required address]</p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              1. Information We Collect
            </h2>
            <p>
              Depending on how you use Varnam, we may process the following information:
            </p>
            
            <div className="space-y-3 pl-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Account information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-800 text-xs sm:text-sm">
                  <li>Email address and authentication information used to register and sign in.</li>
                  <li>Account preferences and information needed to maintain your account.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Invitation information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-800 text-xs sm:text-sm">
                  <li>Names of the couple and other people included in the invitation.</li>
                  <li>Wedding dates, event schedules, venues, addresses, and contact details.</li>
                  <li>Photographs, audio files, text, and other content uploaded by customers.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Guest interactions</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-800 text-xs sm:text-sm">
                  <li>RSVP responses, guest messages, wishes, and other information submitted through invitation features.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Payment and transaction information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-800 text-xs sm:text-sm">
                  <li>Order references, purchase amounts, transaction status, and information needed to support refunds or resolve payment issues.</li>
                  <li>Payment-card processing is handled by the payment provider. We do not intentionally store full payment-card details.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Technical information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-800 text-xs sm:text-sm">
                  <li>Information that may be generated when you use the website, such as IP address, device or browser details, security logs, and service usage information, where collected by our infrastructure or enabled tools.</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-zinc-600">
              We aim to collect only information reasonably necessary for the purposes described in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              2. How We Use Information
            </h2>
            <p>We may use personal information to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-800">
              <li>Create, customize, publish, and host wedding invitations.</li>
              <li>Provide account registration and authentication.</li>
              <li>Display uploaded content and invitation details as requested by the customer.</li>
              <li>Process purchases, verify payments, and manage refunds.</li>
              <li>Collect and display RSVPs and guest wishes.</li>
              <li>Respond to support requests and complaints.</li>
              <li>Maintain platform security, prevent misuse, troubleshoot errors, and improve reliability.</li>
              <li>Meet legal, accounting, tax, and regulatory obligations where applicable.</li>
            </ul>
            <p>
              We will not use personal information for an unrelated purpose where additional notice or consent is required by applicable law.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              3. Public Invitations and Guest Information
            </h2>
            <p>
              Published invitation websites may be accessible to anyone who has the invitation link or can otherwise discover the public page. Information displayed on an invitation may therefore be viewed, copied, or shared by other people.
            </p>
            <p>
              Customers should avoid uploading information they do not want to make publicly accessible.
            </p>
            <p>
              Where an invitation includes guest RSVPs, wishes, photographs, or other guest-submitted information, the visibility of that information depends on the features and settings available on the invitation.
            </p>
            <p>
              Customers should obtain appropriate permission before uploading or publishing personal information or photographs belonging to other people.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              4. Service Providers and Sharing
            </h2>
            <p>
              Varnam may use third-party providers to deliver the service. Based on the services used by the platform, these may include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-800">
              <li><strong>Supabase:</strong> authentication, database, or storage services, where configured.</li>
              <li><strong>Razorpay:</strong> payment processing and transaction support.</li>
              <li><strong>Hosting and infrastructure providers:</strong> to deliver the website, store or transmit content, and maintain availability.</li>
              <li><strong>Support or communications providers:</strong> where used to respond to customer enquiries.</li>
            </ul>
            <p>
              The actual providers and services used may change as the platform develops. Varnam will not claim that a provider is used for a particular purpose unless that integration is in place.
            </p>
            <p>
              Information may also be disclosed where necessary to comply with law, respond to valid legal requests, protect users, investigate misuse, or enforce our legal rights.
            </p>
            <p className="font-medium text-zinc-900">
              We do not sell personal information as a standalone commercial product.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              5. Data Retention and Archiving
            </h2>
            <p>
              Published invitation websites are intended to remain available on an ongoing basis unless the customer requests removal or access is restricted for a legitimate reason.
            </p>
            <p>
              An invitation may be archived after removal from public access. Archived information may be retained for a limited period for restoration, customer support, security, dispute resolution, or legal obligations.
            </p>
            <p>
              Archiving does not necessarily mean that all copies are retained indefinitely, nor does it mean that all data is deleted immediately.
            </p>
            <p>
              Transaction records, accounting information, security logs, and other records may be retained for different periods where required by law or reasonably necessary for legitimate purposes.
            </p>
            <p>
              Before publication, Varnam will define and implement retention periods for archived invitations, uploaded media, guest responses, backups, and account data. Requests for deletion will be handled in accordance with applicable law, subject to any legitimate legal retention requirements.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              6. Data Security
            </h2>
            <p>
              We use reasonable technical and organizational measures intended to protect personal information against unauthorized access, disclosure, alteration, loss, or misuse.
            </p>
            <p>
              No internet transmission or storage system can be guaranteed to be completely secure. Customers should protect their account credentials and avoid sharing access details unnecessarily.
            </p>
            <p>
              If you suspect unauthorized access to your account or invitation, contact us promptly.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              7. Your Requests and Privacy Rights
            </h2>
            <p>
              Depending on applicable law and the circumstances, you may request access to, correction of, or deletion of personal information, withdraw consent where processing relies on consent, or raise a complaint about how information is handled.
            </p>
            <p>
              To make a request, email <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a> and explain what information or invitation the request concerns.
            </p>
            <p>
              We may need to verify your identity or authority before acting on a request, particularly where the information relates to guests or another person.
            </p>
            <p>
              Requests will be handled in accordance with applicable law. Some information may need to be retained where a legal obligation or other lawful basis applies.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              8. Children and Third-Party Information
            </h2>
            <p>
              Varnam is intended for people arranging or participating in wedding events, not for independent use by young children.
            </p>
            <p>
              Customers must ensure they have appropriate authority or permission to upload photographs or personal information relating to guests and other individuals. Where information about children is processed, additional requirements may apply under applicable law.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              9. Cookies and Analytics
            </h2>
            <p>
              The website may use cookies or similar technologies needed for essential functionality, security, preferences, or analytics, depending on the tools enabled.
            </p>
            <p>
              The exact cookies and tracking technologies used should be disclosed in a separate cookie notice or in this policy where required. Optional analytics or advertising technologies should be configured consistently with applicable consent requirements.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy when our services, data practices, or legal obligations change. The revised policy will display an updated date. Where required, we will provide additional notice or seek consent.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-tight">
              11. Contact and Complaints
            </h2>
            <p>For privacy questions, data requests, or complaints:</p>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1.5 text-xs sm:text-sm">
              <p><strong className="text-zinc-900">Email:</strong> <a href="mailto:hello@varnaminvites.store" className="text-[#916710] underline hover:text-zinc-950 font-medium">hello@varnaminvites.store</a></p>
              <p><strong className="text-zinc-900">WhatsApp:</strong> <a href="https://wa.me/917200180268" target="_blank" rel="noopener noreferrer" className="text-[#916710] underline hover:text-zinc-950 font-medium">+91 7200180268</a></p>
              <p><strong className="text-zinc-900">Support hours:</strong> Monday–Saturday, 9:00 AM–8:00 PM IST</p>
              <p><strong className="text-zinc-900">Responsible operator:</strong> [Insert full legal name]</p>
              <p><strong className="text-zinc-900">Business address:</strong> [Insert required address]</p>
              <p><strong className="text-zinc-900">Privacy / grievance contact:</strong> [Confirm the responsible person&apos;s name and designation before publication]</p>
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
