"""
ChartLens — Data Cleaning Pipeline
Loads Atlantic_United_States.csv and produces an analysis-ready DataFrame.
"""

import pathlib
import pandas as pd
import numpy as np

def load_and_clean(csv_path: str | pathlib.Path | None = None) -> pd.DataFrame:
    """
    Execute the full cleaning pipeline.

    Returns a DataFrame with derived columns ready for analysis.
    """
    if csv_path is None:
        csv_path = pathlib.Path(__file__).resolve().parents[1] / "Atlantic_United_States.csv"
    else:
        csv_path = pathlib.Path(csv_path)

    # ── Step 1: Load with explicit dtypes ────────────────────────────────
    df = pd.read_csv(
        csv_path,
        dtype={
            "position": "Int64",
            "popularity": "Int64",
            "total_tracks": "Int64",
        },
    )
    # is_explicit is already bool in the data

    # ── Step 2: Parse dates (DD-MM-YYYY → datetime) ─────────────────────
    df["date"] = pd.to_datetime(df["date"], dayfirst=True)

    # ── Step 3: Strip whitespace from string columns ─────────────────────
    for col in ("song", "artist", "album_type"):
        df[col] = df[col].astype(str).str.strip()

    # ── Step 4: Clip position & popularity to valid ranges ───────────────
    df["position"] = df["position"].clip(1, 50)
    df["popularity"] = df["popularity"].clip(0, 100)

    # ── Step 5: Derived columns ──────────────────────────────────────────
    df["duration_min"] = df["duration_ms"] / 60_000

    # Sort to ensure rolling calculations are chronological
    df = df.sort_values(["song", "artist", "date"])
    df["popularity_trend"] = df.groupby(["song", "artist"])["popularity"].transform(
        lambda x: x.rolling(window=7, min_periods=1).mean()
    )

    # Per-track aggregates
    track_stats = (
        df.groupby(["song", "artist"])
        .agg(
            days_on_chart=("date", "nunique"),
            avg_position=("position", "mean"),
            best_rank=("position", "min"),
            rank_volatility=("position", "std"),
        )
        .reset_index()
    )
    
    # Fill NaN volatility (for songs with only 1 appearance)
    track_stats["rank_volatility"] = track_stats["rank_volatility"].fillna(0)

    df = df.merge(track_stats, on=["song", "artist"], how="left")

    # ── Step 6: Drop duplicate (date, position) rows ─────────────────────
    df = df.drop_duplicates(subset=["date", "position"], keep="first")

    df = df.sort_values(["date", "position"]).reset_index(drop=True)
    return df
