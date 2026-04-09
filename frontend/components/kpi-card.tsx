"use client";

import { cn } from "@/lib/utils";

interface KpiCardProps {
  value: string;
  label: string;
  className?: string;
}

export function KpiCard({ value, label, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-center",
        "bg-gradient-to-br from-[#282828] to-[#1a1a2e]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(29,185,84,0.15)]",
        "hover:border-[#1DB954]/50",
        "min-h-[140px] flex flex-col justify-center",
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#1DB954]/5 via-transparent to-[#1DB954]/5" />
      <div className="relative z-10 w-full px-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#1DB954] leading-tight mb-1 tracking-tight break-words">
          {value}
        </div>
        <div className="text-[10px] sm:text-xs text-[#B3B3B3] uppercase tracking-[1px] sm:tracking-[1.5px] font-medium leading-tight">
          {label}
        </div>
      </div>
    </div>
  );
}
