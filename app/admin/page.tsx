"use client";

import { useState, useEffect, useRef } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ADMIN_EMAILS = [
  ...new Set([
    ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
    "mullainathan95@gmail.com",
    "aromalsangeerth@gmail.com",
  ]),
];

const STATUSES = ["new", "contacted", "enrolled", "closed"] as const;
type Status = (typeof STATUSES)[number];

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program: string;
  amount?: number;
  startDate?: string;
  message?: string;
  status: Status;
  paymentStatus?: "pending" | "completed";
  createdAt?: { toDate?: () => Date } | null;
}

const STATUS_COLORS: Record<Status, string> = {
  new: "#e8b04b",
  contacted: "#7ab8f5",
  enrolled: "#7dd487",
  closed: "#8a8578",
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [installEvent, setInstallEvent] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"enquiries" | "programs">("enquiries");
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    setInAppBrowser(/FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Snapchat/i.test(navigator.userAgent));
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) {
          const email = res.user.email?.toLowerCase() ?? "";
          if (!ADMIN_EMAILS.includes(email)) {
            signOut(auth);
            setDenied(true);
          }
        }
      })
      .catch((err) => {
        console.error("Redirect sign-in failed:", err);
        const code = (err as { code?: string }).code ?? "";
        if (code !== "auth/no-auth-event") {
          setLoginError(
            "Sign-in could not be completed. If you opened this link from WhatsApp or Instagram, open it in Chrome (Android) or Safari (iPhone) instead.",
          );
        }
      });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      setDenied(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as unknown as { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", handler);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/admin-sw.js").catch(() => {});
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      setEnquiries(null);
      return;
    }
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        setEnquiries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Enquiry, "id">) })));
      },
      (err) => {
        console.error(err);
        setEnquiries([]);
      },
    );
    return () => {
      unsubRef.current?.();
    };
  }, [user]);

  const login = async () => {
    setLoginError(null);
    setDenied(false);
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      const email = res.user.email?.toLowerCase() ?? "";
      if (!ADMIN_EMAILS.includes(email)) {
        await signOut(auth);
        setDenied(true);
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      console.error("Login failed:", err);
      if (
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request" ||
        code === "auth/operation-not-supported-in-this-environment"
      ) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (err2) {
          console.error("Redirect sign-in failed:", err2);
          setLoginError(
            "Sign-in failed in this browser. Please open this page in Chrome or Safari and try again.",
          );
        }
      } else if (code === "auth/unauthorized-domain") {
        setLoginError("This domain is not authorized for sign-in.");
      } else if (code !== "auth/popup-closed-by-user") {
        setLoginError(
          "Sign-in failed. If you opened this link from WhatsApp or Instagram, open it in Chrome (Android) or Safari (iPhone) instead.",
        );
      }
    }
  };

  const setStatus = async (id: string, status: Status) => {
    await updateDoc(doc(db, "enquiries", id), { status });
  };

  // Payment is confirmed ONLY here, by an authenticated admin, after checking
  // the UPI statement. Clients can never set this field (enforced by rules).
  const togglePayment = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "enquiries", id), {
      paymentStatus: current ? "pending" : "completed",
    });
  };

  const replyByEmail = (enq: Enquiry) => {
    const subject = encodeURIComponent("Kadathanad KPCGM Kalari Sangham — your enquiry");
    const body = encodeURIComponent(
      `Namaskaram ${enq.name},\n\nThank you for your interest in ${enq.program} at Kadathanad KPCGM Kalari Sangham.\n\n`,
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(enq.email)}&su=${subject}&body=${body}`;

    let opened = false;
    const markOpened = () => {
      opened = true;
    };
    window.addEventListener("blur", markOpened);
    document.addEventListener("visibilitychange", markOpened);

    window.location.href = `mailto:${enq.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      window.removeEventListener("blur", markOpened);
      document.removeEventListener("visibilitychange", markOpened);
      if (!opened && document.visibilityState === "visible") {
        window.open(gmailUrl, "_blank", "noopener");
      }
    }, 1200);
  };

  if (authLoading) {
    return (
      <main style={centerStyle}>
        <p style={{ color: "var(--c-smoke)", letterSpacing: "0.2em" }}>LOADING…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={centerStyle}>
        <div style={{ textAlign: "center", maxWidth: "26rem", padding: "1rem" }}>
          <img
            src="/images/robot.png"
            alt="Kalari Admin"
            style={{ width: "5rem", height: "5rem", margin: "0 auto 2rem", display: "block" }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 300,
              color: "var(--c-ivory)",
              marginBottom: "0.5rem",
            }}
          >
            Kalari Admin
          </h1>
          <p
            style={{
              color: "var(--c-smoke)",
              fontSize: "0.85rem",
              marginBottom: "2.5rem",
              letterSpacing: "0.15em",
            }}
          >
            KADATHANAD KPCGM KALARI SANGHAM
          </p>
          {inAppBrowser && (
            <p
              role="alert"
              style={{
                color: "#e8b04b",
                fontSize: "0.8rem",
                lineHeight: 1.6,
                background: "rgba(232,176,75,0.08)",
                border: "1px solid rgba(232,176,75,0.3)",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              You are using an in-app browser (WhatsApp/Instagram/Facebook). Google sign-in may fail here —
              tap ⋮ or ⋯ and choose “Open in Chrome / Safari”.
            </p>
          )}
          <button
            onClick={login}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "0 auto",
              padding: "0.9rem 1.75rem",
              background: "var(--c-gold)",
              border: "none",
              borderRadius: "4px",
              color: "var(--c-void)",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <GIcon /> Sign in with Google
          </button>
          {loginError && (
            <p
              role="alert"
              style={{ color: "#ff9d9d", fontSize: "0.8rem", lineHeight: 1.6, marginTop: "1.5rem" }}
            >
              {loginError}
            </p>
          )}
          {denied && (
            <p role="alert" style={{ color: "#ff9d9d", fontSize: "0.8rem", marginTop: "1.5rem" }}>
              This account does not have admin access.
            </p>
          )}
          {!denied && ADMIN_EMAILS.length === 0 && (
            <p style={{ color: "var(--c-smoke)", fontSize: "0.75rem", marginTop: "1.5rem" }}>
              No admin emails configured yet.
            </p>
          )}
        </div>
      </main>
    );
  }

  const allowed = ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "");
  if (!allowed) {
    return (
      <main
        style={{
          ...centerStyle,
          flexDirection: "column",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#ff9d9d" }}>Access denied. This account is not an admin.</p>
        <p style={{ color: "var(--c-smoke)", fontSize: "0.75rem" }}>Signed in as {user.email}</p>
        <button onClick={() => signOut(auth)} style={outlineBtn}>
          Sign out
        </button>
      </main>
    );
  }

  const filtered = (enquiries ?? []).filter((e) => statusFilter === "all" || e.status === statusFilter);
  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, (enquiries ?? []).filter((e) => e.status === s).length]),
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--c-void)", padding: "clamp(1rem, 3vw, 3rem)" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          borderBottom: "1px solid rgba(199,154,98,0.25)",
          paddingBottom: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <img src="/images/robot.png" alt="" style={{ width: "2.6rem", height: "2.6rem" }} />
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 300,
                color: "var(--c-ivory)",
              }}
            >
              Kalari Admin
            </h1>
            <p style={{ fontSize: "0.7rem", color: "var(--c-smoke)", letterSpacing: "0.12em" }}>
              {user.email}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginRight: "0.75rem" }}>
            {(["enquiries", "programs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "0.55rem 1.1rem",
                  background: tab === t ? "rgba(199,154,98,0.2)" : "transparent",
                  border: `1px solid ${tab === t ? "var(--c-gold)" : "rgba(255,255,255,0.15)"}`,
                  color: tab === t ? "var(--c-gold)" : "var(--c-smoke)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {installEvent ? (
            <button onClick={() => installEvent.prompt()} style={goldBtn}>
              ⬇ INSTALL APP
            </button>
          ) : (
            <span
              title="On iPhone/iPad: tap the Share button in Safari, then choose Add to Home Screen"
              style={{
                color: "var(--c-smoke)",
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                maxWidth: "13rem",
                textAlign: "right",
              }}
            >
              iPhone: Share → Add to Home Screen
            </span>
          )}
          <button onClick={() => signOut(auth)} style={outlineBtn}>
            SIGN OUT
          </button>
        </div>
      </header>

      {tab === "programs" ? (
        <ProgramsManager />
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <StatCard label="TOTAL" value={enquiries?.length ?? 0} />
            {STATUSES.map((s) => (
              <StatCard key={s} label={s.toUpperCase()} value={counts[s] ?? 0} color={STATUS_COLORS[s]} />
            ))}
          </div>

          {/* Filter */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: "0.45rem 1rem",
                  background: statusFilter === s ? "rgba(199,154,98,0.2)" : "transparent",
                  border: `1px solid ${statusFilter === s ? "var(--c-gold)" : "rgba(255,255,255,0.15)"}`,
                  color: statusFilter === s ? "var(--c-gold)" : "var(--c-smoke)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* List */}
          {enquiries === null ? (
            <p style={{ color: "var(--c-smoke)" }}>Loading enquiries…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--c-smoke)" }}>
              No enquiries{statusFilter !== "all" ? ` with status "${statusFilter}"` : ""} yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filtered.map((enq) => (
                <div
                  key={enq.id}
                  style={{
                    border: "1px solid rgba(199,154,98,0.2)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "1rem 1.25rem",
                  }}
                >
                  <div
                    onClick={() => setExpanded(expanded === enq.id ? null : enq.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.05rem",
                          color: "var(--c-ivory)",
                          fontWeight: 300,
                        }}
                      >
                        {enq.name}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--c-smoke)", marginTop: "0.2rem" }}>
                        {enq.program}
                        {enq.amount ? ` · ₹${enq.amount.toLocaleString("en-IN")}` : ""}
                        {enq.createdAt?.toDate
                          ? ` · ${enq.createdAt.toDate().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`
                          : ""}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => togglePayment(enq.id, enq.paymentStatus === "completed")}
                        title="Toggle after verifying the UPI statement"
                        style={{
                          background: "none",
                          border: `1px solid ${enq.paymentStatus === "completed" ? "#7dd487" : "#8a8578"}`,
                          color: enq.paymentStatus === "completed" ? "#7dd487" : "#8a8578",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.4rem 0.6rem",
                          cursor: "pointer",
                        }}
                      >
                        {enq.paymentStatus === "completed" ? "PAID ✓" : "UNPAID"}
                      </button>
                      <select
                        value={enq.status}
                        onChange={(e) => setStatus(enq.id, e.target.value as Status)}
                        style={{
                          background: "rgba(0,0,0,0.4)",
                          border: `1px solid ${STATUS_COLORS[enq.status]}`,
                          color: STATUS_COLORS[enq.status],
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.4rem 0.6rem",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                            style={{ background: "#1a1815", color: STATUS_COLORS[s] }}
                          >
                            {s.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {expanded === enq.id && (
                    <div
                      style={{
                        borderTop: "1px solid rgba(199,154,98,0.15)",
                        marginTop: "1rem",
                        paddingTop: "1rem",
                        display: "grid",
                        gap: "0.6rem",
                      }}
                    >
                      <Detail label="EMAIL" value={enq.email} />
                      <Detail label="PHONE" value={enq.phone || "—"} />
                      <Detail label="START DATE" value={enq.startDate || "To be confirmed"} />
                      <Detail label="MESSAGE" value={enq.message || "—"} />
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          marginTop: "0.5rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <button onClick={() => replyByEmail(enq)} style={goldBtnSmall}>
                          REPLY BY EMAIL
                        </button>
                        {enq.phone && (
                          <button
                            onClick={() => window.open(`tel:${enq.phone}`, "_self")}
                            style={outlineBtnSmall}
                          >
                            CALL
                          </button>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(enq.email).catch(() => {});
                            setCopiedId(enq.id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                          style={outlineBtnSmall}
                        >
                          {copiedId === enq.id ? "COPIED ✓" : "COPY EMAIL"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

const centerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--c-void)",
};

interface ProgramRow {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  schedule: string;
  price: number;
  image: string;
  order: number;
  active: boolean;
}

const EMPTY_PROGRAM: Omit<ProgramRow, "id"> = {
  name: "",
  tagline: "",
  duration: "",
  schedule: "",
  price: 0,
  image: "/images/Maithari.png",
  order: 99,
  active: true,
};

function ProgramsManager() {
  const [programs, setPrograms] = useState<ProgramRow[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<ProgramRow>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "programs"), orderBy("order"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPrograms(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProgramRow, "id">) })));
      },
      (err) => {
        console.error(err);
        setPrograms([]);
      },
    );
    return unsub;
  }, []);

  const draftOf = (p: ProgramRow): ProgramRow => ({ ...p, ...(drafts[p.id] ?? {}) });

  const save = async (p: ProgramRow) => {
    const merged = draftOf(p);
    setSavingId(p.id);
    try {
      await setDoc(doc(db, "programs", p.id), {
        name: merged.name,
        tagline: merged.tagline,
        duration: merged.duration,
        schedule: merged.schedule,
        price: Number(merged.price) || 0,
        image: merged.image,
        order: Number(merged.order) || 99,
        active: merged.active,
      });
      setDrafts((d) => {
        const next = { ...d };
        delete next[p.id];
        return next;
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSavingId(null);
    }
  };

  const addProgram = async () => {
    setAdding(true);
    try {
      const ref = await addDoc(collection(db, "programs"), { ...EMPTY_PROGRAM, name: "New Program" });
      setDrafts((d) => ({ ...d, [ref.id]: {} }));
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this program permanently?")) return;
    await deleteDoc(doc(db, "programs", id));
  };

  if (programs === null) {
    return <p style={{ color: "var(--c-smoke)" }}>Loading programs…</p>;
  }

  if (programs.length === 0) {
    return (
      <div>
        <p style={{ color: "var(--c-smoke)", marginBottom: "1rem" }}>
          No programs in the database yet. The site currently shows built-in defaults.
        </p>
        <button onClick={addProgram} disabled={adding} style={goldBtn}>
          + ADD FIRST PROGRAM
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={addProgram} disabled={adding} style={goldBtn}>
          + ADD PROGRAM
        </button>
      </div>

      {programs.map((p) => {
        const d = draftOf(p);
        const dirty = !!drafts[p.id] && Object.keys(drafts[p.id]).length > 0;
        return (
          <div
            key={p.id}
            style={{
              border: `1px solid ${d.active ? "rgba(199,154,98,0.25)" : "rgba(255,255,255,0.1)"}`,
              background: "rgba(255,255,255,0.03)",
              padding: "1.25rem",
              opacity: d.active ? 1 : 0.55,
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              <img
                src={d.image}
                alt=""
                style={{
                  width: "5.5rem",
                  height: "3.7rem",
                  objectFit: "cover",
                  border: "1px solid rgba(199,154,98,0.3)",
                }}
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")}
              />

              <div style={{ flex: 1, minWidth: "16rem", display: "grid", gap: "0.6rem" }}>
                <Field label="NAME">
                  <input
                    style={inputStyle}
                    value={d.name}
                    onChange={(e) =>
                      setDrafts((x) => ({ ...x, [p.id]: { ...drafts[p.id], name: e.target.value } }))
                    }
                  />
                </Field>
                <Field label="TAGLINE">
                  <input
                    style={inputStyle}
                    value={d.tagline}
                    onChange={(e) =>
                      setDrafts((x) => ({ ...x, [p.id]: { ...drafts[p.id], tagline: e.target.value } }))
                    }
                  />
                </Field>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
                    gap: "0.6rem",
                  }}
                >
                  <Field label="DURATION">
                    <input
                      style={inputStyle}
                      value={d.duration}
                      onChange={(e) =>
                        setDrafts((x) => ({ ...x, [p.id]: { ...drafts[p.id], duration: e.target.value } }))
                      }
                    />
                  </Field>
                  <Field label="SCHEDULE">
                    <input
                      style={inputStyle}
                      value={d.schedule}
                      onChange={(e) =>
                        setDrafts((x) => ({ ...x, [p.id]: { ...drafts[p.id], schedule: e.target.value } }))
                      }
                    />
                  </Field>
                  <Field label="PRICE (₹)">
                    <input
                      type="number"
                      style={inputStyle}
                      value={d.price}
                      onChange={(e) =>
                        setDrafts((x) => ({
                          ...x,
                          [p.id]: { ...drafts[p.id], price: Number(e.target.value) },
                        }))
                      }
                    />
                  </Field>
                  <Field label="ORDER">
                    <input
                      type="number"
                      style={inputStyle}
                      value={d.order}
                      onChange={(e) =>
                        setDrafts((x) => ({
                          ...x,
                          [p.id]: { ...drafts[p.id], order: Number(e.target.value) },
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="IMAGE PATH">
                  <input
                    style={inputStyle}
                    value={d.image}
                    onChange={(e) =>
                      setDrafts((x) => ({ ...x, [p.id]: { ...drafts[p.id], image: e.target.value } }))
                    }
                  />
                </Field>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", minWidth: "8rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    color: "var(--c-smoke)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={d.active}
                    onChange={(e) =>
                      setDrafts((x) => ({ ...x, [p.id]: { ...drafts[p.id], active: e.target.checked } }))
                    }
                  />
                  VISIBLE ON SITE
                </label>
                <button
                  onClick={() => save(p)}
                  disabled={!dirty || savingId === p.id}
                  style={{ ...goldBtn, opacity: dirty ? 1 : 0.4 }}
                >
                  {savingId === p.id ? "SAVING…" : "SAVE"}
                </button>
                <button onClick={() => remove(p.id)} style={outlineBtn}>
                  DELETE
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: "0.62rem",
          letterSpacing: "0.14em",
          color: "var(--c-smoke)",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.7rem",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "var(--c-ivory)",
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  outline: "none",
};

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(199,154,98,0.2)",
        padding: "0.9rem 1.4rem",
        minWidth: "6.5rem",
      }}
    >
      <p
        style={{
          fontSize: "1.5rem",
          fontFamily: "var(--font-display)",
          color: color ?? "var(--c-ivory)",
          fontWeight: 300,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: "0.62rem", letterSpacing: "0.15em", color: "var(--c-smoke)" }}>{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <span
        style={{
          minWidth: "6.5rem",
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          color: "var(--c-smoke)",
          paddingTop: "0.15rem",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: "0.88rem", color: "var(--c-ivory)", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function GIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const goldBtn: React.CSSProperties = {
  background: "var(--c-gold)",
  border: "none",
  color: "var(--c-void)",
  fontFamily: "var(--font-body)",
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  padding: "0.6rem 1.1rem",
  cursor: "pointer",
};

const outlineBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "var(--c-ash)",
  fontFamily: "var(--font-body)",
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  padding: "0.6rem 1.1rem",
  cursor: "pointer",
};

const goldBtnSmall: React.CSSProperties = {
  ...goldBtn,
  textDecoration: "none",
  display: "inline-block",
};

const outlineBtnSmall: React.CSSProperties = {
  ...outlineBtn,
  textDecoration: "none",
  display: "inline-block",
};
