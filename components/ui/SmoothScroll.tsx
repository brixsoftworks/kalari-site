"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const initLenis = async () => {
      const Lenis = (await import("lenis")).default;

      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      // 1. Sync ScrollTrigger with Lenis scroll events (critical for mobile scroll updates)
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      // 2. Drive Lenis updates directly from GSAP ticker for synchronized animation loops
      const updateTicker = (time: number) => {
        lenis.raf(time * 1000); // GSAP ticker provides seconds, Lenis expects milliseconds
      };
      gsap.ticker.add(updateTicker);

      // Store a reference to the ticker callback for cleanup
      (lenis as any)._tickerCallback = updateTicker;

      // Initialize ScrollTrigger refresh to sync heights
      ScrollTrigger.refresh();
    };

    initLenis();

    return () => {
      if (lenisRef.current) {
        const lenis = lenisRef.current;
        if (lenis._tickerCallback) {
          gsap.ticker.remove(lenis._tickerCallback);
        }
        lenis.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
