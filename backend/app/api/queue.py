"""
Queue Management API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.queue import QueueCreate, QueueUpdate, QueueResponse, QueueStatusUpdate
from app.models.user import User
from app.services.queue import QueueService
from app.services.auth import AuthService

router = APIRouter(
    prefix="/queue",
    tags=["Queue Management"],
    responses={
        404: {"description": "Queue entry not found"},
        401: {"description": "Unauthorized"},
        422: {"description": "Validation error"}
    }
)


@router.post("/",
    response_model=QueueResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add patient to queue",
    description="Add a new patient to the health checkup queue",
    responses={
        201: {
            "description": "Patient added to queue successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "queue_number": "Q001",
                        "patient_id": 1,
                        "checkup_type": "General Checkup",
                        "priority": 0,
                        "status": "waiting",
                        "notes": "Regular health checkup",
                        "estimated_wait_time": 30,
                        "check_in_time": "2024-01-01T10:00:00Z",
                        "start_time": None,
                        "end_time": None,
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": None
                    }
                }
            }
        },
        400: {"description": "Patient already in queue or invalid data"},
        422: {"description": "Validation error"}
    }
)
async def add_to_queue(
    queue_data: QueueCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a patient to the health checkup queue.
    
    - **patient_id**: ID of the patient to add to queue
    - **checkup_type**: Type of health checkup
    - **priority**: Priority level (0=normal, 1=urgent, 2=emergency)
    - **status**: Initial status (default: waiting)
    - **notes**: Additional notes (optional)
    - **estimated_wait_time**: Estimated wait time in minutes (optional)
    """
    queue_service = QueueService(db)
    try:
        queue_entry = queue_service.add_to_queue(queue_data)
        return queue_entry
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/",
    response_model=List[QueueResponse],
    summary="Get queue status",
    description="Retrieve current queue status with optional filtering",
    responses={
        200: {
            "description": "Queue status retrieved successfully",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "queue_number": "Q001",
                            "patient_id": 1,
                            "checkup_type": "General Checkup",
                            "priority": 0,
                            "status": "waiting",
                            "notes": "Regular health checkup",
                            "estimated_wait_time": 30,
                            "check_in_time": "2024-01-01T10:00:00Z",
                            "start_time": None,
                            "end_time": None,
                            "created_at": "2024-01-01T10:00:00Z",
                            "updated_at": None
                        }
                    ]
                }
            }
        }
    }
)
async def get_queue_status(
    status_filter: Optional[str] = Query(None, description="Filter by status (waiting, in_progress, completed, cancelled)"),
    priority_filter: Optional[int] = Query(None, ge=0, le=2, description="Filter by priority level"),
    skip: int = Query(0, ge=0, description="Number of entries to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of entries to return"),
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current queue status.
    
    - **status_filter**: Optional filter by queue status
    - **priority_filter**: Optional filter by priority level
    - **skip**: Number of entries to skip (for pagination)
    - **limit**: Maximum number of entries to return (max 1000)
    """
    queue_service = QueueService(db)
    queue_entries = queue_service.get_queue_status(
        status_filter=status_filter,
        priority_filter=priority_filter,
        skip=skip,
        limit=limit
    )
    return queue_entries


@router.get("/{queue_id}",
    response_model=QueueResponse,
    summary="Get queue entry by ID",
    description="Retrieve a specific queue entry by its ID",
    responses={
        200: {
            "description": "Queue entry found successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "queue_number": "Q001",
                        "patient_id": 1,
                        "checkup_type": "General Checkup",
                        "priority": 0,
                        "status": "waiting",
                        "notes": "Regular health checkup",
                        "estimated_wait_time": 30,
                        "check_in_time": "2024-01-01T10:00:00Z",
                        "start_time": None,
                        "end_time": None,
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": None
                    }
                }
            }
        },
        404: {"description": "Queue entry not found"}
    }
)
async def get_queue_entry(
    queue_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific queue entry by ID.
    
    - **queue_id**: The ID of the queue entry to retrieve
    """
    queue_service = QueueService(db)
    queue_entry = queue_service.get_queue_entry(queue_id)
    if not queue_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Queue entry not found"
        )
    return queue_entry


@router.put("/{queue_id}",
    response_model=QueueResponse,
    summary="Update queue entry",
    description="Update queue entry information",
    responses={
        200: {
            "description": "Queue entry updated successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "queue_number": "Q001",
                        "patient_id": 1,
                        "checkup_type": "General Checkup",
                        "priority": 1,
                        "status": "in_progress",
                        "notes": "Urgent checkup started",
                        "estimated_wait_time": 15,
                        "check_in_time": "2024-01-01T10:00:00Z",
                        "start_time": "2024-01-01T10:30:00Z",
                        "end_time": None,
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": "2024-01-01T10:30:00Z"
                    }
                }
            }
        },
        404: {"description": "Queue entry not found"}
    }
)
async def update_queue_entry(
    queue_id: int,
    queue_update: QueueUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update queue entry information.
    
    - **queue_id**: The ID of the queue entry to update
    - **queue_update**: Updated queue data
    """
    queue_service = QueueService(db)
    queue_entry = queue_service.update_queue_entry(queue_id, queue_update)
    if not queue_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Queue entry not found"
        )
    return queue_entry


@router.patch("/{queue_id}/status",
    response_model=QueueResponse,
    summary="Update queue status",
    description="Update the status of a queue entry (e.g., start checkup, complete, cancel)",
    responses={
        200: {
            "description": "Queue status updated successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "queue_number": "Q001",
                        "patient_id": 1,
                        "checkup_type": "General Checkup",
                        "priority": 0,
                        "status": "completed",
                        "notes": "Checkup completed successfully",
                        "estimated_wait_time": 30,
                        "check_in_time": "2024-01-01T10:00:00Z",
                        "start_time": "2024-01-01T10:30:00Z",
                        "end_time": "2024-01-01T11:00:00Z",
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": "2024-01-01T11:00:00Z"
                    }
                }
            }
        },
        404: {"description": "Queue entry not found"}
    }
)
async def update_queue_status(
    queue_id: int,
    status_update: QueueStatusUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the status of a queue entry.
    
    - **queue_id**: The ID of the queue entry to update
    - **status_update**: New status and optional notes
    """
    queue_service = QueueService(db)
    queue_entry = queue_service.update_queue_status(queue_id, status_update)
    if not queue_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Queue entry not found"
        )
    return queue_entry


@router.delete("/{queue_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove from queue",
    description="Remove a patient from the queue",
    responses={
        204: {"description": "Patient removed from queue successfully"},
        404: {"description": "Queue entry not found"}
    }
)
async def remove_from_queue(
    queue_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a patient from the queue.
    
    - **queue_id**: The ID of the queue entry to remove
    """
    queue_service = QueueService(db)
    success = queue_service.remove_from_queue(queue_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Queue entry not found"
        )
    
    return {"message": "Patient removed from queue successfully"}


@router.get("/stats/summary",
    summary="Get queue statistics",
    description="Get summary statistics of the current queue",
    responses={
        200: {
            "description": "Queue statistics retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "total_waiting": 15,
                        "total_in_progress": 3,
                        "total_completed": 25,
                        "total_cancelled": 2,
                        "average_wait_time": 45,
                        "estimated_completion_time": "2024-01-01T15:00:00Z"
                    }
                }
            }
        }
    }
)
async def get_queue_statistics(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get summary statistics of the current queue.
    
    Returns counts by status, average wait times, and estimated completion times.
    """
    queue_service = QueueService(db)
    stats = queue_service.get_queue_statistics()
    return stats
