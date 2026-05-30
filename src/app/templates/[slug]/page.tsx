"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Sparkles, Wand2, Smartphone, Tablet, Monitor } from "lucide-react";
import { getTemplateBySlug, getDefaultTemplateData } from "@/lib/templates";
import { templatesMap } from "@/templates";
import MusicToggle from "@/components/animations/MusicToggle";

export default function TemplatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const template = getTemplateBySlug(slug);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  
  if (!template) {
    return (
      <div className="min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-gold-400 mb-4">Template Not Found</h1>
        <p className="font-serif text-sm text-gold-200/60 mb-6">The template you are trying to preview does not exist.</p>
        <Link href="/templates" className="px-6 py-2.5 bg-gold-500 text-black font-montserrat text-xs tracking-widest font-bold">
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  const TemplateComponent = templatesMap[slug];
  const demoData = getDefaultTemplateData(slug);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-gold-400 mb-4">Component Not Found</h1>
        <p className="font-serif text-sm text-gold-200/60 mb-6">The render engine for this template is currently under maintenance.</p>
        <Link href="/templates" className="px-6 py-2.5 bg-gold-500 text-black font-montserrat text-xs tracking-widest font-bold">
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080708] overflow-x-hidden">
      {/* Floating Header Control Bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl glass-panel border border-gold-500/20 px-6 py-3.5 flex items-center justify-between shadow-2xl rounded-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-gold-400 hover:text-gold-200 transition-colors"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-cinzel text-sm text-gold-300 font-bold tracking-wide">{template.name}</span>
            <span className="font-montserrat text-[9px] tracking-widest text-gold-400/70 uppercase">LIVE PREVIEW</span>
          </div>
        </div>

        {/* Device Switcher (Desktop/Tablet browsers only) */}
        <div className="hidden md:flex items-center gap-1 bg-black/60 border border-gold-500/10 p-1 rounded-sm">
          {[
            { mode: "mobile", icon: Smartphone, label: "Mobile" },
            { mode: "tablet", icon: Tablet, label: "Tablet" },
            { mode: "desktop", icon: Monitor, label: "Desktop" },
          ].map((item) => {
            const Icon = item.icon;
            const active = device === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setDevice(item.mode as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-montserrat uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "bg-gold-500 text-black font-bold"
                    : "text-gold-400 hover:text-gold-200 hover:bg-gold-500/10"
                }`}
                title={item.label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-cinzel text-gold-400 text-sm font-bold">₹{template.price}</span>
          <Link
            href={`/editor/${template.slug}`}
            className="bg-gold-500 text-black text-[10px] md:text-xs tracking-widest uppercase font-montserrat font-bold px-4 py-2 hover:bg-gold-400 transition-all duration-300 flex items-center gap-1.5 hover:scale-102"
          >
            <Wand2 className="w-3.5 h-3.5" />
            USE TEMPLATE
          </Link>
        </div>
      </div>

      {/* Dynamic Template Content */}
      <div className="w-full min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#080708]/60 relative z-10">
        {device === "desktop" ? (
          <div className="w-full min-h-screen template-container">
            <TemplateComponent data={demoData} />
          </div>
        ) : device === "tablet" ? (
          <div
            data-lenis-prevent
            className="w-full max-w-[768px] h-[85vh] bg-[#2d0202] border-[12px] border-zinc-800 rounded-[30px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto relative ring-1 ring-gold-400/20 scrollbar-none preview-mode-tablet"
          >
            <TemplateComponent data={demoData} />
          </div>
        ) : (
          <div
            data-lenis-prevent
            className="w-full max-w-[375px] h-[780px] bg-[#2d0202] border-[12px] border-zinc-800 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto relative ring-1 ring-gold-400/20 scrollbar-none preview-mode-mobile"
          >
            {/* Speaker/Camera notch for mobile */}
            <div className="sticky top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-50 flex items-center justify-center pointer-events-none">
              <div className="w-3.5 h-1.5 bg-black rounded-full" />
            </div>
            <TemplateComponent data={demoData} />
          </div>
        )}
      </div>

      {/* Floating Ambient Music */}
      <MusicToggle audioUrl={template.previewMusicUrl} autoPlay={true} />
    </div>
  );
}

