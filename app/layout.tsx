import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CricketPulse AI | The Infinite Cricket Companion",
  description: "Real-time AI-powered cricket insights, momentum analysis, and fan engagement for the modern cricket fan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
