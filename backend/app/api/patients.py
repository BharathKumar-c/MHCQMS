"""
Patients API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.schemas.queue import QueueCreate, QueueResponse
from app.models.user import User
from app.services.patient import PatientService
from app.services.queue import QueueService
from app.services.auth import AuthService

router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
    responses={
        404: {"description": "Patient not found"},
        401: {"description": "Unauthorized"},
        422: {"description": "Validation error"}
    }
)


@router.post("/",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new patient",
    description="Register a new patient in the system",
    responses={
        201: {
            "description": "Patient created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "patient_id": "P001",
                        "first_name": "John",
                        "last_name": "Doe",
                        "date_of_birth": "1990-01-01",
                        "gender": "male",
                        "phone": "+1234567890",
                        "email": "john.doe@example.com",
                        "address": "123 Main St, City, State",
                        "emergency_contact": "+1987654321",
                        "medical_history": "No known allergies",
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": None
                    }
                }
            }
        },
        400: {"description": "Patient ID already exists"},
        422: {"description": "Validation error"}
    }
)
async def create_patient(
    patient_data: PatientCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new patient record.
    
    - **first_name**: Patient's first name (2-50 characters)
    - **last_name**: Patient's last name (2-50 characters)
    - **date_of_birth**: Patient's date of birth
    - **gender**: Patient's gender (male/female/other)
    - **phone**: Patient's phone number (optional)
    - **email**: Patient's email address (optional)
    - **address**: Patient's address (optional)
    - **emergency_contact**: Emergency contact phone (optional)
    - **medical_history**: Medical history notes (optional)
    """
    patient_service = PatientService(db)
    try:
        patient = patient_service.create_patient(patient_data)
        return patient
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/",
    response_model=List[PatientResponse],
    summary="Get all patients",
    description="Retrieve a list of all patients with optional filtering and pagination",
    responses={
        200: {
            "description": "List of patients retrieved successfully",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "patient_id": "P001",
                            "first_name": "John",
                            "last_name": "Doe",
                            "date_of_birth": "1990-01-01",
                            "gender": "male",
                            "phone": "+1234567890",
                            "email": "john.doe@example.com",
                            "address": "123 Main St, City, State",
                            "emergency_contact": "+1987654321",
                            "medical_history": "No known allergies",
                            "created_at": "2024-01-01T10:00:00Z",
                            "updated_at": None
                        }
                    ]
                }
            }
        }
    }
)
async def get_patients(
    skip: int = Query(0, ge=0, description="Number of patients to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of patients to return"),
    search: Optional[str] = Query(None, description="Search term for name or patient ID"),
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of all patients.
    
    - **skip**: Number of patients to skip (for pagination)
    - **limit**: Maximum number of patients to return (max 1000)
    - **search**: Optional search term for filtering by name or patient ID
    """
    patient_service = PatientService(db)
    patients = patient_service.get_patients(skip=skip, limit=limit, search=search)
    return patients


@router.get("/{patient_id}",
    response_model=PatientResponse,
    summary="Get patient by ID",
    description="Retrieve a specific patient by their ID",
    responses={
        200: {
            "description": "Patient found successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "patient_id": "P001",
                        "first_name": "John",
                        "last_name": "Doe",
                        "date_of_birth": "1990-01-01",
                        "gender": "male",
                        "phone": "+1234567890",
                        "email": "john.doe@example.com",
                        "address": "123 Main St, City, State",
                        "emergency_contact": "+1987654321",
                        "medical_history": "No known allergies",
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": None
                    }
                }
            }
        },
        404: {"description": "Patient not found"}
    }
)
async def get_patient(
    patient_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific patient by ID.
    
    - **patient_id**: The ID of the patient to retrieve
    """
    patient_service = PatientService(db)
    patient = patient_service.get_patient(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return patient


@router.put("/{patient_id}",
    response_model=PatientResponse,
    summary="Update patient",
    description="Update patient information",
    responses={
        200: {
            "description": "Patient updated successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "patient_id": "P001",
                        "first_name": "John",
                        "last_name": "Doe Updated",
                        "date_of_birth": "1990-01-01",
                        "gender": "male",
                        "phone": "+1234567890",
                        "email": "john.updated@example.com",
                        "address": "123 Main St, City, State",
                        "emergency_contact": "+1987654321",
                        "medical_history": "No known allergies",
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": "2024-01-01T11:00:00Z"
                    }
                }
            }
        },
        404: {"description": "Patient not found"}
    }
)
async def update_patient(
    patient_id: int,
    patient_update: PatientUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update patient information.
    
    - **patient_id**: The ID of the patient to update
    - **patient_update**: Updated patient data
    """
    patient_service = PatientService(db)
    patient = patient_service.update_patient(patient_id, patient_update)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return patient


@router.delete("/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete patient",
    description="Delete a patient record",
    responses={
        204: {"description": "Patient deleted successfully"},
        404: {"description": "Patient not found"}
    }
)
async def delete_patient(
    patient_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a patient record.
    
    - **patient_id**: The ID of the patient to delete
    """
    patient_service = PatientService(db)
    success = patient_service.delete_patient(patient_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    return {"message": "Patient deleted successfully"}


@router.post("/register",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Register patient with queue",
    description="Create a new patient and add them to the queue in one operation",
    responses={
        201: {
            "description": "Patient registered and added to queue successfully",
            "content": {
                "application/json": {
                    "example": {
                        "patient": {
                            "id": 1,
                            "patient_id": "P001",
                            "first_name": "John",
                            "last_name": "Doe",
                            "date_of_birth": "1990-01-01",
                            "gender": "male",
                            "phone": "+1234567890",
                            "email": "john.doe@example.com",
                            "address": "123 Main St, City, State",
                            "emergency_contact": "+1987654321",
                            "medical_history": "No known allergies",
                            "created_at": "2024-01-01T10:00:00Z",
                            "updated_at": None
                        },
                        "queue": {
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
            }
        },
        400: {"description": "Patient ID already exists or invalid data"},
        422: {"description": "Validation error"}
    }
)
async def register_patient_with_queue(
    registration_data: dict,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Register a new patient and add them to the queue in one operation.
    
    Expected data structure:
    - **first_name**: Patient's first name (2-50 characters)
    - **last_name**: Patient's last name (2-50 characters)
    - **date_of_birth**: Patient's date of birth
    - **gender**: Patient's gender (male/female/other)
    - **phone**: Patient's phone number
    - **email**: Patient's email address (optional)
    - **address**: Patient's address (optional)
    - **emergency_contact**: Emergency contact phone (optional)
    - **medical_history**: Medical history notes (optional)
    - **checkup_type**: Type of health checkup
    - **priority**: Priority level (0=normal, 1=urgent, 2=emergency)
    - **notes**: Additional notes for queue (optional)
    - **estimated_wait_time**: Estimated wait time in minutes (optional)
    """
    try:
        # Extract patient data
        patient_data = PatientCreate(
            first_name=registration_data["first_name"],
            last_name=registration_data["last_name"],
            date_of_birth=registration_data["date_of_birth"],
            gender=registration_data["gender"],
            phone=registration_data.get("phone"),
            email=registration_data.get("email"),
            address=registration_data.get("address"),
            emergency_contact=registration_data.get("emergency_contact"),
            medical_history=registration_data.get("medical_history")
        )
        
        # Create patient
        patient_service = PatientService(db)
        patient = patient_service.create_patient(patient_data)
        
        # Create queue entry
        queue_data = QueueCreate(
            patient_id=patient.id,
            checkup_type=registration_data["checkup_type"],
            priority=registration_data.get("priority", 0),
            notes=registration_data.get("notes"),
            estimated_wait_time=registration_data.get("estimated_wait_time", 30)
        )
        
        queue_service = QueueService(db)
        queue_entry = queue_service.add_to_queue(queue_data)
        
        return {
            "patient": patient,
            "queue": queue_entry
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register patient: {str(e)}"
        )


@router.patch("/{patient_id}/serve",
    response_model=PatientResponse,
    summary="Mark patient as served",
    description="Mark a patient as served and update their status",
    responses={
        200: {
            "description": "Patient marked as served successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "patient_id": "P001",
                        "first_name": "John",
                        "last_name": "Doe",
                        "date_of_birth": "1990-01-01",
                        "gender": "male",
                        "phone": "+1234567890",
                        "email": "john.doe@example.com",
                        "address": "123 Main St, City, State",
                        "emergency_contact": "+1987654321",
                        "medical_history": "No known allergies",
                        "created_at": "2024-01-01T10:00:00Z",
                        "updated_at": "2024-01-01T11:00:00Z"
                    }
                }
            }
        },
        404: {"description": "Patient not found"}
    }
)
async def mark_patient_served(
    patient_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a patient as served.
    
    - **patient_id**: The ID of the patient to mark as served
    """
    patient_service = PatientService(db)
    patient = patient_service.mark_patient_served(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return patient


@router.get("/completed",
    response_model=List[PatientResponse],
    summary="Get completed patients",
    description="Retrieve a list of all completed/served patients",
    responses={
        200: {
            "description": "Completed patients retrieved successfully",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 1,
                            "patient_id": "P001",
                            "first_name": "John",
                            "last_name": "Doe",
                            "date_of_birth": "1990-01-01",
                            "gender": "male",
                            "phone": "+1234567890",
                            "email": "john.doe@example.com",
                            "address": "123 Main St, City, State",
                            "emergency_contact": "+1987654321",
                            "medical_history": "No known allergies",
                            "created_at": "2024-01-01T10:00:00Z",
                            "updated_at": "2024-01-01T11:00:00Z"
                        }
                    ]
                }
            }
        }
    }
)
async def get_completed_patients(
    skip: int = Query(0, ge=0, description="Number of patients to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of patients to return"),
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a list of all completed/served patients.
    
    - **skip**: Number of patients to skip (for pagination)
    - **limit**: Maximum number of patients to return (max 1000)
    """
    patient_service = PatientService(db)
    patients = patient_service.get_completed_patients(skip=skip, limit=limit)
    return patients


@router.get("/stats",
    summary="Get patient statistics",
    description="Get summary statistics of patients",
    responses={
        200: {
            "description": "Patient statistics retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "total_patients": 150,
                        "total_in_queue": 25,
                        "total_served": 125,
                        "average_wait_time": 45,
                        "priority_distribution": {
                            "normal": 100,
                            "urgent": 30,
                            "emergency": 20
                        }
                    }
                }
            }
        }
    }
)
async def get_patient_stats(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get summary statistics of patients.
    
    Returns counts by status, average wait times, and priority distribution.
    """
    patient_service = PatientService(db)
    stats = patient_service.get_patient_stats()
    return stats
