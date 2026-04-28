"""
ChartLens — Metrics & Analysis Functions (US Market)
Implements analytics for the US Top 50 Playlist dashboard.
"""

import pandas as pd
import numpy as np


# ═══════════════════════════════════════════════════════════════════════════
# Helpers
# ═══════════════════════════════════════════════════════════════════════════

def gini(values: np.ndarray) -> float:
    """Compute the Gini coefficient using the Lorenz-curve method (pure numpy)."""
    v = np.sort(np.asarray(values, dtype=float))
    n = len(v)
    if n == 0 or v.sum() == 0:
        return 0.0
    index = np.arange(1, n + 1)
    return float((2 * np.sum(index * v) - (n + 1) * np.sum(v)) / (n * np.sum(v)))


def _track_level(df: pd.DataFrame) -> pd.DataFrame:
    """One row per unique track with aggregated metrics."""
    return (
        df.groupby(["song", "artist"])
        .agg(
            days_on_chart=("date", "nunique"),
            peak_position=("position", "min"),
            avg_position=("position", "mean"),
            avg_popularity=("popularity", "mean"),
            popularity_trend_avg=("popularity_trend", "mean"),
            is_explicit=("is_explicit", "first"),
            album_type=("album_type", "first"),
            total_tracks=("total_tracks", "first"),
            album_cover_url=("album_cover_url", "first"),
            rank_volatility=("rank_volatility", "first"),
            best_rank=("best_rank", "first"),
            duration_min=("duration_min", "first"),
        )
        .reset_index()
    )


# ═══════════════════════════════════════════════════════════════════════════
# KPI Aggregates
# ═══════════════════════════════════════════════════════════════════════════

def compute_kpis(df: pd.DataFrame) -> dict:
    """
    Compute high-level KPI metrics for the overview row.

    Returns dict with:
        days_on_chart_median, avg_rank, rank_volatility_index,
        popularity_score, artist_dominance_index, explicit_share_pct,
        unique_songs, unique_artists, top_artist_name, top_artist_appearances,
        date_start, date_end
    """
    tracks = _track_level(df)

    # Artist dominance = Gini of appearance counts
    artist_appearances = df.groupby("artist")["date"].nunique().values
    gini_coeff = gini(artist_appearances)

    # Explicit share
    total_entries = len(df)
    explicit_count = int(df["is_explicit"].sum())
    explicit_share = (explicit_count / total_entries * 100) if total_entries > 0 else 0

    # Top artist by total appearances
    artist_counts = df.groupby("artist")["date"].nunique().reset_index()
    artist_counts.columns = ["artist", "appearances"]
    artist_counts = artist_counts.sort_values("appearances", ascending=False)
    top_artist = artist_counts.iloc[0] if len(artist_counts) > 0 else None

    return {
        "days_on_chart_median": float(tracks["days_on_chart"].median()),
        "avg_rank": float(df["position"].mean()),
        "rank_volatility_index": float(tracks["rank_volatility"].mean()),
        "popularity_score": float(df["popularity_trend"].mean()),
        "artist_dominance_index": gini_coeff,
        "explicit_share_pct": explicit_share,
        "unique_songs": int(df["song"].nunique()),
        "unique_artists": int(df["artist"].nunique()),
        "top_artist_name": str(top_artist["artist"]) if top_artist is not None else "N/A",
        "top_artist_appearances": int(top_artist["appearances"]) if top_artist is not None else 0,
        "date_start": df["date"].min().strftime("%m/%d/%Y"),
        "date_end": df["date"].max().strftime("%m/%d/%Y"),
    }


# ═══════════════════════════════════════════════════════════════════════════
# Tab 1 — Timeline Explorer
# ═══════════════════════════════════════════════════════════════════════════

def timeline_explorer(df: pd.DataFrame) -> dict:
    """
    Song entry, exit, and movement over the selected date range.

    Returns:
        daily_positions — list of {date, song, artist, position, popularity}
        song_spans — list of {song, artist, first_date, last_date, days_on_chart}
        daily_counts — list of {date, unique_songs}
    """
    daily_positions = (
        df[["date", "song", "artist", "position", "popularity"]]
        .sort_values(["date", "position"])
        .copy()
    )

    # Song lifespans
    song_spans = (
        df.groupby(["song", "artist"])
        .agg(
            first_date=("date", "min"),
            last_date=("date", "max"),
            days_on_chart=("date", "nunique"),
            best_position=("position", "min"),
            avg_popularity=("popularity", "mean"),
        )
        .reset_index()
        .sort_values("days_on_chart", ascending=False)
    )

    # Daily unique song count
    daily_counts = (
        df.groupby("date")["song"]
        .nunique()
        .reset_index()
        .rename(columns={"song": "unique_songs"})
    )

    return {
        "daily_positions": daily_positions.head(5000).to_dict(orient="records"),
        "song_spans": song_spans.head(100).to_dict(orient="records"),
        "daily_counts": daily_counts.to_dict(orient="records"),
    }


# ═══════════════════════════════════════════════════════════════════════════
# Tab 2 — Song Ranking Trends
# ═══════════════════════════════════════════════════════════════════════════

