"use client";

import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { Calendar, Globe, ShieldAlert, Disc3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            width: typeof window !== "undefined" && window.innerWidth < 1024 ? "100%" : 260, 
            opacity: 1 
          }}
          exit={{ x: "100%", width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed right-0 top-0 bottom-0 z-[60] w-full max-w-[300px] border-l border-white/10 bg-gradient-to-b from-[#141420] to-[#0d0d1a] shadow-2xl lg:relative lg:top-auto lg:bottom-auto lg:z-0 lg:max-w-none lg:w-[260px] lg:shadow-none lg:bg-transparent lg:border-white/5",
            "flex-shrink-0 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16"
          )}
          style={{ minWidth: 0 }}
        >
          {/* Inner content container */}
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

            {/* Nationality */}
            <div className="px-5 py-3">
              <label className="flex items-center gap-2 text-xs text-[#B3B3B3] uppercase tracking-wider font-medium mb-3">
                <Globe className="w-3.5 h-3.5" /> Nationality
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {(["Both", "UK", "International"] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() => setFilters((p) => ({ ...p, nationality: val }))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap",
                      filters.nationality === val
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
