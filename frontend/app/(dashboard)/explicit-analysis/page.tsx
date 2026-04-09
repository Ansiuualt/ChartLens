"use client";

import { useFilters } from "@/hooks/use-filters";
import { useQ4 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { ExplicitViolins } from "@/components/charts/explicit-violins";
import { ExplicitDonut } from "@/components/charts/explicit-donut";

export default function ExplicitAnalysisPage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ4(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Explicit Content Analysis"
        subtitle="Analyzing the prevalence and performance of explicit tracks in the UK charts."
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
            <ExplicitViolins tracks={data.tracks} />
            <div className="flex flex-col gap-6">
               <ExplicitDonut stats={data.explicit_stats} />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-[#B3B3B3] uppercase tracking-wider mb-1">Clean Avg Days</p>
                    <p className="text-2xl font-bold text-white">
                      {data.explicit_stats.find((s: any) => s.is_explicit === false)?.mean_days.toFixed(1)}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-[#B3B3B3] uppercase tracking-wider mb-1">Explicit Avg Days</p>
                    <p className="text-2xl font-bold text-[#1DB954]">
                      {data.explicit_stats.find((s: any) => s.is_explicit === true)?.mean_days.toFixed(1)}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <InsightBox>
            🔞 Explicit content makes up <strong>{data.explicit_stats.find((s: any) => s.is_explicit === true)?.share_pct.toFixed(1)}%</strong> of the chart entries. 
            On average, explicit tracks stay on the chart for 
            <strong>{data.explicit_stats.find((s: any) => s.is_explicit === true)?.mean_days.toFixed(1)}</strong> days, 
            compared to <strong>{data.explicit_stats.find((s: any) => s.is_explicit === false)?.mean_days.toFixed(1)}</strong> days for clean tracks.
          </InsightBox>
        </>
      )}
    </div>
  );
}
