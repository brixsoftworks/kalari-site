"use client";

export default function TheGuru() {
  return (
    <section
      id="guru"
      style={{ background: "var(--c-ground)" }}
      aria-labelledby="guru-heading"
    >
      {/* Divider */}
      <div className="divider" aria-hidden="true" />

      <div className="kalari-container pt-24 pb-6 flex items-center gap-6" aria-hidden="true">
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 05</span>
        <span className="accent-line" />
      </div>

      <div className="kalari-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-start">

          {/* Portrait */}
          <div className="md:col-span-5 clip-reveal">
            <div
              className="img-hover-wrap"
              style={{ position: "relative" }}
              data-cursor-label="THE GURU"
            >
              <img
                src="/images/guru.jpg"
                alt="The Guru — Keeper of the Kalaripayattu tradition, Kerala"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
                loading="lazy"
              />
              {/* Subtle red overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(66,26,22,0.4) 0%, transparent 50%)",
                }}
                aria-hidden="true"
              />

              {/* Portrait label */}
              <div
                className="absolute bottom-6 left-6"
                aria-hidden="true"
              >
                <span className="text-meta" style={{ color: "var(--c-ash)" }}>
                  GURUKKAL
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="md:col-span-6 md:col-start-7 flex flex-col justify-center"
            style={{ paddingTop: "clamp(0, 8vh, 6rem)" }}
          >
            {/* Label */}
            <div className="reveal-up mb-8">
              <span className="text-label" style={{ color: "var(--c-vermilion)" }}>
                KEEPER OF THE TRADITION
              </span>
            </div>

            {/* Heading */}
            <div className="reveal-line mb-12">
              <span>
                <h2
                  id="guru-heading"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 6vw, 6rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                    color: "var(--c-ivory)",
                    lineHeight: 1,
                  }}
                >
                  THE
                  <br />
                  <em style={{ color: "var(--c-gold)", fontStyle: "italic" }}>GURU</em>
                </h2>
              </span>
            </div>

            {/* Quote */}
            <div
              className="reveal-up mb-10"
              style={{ transitionDelay: "0.2s" }}
            >
              <div
                style={{
                  width: "1px",
                  height: "3rem",
                  background: "var(--c-vermilion)",
                  marginBottom: "1.5rem",
                }}
                aria-hidden="true"
              />
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "var(--c-parchment)",
                  lineHeight: 1.5,
                }}
              >
                &ldquo;The body does not lie. Train it with honesty, and it will
                never betray you.&rdquo;
              </p>
            </div>

            {/* Bio */}
            <div
              className="reveal-up"
              style={{ transitionDelay: "0.35s" }}
            >
              <p
                className="text-body mb-8"
                style={{ color: "var(--c-ash)", opacity: 0.85 }}
              >
                Gurukkal Narayanan Nair has taught Kalaripayattu for over forty
                years in Northern Kerala. A student of the Vadakkan tradition,
                he carries the unbroken lineage of the ancient Thiyya gurukula.
                His teaching is direct, physical, and deeply rooted in the
                original forms.
              </p>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 gap-6 pt-8"
                style={{ borderTop: "1px solid rgba(199,154,98,0.12)" }}
              >
                {[
                  { num: "40+", label: "Years Teaching" },
                  { num: "500+", label: "Students Trained" },
                  { num: "III", label: "Generations" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                        fontWeight: 300,
                        color: "var(--c-gold)",
                        display: "block",
                        lineHeight: 1,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {stat.num}
                    </span>
                    <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
                      {stat.label.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
