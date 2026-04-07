"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { CollabTrack } from "@/lib/types";

interface Props {
  tracks: CollabTrack[];
}

export function CollabBoxes({ tracks }: Props) {
  const configs = [
    { key: "days_on_chart" as const, title: "Days on Chart" },
    { key: "chart_velocity" as const, title: "Chart Velocity" },
    { key: "avg_popularity" as const, title: "Avg Popularity" },
  ];

  const solo = tracks.filter((t) => t.type === "Solo");
  const collab = tracks.filter((t) => t.type === "Collab");

  return (
    <div className="grid grid-cols-3 gap-4">
      {configs.map((c) => (
        <Plot
          key={c.key}
          data={[
            {
              y: solo.map((t) => t[c.key]),
              type: "box",
              name: "Solo",
              marker: { color: COLORS.primary },
              boxpoints: "outliers",
            },
            {
              y: collab.map((t) => t[c.key]),
              type: "box",
              name: "Collab",
              marker: { color: COLORS.accent },
              boxpoints: "outliers",
            },
          ]}
          layout={{
            ...DARK_LAYOUT,
            title: { text: c.title, font: { size: 13 } },
            showlegend: false,
            height: 300,
            margin: { l: 45, r: 10, t: 50, b: 30 },
          }}
          useResizeHandler
          style={{ width: "100%", height: "300px" }}
          config={{ displayModeBar: false }}
        />
      ))}
    </div>
  );
}
