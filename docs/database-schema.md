# SalonDesk Database Schema Documentation

## 1. Entity Relationship Overview

The SalonDesk database schema comprises 10 core tables designed for multi-tenant isolation, price freezing, split payments, and immutable audit logging.

```
       +-------------------+
       |      salons       |<-----------------+
       +-------------------+                  |
         ^        ^       ^                   |
         |        |       |                   |
         |        |       +---------------+   |
         |        |                       |   |
  +------+--+   +-+--------+        +-----+---+--+
  |  users  |   |customers |        |  services  |
  +---------+   +----------+        +------------+
       ^              ^                   ^
       |              |                   |
+------+------+   +---+------+      +-----+------+
|salon_members|   | invoices |<---->|invoice_items|
+-------------+   +----------+      +------------+
                       ^
                       |
                  +----+----+
                  | payments|
                  +---------+
```

---

## 2. Table Specifications

### 2.1 `salons`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID string |
| `name` | VARCHAR(255) | NOT NULL | Registered salon business name |
| `slug` | VARCHAR(100) | UNIQUE, INDEX | URL slug identifier |
| `tagline` | VARCHAR(255) | NULLABLE | Tagline printed on receipts |
| `phone` | VARCHAR(50) | NULLABLE | Business contact phone |
| `email` | VARCHAR(255) | NULLABLE | Business contact email |
| `address` | TEXT | NULLABLE | Physical shop address |
| `city` | VARCHAR(100) | DEFAULT 'Mumbai' | City location |
| `currency` | VARCHAR(10) | DEFAULT '₹' | Currency symbol |
| `tax_rate` | FLOAT | DEFAULT 18.0 | Default tax percentage (GST / VAT) |
| `tax_name` | VARCHAR(50) | DEFAULT 'GST' | Tax label on receipts |
| `timezone` | VARCHAR(50) | DEFAULT 'Asia/Kolkata' | Timezone for report boundaries |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active workspace flag |
| `created_at` | DATETIME | NOT NULL | Creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

### 2.2 `users` & `salon_members`
- `users`: Stores global user accounts (`id`, `email`, `hashed_password`, `full_name`, `phone`, `is_active`).
- `salon_members`: Maps users to specific salons with role-based access control (`id`, `salon_id`, `user_id`, `role`: `owner` \| `manager` \| `staff`, `is_active`).

### 2.3 `customers`
- Stores client profiles with visit counters and lifetime spending (`id`, `salon_id`, `name`, `phone`, `email`, `notes`, `preferences`, `total_visits`, `total_spent`, `last_visit_at`).

### 2.4 `services` & `service_categories`
- `service_categories`: Categorizes salon services (`Haircut`, `Beard`, `Facial & Spa`).
- `services`: Master catalog of salon treatments (`id`, `salon_id`, `category_id`, `name`, `description`, `price`, `duration_minutes`, `is_active`).

### 2.5 `products`
- Retail items and salon inventory (`id`, `salon_id`, `name`, `sku`, `barcode`, `price`, `cost_price`, `stock_quantity`, `low_stock_threshold`, `is_active`).

### 2.6 `invoices` & `invoice_items`
- `invoices`: Master bill record with immutable financial totals (`id`, `salon_id`, `customer_id`, `customer_name`, `customer_phone`, `invoice_number`, `idempotency_key`, `subtotal`, `discount_type`, `discount_value`, `discount_amount`, `tax_rate`, `tax_amount`, `total_amount`, `paid_amount`, `balance_amount`, `status`: `PAID` \| `PARTIAL` \| `UNPAID` \| `CANCELLED` \| `REFUNDED`).
- `invoice_items`: Snapshot of items sold, preserving historical prices (`id`, `invoice_id`, `item_type`, `service_id`, `product_id`, `name`, `quantity`, `unit_price`, `subtotal`).

### 2.7 `payments`
- Records payment transactions (`id`, `salon_id`, `invoice_id`, `amount`, `payment_method`: `CASH` \| `UPI` \| `CARD` \| `SPLIT`, `reference_id`, `is_verified`).

### 2.8 `subscriptions`
- Tiered SaaS billing status (`id`, `salon_id`, `plan_id`: `starter` \| `pro` \| `business`, `status`: `trial` \| `active`, `amount`, `current_period_end`, `is_dev_mode`).

### 2.9 `audit_logs`
- Financial mutations and void logging (`id`, `salon_id`, `user_id`, `action`, `resource_type`, `resource_id`, `details`, `created_at`).
