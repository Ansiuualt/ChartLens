"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ4 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { InsightBox } from "@/components/insight-box";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatCard, StatRow } from "@/components/stat-card";
import { ExplicitViolins } from "@/components/charts/explicit-violins";
import { ExplicitDonut } from "@/components/charts/explicit-donut";

export default function ExplicitAnalysisPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ4(filters);

  if (isLoading || !data) return <LoadingSpinner />;
  if (data.error) return <div className="text-red-400 py-8">{data.error}</div>;

  const expStat = data.explicit_stats.find((s) => s.label === "Explicit");
  const clnStat = data.explicit_stats.find((s) => s.label === "Clean");

  const pctFaster =
    clnStat && expStat && clnStat.median_days > 0
      ? ((1 - expStat.median_days / clnStat.median_days) * 100).toFixed(0)
      : "0";

  return (
    <div>
      <PageHeader
        title="Explicit Content Analysis"
        subtitle="Does explicit content help or hurt chart performance?"
      />

      <ExplicitViolins tracks={data.tracks} />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-[#191414] rounded-xl border border-white/5 p-2">
          <ExplicitDonut stats={data.explicit_stats} />
        </div>
        <div className="flex flex-col gap-4 justify-center">
          {expStat && clnStat && (
            <>
              <StatRow>
                <StatCard value={expStat.avg_position.toFixed(1)} label="Explicit Avg Pos" />
                <StatCard value={clnStat.avg_position.toFixed(1)} label="Clean Avg Pos" />
              </StatRow>
              <StatRow>
                <StatCard value={`${expStat.median_days.toFixed(0)}d`} label="Explicit Median Days" />
                <StatCard value={`${clnStat.median_days.toFixed(0)}d`} label="Clean Median Days" />
              </StatRow>
            </>
          )}
        </div>
      </div>

      {expStat && clnStat && (
        <InsightBox>
          🔞 Explicit tracks rank better on average (position{" "}
          <strong>{expStat.avg_position.toFixed(1)}</strong> vs{" "}
          <strong>{clnStat.avg_position.toFixed(1)}</strong>) but fade{" "}
          <strong>{Math.abs(Number(pctFaster))}% faster</strong> — lasting only{" "}
          <strong>{expStat.median_days.toFixed(0)}</strong> median days compared to{" "}
          <strong>{clnStat.median_days.toFixed(0)}</strong> for clean tracks.
        </InsightBox>
      )}
    </div>
  );
}
