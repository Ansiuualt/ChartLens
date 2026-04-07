"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { CollabTrack } from "@/lib/types";

interface Props {
  tracks: CollabTrack[];
}

export function CollabScatter({ tracks }: Props) {
  const solo = tracks.filter((t) => t.type === "Solo");
  const collab = tracks.filter((t) => t.type === "Collab");

  return (
    <Plot
      data={[
        {
          x: solo.map((t) => t.days_on_chart),
          y: solo.map((t) => t.peak_position),
          mode: "markers",
          type: "scatter",
          name: "Solo",
          marker: { color: COLORS.primary, opacity: 0.6, size: 6 },
          text: solo.map((t) => `${t.song} — ${t.artist}`),
          hovertemplate: "%{text}<br>Days: %{x}<br>Peak: %{y}<extra></extra>",
        },
        {
          x: collab.map((t) => t.days_on_chart),
          y: collab.map((t) => t.peak_position),
          mode: "markers",
          type: "scatter",
          name: "Collab",
          marker: { color: COLORS.accent, opacity: 0.6, size: 6 },
          text: collab.map((t) => `${t.song} — ${t.artist}`),
          hovertemplate: "%{text}<br>Days: %{x}<br>Peak: %{y}<extra></extra>",
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: "Days on Chart vs Peak Position", font: { size: 15 } },
        xaxis: { ...DARK_LAYOUT.xaxis, title: { text: "Days on Chart" } },
        yaxis: { ...DARK_LAYOUT.yaxis, title: { text: "Peak Position" }, autorange: "reversed" },
        height: 400,
      }}
      useResizeHandler
      style={{ width: "100%", height: "400px" }}
      config={{ displayModeBar: false }}
    />
  );
}
