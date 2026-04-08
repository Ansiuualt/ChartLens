"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ5 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { AlbumScatter } from "@/components/charts/album-scatter";
import { AlbumBinBox } from "@/components/charts/album-bin-box";
import { AlbumTypeBar } from "@/components/charts/album-type-bar";

export default function AlbumStructurePage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ5(filters);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <PageHeader
        title="Album Structure"
        subtitle="Analyzing the relationship between album size, type, and chart longevity."
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
            <AlbumScatter tracks={data.tracks} pearsonR={data.pearson_r} />
            <AlbumTypeBar data={data.type_stats} />
          </div>

          <div className="w-full">
            <AlbumBinBox data={data.bin_stats} />
          </div>

          <InsightBox>
            💿 Is longer always better? The Pearson correlation coefficient of <strong>{data.pearson_r.toFixed(3)}</strong> 
            indicates a 
            {Math.abs(data.pearson_r) < 0.2 
              ? " weak " 
              : Math.abs(data.pearson_r) < 0.5 
              ? " moderate " 
              : " strong "} 
            relationship between album size and days on chart. Interestingly, 
            <strong>{data.type_stats[0]?.album_type}</strong> projects currently maintain a median of 
            <strong>{data.type_stats[0]?.median_days}</strong> days on the charts.
          </InsightBox>
        </>
      )}
    </div>
  );
}
