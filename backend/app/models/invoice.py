from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), index=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), index=True, nullable=True)
    customer_name = Column(String(255), nullable=False)  # Walk-in customer or name snapshot
    customer_phone = Column(String(50), nullable=True)
    
    invoice_number = Column(String(50), nullable=False, index=True)
    idempotency_key = Column(String(100), nullable=True, index=True)
    
    subtotal = Column(Float, nullable=False, default=0.0)
    discount_type = Column(String(20), default="fixed")  # "fixed" or "percent"
    discount_value = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    tax_rate = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)
    paid_amount = Column(Float, nullable=False, default=0.0)
    balance_amount = Column(Float, nullable=False, default=0.0)
    
    status = Column(String(50), default="PAID", index=True)  # PAID, PARTIAL, UNPAID, CANCELLED, REFUNDED
    notes = Column(Text, nullable=True)
    created_by_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint('salon_id', 'invoice_number', name='uq_salon_invoice_number'),
    )

    salon = relationship("Salon", back_populates="invoices")
    customer = relationship("Customer", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_id = Column(String(36), ForeignKey("invoices.id", ondelete="CASCADE"), index=True, nullable=False)
    item_type = Column(String(20), default="service")  # "service" or "product"
    service_id = Column(String(36), ForeignKey("services.id", ondelete="SET NULL"), nullable=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Float, nullable=False)  # Preserved historical price
    subtotal = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    invoice = relationship("Invoice", back_populates="items")
