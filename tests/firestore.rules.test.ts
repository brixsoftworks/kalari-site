/**
 * Firestore security-rules tests for the `enquiries` collection.
 *
 * These run against the Firestore emulator. Start it first:
 *   firebase emulators:start --only firestore
 * then run:
 *   FIRESTORE_EMULATOR_HOST="127.0.0.1:8080" npx vitest run tests/firestore.rules.test.ts
 *
 * The suite self-skips when the emulator is not running, so plain
 * `npx vitest run` still passes in CI without Java/emulator.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

const emulatorUp = !!process.env.FIRESTORE_EMULATOR_HOST;

const projectId = `rules-test-${Date.now()}`;

const validEnquiry = {
  name: "Arjun",
  email: "arjun@example.com",
  phone: "+91 9876543210",
  age: 12,
  program: "BEGINNER — First Steps",
  amount: 5000,
  status: "new",
  paymentStatus: "pending",
  startDate: "",
  message: "",
  createdAt: new Date(),
};

let testEnv: Awaited<ReturnType<typeof initializeTestEnvironment>>;

beforeAll(async () => {
  if (!emulatorUp) return;
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(join(__dirname, "..", "firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: Number(process.env.FIRESTORE_EMULATOR_HOST!.split(":")[1] ?? 8080),
    },
  });
});

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
});

describe.skipIf(!emulatorUp)("enquiries security rules", () => {
  const db = (email?: string) =>
    testEnv.authenticatedContext(email ?? "someone@example.com", email ? { email } : {}).firestore();

  const adminDb = () => db("mullainathan95@gmail.com");

  it("allows a valid public enquiry with paymentStatus=pending", async () => {
    // Rules do not constrain createdAt on create; the real client sends
    // serverTimestamp(). Any valid payload must be accepted.
    await assertSucceeds(
      db()
        .collection("enquiries")
        .add({ ...validEnquiry }),
    );
  });

  it("REJECTS a public enquiry claiming paymentStatus=completed", async () => {
    await assertFails(
      db()
        .collection("enquiries")
        .add({ ...validEnquiry, paymentStatus: "completed" }),
    );
  });

  it("REJECTS a public enquiry with status != new", async () => {
    await assertFails(
      db()
        .collection("enquiries")
        .add({ ...validEnquiry, status: "contacted" }),
    );
  });

  it("REJECTS invalid field values (bad email/phone/age)", async () => {
    await assertFails(
      db()
        .collection("enquiries")
        .add({ ...validEnquiry, email: "nope" }),
    );
    await assertFails(
      db()
        .collection("enquiries")
        .add({ ...validEnquiry, phone: "12" }),
    );
    await assertFails(
      db()
        .collection("enquiries")
        .add({ ...validEnquiry, age: 200 }),
    );
  });

  it("REJECTS anonymous/unauthenticated reads of enquiries", async () => {
    await assertFails(testEnv.unauthenticatedContext().firestore().collection("enquiries").get());
  });

  it("REJECTS non-admin writes to an existing enquiry", async () => {
    const id = "enq-1";
    await adminDb().collection("enquiries").doc(id).set(validEnquiry);
    await assertFails(
      db("random@gmail.com").collection("enquiries").doc(id).update({ paymentStatus: "completed" }),
    );
  });

  it("ALLOWS an admin to mark an enquiry paid", async () => {
    const id = "enq-2";
    await adminDb().collection("enquiries").doc(id).set(validEnquiry);
    await assertSucceeds(adminDb().collection("enquiries").doc(id).update({ paymentStatus: "completed" }));
  });

  it("ALLOWS admins to read all enquiries", async () => {
    await assertSucceeds(adminDb().collection("enquiries").get());
  });
});
