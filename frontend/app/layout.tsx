import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChartLens — UK Spotify Top 50 Analytics",
  description:
    "Interactive analytics dashboard analyzing the UK Spotify Top 50 daily charts. Explore artist dominance, domestic vs international breakdown, collaboration influence, explicit content impact, and album structure patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
