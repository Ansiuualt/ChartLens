"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";
import type { ExplicitStat } from "@/lib/types";

interface Props {
  stats: ExplicitStat[];
}

export function ExplicitDonut({ stats }: Props) {
  return (
    <Plot
      data={[
        {
          labels: stats.map((s) => s.label),
          values: stats.map((s) => s.n_tracks),
          type: "pie",
          hole: 0.55,
          marker: { colors: [COLORS.primary, COLORS.accent] },
          textinfo: "label+percent",
          hovertemplate: "%{label}: %{value} tracks (%{percent})<extra></extra>",
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: "Explicit vs Clean Share", font: { size: 15 } },
        showlegend: false,
        height: 350,
      }}
      useResizeHandler
      style={{ width: "100%", height: "350px" }}
      config={{ displayModeBar: false }}
    />
  );
}
