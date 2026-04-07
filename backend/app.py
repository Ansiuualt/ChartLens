"""
ChartLens — UK Spotify Top 50 Analytics Dashboard
Main Streamlit application entry point.
"""

import streamlit as st
import pandas as pd
import numpy as np

from pipeline.cleaner import load_and_clean
from pipeline.metrics import (
    q1_artist_dominance,
    q2_domestic_vs_international,
    q3_collaboration,
    q4_explicit,
    q5_album_structure,
)
from pipeline.charts import (
    COLORS,
    fig_lorenz_curve,
    fig_top_artists_bar,
    fig_nat_bars,
    fig_nat_weekly,
    fig_collab_boxes,
    fig_collab_scatter,
    fig_explicit_violins,
    fig_explicit_donut,
    fig_album_scatter,
    fig_album_bin_box,
    fig_album_type_bar,
)

# ═══════════════════════════════════════════════════════════════════════════
# Page Config
# ═══════════════════════════════════════════════════════════════════════════
st.set_page_config(
    page_title="ChartLens — UK Spotify Analytics",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ───────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ── Global reset ── */
html, body, [class*="st-"] {
    font-family: 'Inter', sans-serif;
}
.stApp {
    background-color: #191414;
    color: #FFFFFF;
}

/* ── Sidebar ── */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border-right: 1px solid rgba(29, 185, 84, 0.15);
}
section[data-testid="stSidebar"] .stMarkdown h1,
section[data-testid="stSidebar"] .stMarkdown h2,
section[data-testid="stSidebar"] .stMarkdown h3 {
    color: #1DB954 !important;
}

/* ── KPI Card ── */
.kpi-card {
    background: linear-gradient(135deg, #282828 0%, #1a1a2e 100%);
    border: 1px solid rgba(29, 185, 84, 0.2);
    border-radius: 16px;
    padding: 24px 20px;
    text-align: center;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.kpi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(29, 185, 84, 0.15);
    border-color: rgba(29, 185, 84, 0.5);
}
.kpi-value {
    font-size: 2.3rem;
    font-weight: 800;
    color: #1DB954;
    line-height: 1.1;
    margin-bottom: 6px;
}
.kpi-label {
    font-size: 0.82rem;
    color: #B3B3B3;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 500;
}

/* ── Insight callout box ── */
.insight-box {
    background: linear-gradient(135deg, rgba(29, 185, 84, 0.08) 0%, rgba(29, 185, 84, 0.02) 100%);
    border-left: 4px solid #1DB954;
    border-radius: 0 12px 12px 0;
    padding: 18px 24px;
    margin: 16px 0;
    font-size: 0.95rem;
    color: #e0e0e0;
    line-height: 1.6;
}
.insight-box strong {
    color: #1DB954;
}

/* ── Page title ── */
.page-title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(90deg, #1DB954 0%, #1ed760 50%, #a3ffca 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
}
.page-subtitle {
    font-size: 1rem;
    color: #B3B3B3;
    margin-bottom: 28px;
    font-weight: 300;
}

/* ── Stat cards in Q3/Q4 ── */
.stat-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}
.stat-card {
    background: #282828;
    border-radius: 12px;
    padding: 16px 20px;
    flex: 1;
    min-width: 140px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.06);
}
.stat-card .stat-val {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1DB954;
}
.stat-card .stat-lbl {
    font-size: 0.72rem;
    color: #B3B3B3;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
}

/* ── Tab active styling ── */
button[data-baseweb="tab"][aria-selected="true"] {
    color: #1DB954 !important;
    border-bottom-color: #1DB954 !important;
}

/* ── Hide default Streamlit hamburger/footer ── */
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #191414; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #1DB954; }

/* ── Data tables ── */
.stDataFrame {
    border-radius: 12px;
    overflow: hidden;
}
</style>
""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════
# Data Loading (cached)
# ═══════════════════════════════════════════════════════════════════════════

@st.cache_data(show_spinner="🔄 Loading & cleaning dataset…")
def get_data():
    return load_and_clean()

