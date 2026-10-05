"use client";

import React from "react";
import Link from "next/link";

interface CreatedByVarnamProps {
  theme?: "dark" | "light" | "gold" | "rose" | "minimal";
  className?: string;
  href?: string;
}

export default function CreatedByVarnam({
  theme = "gold",
  className = "",
  href = "/",
}: CreatedByVarnamProps) {
  const isLight = theme === "light" || theme === "rose";
  const isMinimal = theme === "minimal";

  const textColor = isMinimal
    ? "text-zinc-500 hover:text-zinc-800"
    : isLight
    ? "text-[#8a6b4b] hover:text-[#5c4434]"
    : "text-[#eed57c]/80 hover:text-[#eed57c]";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group w-full py-2.5 px-4 inline-flex items-center justify-center gap-1.5 text-center select-none text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-serif transition-all cursor-pointer ${textColor} ${className}`}
    >
      <span className="group-hover:opacity-90 transition-opacity">Created by</span>
      <span className="text-[9px] opacity-70 group-hover:rotate-45 transition-transform duration-300">❖</span>
      <span className="font-bold tracking-[0.3em] font-cinzel underline underline-offset-4 group-hover:brightness-125 transition-all">
        Varnam
      </span>
    </Link>
  );
}
