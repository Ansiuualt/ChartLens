"""
ChartLens — FastAPI Backend
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
    q1_artist_dominance,
    q2_domestic_vs_international,
    q3_collaboration,
    q4_explicit,
    q5_album_structure,
)

app = FastAPI(title="ChartLens API", version="1.0.0")

allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Use ["*"] to allow all, or replace with `allowed_origins` for stricter security
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load data once at startup ────────────────────────────────────────────
CSV_PATH = pathlib.Path(__file__).resolve().parent / "Atlantic_United_Kingdom.csv"
DF_RAW: pd.DataFrame = load_and_clean(CSV_PATH)


def _apply_filters(
    date_start: Optional[str],
    date_end: Optional[str],
    nationality: Optional[str],
    explicit: Optional[str],
    album_types: Optional[str],
) -> pd.DataFrame:
    """Apply sidebar-style filters and return filtered DataFrame."""
    df = DF_RAW.copy()

    if date_start:
        df = df[df["date"] >= pd.to_datetime(date_start)]
    if date_end:
        df = df[df["date"] <= pd.to_datetime(date_end)]

    if nationality and nationality != "Both":
        df = df[df["nationality"] == nationality]

    if explicit and explicit == "Clean":
        df = df[df["is_explicit"] == False]
    elif explicit and explicit == "Explicit":
        df = df[df["is_explicit"] == True]

    if album_types:
        types = [t.strip() for t in album_types.split(",")]
        df = df[df["album_type"].isin(types)]

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
    })


@app.get("/api/overview")
def get_overview(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    nationality: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
):
    df = _apply_filters(date_start, date_end, nationality, explicit, album_types)
    if df.empty:
        return {"error": "No data matches filters"}

    q1 = q1_artist_dominance(df)
    q2 = q2_domestic_vs_international(df)
    top_artist = q1["artist_df"].iloc[0]

    entry_counts = q2["entry_counts"]
    uk_row = entry_counts[entry_counts["nationality"] == "UK"]
    intl_row = entry_counts[entry_counts["nationality"] == "International"]

    return _sanitize({
        "unique_songs": int(df["song"].nunique()),
        "unique_artists": int(df["artist"].nunique()),
        "gini_coeff": q1["gini_coeff"],
        "uk_share_pct": float(uk_row["share_pct"].values[0]) if len(uk_row) else 0,
        "intl_share_pct": float(intl_row["share_pct"].values[0]) if len(intl_row) else 0,
        "top_artist_name": str(top_artist["artist"]),
        "top_artist_share": float(top_artist["monopoly_share_pct"]),
        "date_start": df["date"].min().strftime("%d/%m/%Y"),
        "date_end": df["date"].max().strftime("%d/%m/%Y"),
    })


@app.get("/api/q1")
def get_q1(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    nationality: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
):
    df = _apply_filters(date_start, date_end, nationality, explicit, album_types)
    if df.empty:
        return {"error": "No data matches filters"}

    q1 = q1_artist_dominance(df)
    return _sanitize({
        "gini_coeff": q1["gini_coeff"],
        "lorenz_x": q1["lorenz_x"],
        "lorenz_y": q1["lorenz_y"],
        "artists": q1["artist_df"][["artist", "total_rank_score", "monopoly_share_pct"]].head(50).to_dict(orient="records"),
        "all_artists": q1["artist_df"][["artist", "total_rank_score", "monopoly_share_pct"]].to_dict(orient="records"),
    })


@app.get("/api/q2")
def get_q2(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    nationality: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
):
    df = _apply_filters(date_start, date_end, nationality, explicit, album_types)
    if df.empty:
        return {"error": "No data matches filters"}

    q2 = q2_domestic_vs_international(df)
    return _sanitize({
        "entry_counts": q2["entry_counts"],
        "nat_stats": q2["nat_stats"],
        "weekly_ts": q2["weekly_ts"],
    })


@app.get("/api/q3")
def get_q3(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    nationality: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
):
    df = _apply_filters(date_start, date_end, nationality, explicit, album_types)
    if df.empty:
        return {"error": "No data matches filters"}

    q3 = q3_collaboration(df)

    tracks = q3["tracks"][["song", "artist", "days_on_chart", "peak_position",
                           "avg_position", "avg_popularity", "chart_velocity",
                           "is_collaboration"]].copy()
    tracks["type"] = tracks["is_collaboration"].map({True: "Collab", False: "Solo"})

    return _sanitize({
        "collab_stats": q3["collab_stats"],
        "tracks": tracks.to_dict(orient="records"),
    })


@app.get("/api/q4")
def get_q4(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    nationality: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
):
    df = _apply_filters(date_start, date_end, nationality, explicit, album_types)
    if df.empty:
        return {"error": "No data matches filters"}

    q4 = q4_explicit(df)

    tracks = q4["tracks"][["song", "artist", "days_on_chart", "peak_position",
                           "avg_position", "avg_popularity", "is_explicit"]].copy()
    tracks["label"] = tracks["is_explicit"].map({True: "Explicit", False: "Clean"})

    return _sanitize({
        "explicit_stats": q4["explicit_stats"],
        "tracks": tracks.to_dict(orient="records"),
    })


@app.get("/api/q5")
def get_q5(
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    nationality: Optional[str] = None,
    explicit: Optional[str] = None,
    album_types: Optional[str] = None,
):
    df = _apply_filters(date_start, date_end, nationality, explicit, album_types)
    if df.empty:
        return {"error": "No data matches filters"}

    q5 = q5_album_structure(df)

    tracks = q5["tracks"][["song", "artist", "days_on_chart", "total_tracks",
                           "album_type", "album_size_bin", "peak_position",
                           "album_cover_url"]].copy()
    tracks["album_size_bin"] = tracks["album_size_bin"].astype(str)

    return _sanitize({
        "pearson_r": q5["pearson_r"],
        "bin_stats": q5["bin_stats"].assign(album_size_bin=q5["bin_stats"]["album_size_bin"].astype(str)),
        "type_stats": q5["type_stats"],
        "tracks": tracks.to_dict(orient="records"),
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
