# SalonDesk Production Deployment Guide

## 1. Primary Architecture: Cloudflare Full-Stack Edge (Recommended)
- **Frontend & Edge API**: React 18 + Vite + Tailwind CSS deployed on **Cloudflare Pages** with Pages Functions (`frontend/functions/api/[[route]].ts`).
- **Database**: **Cloudflare D1** distributed SQLite relational database (`salondesk-db`).
- **Authentication**: High-performance Edge JWT signing & verification (HMAC-SHA256 WebCrypto) with `bcryptjs` password hashing.
- **Production URL**: `https://salondesk.pages.dev`

---

## 2. Cloudflare Pages & D1 Deployment

### Prerequisites
- Node.js 18+ and `npm`
- Cloudflare Account & API Token / Global API Key
- Cloudflare Wrangler CLI (`npx wrangler`)

### Step 1: D1 Database Setup
1. Create the D1 database:
   ```bash
   npx wrangler d1 create salondesk-db
   ```
2. Note the returned `database_id` and update `frontend/wrangler.toml`:
   ```toml
   name = "salondesk"
   pages_build_output_dir = "./dist"
   compatibility_date = "2026-10-06"
   compatibility_flags = ["nodejs_compat"]

   [[d1_databases]]
   binding = "DB"
   database_name = "salondesk-db"
   database_id = "YOUR_DATABASE_ID"

   [vars]
   JWT_SECRET = "your-secure-jwt-secret-key"
   ENVIRONMENT = "production"
   ```
3. Run the database migration:
   ```bash
   npx wrangler d1 execute salondesk-db --remote --file=./d1_migration.sql
   ```
4. Seed demo admin and catalog data:
   ```bash
   npx wrangler d1 execute salondesk-db --remote --file=./seed_admin.sql
   ```

### Step 2: Build & Deploy Frontend with Edge Functions
From the `frontend` directory:
```bash
npm run build
npx wrangler pages deploy dist --project-name=salondesk
```

---

## 3. Alternative Backend: Python FastAPI on Render / Docker

If running the Python 3.12 FastAPI backend:

1. Create a **Web Service** on Render connected to the Git repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   ```env
   PROJECT_NAME=SalonDesk Premium SaaS
   API_V1_STR=/api/v1
   SECRET_KEY=generate-a-cryptographically-secure-random-key-for-prod
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   CORS_ORIGINS=["https://salondesk.pages.dev","https://salondesk.io"]
   DEV_MODE_PAYMENTS=false
   ```
4. Test health check at `https://[YOUR-RENDER-URL]/api/health`.

---

## 4. Local Docker Compose Setup

To spin up the entire application locally with PostgreSQL in Docker:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/api/v1/docs`
- PostgreSQL: `localhost:5432`
