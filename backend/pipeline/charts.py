"""
ChartLens — Plotly Figure Builders
One function per visual, ready to embed in Streamlit.
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# ── Shared palette ───────────────────────────────────────────────────────
COLORS = {
    "primary": "#1DB954",
    "accent": "#FF6B6B",
    "neutral": "#B3B3B3",
    "uk": "#003087",
    "intl": "#CF142B",
    "bg": "#191414",
    "card": "#282828",
    "text": "#FFFFFF",
    "text_dim": "#B3B3B3",
}

_LAYOUT_DEFAULTS = dict(
    paper_bgcolor=COLORS["bg"],
    plot_bgcolor=COLORS["bg"],
    font=dict(color=COLORS["text"], family="Inter, sans-serif"),
    margin=dict(l=40, r=20, t=50, b=40),
    hoverlabel=dict(bgcolor=COLORS["card"], font_color=COLORS["text"]),
)


def _apply_layout(fig: go.Figure, **extra) -> go.Figure:
    fig.update_layout(**_LAYOUT_DEFAULTS, **extra)
    fig.update_xaxes(gridcolor="#333333", zerolinecolor="#333333")
    fig.update_yaxes(gridcolor="#333333", zerolinecolor="#333333")
    return fig


# ═══════════════════════════════════════════════════════════════════════════
# Q1 — Artist Dominance
# ═══════════════════════════════════════════════════════════════════════════

def fig_lorenz_curve(lorenz_x: np.ndarray, lorenz_y: np.ndarray, gini_coeff: float) -> go.Figure:
    fig = go.Figure()
    # Perfect equality line
    fig.add_trace(go.Scatter(
        x=[0, 1], y=[0, 1],
        mode="lines", line=dict(dash="dash", color=COLORS["neutral"], width=1.5),
        name="Perfect Equality",
        hoverinfo="skip",
    ))
    # Lorenz curve with filled area
    fig.add_trace(go.Scatter(
        x=lorenz_x, y=lorenz_y,
        mode="lines", fill="tozeroy",
        line=dict(color=COLORS["primary"], width=2.5),
        fillcolor="rgba(29, 185, 84, 0.18)",
        name=f"Lorenz Curve (Gini = {gini_coeff:.3f})",
        hovertemplate="Cumulative Artists: %{x:.0%}<br>Cumulative Score: %{y:.0%}<extra></extra>",
    ))
    _apply_layout(
        fig,
        title=dict(text=f"Lorenz Curve — Chart Score Distribution  (Gini = {gini_coeff:.3f})",
                   font=dict(size=16)),
        xaxis_title="Cumulative Share of Artists",
        yaxis_title="Cumulative Share of Chart Score",
        showlegend=True,
        legend=dict(x=0.02, y=0.98, bgcolor="rgba(0,0,0,0)"),
    )
    return fig


def fig_top_artists_bar(artist_df: pd.DataFrame, top_n: int = 15) -> go.Figure:
    top = artist_df.head(top_n).sort_values("monopoly_share_pct")
    fig = px.bar(
        top, x="monopoly_share_pct", y="artist",
        orientation="h",
        color="monopoly_share_pct",
        color_continuous_scale=["#1a1a2e", COLORS["primary"]],
        hover_data={"total_rank_score": True, "monopoly_share_pct": ":.2f"},
        labels={"monopoly_share_pct": "Chart Share (%)", "artist": ""},
    )
    fig.update_coloraxes(showscale=False)
    _apply_layout(fig, title=dict(text=f"Top {top_n} Dominant Artists", font=dict(size=16)))
    return fig


# ═══════════════════════════════════════════════════════════════════════════
# Q2 — Domestic vs International
# ═══════════════════════════════════════════════════════════════════════════

def fig_nat_bars(nat_stats: pd.DataFrame) -> list[go.Figure]:
    """Return three bar charts: entry share, avg position, avg popularity."""
    color_map = {"UK": COLORS["uk"], "International": COLORS["intl"]}
    figs = []

    for col, title, fmt in [
        ("track_count", "Track Count", ",.0f"),
        ("avg_position", "Avg Chart Position", ".1f"),
        ("avg_popularity", "Avg Popularity", ".1f"),
    ]:
        fig = px.bar(
            nat_stats, x="nationality", y=col,
            color="nationality", color_discrete_map=color_map,
            text_auto=fmt,
            labels={"nationality": "", col: title},
        )
        fig.update_traces(textposition="outside")
        _apply_layout(fig, title=dict(text=title, font=dict(size=14)),
                       showlegend=False, yaxis_title="")
        figs.append(fig)
    return figs


def fig_nat_weekly(weekly_ts: pd.DataFrame) -> go.Figure:
    color_map = {"UK": COLORS["uk"], "International": COLORS["intl"]}
    fig = px.area(
        weekly_ts, x="week", y="entries", color="nationality",
        color_discrete_map=color_map,
        labels={"week": "Week", "entries": "Chart Entries"},
    )
    _apply_layout(fig, title=dict(text="UK vs International Entries Over Time", font=dict(size=16)))
    return fig


# ═══════════════════════════════════════════════════════════════════════════
# Q3 — Collaboration Influence
# ═══════════════════════════════════════════════════════════════════════════

def fig_collab_boxes(tracks: pd.DataFrame) -> list[go.Figure]:
    tracks = tracks.copy()
    tracks["type"] = tracks["is_collaboration"].map({True: "Collab", False: "Solo"})
    color_map = {"Solo": COLORS["primary"], "Collab": COLORS["accent"]}
    figs = []
    for col, title in [
        ("days_on_chart", "Days on Chart"),
        ("chart_velocity", "Chart Velocity"),
        ("avg_popularity", "Avg Popularity"),
    ]:
        fig = px.box(
            tracks, x="type", y=col, color="type",
            color_discrete_map=color_map,
            labels={"type": "", col: title},
            points="outliers",
        )
        _apply_layout(fig, title=dict(text=title, font=dict(size=14)),
                       showlegend=False)
        figs.append(fig)
    return figs


def fig_collab_scatter(tracks: pd.DataFrame) -> go.Figure:
    tracks = tracks.copy()
    tracks["type"] = tracks["is_collaboration"].map({True: "Collab", False: "Solo"})
    color_map = {"Solo": COLORS["primary"], "Collab": COLORS["accent"]}
    fig = px.scatter(
        tracks, x="days_on_chart", y="peak_position",
        color="type", color_discrete_map=color_map,
        hover_data=["song", "artist"],
        labels={"days_on_chart": "Days on Chart", "peak_position": "Peak Position"},
        opacity=0.65,
    )
    fig.update_yaxes(autorange="reversed")
    _apply_layout(fig, title=dict(text="Days on Chart vs Peak Position", font=dict(size=16)))
    return fig


# ═══════════════════════════════════════════════════════════════════════════
# Q4 — Explicit Content
# ═══════════════════════════════════════════════════════════════════════════

def fig_explicit_violins(tracks: pd.DataFrame) -> list[go.Figure]:
    tracks = tracks.copy()
    tracks["label"] = tracks["is_explicit"].map({True: "Explicit", False: "Clean"})
    color_map = {"Explicit": COLORS["accent"], "Clean": COLORS["primary"]}
    figs = []
    for col, title in [
        ("avg_position", "Avg Chart Position"),
        ("avg_popularity", "Avg Popularity"),
        ("days_on_chart", "Days on Chart"),
    ]:
        fig = px.violin(
            tracks, x="label", y=col, color="label",
            color_discrete_map=color_map, box=True,
            labels={"label": "", col: title},
        )
        _apply_layout(fig, title=dict(text=title, font=dict(size=14)),
                       showlegend=False)
        figs.append(fig)
    return figs


def fig_explicit_donut(explicit_stats: pd.DataFrame) -> go.Figure:
    fig = go.Figure(go.Pie(
        labels=explicit_stats["label"],
        values=explicit_stats["n_tracks"],
        hole=0.55,
        marker=dict(colors=[COLORS["primary"], COLORS["accent"]]),
        textinfo="label+percent",
        hovertemplate="%{label}: %{value} tracks (%{percent})<extra></extra>",
    ))
    _apply_layout(fig, title=dict(text="Explicit vs Clean Share", font=dict(size=16)))
    return fig


# ═══════════════════════════════════════════════════════════════════════════
# Q5 — Album Structure
# ═══════════════════════════════════════════════════════════════════════════

def fig_album_scatter(tracks: pd.DataFrame, pearson_r: float) -> go.Figure:
    fig = px.scatter(
        tracks, x="total_tracks", y="days_on_chart",
        color="album_type",
        color_discrete_sequence=[COLORS["primary"], COLORS["accent"], COLORS["uk"]],
        hover_data=["song", "artist"],
        opacity=0.55,
        trendline="ols",
        labels={"total_tracks": "Total Tracks in Album", "days_on_chart": "Days on Chart"},
    )
    _apply_layout(
        fig,
        title=dict(text=f"Album Size vs Chart Duration  (r = {pearson_r:.3f})", font=dict(size=16)),
    )
    return fig


def fig_album_bin_box(tracks: pd.DataFrame) -> go.Figure:
    fig = px.box(
        tracks, x="album_size_bin", y="days_on_chart",
        color="album_size_bin",
        color_discrete_sequence=[COLORS["primary"], "#2ecc71", "#3498db", COLORS["accent"], "#e74c3c"],
        labels={"album_size_bin": "Album Size Category", "days_on_chart": "Days on Chart"},
    )
    _apply_layout(fig, title=dict(text="Days on Chart by Album Size", font=dict(size=16)),
                   showlegend=False)
    return fig


def fig_album_type_bar(type_stats: pd.DataFrame) -> go.Figure:
    fig = px.bar(
        type_stats, x="album_type", y="median_days",
        color="album_type",
        color_discrete_sequence=[COLORS["primary"], COLORS["accent"], COLORS["uk"]],
        text_auto=".1f",
        labels={"album_type": "Album Type", "median_days": "Median Days on Chart"},
    )
    fig.update_traces(textposition="outside")
    _apply_layout(fig, title=dict(text="Median Days by Album Type", font=dict(size=16)),
                   showlegend=False)
    return fig
