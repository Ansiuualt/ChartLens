// ── API response types (US Market) ──────────────────────────────────────

export interface MetaData {
  date_min: string;
  date_max: string;
  album_types: string[];
  total_rows: number;
  unique_songs: number;
  unique_artists: number;
  artists: string[];
  songs: string[];
}

export interface OverviewData {
  days_on_chart_median: number;
  avg_rank: number;
  rank_volatility_index: number;
  popularity_score: number;
  artist_dominance_index: number;
  explicit_share_pct: number;
  unique_songs: number;
  unique_artists: number;
  top_artist_name: string;
  top_artist_appearances: number;
  date_start: string;
  date_end: string;
  error?: string;
}

// ── Timeline Explorer ───────────────────────────────────────────────────

export interface DailyPosition {
  date: string;
  song: string;
  artist: string;
  position: number;
  popularity: number;
}

export interface SongSpan {
  song: string;
  artist: string;
  first_date: string;
  last_date: string;
  days_on_chart: number;
  best_position: number;
  avg_popularity: number;
}

export interface DailyCount {
  date: string;
  unique_songs: number;
}

export interface TimelineData {
  daily_positions: DailyPosition[];
  song_spans: SongSpan[];
  daily_counts: DailyCount[];
  error?: string;
}

// ── Ranking Trends ──────────────────────────────────────────────────────

export interface RankingEntry {
  date: string;
  song: string;
  artist: string;
  position: number;
  popularity: number;
}

export interface RankingData {
  trends: RankingEntry[];
  available_songs: string[];
  error?: string;
}

// ── Artist Dominance ────────────────────────────────────────────────────

export interface ArtistRecord {
  artist: string;
  total_appearances: number;
  avg_rank: number;
  best_rank: number;
  avg_popularity: number;
  unique_songs: number;
  dominance_share_pct: number;
}

export interface DominanceData {
  artists: ArtistRecord[];
  all_artists: ArtistRecord[];
  gini_coeff: number;
  lorenz_x: number[];
  lorenz_y: number[];
  error?: string;
}

// ── Popularity vs Rank ──────────────────────────────────────────────────

export interface PopularityTrack {
  song: string;
  artist: string;
  avg_position: number;
  avg_popularity: number;
  days_on_chart: number;
  is_explicit: boolean;
  album_type: string;
  duration_min: number;
  rank_volatility: number;
  best_rank: number;
  album_cover_url: string;
}

export interface PopularityData {
  tracks: PopularityTrack[];
  correlation: number;
  error?: string;
}

// ── Explicit Analysis ───────────────────────────────────────────────────

export interface ExplicitStat {
  is_explicit: boolean;
  n_tracks: number;
  avg_position: number;
  avg_popularity: number;
  median_days: number;
  mean_days: number;
  label: string;
  share_pct: number;
}

export interface ExplicitTrack {
  song: string;
  artist: string;
  days_on_chart: number;
  peak_position: number;
  avg_position: number;
  avg_popularity: number;
  is_explicit: boolean;
  label: string;
}

export interface ExplicitData {
  explicit_stats: ExplicitStat[];
  tracks: ExplicitTrack[];
  error?: string;
}

// ── Filter state ────────────────────────────────────────────────────────

export interface FilterState {
  dateStart: string;
  dateEnd: string;
  explicit: "All" | "Clean" | "Explicit";
  albumTypes: string[];
  artists: string[];
  songs: string[];
  rankMin: number;
  rankMax: number;
}
