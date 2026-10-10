export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
}

export interface Salon {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  currency: string;
  tax_rate: number;
  tax_name: string;
  timezone: string;
  is_active: boolean;
  role?: string;
}

export interface Customer {
  id: string;
  salon_id: string;
  name: string;
  phone?: string;
  email?: string;
  gender?: string;
  notes?: string;
  preferences?: string;
  total_visits: number;
  total_spent: number;
  last_visit_at?: string;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  salon_id: string;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
}

export interface ServiceItem {
  id: string;
  salon_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  category?: ServiceCategory;
}

export interface ProductItem {
  id: string;
  salon_id: string;
  name: string;
  sku?: string;
  barcode?: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
}

export interface InvoiceItem {
  id?: string;
  item_type: 'service' | 'product';
  service_id?: string;
  product_id?: string;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface PaymentItem {
  id?: string;
  amount: number;
  payment_method: 'CASH' | 'UPI' | 'CARD';
  reference_id?: string;
  is_verified?: boolean;
  notes?: string;
  created_at?: string;
}

export interface Invoice {
  id: string;
  salon_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  invoice_number: string;
  idempotency_key?: string;
  subtotal: number;
  discount_type: 'fixed' | 'percent';
  discount_value: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'CANCELLED' | 'REFUNDED';
  notes?: string;
  created_at: string;
  items: InvoiceItem[];
  payments: PaymentItem[];
}

export interface DailyReport {
  date: string;
  gross_billed: number;
  discounts: number;
  refunds: number;
  net_sales: number;
  payments_collected: number;
  outstanding_balances: number;
  cash_collected: number;
  upi_collected: number;
  card_collected: number;
  invoice_count: number;
  popular_services: { name: string; count: number; revenue: number }[];
}

export interface SalesReport {
  start_date: string;
  end_date: string;
  total_gross_billed: number;
  total_discounts: number;
  total_refunds: number;
  total_net_sales: number;
  total_payments_collected: number;
  total_outstanding: number;
  total_invoices: number;
  payment_methods_breakdown: Record<string, number>;
  top_services: { name: string; count: number; revenue: number }[];
  daily_breakdown: DailyReport[];
}

export interface PlanTier {
  id: string;
  name: string;
  price_inr: number;
  billing_cycle: string;
  tagline: string;
  features: string[];
  max_staff: number;
  max_invoices_per_month: number;
  is_popular: boolean;
}

export interface Subscription {
  id: string;
  salon_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  billing_cycle: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  is_dev_mode: boolean;
  max_staff: number;
  max_invoices_per_month: number;
  days_remaining: number;
  available_plans: PlanTier[];
}
