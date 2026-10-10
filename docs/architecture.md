# SalonDesk Architecture Documentation

## 1. System Overview
SalonDesk is a modern multi-tenant Salon and Barber Shop Management SaaS application designed for high concurrency, zero-friction POS billing, and strict tenant isolation.

### High-Level Architecture Diagram
```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  React 18 + Vite + Tailwind CSS + Lucide Icons + Framer Motion + Three.js Canvas |
|  - Marketing Website & Cinematic 3D Video Hero                                    |
|  - Cashier POS Billing Terminal (15-second billing, 80mm thermal receipt printing)|
|  - Operations Dashboard & CRM                                                     |
+-----------------------------------------------------------------------------------+
                                        |  HTTPS (JWT + X-Salon-Id)
                                        v
+-----------------------------------------------------------------------------------+
|                                 APPLICATION LAYER                                 |
|                         Python 3.12+ / FastAPI Async REST API                     |
|  - Security & Tenant Context Dependency: Validates JWT & Salon Membership         |
|  - Financial Transaction Engine: Price preservation, tax & discount verification |
|  - ReportLab PDF Receipt Generator (Server-side rendering)                        |
|  - Real-Time Analytics & CSV Export Engine                                        |
+-----------------------------------------------------------------------------------+
                                        |  SQLAlchemy 2.0 ORM
                                        v
+-----------------------------------------------------------------------------------+
|                                  DATA LAYER                                       |
|                  Supabase PostgreSQL / Self-Hosted PostgreSQL                     |
|  - Salons, Profiles, SalonMembers (RBAC: owner, manager, staff)                   |
|  - Invoices, InvoiceItems (frozen unit prices), Payments (Cash, UPI, Card)        |
|  - Customers, Services, Products, Subscriptions, AuditLogs                        |
+-----------------------------------------------------------------------------------+
```

---

## 2. Multi-Tenant Isolation Model

Tenant isolation is enforced through a dual-layer strategy:

1. **Application-Layer Tenant Verification (`get_current_salon_context`)**:
   - Every protected API request extracts the authenticated user from the verified JWT.
   - The target salon is identified via the JWT payload or the `X-Salon-Id` header.
   - The backend explicitly queries `salon_members` to verify that the user possesses an active role (`owner`, `manager`, or `staff`) in that specific salon.
   - If no membership exists, a `403 Forbidden` response is returned immediately.
   - Any attempt by User A from Salon A to query or mutate records from Salon B is rejected with a `403` or `404`.

2. **Database Schema Isolation**:
   - Every tenant-owned table (`customers`, `services`, `products`, `invoices`, `payments`, `subscriptions`, `audit_logs`) contains a mandatory foreign key `salon_id` referencing `salons.id`.
   - In PostgreSQL / Supabase, Row-Level Security (RLS) policies restrict database queries to rows matching the authenticated tenant context.

---

## 3. Financial Calculation & Integrity Rules

- **Zero Trust on Frontend Totals**: The frontend displays calculations for responsive user feedback, but the backend recalculates every financial figure:
  $$\text{Subtotal} = \sum (\text{item.quantity} \times \text{item.unit\_price})$$
  $$\text{Discount Amount} = \begin{cases} \min(\text{subtotal}, \text{discount\_value}) & \text{if fixed} \\ \text{round}\left(\text{subtotal} \times \frac{\text{discount\_value}}{100}, 2\right) & \text{if percent} \end{cases}$$
  $$\text{Taxable Amount} = \max(0, \text{subtotal} - \text{discount\_amount})$$
  $$\text{Tax Amount} = \text{round}\left(\text{taxable\_amount} \times \frac{\text{tax\_rate}}{100}, 2\right)$$
  $$\text{Total Amount} = \text{taxable\_amount} + \text{tax\_amount}$$
- **Historical Price Freezing**: Each `InvoiceItem` record stores the snapshot `unit_price` at the exact moment of billing. Modifying service or product prices in the catalog at a later date never alters past invoice records.
- **Idempotency Protection**: Invoices support an `idempotency_key`. If network latency causes double clicks, the backend returns the already created invoice without duplicate financial records.
