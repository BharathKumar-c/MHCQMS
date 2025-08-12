"""
Queue schemas for API requests and responses
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.queue import QueueStatus


class QueueBase(BaseModel):
    """Base queue schema with common fields"""
    checkup_type: str = Field(..., min_length=2, max_length=100, description="Type of health checkup")
    priority: int = Field(default=0, ge=0, le=2, description="Priority level (0=normal, 1=urgent, 2=emergency)")
    status: QueueStatus = Field(default=QueueStatus.WAITING, description="Current status of the queue entry")
    notes: Optional[str] = Field(None, max_length=1000, description="Additional notes for the queue entry")
    estimated_wait_time: Optional[int] = Field(None, ge=0, description="Estimated wait time in minutes")


class QueueCreate(QueueBase):
    """Schema for creating a new queue entry"""
    patient_id: int = Field(..., description="ID of the patient")


class QueueUpdate(BaseModel):
    """Schema for updating queue information"""
    checkup_type: Optional[str] = Field(None, min_length=2, max_length=100, description="Type of health checkup")
    priority: Optional[int] = Field(None, ge=0, le=2, description="Priority level (0=normal, 1=urgent, 2=emergency)")
    status: Optional[QueueStatus] = Field(None, description="Current status of the queue entry")
    notes: Optional[str] = Field(None, max_length=1000, description="Additional notes for the queue entry")
    estimated_wait_time: Optional[int] = Field(None, ge=0, description="Estimated wait time in minutes")
    start_time: Optional[datetime] = Field(None, description="When the checkup started")
    end_time: Optional[datetime] = Field(None, description="When the checkup ended")


class QueueResponse(QueueBase):
    """Schema for queue response"""
    id: int = Field(..., description="Unique queue ID")
    queue_number: str = Field(..., description="Queue number for display")
    patient_id: int = Field(..., description="ID of the patient")
    check_in_time: datetime = Field(..., description="When the patient checked in")
    start_time: Optional[datetime] = Field(None, description="When the checkup started")
    end_time: Optional[datetime] = Field(None, description="When the checkup ended")
    created_at: datetime = Field(..., description="Queue entry creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

    class Config:
        from_attributes = True


class QueueStatusUpdate(BaseModel):
    """Schema for updating queue status"""
    status: QueueStatus = Field(..., description="New status for the queue entry")
    notes: Optional[str] = Field(None, max_length=1000, description="Additional notes for the status change")
