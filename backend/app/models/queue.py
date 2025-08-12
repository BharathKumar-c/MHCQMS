"""
Queue model for managing health checkup queue
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class QueueStatus(str, enum.Enum):
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Queue(Base):
    __tablename__ = "queue"

    id = Column(Integer, primary_key=True, index=True)
    queue_number = Column(String, unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    checkup_type = Column(String, nullable=False)
    priority = Column(Integer, default=0)  # 0 = normal, 1 = urgent, 2 = emergency
    status = Column(Enum(QueueStatus), default=QueueStatus.WAITING)
    notes = Column(Text)
    estimated_wait_time = Column(Integer)  # in minutes
    check_in_time = Column(DateTime(timezone=True), server_default=func.now())
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    patient = relationship("Patient", backref="queue_entries")
