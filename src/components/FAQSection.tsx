"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "How quickly can I create an invitation?",
    a: "Most hosts publish their invitation in 10 to 15 minutes after choosing a template and adding their event details."
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
    a: "One payment of ₹799 unlocks all templates for the same event, unlimited photo slideshows, custom music uploads, Google Maps integration, RSVP guest tracking, and interactive scratch-to-reveal cards."
  },
  {
    q: "What happens after the event?",
    a: "The invitation remains active and editable until 5 days after the event date, after which it is archived and the license is exhausted."
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
    <section id="faq" className="py-24 px-6 z-10 border-t border-zinc-150 bg-white relative scroll-mt-20">
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#916710] uppercase">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-zinc-900">
            Frequently Asked Questions About Digital Invitations
          </h2>
          <div className="h-[2px] w-12 bg-gold-500 mx-auto mt-4 rounded-xl" />
        </div>

        <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
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
                  className="w-full flex items-center justify-between py-5 text-left text-sm sm:text-base font-bold text-zinc-900 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-zinc-400 font-mono text-lg shrink-0 ml-4">
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
                      <div className="pb-5 pt-1 text-sm sm:text-base text-zinc-650 leading-relaxed">
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
