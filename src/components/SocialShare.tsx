"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.79 13.96c-.24.69-1.23 1.27-1.7 1.32-.47.05-1.04.22-3.13-.6-2.68-1.05-4.41-3.78-4.54-3.96-.13-.18-1.08-1.44-1.08-2.75 0-1.31.69-1.96.94-2.22.25-.26.54-.33.72-.33.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.55.79 1.93.86 2.07.07.14.12.3.02.49-.1.19-.15.31-.3.49-.15.18-.31.4-.44.53-.15.15-.3.32-.13.62.17.3 1.09 1.8 2.34 2.91 1.25 1.11 2.3 1.46 2.62 1.62.32.16.51.13.7-.09.19-.22.83-.97.96-1.12.13-.15.26-.13.44-.06.18.07 1.12.53 1.32.63.2.1.33.15.38.23.05.08.05.47-.19 1.16z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-2.8 0-5 2.2-5 5v2z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.2 2.4h3.3L14.3 11l8.5 11.3h-6.7L11 15.8l-6 6.5H1.6l7.6-8.7L1 2.4h6.9l4.7 6.2 5.6-6.2zm-1.2 17.6h1.8L7.1 4.2H5.1l11.9 15.8z" />
  </svg>
);

export default function SocialShare() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://varnam-invites.vercel.app";
  const shareText = "Create premium cinematic digital wedding invitations with Varnam!";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  const platforms = [
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200",
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
    },
    {
      name: "Twitter",
      icon: <TwitterIcon />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: "hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-8 border-t border-zinc-100 w-full bg-white relative z-10 select-none">
      <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
        Share Varnam with Friends
      </span>
      <div className="flex items-center gap-3">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${p.name}`}
            className={`w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 transition-all duration-300 shadow-sm ${p.color}`}
          >
            {p.icon}
          </a>
        ))}
        <button
          onClick={handleCopy}
          title="Copy website URL"
          className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-[#fff9f2] hover:text-[#b3811b] hover:border-[#eed57c] transition-all duration-300 shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#b3811b]" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
