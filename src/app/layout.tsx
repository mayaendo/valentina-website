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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Valentina Caillaux — Recording Engineer, Producer, Songwriter",
  description:
    "Valentina Caillaux — recording engineer, producer, and songwriter based in Barcelona.",
  icons: {
    icon: [
      { url: "/icono-web-val.png", type: "image/png", sizes: "any" },
    ],
    shortcut: "/icono-web-val.png",
    apple: [{ url: "/icono-web-val.png", type: "image/png", sizes: "180x180" }],
  },
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
