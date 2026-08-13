"use client";

import { useEffect, useRef, useCallback } from "react";

export default function ScrollReveal({ children }: { children: React.ReactNode }) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setup = useCallback(() => {
    const targets = document.querySelectorAll(
      ".reveal-up, .reveal-fade, .reveal-line, .clip-reveal"
    );
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    targets.forEach((el) => observerRef.current?.observe(el));
  }, []);

  useEffect(() => {
    setup();
    return () => observerRef.current?.disconnect();
  }, [setup]);

  return <>{children}</>;
}
