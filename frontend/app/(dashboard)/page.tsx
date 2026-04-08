"use client";

import { useFilters } from "@/hooks/use-filters";
import { useOverview } from "@/hooks/use-chart-data";
import { KpiCard } from "@/components/kpi-card";
import { InsightBox } from "@/components/insight-box";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function OverviewPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useOverview(filters);

  return (
    <div>
      {/* Shader Hero */}
      <div className="relative h-[280px] rounded-2xl overflow-hidden mb-8 border border-white/10">
        <ShaderAnimation />
        <div className="absolute inset-0 flex items-center justify-center flex-col z-10 bg-black/30">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            Chart<span className="text-[#1DB954]">Lens</span>
          </h1>
          <p className="text-sm text-white/70 mt-2 font-light tracking-wide">
            UK Spotify Top 50 · Data Analytics Dashboard
          </p>
        </div>
      </div>

      <PageHeader
        title="Dashboard Overview"
        subtitle="Key performance indicators for the UK Spotify Top 50"
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-8">{data.error}</div>
      ) : (
        <>
          {/* Row 1 — 3 KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <KpiCard value={data.unique_songs.toLocaleString()} label="Unique Songs Charted" />
            <KpiCard value={data.unique_artists.toLocaleString()} label="Unique Artists" />
            <KpiCard value={data.gini_coeff.toFixed(3)} label="Gini Coefficient" />
          </div>

          {/* Row 2 — 3 KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <KpiCard
              value={`${data.uk_share_pct.toFixed(1)}% / ${data.intl_share_pct.toFixed(1)}%`}
              label="UK / International Split"
            />
            <KpiCard
              value={data.top_artist_name}
              label={`Most Dominant — ${data.top_artist_share.toFixed(2)}% share`}
            />
            <KpiCard
              value={`${data.date_start} — ${data.date_end}`}
              label="Date Range Covered"
            />
          </div>

          {/* Insight */}
          <InsightBox>
            📈 <strong>{data.unique_songs.toLocaleString()}</strong> unique songs from{" "}
            <strong>{data.unique_artists.toLocaleString()}</strong> artists charted in this period.
            The market is highly concentrated — a Gini of{" "}
            <strong>{data.gini_coeff.toFixed(3)}</strong> indicates significant dominance by top
            artists, led by <strong>{data.top_artist_name}</strong> with{" "}
            <strong>{data.top_artist_share.toFixed(2)}%</strong> of all chart score.
          </InsightBox>
        </>
      )}
    </div>
  );
}
