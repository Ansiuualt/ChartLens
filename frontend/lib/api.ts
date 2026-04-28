const API_BASE = "";

import type { FilterState } from "./types";

function buildParams(filters?: FilterState): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.dateStart) params.set("date_start", filters.dateStart);
  if (filters.dateEnd) params.set("date_end", filters.dateEnd);
  if (filters.explicit !== "All") params.set("explicit", filters.explicit);
  if (filters.albumTypes.length > 0) params.set("album_types", filters.albumTypes.join(","));
  if (filters.artists.length > 0) params.set("artists", filters.artists.join("|"));
  if (filters.songs.length > 0) params.set("songs", filters.songs.join("|"));
  if (filters.rankMin > 1) params.set("rank_min", String(filters.rankMin));
  if (filters.rankMax < 50) params.set("rank_max", String(filters.rankMax));
  return "?" + params.toString();
}

async function fetchJson<T>(path: string, filters?: FilterState): Promise<T> {
  const url = `${API_BASE}${path}${buildParams(filters)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  meta: () => fetchJson<import("./types").MetaData>("/api/meta"),
  overview: (f?: FilterState) => fetchJson<import("./types").OverviewData>("/api/overview", f),
  timeline: (f?: FilterState) => fetchJson<import("./types").TimelineData>("/api/timeline", f),
  ranking: (f?: FilterState) => fetchJson<import("./types").RankingData>("/api/ranking", f),
  dominance: (f?: FilterState) => fetchJson<import("./types").DominanceData>("/api/dominance", f),
  popularity: (f?: FilterState) => fetchJson<import("./types").PopularityData>("/api/popularity", f),
  explicit: (f?: FilterState) => fetchJson<import("./types").ExplicitData>("/api/explicit", f),
};
