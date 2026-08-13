"use client";

const programs = [
  {
    id: "beginner",
    level: "BEGINNER",
    title: "First Steps",
    desc: "Begin with the body. Learn meippayattu, the foundational postures, and the breath work that underpins all of Kalaripayattu.",
    duration: "3 Months",
    sessions: "3× per week",
    time: "06:00 – 08:00",
    num: "01",
  },
  {
    id: "intermediate",
    level: "INTERMEDIATE",
    title: "The Form Deepens",
    desc: "Vadivu stances, wooden weapons, and advanced body conditioning. The warrior begins to understand the geometry of movement.",
    duration: "6 Months",
    sessions: "4× per week",
    time: "06:00 – 08:30",
    num: "02",
  },
  {
    id: "advanced",
    level: "ADVANCED",
    title: "Steel & Precision",
    desc: "Metal weapons, combat sequences, and verumkai. Only for those who have built the foundation. The body must be ready.",
    duration: "12 Months",
    sessions: "5× per week",
    time: "05:30 – 08:30",
    num: "03",
  },
  {
    id: "children",
    level: "CHILDREN",
    title: "Young Warriors",
    desc: "A gentle introduction for ages 7–14. Emphasis on flexibility, discipline, focus, and the joy of movement.",
    duration: "Ongoing",
    sessions: "3× per week",
    time: "16:00 – 17:30",
    num: "04",
  },
  {
    id: "private",
    level: "PRIVATE",
    title: "The Direct Path",
    desc: "One-to-one instruction with the Gurukkal. Accelerated learning tailored to your body, pace, and purpose.",
    duration: "Flexible",
    sessions: "By arrangement",
    time: "By arrangement",
    num: "05",
  },
];

export default function Training() {
  return (
    <section
      id="training"
      style={{ background: "var(--c-abyss)" }}
      aria-labelledby="training-heading"
    >
      <div className="divider" aria-hidden="true" />

      <div className="kalari-container pt-24 pb-6 flex items-center gap-6" aria-hidden="true">
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 06</span>
        <span className="accent-line" />
      </div>

      <div className="kalari-container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="reveal-line">
            <span>
              <h2
                id="training-heading"
                className="text-chapter"
                style={{ color: "var(--c-ivory)" }}
              >
                TRAINING
                <br />
                <em style={{ color: "var(--c-gold)", fontStyle: "italic" }}>PROGRAMS</em>
              </h2>
            </span>
          </div>
          <div className="reveal-up" style={{ transitionDelay: "0.2s" }}>
            <p className="text-body" style={{ color: "var(--c-parchment)", opacity: 0.7 }}>
              Begin with the body. Every warrior starts at the same place — with
              honesty, patience, and the willingness to be a student.
            </p>
          </div>
        </div>
      </div>

      {/* Training cards */}
      <div className="kalari-container pb-24">
        <div className="flex flex-col gap-0">
          {programs.map((p, i) => (
            <div
              key={p.id}
              className="reveal-up"
              style={{
                transitionDelay: `${i * 0.08}s`,
                borderTop: "1px solid rgba(199,154,98,0.1)",
                padding: "clamp(1.5rem, 4vh, 3rem) 0",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Number */}
                <div className="md:col-span-1">
                  <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
                    {p.num}
                  </span>
                </div>

                {/* Level badge */}
                <div className="md:col-span-2">
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      color: "var(--c-vermilion)",
                      textTransform: "uppercase",
                      border: "1px solid var(--c-vermilion)",
                      padding: "0.3rem 0.75rem",
                      display: "inline-block",
                    }}
                  >
                    {p.level}
                  </span>
                </div>

                {/* Title + desc */}
                <div className="md:col-span-4">
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                      fontWeight: 300,
                      color: "var(--c-ivory)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-body"
                    style={{ color: "var(--c-ash)", fontSize: "0.8125rem", opacity: 0.85 }}
                  >
                    {p.desc}
                  </p>
                </div>

                {/* Details */}
                <div className="md:col-span-3 md:col-start-9 flex flex-col gap-3">
                  {[
                    { label: "DURATION", val: p.duration },
                    { label: "SESSIONS", val: p.sessions },
                    { label: "TIME", val: p.time },
                  ].map((d) => (
                    <div key={d.label} className="flex justify-between items-center">
                      <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
                        {d.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          color: "var(--c-parchment)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {d.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="md:col-span-1 md:col-start-12 flex items-center justify-end">
                  <button
                    onClick={() =>
                      document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })
                    }
                    aria-label={`Enquire about ${p.title} program`}
                    style={{
                      background: "none",
                      border: "1px solid rgba(199,154,98,0.3)",
                      color: "var(--c-gold)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "0.6rem 0.9rem",
                      cursor: "none",
                      transition: "border-color 0.3s, background 0.3s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(199,154,98,0.1)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--c-gold)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "none";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(199,154,98,0.3)";
                    }}
                  >
                    ENQUIRE
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Final border */}
          <div
            style={{ borderTop: "1px solid rgba(199,154,98,0.1)" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
