## Path D — RAG POC

**Stack:** FastAPI · LangGraph · Claude API · Supabase (pgvector)  
**Deploy to:** Vercel + Railway  
**Use when:** The demo involves document Q&A, knowledge base chatbot, or semantic search

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
    ├── rag/
    │   ├── __init__.py
    │   ├── ingest.py         # load, chunk, embed, and store documents
    │   ├── retrieve.py       # semantic search against Supabase pgvector
    │   └── pipeline.py       # end-to-end RAG chain
    ├── data/
    │   └── documents/        # PDFs, CSVs, or text files to ingest
    └── routes/
        └── api.py
```

### RAG backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install fastapi uvicorn anthropic langchain langchain-anthropic \
            langchain-google-genai langchain-community supabase \
            pypdf python-dotenv tiktoken
pip freeze > requirements.txt
```

### Supabase pgvector table setup

Run this SQL in your Supabase project's SQL editor (Dashboard → SQL Editor):

```sql
-- Enable vector extension
create extension if not exists vector;

-- Create documents table
create table documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(768)   -- 768 dims for Gemini embeddings
);

-- Create similarity search function
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table (id bigint, content text, metadata jsonb, similarity float)
language sql stable
as $$
  select id, content, metadata, 1 - (embedding <=> query_embedding) as similarity
  from documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
```

### Starter `backend/rag/ingest.py`

```python
import os
from supabase import create_client
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
embedder = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def ingest_pdf(file_path: str, metadata: dict = {}):
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(pages)

    for chunk in chunks:
        embedding = embedder.embed_query(chunk.page_content)
        supabase.table("documents").insert({
            "content": chunk.page_content,
            "metadata": {**metadata, "source": file_path},
            "embedding": embedding
        }).execute()

    print(f"Ingested {len(chunks)} chunks from {file_path}")
```

### Starter `backend/rag/retrieve.py`

```python
import os
from supabase import create_client
from langchain_google_genai import GoogleGenerativeAIEmbeddings

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
embedder = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def retrieve(query: str, top_k: int = 5) -> list[dict]:
    query_embedding = embedder.embed_query(query)
    result = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_threshold": 0.5,
        "match_count": top_k
    }).execute()
    return result.data
```

### Starter `backend/rag/pipeline.py`

```python
import os
from anthropic import Anthropic
from .retrieve import retrieve

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def answer(question: str) -> dict:
    # Step 1: retrieve relevant chunks
    chunks = retrieve(question, top_k=5)
    context = "\n\n".join([c["content"] for c in chunks])

    # Step 2: generate answer with Claude
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="You are a helpful assistant. Answer the question using only the provided context. If the answer is not in the context, say so clearly.",
        messages=[{
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {question}"
        }]
    )

    return {
        "answer": response.content[0].text,
        "sources": [{"content": c["content"][:200], "metadata": c["metadata"]} for c in chunks]
    }
```

### RAG API endpoint

```python
# backend/routes/api.py
from fastapi import APIRouter
from rag.pipeline import answer
from rag.ingest import ingest_pdf

router = APIRouter()

@router.post("/ask")
def ask(payload: dict):
    return answer(payload["question"])

@router.post("/ingest")
def ingest(payload: dict):
    ingest_pdf(payload["file_path"], payload.get("metadata", {}))
    return {"status": "ingested"}
```
