from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class InvoiceItemCreate(BaseModel):
    item_type: str = "service"
    service_id: Optional[str] = None
    product_id: Optional[str] = None
    name: str
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(ge=0.0)


class PaymentCreate(BaseModel):
    amount: float = Field(gt=0.0)
    payment_method: str = "CASH"
    reference_id: Optional[str] = None
    notes: Optional[str] = None


class InvoiceCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: Optional[str] = None
    idempotency_key: Optional[str] = None
    
    items: List[InvoiceItemCreate] = Field(min_length=1)
    
    discount_type: str = "fixed"
    discount_value: float = Field(default=0.0, ge=0.0)
    
    tax_rate: Optional[float] = None
    
    payments: List[PaymentCreate] = Field(default_factory=list)
    notes: Optional[str] = None


class InvoiceItemResponse(BaseModel):
    id: str
    item_type: str
    service_id: Optional[str] = None
    product_id: Optional[str] = None
    name: str
    quantity: int
    unit_price: float
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class PaymentResponse(BaseModel):
    id: str
    amount: float
    payment_method: str
    reference_id: Optional[str] = None
    is_verified: bool
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InvoiceResponse(BaseModel):
    id: str
    salon_id: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: Optional[str] = None
    invoice_number: str
    idempotency_key: Optional[str] = None
    
    subtotal: float
    discount_type: str
    discount_value: float
    discount_amount: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    paid_amount: float
    balance_amount: float
    
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    items: List[InvoiceItemResponse] = []
    payments: List[PaymentResponse] = []

    model_config = ConfigDict(from_attributes=True)


class InvoiceActionRequest(BaseModel):
    reason: Optional[str] = "Customer request"
