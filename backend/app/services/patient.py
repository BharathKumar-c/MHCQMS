"""
Patient service for patient management operations
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate

class PatientService:
    def __init__(self, db: Session):
        self.db = db

    def create_patient(self, patient_data: PatientCreate) -> Patient:
        """Create a new patient"""
        try:
            # Generate unique patient ID
            patient_id = self._generate_patient_id()
            
            # Import datetime for created_at
            from datetime import datetime
            
            # Create patient object with all required fields
            db_patient = Patient(
                patient_id=patient_id,
                first_name=patient_data.first_name,
                last_name=patient_data.last_name,
                date_of_birth=patient_data.date_of_birth,
                gender=patient_data.gender,
                phone=patient_data.phone,
                email=patient_data.email,
                address=patient_data.address,
                emergency_contact=patient_data.emergency_contact,
                medical_history=patient_data.medical_history,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            print(f"Creating patient with data: {db_patient}")
            
            self.db.add(db_patient)
            self.db.commit()
            self.db.refresh(db_patient)
            
            # Verify the patient was created correctly
            if not db_patient.id:
                raise ValueError("Failed to create patient - no ID generated")
                
            print(f"Patient created successfully with ID: {db_patient.id}")
            return db_patient
            
        except Exception as e:
            # Always rollback on any error
            self.db.rollback()
            print(f"Error creating patient: {e}")
            print(f"Patient data: {patient_data}")
            raise ValueError(f"Failed to create patient: {str(e)}")

    def get_patient(self, patient_id: int) -> Optional[Patient]:
        """Get a patient by ID"""
        return self.db.query(Patient).filter(Patient.id == patient_id).first()

    def get_patient_by_patient_id(self, patient_id: str) -> Optional[Patient]:
        """Get a patient by patient ID (external ID)"""
        try:
            return self.db.query(Patient).filter(Patient.patient_id == patient_id).first()
        except Exception as e:
            print(f"Error querying patient by patient_id '{patient_id}': {e}")
            return None

    def get_patients(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[Patient]:
        """Get a list of patients with optional search and pagination"""
        query = self.db.query(Patient)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Patient.first_name.ilike(search_term)) |
                (Patient.last_name.ilike(search_term)) |
                (Patient.patient_id.ilike(search_term))
            )
        
        return query.offset(skip).limit(limit).all()

    def update_patient(self, patient_id: int, patient_update: PatientUpdate) -> Optional[Patient]:
        """Update a patient"""
        db_patient = self.get_patient(patient_id)
        if not db_patient:
            return None
        
        # Update only provided fields
        update_data = patient_update.dict(exclude_unset=True)
        
        # Check for unique constraints if updating email
        if "email" in update_data and update_data["email"]:
            existing_email = self.db.query(Patient).filter(
                Patient.email == update_data["email"],
                Patient.id != patient_id
            ).first()
            if existing_email:
                raise ValueError("Email already taken by another patient")
        
        # Update the patient
        for field, value in update_data.items():
            setattr(db_patient, field, value)
        
        self.db.commit()
        self.db.refresh(db_patient)
        return db_patient

    def delete_patient(self, patient_id: int) -> bool:
        """Delete a patient"""
        db_patient = self.get_patient(patient_id)
        if not db_patient:
            return False
        
        self.db.delete(db_patient)
        self.db.commit()
        return True

    def search_patients(self, search_term: str, limit: int = 50) -> List[Patient]:
        """Search patients by name or patient ID"""
        search_pattern = f"%{search_term}%"
        return self.db.query(Patient).filter(
            (Patient.first_name.ilike(search_pattern)) |
            (Patient.last_name.ilike(search_pattern)) |
            (Patient.patient_id.ilike(search_pattern))
        ).limit(limit).all()

    def get_patients_by_gender(self, gender: str, skip: int = 0, limit: int = 100) -> List[Patient]:
        """Get patients by gender"""
        return self.db.query(Patient).filter(
            Patient.gender == gender
        ).offset(skip).limit(limit).all()

    def get_patients_by_age_range(self, min_age: int, max_age: int, skip: int = 0, limit: int = 100) -> List[Patient]:
        """Get patients within an age range"""
        from datetime import date
        today = date.today()
        min_date = today.replace(year=today.year - max_age)
        max_date = today.replace(year=today.year - min_age)
        
        return self.db.query(Patient).filter(
            Patient.date_of_birth.between(min_date, max_date)
        ).offset(skip).limit(limit).all()

    def _generate_patient_id(self) -> str:
        """Generate a unique patient ID"""
        import random
        import string
        
        while True:
            # Generate a 6-character alphanumeric ID
            patient_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            
            # Check if it already exists
            existing = self.get_patient_by_patient_id(patient_id)
            if not existing:
                return patient_id

    def mark_patient_served(self, patient_id: int) -> Optional[Patient]:
        """Mark a patient as served"""
        db_patient = self.get_patient(patient_id)
        if not db_patient:
            return None
        
        # Update the patient's served status
        from datetime import datetime
        db_patient.updated_at = datetime.utcnow()
        
        # You might want to add a field to track if patient is served
        # For now, we'll just update the timestamp
        self.db.commit()
        self.db.refresh(db_patient)
        return db_patient

    def get_completed_patients(self, skip: int = 0, limit: int = 100) -> List[Patient]:
        """Get a list of completed/served patients"""
        # This would need to be implemented based on your business logic
        # For now, returning all patients (you might want to filter by some status)
        return self.get_patients(skip=skip, limit=limit)

    def get_patient_stats(self) -> dict:
        """Get patient statistics"""
        total_patients = self.db.query(Patient).count()
        
        # You might want to add more sophisticated stats based on your needs
        stats = {
            "total_patients": total_patients,
            "total_in_queue": total_patients,  # This should be based on queue status
            "total_served": 0,  # This should be based on served status
            "average_wait_time": 0,  # This should be calculated from queue data
            "priority_distribution": {
                "normal": 0,
                "urgent": 0,
                "emergency": 0
            }
        }
        
        return stats
