"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { WeeklyEntry } from "@/lib/types";

interface Props {
  weeklyTs: WeeklyEntry[];
}

export function NationalityArea({ weeklyTs }: Props) {
  const nationalities = [...new Set(weeklyTs.map((w) => w.nationality))];

  return (
    <Plot
      data={nationalities.map((nat) => {
        const filtered = weeklyTs.filter((w) => w.nationality === nat);
        return {
          x: filtered.map((w) => w.week),
          y: filtered.map((w) => w.entries),
          type: "scatter" as const,
          mode: "lines" as const,
          fill: "tozeroy",
          name: nat,
          line: { color: nat === "UK" ? COLORS.uk : COLORS.intl, width: 1.5 },
          fillcolor: nat === "UK" ? "rgba(0,48,135,0.3)" : "rgba(207,20,43,0.3)",
          hovertemplate: "%{y} entries<extra></extra>",
        };
      })}
      layout={{
        ...DARK_LAYOUT,
        title: { text: "UK vs International Entries Over Time", font: { size: 15 } },
        xaxis: { 
          ...DARK_LAYOUT.xaxis, 
          title: { text: "Week" }, 
          type: "date",
          tickformat: "%b %Y",
          hoverformat: "%B %d, %Y"
        },
        yaxis: { ...DARK_LAYOUT.yaxis, title: { text: "Chart Entries" } },
        height: 350,
        hovermode: "x unified",
      }}
      useResizeHandler
      style={{ width: "100%", height: "350px" }}
      config={{ displayModeBar: false }}
    />
  );
}
