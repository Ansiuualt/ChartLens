<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Plotly-Interactive-3F4F75?style=for-the-badge&logo=plotly&logoColor=white" alt="Plotly" />
</p>

# 🎵 ChartLens — UK Spotify Top 50 Analytics

**ChartLens** is a full-stack analytics dashboard that dissects the **UK Spotify Top 50** daily charts, uncovering patterns in artist dominance, nationality trends, collaboration effects, explicit content impact, and album structure.

Built with a **Next.js + TypeScript** frontend and a **FastAPI + Pandas** backend, ChartLens transforms raw chart data into rich, interactive visualizations and data-driven insights.

---

## ✨ Features

| Module | What it reveals |
|---|---|
| **📊 Overview** | KPI cards for unique songs, artists, Gini coefficient, UK/international split |
| **👑 Artist Dominance** | Lorenz curve, Gini index, top-artist bar chart & full rankings table |
| **🌍 Domestic vs International** | Entry counts, median metrics, weekly nationality time-series |
| **🤝 Collabs vs Solo** | Box plots, scatter charts, and stat cards comparing solo vs collaborative tracks |
| **🔞 Explicit Analysis** | Violin plots, donut chart, and longevity comparison for explicit vs clean content |
| **💿 Album Structure** | Scatter & box plots examining how album size correlates with chart duration |

### Highlights

- 🎨 **Spotify-inspired dark theme** — sleek `#191414` palette with signature green accents
- 📈 **Interactive Plotly charts** — hover, zoom, and drill into every data point
- 🔍 **Global filter panel** — slice data by date range, nationality, explicit flag, and album type
- ⚡ **Framer Motion animations** — smooth section transitions and micro-interactions
- 📱 **Fully responsive** — works across desktop, tablet, and mobile

---

## 🏗️ Architecture

```
uk-charts-analyzer/
├── backend/                   # Python analytics backend
│   ├── server.py              # FastAPI app — REST endpoints
│   ├── app.py                 # Streamlit app (legacy UI)
│   ├── requirements.txt       # Python dependencies
│   └── pipeline/              # Data processing layer
│       ├── cleaner.py         # CSV loading & cleaning
│       ├── metrics.py         # Analytics computations (Q1–Q5)
│       └── charts.py          # Plotly figure builders
│
├── frontend/                  # Next.js 16 + TypeScript
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   ├── globals.css        # Design tokens & global styles
│   │   ├── about/             # About page
│   │   └── (dashboard)/       # Dashboard route group
│   │       ├── page.tsx       # Overview dashboard
│   │       ├── layout.tsx     # Dashboard layout with sidebar
│   │       ├── artist-dominance/
│   │       ├── domestic-vs-intl/
│   │       ├── collabs-vs-solo/
│   │       ├── explicit-analysis/
│   │       └── album-structure/
│   ├── components/
│   │   ├── charts/            # 12 Plotly chart components
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── sidebar-filters.tsx
│   │   ├── nav-sidebar.tsx
│   │   ├── kpi-card.tsx
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities & helpers
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/uk-charts-analyzer.git
cd uk-charts-analyzer
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
python server.py
```

The FastAPI server will start at **http://localhost:8000**.  
API docs are available at **http://localhost:8000/docs**.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js app will be served at **http://localhost:3000**.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meta` | Dataset metadata (date range, album types, counts) |
| `GET` | `/api/overview` | Overview KPIs (songs, artists, Gini, top artist) |
| `GET` | `/api/q1` | Artist dominance — Lorenz curve, Gini, rankings |
| `GET` | `/api/q2` | Domestic vs international — entry counts, weekly trends |
| `GET` | `/api/q3` | Collaborations vs solo — stats & track-level data |
| `GET` | `/api/q4` | Explicit content — stats, violin/donut data |
| `GET` | `/api/q5` | Album structure — Pearson r, bin/type stats |

All endpoints accept optional query params: `date_start`, `date_end`, `nationality`, `explicit`, `album_types`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Charts** | Plotly.js, react-plotly.js |
| **3D Effects** | Three.js |
| **Backend** | FastAPI, Uvicorn |
| **Data** | Pandas, NumPy |
| **Icons** | Lucide React |

---

## 📊 Data Source

The dataset (`Atlantic_United_Kingdom.csv`) contains daily chart entries from the **Spotify UK Top 50** playlist, including:

- Song & artist metadata
- Chart position & popularity scores
- Nationality classification (UK / International)
- Explicit content flag
- Album metadata (type, track count, cover URL)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ☕ and data by <strong>ChartLens</strong>
</p>
