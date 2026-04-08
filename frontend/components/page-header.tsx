"use client";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#1DB954] via-[#1ed760] to-[#a3ffca] bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-sm text-[#B3B3B3] font-light mt-1">{subtitle}</p>
    </div>
  );
}
