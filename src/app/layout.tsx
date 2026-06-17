import type { Metadata } from "next";
import { Big_Shoulders } from "next/font/google";
import "./globals.css";

const displayFont = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "BRUNT CrewGuide AI",
  description: "A grounded product guidance copilot demo for BRUNT store reps.",
  icons: {
    icon: "/brand/brunt-favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body>{children}</body>
    </html>
  );
}
