"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const lbl = labelRef.current;
    if (!dot || !ring || !lbl) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      lbl.style.left = mouseX + "px";
      lbl.style.top = mouseY + "px";
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animateRing = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    // Image hover detection
    const onHoverImg = (e: Event) => {
      const t = e.currentTarget as HTMLElement;
      const lv = t.getAttribute("data-cursor-label") || "VIEW";
      setLabel(lv);
      dot.style.width = "0px";
      dot.style.height = "0px";
      ring.style.width = "72px";
      ring.style.height = "72px";
      ring.style.borderColor = "rgba(199,154,98,0.9)";
      lbl.style.opacity = "1";
    };
    const onLeaveImg = () => {
      setLabel("");
      dot.style.width = "8px";
      dot.style.height = "8px";
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.borderColor = "rgba(199,154,98,0.5)";
      lbl.style.opacity = "0";
    };

    const interactives = document.querySelectorAll(
      "[data-cursor], a, button, .practice-card, .img-hover-wrap"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onHoverImg);
      el.addEventListener("mouseleave", onLeaveImg);
    });

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverImg);
        el.removeEventListener("mouseleave", onLeaveImg);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true">
        {label}
      </div>
    </>
  );
}
