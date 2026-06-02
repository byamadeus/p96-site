import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/Layout/PageTransition";

export const metadata: Metadata = {
  title: "Project 96 — Diaspora World Cup Activation Series",
  description: "Watch parties, play days, and community programming for the 2026 FIFA World Cup. New York City, June–July 2026.",
  openGraph: {
    title: "Project 96 — Diaspora World Cup Activation Series",
    description: "Watch parties, play days, and community programming for the 2026 FIFA World Cup. New York City, June–July 2026.",
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Project 96 — Diaspora World Cup Activation Series",
    description: "Watch parties, play days, and community programming for the 2026 FIFA World Cup. New York City, June–July 2026.",
    images: ['/og.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body><PageTransition>{children}</PageTransition></body>
    </html>
  );
}
