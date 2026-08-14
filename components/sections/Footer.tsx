"use client";

export default function Footer() {
  const scrollToJoin = () => {
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{ background: "var(--c-void)", position: "relative", overflow: "hidden" }}
      aria-label="Site footer"
    >
      {/* Background atmospheric image */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: "url('/images/lamp.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
        }}
      />

      {/* Top divider */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, var(--c-deep-red), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="kalari-container relative z-10">
        {/* Main footer content */}
        <div
          style={{
            paddingTop: "clamp(6rem, 16vh, 14rem)",
            paddingBottom: "clamp(4rem, 8vh, 8rem)",
            textAlign: "center",
          }}
        >
          {/* Large ending statement */}
          <div className="reveal-line">
            <span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 10vw, 11rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.85,
                  color: "var(--c-ivory)",
                }}
              >
                ENTER THE
              </p>
            </span>
          </div>
          <div className="reveal-line" style={{ transitionDelay: "0.1s" }}>
            <span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 10vw, 11rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.85,
                  color: "var(--c-gold)",
                  fontStyle: "italic",
                  display: "block",
                  marginBottom: "clamp(3rem, 8vh, 7rem)",
                }}
              >
                KALARI
              </span>
            </span>
          </div>

          {/* CTA button */}
          <div className="reveal-up" style={{ transitionDelay: "0.25s" }}>
            <button
              onClick={scrollToJoin}
              style={{
                background: "none",
                border: "1px solid var(--c-gold)",
                color: "var(--c-gold)",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                padding: "1.25rem 3.5rem",
                cursor: "none",
                transition: "background 0.4s, color 0.4s",
                marginBottom: "clamp(4rem, 10vh, 8rem)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "var(--c-gold)";
                el.style.color = "var(--c-void)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "none";
                el.style.color = "var(--c-gold)";
              }}
            >
              BOOK A CLASS
            </button>
          </div>
        </div>

        {/* Footer bottom row */}
        <div
          style={{
            borderTop: "1px solid rgba(199,154,98,0.12)",
            paddingTop: "2.5rem",
            paddingBottom: "2.5rem",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  color: "var(--c-ivory)",
                }}
              >
                KADATHANAD
              </span>
              <span className="text-meta mt-1" style={{ color: "var(--c-gold)", fontSize: "0.6rem" }}>
                KPCGM KALARISANGHAM
              </span>
            </div>

            {/* Social links */}
            <nav className="flex items-center gap-8" aria-label="Social media links">
              {[
                { label: "INSTAGRAM", href: "https://www.instagram.com/martialarts_school_" },
                { label: "YOUTUBE", href: "https://www.youtube.com/@kpcgmkalariofficial3899" },
                { label: "WHATSAPP", href: "https://wa.me/914962528135" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-meta"
                  style={{
                    color: "var(--c-smoke)",
                    textDecoration: "none",
                    cursor: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "var(--c-ivory)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "var(--c-smoke)")
                  }
                >
                  {s.label}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
              © 2026 KADATHANAD KPCGM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
