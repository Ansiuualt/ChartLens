"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Crown,
  Globe,
  Users,
  ShieldAlert,
  Disc3,
  Music,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/artist-dominance", label: "Artist Dominance", icon: Crown },
  { href: "/domestic-vs-intl", label: "Domestic vs Intl", icon: Globe },
  { href: "/collabs-vs-solo", label: "Collabs vs Solo", icon: Users },
  { href: "/explicit-analysis", label: "Explicit Analysis", icon: ShieldAlert },
  { href: "/album-structure", label: "Album Structure", icon: Disc3 },
];

export function TopNavbar({ 
  onToggleFilter, 
  isFilterOpen 
}: { 
  onToggleFilter: () => void; 
  isFilterOpen: boolean;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] border-b border-[#1DB954]/15 backdrop-blur-xl">
      <div className="h-full flex items-center px-4 md:px-6 gap-4 md:gap-8">
        
        {/* Mobile: Brand + Toggle */}
        <div className="flex lg:hidden items-center gap-2 flex-1">
           <Music className="w-5 h-5 text-[#1DB954]" />
           <span className="font-bold text-white text-sm tracking-tight">ChartLens</span>
        </div>

        {/* Desktop: Nav links */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-[#1DB954]/15 text-[#1DB954] shadow-[inset_0_0_20px_rgba(29,185,84,0.05)]"
                    : "text-[#B3B3B3] hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    isActive ? "text-[#1DB954]" : "text-[#B3B3B3]"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: toggle filter button + mobile menu toggle */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="hidden lg:flex items-center">
            <span className="text-[0.65rem] text-[#666] bg-white/5 rounded-full px-3 py-1">
              Next.js · Plotly · FastAPI
            </span>
          </div>

          <button
            onClick={onToggleFilter}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 border",
              isFilterOpen 
                ? "bg-[#1DB954]/15 border-[#1DB954]/30 text-[#1DB954]"
                : "bg-white/5 border-transparent text-[#B3B3B3] hover:text-white hover:bg-white/10"
            )}
          >
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden text-[10px] uppercase font-bold tracking-tight">Filters</span>
            <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", isFilterOpen ? "bg-[#1DB954] shadow-[0_0_8px_#1DB954]" : "bg-[#B3B3B3]")} />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-[#B3B3B3] hover:text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden w-full bg-[#16213e] border-b border-[#1DB954]/10 overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all",
                      isActive
                        ? "bg-[#1DB954]/20 text-[#1DB954]"
                        : "text-[#B3B3B3] hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
