from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    salon_id = Column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False, index=True)  # e.g., "INVOICE_CREATED", "INVOICE_CANCELLED", "REFUND_ISSUED"
    resource_type = Column(String(50), nullable=False)  # "invoice", "payment", "customer", "service"
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    salon = relationship("Salon", back_populates="audit_logs")
