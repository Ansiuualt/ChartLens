"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { ExplicitTrack } from "@/lib/types";

interface Props {
  tracks: ExplicitTrack[];
}

export function ExplicitViolins({ tracks }: Props) {
  const configs = [
    { key: "avg_position" as const, title: "Avg Chart Position" },
    { key: "avg_popularity" as const, title: "Avg Popularity" },
    { key: "days_on_chart" as const, title: "Days on Chart" },
  ];

  const clean = tracks.filter((t) => t.label === "Clean");
  const explicit = tracks.filter((t) => t.label === "Explicit");

  return (
    <div className="grid grid-cols-3 gap-4">
      {configs.map((c) => (
        <Plot
          key={c.key}
          data={[
            {
              y: clean.map((t) => t[c.key]),
              type: "violin",
              name: "Clean",
              marker: { color: COLORS.primary },
              box: { visible: true },
              meanline: { visible: true },
              side: "negative",
            } as Plotly.Data,
            {
              y: explicit.map((t) => t[c.key]),
              type: "violin",
              name: "Explicit",
              marker: { color: COLORS.accent },
              box: { visible: true },
              meanline: { visible: true },
              side: "positive",
            } as Plotly.Data,
          ]}
          layout={{
            ...DARK_LAYOUT,
            title: { text: c.title, font: { size: 13 } },
            showlegend: false,
            violingap: 0,
            violinmode: "overlay",
            height: 300,
            margin: { l: 45, r: 10, t: 50, b: 30 },
          } as Partial<Plotly.Layout>}
          useResizeHandler
          style={{ width: "100%", height: "300px" }}
          config={{ displayModeBar: false }}
        />
      ))}
    </div>
  );
}
