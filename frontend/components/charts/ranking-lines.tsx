"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";
import type { RankingEntry } from "@/lib/types";

interface RankingLinesProps {
  trends: RankingEntry[];
}

/**
 * Downsample daily rank data to weekly averages for readability.
 * Groups entries by song + ISO week, then returns the average position per week.
 */
function weeklyAverage(entries: RankingEntry[]): { date: string; position: number }[] {
  const weeks = new Map<string, { dates: string[]; positions: number[] }>();

  entries.forEach((e) => {
    const d = new Date(e.date);
    // ISO week key: year + week number
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
    const key = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;

    if (!weeks.has(key)) weeks.set(key, { dates: [], positions: [] });
    weeks.get(key)!.dates.push(e.date);
    weeks.get(key)!.positions.push(e.position);
  });

  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, { dates, positions }]) => ({
      date: dates[Math.floor(dates.length / 2)], // mid-week date
      position: positions.reduce((a, b) => a + b, 0) / positions.length,
    }));
}

export function RankingLines({ trends }: RankingLinesProps) {
  // Group by song
  const songMap = new Map<string, RankingEntry[]>();
  trends.forEach((t) => {
    if (!songMap.has(t.song)) songMap.set(t.song, []);
    songMap.get(t.song)!.push(t);
  });

  // Top 5 songs by data-point count (longevity)
  const songEntries = Array.from(songMap.entries())
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 5);

  // Build traces with weekly smoothing
  const traces: Plotly.Data[] = songEntries.map(([songName, entries], i) => {
    const smoothed = weeklyAverage(entries);
    return {
      type: "scatter" as const,
      mode: "lines+markers" as const,
      name: songName.length > 28 ? songName.substring(0, 26) + "…" : songName,
      x: smoothed.map((s) => s.date),
      y: smoothed.map((s) => s.position),
      line: {
        color: PALETTE.ranking[i % PALETTE.ranking.length],
        width: 3,
        shape: "spline" as const,
        smoothing: 1.2,
      },
      marker: { size: 6, symbol: "circle" as const },
      hovertemplate: `<b>${songName}</b><br>Week of %{x|%b %d, %Y}<br>Avg Rank: <b>#%{y:.1f}</b><extra></extra>`,
    };
  });

  // Get date range for zone shapes
  const allDates = trends.map((t) => t.date);
  const xMin = allDates.length > 0 ? allDates[0] : "2024-01-01";
  const xMax = allDates.length > 0 ? allDates[allDates.length - 1] : "2025-12-31";

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white mb-1">
        📈 Song Rank Trajectories
      </h3>
      <p className="text-[0.7rem] text-[#888] mb-2">
        Weekly averaged positions · Lower = better rank · Top {songEntries.length} songs by longevity
      </p>

      {/* Rank zone legend */}
      <div className="flex items-center gap-4 mb-4 text-[0.65rem]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(29, 185, 84, 0.12)" }} />
          <span className="text-[#888]">Top 10 (Hit Zone)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(245, 158, 11, 0.08)" }} />
          <span className="text-[#888]">11–25 (Mid-Chart)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(255, 107, 107, 0.06)" }} />
          <span className="text-[#888]">26–50 (Lower Chart)</span>
        </span>
      </div>

      <Plot
        data={traces}
        layout={{
          ...DARK_LAYOUT,
          height: 500,
          yaxis: {
            ...DARK_LAYOUT.yaxis,
            autorange: "reversed" as const,
            title: { text: "Chart Position", font: { color: "#aaa", size: 12 } },
            dtick: 5,
            range: [52, -1],
            tickfont: { color: "#aaa", size: 12 },
          },
          xaxis: {
            ...DARK_LAYOUT.xaxis,
            title: { text: "", font: { color: "#aaa", size: 12 } },
            tickformat: "%b %Y",
            tickfont: { color: "#aaa", size: 11 },
            nticks: 8,
          },
          legend: {
            font: { color: "#ddd", size: 12 },
            bgcolor: "rgba(0,0,0,0.4)",
            bordercolor: "rgba(255,255,255,0.08)",
            borderwidth: 1,
            orientation: "h" as const,
            y: -0.18,
            x: 0.5,
            xanchor: "center" as const,
          },
          margin: { l: 55, r: 25, t: 15, b: 70 },
          // Colored zone bands
          shapes: [
            // Top 10: green zone
            {
              type: "rect" as const, xref: "paper" as const, yref: "y" as const,
              x0: 0, x1: 1, y0: 0, y1: 10,
              fillcolor: "rgba(29, 185, 84, 0.08)", line: { width: 0 },
              layer: "below" as const,
            },
            // 11-25: gold zone
            {
              type: "rect" as const, xref: "paper" as const, yref: "y" as const,
              x0: 0, x1: 1, y0: 10, y1: 25,
              fillcolor: "rgba(245, 158, 11, 0.05)", line: { width: 0 },
              layer: "below" as const,
            },
            // 26-50: coral zone
            {
              type: "rect" as const, xref: "paper" as const, yref: "y" as const,
              x0: 0, x1: 1, y0: 25, y1: 50,
              fillcolor: "rgba(255, 107, 107, 0.04)", line: { width: 0 },
              layer: "below" as const,
            },
          ],
          // Zone labels on the right side
          annotations: [
            {
              x: 1.01, xref: "paper" as const, y: 5, yref: "y" as const,
              text: "HIT", showarrow: false,
              font: { color: "rgba(29,185,84,0.5)", size: 10, family: "Inter" },
            },
            {
              x: 1.01, xref: "paper" as const, y: 17, yref: "y" as const,
              text: "MID", showarrow: false,
              font: { color: "rgba(245,158,11,0.4)", size: 10, family: "Inter" },
            },
            {
              x: 1.01, xref: "paper" as const, y: 38, yref: "y" as const,
              text: "LOW", showarrow: false,
              font: { color: "rgba(255,107,107,0.35)", size: 10, family: "Inter" },
            },
          ],
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  );
}
