"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollYRef = useRef(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Entrance transition
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position in a ref
  useEffect(() => {
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 3D Parallax loop
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Disable mouse tilt on mobile
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
      const scrollY = scrollYRef.current;
      const mobile = window.innerWidth < 768;

      if (mobile) {
        // Simplified non-glitching translation on mobile scroll
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
        }
        if (layer1Ref.current) {
          const bgScale = 1.02 + scrollY * 0.0003;
          layer1Ref.current.style.transform = `scale(${bgScale})`;
        }
      } else {
        // Full cinematic 3D orbital camera pan on desktop
        const cameraX = -scrollY * 0.5;
        const cameraY = scrollY * 0.12;
        const cameraRotY = scrollY * 0.05;
        const cameraRotX = scrollY * -0.015;

        const totalRotX = (currentY * -6) + cameraRotX;
        const totalRotY = (currentX * 6) + cameraRotY;

        if (bgRef.current) {
          bgRef.current.style.transform = `perspective(1200px) rotateX(${totalRotX}deg) rotateY(${totalRotY}deg) translate3d(${cameraX}px, ${cameraY}px, 0)`;
        }
        if (layer1Ref.current) {
          const bgScale = 1.05 + scrollY * 0.0004;
          layer1Ref.current.style.transform = `translate3d(${currentX * -10}px, ${currentY * -10}px, -150px) scale(${bgScale})`;
        }
        if (layer2Ref.current) {
          const glowScale = 1.1 + scrollY * 0.0006;
          layer2Ref.current.style.transform = `translate3d(${currentX * 18}px, ${currentY * 18}px, -30px) scale(${glowScale})`;
        }
        if (layer3Ref.current) {
          const warriorScale = 1.06 + scrollY * 0.0016;
          const warriorZ = 100 + Math.min(120, scrollY * 0.18);
          layer3Ref.current.style.transform = `translate3d(${currentX * 28}px, ${currentY * 28}px, ${warriorZ}px) scale(${warriorScale})`;
        }
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
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "600px" }}
      aria-label="Hero — The Art of the Warrior"
    >
      {/* 3D/Parallax Background Wrapper */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 transition-transform duration-75 ease-out"
        style={{
          transformStyle: isMobile ? "flat" : "preserve-3d",
          transformOrigin: "center center",
        }}
        aria-hidden="true"
      >
        {/* Layer 1: Ambient background image */}
        <div
          ref={layer1Ref}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/movement.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: loaded ? (isMobile ? 1 : 0.35) : 0,
            filter: isMobile ? "none" : "blur(6px) brightness(0.6) saturate(0.8)",
            transition: "opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transformStyle: isMobile ? "flat" : "preserve-3d",
          }}
        />

        {/* Layer 2: Firelight glow (Desktop only) */}
        {!isMobile && (
          <div
            ref={layer2Ref}
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(201, 76, 46, 0.5) 0%, transparent 60%)",
              transformStyle: "preserve-3d",
            }}
          />
        )}

        {/* Layer 3: Warrior Cutout (Desktop only) */}
        {!isMobile && (
          <div
            ref={layer3Ref}
            className="absolute inset-0"
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
        )}

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

      {/* Top-left brand */}
      <div
        className="absolute top-8 left-[clamp(1.5rem,4vw,4rem)] z-10"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s 0.8s",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem,2.5vw,1.8rem)",
            fontWeight: 300,
            letterSpacing: "0.35em",
            color: "var(--c-ivory)",
          }}
        >
          KALARI
        </span>
      </div>

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
          01 / 09
        </span>
      </div>

      {/* Red accent bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        aria-hidden="true"
        style={{ height: "1px", background: "rgba(181,58,37,0.2)" }}
      />
    </section>
  );
}
