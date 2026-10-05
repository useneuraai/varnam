"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useState } from "react";

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
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const touchDetected =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024;
      setIsTouch(touchDetected);
    }
  }, []);

  // On touch/mobile devices, native 120Hz GPU scrolling is zero-latency and perfectly smooth
  if (isTouch) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 0.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.2,
        infinite: false,
      }}
    >
      <LenisController />
      {children}
    </ReactLenis>
  );
}
