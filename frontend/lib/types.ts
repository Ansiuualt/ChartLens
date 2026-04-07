// ── API response types ──────────────────────────────────────────────────

export interface MetaData {
  date_min: string;
  date_max: string;
  album_types: string[];
  total_rows: number;
  unique_songs: number;
  unique_artists: number;
}

export interface OverviewData {
  unique_songs: number;
  unique_artists: number;
  gini_coeff: number;
  uk_share_pct: number;
  intl_share_pct: number;
  top_artist_name: string;
  top_artist_share: number;
  date_start: string;
  date_end: string;
  error?: string;
}

export interface ArtistRecord {
  artist: string;
  total_rank_score: number;
  monopoly_share_pct: number;
}

export interface Q1Data {
  gini_coeff: number;
  lorenz_x: number[];
  lorenz_y: number[];
  artists: ArtistRecord[];
  all_artists: ArtistRecord[];
  error?: string;
}

export interface EntryCount {
  nationality: string;
  count: number;
  share_pct: number;
}

export interface NatStat {
  nationality: string;
  avg_position: number;
  avg_popularity: number;
  median_days: number;
  mean_days: number;
  track_count: number;
}

export interface WeeklyEntry {
  week: string;
  nationality: string;
  entries: number;
}

export interface Q2Data {
  entry_counts: EntryCount[];
  nat_stats: NatStat[];
  weekly_ts: WeeklyEntry[];
  error?: string;
}

export interface CollabStat {
  is_collaboration: boolean;
  n_tracks: number;
  median_days: number;
  mean_days: number;
  median_velocity: number;
  mean_velocity: number;
  avg_popularity: number;
  median_popularity: number;
  type: string;
}

export interface CollabTrack {
  song: string;
  artist: string;
  days_on_chart: number;
  peak_position: number;
  avg_position: number;
  avg_popularity: number;
  chart_velocity: number;
  is_collaboration: boolean;
  type: string;
}

export interface Q3Data {
  collab_stats: CollabStat[];
  tracks: CollabTrack[];
  error?: string;
}

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

export interface Q4Data {
  explicit_stats: ExplicitStat[];
  tracks: ExplicitTrack[];
  error?: string;
}

export interface BinStat {
  album_size_bin: string;
  median_days: number;
  mean_days: number;
  n_tracks: number;
}

export interface TypeStat {
  album_type: string;
  median_days: number;
  mean_days: number;
  n_tracks: number;
}

export interface AlbumTrack {
  song: string;
  artist: string;
  days_on_chart: number;
  total_tracks: number;
  album_type: string;
  album_size_bin: string;
  peak_position: number;
  album_cover_url: string;
}

export interface Q5Data {
  pearson_r: number;
  bin_stats: BinStat[];
  type_stats: TypeStat[];
  tracks: AlbumTrack[];
  error?: string;
}

// ── Filter state ────────────────────────────────────────────────────────

export interface FilterState {
  dateStart: string;
  dateEnd: string;
  nationality: "Both" | "UK" | "International";
  explicit: "All" | "Clean" | "Explicit";
  albumTypes: string[];
}
