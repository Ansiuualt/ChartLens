"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { TypeStat } from "@/lib/types";

interface Props {
  typeStats: TypeStat[];
}

const TYPE_COLORS: Record<string, string> = {
  album: COLORS.primary,
  single: COLORS.accent,
  compilation: COLORS.uk,
};

export function AlbumTypeBar({ typeStats }: Props) {
  return (
    <Plot
      data={[
        {
          x: typeStats.map((t) => t.album_type),
          y: typeStats.map((t) => t.median_days),
          type: "bar",
          marker: { color: typeStats.map((t) => TYPE_COLORS[t.album_type] || COLORS.neutral) },
          text: typeStats.map((t) => t.median_days.toFixed(1)),
          textposition: "outside",
          hovertemplate: "%{x}<br>Median Days: %{y:.1f}<extra></extra>",
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: "Median Days by Album Type", font: { size: 15 } },
        showlegend: false,
        height: 380,
        margin: { l: 45, r: 10, t: 50, b: 30 },
      }}
      useResizeHandler
      style={{ width: "100%", height: "380px" }}
      config={{ displayModeBar: false }}
    />
  );
}
