"use client";

import Plot, { DARK_LAYOUT } from "./plot-wrapper";
import type { ArtistRecord } from "@/lib/types";

interface Props {
  artists: ArtistRecord[];
  topN?: number;
}

export function TopArtistsBar({ artists, topN = 15 }: Props) {
  const top = artists.slice(0, topN).reverse();

  return (
    <Plot
      data={[
        {
          x: top.map((a) => a.monopoly_share_pct),
          y: top.map((a) => a.artist),
          type: "bar",
          orientation: "h",
          marker: {
            color: top.map((_, i) =>
              `rgba(29, 185, 84, ${0.3 + (i / topN) * 0.7})`
            ),
          },
          text: top.map((a) => `${a.monopoly_share_pct.toFixed(2)}%`),
          textposition: "outside",
          hovertemplate: "%{y}<br>Share: %{x:.2f}%<extra></extra>",
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: `Top ${topN} Dominant Artists`, font: { size: 15 } },
        xaxis: { ...DARK_LAYOUT.xaxis, title: { text: "Chart Share (%)" } },
        yaxis: { ...DARK_LAYOUT.yaxis, automargin: true },
        margin: { ...DARK_LAYOUT.margin, l: 140 },
      }}
      useResizeHandler
      style={{ width: "100%", height: "400px" }}
      config={{ displayModeBar: false }}
    />
  );
}
