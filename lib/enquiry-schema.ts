export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  age: number;
  program: string;
  amount?: number;
  startDate?: string;
  message?: string;
}

const EMAIL_RE = /^[^@]+@[^@]+\.[^@]+$/;
const PHONE_RE = /^[0-9+\-\s]{7,15}$/;

export function validateEnquiry(data: EnquiryInput): string[] {
  const errors: string[] = [];

  if (typeof data.name !== "string" || data.name.trim().length === 0) errors.push("name is required");
  else if (data.name.length >= 200) errors.push("name too long");

  if (typeof data.email !== "string" || !EMAIL_RE.test(data.email)) errors.push("email is invalid");

  if (typeof data.phone !== "string" || !PHONE_RE.test(data.phone)) errors.push("phone is invalid");

  if (typeof data.age !== "number" || !Number.isFinite(data.age)) errors.push("age must be a number");
  else if (data.age < 3 || data.age > 100) errors.push("age must be between 3 and 100");

  if (typeof data.program !== "string" || data.program.trim().length === 0)
    errors.push("program is required");
  else if (data.program.length >= 200) errors.push("program too long");

  if (
    data.amount !== undefined &&
    (!Number.isFinite(data.amount) || data.amount < 0 || data.amount > 1_000_000)
  )
    errors.push("amount is invalid");

  return errors;
}
