from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), index=True, nullable=False)
    invoice_id = Column(String(36), ForeignKey("invoices.id", ondelete="CASCADE"), index=True, nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)  # "CASH", "UPI", "CARD", "SPLIT"
    reference_id = Column(String(100), nullable=True)  # UTR or Auth Code
    is_verified = Column(Boolean, default=False)  # True only if verified via payment gateway
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    salon = relationship("Salon", back_populates="payments")
    invoice = relationship("Invoice", back_populates="payments")
