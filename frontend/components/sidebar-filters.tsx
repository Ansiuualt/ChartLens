"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { Calendar, ShieldAlert, Disc3, Music, User, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Searchable multi-select dropdown ─────────────────────────────────── */
function MultiSelect({
  label,
  icon: Icon,
  options,
  selected,
  onChange,
  placeholder = "Search...",
}: {
  label: string;
  icon: React.ElementType;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);
  };

  return (
    <div className="px-5 py-3" ref={ref}>
      <label className="flex items-center gap-2 text-xs text-[#B3B3B3] uppercase tracking-wider font-medium mb-3">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>

      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#282828] text-white text-xs border border-white/10 rounded-lg px-3 py-2 text-left outline-none focus:border-[#1DB954]/50 transition-colors"
      >
        {selected.length === 0
          ? <span className="text-[#666]">All</span>
          : <span className="truncate block">{selected.length} selected</span>}
      </button>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.slice(0, 3).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 bg-[#1DB954]/15 text-[#1DB954] text-[0.6rem] px-2 py-0.5 rounded-full"
            >
              {s.length > 18 ? s.substring(0, 18) + "…" : s}
              <button onClick={() => toggle(s)} className="hover:text-white">×</button>
            </span>
          ))}
          {selected.length > 3 && (
            <span className="text-[0.6rem] text-[#666] px-1">+{selected.length - 3} more</span>
          )}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 bg-[#1e1e2e] border border-white/10 rounded-lg overflow-hidden shadow-xl"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs text-white px-3 py-2 border-b border-white/5 outline-none placeholder:text-[#555]"
            />
            <div className="max-h-40 overflow-y-auto">
              {selected.length > 0 && (
                <button
                  onClick={() => onChange([])}
                  className="w-full text-left px-3 py-1.5 text-[0.65rem] text-[#FF6B6B] hover:bg-white/5"
                >
                  ✕ Clear all
                </button>
              )}
              {filtered.slice(0, 50).map((o) => (
                <label key={o} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={selected.includes(o)}
                    onChange={() => toggle(o)}
                    className="w-3 h-3 rounded border-white/20 bg-[#282828] text-[#1DB954] accent-[#1DB954]"
                  />
                  <span className="text-[0.7rem] text-[#ccc] truncate">{o}</span>
                </label>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-[0.65rem] text-[#555]">No results</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main sidebar ─────────────────────────────────────────────────────── */

export function SidebarFilters({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { filters, setFilters, meta, loading } = useFilters();

  if (loading || !meta) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {isOpen && (
        <motion.div
          key="sidebar"
          initial={{ x: "100%", width: 0, opacity: 0 }}
          animate={{ 
            x: 0, 
            width: typeof window !== "undefined" && window.innerWidth < 1024 ? "100%" : 280, 
            opacity: 1 
          }}
          exit={{ x: "100%", width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed right-0 top-0 bottom-0 z-[60] w-full max-w-[320px] border-l border-white/10 bg-gradient-to-b from-[#141420] to-[#0d0d1a] shadow-2xl lg:relative lg:top-auto lg:bottom-auto lg:z-0 lg:max-w-none lg:w-[280px] lg:shadow-none lg:bg-transparent lg:border-white/5",
            "flex-shrink-0 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16"
          )}
          style={{ minWidth: 0 }}
        >
          <div className="h-full w-full overflow-y-auto">

            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end px-5 pt-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#B3B3B3] hover:text-white transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Header */}
            <div className="px-5 pt-2 lg:pt-6 pb-3">
              <h3 className="text-xs uppercase tracking-[2px] text-[#1DB954] font-semibold mb-1">
                Filters
              </h3>
              <div className="h-px bg-[#1DB954]/20 mt-2" />
            </div>

            {/* Date Range */}
            <div className="px-5 py-3">
              <label className="flex items-center gap-2 text-xs text-[#B3B3B3] uppercase tracking-wider font-medium mb-3">
                <Calendar className="w-3.5 h-3.5" /> Date Range
              </label>
              <div className="space-y-2">
                <div>
                  <span className="text-[0.65rem] text-[#666] block mb-1">From</span>
                  <input
                    type="date"
                    value={filters.dateStart}
                    min={meta.date_min}
                    max={meta.date_max}
                    onChange={(e) => setFilters((p) => ({ ...p, dateStart: e.target.value }))}
                    className="w-full bg-[#282828] text-white text-xs border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[#1DB954]/50 transition-colors"
                  />
                </div>
                <div>
                  <span className="text-[0.65rem] text-[#666] block mb-1">To</span>
                  <input
                    type="date"
                    value={filters.dateEnd}
                    min={meta.date_min}
                    max={meta.date_max}
                    onChange={(e) => setFilters((p) => ({ ...p, dateEnd: e.target.value }))}
                    className="w-full bg-[#282828] text-white text-xs border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[#1DB954]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mx-5 h-px bg-white/5" />

            {/* Artist Multi-Select */}
            <MultiSelect
              label="Artist"
              icon={User}
              options={meta.artists}
              selected={filters.artists}
              onChange={(v) => setFilters((p) => ({ ...p, artists: v }))}
              placeholder="Search artists..."
            />

            <div className="mx-5 h-px bg-white/5" />

            {/* Song Multi-Select */}
            <MultiSelect
              label="Song"
              icon={Music}
              options={meta.songs}
              selected={filters.songs}
              onChange={(v) => setFilters((p) => ({ ...p, songs: v }))}
              placeholder="Search songs..."
            />

            <div className="mx-5 h-px bg-white/5" />

            {/* Rank Range Slider */}
            <div className="px-5 py-3">
              <label className="flex items-center gap-2 text-xs text-[#B3B3B3] uppercase tracking-wider font-medium mb-3">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Rank Range
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[0.65rem] text-[#666]">
                  <span>#{filters.rankMin}</span>
                  <span>#{filters.rankMax}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={filters.rankMin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFilters((p) => ({ ...p, rankMin: Math.min(v, p.rankMax) }));
                    }}
                    className="flex-1 accent-[#1DB954] h-1.5"
                  />
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={filters.rankMax}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFilters((p) => ({ ...p, rankMax: Math.max(v, p.rankMin) }));
                    }}
                    className="flex-1 accent-[#1DB954] h-1.5"
                  />
                </div>
                <div className="text-center text-[0.6rem] text-[#555]">
                  Positions {filters.rankMin}–{filters.rankMax}
                </div>
              </div>
            </div>

            <div className="mx-5 h-px bg-white/5" />

            {/* Explicit */}
            <div className="px-5 py-3">
              <label className="flex items-center gap-2 text-xs text-[#B3B3B3] uppercase tracking-wider font-medium mb-3">
                <ShieldAlert className="w-3.5 h-3.5" /> Explicit Content
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {(["All", "Clean", "Explicit"] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() => setFilters((p) => ({ ...p, explicit: val }))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                      filters.explicit === val
                        ? "bg-[#1DB954] text-black"
                        : "bg-[#282828] text-[#B3B3B3] hover:bg-white/10"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-5 h-px bg-white/5" />

            {/* Album Type */}
            <div className="px-5 py-3 pb-8">
              <label className="flex items-center gap-2 text-xs text-[#B3B3B3] uppercase tracking-wider font-medium mb-3">
                <Disc3 className="w-3.5 h-3.5" /> Album Type
              </label>
              <div className="space-y-1.5">
                {meta.album_types.map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.albumTypes.includes(t)}
                      onChange={(e) => {
                        setFilters((p) => ({
                          ...p,
                          albumTypes: e.target.checked
                            ? [...p.albumTypes, t]
                            : p.albumTypes.filter((x) => x !== t),
                        }));
                      }}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-[#282828] text-[#1DB954] focus:ring-[#1DB954]/30 accent-[#1DB954]"
                    />
                    <span className="text-xs text-[#B3B3B3] group-hover:text-white transition-colors capitalize">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
