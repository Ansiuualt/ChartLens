"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { AlbumTrack } from "@/lib/types";

interface Props {
  tracks: AlbumTrack[];
}

const BIN_ORDER = ["Single (1)", "EP (2–6)", "Standard (7–14)", "Deluxe (15–20)", "Mega (21+)"];
const BIN_COLORS = [COLORS.primary, "#2ecc71", "#3498db", COLORS.accent, "#e74c3c"];

export function AlbumBinBox({ tracks }: Props) {
  return (
    <Plot
      data={BIN_ORDER.map((bin, i) => {
        const filtered = tracks.filter((t) => t.album_size_bin === bin);
        return {
          y: filtered.map((t) => t.days_on_chart),
          type: "box" as const,
          name: bin,
          marker: { color: BIN_COLORS[i] },
          boxpoints: "outliers",
        };
      })}
      layout={{
        ...DARK_LAYOUT,
        title: { text: "Days on Chart by Album Size", font: { size: 15 } },
        showlegend: false,
        height: 380,
        margin: { l: 45, r: 10, t: 50, b: 80 },
      }}
      useResizeHandler
      style={{ width: "100%", height: "380px" }}
      config={{ displayModeBar: false }}
    />
  );
}
