from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    sku: Optional[str] = None
    barcode: Optional[str] = None
    price: float
    cost_price: Optional[float] = 0.0
    stock_quantity: Optional[int] = 0
    low_stock_threshold: Optional[int] = 5
    is_active: Optional[bool] = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    price: Optional[float] = None
    cost_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    salon_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
