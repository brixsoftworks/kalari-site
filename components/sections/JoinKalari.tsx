"use client";

import { useState } from "react";

const steps = [
  { num: "01", label: "CHOOSE PROGRAM" },
  { num: "02", label: "CHOOSE DATE" },
  { num: "03", label: "YOUR DETAILS" },
  { num: "04", label: "CONFIRM" },
];

const programs = [
  "Beginner — First Steps",
  "Intermediate — The Form Deepens",
  "Advanced — Steel & Precision",
  "Children — Young Warriors",
  "Private — The Direct Path",
];

export default function JoinKalari() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="join"
      style={{ background: "var(--c-deep-red)", position: "relative", overflow: "hidden" }}
      aria-labelledby="join-heading"
    >
      {/* Background atmospheric image */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
        }}
      />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, var(--c-deep-red) 0%, var(--c-ember) 50%, var(--c-deep-red) 100%)",
          opacity: 0.9,
        }}
      />

      <div className="kalari-container relative z-10 section-padding">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="reveal-line">
            <span>
              <span className="text-meta" style={{ color: "rgba(232,221,203,0.5)" }}>
                STEP INTO THE KALARI
              </span>
            </span>
          </div>
          <div className="reveal-line" style={{ transitionDelay: "0.1s", marginTop: "1.5rem" }}>
            <span>
              <h2
                id="join-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 9vw, 9rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 0.9,
                  color: "var(--c-ivory)",
                }}
              >
                BEGIN YOUR
                <br />
                <em style={{ fontStyle: "italic", color: "var(--c-gold)" }}>JOURNEY</em>
              </h2>
            </span>
          </div>
          <div className="reveal-up mt-8" style={{ transitionDelay: "0.25s" }}>
            <p
              className="text-body"
              style={{
                color: "rgba(232,221,203,0.7)",
                maxWidth: "36rem",
                margin: "0 auto",
              }}
            >
              Begin your journey into one of the world&apos;s oldest living
              martial traditions. Every warrior starts as a student.
            </p>
          </div>
        </div>

        {submitted ? (
          /* Success state */
          <div
            className="text-center py-20 reveal-up"
            aria-live="polite"
            role="status"
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                border: "1px solid var(--c-gold)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
                fontSize: "1.5rem",
                color: "var(--c-gold)",
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 300,
                color: "var(--c-ivory)",
                marginBottom: "1rem",
              }}
            >
              The door is open.
            </h3>
            <p className="text-body" style={{ color: "rgba(232,221,203,0.7)" }}>
              We will be in touch within 24 hours to confirm your place.
            </p>
          </div>
        ) : (
          /* Multi-step form */
          <div className="max-w-3xl mx-auto reveal-up" style={{ transitionDelay: "0.3s" }}>

            {/* Step indicator */}
            <div
              className="flex items-center justify-between mb-16 relative"
              role="tablist"
              aria-label="Booking steps"
            >
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className="flex flex-col items-center gap-2 flex-1"
                  role="tab"
                  aria-selected={step === i}
                >
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      border: `1px solid ${step >= i ? "var(--c-gold)" : "rgba(232,221,203,0.2)"}`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: step > i ? "var(--c-gold)" : "transparent",
                      transition: "border-color 0.4s, background 0.4s",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.05em",
                        color: step > i ? "var(--c-void)" : step === i ? "var(--c-gold)" : "rgba(232,221,203,0.4)",
                      }}
                    >
                      {step > i ? "✓" : s.num}
                    </span>
                  </div>
                  <span
                    className="text-meta hidden md:block"
                    style={{
                      color: step >= i ? "rgba(232,221,203,0.8)" : "rgba(232,221,203,0.3)",
                      transition: "color 0.3s",
                    }}
                  >
                    {s.label}
                  </span>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        left: `${(i + 0.5) * (100 / steps.length)}%`,
                        width: `${100 / steps.length}%`,
                        height: "1px",
                        background: step > i ? "var(--c-gold)" : "rgba(232,221,203,0.15)",
                        transition: "background 0.4s",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <form onSubmit={handleSubmit}>
              {step === 0 && (
                <fieldset>
                  <legend className="text-meta mb-8" style={{ color: "rgba(232,221,203,0.5)" }}>
                    SELECT A PROGRAM
                  </legend>
                  <div className="flex flex-col gap-3">
                    {programs.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelected(p)}
                        style={{
                          width: "100%",
                          padding: "1.25rem 1.75rem",
                          background: selected === p ? "rgba(199,154,98,0.15)" : "rgba(232,221,203,0.04)",
                          border: `1px solid ${selected === p ? "var(--c-gold)" : "rgba(232,221,203,0.12)"}`,
                          color: selected === p ? "var(--c-gold)" : "var(--c-ivory)",
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(1rem, 2vw, 1.4rem)",
                          fontWeight: 300,
                          textAlign: "left",
                          cursor: "none",
                          transition: "border-color 0.3s, background 0.3s, color 0.3s",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="text-meta mb-8" style={{ color: "rgba(232,221,203,0.5)" }}>
                    PREFERRED START DATE
                  </legend>
                  <div>
                    <label htmlFor="start-date" className="text-label mb-3 block"
                      style={{ color: "rgba(232,221,203,0.5)" }}>
                      START DATE
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        padding: "1rem 1.25rem",
                        background: "rgba(232,221,203,0.06)",
                        border: "1px solid rgba(232,221,203,0.2)",
                        color: "var(--c-ivory)",
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        outline: "none",
                        colorScheme: "dark",
                      }}
                    />
                    <p className="text-meta mt-4" style={{ color: "rgba(232,221,203,0.4)" }}>
                      We will confirm availability within 24 hours
                    </p>
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="text-meta mb-8" style={{ color: "rgba(232,221,203,0.5)" }}>
                    YOUR DETAILS
                  </legend>
                  <div className="flex flex-col gap-5">
                    {[
                      { id: "name", label: "FULL NAME", type: "text", key: "name" as const, required: true },
                      { id: "email", label: "EMAIL", type: "email", key: "email" as const, required: true },
                      { id: "phone", label: "PHONE (OPTIONAL)", type: "tel", key: "phone" as const, required: false },
                    ].map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="text-meta block mb-2"
                          style={{ color: "rgba(232,221,203,0.5)" }}
                        >
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          value={form[field.key]}
                          required={field.required}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          style={{
                            width: "100%",
                            padding: "1rem 1.25rem",
                            background: "rgba(232,221,203,0.06)",
                            border: "1px solid rgba(232,221,203,0.2)",
                            color: "var(--c-ivory)",
                            fontFamily: "var(--font-body)",
                            fontSize: "1rem",
                            outline: "none",
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        htmlFor="message"
                        className="text-meta block mb-2"
                        style={{ color: "rgba(232,221,203,0.5)" }}
                      >
                        MESSAGE (OPTIONAL)
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, message: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "1rem 1.25rem",
                          background: "rgba(232,221,203,0.06)",
                          border: "1px solid rgba(232,221,203,0.2)",
                          color: "var(--c-ivory)",
                          fontFamily: "var(--font-body)",
                          fontSize: "1rem",
                          outline: "none",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <div>
                  <p className="text-meta mb-10" style={{ color: "rgba(232,221,203,0.5)" }}>
                    CONFIRM YOUR BOOKING
                  </p>
                  <div className="flex flex-col gap-5">
                    {[
                      { label: "PROGRAM", val: selected },
                      { label: "START DATE", val: date || "To be confirmed" },
                      { label: "NAME", val: form.name },
                      { label: "EMAIL", val: form.email },
                    ].map((r) => (
                      <div
                        key={r.label}
                        style={{
                          borderBottom: "1px solid rgba(232,221,203,0.1)",
                          paddingBottom: "1rem",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <span className="text-meta" style={{ color: "rgba(232,221,203,0.4)" }}>
                          {r.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.875rem",
                            color: "var(--c-ivory)",
                            textAlign: "right",
                          }}
                        >
                          {r.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div
                className="flex items-center justify-between mt-12"
                style={{ borderTop: "1px solid rgba(232,221,203,0.1)", paddingTop: "2rem" }}
              >
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    style={{
                      background: "none",
                      border: "1px solid rgba(232,221,203,0.2)",
                      color: "rgba(232,221,203,0.6)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "1rem 1.75rem",
                      cursor: "none",
                      transition: "border-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = "rgba(232,221,203,0.5)";
                      el.style.color = "var(--c-ivory)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = "rgba(232,221,203,0.2)";
                      el.style.color = "rgba(232,221,203,0.6)";
                    }}
                  >
                    ← BACK
                  </button>
                ) : (
                  <div />
                )}

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={step === 0 && !selected}
                    style={{
                      background: "var(--c-gold)",
                      border: "1px solid var(--c-gold)",
                      color: "var(--c-void)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "1rem 2.5rem",
                      cursor: step === 0 && !selected ? "default" : "none",
                      opacity: step === 0 && !selected ? 0.4 : 1,
                      transition: "opacity 0.3s, background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (!(step === 0 && !selected)) {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--c-antique)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--c-gold)";
                    }}
                  >
                    CONTINUE →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!form.name || !form.email}
                    style={{
                      background: "var(--c-gold)",
                      border: "1px solid var(--c-gold)",
                      color: "var(--c-void)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      padding: "1.25rem 3rem",
                      cursor: "none",
                      opacity: !form.name || !form.email ? 0.4 : 1,
                      transition: "opacity 0.3s, background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--c-antique)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--c-gold)";
                    }}
                  >
                    BOOK A CLASS
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Bottom flourish */}
        <div className="text-center mt-24">
          <p className="text-meta" style={{ color: "rgba(232,221,203,0.3)" }}>
            KALARIPAYATTU &nbsp;·&nbsp; KERALA &nbsp;·&nbsp; INDIA &nbsp;·&nbsp; EST. ANCIENT
          </p>
        </div>
      </div>
    </section>
  );
}
