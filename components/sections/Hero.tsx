"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Entrance transition
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // GSAP ScrollTrigger for smooth device-agnostic scroll zoom
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Zoom effect on scroll
      gsap.to(layer1Ref.current, {
        scale: isMobile ? 1.25 : 1.35,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (!isMobile) {
        // Zoom cutout faster on desktop for 3D parallax
        gsap.to(layer3Ref.current, {
          scale: 1.45,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Mouse tracking parallax (Desktop only)
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      targetX = (clientX / innerWidth) - 0.5;
      targetY = (clientY / innerHeight) - 0.5;
    };

    const lerp = (start: number, end: number, amt: number) => {
      return (1 - amt) * start + amt * end;
    };

    const updatePosition = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);
      const scrollY = window.scrollY;

      // Camera orbital panning driven by scroll
      const cameraX = -scrollY * 0.45; // Camera moves to the right, shifting world to the left
      const cameraY = scrollY * 0.12; 
      const cameraRotY = scrollY * 0.045; // Orbit camera rotation around Y-axis
      const cameraRotX = scrollY * -0.012;

      const totalRotX = (currentY * -6) + cameraRotX;
      const totalRotY = (currentX * 6) + cameraRotY;

      // Apply orbital rotation and translation to the perspective container
      if (bgRef.current) {
        bgRef.current.style.transform = `perspective(1200px) rotateX(${totalRotX}deg) rotateY(${totalRotY}deg) translate3d(${cameraX}px, ${cameraY}px, 0)`;
      }
      if (layer1Ref.current) {
        // Multi-layered depth shifts
        layer1Ref.current.style.transform = `translate3d(${currentX * -15}px, ${currentY * -15}px, -150px)`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(${currentX * 18}px, ${currentY * 18}px, -30px)`;
      }
      if (layer3Ref.current) {
        const warriorZ = 100 + Math.min(100, scrollY * 0.15);
        layer3Ref.current.style.transform = `translate3d(${currentX * 28}px, ${currentY * 28}px, ${warriorZ}px)`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollDown = () => {
    document.getElementById("kalari")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px", background: "var(--c-void)" }}
      aria-label="Hero — The Art of the Warrior"
    >
      {/* 3D Parallax Container (Bleed margins applied via styling to prevent edges from rotating/translating into view) */}
      <div
        ref={bgRef}
        className="absolute transition-transform duration-75 ease-out hero-container-3d"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        aria-hidden="true"
      >
        {/* Layer 1: Main background image */}
        <div
          ref={layer1Ref}
          className="absolute inset-0 hero-bg-layer"
          style={{
            backgroundImage: "url('/images/movement.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: loaded ? 1 : 0,
            transition: "opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 2: Warm firelight glow (Desktop only) */}
        <div
          ref={layer2Ref}
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge hidden md:block"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(201, 76, 46, 0.5) 0%, transparent 60%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 3: Dynamic Warrior Cutout (Desktop only) */}
        <div
          ref={layer3Ref}
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: "url('/images/movement.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: loaded ? 1 : 0,
            clipPath: "polygon(22% 10%, 78% 10%, 85% 90%, 15% 90%)",
            transition: "opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Dark gradient overlays */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.1) 40%, rgba(10,9,8,0.65) 85%, rgba(10,9,8,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(10,9,8,0.5) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Vignette */}
      <div className="vignette" aria-hidden="true" />

      {/* Center content */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
      >
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s 1.4s",
            marginBottom: "clamp(1rem, 3vh, 2rem)",
          }}
        >
          <span className="text-meta">
            KALARIPAYATTU &nbsp;·&nbsp; KERALA, INDIA
          </span>
        </div>

        <div style={{ overflow: "hidden" }}>
          <h1
            ref={headingRef}
            className="text-hero"
            style={{
              color: "var(--c-ivory)",
              transform: loaded ? "translateY(0)" : "translateY(100%)",
              transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
            }}
          >
            THE ART OF
            <br />
            <em style={{ color: "var(--c-gold)", fontStyle: "italic" }}>
              THE WARRIOR
            </em>
          </h1>
        </div>

        <div
          style={{
            marginTop: "clamp(1.5rem, 4vh, 3rem)",
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s 1.8s",
            maxWidth: "36rem",
          }}
        >
          <p
            className="text-body"
            style={{ color: "var(--c-parchment)", opacity: 0.75, fontSize: "0.875rem" }}
          >
            AN ANCIENT MARTIAL TRADITION FROM THE LAND OF KERALA
          </p>
        </div>
      </div>

      {/* Bottom-left location meta */}
      <div
        className="absolute z-10"
        style={{
          bottom: "clamp(2rem, 5vh, 4rem)",
          left: "clamp(1.5rem, 4vw, 4rem)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s 2s",
        }}
      >
        <span className="text-meta block" style={{ color: "var(--c-smoke)" }}>
          KERALA &nbsp;·&nbsp; INDIA
        </span>
        <span className="text-meta block mt-1" style={{ color: "var(--c-smoke)" }}>
          TRADITIONAL MARTIAL ART
        </span>
      </div>

      {/* Bottom-center scroll indicator */}
      <div
        className="absolute z-10 flex flex-col items-center gap-2"
        style={{
          bottom: "clamp(2rem, 5vh, 4rem)",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s 2.4s",
        }}
      >
        <button
          onClick={scrollDown}
          className="flex flex-col items-center gap-2"
          aria-label="Scroll to enter"
          style={{ background: "none", border: "none" }}
        >
          <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
            SCROLL TO ENTER
          </span>
          <div className="scroll-indicator" aria-hidden="true">
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="6.5"
                y="0.5"
                width="3"
                height="10"
                rx="1.5"
                fill="var(--c-gold)"
                opacity="0.6"
              />
              <path
                d="M1 14L8 21L15 14"
                stroke="var(--c-gold)"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Chapter counter bottom-right */}
      <div
        className="absolute z-10"
        style={{
          bottom: "clamp(2rem, 5vh, 4rem)",
          right: "clamp(1.5rem, 4vw, 4rem)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s 2s",
        }}
        aria-hidden="true"
      >
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
          01 / 08
        </span>
      </div>

      {/* Red accent bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        aria-hidden="true"
        style={{ height: "1px", background: "rgba(181,58,37,0.2)" }}
      />

      {/* Responsive adjustments & Bleed styling */}
      <style jsx>{`
        .hero-container-3d {
          inset: -15% -20%; /* 15% vertical and 20% horizontal bleed to fully fill gaps during pans/tilts */
        }
        @media (max-width: 767px) {
          .hero-container-3d {
            inset: 0% !important; /* Reset bleed on mobile */
            width: 100%;
            height: 100%;
          }
          .hero-bg-layer {
            filter: none !important;
            opacity: 1 !important;
          }
        }
        @media (min-width: 768px) {
          .hero-bg-layer {
            filter: blur(6px) brightness(0.6) saturate(0.8) !important;
            opacity: 0.35 !important;
          }
        }
      `}</style>
    </section>
  );
}
