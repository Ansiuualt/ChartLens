"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";
import type { ArtistRecord } from "@/lib/types";

interface DominanceBarProps {
  artists: ArtistRecord[];
}

export function DominanceBar({ artists }: DominanceBarProps) {
  const top20 = artists.slice(0, 20);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white mb-1">
        👑 Top Artists by Chart Appearances
      </h3>
      <p className="text-[0.7rem] text-[#888] mb-5">
        Ranked by total days appearing on the US Top 50
      </p>
      <Plot
        data={[
          {
            type: "bar" as const,
            orientation: "h" as const,
            y: top20.map((a) => a.artist),
            x: top20.map((a) => a.total_appearances),
            marker: {
              color: top20.map((_, i) => {
                const t = i / Math.max(top20.length - 1, 1);
                const r = Math.round(245 - t * 100);
                const g = Math.round(158 - t * 70);
                const b = Math.round(11 + t * 30);
                return `rgb(${r}, ${g}, ${b})`;
              }),
              line: { color: "rgba(245, 158, 11, 0.3)", width: 1 },
            },
            text: top20.map((a) => `  ${a.total_appearances} · #${a.avg_rank.toFixed(0)} avg`),
            textposition: "outside" as const,
            textfont: { color: "#ddd", size: 11 },
            hovertemplate:
              "<b>%{y}</b><br>" +
              "Appearances: %{x}<br>" +
              "<extra></extra>",
          },
        ]}
        layout={{
          ...DARK_LAYOUT,
          height: Math.max(480, top20.length * 32),
          xaxis: {
            ...DARK_LAYOUT.xaxis,
            title: { text: "Total Appearances (days)", font: { color: "#aaa", size: 12 } },
            range: [0, Math.max(...top20.map((a) => a.total_appearances)) * 1.3],
          },
          yaxis: {
            ...DARK_LAYOUT.yaxis,
            autorange: "reversed" as const,
            tickfont: { color: "#ddd", size: 12 },
            automargin: true,
          },
          margin: { l: 10, r: 70, t: 10, b: 50 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  );
}
