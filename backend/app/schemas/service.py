from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ServiceCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "scissors"
    display_order: Optional[int] = 0


class ServiceCategoryCreate(ServiceCategoryBase):
    pass


class ServiceCategoryResponse(ServiceCategoryBase):
    id: str
    salon_id: str

    model_config = ConfigDict(from_attributes=True)


class ServiceBase(BaseModel):
    name: str
    category_id: Optional[str] = None
    description: Optional[str] = None
    price: float
    duration_minutes: Optional[int] = 30
    is_active: Optional[bool] = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: str
    salon_id: str
    created_at: datetime
    category: Optional[ServiceCategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)
