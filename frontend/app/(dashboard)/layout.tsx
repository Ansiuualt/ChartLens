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

  return (
    <FilterProvider>
      <MinimalistHero
        logoText="ChartLens"
        navLinks={navLinks}
        mainText="Visual analytics for the US Spotify Top 50 Playlist. Dive deep into song performance, ranking trends, artist dominance, and popularity patterns."
        readMoreLink="#dashboard-content"
        imageSrc="/hero.png"
        imageAlt="Upset Drake"
        overlayText={{
          part1: "US",
          part2: "Top Charts.",
        }}
        socialLinks={[]}
        locationText="Data continuously updated"
      />

      <div id="dashboard-content" className="relative flex flex-col min-h-screen bg-background">
        <TopNavbar onToggleFilter={() => setIsFilterOpen(!isFilterOpen)} isFilterOpen={isFilterOpen} />
        
        <div className="flex flex-1 items-start w-full relative">
          <main className={cn(
            "flex-1 min-w-0 p-4 md:p-6 transition-all duration-300",
            isFilterOpen ? "lg:mr-0" : ""
          )}>
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>

          <SidebarFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        </div>
      </div>
    </FilterProvider>
  );
}
