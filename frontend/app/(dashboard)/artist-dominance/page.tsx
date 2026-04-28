"use client";

import { useFilters } from "@/hooks/use-filters";
import { useDominance } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { DominanceBar } from "@/components/charts/dominance-bar";
import { DominanceGini } from "@/components/charts/dominance-gini";

export default function ArtistDominancePage() {
  const { filters } = useFilters();
  const { data, isLoading } = useDominance(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Artist Dominance"
        subtitle="Measuring market concentration and the leaderboard of US Top 50 chart dominance."
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-12 bg-white/5 rounded-2xl border border-white/10">
          {data.error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DominanceGini
              lorenzX={data.lorenz_x}
              lorenzY={data.lorenz_y}
              giniCoeff={data.gini_coeff}
            />
            <DominanceBar artists={data.artists} />
          </div>

          <InsightBox>
            🏁 The Gini Coefficient of <strong>{data.gini_coeff.toFixed(3)}</strong> suggests a 
            {data.gini_coeff > 0.7 
              ? " highly concentrated " 
              : data.gini_coeff > 0.4 
              ? " moderately concentrated " 
              : " relatively distributed "} 
            market. The top artist, <strong>{data.artists[0]?.artist}</strong>, commands{" "}
            <strong>{data.artists[0]?.dominance_share_pct.toFixed(1)}%</strong> of all chart appearances
            with <strong>{data.artists[0]?.unique_songs}</strong> unique songs
            and an average rank of <strong>#{data.artists[0]?.avg_rank.toFixed(1)}</strong>.
          </InsightBox>
        </>
      )}
    </div>
  );
}
