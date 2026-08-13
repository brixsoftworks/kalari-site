"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface WeaponSectionProps {
  id: string;
  title: string;
  accentTitle: string;
  desc: string;
  imgUrl: string;
  direction: 1 | -1;
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

  // GSAP ScrollTrigger for device-agnostic scroll zoom
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Zoom background layer
      gsap.fromTo(layer1Ref.current, 
        { scale: 1.05 },
        {
          scale: isMobile ? 1.25 : 1.3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      if (!isMobile) {
        // Zoom cutout faster on desktop for 3D parallax
        gsap.fromTo(layer3Ref.current,
          { scale: 1.08 },
          {
            scale: 1.35,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop 3D camera pan animation on scroll
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    let rafId: number;

    const updatePosition = () => {
      const section = sectionRef.current;
      if (!section) {
        rafId = requestAnimationFrame(updatePosition);
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollOffset = window.innerHeight - rect.top;

      // 3D Orbital camera pan on desktop
      const cameraX = Math.min(250, Math.max(-250, (scrollOffset - 350) * 0.45 * direction));
      const cameraRotY = Math.min(15, Math.max(-15, (scrollOffset - 350) * -0.045 * direction));
      const cameraRotX = Math.min(10, Math.max(-10, (scrollOffset - 350) * 0.015));

      if (bgRef.current) {
        bgRef.current.style.transform = `perspective(1200px) rotateX(${cameraRotX}deg) rotateY(${cameraRotY}deg) translate3d(${cameraX}px, 0, 0)`;
      }
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate3d(${-cameraX * 0.25}px, 0, -150px)`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(${cameraX * 0.15}px, 0, -30px) scale(1.15)`;
      }
      if (layer3Ref.current) {
        const weaponZ = 80 + Math.min(80, scrollOffset * 0.08);
        layer3Ref.current.style.transform = `translate3d(${-cameraX * 0.45}px, 0, ${weaponZ}px)`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [direction]);

  return (
    <div
      ref={sectionRef}
      id={id}
      className="relative w-full overflow-hidden"
      style={{ height: "70vh", minHeight: "380px", background: "var(--c-void)" }}
    >
      {/* Parallax Container (Bleed margins applied to cover gaps during pan/tilt shifts) */}
      <div
        ref={bgRef}
        className="absolute transition-transform duration-75 ease-out weapon-container-3d"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
        aria-hidden="true"
      >
        {/* Layer 1: Main background image */}
        <div
          ref={layer1Ref}
          className="absolute inset-0 weapon-bg-layer"
          style={{
            backgroundImage: `url('${imgUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
            filter: "blur(6px) brightness(0.4) saturate(0.5)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 2: Amber light glow (Desktop only) */}
        <div
          ref={layer2Ref}
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge hidden md:block"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(201, 76, 46, 0.4) 0%, transparent 60%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Layer 3: Weapon Cutout (Desktop only) */}
        <div
          ref={layer3Ref}
          className="absolute inset-0 hidden md:block"
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
        className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-24 items-start text-left"
      >
        <div className="flex items-center gap-4 mb-4" aria-hidden="true">
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
            fontSize: "clamp(1.8rem, 4vw, 4.5rem)",
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
          className="text-body mt-4 md:mt-6"
          style={{
            maxWidth: "24rem",
            color: "var(--c-parchment)",
            fontSize: "1.0rem",
          }}
        >
          {desc}
        </p>
      </div>

      {/* Divider line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800/40 to-transparent"
        aria-hidden="true"
      />

      {/* Responsive adjustments & Bleed styling */}
      <style jsx>{`
        .weapon-container-3d {
          inset: -15% -25%; /* 15% vertical and 25% horizontal bleed to fully fill gap during large panning translations */
        }
        @media (max-width: 767px) {
          .weapon-container-3d {
            inset: 0% !important; /* Reset bleed on mobile */
            width: 100%;
            height: 100%;
          }
          .weapon-bg-layer {
            filter: brightness(0.5) !important;
            opacity: 0.75 !important;
          }
        }
        @media (min-width: 768px) {
          .weapon-bg-layer {
            filter: blur(6px) brightness(0.4) saturate(0.5) !important;
            opacity: 0.25 !important;
          }
        }
      `}</style>
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
