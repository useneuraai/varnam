"use client";

import { useEffect, useRef, useState } from "react";
import { getDefaultTemplateData } from "@/lib/templates";
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
    if (!mounted) return;
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    if (!autoScroll) {
      scrollContainer.scrollTop = 0;
      return;
    }

    // Start scrolling after 1 second
    const timer = setTimeout(() => {
      let active = true;
      let lastTime = performance.now();
      const speed = 0.035; // pixels per ms (~35px/sec)

      const scroll = (time: number) => {
        if (!active || !scrollContainer) return;
        const delta = time - lastTime;
        lastTime = time;

        scrollContainer.scrollTop += speed * delta;

        // Loop back if we hit the bottom
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (scrollContainer.scrollTop >= maxScroll - 5) {
          scrollContainer.scrollTop = 0;
        }

        requestAnimationFrame(scroll);
      };

      requestAnimationFrame(scroll);

      return () => {
        active = false;
      };
    }, 1000);

    return () => {
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

  if (!TemplateComponent) return null;

  return (
    <div
      ref={scrollRef}
      className={
        autoScroll
          ? "carousel-card-container w-full h-full overflow-y-auto scrollbar-none pointer-events-none select-none relative"
          : "carousel-card-container w-full h-full overflow-hidden pointer-events-none select-none relative"
      }
      {...(autoScroll ? { "data-lenis-prevent": true } : {})}
    >
      <TemplateComponent data={demoData} />
    </div>
  );
}
