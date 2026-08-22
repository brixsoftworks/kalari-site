# Kalari Site — Kadathanad KPCGM Kalari Sangham

Marketing and enrollment website for a traditional Kalaripayattu school in
Vadakara, Kerala (https://kpcgmkalari.org). Cinematic single-page site with an
end-to-end enrollment pipeline, AI assistant chatbot, and an admin PWA for
managing enquiries.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4
- **GSAP + Framer Motion + Lenis** scroll animation
- **Firebase 12**: Auth (Google + anonymous), Firestore
- **Gemini API** (`gemini-3-flash-preview`) server-side chatbot with keyword fallbacks
- **Nodemailer (Gmail)** enquiry email notifications
- Deployed as a **hybrid**: static export → Firebase Hosting (`out/`) +
  API routes → Vercel (`kalari-api.vercel.app`)

## Architecture: the two deploy halves

| Half        | Where                                                             | What runs there                                         |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| Static site | Firebase Hosting (`firebase.json`, `out/` via `output: "export"`) | All UI pages; Firestore access directly from the client |
| API routes  | Vercel (`vercel.json`)                                            | `/api/chat` (Gemini proxy), `/api/notify` (email)       |

`NEXT_PUBLIC_CHAT_API` tells the browser where the Vercel half lives. Keep
both halves deployed or features will silently degrade to fallbacks.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

### Environment variables

See `.env.example`. Server-only secrets (`GEMINI_API_KEY`, `GMAIL_USER`,
`GMAIL_APP_PASSWORD`) must also be set in the Vercel project — they are not
needed for local static development.

## Enrollment & payment flow (security model)

1. Public visitor submits the form → `lib/enquiry.ts` validates it
   (`lib/enquiry-schema.ts`, mirrored by tests) → Firestore create.
2. Firestore rules force every public create to have
   `paymentStatus == "pending"` and `status == "new"` — **a client can never
   claim a payment was made.**
3. UPI deep-link payment is honor-system: the school verifies its UPI
   statement out-of-band.
4. An authenticated admin (email allowlist in `firestore.rules`) marks the
   enquiry PAID from the admin PWA (`/admin`). Admins are the only writers of
   `paymentStatus`; rules reject any non-admin update.

> True server-side UPI verification requires a payment gateway (e.g.
> Razorpay webhooks); that is the recommended next upgrade.

## Testing

```bash
npx vitest run                       # unit tests (validation logic)
npm run test:rules                   # Firestore security-rules tests (needs Java)
```

`test:rules` boots the Firestore emulator and verifies: pending-only creates,
rejected self-declared payments, admin-only updates/reads.

## Deploy

- Static: `npm run build && firebase deploy --only hosting`
  (uses `.export-static` trick — see `next.config.ts`)
- APIs: push/merge → Vercel (or `vercel deploy` for preview)

## Known limitations

- No CI yet; rate limiting is in-memory per serverless instance (per-instance,
  approximate under load; trusts spoofable `x-forwarded-for`).
- Payment verification is manual/admin-gated, not gateway-webhook verified.
- Hardcoded admin allowlist exists in three places (rules, admin page,
  notify recipient) — keep them in sync.
