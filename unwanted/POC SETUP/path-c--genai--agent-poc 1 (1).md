## Path C — GenAI / Agent POC

**Stack:** FastAPI · LangGraph · Claude API · SQLite  
**Deploy to:** Vercel + Railway  
**Use when:** The demo involves multi-agent orchestration, tool use, or agentic workflows

### Folder structure

```
poc-[client]-[topic]/
├── POC_SETUP.md
├── .env
├── .gitignore
├── README.md
├── frontend/                 # React + Vite (reuse Path B frontend)
└── backend/
    ├── main.py
    ├── requirements.txt
    ├── agents/
    │   ├── __init__.py
    │   ├── graph.py          # LangGraph state machine definition
    │   ├── nodes.py          # individual agent node functions
    │   ├── tools.py          # tool definitions (search, DB, API calls)
    │   └── state.py          # shared state schema
    ├── data/
    │   └── demo.db
    └── routes/
        └── api.py
```

### Agent backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install fastapi uvicorn langgraph langchain-anthropic langchain-google-genai \
            python-dotenv anthropic
pip freeze > requirements.txt
```

### LangSmith tracing (optional but recommended for client demos)

LangSmith shows a live trace of every agent decision — compelling to show clients as proof of engineering depth.

```bash
pip install langsmith
```

Add to `.env`:

```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_PROJECT=poc-[client]-[topic]
# Register free at: https://smith.langchain.com
```

When running a demo, open `smith.langchain.com` → show the client the agent trace in real time.