"use client";

import { useState } from "react";

const testimonials = [
  {
    quote:
      "Training changed the way I understand movement. Not just in the kalari — in everything I do.",
    name: "ARJUN M.",
    origin: "BANGALORE",
    duration: "2 YEARS",
  },
  {
    quote:
      "I came looking for fitness. I found something I cannot name. The gurukkal teaches not the form — but the reason for the form.",
    name: "SARA K.",
    origin: "BERLIN",
    duration: "18 MONTHS",
  },
  {
    quote:
      "Kalaripayattu is the most demanding and most beautiful thing I have ever done. The body learns to remember.",
    name: "RAJAN P.",
    origin: "KERALA",
    duration: "4 YEARS",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section
      style={{ background: "var(--c-earth)" }}
      aria-label="Student testimonials"
    >
      <div className="divider" aria-hidden="true" />

      {/* Atmospheric image backdrop */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: "clamp(400px, 65vh, 720px)" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: "url('/images/interior.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.15) sepia(40%)",
          }}
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, var(--c-earth) 0%, rgba(28,20,17,0.7) 30%, rgba(28,20,17,0.7) 70%, var(--c-earth) 100%)",
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 kalari-container section-padding flex flex-col items-center text-center"
        >
          {/* Chapter label */}
          <div className="mb-16 flex items-center gap-6" aria-hidden="true">
            <span className="accent-line" style={{ width: "1.5rem" }} />
            <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
              CHAPTER 08 &nbsp;·&nbsp; VOICES
            </span>
            <span className="accent-line" style={{ width: "1.5rem" }} />
          </div>

          {/* Large opening quote mark */}
          <div aria-hidden="true" style={{ marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "6rem",
                color: "var(--c-deep-red)",
                lineHeight: 0.5,
                display: "block",
                opacity: 0.6,
              }}
            >
              &ldquo;
            </span>
          </div>

          {/* Quote */}
          <blockquote
            key={current}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 3.5vw, 3rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--c-ivory)",
              lineHeight: 1.4,
              maxWidth: "52rem",
              animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            {t.quote}
          </blockquote>

          {/* Attribution */}
          <div
            key={`attr-${current}`}
            className="mt-10 flex flex-col items-center gap-3"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
          >
            <div
              style={{
                width: "2rem",
                height: "1px",
                background: "var(--c-vermilion)",
              }}
              aria-hidden="true"
            />
            <span className="text-meta" style={{ color: "var(--c-parchment)" }}>
              — {t.name}
            </span>
            <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
              {t.origin} &nbsp;·&nbsp; STUDENT FOR {t.duration}
            </span>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center gap-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              style={{
                background: "none",
                border: "1px solid rgba(199,154,98,0.25)",
                color: "var(--c-gold)",
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "none",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--c-gold)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(199,154,98,0.25)")
              }
            >
              ←
            </button>

            {/* Dots */}
            <div className="flex gap-3" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? "2rem" : "0.4rem",
                    height: "1px",
                    background:
                      i === current ? "var(--c-vermilion)" : "var(--c-smoke)",
                    border: "none",
                    cursor: "none",
                    transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s",
                    padding: "4px 0",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              style={{
                background: "none",
                border: "1px solid rgba(199,154,98,0.25)",
                color: "var(--c-gold)",
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "none",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--c-gold)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(199,154,98,0.25)")
              }
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe for quote animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(1.5rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
