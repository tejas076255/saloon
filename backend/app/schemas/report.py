from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class ServiceSalesStat(BaseModel):
    name: str
    count: int
    revenue: float


class DailyReportResponse(BaseModel):
    date: str
    gross_billed: float
    discounts: float
    refunds: float
    net_sales: float
    payments_collected: float
    outstanding_balances: float
    cash_collected: float
    upi_collected: float
    card_collected: float
    invoice_count: int
    popular_services: List[ServiceSalesStat] = []


class SalesReportResponse(BaseModel):
    start_date: str
    end_date: str
    total_gross_billed: float
    total_discounts: float
    total_refunds: float
    total_net_sales: float
    total_payments_collected: float
    total_outstanding: float
    total_invoices: int
    payment_methods_breakdown: Dict[str, float]
    top_services: List[ServiceSalesStat] = []
    daily_breakdown: List[DailyReportResponse] = []
