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

export function useQ1(filters: FilterState) {
  return useSWR(filterKey("q1", filters), () => api.q1(filters));
}

export function useQ2(filters: FilterState) {
  return useSWR(filterKey("q2", filters), () => api.q2(filters));
}

export function useQ3(filters: FilterState) {
  return useSWR(filterKey("q3", filters), () => api.q3(filters));
}

export function useQ4(filters: FilterState) {
  return useSWR(filterKey("q4", filters), () => api.q4(filters));
}

export function useQ5(filters: FilterState) {
  return useSWR(filterKey("q5", filters), () => api.q5(filters));
}