df_raw = get_data()


# ═══════════════════════════════════════════════════════════════════════════
# Sidebar — Global Filters
# ═══════════════════════════════════════════════════════════════════════════

with st.sidebar:
    st.markdown("# 🎵 ChartLens")
    st.markdown("**UK Spotify Top 50 Analytics**")
    st.divider()

    # Date range
    min_date = df_raw["date"].min().date()
    max_date = df_raw["date"].max().date()
    date_range = st.slider(
        "📅 Date Range",
        min_value=min_date,
        max_value=max_date,
        value=(min_date, max_date),
        format="DD/MM/YYYY",
    )

    st.divider()

    # Nationality filter
    nat_filter = st.radio(
        "🌍 Nationality",
        ["Both", "UK", "International"],
        index=0,
        horizontal=True,
    )

    # Explicit toggle
    explicit_filter = st.radio(
        "🔞 Explicit Content",
        ["All", "Clean", "Explicit"],
        index=0,
        horizontal=True,
    )

    # Album type multiselect
    album_types = sorted(df_raw["album_type"].unique().tolist())
    album_filter = st.multiselect(
        "💿 Album Type",
        options=album_types,
        default=album_types,
    )

    st.divider()
    st.caption("Built with Streamlit · Plotly · Pandas")
    st.caption("Data: Spotify UK Top 50 Daily Charts")

# ── Apply filters ────────────────────────────────────────────────────────
df = df_raw.copy()
df = df[(df["date"].dt.date >= date_range[0]) & (df["date"].dt.date <= date_range[1])]

if nat_filter != "Both":
    df = df[df["nationality"] == nat_filter]

if explicit_filter == "Clean":
    df = df[df["is_explicit"] == False]
elif explicit_filter == "Explicit":
    df = df[df["is_explicit"] == True]

if album_filter:
    df = df[df["album_type"].isin(album_filter)]

if df.empty:
    st.warning("⚠️ No data matches the current filters. Adjust the sidebar.")
    st.stop()


# ═══════════════════════════════════════════════════════════════════════════
# Helper — KPI card HTML
# ═══════════════════════════════════════════════════════════════════════════

def kpi_card(value: str, label: str) -> str:
    return f"""
    <div class="kpi-card">
        <div class="kpi-value">{value}</div>
        <div class="kpi-label">{label}</div>
    </div>
    """

def insight_box(text: str) -> str:
    return f'<div class="insight-box">{text}</div>'

def stat_cards_html(cards: list[tuple[str, str]]) -> str:
    inner = "".join(
        f'<div class="stat-card"><div class="stat-val">{v}</div><div class="stat-lbl">{l}</div></div>'
        for v, l in cards
    )
    return f'<div class="stat-row">{inner}</div>'


# ═══════════════════════════════════════════════════════════════════════════
# Navigation Tabs
# ═══════════════════════════════════════════════════════════════════════════

tabs = st.tabs([
    "📊 Overview",
    "👑 Artist Dominance",
    "🌍 Domestic vs Intl",
    "🤝 Collabs vs Solo",
    "🔞 Explicit Analysis",
    "💿 Album Structure",
])

