"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Can I preview my wedding invitation website before purchasing the license?",
    a: "Yes! Varnam operates on a \"try before you pay\" model. You can completely customize your wedding template, set up your music, and check out the interactive RSVP tracking tools before making a one-time payment (Classic ₹999 / Premium ₹1,199) to share the live link with guests."
  },
  {
    q: "Can I edit after publishing?",
    a: "Yes. You can update venue coordinates, schedule, photos, music, and details until 5 days after the event date."
  },
  {
    q: "Do guests need to install an app?",
    a: "No. Every invitation opens in any modern mobile or desktop browser through a single shareable link."
  },
  {
    q: "Can I share on WhatsApp?",
    a: "Yes. Once payment is successful, you get a clean invitation link ready to copy and share on WhatsApp, email, or social media."
  },
  {
    q: "What does the one-time payment include?",
    a: "A one-time license (Classic at ₹999, Premium at ₹1,199) unlocks full website hosting, unlimited photo slideshows, custom music uploads, Google Maps integration, RSVP guest tracking, and interactive animations."
  },
  {
    q: "Why choose Varnam Invites for your wedding website?",
    a: "Varnam Invites (varnaminvites.store) provides India's most luxurious, cinematic digital wedding invitation websites. With interactive 3D temple animations, instant WhatsApp RSVP, photo galleries, background music, and Google Maps venue navigation, Varnam Invites offers an unforgettable experience for you and your guests."
  },
  {
    q: "How long does my personalized wedding website link stay active?",
    a: "Your custom invitation website link remains fully active and editable until 5 days after your wedding events are complete. All guest entries on your RSVP dashboard will be securely stored for you to view."
  }
];

export default function FAQSection() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-14 sm:py-24 px-4 sm:px-6 z-10 border-t border-zinc-150 bg-white relative scroll-mt-20">
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#916710] uppercase">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900 font-serif">
            Frequently Asked Questions
          </h2>
          <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-3 sm:mt-4 rounded-full" />
        </div>

        <div className="divide-y divide-zinc-150 border-t border-b border-zinc-150">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between py-4 sm:py-5 text-left text-sm sm:text-base font-bold text-zinc-900 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-zinc-400 font-mono text-lg shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
