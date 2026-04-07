"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { FilterState, MetaData } from "@/lib/types";
import { api } from "@/lib/api";

interface FilterContextValue {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  meta: MetaData | null;
  loading: boolean;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateStart: "",
    dateEnd: "",
    nationality: "Both",
    explicit: "All",
    albumTypes: [],
  });

  useEffect(() => {
    api.meta().then((m) => {
      setMeta(m);
      setFilters((prev) => ({
        ...prev,
        dateStart: m.date_min,
        dateEnd: m.date_max,
        albumTypes: m.album_types,
      }));
      setLoading(false);
    });
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilters, meta, loading }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
