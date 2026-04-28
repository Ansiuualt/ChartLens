"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";
import type { ExplicitStat } from "@/lib/types";

interface ExplicitSplitProps {
  stats: ExplicitStat[];
}

export function ExplicitSplit({ stats }: ExplicitSplitProps) {
  const clean = stats.find((s) => !s.is_explicit);
  const explicit = stats.find((s) => s.is_explicit);
  if (!clean || !explicit) return null;

  const metrics = [
    { label: "Avg Rank", clean: clean.avg_position, explicit: explicit.avg_position },
    { label: "Avg Popularity", clean: clean.avg_popularity, explicit: explicit.avg_popularity },
    { label: "Median Days", clean: clean.median_days, explicit: explicit.median_days },
    { label: "Mean Days", clean: clean.mean_days, explicit: explicit.mean_days },
  ];

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white mb-1">⚖️ Performance Comparison</h3>
      <p className="text-[0.7rem] text-[#888] mb-5">
        <span style={{ color: PALETTE.explicit.clean }}>● Clean ({clean.n_tracks})</span>
        &ensp;vs&ensp;
        <span style={{ color: PALETTE.explicit.explicit }}>● Explicit ({explicit.n_tracks})</span>
      </p>
      <Plot
        data={[
          {
            type: "bar" as const, name: "Clean",
            x: metrics.map((m) => m.label), y: metrics.map((m) => m.clean),
            marker: { color: PALETTE.explicit.clean, opacity: 0.85 },
            text: metrics.map((m) => m.clean.toFixed(1)),
            textposition: "outside" as const,
            textfont: { color: PALETTE.explicit.clean, size: 13 },
          },
          {
            type: "bar" as const, name: "Explicit",
            x: metrics.map((m) => m.label), y: metrics.map((m) => m.explicit),
            marker: { color: PALETTE.explicit.explicit, opacity: 0.85 },
            text: metrics.map((m) => m.explicit.toFixed(1)),
            textposition: "outside" as const,
            textfont: { color: PALETTE.explicit.explicit, size: 13 },
          },
        ]}
        layout={{
          ...DARK_LAYOUT, barmode: "group" as const, height: 400,
          xaxis: { ...DARK_LAYOUT.xaxis, tickfont: { color: "#ddd", size: 13 }, type: "category" as const },
          yaxis: { ...DARK_LAYOUT.yaxis, tickfont: { color: "#aaa", size: 12 } },
          legend: { font: { color: "#ccc", size: 12 }, bgcolor: "rgba(0,0,0,0.3)", orientation: "h" as const, y: 1.08 },
          margin: { l: 50, r: 25, t: 40, b: 50 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  );
}
