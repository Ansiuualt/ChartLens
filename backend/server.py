"""
ChartLens — FastAPI Backend (US Market)
Serves analytics data from the pipeline as JSON endpoints.
"""

import sys
import pathlib
import os
from typing import Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# Ensure project root is on path
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from pipeline.cleaner import load_and_clean
from pipeline.metrics import (
    compute_kpis,
    timeline_explorer,
    ranking_trends,
    artist_dominance,
    popularity_vs_rank,
    explicit_analysis,
)

app = FastAPI(title="ChartLens API", version="2.0.0")

allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load data once at startup ────────────────────────────────────────────
CSV_PATH = pathlib.Path(__file__).resolve().parent / "Atlantic_United_States.csv"
DF_RAW: pd.DataFrame = load_and_clean(CSV_PATH)


def _apply_filters(
    date_start: Optional[str],
    date_end: Optional[str],
    explicit: Optional[str],
    album_types: Optional[str],
    artists: Optional[str],
    songs: Optional[str],
    rank_min: Optional[int],
    rank_max: Optional[int],
) -> pd.DataFrame:
    """Apply sidebar-style filters and return filtered DataFrame."""
    df = DF_RAW.copy()

    if date_start:
        df = df[df["date"] >= pd.to_datetime(date_start)]
    if date_end:
        df = df[df["date"] <= pd.to_datetime(date_end)]

    if explicit and explicit == "Clean":
        df = df[df["is_explicit"] == False]
    elif explicit and explicit == "Explicit":
        df = df[df["is_explicit"] == True]

    if album_types:
        types = [t.strip() for t in album_types.split(",")]
        df = df[df["album_type"].isin(types)]

    if artists:
        artist_list = [a.strip() for a in artists.split("|")]
        df = df[df["artist"].isin(artist_list)]

    if songs:
        song_list = [s.strip() for s in songs.split("|")]
        df = df[df["song"].isin(song_list)]

    if rank_min is not None:
        df = df[df["position"] >= rank_min]
    if rank_max is not None:
        df = df[df["position"] <= rank_max]

    return df


def _sanitize(obj):
    """Recursively convert numpy/pandas types to JSON-safe Python types."""
    if isinstance(obj, dict):
        return {k: _sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_sanitize(v) for v in obj]
    if isinstance(obj, pd.DataFrame):
        return _sanitize(obj.to_dict(orient="records"))
    if isinstance(obj, pd.Series):
        return _sanitize(obj.tolist())
    if isinstance(obj, np.ndarray):
        return _sanitize(obj.tolist())
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        v = float(obj)
        if np.isnan(v) or np.isinf(v):
            return None
        return v
    if isinstance(obj, (np.bool_,)):
        return bool(obj)
    if isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    if isinstance(obj, pd.Categorical):
        return str(obj)
    if isinstance(obj, float):
        if np.isnan(obj) or np.isinf(obj):
            return None
    return obj


def _common_filters(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
) -> pd.DataFrame:
    """Shorthand: apply filters and return DataFrame."""
    return _apply_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)


# ── Endpoints ────────────────────────────────────────────────────────────


@app.get("/api/meta")
def get_meta():
    """Return dataset metadata for filter initialization."""
    return _sanitize({
        "date_min": DF_RAW["date"].min().strftime("%Y-%m-%d"),
        "date_max": DF_RAW["date"].max().strftime("%Y-%m-%d"),
        "album_types": sorted(DF_RAW["album_type"].unique().tolist()),
        "total_rows": len(DF_RAW),
        "unique_songs": int(DF_RAW["song"].nunique()),
        "unique_artists": int(DF_RAW["artist"].nunique()),
        "artists": sorted(DF_RAW["artist"].unique().tolist()),
        "songs": sorted(DF_RAW["song"].unique().tolist()),
    })


@app.get("/api/overview")
def get_overview(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
):
    df = _common_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)
    if df.empty:
        return {"error": "No data matches filters"}

    kpis = compute_kpis(df)
    return _sanitize(kpis)


@app.get("/api/timeline")
def get_timeline(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
):
    df = _common_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)
    if df.empty:
        return {"error": "No data matches filters"}

    result = timeline_explorer(df)
    return _sanitize(result)


@app.get("/api/ranking")
def get_ranking(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
    selected_songs: Optional[str] = None,
):
    df = _common_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)
    if df.empty:
        return {"error": "No data matches filters"}

    song_list = [s.strip() for s in selected_songs.split("|")] if selected_songs else None
    result = ranking_trends(df, song_list)
    return _sanitize(result)


@app.get("/api/dominance")
def get_dominance(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
):
    df = _common_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)
    if df.empty:
        return {"error": "No data matches filters"}

    result = artist_dominance(df)
    return _sanitize(result)


@app.get("/api/popularity")
def get_popularity(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
):
    df = _common_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)
    if df.empty:
        return {"error": "No data matches filters"}

    result = popularity_vs_rank(df)
    return _sanitize(result)


@app.get("/api/explicit")
def get_explicit(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
    artists: Optional[str] = None,
    songs: Optional[str] = None,
    rank_min: Optional[int] = None,
    rank_max: Optional[int] = None,
):
    df = _common_filters(date_start, date_end, explicit, album_types, artists, songs, rank_min, rank_max)
    if df.empty:
        return {"error": "No data matches filters"}

    result = explicit_analysis(df)
    return _sanitize(result)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
