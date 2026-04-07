"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default Plot;

// Shared layout defaults
export const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { color: "#E0E0E0", family: "Inter, sans-serif", size: 12 },
  margin: { l: 50, r: 20, t: 50, b: 40 },
  hoverlabel: { 
    bgcolor: "#191414", 
    bordercolor: "rgba(255,255,255,0.1)",
    font: { color: "#FFFFFF", family: "Inter, sans-serif", size: 13 }
  },
  xaxis: { 
    gridcolor: "rgba(255, 255, 255, 0.06)", 
    zerolinecolor: "rgba(255, 255, 255, 0.12)",
    tickfont: { color: "#9ca3af" },
    automargin: true,
    tickangle: -45,
    nticks: 8,
  },
  yaxis: { 
    gridcolor: "rgba(255, 255, 255, 0.06)", 
    zerolinecolor: "rgba(255, 255, 255, 0.12)",
    tickfont: { color: "#9ca3af" },
  },
};

export const COLORS = {
  primary: "#1DB954",
  accent: "#FF6B6B",
  neutral: "#B3B3B3",
  uk: "#003087",
  intl: "#CF142B",
  bg: "#191414",
  card: "#282828",
};
