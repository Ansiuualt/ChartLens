"use client";

import type { ExplicitStat } from "@/lib/types";
import { useFilters } from "@/hooks/use-filters";
import { useExplicit } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { ExplicitSplit } from "@/components/charts/explicit-split";
import { ExplicitDonut } from "@/components/charts/explicit-donut";

export default function ExplicitAnalysisPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useExplicit(filters);

  const getClean = (stats: ExplicitStat[]) => stats.find((s) => !s.is_explicit);
  const getExplicit = (stats: ExplicitStat[]) => stats.find((s) => s.is_explicit);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Explicit Content Analysis"
        subtitle="Comparative performance of explicit vs clean content on the US charts."
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-12 bg-white/5 rounded-2xl border border-white/10">
          {data.error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExplicitSplit stats={data.explicit_stats} />
            <div className="flex flex-col gap-6">
              <ExplicitDonut stats={data.explicit_stats} />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[0.65rem] text-[#888] uppercase tracking-wider mb-1">Clean Avg Days</p>
                  <p className="text-2xl font-bold text-[#06B6D4]">
                    {getClean(data.explicit_stats)?.mean_days.toFixed(1) ?? "—"}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[0.65rem] text-[#888] uppercase tracking-wider mb-1">Explicit Avg Days</p>
                  <p className="text-2xl font-bold text-[#F97316]">
                    {getExplicit(data.explicit_stats)?.mean_days.toFixed(1) ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <InsightBox>
            🔞 Explicit content makes up <strong>{getExplicit(data.explicit_stats)?.share_pct.toFixed(1)}%</strong> of the US chart.
            Explicit tracks average <strong>{getExplicit(data.explicit_stats)?.mean_days.toFixed(1)}</strong> days
            vs <strong>{getClean(data.explicit_stats)?.mean_days.toFixed(1)}</strong> days for clean tracks.
          </InsightBox>
        </>
      )}
    </div>
  );
}
