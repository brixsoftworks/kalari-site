import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { validateEnquiry } from "./enquiry-schema";

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  age: number;
  program: string;
  amount?: number;
  startDate?: string;
  message?: string;
}

export async function submitEnquiry(data: EnquiryData): Promise<string> {
  const errors = validateEnquiry(data);
  if (errors.length > 0) {
    throw new Error(`Invalid enquiry: ${errors.join("; ")}`);
  }

  try {
    await signInAnonymously(auth);
  } catch {
    // anonymous provider unavailable — proceed unauthenticated (rules allow validated creates)
  }

  const docRef = await addDoc(collection(db, "enquiries"), {
    ...data,
    startDate: data.startDate || "",
    message: data.message || "",
    amount: data.amount || 0,
    status: "new",
    // paymentStatus can NEVER be claimed by the client — Firestore rules
    // reject any create that is not "pending". Only an authenticated admin
    // (verified out-of-band against the UPI statement) may mark it paid.
    paymentStatus: "pending",
    createdAt: serverTimestamp(),
  });

  sendEmailNotification(data);

  return docRef.id;
}
function sendEmailNotification(data: EnquiryData) {
  fetch(`${process.env.NEXT_PUBLIC_CHAT_API ?? ""}/api/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((err) => console.error("Email notification failed:", err));
}
