"use client";

export default function TheKalari() {
  return (
    <section
      id="kalari"
      className="relative"
      style={{ background: "var(--c-void)" }}
      aria-labelledby="kalari-heading"
    >
      {/* Chapter label */}
      <div
        className="kalari-container pt-24 pb-6 flex items-center gap-6"
        aria-hidden="true"
      >
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 03</span>
        <span
          className="accent-line"
          style={{ width: "2rem", background: "var(--c-vermilion)" }}
        />
      </div>

      {/* Two-column intro */}
      <div className="kalari-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-end pb-16">
          <div>
            <div className="reveal-line">
              <span>
                <h2
                  id="kalari-heading"
                  className="text-chapter"
                  style={{ color: "var(--c-ivory)" }}
                >
                  THE
                  <br />
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--c-gold)",
                    }}
                  >
                    KALARI
                  </em>
                </h2>
              </span>
            </div>
          </div>
          <div className="reveal-up" style={{ transitionDelay: "0.2s" }}>
            <p className="text-body" style={{ color: "var(--c-parchment)", opacity: 0.8 }}>
              Where the body learns discipline, and movement becomes memory.
              The kalari is not merely a training space — it is a living temple
              where the warrior tradition breathes.
            </p>
          </div>
        </div>
      </div>

      {/* Full-width image */}
      <div
        className="img-hover-wrap clip-reveal"
        data-cursor-label="ENTER"
        style={{
          position: "relative",
          height: "clamp(320px, 65vh, 760px)",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/interior.jpg"
          alt="Interior of the ancient kalari training hall with oil lamps and red earth floor"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            display: "block",
          }}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.6) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Image caption */}
        <div
          className="absolute bottom-8 left-[clamp(1.5rem,4vw,4rem)]"
          aria-hidden="true"
        >
          <span className="text-meta" style={{ color: "var(--c-ash)" }}>
            VADAKARA &nbsp;·&nbsp; NORTHERN KERALA
          </span>
        </div>
      </div>

      {/* Bottom text block */}
      <div className="kalari-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div
            className="md:col-span-2 reveal-up"
            style={{ transitionDelay: "0.1s" }}
          >
            <p
              className="text-section"
              style={{
                color: "var(--c-ivory)",
                fontFamily: "var(--font-display)",
                fontWeight: 300,
              }}
            >
              "A sacred space of red earth and wooden beams, where the lamp
              never dies."
            </p>
          </div>
          <div className="reveal-up" style={{ transitionDelay: "0.3s" }}>
            <span className="accent-line mb-4" />
            <p
              className="text-body"
              style={{ color: "var(--c-parchment)", opacity: 0.85, fontSize: "1.0rem" }}
            >
              Built facing east, aligned to the elements. The kalari is divided
              into sacred zones — each carrying specific meaning. The earth
              floor is oiled and blessed before every session.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
