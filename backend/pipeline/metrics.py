"""
ChartLens — Metrics & Analysis Functions
Implements the five stakeholder questions (Q1–Q5).
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
            median_rank_score=("rank_score", "median"),
            total_rank_score=("rank_score", "sum"),
            is_collaboration=("is_collaboration", "first"),
            is_explicit=("is_explicit", "first"),
            album_type=("album_type", "first"),
            total_tracks=("total_tracks", "first"),
            nationality=("nationality", "first"),
            album_cover_url=("album_cover_url", "first"),
        )
        .reset_index()
    )


# ═══════════════════════════════════════════════════════════════════════════
# Q1 — Artist Dominance (Gini Coefficient)
# ═══════════════════════════════════════════════════════════════════════════

def q1_artist_dominance(df: pd.DataFrame) -> dict:
    """
    Returns:
        artist_df — DataFrame with columns [artist, total_rank_score, monopoly_share_pct]
        gini_coeff — float
        lorenz_x, lorenz_y — arrays for plotting
    """
    artist_scores = (
        df.groupby("artist")["rank_score"]
        .sum()
        .reset_index()
        .rename(columns={"rank_score": "total_rank_score"})
        .sort_values("total_rank_score", ascending=True)
    )
    total = artist_scores["total_rank_score"].sum()
    artist_scores["monopoly_share_pct"] = artist_scores["total_rank_score"] / total * 100

    gini_coeff = gini(artist_scores["total_rank_score"].values)

    # Lorenz curve
    cum = np.cumsum(artist_scores["total_rank_score"].values) / total
    lorenz_x = np.linspace(0, 1, len(cum))
    lorenz_y = cum

    # Add 0,0 origin
    lorenz_x = np.insert(lorenz_x, 0, 0)
    lorenz_y = np.insert(lorenz_y, 0, 0)

    return {
        "artist_df": artist_scores.sort_values("total_rank_score", ascending=False),
        "gini_coeff": gini_coeff,
        "lorenz_x": lorenz_x,
        "lorenz_y": lorenz_y,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Q2 — Domestic vs International
# ═══════════════════════════════════════════════════════════════════════════

def q2_domestic_vs_international(df: pd.DataFrame) -> dict:
    tracks = _track_level(df)

    # Entry share
    entry_counts = tracks["nationality"].value_counts().reset_index()
    entry_counts.columns = ["nationality", "count"]
    total_entries = entry_counts["count"].sum()
    entry_counts["share_pct"] = entry_counts["count"] / total_entries * 100

    # Avg position & popularity per nationality
    nat_stats = tracks.groupby("nationality").agg(
        avg_position=("avg_position", "mean"),
        avg_popularity=("avg_popularity", "mean"),
        median_days=("days_on_chart", "median"),
        mean_days=("days_on_chart", "mean"),
        track_count=("song", "count"),
    ).reset_index()

    # Weekly time series
    df_ts = df.copy()
    df_ts["week"] = df_ts["date"].dt.to_period("W").dt.start_time
    weekly = (
        df_ts.groupby(["week", "nationality"])
        .size()
        .reset_index(name="entries")
    )

    return {
        "entry_counts": entry_counts,
        "nat_stats": nat_stats,
        "weekly_ts": weekly,
        "tracks": tracks,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Q3 — Collaboration Influence
# ═══════════════════════════════════════════════════════════════════════════

def q3_collaboration(df: pd.DataFrame) -> dict:
    tracks = _track_level(df)
    tracks["chart_velocity"] = tracks["median_rank_score"] / tracks["days_on_chart"]

    collab_stats = tracks.groupby("is_collaboration").agg(
        n_tracks=("song", "count"),
        median_days=("days_on_chart", "median"),
        mean_days=("days_on_chart", "mean"),
        median_velocity=("chart_velocity", "median"),
        mean_velocity=("chart_velocity", "mean"),
        avg_popularity=("avg_popularity", "mean"),
        median_popularity=("avg_popularity", "median"),
    ).reset_index()
    collab_stats["type"] = collab_stats["is_collaboration"].map(
        {True: "Collaboration", False: "Solo"}
    )

    return {
        "tracks": tracks,
        "collab_stats": collab_stats,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Q4 — Explicit Content Performance
# ═══════════════════════════════════════════════════════════════════════════

def q4_explicit(df: pd.DataFrame) -> dict:
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

    return {
        "tracks": tracks,
        "explicit_stats": explicit_stats,
    }


# ═══════════════════════════════════════════════════════════════════════════
# Q5 — Album Structure vs Chart Duration
# ═══════════════════════════════════════════════════════════════════════════

_BINS = [0, 1, 6, 14, 20, 200]
_LABELS = ["Single (1)", "EP (2–6)", "Standard (7–14)", "Deluxe (15–20)", "Mega (21+)"]


def q5_album_structure(df: pd.DataFrame) -> dict:
    tracks = _track_level(df)
    tracks["album_size_bin"] = pd.cut(
        tracks["total_tracks"], bins=_BINS, labels=_LABELS, right=True
    )

    # Pearson r
    valid = tracks.dropna(subset=["total_tracks", "days_on_chart"])
    pearson_r = float(valid["total_tracks"].corr(valid["days_on_chart"]))

    # Stats by bin
    bin_stats = (
        tracks.groupby("album_size_bin", observed=False)
        .agg(
            median_days=("days_on_chart", "median"),
            mean_days=("days_on_chart", "mean"),
            n_tracks=("song", "count"),
        )
        .reset_index()
    )

    # Stats by album_type
    type_stats = (
        tracks.groupby("album_type")
        .agg(
            median_days=("days_on_chart", "median"),
            mean_days=("days_on_chart", "mean"),
            n_tracks=("song", "count"),
        )
        .reset_index()
    )

    return {
        "tracks": tracks,
        "pearson_r": pearson_r,
        "bin_stats": bin_stats,
        "type_stats": type_stats,
    }
