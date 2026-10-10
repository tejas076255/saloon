# SalonDesk — Premium Multi-Tenant Salon Management SaaS

![SalonDesk](https://img.shields.io/badge/SalonDesk-Premium%20SaaS-7c3aed?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1%20SQLite-Serverless-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

SalonDesk is an all-in-one salon and barber shop management system engineered for modern barber shops, hair studios, beauty parlours, and unisex salons. Built with a cinematic luxury 3D hero landing page and a blazing-fast 15-second cashier POS billing terminal.

---

## 🌟 Key Features

### 1. Cinematic 3D Video Hero Experience
- Genuine 1280x720 30fps luxury salon environment video asset (`frontend/public/videos/salon-hero.mp4`) rendered with smooth cinematic camera zoom and pan.
- Three.js interactive ambient particle canvas with dynamic mouse tracking and gold/violet orbital rings.
- Floating luxury tablet and responsive smartphone mockups showcasing live POS operations.
- Dark navy and obsidian foundation with glowing violet/purple neon accents.

### 2. High-Speed POS Billing Terminal
- **Zero-Friction Client Identification**: Search clients by phone or name, or bill walk-ins with zero mandatory personal data.
- **Service & Retail Catalog**: Quick service selectors with duration indicators and real-time inventory deduction for retail products.
- **Strict Backend Financial Calculations**: Automatic GST/VAT computation, flat or percentage discount validation, and historical price freezing.
- **Multi-Method Payments**: Cash, UPI with UTR reference verification, Card, and split payments on a single invoice.
- **Idempotency Protection**: Unique transaction keys prevent double-charging on network lag or duplicate clicks.

### 3. Receipts & Sharing Channels
- **Thermal Printer Support**: Direct 80mm thermal receipt formatted for USB, Bluetooth, or WiFi POS receipt printers (`window.print()`).
- **Official Tax PDF**: Server-side branded PDF invoices rendered with ReportLab.
- **WhatsApp Receipts**: 1-click WhatsApp button generating customized pre-filled thank-you messages with invoice numbers and totals.

### 4. Multi-Tenant Security & Isolation
- Isolated salon workspaces where each salon's data is strictly partitioned.
- Server-side JWT bearer authentication and role verification (`owner`, `manager`, `staff`).
- Cross-tenant intrusion prevention: User A from Salon A is strictly blocked from viewing or mutating Salon B's records (`403 Forbidden`).
- Immutable financial audit log for voids, cancellations, and refunds.

### 5. Real-Time Reports & Analytics
- Daily, 7-day, and 30-day reporting intervals aligned with the salon's configured timezone.
- Formula: $\text{Net Sales} = \text{Gross Billed} - \text{Discounts} - \text{Refunds}$.
- Channel breakdown: Cash in register vs UPI bank settlements vs Card swipes.
- 1-click formatted CSV spreadsheet export.

### 6. SaaS Subscription Architecture
- Three pricing tiers:
  - **Starter**: ₹299/month (Solo stylists & barbers)
  - **Pro**: ₹699/month (Most popular for busy salons)
  - **Business**: ₹1,299/month (Uncapped multi-chair luxury studios)
- 14-day free trial auto-provisioned upon registration.
- Clearly distinguished development sandbox mode.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ & npm
- Python 3.12+

### 1. Clone & Setup Backend
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## 🧪 Running Automated Tests

Run the Pytest backend test suite covering authentication, cross-tenant isolation, invoice calculations, idempotency, and daily report math:

```bash
cd backend
.venv\Scripts\pytest -v
```

Expected Output:
```
tests/test_auth.py::test_signup_and_login_flow PASSED                    [ 25%]
tests/test_invoices.py::test_invoice_financial_calculations_and_history PASSED [ 50%]
tests/test_reports.py::test_daily_and_sales_reports PASSED               [ 75%]
tests/test_tenancy.py::test_multi_tenant_isolation PASSED                [100%]
======================== 4 passed in 1.93s =========================
```

Run the live integration verification script:
```bash
python verify_live_api.py
```

---

## 📁 Repository Structure

```
saloon/
├── frontend/                     # React 18 + Vite + TypeScript + Tailwind CSS
│   ├── public/
│   │   ├── videos/salon-hero.mp4 # 3D cinematic salon video asset
│   │   └── posters/              # 4K fallback poster
│   ├── src/
│   │   ├── components/hero/      # Three.js Canvas, Tablet & Mobile Mockups
│   │   ├── components/billing/   # POS Terminal, Thermal Receipts, Invoices
│   │   ├── components/customers/ # Customer CRM and history
│   │   ├── components/services/  # Menu and retail inventory
│   │   ├── components/reports/   # Daily reports & CSV export
│   │   ├── lib/api/              # Unified API client & AuthContext
│   │   └── pages/                # LandingPage and DashboardPage
├── backend/                      # Python 3.12 + FastAPI + SQLAlchemy 2.0
│   ├── app/
│   │   ├── api/v1/endpoints/     # Auth, Salons, Invoices, Reports, Subscriptions
│   │   ├── core/                 # JWT security & pydantic settings
│   │   ├── models/               # Multi-tenant SQLAlchemy models
│   │   ├── schemas/              # Pydantic v2 schemas
│   │   └── services/             # Invoice engine, ReportLab PDF, Reports
│   └── tests/                    # Pytest isolation and billing test suites
├── docs/                         # Architecture, Database, API, and Deployment guides
├── docker-compose.yml            # Multi-container orchestration
└── render_hero_video.py          # Cinematic video generator
```

---

## 🛡️ License
Proprietary SaaS product template built for SalonDesk Technologies.
