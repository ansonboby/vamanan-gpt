import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Vamanan GPT — Meet the storyteller of Onam",
  description:
    "An interactive AI experience that brings Vamanan to life through Onam storytelling, Kerala culture, conversation, and playful exploration.",
  openGraph: {
    title: "Vamanan GPT",
    description:
      "Meet Vamanan — a cultural AI storyteller inspired by the Onam tradition of Kerala.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vamanan GPT",
    description:
      "Meet Vamanan — a cultural AI storyteller inspired by the Onam tradition of Kerala.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
