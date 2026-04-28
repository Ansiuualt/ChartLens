"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";
import type { SongSpan, DailyCount } from "@/lib/types";

interface TimelineHeatmapProps {
  songSpans: SongSpan[];
  dailyCounts: DailyCount[];
}

export function TimelineHeatmap({ songSpans, dailyCounts }: TimelineHeatmapProps) {
  const top15 = songSpans.slice(0, 15);

  return (
    <div className="space-y-6">
      {/* Song lifespan bars — Cyan gradient */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
        <h3 className="text-base font-semibold text-white mb-1">
          🎵 Song Lifespans on Chart
        </h3>
        <p className="text-[0.7rem] text-[#888] mb-5">
          Top {top15.length} by total days on the US Top 50
        </p>
        <Plot
          data={[
            {
              type: "bar" as const,
              orientation: "h" as const,
              y: top15.map((s) => s.song),
              x: top15.map((s) => s.days_on_chart),
              marker: {
                color: top15.map((_, i) => {
                  const t = i / Math.max(top15.length - 1, 1);
                  const r = Math.round(6 + t * 30);
                  const g = Math.round(182 - t * 80);
                  const b = Math.round(212 - t * 40);
                  return `rgb(${r}, ${g}, ${b})`;
                }),
                line: { color: "rgba(6, 182, 212, 0.4)", width: 1 },
              },
              text: top15.map((s) => `  ${s.days_on_chart} days · Best #${s.best_position}`),
              textposition: "outside" as const,
              textfont: { color: "#ddd", size: 11, family: "Inter" },
              hovertemplate: "<b>%{y}</b><br>Days: %{x}<br>Artist: " +
                top15.map((s) => s.artist).join("") + // placeholder
                "<extra></extra>",
              customdata: top15.map((s) => [s.artist, s.best_position, s.avg_popularity.toFixed(0)]),
            },
          ]}
          layout={{
            ...DARK_LAYOUT,
            height: Math.max(420, top15.length * 36),
            xaxis: {
              ...DARK_LAYOUT.xaxis,
              title: { text: "Days on Chart", font: { color: "#aaa", size: 12 } },
              tickfont: { color: "#aaa", size: 11 },
              range: [0, Math.max(...top15.map((s) => s.days_on_chart)) * 1.25],
            },
            yaxis: {
              ...DARK_LAYOUT.yaxis,
              autorange: "reversed" as const,
              tickfont: { color: "#ddd", size: 11 },
              automargin: true,
            },
            margin: { l: 10, r: 80, t: 10, b: 50 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          className="w-full"
        />
      </div>

      {/* Daily unique songs — Cyan area chart */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
        <h3 className="text-base font-semibold text-white mb-1">
          📊 Daily Unique Songs on Chart
        </h3>
        <p className="text-[0.7rem] text-[#888] mb-5">
          Number of distinct songs appearing on the chart each day
        </p>
        <Plot
          data={[
            {
              type: "scatter" as const,
              mode: "lines" as const,
              x: dailyCounts.map((d) => d.date),
              y: dailyCounts.map((d) => d.unique_songs),
              fill: "tozeroy" as const,
              fillcolor: PALETTE.timeline.areaFill,
              line: { color: PALETTE.timeline.bar, width: 2.5, shape: "spline" as const },
              hovertemplate: "%{x|%b %d, %Y}<br><b>%{y} songs</b><extra></extra>",
            },
          ]}
          layout={{
            ...DARK_LAYOUT,
            height: 280,
            yaxis: {
              ...DARK_LAYOUT.yaxis,
              title: { text: "Unique Songs", font: { color: "#aaa", size: 12 } },
            },
            xaxis: {
              ...DARK_LAYOUT.xaxis,
              tickformat: "%b %Y",
              nticks: 10,
            },
            margin: { l: 55, r: 25, t: 15, b: 45 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          className="w-full"
        />
      </div>
    </div>
  );
}
