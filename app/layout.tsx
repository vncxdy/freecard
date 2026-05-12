import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeCard - Retro Cover Generator",
  description: "Make physical media covers for free. Alarmingly free."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
