from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    icon = Column(String(50), default="scissors")
    display_order = Column(Integer, default=0)

    salon = relationship("Salon", back_populates="categories")
    services = relationship("Service", back_populates="category", cascade="all, delete-orphan")


class Service(Base):
    __tablename__ = "services"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), index=True, nullable=False)
    category_id = Column(String(36), ForeignKey("service_categories.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    duration_minutes = Column(Integer, default=30)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    salon = relationship("Salon", back_populates="services")
    category = relationship("ServiceCategory", back_populates="services")
