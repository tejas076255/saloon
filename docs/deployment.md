# SalonDesk Production Deployment Guide

## 1. Architecture Stack Overview
- **Frontend**: React 18 + Vite + Tailwind CSS deployed on **Vercel**.
- **Backend**: Python 3.12+ + FastAPI + SQLAlchemy 2.0 deployed on **Render** (or AWS ECS/Railway).
- **Database & Auth**: **Supabase** Managed PostgreSQL + Supabase Auth / JWT verification.

---

## 2. Supabase Setup (Database & Auth)

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Retrieve the PostgreSQL connection string from **Project Settings -> Database**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
3. Retrieve the **API URL**, **Anon Key**, and **JWT Secret** from **Project Settings -> API**.

---

## 3. Backend Deployment on Render

1. Create a new **Web Service** on Render connected to your Git repository.
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
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   SUPABASE_KEY=[YOUR-SUPABASE-ANON-KEY]
   SUPABASE_JWT_SECRET=[YOUR-SUPABASE-JWT-SECRET]
   CORS_ORIGINS=["https://salondesk.io","https://www.salondesk.io"]
   DEV_MODE_PAYMENTS=false
   ```
4. Deploy the service. Test health check at `https://[YOUR-RENDER-URL]/api/health`.

---

## 4. Frontend Deployment on Vercel

1. Import your Git repository into Vercel.
2. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   ```env
   VITE_API_BASE_URL=https://[YOUR-RENDER-URL]/api/v1
   ```
4. Deploy. Vercel automatically deploys the frontend and routes single-page application requests through `index.html`.

---

## 5. Local Docker Compose (Alternative Local Setup)

To spin up the entire application locally with PostgreSQL in Docker:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/api/v1/docs`
- PostgreSQL: `localhost:5432`
