# 🎵 ChartLens: UK Music Charts Analyzer

**ChartLens** is a high-performance, interactive analytics dashboard designed to visualize and analyze UK music charts data. Built with a modern full-stack architecture, it combines the power of **Next.js** for a seamless user experience and **FastAPI** for robust data processing.

![ChartLens Preview](https://via.placeholder.com/1200x600/111111/FFFFFF?text=ChartLens+Analytics+Dashboard)

## ✨ Features

- **Interactive Visualizations**: Deep dive into chart trends with interactive **Plotly.js** charts.
- **Immersive UI**: Stunning 3D backgrounds and smooth transitions powered by **Three.js** and **Framer Motion**.
- **Real-time Analytics**: High-speed data processing using **Pandas** and **NumPy** in a FastAPI backend.
- **Modern Design**: A sleek, dark-themed interface built with **Tailwind CSS 4** and **Shadcn UI** components.
- **Global Filtering**: Easily filter data by date, artist, or genre to find specific insights.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 16 (React 19)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Three.js](https://threejs.org/)
- **Charts**: [Plotly.js](https://plotly.com/javascript/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Data Processing**: [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

### Deployment
- **Platform**: [Vercel](https://vercel.com/) (Hybrid Frontend + Python Serverless Functions)

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.9+
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ansiuualt/ChartLens.git
   cd uk-charts-analyzer
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   ```

3. **Setup Backend**:
   ```bash
   cd ..
   pip install -r requirements.txt
   ```

### Running Locally

To run the full-stack application locally:

1. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

2. **Start the Backend API**:
   You can run the FastAPI server directly for development:
   ```bash
   # From the root directory
   uvicorn api.index:app --reload --port 8000
   ```
   *Note: The Next.js frontend is configured to proxy `/api` requests to the Python backend as defined in `vercel.json`.*

## 📁 Project Structure

```text
.
├── api/                # Vercel serverless functions (FastAPI)
├── backend/            # Python data processing scripts & raw data
│   ├── pipeline/       # Data cleaning and transformation scripts
│   └── *.csv           # UK Charts dataset
├── frontend/           # Next.js 16 web application
│   ├── app/            # App router pages
│   ├── components/     # Reusable UI components
│   └── lib/            # Utility functions
├── vercel.json         # Deployment configuration for Vercel
└── requirements.txt    # Python dependencies
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Ansiuualt](https://github.com/Ansiuualt)
