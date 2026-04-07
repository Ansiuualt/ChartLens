"use client";

import { cn } from "@/lib/utils";

interface InsightBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function InsightBox({ children, className }: InsightBoxProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-[#1DB954]/10 to-[#1DB954]/[0.02]",
        "border-l-4 border-[#1DB954] rounded-r-xl",
        "px-6 py-5 my-4",
        "text-sm text-[#e0e0e0] leading-relaxed",
        "[&_strong]:text-[#1DB954] [&_strong]:font-semibold",
        className
      )}
    >
      {children}
    </div>
  );
}
