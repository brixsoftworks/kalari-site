"use client";

import { useState } from "react";

const disciplines = [
  {
    id: "meippayattu",
    title: "MEIPPAYATTU",
    subtitle: "Body Conditioning",
    desc: "The foundation. Rigorous exercises to awaken the body — flexibility, strength, and body memory. The warrior begins here.",
    num: "01",
    color: "rgba(142,36,27,0.8)",
    img: "/images/hero.jpg",
    imgPos: "center 20%",
  },
  {
    id: "vadivu",
    title: "VADIVU",
    subtitle: "Animal Postures",
    desc: "Eight stances inspired by nature — elephant, horse, cat, serpent. Each posture channels a different force and awareness.",
    num: "02",
    color: "rgba(66,26,22,0.8)",
    img: "/images/movement.jpg",
    imgPos: "center",
  },
  {
    id: "kolthari",
    title: "KOLTHARI",
    subtitle: "Wooden Weapons",
    desc: "Training begins with wood. The otta, cheruvadi, and long staff teach distance, rhythm, and the geometry of combat.",
    num: "03",
    color: "rgba(52,28,24,0.85)",
    img: "/images/training.jpg",
    imgPos: "center",
  },
  {
    id: "angathari",
    title: "ANGATHARI",
    subtitle: "Metal Weapons",
    desc: "The knife, sword, shield, and the legendary urumi — the whip-sword. Metal reveals the warrior's precision and courage.",
    num: "04",
    color: "rgba(107,31,24,0.8)",
    img: "/images/weapons.jpg",
    imgPos: "center",
  },
  {
    id: "verumkai",
    title: "VERUMKAI",
    subtitle: "Unarmed Combat",
    desc: "Beyond weapons — the bare body becomes the art. Locks, throws, pressure points. Pure martial intelligence.",
    num: "05",
    color: "rgba(36,24,21,0.85)",
    img: "/images/interior.jpg",
    imgPos: "center",
  },
];

export default function ThePractice() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="practice"
      style={{ background: "var(--c-void)" }}
      aria-labelledby="practice-heading"
    >
      {/* Divider */}
      <div className="divider" aria-hidden="true" />

      {/* Chapter header */}
      <div className="kalari-container pt-24 pb-6 flex items-center gap-6" aria-hidden="true">
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 03</span>
        <span className="accent-line" />
      </div>

      <div className="kalari-container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="reveal-line">
            <span>
              <h2
                id="practice-heading"
                className="text-chapter"
                style={{ color: "var(--c-ivory)" }}
              >
                THE
                <br />
                <em style={{ color: "var(--c-gold)", fontStyle: "italic" }}>PRACTICE</em>
              </h2>
            </span>
          </div>
          <div className="reveal-up" style={{ transitionDelay: "0.2s" }}>
            <p
              className="text-body"
              style={{ color: "var(--c-parchment)", opacity: 0.7 }}
            >
              Five disciplines of the warrior path. Each a door into a deeper
              understanding of body and art.
            </p>
          </div>
        </div>
      </div>

      {/* Discipline grid — large cards stacked */}
      <div className="flex flex-col" role="list">
        {disciplines.map((d, i) => (
          <div
            key={d.id}
            role="listitem"
            className="practice-card reveal-fade"
            style={{
              height: "clamp(180px, 30vh, 360px)",
              position: "relative",
              overflow: "hidden",
              transitionDelay: `${i * 0.08}s`,
              cursor: "none",
            }}
            onMouseEnter={() => setHovered(d.id)}
            onMouseLeave={() => setHovered(null)}
            data-cursor-label="EXPLORE"
          >
            {/* Background image */}
            <div
              className="card-bg absolute inset-0"
              style={{
                backgroundImage: `url('${d.img}')`,
                backgroundSize: "cover",
                backgroundPosition: d.imgPos,
                filter: "brightness(0.3)",
                transform: hovered === d.id ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s",
              }}
              aria-hidden="true"
            />

            {/* Color overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-600"
              style={{
                background: d.color,
                opacity: hovered === d.id ? 0.4 : 0,
                transition: "opacity 0.5s",
              }}
              aria-hidden="true"
            />

            {/* Content */}
            <div
              className="absolute inset-0 flex items-center justify-between"
              style={{ padding: "0 clamp(1.5rem, 5vw, 5rem)" }}
            >
              {/* Number */}
              <span
                className="text-meta"
                style={{
                  color: hovered === d.id ? "var(--c-vermilion)" : "var(--c-smoke)",
                  transition: "color 0.4s",
                  fontSize: "0.55rem",
                }}
              >
                {d.num}
              </span>

              {/* Title + subtitle */}
              <div className="flex flex-col items-center text-center flex-1 mx-8">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 3.5vw, 3.2rem)",
                    fontWeight: 300,
                    letterSpacing: "0.1em",
                    color: hovered === d.id ? "var(--c-ivory)" : "var(--c-parchment)",
                    transition: "color 0.4s, transform 0.4s",
                    transform: hovered === d.id ? "translateY(-4px)" : "translateY(0)",
                  }}
                >
                  {d.title}
                </h3>
                <span
                  className="text-label mt-2"
                  style={{
                    color: hovered === d.id ? "var(--c-gold)" : "var(--c-smoke)",
                    transition: "color 0.4s, opacity 0.4s",
                  }}
                >
                  {d.subtitle}
                </span>
                <p
                  className="text-body mt-4"
                  style={{
                    maxWidth: "32rem",
                    fontSize: "0.8rem",
                    opacity: hovered === d.id ? 0.85 : 0,
                    transform: hovered === d.id ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.5s 0.1s, transform 0.5s 0.1s",
                    color: "var(--c-parchment)",
                  }}
                >
                  {d.desc}
                </p>
              </div>

              {/* Divider line + explore text */}
              <div
                style={{
                  opacity: hovered === d.id ? 1 : 0,
                  transition: "opacity 0.4s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
                aria-hidden="true"
              >
                <span
                  style={{
                    width: "1px",
                    height: "2rem",
                    background: "var(--c-vermilion)",
                    display: "block",
                  }}
                />
                <span className="text-meta" style={{ color: "var(--c-vermilion)" }}>
                  EXPLORE
                </span>
              </div>
            </div>

            {/* Bottom border */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: "1px",
                background: "rgba(199,154,98,0.08)",
              }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      <div className="kalari-container pt-16 pb-24">
        <div className="flex items-center gap-4">
          <span className="accent-line" style={{ width: "1.5rem" }} />
          <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
            FIVE PATHS · ONE TRADITION
          </span>
        </div>
      </div>
    </section>
  );
}
