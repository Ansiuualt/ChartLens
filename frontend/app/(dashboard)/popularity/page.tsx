"use client";

import { useFilters } from "@/hooks/use-filters";
import { usePopularity } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { PopularityScatter } from "@/components/charts/popularity-scatter";
import { KpiCard } from "@/components/kpi-card";

export default function PopularityPage() {
  const { filters } = useFilters();
  const { data, isLoading } = usePopularity(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Popularity vs Rank Scatter"
        subtitle="Correlating Spotify popularity scores with chart positions on the US Top 50."
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-12 bg-white/5 rounded-2xl border border-white/10">
          {data.error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              value={data.correlation.toFixed(3)}
              label="Correlation (Pearson r)"
            />
            <KpiCard
              value={data.tracks.length.toLocaleString()}
              label="Unique Tracks"
            />
            <KpiCard
              value={`${data.tracks.filter((t) => t.is_explicit).length}`}
              label="Explicit Tracks"
            />
          </div>

          <PopularityScatter tracks={data.tracks} correlation={data.correlation} />

          <InsightBox>
            🔬 The correlation between chart position and Spotify popularity score is{" "}
            <strong>{data.correlation.toFixed(3)}</strong>, indicating a{" "}
            {Math.abs(data.correlation) > 0.5
              ? "strong"
              : Math.abs(data.correlation) > 0.25
              ? "moderate"
              : "weak"}{" "}
            relationship. Higher popularity scores{" "}
            {data.correlation < 0 ? "tend to correlate with better (lower) chart positions" : "don't strongly predict chart position"}.
            Bubble size represents days on chart — larger bubbles indicate longer-charting tracks.
          </InsightBox>
        </>
      )}
    </div>
  );
}
