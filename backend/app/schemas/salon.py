from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SalonBase(BaseModel):
    name: str
    tagline: Optional[str] = "Luxury Salon & Grooming Studio"
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "Mumbai"
    currency: Optional[str] = "₹"
    tax_rate: Optional[float] = 18.0
    tax_name: Optional[str] = "GST"
    timezone: Optional[str] = "Asia/Kolkata"


class SalonCreate(SalonBase):
    pass


class SalonUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    currency: Optional[str] = None
    tax_rate: Optional[float] = None
    tax_name: Optional[str] = None
    timezone: Optional[str] = None


class SalonResponse(SalonBase):
    id: str
    slug: str
    is_active: bool
    created_at: datetime
    role: Optional[str] = "owner"

    model_config = ConfigDict(from_attributes=True)
