"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-gold-400 hover:text-gold-200 transition-colors flex items-center gap-1.5 font-montserrat text-[10px] tracking-widest uppercase font-bold focus:outline-none cursor-pointer"
      title="Copy link to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-400">COPIED</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>COPY</span>
        </>
      )}
    </button>
  );
}
