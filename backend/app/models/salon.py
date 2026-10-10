from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Float, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Salon(Base):
    __tablename__ = "salons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    tagline = Column(String(255), default="Luxury Salon & Grooming Studio")
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), default="Mumbai")
    currency = Column(String(10), default="₹")
    tax_rate = Column(Float, default=18.0)  # GST / VAT percentage
    tax_name = Column(String(50), default="GST")
    timezone = Column(String(50), default="Asia/Kolkata")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    members = relationship("SalonMember", back_populates="salon", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="salon", cascade="all, delete-orphan")
    services = relationship("Service", back_populates="salon", cascade="all, delete-orphan")
    categories = relationship("ServiceCategory", back_populates="salon", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="salon", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="salon", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="salon", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="salon", uselist=False, cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="salon", cascade="all, delete-orphan")
