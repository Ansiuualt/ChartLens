"use client";

import Plot, { DARK_LAYOUT, COLORS } from "./plot-wrapper";

interface Props {
  lorenzX: number[];
  lorenzY: number[];
  giniCoeff: number;
}

export function LorenzCurve({ lorenzX, lorenzY, giniCoeff }: Props) {
  return (
    <Plot
      data={[
        {
          x: [0, 1],
          y: [0, 1],
          mode: "lines",
          line: { dash: "dash", color: COLORS.neutral, width: 1.5 },
          name: "Perfect Equality",
          hoverinfo: "skip",
        },
        {
          x: lorenzX,
          y: lorenzY,
          mode: "lines",
          fill: "tozeroy",
          line: { color: COLORS.primary, width: 2.5 },
          fillcolor: "rgba(29, 185, 84, 0.18)",
          name: `Lorenz Curve (Gini = ${giniCoeff.toFixed(3)})`,
          hovertemplate: "Artists: %{x:.0%}<br>Score: %{y:.0%}<extra></extra>",
        },
      ]}
      layout={{
        ...DARK_LAYOUT,
        title: { text: `Lorenz Curve — Chart Score Distribution (Gini = ${giniCoeff.toFixed(3)})`, font: { size: 15 } },
        xaxis: { ...DARK_LAYOUT.xaxis, title: { text: "Cumulative Share of Artists" } },
        yaxis: { ...DARK_LAYOUT.yaxis, title: { text: "Cumulative Share of Chart Score" } },
        showlegend: true,
        legend: { x: 0.02, y: 0.98, bgcolor: "rgba(0,0,0,0)" },
      }}
      useResizeHandler
      style={{ width: "100%", height: "400px" }}
      config={{ displayModeBar: false }}
    />
  );
}
