from datetime import datetime, timezone, timedelta
import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    
    plan_id = Column(String(50), default="pro", nullable=False)  # "starter", "pro", "business"
    plan_name = Column(String(100), default="Pro Growth")
    status = Column(String(50), default="trial", nullable=False)  # "trial", "active", "past_due", "cancelled"
    billing_cycle = Column(String(20), default="monthly")
    amount = Column(Float, default=699.0)
    
    current_period_start = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    current_period_end = Column(DateTime, default=lambda: datetime.now(timezone.utc) + timedelta(days=14))  # 14-day trial
    
    is_dev_mode = Column(Boolean, default=True)  # Clearly distinguishes live vs test subscriptions
    max_staff = Column(Integer, default=5)
    max_invoices_per_month = Column(Integer, default=1000)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    salon = relationship("Salon", back_populates="subscription")
