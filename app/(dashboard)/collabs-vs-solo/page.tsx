"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ3 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { InsightBox } from "@/components/insight-box";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatCard, StatRow } from "@/components/stat-card";
import { CollabBoxes } from "@/components/charts/collab-boxes";
import { CollabScatter } from "@/components/charts/collab-scatter";

export default function CollabsVsSoloPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ3(filters);

  if (isLoading || !data) return <LoadingSpinner />;
  if (data.error) return <div className="text-red-400 py-8">{data.error}</div>;

  const solo = data.collab_stats.find((s) => s.type === "Solo");
  const collab = data.collab_stats.find((s) => s.type === "Collaboration");

  return (
    <div>
      <PageHeader
        title="Collaborations vs Solo"
        subtitle="Does teaming up pay off on the charts?"
      />

      {solo && collab && (
        <StatRow>
          <StatCard value={solo.n_tracks.toString()} label="Solo Tracks" />
          <StatCard value={collab.n_tracks.toString()} label="Collab Tracks" />
          <StatCard value={solo.median_days.toFixed(0)} label="Solo Median Days" />
          <StatCard value={collab.median_days.toFixed(0)} label="Collab Median Days" />
          <StatCard value={solo.median_velocity.toFixed(2)} label="Solo Median Velocity" />
          <StatCard value={collab.median_velocity.toFixed(2)} label="Collab Median Velocity" />
        </StatRow>
      )}

      <CollabBoxes tracks={data.tracks} />

      <div className="mt-6 bg-[#191414] rounded-xl border border-white/5 p-2">
        <CollabScatter tracks={data.tracks} />
      </div>

      {solo && collab && (
        <InsightBox>
          🤝 Solo tracks have a median chart velocity of{" "}
          <strong>{solo.median_velocity.toFixed(2)}</strong> vs collaborations at{" "}
          <strong>{collab.median_velocity.toFixed(2)}</strong>. Both groups share similar median
          days on chart ({solo.median_days.toFixed(0)} vs {collab.median_days.toFixed(0)}),
          suggesting collaborations don&apos;t significantly extend chart life.
        </InsightBox>
      )}
    </div>
  );
}
