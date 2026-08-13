"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const navLinks = [
    { href: "#kalari", label: "The Kalari" },
    { href: "#art", label: "The Art" },
    { href: "#practice", label: "Training" },
    { href: "#join", label: "Join" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      {/* Main nav */}
      <header className={`nav-root${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="flex flex-col items-start gap-0 group"
          aria-label="Return to top"
          style={{ cursor: "none" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.3em",
              color: "var(--c-ivory)",
              lineHeight: 1,
            }}
          >
            KALARI
          </span>
          <span className="text-meta" style={{ letterSpacing: "0.15em", fontSize: "0.5rem" }}>
            KERALA · INDIA
          </span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-label transition-colors duration-300"
              style={{ cursor: "none", color: "var(--c-ash)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--c-ivory)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--c-ash)")}
            >
              {link.label.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* Menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{ cursor: "none" }}
        >
          <span className="text-label hidden md:block" style={{ color: "var(--c-ash)" }}>
            {menuOpen ? "CLOSE" : "MENU"}
          </span>
          <div className="flex flex-col gap-1.5 w-6" aria-hidden="true">
            <span
              className="block h-px transition-all duration-400"
              style={{
                background: "var(--c-ivory)",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(4px) rotate(45deg)" : "",
                transitionDuration: "0.4s",
              }}
            />
            <span
              className="block h-px transition-all duration-400"
              style={{
                background: "var(--c-ivory)",
                opacity: menuOpen ? 0 : 1,
                transitionDuration: "0.4s",
              }}
            />
            <span
              className="block h-px transition-all duration-400"
              style={{
                background: "var(--c-ivory)",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "",
                transitionDuration: "0.4s",
              }}
            />
          </div>
        </button>
      </header>

      {/* Fullscreen overlay menu */}
      <div
        className={`fullscreen-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Background decorative image */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/images/interior.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-meta mb-8" style={{ color: "var(--c-smoke)" }}>
            NAVIGATE
          </span>
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                fontWeight: 300,
                color: menuOpen ? "var(--c-ivory)" : "transparent",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(2rem)",
                transition: `color 0.3s, opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.05}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.05}s`,
                cursor: "none",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--c-gold)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--c-ivory)")
              }
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Footer meta */}
        <div
          className="absolute bottom-10 left-[clamp(2rem,8vw,8rem)] right-[clamp(2rem,8vw,8rem)] flex justify-between items-end"
          style={{ opacity: menuOpen ? 1 : 0, transition: "opacity 0.5s 0.4s" }}
        >
          <div>
            <span className="text-meta block mb-1">KALARIPAYATTU</span>
            <span className="text-meta">EST. ANCIENT TRADITION</span>
          </div>
          <div className="text-right">
            <span className="text-meta block mb-1">KERALA · INDIA</span>
            <span className="text-meta">© 2026 KALARI</span>
          </div>
        </div>
      </div>
    </>
  );
}
