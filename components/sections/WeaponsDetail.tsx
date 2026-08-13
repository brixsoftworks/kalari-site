"use client";

import { useEffect, useRef, useState } from "react";

export default function WeaponsDetail() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId: number;

    const updatePosition = () => {
      const section = sectionRef.current;
      if (!section || !inView) {
        rafId = requestAnimationFrame(updatePosition);
        return;
      }

      const rect = section.getBoundingClientRect();
      // Calculate scroll progress relative to this section entering/exiting the screen
      const scrollOffset = window.innerHeight - rect.top;

      // Inverse camera orbital panning of the hero section
      // Hero: cameraX = -scrollY * 0.5, cameraRotY = scrollY * 0.05
      // Inverse: cameraX = +scrollOffset * 0.4, cameraRotY = -scrollOffset * 0.04
      const cameraX = Math.min(250, Math.max(-250, (scrollOffset - 400) * 0.45));
      const cameraRotY = Math.min(15, Math.max(-15, (scrollOffset - 400) * -0.045));
      const cameraRotX = Math.min(10, Math.max(-10, (scrollOffset - 400) * 0.015));

      if (bgRef.current) {
        bgRef.current.style.transform = `perspective(1200px) rotateX(${cameraRotX}deg) rotateY(${cameraRotY}deg) translate3d(${cameraX}px, 0, 0)`;
      }

      // Background layer zooms and shifts in inverse direction
      if (layer1Ref.current) {
        const bgScale = 1.05 + Math.max(0, scrollOffset * 0.0003);
        layer1Ref.current.style.transform = `translate3d(${-cameraX * 0.2}px, 0, -100px) scale(${bgScale})`;
      }

      // Glow flare sits in middle Z space
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(${cameraX * 0.1}px, 0, -20px) scale(1.15)`;
      }

      // Cutout layer of the weapons detail
      if (layer3Ref.current) {
        const weaponScale = 1.08 + Math.max(0, scrollOffset * 0.0006);
        const weaponZ = 80 + Math.min(80, scrollOffset * 0.08);
        layer3Ref.current.style.transform = `translate3d(${-cameraX * 0.4}px, 0, ${weaponZ}px) scale(${weaponScale})`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "70vh", minHeight: "450px", background: "var(--c-void)" }}
      aria-labelledby="weapons-detail-heading"
    >
      {/* 3D Parallax Container */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 transition-transform duration-75 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        aria-hidden="true"
      >
        {/* Layer 1: Ambient background image (weapons detail, desaturated and blurred) */}
        <div
          ref={layer1Ref}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/weapons.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
            filter: "blur(5px) brightness(0.5) saturate(0.6)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 2: Warm ambient amber light glow layer */}
        <div
          ref={layer2Ref}
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge"
          style={{
            background: "radial-gradient(circle at 60% 50%, rgba(201, 76, 46, 0.4) 0%, transparent 60%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 3: Main Isolated Weapons Layer (pops forward on Z-axis, zooms faster) */}
        <div
          ref={layer3Ref}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/weapons.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            // Clip-path polygon isolating the central sword and shield silhouette
            clipPath: "polygon(15% 15%, 85% 15%, 85% 85%, 15% 85%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Dark gradient overlays */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,9,8,1) 0%, rgba(10,9,8,0.2) 20%, rgba(10,9,8,0.2) 80%, rgba(10,9,8,1) 100%)",
          }}
        />
      </div>

      {/* Vignette */}
      <div className="vignette" aria-hidden="true" />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 md:px-24">
        <div className="flex items-center gap-4 mb-4" aria-hidden="true">
          <span className="accent-line" style={{ width: "1.5rem" }} />
          <span className="text-meta" style={{ color: "var(--c-gold)" }}>
            THE WEAPONS OF COMBAT
          </span>
        </div>

        <h2
          id="weapons-detail-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--c-ivory)",
            lineHeight: 1.1,
            maxWidth: "32rem",
          }}
        >
          FORGED IN <em style={{ color: "var(--c-vermilion)", fontStyle: "italic" }}>ANCIENT</em> FIRE.
        </h2>

        <p
          className="text-body mt-6"
          style={{
            maxWidth: "24rem",
            color: "var(--c-ash)",
            fontSize: "0.875rem",
          }}
        >
          Steel, bronze, and wood. In Kalaripayattu, each weapon is treated with reverence. They are not instruments of anger, but extensions of body and breath.
        </p>
      </div>

      {/* Side boundary line accents */}
      <div
        className="absolute top-0 bottom-0 right-12 w-px bg-gradient-to-b from-transparent via-red-900/30 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
