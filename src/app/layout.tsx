import type { Metadata } from "next";
import { Barlow_Condensed, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const fontDisplay = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const fontBody = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Valentina Caillaux — Recording Engineer, Producer, Songwriter",
  description:
    "Valentina Caillaux — recording engineer, producer, and songwriter based in Barcelona.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
