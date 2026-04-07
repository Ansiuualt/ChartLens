"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ1 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { InsightBox } from "@/components/insight-box";
import { LoadingSpinner } from "@/components/loading-spinner";
import { LorenzCurve } from "@/components/charts/lorenz-curve";
import { TopArtistsBar } from "@/components/charts/top-artists-bar";
import { useState } from "react";

export default function ArtistDominancePage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ1(filters);
  const [showTable, setShowTable] = useState(false);

  if (isLoading || !data) return <LoadingSpinner />;
  if (data.error) return <div className="text-red-400 py-8">{data.error}</div>;

  const topArtist = data.artists[0];

  return (
    <div>
      <PageHeader
        title="Artist Dominance"
        subtitle="Who controls the UK Spotify Top 50?"
      />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#191414] rounded-xl border border-white/5 p-2">
          <LorenzCurve
            lorenzX={data.lorenz_x}
            lorenzY={data.lorenz_y}
            giniCoeff={data.gini_coeff}
          />
        </div>
        <div className="bg-[#191414] rounded-xl border border-white/5 p-2">
          <TopArtistsBar artists={data.artists} />
        </div>
      </div>

      <InsightBox>
        🏆 The Gini coefficient is <strong>{data.gini_coeff.toFixed(3)}</strong>, indicating a
        highly unequal distribution. <strong>{topArtist.artist}</strong> alone holds{" "}
        <strong>{topArtist.monopoly_share_pct.toFixed(2)}%</strong> of all chart score — the
        definition of chart dominance.
      </InsightBox>

      {/* Data Table */}
      <div className="mt-6">
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-sm text-[#1DB954] hover:text-[#1ed760] font-medium transition-colors"
        >
          {showTable ? "▼" : "▶"} Full Artist Rankings Table
        </button>
        {showTable && (
          <div className="mt-3 rounded-xl border border-white/5 overflow-hidden max-h-[400px] overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Artist</th>
                  <th>Total Rank Score</th>
                  <th>Chart Share (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.all_artists.map((a, i) => (
                  <tr key={a.artist}>
                    <td className="text-[#666]">{i + 1}</td>
                    <td className="font-medium">{a.artist}</td>
                    <td>{a.total_rank_score.toLocaleString()}</td>
                    <td className="text-[#1DB954]">{a.monopoly_share_pct.toFixed(3)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
