from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PlanTier(BaseModel):
    id: str
    name: str
    price_inr: float
    billing_cycle: str
    tagline: str
    features: List[str]
    max_staff: int
    max_invoices_per_month: int
    is_popular: bool = False


class SubscriptionResponse(BaseModel):
    id: str
    salon_id: str
    plan_id: str
    plan_name: str
    status: str
    billing_cycle: str
    amount: float
    current_period_start: datetime
    current_period_end: datetime
    is_dev_mode: bool
    max_staff: int
    max_invoices_per_month: int
    days_remaining: int
    available_plans: List[PlanTier] = []

    model_config = ConfigDict(from_attributes=True)


class PlanChangeRequest(BaseModel):
    plan_id: str
    billing_cycle: Optional[str] = "monthly"
