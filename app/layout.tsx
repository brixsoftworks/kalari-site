import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KALARI — The Art of the Warrior | Kalaripayattu Kerala",
  description:
    "Enter the ancient world of Kalaripayattu — Kerala's living martial tradition. A discipline of body, breath, and warrior spirit passed through generations.",
  keywords: [
    "Kalaripayattu",
    "Kerala martial arts",
    "Indian martial arts",
    "Kalari training",
    "ancient warrior tradition",
    "Kerala culture",
  ],
  openGraph: {
    title: "KALARI — The Art of the Warrior",
    description: "Enter the ancient world of Kalaripayattu. A discipline of body, breath, and warrior spirit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
