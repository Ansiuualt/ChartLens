"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { NatStat } from "@/lib/types";

interface Props {
  natStats: NatStat[];
}

export function NationalityBars({ natStats }: Props) {
  const configs: { key: keyof NatStat; title: string; fmt: string }[] = [
    { key: "track_count", title: "Track Count", fmt: ",.0f" },
    { key: "avg_position", title: "Avg Chart Position", fmt: ".1f" },
    { key: "avg_popularity", title: "Avg Popularity", fmt: ".1f" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {configs.map((c) => (
        <Plot
          key={c.key}
          data={[
            {
              x: natStats.map((n) => n.nationality),
              y: natStats.map((n) => n[c.key] as number),
              type: "bar",
              marker: {
                color: natStats.map((n) =>
                  n.nationality === "UK" ? COLORS.uk : COLORS.intl
                ),
              },
              text: natStats.map((n) => {
                const v = n[c.key] as number;
                return c.fmt === ",.0f" ? v.toLocaleString() : v.toFixed(1);
              }),
              textposition: "outside",
              hovertemplate: "%{x}: %{y}<extra></extra>",
            },
          ]}
          layout={{
            ...DARK_LAYOUT,
            title: { text: c.title, font: { size: 13 } },
            showlegend: false,
            yaxis: { ...DARK_LAYOUT.yaxis, title: { text: "" } },
            margin: { l: 40, r: 10, t: 50, b: 30 },
            height: 300,
          }}
          useResizeHandler
          style={{ width: "100%", height: "300px" }}
          config={{ displayModeBar: false }}
        />
      ))}
    </div>
  );
}
