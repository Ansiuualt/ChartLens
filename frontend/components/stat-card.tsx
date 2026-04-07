"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-[#282828] rounded-xl px-5 py-4 text-center",
        "border border-white/[0.06]",
        "flex-1 min-w-[140px]",
        className
      )}
    >
      <div className="text-2xl font-bold text-[#1DB954]">{value}</div>
      <div className="text-[0.7rem] text-[#B3B3B3] uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-3 flex-wrap mb-4", className)}>
      {children}
    </div>
  );
}
