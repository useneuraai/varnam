"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function LenisController() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    
    // Disable Lenis smooth scrolling on routes that have specialized panels
    const isSpecialRoute = 
      pathname?.startsWith("/editor") || 
      pathname?.startsWith("/admin") ||
      pathname?.startsWith("/success");

    if (isSpecialRoute) {
      lenis.stop();
    } else {
      lenis.start();
      // Ensure page starts at the top when navigating
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      <LenisController />
      {children}
    </ReactLenis>
  );
}
