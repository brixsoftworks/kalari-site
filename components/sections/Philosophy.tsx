"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  { text: "BODY", sub: "The first instrument" },
  { text: "MIND", sub: "The true weapon" },
  { text: "BREATH", sub: "The bridge between" },
  { text: "DISCIPLINE", sub: "The daily vow" },
  { text: "AWARENESS", sub: "The highest goal" },
];

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - window.innerHeight))
      );
      const idx = Math.min(words.length - 1, Math.floor(progress * words.length));
      setActiveIdx(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      style={{
        background: "var(--c-void)",
        height: `${words.length * 100}vh`,
        position: "relative",
      }}
      aria-labelledby="philosophy-heading"
    >
      {/* Sticky inner */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 clamp(1.5rem, 4vw, 4rem)",
          overflow: "hidden",
        }}
      >
        {/* Chapter label */}
        <div className="mb-16 flex items-center gap-6" aria-hidden="true">
          <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 07</span>
          <span className="accent-line" />
          <span className="text-meta" style={{ color: "var(--c-smoke)" }}>PHILOSOPHY</span>
        </div>

        {/* Heading (hidden visually but for semantics) */}
        <h2 id="philosophy-heading" className="sr-only">
          The Philosophy of Kalaripayattu
        </h2>

        {/* Words list */}
        <div className="flex flex-col gap-4" role="list">
          {words.map((w, i) => (
            <div
              key={w.text}
              role="listitem"
              aria-current={activeIdx === i ? "true" : undefined}
            >
              <div
                className="philosophy-word"
                style={{
                  color:
                    activeIdx === i
                      ? "var(--c-ivory)"
                      : i < activeIdx
                      ? "rgba(90,78,68,0.4)"
                      : "var(--c-smoke)",
                  letterSpacing: activeIdx === i ? "-0.03em" : "-0.01em",
                  transition: "color 0.7s cubic-bezier(0.16,1,0.3,1), letter-spacing 0.7s cubic-bezier(0.16,1,0.3,1)",
                  fontSize: "clamp(2.5rem, 7vw, 7rem)",
                }}
              >
                {w.text}
              </div>
            </div>
          ))}
        </div>

        {/* Active subtitle */}
        <div
          style={{
            marginTop: "3rem",
            height: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
          aria-live="polite"
        >
          <p
            className="text-label"
            style={{
              color: "var(--c-gold)",
              letterSpacing: "0.2em",
              position: "absolute",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s",
            }}
          >
            {words[activeIdx].sub}
          </p>
        </div>

        {/* Progress indicator */}
        <div
          className="flex items-center gap-2 mt-12"
          aria-hidden="true"
        >
          {words.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIdx ? "2rem" : "0.4rem",
                height: "1px",
                background:
                  i === activeIdx ? "var(--c-vermilion)" : "var(--c-smoke)",
                transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s",
              }}
            />
          ))}
        </div>

        {/* Right-side image accent */}
        <div
          className="absolute right-0 top-0 bottom-0 clip-reveal"
          style={{
            width: "clamp(160px, 25vw, 320px)",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <img
            src="/images/lamp.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.25,
              filter: "sepia(60%) brightness(0.6)",
            }}
            loading="lazy"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, var(--c-void) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
