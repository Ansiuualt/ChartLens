"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { AlbumTrack } from "@/lib/types";

interface Props {
  tracks: AlbumTrack[];
  pearsonR: number;
}

export function AlbumScatter({ tracks, pearsonR }: Props) {
  const albumTypes = [...new Set(tracks.map((t) => t.album_type))];
  const colorMap: Record<string, string> = {
    album: COLORS.primary,
    single: COLORS.accent,
    compilation: COLORS.uk,
  };

  return (
    <Plot
      data={albumTypes.map((type) => {
        const filtered = tracks.filter((t) => t.album_type === type);
        return {
          x: filtered.map((t) => t.total_tracks),
          y: filtered.map((t) => t.days_on_chart),
          mode: "markers" as const,
          type: "scatter" as const,
          name: type,
          marker: { color: colorMap[type] || COLORS.neutral, opacity: 0.55, size: 5 },
          text: filtered.map((t) => `${t.song} — ${t.artist}`),
          hovertemplate: "%{text}<br>Tracks: %{x}<br>Days: %{y}<extra></extra>",
        };
      })}
      layout={{
        ...DARK_LAYOUT,
        title: { text: `Album Size vs Chart Duration  (r = ${pearsonR.toFixed(3)})`, font: { size: 15 } },
        xaxis: { ...DARK_LAYOUT.xaxis, title: { text: "Total Tracks in Album" } },
        yaxis: { ...DARK_LAYOUT.yaxis, title: { text: "Days on Chart" } },
        height: 420,
      }}
      useResizeHandler
      style={{ width: "100%", height: "420px" }}
      config={{ displayModeBar: false }}
    />
  );
}
