# SalonDesk REST API Specification

Version: `v1`  
Base URL: `http://localhost:8000/api/v1` (Dev) / `https://api.salondesk.io/api/v1` (Production)

---

## 1. Authentication & Profiles (`/auth`)

### `POST /auth/signup`
Creates user account, salon workspace, owner membership, 14-day trial, and starter services.
- **Request Body**:
  ```json
  {
    "email": "owner@salon.com",
    "password": "Password123!",
    "full_name": "Vikram Singh",
    "phone": "+91 98765 43210",
    "salon_name": "Royale Barbershop"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "salon_id": "1ae686e1-...",
    "role": "owner",
    "user": { "id": "...", "email": "...", "full_name": "..." }
  }
  ```

### `POST /auth/login`
Authenticates existing user and returns JWT bearer token.
- **Request Body**:
  ```json
  { "email": "owner@salon.com", "password": "Password123!" }
  ```

### `GET /auth/me`
Returns authenticated user profile and list of associated salon memberships.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Salon Workspace (`/salons`)

### `GET /salons/current`
Returns active salon profile, settings, currency, and tax rate.

### `PATCH /salons/current`
Updates salon configuration (Requires `owner` or `manager` role).
- **Request Body**:
  ```json
  {
    "name": "Updated Salon Name",
    "tax_rate": 18.0,
    "currency": "₹",
    "phone": "+91 98200 12345"
  }
  ```

---

## 3. Customers (`/customers`)

### `GET /customers`
Lists customers in current salon workspace with optional search query.
- **Query Params**: `search` (name or phone), `skip`, `limit`

### `POST /customers`
Creates a customer profile. Prevents duplicate phone entries in the same salon.
- **Request Body**:
  ```json
  {
    "name": "Rajesh Kumar",
    "phone": "+91 98920 11223",
    "preferences": "Skin fade with zero machine, tea without sugar"
  }
  ```

### `GET /customers/{customer_id}`
Returns customer details and complete previous invoice history.

---

## 4. POS Billing & Invoices (`/invoices`)

### `POST /invoices`
Generates a new invoice with backend financial calculation validation, inventory deduction, and unique invoice numbering.
- **Request Body**:
  ```json
  {
    "customer_id": "optional-customer-uuid",
    "customer_name": "Rahul Verma",
    "customer_phone": "+91 98111 22334",
    "idempotency_key": "unique-client-key-12345",
    "items": [
      {
        "item_type": "service",
        "service_id": "service-uuid",
        "name": "Classic Fade Haircut",
        "quantity": 1,
        "unit_price": 350.0
      }
    ],
    "discount_type": "fixed",
    "discount_value": 50.0,
    "tax_rate": 18.0,
    "payments": [
      { "amount": 354.0, "payment_method": "UPI", "reference_id": "UPI-UTR-9988" }
    ]
  }
  ```
- **Response `201 Created`**: Returns full `InvoiceResponse` with status `PAID`, `balance_amount: 0.0`.

### `GET /invoices`
Lists invoices with search and status filtering (`PAID`, `PARTIAL`, `CANCELLED`, `REFUNDED`).

### `GET /invoices/{invoice_id}/pdf`
Returns direct `application/pdf` binary download rendered with ReportLab.

### `POST /invoices/{invoice_id}/cancel`
Cancels bill and records an audit log entry.

### `POST /invoices/{invoice_id}/refund`
Issues refund and marks status `REFUNDED` with audit trail.

---

## 5. Reports & Analytics (`/reports`)

### `GET /reports/daily`
Returns today's or specified date's report:
- `gross_billed`: Total billed before discounts and refunds
- `discounts`: Total promotional markdowns
- `refunds`: Total refunded amounts
- `net_sales`: `gross_billed - discounts - refunds`
- `payments_collected`: Sum of payments received
- `cash_collected`, `upi_collected`, `card_collected`: Breakdown by channel
- `popular_services`: Top services ranked by revenue

### `GET /reports/sales`
Returns range analytics for specified start and end dates.

### `GET /reports/export`
Returns direct `text/csv` spreadsheet download of all invoices in date range.

---

## 6. Subscriptions (`/subscriptions`)

### `GET /subscriptions/current`
Returns current plan details (`starter` ₹299, `pro` ₹699, `business` ₹1299), trial days left, and dev mode indicator.

### `POST /subscriptions/upgrade`
Switches salon subscription plan in development sandbox mode.
