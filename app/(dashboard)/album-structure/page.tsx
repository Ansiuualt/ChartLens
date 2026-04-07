"use client";

import { useState } from "react";
import { useFilters } from "@/hooks/use-filters";
import { useQ5 } from "@/hooks/use-chart-data";
import { PageHeader } from "@/components/page-header";
import { InsightBox } from "@/components/insight-box";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlbumScatter } from "@/components/charts/album-scatter";
import { AlbumBinBox } from "@/components/charts/album-bin-box";
import { AlbumTypeBar } from "@/components/charts/album-type-bar";

export default function AlbumStructurePage() {
  const { filters } = useFilters();
  const { data, isLoading } = useQ5(filters);
  const [showTable, setShowTable] = useState(false);

  if (isLoading || !data) return <LoadingSpinner />;
  if (data.error) return <div className="text-red-400 py-8">{data.error}</div>;

  const singleBin = data.bin_stats.find((b) => b.album_size_bin === "Single (1)");
  const megaBin = data.bin_stats.find((b) => b.album_size_bin === "Mega (21+)");
  const ratio =
    singleBin && megaBin && megaBin.median_days > 0
      ? (singleBin.median_days / megaBin.median_days).toFixed(1)
      : "N/A";

  return (
    <div>
      <PageHeader
        title="Album Structure vs Chart Duration"
        subtitle="Does album size affect how long a song stays on the chart?"
      />

      <div className="bg-[#191414] rounded-xl border border-white/5 p-2 mb-6">
        <AlbumScatter tracks={data.tracks} pearsonR={data.pearson_r} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-[#191414] rounded-xl border border-white/5 p-2">
          <AlbumBinBox tracks={data.tracks} />
        </div>
        <div className="bg-[#191414] rounded-xl border border-white/5 p-2">
          <AlbumTypeBar typeStats={data.type_stats} />
        </div>
      </div>

      {singleBin && megaBin && (
        <InsightBox>
          💿 Pearson r = <strong>{data.pearson_r.toFixed(3)}</strong> — a negative correlation.
          Singles (1 track) last a median of{" "}
          <strong>{singleBin.median_days.toFixed(1)}</strong> days, while mega-albums (21+ tracks)
          last only <strong>{megaBin.median_days.toFixed(1)}</strong> days — singles outlast them by{" "}
          <strong>{ratio}x</strong> on the UK chart.
        </InsightBox>
      )}

      {/* Data Table */}
      <div className="mt-6">
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-sm text-[#1DB954] hover:text-[#1ed760] font-medium transition-colors"
        >
          {showTable ? "▼" : "▶"} Tracks by Album Size
        </button>
        {showTable && (
          <div className="mt-3 rounded-xl border border-white/5 overflow-hidden max-h-[400px] overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Song</th>
                  <th>Artist</th>
                  <th>Album Type</th>
                  <th>Total Tracks</th>
                  <th>Days on Chart</th>
                  <th>Size Category</th>
                </tr>
              </thead>
              <tbody>
                {data.tracks
                  .sort((a, b) => b.days_on_chart - a.days_on_chart)
                  .slice(0, 100)
                  .map((t, i) => (
                    <tr key={`${t.song}-${i}`}>
                      <td>
                        {t.album_cover_url && (
                          <img
                            src={t.album_cover_url}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                      </td>
                      <td className="font-medium">{t.song}</td>
                      <td className="text-[#B3B3B3]">{t.artist}</td>
                      <td className="capitalize">{t.album_type}</td>
                      <td>{t.total_tracks}</td>
                      <td className="text-[#1DB954] font-semibold">{t.days_on_chart}</td>
                      <td className="text-xs text-[#B3B3B3]">{t.album_size_bin}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
