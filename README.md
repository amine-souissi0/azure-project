# Dawah Platform — MVP

Islamic finance education, halal living guidance, and meaningful charitable giving for modern Muslims.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.12) + SQLAlchemy 2 (async) |
| Database | PostgreSQL 16 |
| Cache / Rate limiting | Redis 7 |
| AI Q&A | Anthropic Claude API (claude-sonnet-4-6) |

| i18n | Arabic (RTL) · French · English |

---

## Quick Start (Docker)

```bash
# 1. Clone and enter the project
cd "islamic daawa"

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Edit backend/.env — add your API keys:
#    SECRET_KEY, GROQ_API_KEY

# 4. Start everything
docker compose up --build

# 5. Run DB migrations (first time only)
docker compose exec backend alembic upgrade head
```

Open `http://localhost:5173` for the frontend.  
Open `http://localhost:8000/docs` for the API explorer (dev mode).

---

## Local Development (without Docker)

### Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env               # then fill in your values

# Start Postgres and Redis locally (or use Docker for just those):
docker compose up db redis -d

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install
cp .env.example .env

npm run dev
```

---

## Generating a Migration

After changing any SQLAlchemy model:

```bash
cd backend
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

---

## Project Structure

```
islamic-daawa/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # REST endpoints (auth, articles, qa, admin)
│   │   ├── core/            # config, database engine, security (JWT, hashing)
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # AI service (Groq)
│   │   └── main.py          # FastAPI app, CORS, lifespan
│   ├── alembic/             # database migrations
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── layout/      # Navbar, Footer, RTLProvider
│       ├── lib/             # api client (axios), i18n init
│       ├── locales/         # en.json, ar.json, fr.json
│       ├── pages/           # Home, Articles, QAChat
│       └── store/           # Zustand: auth, language
│
└── docker-compose.yml
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login → access token |
| GET | `/api/v1/auth/me` | Current user |
| GET | `/api/v1/articles` | List published articles |
| GET | `/api/v1/articles/{slug}` | Article detail |
| POST | `/api/v1/articles` | Create article (admin) |

| POST | `/api/v1/qa/ask` | AI Q&A (rate limited) |
| GET | `/api/v1/admin/stats` | Dashboard stats (admin) |
| GET | `/health` | Health check |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Async Postgres URL (`postgresql+asyncpg://...`) |
| `DATABASE_URL_SYNC` | Sync URL for Alembic migrations (`postgresql+psycopg2://...`) |
| `REDIS_URL` | Redis URL |
| `SECRET_KEY` | JWT signing key — generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `GROQ_API_KEY` | Groq API key for AI Q&A (get free key at https://console.groq.com) |
| `FRONTEND_URL` | Used for CORS (e.g. `http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (e.g. `http://localhost:8000`) |

---

## Next Steps

1. **Seed content** — add initial articles via `/api/v1/articles` (POST as admin)
2. **Stripe** — wire up real checkout in `donations.py` → `stripe.checkout.sessions.create`
3. **Webhook** — complete `stripe_webhook` endpoint to mark donations `completed`
4. **Admin dashboard** — build React admin pages using `/api/v1/admin/stats`
5. **Telegram bot** — webhook-based, reads articles and answers Q&A
6. **Markdown rendering** — add `react-markdown` for article body rendering
7. **Auth pages** — build `/login` and `/register` UI pages

---

## Creating the First Admin User

```bash
# After running migrations, open a Python shell in the backend container:
docker compose exec backend python

>>> from app.core.database import AsyncSessionLocal
>>> from app.models.user import User
>>> from app.core.security import hash_password
>>> import asyncio, uuid

>>> async def make_admin():
...     async with AsyncSessionLocal() as db:
...         admin = User(email="admin@example.com", name="Admin",
...                      hashed_password=hash_password("changeme"), role="admin")
...         db.add(admin)
...         await db.commit()

>>> asyncio.run(make_admin())
```
