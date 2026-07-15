"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Wand2, Smartphone, Tablet, Monitor } from "lucide-react";
import { getTemplateBySlug, getDefaultTemplateData } from "@/lib/templates";
import { templatesMap } from "@/templates";
import MusicToggle from "@/components/animations/MusicToggle";

interface TemplatePreviewClientProps {
  slug: string;
}

export default function TemplatePreviewClient({ slug }: TemplatePreviewClientProps) {
  const router = useRouter();
  const template = getTemplateBySlug(slug);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  
  if (!template) {
    return (
      <div className="min-h-screen bg-white text-zinc-800 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-955 mb-4">Template Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The template you are trying to preview does not exist.</p>
        <Link href="/templates" className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest font-bold uppercase rounded-full">
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  const TemplateComponent = templatesMap[slug];
  const demoData = getDefaultTemplateData(slug);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-white text-zinc-800 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-955 mb-4">Component Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The render engine for this template is currently under maintenance.</p>
        <Link href="/templates" className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest font-bold uppercase rounded-full">
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 overflow-x-hidden">
      {/* Floating Header Control Bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/95 backdrop-blur-md border border-zinc-200/60 px-6 py-3.5 flex items-center justify-between shadow-lg rounded-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors rounded-full"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-800 font-bold tracking-tight">{template.name}</span>
            <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-bold">LIVE PREVIEW</span>
          </div>
        </div>

        {/* Device Switcher (Desktop/Tablet browsers only) */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-50 border border-zinc-200/60 p-1 rounded-full">
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
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[9px] uppercase tracking-wider transition-all duration-300 rounded-full cursor-pointer ${
                  active
                    ? "bg-zinc-900 text-white font-bold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
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
          <span className="hidden sm:inline text-zinc-800 text-sm font-bold">₹{template.price}</span>
          <Link
            href={`/editor/${template.slug}`}
            className="bg-zinc-900 text-white text-[10px] md:text-xs tracking-widest uppercase font-bold px-5 py-2.5 hover:bg-zinc-800 transition-all duration-300 flex items-center gap-1.5 rounded-full"
          >
            <Wand2 className="w-3.5 h-3.5" />
            USE TEMPLATE
          </Link>
        </div>
      </div>

      {/* Dynamic Template Content */}
      <main className="w-full min-h-screen pt-24 pb-12 flex items-center justify-center bg-transparent relative z-10">
        {device === "desktop" ? (
          <div className="w-full min-h-screen template-container">
            <TemplateComponent data={demoData} />
          </div>
        ) : device === "tablet" ? (
          <div
            data-lenis-prevent
            className="w-full max-w-[768px] h-[85vh] bg-black border-[12px] border-zinc-800 rounded-[32px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] overflow-y-auto relative ring-1 ring-neutral-900/10 scrollbar-none preview-mode-tablet"
          >
            <TemplateComponent data={demoData} />
          </div>
        ) : (
          <div
            data-lenis-prevent
            className="w-full max-w-[375px] h-[780px] bg-black border-[12px] border-zinc-800 rounded-[44px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] overflow-y-auto relative ring-1 ring-neutral-900/10 scrollbar-none preview-mode-mobile"
          >
            {/* Speaker/Camera notch for mobile */}
            <div className="sticky top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-50 flex items-center justify-center pointer-events-none">
              <div className="w-3.5 h-1.5 bg-black rounded-full" />
            </div>
            <TemplateComponent data={demoData} />
          </div>
        )}
      </main>

      {/* Floating Ambient Music */}
      <MusicToggle audioUrl={template.previewMusicUrl} autoPlay={true} />
    </div>
  );
}
