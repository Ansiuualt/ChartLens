"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";
import type { PopularityTrack } from "@/lib/types";

interface PopularityScatterProps {
  tracks: PopularityTrack[];
  correlation: number;
}

/**
 * Simple linear regression returning slope, intercept.
 */
function linReg(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const n = xs.length;
  if (n < 2) return { slope: 0, intercept: 0 };
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function PopularityScatter({ tracks, correlation }: PopularityScatterProps) {
  // Only show tracks with ≥5 days for cleaner view
  const meaningful = tracks.filter((t) => t.days_on_chart >= 5);
  const explicit = meaningful.filter((t) => t.is_explicit);
  const clean = meaningful.filter((t) => !t.is_explicit);

  // Regression trendline across all meaningful tracks
  const allX = meaningful.map((t) => t.avg_position);
  const allY = meaningful.map((t) => t.avg_popularity);
  const { slope, intercept } = linReg(allX, allY);
  const trendX = [1, 50];
  const trendY = trendX.map((x) => slope * x + intercept);

  // Scale bubble sizes — clamp to readable range
  const scaleDays = (d: number) => Math.max(7, Math.min(28, (d - 5) * 0.3 + 7));

  // Interpretation helpers
  const strengthLabel =
    Math.abs(correlation) > 0.5 ? "Strong" : Math.abs(correlation) > 0.25 ? "Moderate" : "Weak";
  const dirLabel = correlation < 0 ? "negative" : "positive";

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white mb-1">
        🔬 Popularity vs Chart Position
      </h3>
      <p className="text-[0.7rem] text-[#888] mb-2">
        Does higher Spotify popularity lead to a better chart position?
        Showing <strong className="text-white">{meaningful.length}</strong> songs with ≥5 days on chart.
      </p>

      {/* Interpretation banner */}
      <div className="flex flex-wrap items-center gap-3 mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-[0.7rem]">
        <span className="text-[#888]">Correlation:</span>
        <span className="font-bold" style={{ color: Math.abs(correlation) > 0.25 ? "#1DB954" : "#F59E0B" }}>
          r = {correlation.toFixed(3)} ({strengthLabel} {dirLabel})
        </span>
        <span className="text-[#555]">|</span>
        <span className="text-[#888]">
          {correlation < -0.1
            ? "✅ Higher popularity tends to correlate with better chart positions"
            : correlation > 0.1
            ? "⚠ Higher popularity doesn't improve chart position"
            : "➖ Almost no linear relationship between popularity and chart rank"}
        </span>
      </div>

      {/* Axis guide */}
      <div className="flex items-center gap-4 mb-4 text-[0.6rem] text-[#666]">
        <span>← Better chart position</span>
        <span className="flex-1" />
        <span>
          <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: PALETTE.popularity.clean }} />
          Clean ({clean.length})
        </span>
        <span>
          <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: PALETTE.popularity.explicit }} />
          Explicit ({explicit.length})
        </span>
        <span className="text-[#555]">Bubble = days on chart</span>
      </div>

      <Plot
        data={[
          // Trendline
          {
            type: "scatter" as const,
            mode: "lines" as const,
            name: "Trend",
            x: trendX,
            y: trendY,
            line: { color: "rgba(255,255,255,0.2)", width: 2, dash: "dash" as const },
            hoverinfo: "skip" as const,
            showlegend: false,
          },
          // Clean bubbles
          {
            type: "scatter" as const,
            mode: "markers" as const,
            name: "Clean",
            x: clean.map((t) => t.avg_position),
            y: clean.map((t) => t.avg_popularity),
            marker: {
              size: clean.map((t) => scaleDays(t.days_on_chart)),
              color: PALETTE.popularity.clean,
              opacity: 0.5,
              line: { color: "rgba(29,185,84,0.6)", width: 1 },
            },
            text: clean.map((t) => `${t.song}\n${t.artist}\n${t.days_on_chart}d on chart`),
            hovertemplate:
              "<b>%{text}</b><br>" +
              "Avg Rank: #%{x:.1f}<br>" +
              "Avg Popularity: %{y:.1f}<extra>Clean</extra>",
          },
          // Explicit bubbles
          {
            type: "scatter" as const,
            mode: "markers" as const,
            name: "Explicit",
            x: explicit.map((t) => t.avg_position),
            y: explicit.map((t) => t.avg_popularity),
            marker: {
              size: explicit.map((t) => scaleDays(t.days_on_chart)),
              color: PALETTE.popularity.explicit,
              opacity: 0.5,
              line: { color: "rgba(255,107,107,0.6)", width: 1 },
            },
            text: explicit.map((t) => `${t.song}\n${t.artist}\n${t.days_on_chart}d on chart`),
            hovertemplate:
              "<b>%{text}</b><br>" +
              "Avg Rank: #%{x:.1f}<br>" +
              "Avg Popularity: %{y:.1f}<extra>Explicit</extra>",
          },
        ]}
        layout={{
          ...DARK_LAYOUT,
          height: 520,
          xaxis: {
            ...DARK_LAYOUT.xaxis,
            title: { text: "Average Chart Position", font: { color: "#aaa", size: 12 } },
            autorange: "reversed" as const,
            dtick: 5,
            range: [52, -1],
            type: "linear" as const,
            tickfont: { color: "#aaa", size: 12 },
          },
          yaxis: {
            ...DARK_LAYOUT.yaxis,
            title: { text: "Average Popularity Score", font: { color: "#aaa", size: 12 } },
            range: [-2, 105],
            type: "linear" as const,
            tickfont: { color: "#aaa", size: 12 },
          },
          showlegend: false, // legend is in the custom HTML above
          margin: { l: 55, r: 30, t: 15, b: 55 },
          // Quadrant dividers
          shapes: [
            // Horizontal line at popularity 70 (high/low threshold)
            {
              type: "line" as const, xref: "paper" as const, yref: "y" as const,
              x0: 0, x1: 1, y0: 70, y1: 70,
              line: { color: "rgba(255,255,255,0.08)", width: 1, dash: "dot" as const },
              layer: "below" as const,
            },
            // Vertical line at position 25 (top half / bottom half)
            {
              type: "line" as const, xref: "x" as const, yref: "paper" as const,
              x0: 25, x1: 25, y0: 0, y1: 1,
              line: { color: "rgba(255,255,255,0.08)", width: 1, dash: "dot" as const },
              layer: "below" as const,
            },
          ],
          // Quadrant labels
          annotations: [
            {
              x: 12, y: 100, text: "⭐ Popular + Top Chart",
              showarrow: false, font: { color: "rgba(29,185,84,0.35)", size: 11 },
              xref: "x" as const, yref: "y" as const,
            },
            {
              x: 40, y: 100, text: "Popular but Low Rank",
              showarrow: false, font: { color: "rgba(245,158,11,0.3)", size: 10 },
              xref: "x" as const, yref: "y" as const,
            },
            {
              x: 12, y: 10, text: "Top Chart but Less Popular",
              showarrow: false, font: { color: "rgba(139,92,246,0.3)", size: 10 },
              xref: "x" as const, yref: "y" as const,
            },
            {
              x: 40, y: 10, text: "Low Rank + Low Popularity",
              showarrow: false, font: { color: "rgba(255,107,107,0.25)", size: 10 },
              xref: "x" as const, yref: "y" as const,
            },
          ],
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  );
}
