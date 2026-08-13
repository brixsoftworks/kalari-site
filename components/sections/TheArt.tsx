"use client";

export default function TheArt() {
  return (
    <section
      id="art"
      style={{ background: "var(--c-abyss)" }}
      aria-labelledby="art-heading"
    >
      {/* Divider */}
      <div className="divider" aria-hidden="true" />

      {/* Chapter header */}
      <div className="kalari-container pt-24 pb-6 flex items-center gap-6" aria-hidden="true">
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 04</span>
        <span className="accent-line" />
      </div>

      {/* Massive heading */}
      <div className="kalari-container pb-16">
        <div className="reveal-line">
          <span>
            <h2
              id="art-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 14vw, 16rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 0.85,
                color: "var(--c-ivory)",
              }}
            >
              THE
            </h2>
          </span>
        </div>
        <div className="reveal-line" style={{ transitionDelay: "0.1s" }}>
          <span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 14vw, 16rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 0.85,
                color: "var(--c-gold)",
                fontStyle: "italic",
                display: "block",
              }}
            >
              ART
            </span>
          </span>
        </div>
      </div>

      {/* Two-column content */}
      <div className="kalari-container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left: large statement */}
          <div className="md:col-span-7 reveal-up" style={{ transitionDelay: "0.15s" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                fontWeight: 300,
                lineHeight: 1.4,
                color: "var(--c-parchment)",
              }}
            >
              Kalaripayattu is more than combat. It is a discipline of body,
              breath, awareness and movement — one of the world&apos;s oldest
              living martial traditions, born in the forests of Kerala over
              3,000 years ago.
            </p>
          </div>

          {/* Right: details */}
          <div
            className="md:col-span-4 md:col-start-9 reveal-up"
            style={{ transitionDelay: "0.3s" }}
          >
            <span className="accent-line mb-6" />
            <div className="flex flex-col gap-8">
              {[
                {
                  title: "ORIGINS",
                  desc: "Rooted in the ancient gurukula tradition. Passed body to body. Breath to breath.",
                },
                {
                  title: "PHILOSOPHY",
                  desc: "The body as a weapon. The mind as its master. The breath as the bridge between.",
                },
                {
                  title: "MOVEMENT",
                  desc: "Animal postures. Serpentine flow. Explosive precision. The body learns to remember.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <span className="text-label block mb-2" style={{ color: "var(--c-vermilion)" }}>
                    {item.title}
                  </span>
                  <p
                    className="text-body"
                    style={{ color: "var(--c-ash)", fontSize: "0.8125rem" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width weapons image with overlapping text */}
      <div className="relative clip-reveal" style={{ height: "clamp(280px, 55vh, 640px)" }}>
        <img
          src="/images/weapons.jpg"
          alt="Traditional Kalaripayattu weapons — urumi, katti, and shield on aged wood"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,9,8,0.75) 0%, rgba(10,9,8,0.2) 60%, rgba(10,9,8,0.6) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Overlapping text */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ paddingLeft: "clamp(1.5rem, 6vw, 8rem)" }}
        >
          <div>
            <span className="text-meta block mb-4" style={{ color: "var(--c-smoke)" }}>
              THE WEAPONS
            </span>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
                fontWeight: 300,
                color: "var(--c-ivory)",
                lineHeight: 1.1,
                maxWidth: "18rem",
              }}
            >
              Steel forged in ancient fire. Each weapon — a teacher.
            </p>
          </div>
        </div>
      </div>

      <div className="kalari-container pt-16 pb-24">
        <p
          className="text-meta text-center"
          style={{ color: "var(--c-smoke)", letterSpacing: "0.25em" }}
        >
          A TRADITION PASSED FROM BODY TO BODY
        </p>
      </div>
    </section>
  );
}
