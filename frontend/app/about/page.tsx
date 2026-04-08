"use client";

import React from "react";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { Globe, User, Mail } from "lucide-react";

export default function AboutPage() {
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "DASHBOARD", href: "/#dashboard-content" },
  ];

  const socialLinks = [
    { icon: Globe, href: "https://anshuman-maharana.vercel.app/" },
    { icon: User, href: "https://www.linkedin.com/in/anshuman-maharana-64671a314/" },
    { icon: Mail, href: "mailto:maharanaanshuman01@gmail.com" },
  ];

  return (
    <div className="bg-background min-h-screen">
      <MinimalistHero
        logoText="ChartLens"
        navLinks={navLinks}
        mainText="I am a passionate data analyst and developer. I built ChartLens to provide deep, interactive insights into the music industry using modern web technologies."
        readMoreLink="/"
        imageSrc="/profile.png"
        imageAlt="My Photo"
        overlayText={{
          part1: "the",
          part2: "ANALYST.",
        }}
        socialLinks={socialLinks}
        locationText="Anshuman Maharana"
      />
    </div>
  );
}
