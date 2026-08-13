"use client";

export default function Location() {
  return (
    <section
      style={{ background: "var(--c-void)" }}
      aria-labelledby="location-heading"
    >
      <div className="divider" aria-hidden="true" />

      <div className="kalari-container pt-24 pb-6 flex items-center gap-6" aria-hidden="true">
        <span className="text-meta" style={{ color: "var(--c-smoke)" }}>CHAPTER 09</span>
        <span className="accent-line" />
      </div>

      <div className="kalari-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

          {/* Left: details */}
          <div className="md:col-span-5 flex flex-col gap-10">
            <div className="reveal-line">
              <span>
                <h2
                  id="location-heading"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 5vw, 5rem)",
                    fontWeight: 300,
                    color: "var(--c-ivory)",
                    lineHeight: 1,
                  }}
                >
                  FIND THE
                  <br />
                  <em style={{ color: "var(--c-gold)", fontStyle: "italic" }}>KALARI</em>
                </h2>
              </span>
            </div>

            <div className="reveal-up" style={{ transitionDelay: "0.15s" }}>
              <p className="text-body" style={{ color: "var(--c-ash)", opacity: 0.8 }}>
                We are located in the heart of Kozhikode (Calicut), the ancient
                trading city of Northern Kerala — birthplace of the Vadakkan
                Kalaripayattu tradition.
              </p>
            </div>

            {/* Info blocks */}
            <div
              className="flex flex-col gap-8 reveal-up"
              style={{ transitionDelay: "0.25s" }}
            >
              {[
                {
                  label: "ADDRESS",
                  content: (
                    <>
                      Near Thali Temple, Kozhikode<br />
                      Kerala, India — 673 001
                    </>
                  ),
                },
                {
                  label: "HOURS",
                  content: (
                    <>
                      Monday – Saturday<br />
                      05:30 – 09:00 &nbsp;/&nbsp; 16:00 – 19:00<br />
                      <span style={{ color: "var(--c-smoke)", fontSize: "0.9rem" }}>
                        Sunday: Rest
                      </span>
                    </>
                  ),
                },
                {
                  label: "CONTACT",
                  content: (
                    <>
                      <a
                        href="mailto:enter@kalari.in"
                        style={{
                          color: "var(--c-gold)",
                          textDecoration: "none",
                          cursor: "none",
                        }}
                      >
                        enter@kalari.in
                      </a>
                      <br />
                      <a
                        href="tel:+914952230000"
                        style={{
                          color: "var(--c-parchment)",
                          textDecoration: "none",
                          cursor: "none",
                        }}
                      >
                        +91 495 223 0000
                      </a>
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderLeft: "1px solid var(--c-deep-red)",
                    paddingLeft: "1.25rem",
                  }}
                >
                  <span
                    className="text-meta block mb-3"
                    style={{ color: "var(--c-smoke)" }}
                  >
                    {item.label}
                  </span>
                  <p
                    className="text-body"
                    style={{ color: "var(--c-parchment)", lineHeight: 1.7 }}
                  >
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Directions button */}
            <div className="reveal-up" style={{ transitionDelay: "0.35s" }}>
              <a
                href="https://maps.google.com/?q=Thali+Temple+Kozhikode+Kerala"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--c-gold)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(199,154,98,0.3)",
                  paddingBottom: "0.25rem",
                  cursor: "none",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--c-gold)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(199,154,98,0.3)")
                }
              >
                GET DIRECTIONS
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Right: stylized map placeholder with atmospheric overlay */}
          <div
            className="md:col-span-7 clip-reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <div
              style={{
                position: "relative",
                height: "clamp(280px, 55vh, 560px)",
                background: "var(--c-soil)",
                overflow: "hidden",
              }}
            >
              {/* Embedded map iframe */}
              <iframe
                title="Kalari location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.755878940734!2d75.7769!3d11.2535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65ef9a4780d05%3A0x8d8cc6e5e5a3a8c2!2sThali%20Temple%2C%20Kozhikode!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "invert(90%) hue-rotate(180deg) brightness(0.7) saturate(0.3)",
                  display: "block",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Dark overlay so map doesn't dominate */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(10,9,8,0.35)" }}
                aria-hidden="true"
              />

              {/* Location pin label */}
              <div
                className="absolute bottom-6 left-6"
                style={{
                  background: "rgba(10,9,8,0.85)",
                  backdropFilter: "blur(8px)",
                  padding: "0.75rem 1.25rem",
                  border: "1px solid rgba(199,154,98,0.2)",
                }}
                aria-hidden="true"
              >
                <span className="text-meta block" style={{ color: "var(--c-gold)" }}>
                  KALARI
                </span>
                <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
                  KOZHIKODE · KERALA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
