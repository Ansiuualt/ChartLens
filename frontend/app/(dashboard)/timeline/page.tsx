"use client";

import { useFilters } from "@/hooks/use-filters";
import { useTimeline } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { InsightBox } from "@/components/insight-box";
import { TimelineHeatmap } from "@/components/charts/timeline-heatmap";

export default function TimelinePage() {
  const { filters } = useFilters();
  const { data, isLoading } = useTimeline(filters);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Playlist Timeline Explorer"
        subtitle="Visualize song entry, exit, and movement over the selected date range."
      />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : data.error ? (
        <div className="text-center text-red-400 py-12 bg-white/5 rounded-2xl border border-white/10">
          {data.error}
        </div>
      ) : (
        <>
          <TimelineHeatmap
            songSpans={data.song_spans}
            dailyCounts={data.daily_counts}
          />

          <InsightBox>
            🕐 The playlist has featured <strong>{data.song_spans.length}</strong> unique songs in this period.
            {data.song_spans.length > 0 && (
              <>
                {" "}The longest-charting song is <strong>{data.song_spans[0]?.song}</strong> by{" "}
                <strong>{data.song_spans[0]?.artist}</strong> with{" "}
                <strong>{data.song_spans[0]?.days_on_chart}</strong> days on the chart,
                peaking at position <strong>#{data.song_spans[0]?.best_position}</strong>.
              </>
            )}
          </InsightBox>
        </>
      )}
    </div>
  );
}
