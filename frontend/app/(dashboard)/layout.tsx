"use client";

import React, { useState } from "react";
import { FilterProvider } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { TopNavbar } from "@/components/nav-sidebar";
import { SidebarFilters } from "@/components/sidebar-filters";
import { MinimalistHero } from "@/components/ui/minimalist-hero";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navLinks = [
    { label: "DASHBOARD", href: "#dashboard-content" },
    { label: "ABOUT ME", href: "/about" },
  ];

  // Smooth scroll handler inside the Minimalist Hero links is natively supported by <a> tags with hashes.
  // We'll add smooth scrolling to the HTML element in global.css.

  return (
    <FilterProvider>
      <MinimalistHero
        logoText="ChartLens"
        navLinks={navLinks}
        mainText="Visual analytics for the UK Spotify Top 50. Dive deep into artist dominance, collaborations, and domestic vs international trends."
        readMoreLink="#dashboard-content"
        imageSrc="https://img1.picmix.com/output/stamp/normal/4/4/6/7/2647644_2e11b.png"
        imageAlt="Spotify Stats"
        overlayText={{
          part1: "UK",
          part2: "Top Charts.",
        }}
        socialLinks={[]}
        locationText="Data continuously updated"
      />

      <div id="dashboard-content" className="relative flex flex-col min-h-screen bg-background">
        <TopNavbar onToggleFilter={() => setIsFilterOpen(!isFilterOpen)} isFilterOpen={isFilterOpen} />
        
        <div className="flex flex-1 items-start w-full overflow-hidden">
          <main className="flex-1 min-w-0 p-6">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>

          <SidebarFilters isOpen={isFilterOpen} />
        </div>
      </div>
    </FilterProvider>
  );
}
