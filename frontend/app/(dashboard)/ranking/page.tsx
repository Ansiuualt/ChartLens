"use client";

import { useFilters } from "@/hooks/use-filters";
import { useRanking } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { RankingLines } from "@/components/charts/ranking-lines";

export default function RankingPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useRanking(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Song Ranking Trends"
        subtitle="Track rank trajectories over time for selected songs on the US Top 50."
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-12 bg-white/5 rounded-2xl border border-white/10">
          {data.error}
        </div>
      ) : (
        <>
          <RankingLines trends={data.trends} />

          {data.trends.length > 0 && (
            <InsightBox>
              📉 Showing rank trajectories for the top songs by chart longevity.
              Use the <strong>Song</strong> filter in the sidebar to select specific songs and compare their ranking journeys.
              A line moving downward (toward #1) indicates improving chart position.
            </InsightBox>
          )}
        </>
      )}
    </div>
  );
}
