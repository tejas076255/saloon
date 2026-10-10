from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=True, index=True)
    email = Column(String(255), nullable=True)
    gender = Column(String(20), nullable=True)  # Male, Female, Other
    notes = Column(Text, nullable=True)
    preferences = Column(Text, nullable=True)  # e.g., "Prefers low taper fade, sensitive skin"
    
    total_visits = Column(Integer, default=0)
    total_spent = Column(Float, default=0.0)
    last_visit_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    salon = relationship("Salon", back_populates="customers")
    invoices = relationship("Invoice", back_populates="customer")