# ─────────────────────────────────────────────────────────────────────────
# PAGE 1 — Overview
# ─────────────────────────────────────────────────────────────────────────
with tabs[0]:
    st.markdown('<div class="page-title">Dashboard Overview</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">Key performance indicators for the UK Spotify Top 50</div>', unsafe_allow_html=True)

    q1 = q1_artist_dominance(df)
    q2 = q2_domestic_vs_international(df)
    top_artist = q1["artist_df"].iloc[0]

    # Row 1 — 3 KPIs
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown(kpi_card(f"{df['song'].nunique():,}", "Unique Songs Charted"), unsafe_allow_html=True)
    with c2:
        st.markdown(kpi_card(f"{df['artist'].nunique():,}", "Unique Artists"), unsafe_allow_html=True)
    with c3:
        st.markdown(kpi_card(f"{q1['gini_coeff']:.3f}", "Gini Coefficient"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Row 2 — 3 KPIs
    c4, c5, c6 = st.columns(3)

    # UK vs International split
    uk_pct = q2["entry_counts"]
    uk_row = uk_pct[uk_pct["nationality"] == "UK"]
    intl_row = uk_pct[uk_pct["nationality"] == "International"]
    uk_val = f"{uk_row['share_pct'].values[0]:.1f}%" if len(uk_row) else "N/A"
    intl_val = f"{intl_row['share_pct'].values[0]:.1f}%" if len(intl_row) else "N/A"

    with c4:
        st.markdown(kpi_card(f"{uk_val} / {intl_val}", "UK / International Split"), unsafe_allow_html=True)
    with c5:
        st.markdown(
            kpi_card(
                f"{top_artist['artist']}",
                f"Most Dominant — {top_artist['monopoly_share_pct']:.2f}% share",
            ),
            unsafe_allow_html=True,
        )
    with c6:
        st.markdown(
            kpi_card(
                f"{date_range[0].strftime('%d/%m/%Y')} — {date_range[1].strftime('%d/%m/%Y')}",
                "Date Range Covered",
            ),
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    # Quick summary insight
    st.markdown(
        insight_box(
            f"📈 <strong>{df['song'].nunique()}</strong> unique songs from "
            f"<strong>{df['artist'].nunique()}</strong> artists charted in this period. "
            f"The market is highly concentrated — a Gini of <strong>{q1['gini_coeff']:.3f}</strong> "
            f"indicates significant dominance by top artists, led by "
            f"<strong>{top_artist['artist']}</strong> with "
            f"<strong>{top_artist['monopoly_share_pct']:.2f}%</strong> of all chart score."
        ),
        unsafe_allow_html=True,
    )


# ─────────────────────────────────────────────────────────────────────────
# PAGE 2 — Artist Dominance
# ─────────────────────────────────────────────────────────────────────────
with tabs[1]:
    st.markdown('<div class="page-title">Artist Dominance</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">Who controls the UK Spotify Top 50?</div>', unsafe_allow_html=True)

    q1 = q1_artist_dominance(df)

    col_l, col_r = st.columns([1.2, 1])
    with col_l:
        st.plotly_chart(
            fig_lorenz_curve(q1["lorenz_x"], q1["lorenz_y"], q1["gini_coeff"]),
            use_container_width=True,
        )
    with col_r:
        st.plotly_chart(
            fig_top_artists_bar(q1["artist_df"]),
            use_container_width=True,
        )

    st.markdown(
        insight_box(
            f"🏆 The Gini coefficient is <strong>{q1['gini_coeff']:.3f}</strong>, "
            f"indicating a highly unequal distribution. "
            f"<strong>{q1['artist_df'].iloc[0]['artist']}</strong> alone holds "
            f"<strong>{q1['artist_df'].iloc[0]['monopoly_share_pct']:.2f}%</strong> "
            f"of all chart score — the definition of chart dominance."
        ),
        unsafe_allow_html=True,
    )

    # Data table
    with st.expander("📋 Full Artist Rankings Table", expanded=False):
        display_df = q1["artist_df"][["artist", "total_rank_score", "monopoly_share_pct"]].copy()
        display_df.columns = ["Artist", "Total Rank Score", "Chart Share (%)"]
        display_df["Chart Share (%)"] = display_df["Chart Share (%)"].round(3)
        display_df = display_df.reset_index(drop=True)
        display_df.index = display_df.index + 1
        st.dataframe(display_df, use_container_width=True, height=400)


# ─────────────────────────────────────────────────────────────────────────
# PAGE 3 — Domestic vs International
# ─────────────────────────────────────────────────────────────────────────
with tabs[2]:
    st.markdown('<div class="page-title">Domestic vs International</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">How do UK artists stack up against the global competition?</div>', unsafe_allow_html=True)

    q2 = q2_domestic_vs_international(df)
    bar_figs = fig_nat_bars(q2["nat_stats"])

    c1, c2, c3 = st.columns(3)
    for col_obj, fig in zip([c1, c2, c3], bar_figs):
        with col_obj:
            st.plotly_chart(fig, use_container_width=True)

    st.plotly_chart(fig_nat_weekly(q2["weekly_ts"]), use_container_width=True)

    # Insight
    ns = q2["nat_stats"]
    uk_days = ns.loc[ns["nationality"] == "UK", "median_days"].values
    intl_days = ns.loc[ns["nationality"] == "International", "median_days"].values
    if len(uk_days) and len(intl_days):
        diff = uk_days[0] - intl_days[0]
        st.markdown(
            insight_box(
                f"🇬🇧 UK artists have a median of <strong>{uk_days[0]:.0f}</strong> days on chart "
                f"vs <strong>{intl_days[0]:.0f}</strong> for international acts — "
                f"a <strong>{abs(diff):.0f}-day</strong> {'advantage' if diff > 0 else 'deficit'}. "
                f"{'Home turf advantage pays off!' if diff > 0 else 'International artists dominate in longevity.'}"
            ),
            unsafe_allow_html=True,
        )


# ─────────────────────────────────────────────────────────────────────────
# PAGE 4 — Collabs vs Solo
# ─────────────────────────────────────────────────────────────────────────
with tabs[3]:
    st.markdown('<div class="page-title">Collaborations vs Solo</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">Does teaming up pay off on the charts?</div>', unsafe_allow_html=True)

    q3 = q3_collaboration(df)
    cs = q3["collab_stats"]

    # Summary stat cards
    solo = cs[cs["type"] == "Solo"].iloc[0] if len(cs[cs["type"] == "Solo"]) else None
    collab = cs[cs["type"] == "Collaboration"].iloc[0] if len(cs[cs["type"] == "Collaboration"]) else None

    if solo is not None and collab is not None:
        st.markdown(
            stat_cards_html([
                (f"{int(solo['n_tracks'])}", "Solo Tracks"),
                (f"{int(collab['n_tracks'])}", "Collab Tracks"),
                (f"{solo['median_days']:.0f}", "Solo Median Days"),
                (f"{collab['median_days']:.0f}", "Collab Median Days"),
                (f"{solo['median_velocity']:.2f}", "Solo Median Velocity"),
                (f"{collab['median_velocity']:.2f}", "Collab Median Velocity"),
            ]),
            unsafe_allow_html=True,
        )

    box_figs = fig_collab_boxes(q3["tracks"])
    c1, c2, c3 = st.columns(3)
    for col_obj, fig in zip([c1, c2, c3], box_figs):
        with col_obj:
            st.plotly_chart(fig, use_container_width=True)

    st.plotly_chart(fig_collab_scatter(q3["tracks"]), use_container_width=True)

    if solo is not None and collab is not None:
        st.markdown(
            insight_box(
                f"🤝 Solo tracks have a median chart velocity of <strong>{solo['median_velocity']:.2f}</strong> "
                f"vs collaborations at <strong>{collab['median_velocity']:.2f}</strong>. "
                f"Both groups share similar median days on chart "
                f"({solo['median_days']:.0f} vs {collab['median_days']:.0f}), "
                f"suggesting collaborations don't significantly extend chart life."
            ),
            unsafe_allow_html=True,
        )


# ─────────────────────────────────────────────────────────────────────────
# PAGE 5 — Explicit Analysis
# ─────────────────────────────────────────────────────────────────────────
with tabs[4]:
    st.markdown('<div class="page-title">Explicit Content Analysis</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">Does explicit content help or hurt chart performance?</div>', unsafe_allow_html=True)

    q4 = q4_explicit(df)
    es = q4["explicit_stats"]

    violin_figs = fig_explicit_violins(q4["tracks"])
    c1, c2, c3 = st.columns(3)
    for col_obj, fig in zip([c1, c2, c3], violin_figs):
        with col_obj:
            st.plotly_chart(fig, use_container_width=True)

    c_left, c_right = st.columns([1, 1.3])
    with c_left:
        st.plotly_chart(fig_explicit_donut(es), use_container_width=True)
    with c_right:
        exp_row = es[es["label"] == "Explicit"]
        clean_row = es[es["label"] == "Clean"]
        if len(exp_row) and len(clean_row):
            exp = exp_row.iloc[0]
            cln = clean_row.iloc[0]
            pct_faster = 0
            if cln["median_days"] > 0:
                pct_faster = (1 - exp["median_days"] / cln["median_days"]) * 100

            st.markdown(
                stat_cards_html([
                    (f"{exp['avg_position']:.1f}", "Explicit Avg Pos"),
                    (f"{cln['avg_position']:.1f}", "Clean Avg Pos"),
                    (f"{exp['median_days']:.0f}d", "Explicit Median Days"),
                    (f"{cln['median_days']:.0f}d", "Clean Median Days"),
                ]),
                unsafe_allow_html=True,
            )
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown(
                insight_box(
                    f"🔞 Explicit tracks rank better on average "
                    f"(position <strong>{exp['avg_position']:.1f}</strong> vs "
                    f"<strong>{cln['avg_position']:.1f}</strong>) "
                    f"but fade <strong>{abs(pct_faster):.0f}% faster</strong> — "
                    f"lasting only <strong>{exp['median_days']:.0f}</strong> median days "
                    f"compared to <strong>{cln['median_days']:.0f}</strong> for clean tracks."
                ),
                unsafe_allow_html=True,
            )


# ─────────────────────────────────────────────────────────────────────────
# PAGE 6 — Album Structure
# ─────────────────────────────────────────────────────────────────────────
with tabs[5]:
    st.markdown('<div class="page-title">Album Structure vs Chart Duration</div>', unsafe_allow_html=True)
    st.markdown('<div class="page-subtitle">Does album size affect how long a song stays on the chart?</div>', unsafe_allow_html=True)

    q5 = q5_album_structure(df)

    st.plotly_chart(
        fig_album_scatter(q5["tracks"], q5["pearson_r"]),
        use_container_width=True,
    )

    c_l, c_r = st.columns(2)
    with c_l:
        st.plotly_chart(fig_album_bin_box(q5["tracks"]), use_container_width=True)
    with c_r:
        st.plotly_chart(fig_album_type_bar(q5["type_stats"]), use_container_width=True)

    # Insight
    bs = q5["bin_stats"]
    single_days = bs.loc[bs["album_size_bin"] == "Single (1)", "median_days"]
    mega_days = bs.loc[bs["album_size_bin"] == "Mega (21+)", "median_days"]
    if len(single_days) and len(mega_days):
        ratio = single_days.values[0] / mega_days.values[0] if mega_days.values[0] > 0 else 0
        st.markdown(
            insight_box(
                f"💿 Pearson r = <strong>{q5['pearson_r']:.3f}</strong> — a negative correlation. "
                f"Singles (1 track) last a median of <strong>{single_days.values[0]:.1f}</strong> days, "
                f"while mega-albums (21+ tracks) last only <strong>{mega_days.values[0]:.1f}</strong> days "
                f"— singles outlast them by <strong>{ratio:.1f}x</strong> on the UK chart."
            ),
            unsafe_allow_html=True,
        )

    # Album type data table
    with st.expander("📋 Tracks by Album Size", expanded=False):
        tbl = q5["tracks"][["song", "artist", "album_type", "total_tracks", "days_on_chart", "album_size_bin", "album_cover_url"]].copy()
        tbl = tbl.drop_duplicates(subset=["song", "artist"])
        tbl.columns = ["Song", "Artist", "Album Type", "Total Tracks", "Days on Chart", "Size Category", "Cover"]
        tbl = tbl.sort_values("Days on Chart", ascending=False).reset_index(drop=True)
        tbl.index = tbl.index + 1

        st.dataframe(
            tbl,
            column_config={
                "Cover": st.column_config.ImageColumn("Cover", width="small"),
            },
            use_container_width=True,
            height=400,
        )
