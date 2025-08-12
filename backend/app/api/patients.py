"""
Patients API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from app.models.user import User
from app.services.patient import PatientService
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
