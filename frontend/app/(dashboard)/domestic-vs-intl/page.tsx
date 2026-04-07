"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ2 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { InsightBox } from "@/components/insight-box";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NationalityBars } from "@/components/charts/nationality-bars";
import { NationalityArea } from "@/components/charts/nationality-area";

export default function DomesticVsIntlPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ2(filters);

  if (isLoading || !data) return <LoadingSpinner />;
  if (data.error) return <div className="text-red-400 py-8">{data.error}</div>;

  const ukStat = data.nat_stats.find((n) => n.nationality === "UK");
  const intlStat = data.nat_stats.find((n) => n.nationality === "International");

  return (
    <div>
      <PageHeader
        title="Domestic vs International"
        subtitle="How do UK artists stack up against the global competition?"
      />

      <NationalityBars natStats={data.nat_stats} />

      <div className="mt-6 bg-[#191414] rounded-xl border border-white/5 p-2">
        <NationalityArea weeklyTs={data.weekly_ts} />
      </div>

      {ukStat && intlStat && (
        <InsightBox>
          🇬🇧 UK artists have a median of <strong>{ukStat.median_days.toFixed(0)}</strong> days on
          chart vs <strong>{intlStat.median_days.toFixed(0)}</strong> for international acts — a{" "}
          <strong>{Math.abs(ukStat.median_days - intlStat.median_days).toFixed(0)}-day</strong>{" "}
          {ukStat.median_days > intlStat.median_days ? "advantage" : "deficit"}.{" "}
          {ukStat.median_days > intlStat.median_days
            ? "Home turf advantage pays off!"
            : "International artists dominate in longevity."}
        </InsightBox>
      )}
    </div>
  );
}
