"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "01" },
  { id: "kalari", label: "02" },
  { id: "art", label: "03" },
  { id: "practice", label: "04" },
  { id: "movement", label: "05" },
  { id: "guru", label: "06" },
  { id: "training", label: "07" },
  { id: "philosophy", label: "08" },
  { id: "join", label: "09" },
];

export default function ScrollProgress() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((sec, i) => {
      const el = document.getElementById(sec.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="scroll-progress-bar"
      aria-label="Page sections progress"
    >
      {sections.map((sec, i) => (
        <button
          key={sec.id}
          onClick={() => scrollTo(sec.id)}
          className={`progress-dot${active === i ? " active" : ""}`}
          aria-label={`Go to section ${sec.label}`}
          title={sec.label}
        />
      ))}
    </nav>
  );
}
