"use client";

import Plot, { DARK_LAYOUT, PALETTE } from "./plot-wrapper";

interface DominanceGiniProps {
  lorenzX: number[];
  lorenzY: number[];
  giniCoeff: number;
}

export function DominanceGini({ lorenzX, lorenzY, giniCoeff }: DominanceGiniProps) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white mb-1">
        📊 Market Concentration (Lorenz Curve)
      </h3>
      <p className="text-[0.7rem] text-[#888] mb-5">
        Gini Coefficient: <span className="text-[#8B5CF6] font-bold text-sm">{giniCoeff.toFixed(3)}</span>
        <span className="ml-2">
          {giniCoeff > 0.7 ? "— Highly concentrated" : giniCoeff > 0.4 ? "— Moderately concentrated" : "— Distributed"}
        </span>
      </p>
      <Plot
        data={[
          {
            type: "scatter" as const,
            mode: "lines" as const,
            name: "Perfect Equality",
            x: [0, 1],
            y: [0, 1],
            line: { color: "#555", width: 2, dash: "dash" as const },
          },
          {
            type: "scatter" as const,
            mode: "lines" as const,
            name: "Lorenz Curve",
            x: lorenzX,
            y: lorenzY,
            fill: "tonexty" as const,
            fillcolor: PALETTE.dominance.lorenzFill,
            line: { color: PALETTE.dominance.lorenz, width: 3, shape: "spline" as const },
          },
        ]}
        layout={{
          ...DARK_LAYOUT,
          height: 400,
          xaxis: {
            ...DARK_LAYOUT.xaxis,
            title: { text: "Cumulative Share of Artists", font: { color: "#aaa", size: 12 } },
            range: [0, 1],
            tickformat: ".0%",
            dtick: 0.2,
            tickfont: { color: "#aaa", size: 11 },
            type: "linear" as const,
          },
          yaxis: {
            ...DARK_LAYOUT.yaxis,
            title: { text: "Cumulative Share of Appearances", font: { color: "#aaa", size: 12 } },
            range: [0, 1],
            tickformat: ".0%",
            dtick: 0.2,
            tickfont: { color: "#aaa", size: 11 },
            type: "linear" as const,
          },
          legend: {
            font: { color: "#ccc", size: 12 },
            bgcolor: "rgba(0,0,0,0.3)",
            x: 0.05,
            y: 0.95,
          },
          margin: { l: 65, r: 25, t: 15, b: 55 },
          annotations: [
            {
              x: 0.35,
              y: 0.15,
              text: `Gini = ${giniCoeff.toFixed(3)}`,
              showarrow: false,
              font: { color: PALETTE.dominance.lorenz, size: 16, family: "Inter" },
              bgcolor: "rgba(0,0,0,0.5)",
              borderpad: 6,
            },
          ],
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  );
}
