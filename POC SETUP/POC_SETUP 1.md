# Algoleap POC Project Setup Guide
> **Add this file as `POC_SETUP.md` at the root of every new POC repo before writing any code.**  
> Follow the steps in order. The whole setup should take under 30 minutes.
---
## Step 1 — Create the Version Control Workspace
Initialize a new GitHub repo, or if security constraints require a strictly local development environment, intentionally omit `.git` initialization.
---
## Step 2 — Environment Files
Create a `.env` file at the project root. **Never commit this file to GitHub.**

```bash
touch .env
echo ".env" >> .gitignore
```

Paste the template below and fill in your keys:
|---|---|---||---|---|---||---|---|---||---|---|---|
```env
# ── GenAI APIs ──────────────────────────────────────────────
# OpenRouter (use for unified access to multiple LLM models)
OPENROUTER_API_KEY=your_openrouter_api_key_here
# Register at: https://openrouter.ai/keys
# Important: use a SEPARATE key from the one configured in Antigravity IDE

# Claude (use for final demo delivery only)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# Register at: https://console.anthropic.com
# Models: claude-haiku-4-5 (fast/cheap), claude-sonnet-4-6 (best quality)



# ── Database (RAG projects only) ─────────────────────────────
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
# Register at: https://supabase.com — free 500MB tier

# ── App Config ───────────────────────────────────────────────
APP_ENV=development
PORT=8000
```
## Step 3 — Initial Documentation Setup
1. **README.md**: Document the POC type, key functionalities, key features, and a step-by-step sequential blueprint.
2. **Data Segregation**: If utilizing mock or synthetic data, build a `/data` folder designed strictly for ingestion, preserving separation between raw datasets and backend loading scripts.
---
## Step 4 — Architectural Documentation
Create a `Docs/` or `Architecture/` folder. Beyond the initial README, distinctly separate complex theoretical models, framework descriptions, and project system strategies into dedicated markdown files here to prevent repository root clutter.
---
## Step 5 — Identify Your POC Type
Choose one path below. If your POC spans multiple types (e.g. an ML model served via a React dashboard), follow the **Full-Stack** path — it includes everything.

| POC Type | What it involves | Go to |
|---|---|---|
| **ML / Data** | Prediction, scoring, anomaly detection, dashboards | [Path A](path-a--ml--data-poc.md) |
| **Full-Stack** | React frontend + FastAPI backend + ML or GenAI | [Path B](path-b--full-stack-poc.md) |
| **GenAI / Agent** | LangGraph agents, tool use, multi-agent orchestration | [Path C](path-c--genai--agent-poc.md) |
| **RAG** | Document Q&A, knowledge base, semantic search | [Path D](path-d--rag-poc.md) |


## Step 6 — Configure Antigravity IDE Rules
### Project-level rules (add to each POC repo)

Create this folder and file at the root of every new POC project:

```bash
mkdir -p .antigravity/rules
```

Then create `.antigravity/rules/poc-rules.mdc` with the following content — edit the top section for each POC:

```markdown
---
description: Algoleap POC project rules — auto-applied to all agent sessions
---

# POC Context
- Client: [CLIENT NAME]
- POC type: [ML / Full-Stack / GenAI-Agent / RAG]
- Stack: FastAPI + [React+Vite / Streamlit] + [SQLite / Supabase]
- Deploy target: [Vercel + Railway / Streamlit Community Cloud]

# Scope boundaries
- Maintain absolute separation of concerns: App UI in `/frontend` and API/LLM orchestration nodes in `/backend`.
- Do not touch .env, .gitignore, or POC_SETUP.md
- Do not modify trained model files in /models/trained/
- All new Python files must have a requirements entry if they add a new package

# Naming conventions
- Python functions: snake_case
- React components: PascalCase, file name matches component name
- API routes: /api/[resource] — plural nouns, no verbs
- SQLite tables: snake_case, plural

# Demo data rules
- All data is synthetic — never ask for or use real client data
- Synthetic datasets go in /data/raw/ before processing
- Processed datasets go in /data/processed/

# Commit message format
- feat: short description (new feature)
- fix: short description (bug fix)
- data: short description (data changes)
- docs: short description (docs only)
```

## Step 7 — Final Checks Before Local Test / First Commit

Run through this checklist before executing the code locally or pushing to GitHub:

```
[ ] .env is listed in .gitignore — verify with: git status (should NOT show .env)
[ ] All API keys are in .env only — not hardcoded in any .py or .js file
[ ] Repo is set to Private on GitHub
[ ] Repo name follows convention: poc-[client]-[topic]
[ ] requirements.txt exists and is up to date: pip freeze > requirements.txt
[ ] App runs locally without errors before first push
[ ] README.md has: client name, POC type, how to run locally, demo URL (add after deploy)
```

### First commit

```bash
git add .
git commit -m "feat: initial POC scaffold — [client] [topic]"
git push origin main
```