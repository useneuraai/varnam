"use client";

import { useEffect, useRef, useState } from "react";
import { getDefaultTemplateData, TEMPLATES } from "@/lib/templates";
import { templatesMap } from "@/templates";

export default function LiveTemplatePreview({ slug, autoScroll = false }: { slug: string; autoScroll?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const TemplateComponent = templatesMap[slug];
  const demoData = getDefaultTemplateData(slug);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !autoScroll) return;
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let active = true;
    let isVisible = true;
    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(scrollContainer);

    // Start auto-scrolling at medium speed after 1.2 seconds
    timer = setTimeout(() => {
      let lastTime = performance.now();
      const speed = 0.025; // Balanced medium speed (~25px/sec)

      const scroll = (time: number) => {
        if (!active || !scrollContainer) return;

        // If off-screen, skip animation calculations to save CPU/GPU during page scroll
        if (!isVisible) {
          lastTime = time;
          requestAnimationFrame(scroll);
          return;
        }

        const delta = Math.min(time - lastTime, 50); // Cap delta to prevent sudden huge jumps on frame drops
        lastTime = time;

        scrollContainer.scrollTop += speed * delta;

        // Loop back smoothly if we hit the bottom
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (scrollContainer.scrollTop >= maxScroll - 5) {
          active = false;
          setTimeout(() => {
            if (!scrollContainer) return;
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
              active = true;
              lastTime = performance.now();
              requestAnimationFrame(scroll);
            }, 1400);
          }, 1000);
          return;
        }

        requestAnimationFrame(scroll);
      };

      requestAnimationFrame(scroll);
    }, 1200);

    return () => {
      active = false;
      observer.disconnect();
      clearTimeout(timer);
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    };
  }, [slug, autoScroll, mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-zinc-50 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-zinc-200 border-t-[#eed57c] animate-spin" />
      </div>
    );
  }

  // Ultra-fast optimized image preview for static thumbnail cards
  if (!autoScroll) {
    const template = TEMPLATES.find((t) => t.slug === slug);
    return (
      <div className="w-full h-full relative overflow-hidden bg-zinc-950 group">
        <img
          src={template?.thumbnailUrl || "/images/kamalam-kalyanam/hero_lotus_arch.jpg"}
          alt={template?.name || "Template preview"}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (!TemplateComponent) return null;

  return (
    <div
      ref={scrollRef}
      className="carousel-card-container w-full h-full overflow-y-auto scrollbar-none pointer-events-none select-none relative"
      data-lenis-prevent
    >
      <TemplateComponent data={demoData} isPreview={true} />
    </div>
  );
}
