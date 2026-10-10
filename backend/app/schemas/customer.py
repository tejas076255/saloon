from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    notes: Optional[str] = None
    preferences: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    notes: Optional[str] = None
    preferences: Optional[str] = None


class CustomerResponse(CustomerBase):
    id: str
    salon_id: str
    total_visits: int
    total_spent: float
    last_visit_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
