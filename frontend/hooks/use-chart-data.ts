"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import type { FilterState } from "@/lib/types";

function filterKey(prefix: string, filters: FilterState) {
  return `${prefix}:${JSON.stringify(filters)}`;
}

export function useOverview(filters: FilterState) {
  return useSWR(filterKey("overview", filters), () => api.overview(filters));
}

export function useTimeline(filters: FilterState) {
  return useSWR(filterKey("timeline", filters), () => api.timeline(filters));
}

export function useRanking(filters: FilterState) {
  return useSWR(filterKey("ranking", filters), () => api.ranking(filters));
}

export function useDominance(filters: FilterState) {
  return useSWR(filterKey("dominance", filters), () => api.dominance(filters));
}

export function usePopularity(filters: FilterState) {
  return useSWR(filterKey("popularity", filters), () => api.popularity(filters));
}

export function useExplicit(filters: FilterState) {
  return useSWR(filterKey("explicit", filters), () => api.explicit(filters));
}
