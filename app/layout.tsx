import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "P96 Culture House — WC2026",
  description: "Your game. Your people. Your summer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
