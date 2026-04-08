"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ2 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { NationalityBars } from "@/components/charts/nationality-bars";
import { NationalityArea } from "@/components/charts/nationality-area";

export default function DomesticVsIntlPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ2(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Domestic vs International"
        subtitle="Comparing the performance of UK-based artists against international competition."
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
            <NationalityBars 
              entryCounts={data.entry_counts} 
              natStats={data.nat_stats} 
            />
            <NationalityArea data={data.weekly_ts} />
          </div>

          <InsightBox>
            🌍 The dataset reveals clear trends in market share between domestic (UK) and international talent. 
            Currently, <strong>{data.entry_counts.find((d: any) => d.nationality === "UK")?.share_pct.toFixed(1)}%</strong> of 
            the chart entries are from UK artists, trending 
            {data.nat_stats.find((d: any) => d.nationality === "UK")?.avg_rank_score > 
             data.nat_stats.find((d: any) => d.nationality === "International")?.avg_rank_score 
             ? " stronger " : " lower "} 
            on average compared to international entries.
          </InsightBox>
        </>
      )}
    </div>
  );
}
