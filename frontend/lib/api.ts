const API_BASE = "http://localhost:8000";

import type { FilterState } from "./types";

function buildParams(filters?: FilterState): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.dateStart) params.set("date_start", filters.dateStart);
  if (filters.dateEnd) params.set("date_end", filters.dateEnd);
  if (filters.nationality !== "Both") params.set("nationality", filters.nationality);
  if (filters.explicit !== "All") params.set("explicit", filters.explicit);
  if (filters.albumTypes.length > 0) params.set("album_types", filters.albumTypes.join(","));
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
  q1: (f?: FilterState) => fetchJson<import("./types").Q1Data>("/api/q1", f),
  q2: (f?: FilterState) => fetchJson<import("./types").Q2Data>("/api/q2", f),
  q3: (f?: FilterState) => fetchJson<import("./types").Q3Data>("/api/q3", f),
  q4: (f?: FilterState) => fetchJson<import("./types").Q4Data>("/api/q4", f),
  q5: (f?: FilterState) => fetchJson<import("./types").Q5Data>("/api/q5", f),
};
