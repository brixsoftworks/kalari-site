import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web config values are public identifiers by design; they are read
// from NEXT_PUBLIC_ env vars when available so environments can be swapped
// without code changes. The literals below are the production fallback.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBjZqRjRJlPlKxMpU9N2FU2VprJHs-5yTY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "kalari-warrior-site.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "kalari-warrior-site",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "kalari-warrior-site.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "987868067578",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:987868067578:web:4d4c8611941896a5c6fb43",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
