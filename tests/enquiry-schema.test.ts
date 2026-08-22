import { describe, it, expect } from "vitest";
import { validateEnquiry, type EnquiryInput } from "../lib/enquiry-schema";

const valid = {
  name: "Arjun",
  email: "arjun@example.com",
  phone: "+91 9876543210",
  age: 12,
  program: "BEGINNER — First Steps",
  amount: 5000,
};

describe("validateEnquiry", () => {
  it("accepts a fully valid enquiry", () => {
    expect(validateEnquiry(valid)).toEqual([]);
  });

  it("rejects missing name", () => {
    expect(validateEnquiry({ ...valid, name: "" })).toContain("name is required");
  });

  it("rejects over-long name (rules cap <200)", () => {
    expect(validateEnquiry({ ...valid, name: "a".repeat(200) })).toContain("name too long");
  });

  it.each(["not-an-email", "missing-at.com", "@nope.com", ""])("rejects bad email %s", (email) => {
    expect(validateEnquiry({ ...valid, email }).some((e) => e.includes("email"))).toBe(true);
  });

  it.each(["12345", "abc123456", "+91-98765-43210x"])("rejects bad phone %s", (phone) => {
    expect(validateEnquiry({ ...valid, phone }).some((e) => e.includes("phone"))).toBe(true);
  });

  it("rejects age outside 3..100", () => {
    expect(validateEnquiry({ ...valid, age: 2 }).some((e) => e.includes("age"))).toBe(true);
    expect(validateEnquiry({ ...valid, age: 101 }).some((e) => e.includes("age"))).toBe(true);
  });

  it("rejects non-numeric age", () => {
    expect(validateEnquiry({ ...valid, age: NaN }).some((e) => e.includes("age"))).toBe(true);
  });

  it("rejects empty program", () => {
    expect(validateEnquiry({ ...valid, program: "" })).toContain("program is required");
  });

  it("rejects negative or absurd amounts", () => {
    expect(validateEnquiry({ ...valid, amount: -1 }).some((e) => e.includes("amount"))).toBe(true);
    expect(validateEnquiry({ ...valid, amount: 2_000_000 }).some((e) => e.includes("amount"))).toBe(true);
  });

  it("allows amount to be omitted", () => {
    const withoutAmount: EnquiryInput = { ...valid };
    delete (withoutAmount as Partial<EnquiryInput>).amount;
    expect(validateEnquiry(withoutAmount)).toEqual([]);
  });
});
