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
            US Spotify Top 50 · Playlist Performance Analytics
          </p>
        </div>
      </div>

      <PageHeader
        title="Dashboard Overview"
        subtitle="Key performance indicators for the US Spotify Top 50 Playlist"
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-8">{data.error}</div>
      ) : (
        <>
          {/* Row 1 — 3 KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <KpiCard value={`${data.days_on_chart_median.toFixed(0)}`} label="Median Days on Chart" accent="cyan" />
            <KpiCard value={`#${data.avg_rank.toFixed(1)}`} label="Average Rank" accent="default" />
            <KpiCard value={data.rank_volatility_index.toFixed(2)} label="Rank Volatility Index" accent="coral" className="sm:col-span-2 lg:col-span-1" />
          </div>

          {/* Row 2 — 3 KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <KpiCard
              value={data.popularity_score.toFixed(1)}
              label="Popularity Score Trend"
              accent="gold"
            />
            <KpiCard
              value={data.artist_dominance_index.toFixed(3)}
              label="Artist Dominance Index (Gini)"
              accent="purple"
            />
            <KpiCard
              value={`${data.explicit_share_pct.toFixed(1)}%`}
              label="Explicit Content Share"
              accent="pink"
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>

          {/* Row 3 — Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <KpiCard value={data.unique_songs.toLocaleString()} label="Unique Songs Charted" accent="cyan" />
            <KpiCard value={data.unique_artists.toLocaleString()} label="Unique Artists" accent="gold" />
            <KpiCard
              value={data.top_artist_name}
              label={`Most Dominant — ${data.top_artist_appearances} appearances`}
              accent="default"
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>

          {/* Insight */}
          <InsightBox>
            🇺🇸 <strong>{data.unique_songs.toLocaleString()}</strong> unique songs from{" "}
            <strong>{data.unique_artists.toLocaleString()}</strong> artists charted on the US Spotify Top 50.
            The market shows a Gini coefficient of{" "}
            <strong>{data.artist_dominance_index.toFixed(3)}</strong>, indicating{" "}
            {data.artist_dominance_index > 0.7
              ? "highly concentrated"
              : data.artist_dominance_index > 0.4
              ? "moderately concentrated"
              : "relatively distributed"}{" "}
            artist dominance, led by <strong>{data.top_artist_name}</strong>.
            Explicit content accounts for <strong>{data.explicit_share_pct.toFixed(1)}%</strong> of all chart entries.
          </InsightBox>
        </>
      )}
    </div>
  );
}
