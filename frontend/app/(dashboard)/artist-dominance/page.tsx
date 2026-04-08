"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ1 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { LorenzCurve } from "@/components/charts/lorenz-curve";
import { TopArtistsBar } from "@/components/charts/top-artists-bar";

export default function ArtistDominancePage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ1(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Artist Dominance"
        subtitle="Measuring market concentration and the Lorenz curve of chart performance."
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
            <LorenzCurve
              lorenzX={data.lorenz_x}
              lorenzY={data.lorenz_y}
              giniCoeff={data.gini_coeff}
            />
            <TopArtistsBar artists={data.artists} />
          </div>

          <InsightBox>
            🏁 The Gini Coefficient of <strong>{data.gini_coeff.toFixed(3)}</strong> suggests a 
            {data.gini_coeff > 0.7 
              ? " highly concentrated " 
              : data.gini_coeff > 0.4 
              ? " moderately concentrated " 
              : " relatively distributed "} 
            market. The visualization highlights how a small percentage of top artists (like <strong>{data.artists[0]?.artist}</strong>) 
            account for a disproportionate share of total chart impact in the UK Top 50.
          </InsightBox>
        </>
      )}
    </div>
  );
}
