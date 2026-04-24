## Path B — Full-Stack POC

**Stack:** React + Vite + Tailwind CSS · FastAPI · SQLite  
**Deploy to:** Vercel (frontend) + Railway (backend)  
**Use when:** The demo needs a polished UI and a Python API serving ML/GenAI results

### Folder structure

```
poc-[client]-[topic]/
├── POC_SETUP.md
├── .env
├── .gitignore
├── README.md
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── backend/                  # FastAPI app
    ├── main.py               # FastAPI entry point
    ├── routes/
    │   └── api.py
    ├── models/
    │   └── trained/          # saved .pkl files
    ├── data/
    ├── requirements.txt
    └── demo.db               # SQLite database (auto-created)
```

### Backend setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install fastapi uvicorn pandas scikit-learn python-dotenv anthropic
pip freeze > requirements.txt
```

### Deploy — Vercel (frontend)

```
1. Go to vercel.com → New Project → Import your GitHub repo
2. Set Root Directory to: frontend
3. Framework preset: Vite
4. Add environment variable: VITE_API_URL = https://your-railway-url.railway.app
5. Deploy → get a .vercel.app URL instantly
```

### Deploy — Railway (backend)

```
1. Go to railway.app → New Project → Deploy from GitHub repo
2. Set Root Directory to: backend
3. Add environment variables from your .env file
4. Railway auto-detects FastAPI and runs: uvicorn main:app --host 0.0.0.0 --port $PORT
5. Copy the Railway URL → paste into Vercel's VITE_API_URL env var
```

Update `frontend/vite.config.js` for local dev proxy:

```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
}
```
