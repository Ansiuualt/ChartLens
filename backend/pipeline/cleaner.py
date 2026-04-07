"""
ChartLens — Data Cleaning Pipeline
Loads Atlantic_United_Kingdom.csv and produces an analysis-ready DataFrame.
"""

import re
import pathlib
import pandas as pd
import numpy as np

# ── UK artist set (rule-based nationality tagging) ──────────────────────────
UK_ARTISTS: set[str] = {
    "Dua Lipa", "Ed Sheeran", "Harry Styles", "Sam Smith",
    "Stormzy", "Dave", "Central Cee", "Coldplay", "Adele",
    "Arctic Monkeys", "The Killers", "Charli XCX", "cassö",
    "RAYE", "D-Block Europe", "Jorja Smith", "Jess Glynne",
    "Anne-Marie", "Ella Henderson", "Switch Disco", "venbee",
    "goddard.", "Tom Grennan", "Mabel",
}

_COLLAB_RE = re.compile(r"\s*(?:&|feat\.|ft\.|\bx\b)\s*", re.IGNORECASE)


def _split_artists(artist_str: str) -> list[str]:
    """Split a combined artist string into individual names."""
    return [a.strip() for a in _COLLAB_RE.split(artist_str) if a.strip()]


def _tag_nationality(artist_str: str) -> str:
    """Return 'UK' if *any* collaborator is in the UK set, else 'International'."""
    parts = _split_artists(artist_str)
    for p in parts:
        if p in UK_ARTISTS:
            return "UK"
    return "International"


def _is_collaboration(artist_str: str) -> bool:
    """True when the artist field contains a collaboration marker."""
    return bool(_COLLAB_RE.search(artist_str))


def load_and_clean(csv_path: str | pathlib.Path | None = None) -> pd.DataFrame:
    """
    Execute the full 6-step cleaning pipeline.

    Returns a DataFrame with derived columns ready for analysis.
    """
    if csv_path is None:
        csv_path = pathlib.Path(__file__).resolve().parents[1] / "Atlantic_United_Kingdom.csv"
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
    df["rank_score"] = 51 - df["position"]

    # Per-track aggregates (days_on_chart, peak_position)
    track_stats = (
        df.groupby(["song", "artist"])
        .agg(
            days_on_chart=("date", "nunique"),
            peak_position=("position", "min"),
        )
        .reset_index()
    )
    df = df.merge(track_stats, on=["song", "artist"], how="left")

    df["is_collaboration"] = df["artist"].apply(_is_collaboration)
    df["chart_velocity"] = df.groupby(["song", "artist"])["rank_score"].transform("median") / df["days_on_chart"]
    df["duration_min"] = df["duration_ms"] / 60_000
    df["nationality"] = df["artist"].apply(_tag_nationality)

    # ── Step 6: Drop duplicate (date, position) rows ─────────────────────
    df = df.drop_duplicates(subset=["date", "position"], keep="first")

    df = df.sort_values(["date", "position"]).reset_index(drop=True)
    return df
