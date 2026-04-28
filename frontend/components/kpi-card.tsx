"use client";

import { cn } from "@/lib/utils";

interface KpiCardProps {
  value: string;
  label: string;
  accent?: string;
  className?: string;
}

const ACCENT_MAP: Record<string, { color: string; glow: string; bg: string }> = {
  default: { color: "#1DB954", glow: "rgba(29,185,84,0.15)", bg: "from-[#282828] to-[#1a2e1a]" },
  cyan: { color: "#06B6D4", glow: "rgba(6,182,212,0.15)", bg: "from-[#282828] to-[#1a2a2e]" },
  purple: { color: "#8B5CF6", glow: "rgba(139,92,246,0.15)", bg: "from-[#282828] to-[#231a2e]" },
  gold: { color: "#F59E0B", glow: "rgba(245,158,11,0.15)", bg: "from-[#282828] to-[#2e2a1a]" },
  coral: { color: "#FF6B6B", glow: "rgba(255,107,107,0.15)", bg: "from-[#282828] to-[#2e1a1a]" },
  pink: { color: "#EC4899", glow: "rgba(236,72,153,0.15)", bg: "from-[#282828] to-[#2e1a23]" },
};

export function KpiCard({ value, label, accent = "default", className }: KpiCardProps) {
  const a = ACCENT_MAP[accent] || ACCENT_MAP.default;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-center",
        `bg-gradient-to-br ${a.bg}`,
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "min-h-[140px] flex flex-col justify-center",
        className
      )}
      style={{
        boxShadow: `0 0 0 0 transparent`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${a.glow}`;
        (e.currentTarget as HTMLElement).style.borderColor = `${a.color}50`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 transparent`;
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,255,255,0.1)`;
      }}
    >
      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${a.color}08, transparent, ${a.color}08)` }}
      />
      <div className="relative z-10 w-full px-2">
        <div
          className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1 tracking-tight break-words"
          style={{ color: a.color }}
        >
          {value}
        </div>
        <div className="text-[10px] sm:text-xs text-[#B3B3B3] uppercase tracking-[1px] sm:tracking-[1.5px] font-medium leading-tight">
          {label}
        </div>
      </div>
    </div>
  );
}
