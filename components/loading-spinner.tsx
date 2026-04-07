"use client";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64 w-full">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[#282828] border-t-[#1DB954] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#282828] border-b-[#1DB954]/60 animate-spin-reverse" />
        </div>
      </div>
    </div>
  );
}
