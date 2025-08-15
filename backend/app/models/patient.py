"""
Patient model for storing patient information
"""

from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    address = Column(Text)
    emergency_contact = Column(String)
    medical_history = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Patient(id={self.id}, patient_id='{self.patient_id}', name='{self.first_name} {self.last_name}')>"
