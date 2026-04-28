import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChartLens — US Spotify Top 50 Analytics",
  description:
    "Interactive analytics dashboard analyzing the US Spotify Top 50 playlist. Explore timeline trends, ranking trajectories, artist dominance, popularity patterns, and explicit content analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
