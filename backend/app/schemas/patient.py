"""
Patient schemas for API requests and responses
"""

from pydantic import BaseModel, Field
from pydantic.networks import EmailStr
from typing import Optional
from datetime import date, datetime


class PatientBase(BaseModel):
    """Base patient schema with common fields"""
    first_name: str = Field(..., min_length=2, max_length=50, description="Patient's first name")
    last_name: str = Field(..., min_length=2, max_length=50, description="Patient's last name")
    date_of_birth: date = Field(..., description="Patient's date of birth")
    gender: str = Field(..., pattern="^(male|female|other)$", description="Patient's gender (male/female/other)")
    phone: Optional[str] = Field(None, max_length=20, description="Patient's phone number")
    email: Optional[EmailStr] = Field(None, description="Patient's email address")
    address: Optional[str] = Field(None, max_length=500, description="Patient's address")
    emergency_contact: Optional[str] = Field(None, max_length=20, description="Emergency contact phone number")
    medical_history: Optional[str] = Field(None, max_length=2000, description="Patient's medical history")


class PatientCreate(PatientBase):
    """Schema for creating a new patient"""
    pass


class PatientUpdate(BaseModel):
    """Schema for updating patient information"""
    first_name: Optional[str] = Field(None, min_length=2, max_length=50, description="Patient's first name")
    last_name: Optional[str] = Field(None, min_length=2, max_length=50, description="Patient's last name")
    date_of_birth: Optional[date] = Field(None, description="Patient's date of birth")
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$", description="Patient's gender (male/female/other)")
    phone: Optional[str] = Field(None, max_length=20, description="Patient's phone number")
    email: Optional[EmailStr] = Field(None, description="Patient's email address")
    address: Optional[str] = Field(None, max_length=500, description="Patient's address")
    emergency_contact: Optional[str] = Field(None, max_length=20, description="Emergency contact phone number")
    medical_history: Optional[str] = Field(None, max_length=2000, description="Patient's medical history")


class PatientResponse(PatientBase):
    """Schema for patient response"""
    id: int = Field(..., description="Unique patient ID")
    patient_id: str = Field(..., description="Unique patient identifier")
    created_at: datetime = Field(..., description="Patient creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

    class Config:
        from_attributes = True
