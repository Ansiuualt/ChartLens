"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";
import type { ExplicitStat } from "@/lib/types";

interface Props {
  stats: ExplicitStat[];
}

export function ExplicitDonut({ stats }: Props) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white mb-4">🍩 Explicit vs Clean Share</h3>
      <Plot
        data={[
          {
            labels: stats.map((s) => s.label),
            values: stats.map((s) => s.n_tracks),
            type: "pie" as const,
            hole: 0.55,
            marker: { colors: PALETTE.explicit.donut, line: { color: "#191414", width: 2 } },
            textinfo: "label+percent" as const,
            textfont: { color: "#fff", size: 14 },
            hovertemplate: "%{label}: %{value} tracks (%{percent})<extra></extra>",
            pull: [0.02, 0.02],
          },
        ]}
        layout={{
          ...DARK_LAYOUT,
          showlegend: false,
          height: 300,
          margin: { l: 20, r: 20, t: 10, b: 10 },
          annotations: [
            {
              text: `${stats.reduce((a, s) => a + s.n_tracks, 0)}<br>tracks`,
              showarrow: false,
              font: { color: "#ddd", size: 16, family: "Inter" },
              x: 0.5,
              y: 0.5,
            },
          ],
        }}
        config={{ displayModeBar: false }}
        className="w-full"
      />
    </div>
  );
}
