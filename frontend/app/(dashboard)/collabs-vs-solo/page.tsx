"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ3 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { StatCard } from "@/components/stat-card";
import { CollabBoxes } from "@/components/charts/collab-boxes";
import { CollabScatter } from "@/components/charts/collab-scatter";

export default function CollabsVsSoloPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ3(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Collabs vs Solo"
        subtitle="Exploring whether collaborations lead to higher chart velocity and longevity."
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-12 bg-white/5 rounded-2xl border border-white/10">
          {data.error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Solo Avg Retention"
              value={`${data.collab_stats.find((s: any) => s.is_collaboration === false)?.avg_retention.toFixed(1)} days`}
              trend="neutral"
            />
            <StatCard
              label="Collab Avg Retention"
              value={`${data.collab_stats.find((s: any) => s.is_collaboration === true)?.avg_retention.toFixed(1)} days`}
              trend="up"
            />
            <StatCard
              label="Solo Peak Velocity"
              value={data.collab_stats.find((s: any) => s.is_collaboration === false)?.avg_velocity.toFixed(2)}
              trend="neutral"
            />
            <StatCard
              label="Collab Peak Velocity"
              value={data.collab_stats.find((s: any) => s.is_collaboration === true)?.avg_velocity.toFixed(2)}
              trend="up"
            />
          </div>

          <div className="space-y-8">
            <CollabBoxes tracks={data.tracks} />
            <CollabScatter tracks={data.tracks} />
          </div>

          <InsightBox>
            🤝 Collaborations often serve as "chart fuel". 
            The data suggests that tracks featuring multiple artists typically see a 
            <strong>{((data.collab_stats.find((s: any) => s.is_collaboration === true)?.avg_velocity / 
                data.collab_stats.find((s: any) => s.is_collaboration === false)?.avg_velocity - 1) * 100).toFixed(1)}%</strong> 
            higher chart velocity on average compared to solo efforts within the UK Top 50.
          </InsightBox>
        </>
      )}
    </div>
  );
}
