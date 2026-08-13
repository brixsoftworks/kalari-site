"use client";

import { useEffect, useRef, useState } from "react";

interface WeaponSectionProps {
  id: string;
  title: string;
  accentTitle: string;
  desc: string;
  imgUrl: string;
  direction: 1 | -1; // 1 = shifts right/rotates left, -1 = shifts left/rotates right
  indexLabel: string;
  clipPath: string;
}

function WeaponSection({
  id,
  title,
  accentTitle,
  desc,
  imgUrl,
  direction,
  indexLabel,
  clipPath,
}: WeaponSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "100px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId: number;

    const updatePosition = () => {
      const section = sectionRef.current;
      if (!section || !inView) {
        rafId = requestAnimationFrame(updatePosition);
        return;
      }

      const rect = section.getBoundingClientRect();
      // Scroll progress relative to this section entering/exiting the screen
      const scrollOffset = window.innerHeight - rect.top;

      // Apply the alternating inverse animation algorithm
      // If direction === 1: pans right (X > 0), rotates left (Y < 0)
      // If direction === -1: pans left (X < 0), rotates right (Y > 0)
      const cameraX = Math.min(250, Math.max(-250, (scrollOffset - 350) * 0.45 * direction));
      const cameraRotY = Math.min(15, Math.max(-15, (scrollOffset - 350) * -0.045 * direction));
      const cameraRotX = Math.min(10, Math.max(-10, (scrollOffset - 350) * 0.015));

      if (bgRef.current) {
        bgRef.current.style.transform = `perspective(1200px) rotateX(${cameraRotX}deg) rotateY(${cameraRotY}deg) translate3d(${cameraX}px, 0, 0)`;
      }

      // Background layer shifts back on Z-axis and zooms slowly in opposite direction
      if (layer1Ref.current) {
        const bgScale = 1.05 + Math.max(0, scrollOffset * 0.0003);
        layer1Ref.current.style.transform = `translate3d(${-cameraX * 0.25}px, 0, -150px) scale(${bgScale})`;
      }

      // Glow flare sits in middle Z space
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(${cameraX * 0.15}px, 0, -30px) scale(1.15)`;
      }

      // Cutout layer of the weapon
      if (layer3Ref.current) {
        const weaponScale = 1.08 + Math.max(0, scrollOffset * 0.0006);
        const weaponZ = 80 + Math.min(80, scrollOffset * 0.08);
        layer3Ref.current.style.transform = `translate3d(${-cameraX * 0.45}px, 0, ${weaponZ}px) scale(${weaponScale})`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [inView, direction]);

  return (
    <div
      ref={sectionRef}
      id={id}
      className="relative w-full overflow-hidden"
      style={{ height: "70vh", minHeight: "450px", background: "var(--c-void)" }}
    >
      {/* 3D Parallax Container */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 transition-transform duration-75 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        aria-hidden="true"
      >
        {/* Layer 1: Ambient background image (weapons detail, desaturated and blurred) */}
        <div
          ref={layer1Ref}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${imgUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
            filter: "blur(6px) brightness(0.4) saturate(0.5)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 2: Warm ambient amber light glow layer */}
        <div
          ref={layer2Ref}
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(201, 76, 46, 0.4) 0%, transparent 60%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 3: Main Isolated Weapons Layer (pops forward on Z-axis, zooms faster) */}
        <div
          ref={layer3Ref}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${imgUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            clipPath: clipPath,
            transformStyle: "preserve-3d",
          }}
        />

        {/* Dark gradient overlays */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,9,8,1) 0%, rgba(10,9,8,0.2) 20%, rgba(10,9,8,0.2) 80%, rgba(10,9,8,1) 100%)",
          }}
        />
      </div>

      {/* Vignette */}
      <div className="vignette" aria-hidden="true" />

      {/* Content Overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-24 ${
          direction === -1 ? "items-end text-right md:pr-32" : "items-start text-left"
        }`}
      >
        <div className={`flex items-center gap-4 mb-4 ${direction === -1 ? "flex-row-reverse" : ""}`} aria-hidden="true">
          <span className="text-meta" style={{ color: "var(--c-smoke)" }}>
            {indexLabel}
          </span>
          <span className="accent-line" style={{ width: "1.5rem" }} />
          <span className="text-meta" style={{ color: "var(--c-gold)" }}>
            THE WEAPONRY
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--c-ivory)",
            lineHeight: 1.1,
            maxWidth: "36rem",
          }}
        >
          {title}{" "}
          <em style={{ color: "var(--c-vermilion)", fontStyle: "italic" }}>
            {accentTitle}
          </em>
        </h3>

        <p
          className="text-body mt-6"
          style={{
            maxWidth: "24rem",
            color: "var(--c-ash)",
            fontSize: "0.875rem",
          }}
        >
          {desc}
        </p>
      </div>

      {/* Accent divider lines */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

export default function WeaponsDetail() {
  return (
    <section aria-label="Weapons of Kalaripayattu" className="relative flex flex-col">
      {/* Weapon 1: Sword & Shield (Katti & Kedayam) */}
      <WeaponSection
        id="weapon-katti"
        title="FORGED IN ANCIENT"
        accentTitle="STEEL"
        desc="The katti (sword) and kedayam (shield). Students learn to protect the core while utilizing geometric strikes. A dance of precision and momentum."
        imgUrl="/images/weapons.jpg"
        direction={1}
        indexLabel="01 / 03"
        clipPath="polygon(15% 15%, 85% 15%, 85% 85%, 15% 85%)"
      />

      {/* Weapon 2: Urumi (Whip-sword) - Inverse animation of Weapon 1 */}
      <WeaponSection
        id="weapon-urumi"
        title="THE COILED"
        accentTitle="URUMI"
        desc="A three-meter whip-like flexible steel sword. Kept coiled around the waist and unleashed with high-speed centrifugal force. Requires absolute mastery of body."
        imgUrl="/images/weapons_urumi.jpg"
        direction={-1}
        indexLabel="02 / 03"
        clipPath="polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)"
      />

      {/* Weapon 3: Otta (Curved staff) - Inverse animation of Weapon 2 */}
      <WeaponSection
        id="weapon-otta"
        title="THE CURVED"
        accentTitle="OTTA"
        desc="Curved wooden staff representing an elephant's trunk. Used to strike vital pressure points (marmas) along fluid paths. The peak of wooden weapons training."
        imgUrl="/images/weapons_otta.jpg"
        direction={1}
        indexLabel="03 / 03"
        clipPath="polygon(15% 15%, 85% 15%, 85% 85%, 15% 85%)"
      />
    </section>
  );
}
