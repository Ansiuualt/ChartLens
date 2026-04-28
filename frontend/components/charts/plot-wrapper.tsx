"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default Plot;

// Shared layout defaults — optimized for readability
export const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { color: "#E0E0E0", family: "Inter, sans-serif", size: 13 },
  margin: { l: 60, r: 25, t: 50, b: 50 },
  hoverlabel: { 
    bgcolor: "#191414", 
    bordercolor: "rgba(255,255,255,0.15)",
    font: { color: "#FFFFFF", family: "Inter, sans-serif", size: 13 }
  },
  xaxis: { 
    gridcolor: "rgba(255, 255, 255, 0.06)", 
    zerolinecolor: "rgba(255, 255, 255, 0.12)",
    tickfont: { color: "#aaa", size: 11 },
    automargin: true,
    tickangle: 0,
    nticks: 8,
  },
  yaxis: { 
    gridcolor: "rgba(255, 255, 255, 0.06)", 
    zerolinecolor: "rgba(255, 255, 255, 0.12)",
    tickfont: { color: "#aaa", size: 11 },
    automargin: true,
  },
};

// Distinct color palettes per chart type for visual uniqueness
export const COLORS = {
  primary: "#1DB954",
  accent: "#FF6B6B",
  neutral: "#B3B3B3",
  bg: "#191414",
  card: "#282828",
};

// Per-chart unique palettes
export const PALETTE = {
  timeline: {
    bar: "#06B6D4",       // Cyan
    area: "#0891B2",      // Darker cyan
    areaFill: "rgba(6, 182, 212, 0.15)",
  },
  ranking: [
    "#1DB954", "#FF6B6B", "#8B5CF6", "#06B6D4", "#F59E0B",
    "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#A855F7",
  ],
  dominance: {
    bar: "#F59E0B",       // Gold
    lorenz: "#8B5CF6",    // Purple
    lorenzFill: "rgba(139, 92, 246, 0.12)",
  },
  popularity: {
    clean: "#1DB954",
    explicit: "#FF6B6B",
  },
  explicit: {
    clean: "#06B6D4",     // Cyan
    explicit: "#F97316",  // Orange
    donut: ["#06B6D4", "#F97316"],
  },
};
