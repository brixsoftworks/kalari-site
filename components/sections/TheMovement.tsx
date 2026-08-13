"use client";

import { useEffect, useRef, useState } from "react";

export default function TheMovement() {
  const sectionRef = useRef<HTMLElement>(null);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      setParallax(progress * 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="movement"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: "clamp(480px, 95vh, 1000px)",
        background: "var(--c-void)",
      }}
      aria-labelledby="movement-heading"
    >
      {/* Parallax background */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${parallax}px) scale(1.15)`,
          transition: "transform 0.05s linear",
        }}
        aria-hidden="true"
      >
        <img
          src="/images/movement.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            filter: "brightness(0.4)",
            display: "block",
          }}
          loading="lazy"
        />
      </div>

      {/* Multiple overlays for cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,9,8,0.8) 0%, rgba(10,9,8,0.2) 50%, rgba(66,26,22,0.5) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="vignette" aria-hidden="true" />

      {/* Chapter label */}
      <div
        className="absolute top-12 left-[clamp(1.5rem,4vw,4rem)]"
        aria-hidden="true"
      >
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
          CHAPTER 04
        </span>
      </div>

      {/* Centered overlapping typography */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ padding: "0 clamp(1.5rem, 6vw, 6rem)" }}
      >
        <div className="reveal-line" style={{ marginBottom: "0.5rem" }}>
          <span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.6rem, 1.5vw, 0.9rem)",
                letterSpacing: "0.4em",
                color: "var(--c-ash)",
                fontWeight: 400,
                textTransform: "uppercase",
              }}
            >
              THE MOVEMENT
            </span>
          </span>
        </div>

        <div className="reveal-line" style={{ transitionDelay: "0.1s" }}>
          <span>
            <h2
              id="movement-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 11vw, 12rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                color: "var(--c-ivory)",
                lineHeight: 0.85,
              }}
            >
              MOVE WITH
            </h2>
          </span>
        </div>

        <div className="reveal-line" style={{ transitionDelay: "0.18s" }}>
          <span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 11vw, 12rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                color: "var(--c-gold)",
                fontStyle: "italic",
                lineHeight: 0.85,
                display: "block",
              }}
            >
              PURPOSE.
            </span>
          </span>
        </div>

        <div
          className="reveal-fade mt-8"
          style={{ transitionDelay: "0.4s", maxWidth: "36rem" }}
        >
          <p
            className="text-body"
            style={{
              color: "var(--c-parchment)",
              opacity: 0.65,
              fontSize: "0.875rem",
            }}
          >
            Every step is intentional. Every breath is placed. Every movement
            carries the memory of thousands of years.
          </p>
        </div>
      </div>

      {/* Bottom-left meta */}
      <div
        className="absolute bottom-10 left-[clamp(1.5rem,4vw,4rem)]"
        aria-hidden="true"
      >
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
          CHUVADU · VADIVU · JUMPS · SPINS
        </span>
      </div>

      {/* Bottom-right chapter counter */}
      <div
        className="absolute bottom-10 right-[clamp(1.5rem,4vw,4rem)]"
        aria-hidden="true"
      >
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
          05 / 08
        </span>
      </div>
    </section>
  );
}