def ranking_trends(df: pd.DataFrame, songs: list[str] | None = None) -> dict:
    """
    Rank trajectory for selected songs over time.

    Args:
        songs: list of song names to include (None = top 10 by days_on_chart)

    Returns:
        trends — list of {date, song, artist, position, popularity}
        available_songs — list of all song names
    """
    available_songs = sorted(df["song"].unique().tolist())

    if songs and len(songs) > 0:
        filtered = df[df["song"].isin(songs)]
    else:
        # Default: top 10 songs by days on chart
        top_songs = (
            df.groupby("song")["date"]
            .nunique()
            .reset_index()
            .rename(columns={"date": "days"})
            .sort_values("days", ascending=False)
            .head(10)["song"]
            .tolist()
        )
        filtered = df[df["song"].isin(top_songs)]

    trends = (
        filtered[["date", "song", "artist", "position", "popularity"]]
        .sort_values(["song", "date"])
        .copy()
    )

    return {
        "trends": trends.to_dict(orient="records"),
        "available_songs": available_songs,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Tab 3 — Artist Dominance Leaderboard
# ═══════════════════════════════════════════════════════════════════════════

def artist_dominance(df: pd.DataFrame) -> dict:
    """
    Ranked leaderboard of artists by total appearances and performance.

    Returns:
        artists — list of {artist, total_appearances, avg_rank, best_rank,
                           avg_popularity, unique_songs, dominance_share_pct}
        gini_coeff — float
        lorenz_x, lorenz_y — arrays for Lorenz curve plotting
    """
    artist_stats = (
        df.groupby("artist")
        .agg(
            total_appearances=("date", "nunique"),
            avg_rank=("position", "mean"),
            best_rank=("position", "min"),
            avg_popularity=("popularity", "mean"),
            unique_songs=("song", "nunique"),
        )
        .reset_index()
        .sort_values("total_appearances", ascending=False)
    )

    total = artist_stats["total_appearances"].sum()
    artist_stats["dominance_share_pct"] = artist_stats["total_appearances"] / total * 100

    # Gini & Lorenz
    sorted_vals = np.sort(artist_stats["total_appearances"].values.astype(float))
    gini_coeff = gini(sorted_vals)

    cum = np.cumsum(sorted_vals) / sorted_vals.sum()
    lorenz_x = np.linspace(0, 1, len(cum))
    lorenz_y = cum
    lorenz_x = np.insert(lorenz_x, 0, 0)
    lorenz_y = np.insert(lorenz_y, 0, 0)

    return {
        "artists": artist_stats.head(50).to_dict(orient="records"),
        "all_artists": artist_stats.to_dict(orient="records"),
        "gini_coeff": gini_coeff,
        "lorenz_x": lorenz_x.tolist(),
        "lorenz_y": lorenz_y.tolist(),
    }


# ═══════════════════════════════════════════════════════════════════════════
# Tab 4 — Popularity vs Rank Scatter
# ═══════════════════════════════════════════════════════════════════════════

def popularity_vs_rank(df: pd.DataFrame) -> dict:
    """
    Scatter data correlating popularity scores with chart positions.

    Returns:
        tracks — list of {song, artist, avg_position, avg_popularity,
                          days_on_chart, is_explicit, album_type, duration_min}
        correlation — Pearson r between avg_position and avg_popularity
    """
    tracks = _track_level(df)

    valid = tracks.dropna(subset=["avg_position", "avg_popularity"])
    corr = float(valid["avg_position"].corr(valid["avg_popularity"]))

    return {
        "tracks": tracks[
            ["song", "artist", "avg_position", "avg_popularity",
             "days_on_chart", "is_explicit", "album_type", "duration_min",
             "rank_volatility", "best_rank", "album_cover_url"]
        ].to_dict(orient="records"),
        "correlation": corr if not np.isnan(corr) else 0,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Tab 5 — Explicit vs Non-explicit Analysis
# ═══════════════════════════════════════════════════════════════════════════

def explicit_analysis(df: pd.DataFrame) -> dict:
    """
    Comparative breakdown of performance metrics by explicit content flag.

    Returns:
        explicit_stats — list of {is_explicit, label, n_tracks, avg_position,
                                   avg_popularity, median_days, mean_days, share_pct}
        tracks — per-track data with explicit labels
    """
    tracks = _track_level(df)

    explicit_stats = tracks.groupby("is_explicit").agg(
        n_tracks=("song", "count"),
        avg_position=("avg_position", "mean"),
        avg_popularity=("avg_popularity", "mean"),
        median_days=("days_on_chart", "median"),
        mean_days=("days_on_chart", "mean"),
    ).reset_index()
    explicit_stats["label"] = explicit_stats["is_explicit"].map(
        {True: "Explicit", False: "Clean"}
    )

    # Entry share
    total = explicit_stats["n_tracks"].sum()
    explicit_stats["share_pct"] = explicit_stats["n_tracks"] / total * 100

    tracks_out = tracks[
        ["song", "artist", "days_on_chart", "peak_position",
         "avg_position", "avg_popularity", "is_explicit"]
    ].copy()
    tracks_out["label"] = tracks_out["is_explicit"].map({True: "Explicit", False: "Clean"})

    return {
        "tracks": tracks_out.to_dict(orient="records"),
        "explicit_stats": explicit_stats.to_dict(orient="records"),
    }
