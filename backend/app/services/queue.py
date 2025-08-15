"""
Queue service for queue management operations
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.queue import Queue, QueueStatus
from app.schemas.queue import QueueCreate, QueueUpdate, QueueStatusUpdate

class QueueService:
    def __init__(self, db: Session):
        self.db = db

    def add_to_queue(self, queue_data: QueueCreate) -> Queue:
        """Add a patient to the queue"""
        try:
            print(f"Adding patient to queue: {queue_data}")
            
            # Check if patient is already in queue
            existing_queue = self.db.query(Queue).filter(
                Queue.patient_id == queue_data.patient_id,
                Queue.status.in_([QueueStatus.WAITING, QueueStatus.IN_PROGRESS])
            ).first()
            
            if existing_queue:
                raise ValueError("Patient is already in queue")
            
            # Generate unique queue number
            queue_number = self._generate_queue_number()
            
            print(f"Generated queue number: {queue_number}")
            
            # Create queue entry
            db_queue = Queue(
                queue_number=queue_number,
                patient_id=queue_data.patient_id,
                checkup_type=queue_data.checkup_type,
                priority=queue_data.priority,
                status=queue_data.status,
                notes=queue_data.notes,
                estimated_wait_time=queue_data.estimated_wait_time
            )
            
            print(f"Created queue object: {db_queue}")
            
            self.db.add(db_queue)
            self.db.commit()
            self.db.refresh(db_queue)
            
            print(f"Queue entry saved successfully: {db_queue}")
            return db_queue
            
        except Exception as e:
            # Always rollback on any error
            self.db.rollback()
            print(f"Error adding patient to queue: {e}")
            print(f"Queue data: {queue_data}")
            raise ValueError(f"Failed to add patient to queue: {str(e)}")

    def get_queue_entry(self, queue_id: int) -> Optional[Queue]:
        """Get a queue entry by ID"""
        return self.db.query(Queue).filter(Queue.id == queue_id).first()

    def get_queue_status(
        self, 
        status_filter: Optional[str] = None, 
        priority_filter: Optional[int] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Queue]:
        """Get queue status with optional filtering"""
        query = self.db.query(Queue)
        
        if status_filter:
            try:
                status_enum = QueueStatus(status_filter)
                query = query.filter(Queue.status == status_enum)
            except ValueError:
                pass  # Invalid status filter, ignore
        
        if priority_filter is not None:
            query = query.filter(Queue.priority == priority_filter)
        
        # Order by priority (higher first) and then by check-in time
        query = query.order_by(Queue.priority.desc(), Queue.check_in_time.asc())
        
        return query.offset(skip).limit(limit).all()

    def update_queue_entry(self, queue_id: int, queue_update: QueueUpdate) -> Optional[Queue]:
        """Update a queue entry"""
        db_queue = self.get_queue_entry(queue_id)
        if not db_queue:
            return None
        
        # Update only provided fields
        update_data = queue_update.dict(exclude_unset=True)
        
        # Handle status-specific updates
        if "status" in update_data:
            new_status = update_data["status"]
            if new_status == QueueStatus.IN_PROGRESS and not db_queue.start_time:
                update_data["start_time"] = datetime.utcnow()
            elif new_status == QueueStatus.COMPLETED and not db_queue.end_time:
                update_data["end_time"] = datetime.utcnow()
        
        # Update the queue entry
        for field, value in update_data.items():
            setattr(db_queue, field, value)
        
        self.db.commit()
        self.db.refresh(db_queue)
        return db_queue

    def update_queue_status(self, queue_id: int, status_update: QueueStatusUpdate) -> Optional[Queue]:
        """Update the status of a queue entry"""
        db_queue = self.get_queue_entry(queue_id)
        if not db_queue:
            return None
        
        # Update status
        db_queue.status = status_update.status
        
        # Update notes if provided
        if status_update.notes:
            db_queue.notes = status_update.notes
        
        # Handle status-specific timestamps
        if status_update.status == QueueStatus.IN_PROGRESS and not db_queue.start_time:
            db_queue.start_time = datetime.utcnow()
        elif status_update.status == QueueStatus.COMPLETED and not db_queue.end_time:
            db_queue.end_time = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_queue)
        return db_queue

    def remove_from_queue(self, queue_id: int) -> bool:
        """Remove a patient from the queue"""
        db_queue = self.get_queue_entry(queue_id)
        if not db_queue:
            return False
        
        self.db.delete(db_queue)
        self.db.commit()
        return True

    def get_queue_statistics(self) -> Dict[str, Any]:
        """Get queue statistics"""
        # Count by status
        total_waiting = self.db.query(Queue).filter(Queue.status == QueueStatus.WAITING).count()
        total_in_progress = self.db.query(Queue).filter(Queue.status == QueueStatus.IN_PROGRESS).count()
        total_completed = self.db.query(Queue).filter(Queue.status == QueueStatus.COMPLETED).count()
        total_cancelled = self.db.query(Queue).filter(Queue.status == QueueStatus.CANCELLED).count()
        
        # Calculate average wait time for completed entries
        completed_entries = self.db.query(Queue).filter(
            Queue.status == QueueStatus.COMPLETED,
            Queue.start_time.isnot(None),
            Queue.check_in_time.isnot(None)
        ).all()
        
        total_wait_time = 0
        for entry in completed_entries:
            wait_time = (entry.start_time - entry.check_in_time).total_seconds() / 60
            total_wait_time += wait_time
        
        average_wait_time = round(total_wait_time / len(completed_entries)) if completed_entries else 0
        
        # Estimate completion time for waiting entries
        estimated_completion_time = None
        if total_waiting > 0 and average_wait_time > 0:
            estimated_minutes = total_waiting * average_wait_time
            estimated_completion_time = datetime.utcnow().isoformat()
        
        return {
            "total_waiting": total_waiting,
            "total_in_progress": total_in_progress,
            "total_completed": total_completed,
            "total_cancelled": total_cancelled,
            "average_wait_time": average_wait_time,
            "estimated_completion_time": estimated_completion_time
        }

    def get_next_patient(self) -> Optional[Queue]:
        """Get the next patient from the queue (highest priority, earliest check-in)"""
        return self.db.query(Queue).filter(
            Queue.status == QueueStatus.WAITING
        ).order_by(
            Queue.priority.desc(), 
            Queue.check_in_time.asc()
        ).first()

    def move_to_next_status(self, queue_id: int) -> Optional[Queue]:
        """Move a queue entry to the next logical status"""
        db_queue = self.get_queue_entry(queue_id)
        if not db_queue:
            return None
        
        if db_queue.status == QueueStatus.WAITING:
            db_queue.status = QueueStatus.IN_PROGRESS
            db_queue.start_time = datetime.utcnow()
        elif db_queue.status == QueueStatus.IN_PROGRESS:
            db_queue.status = QueueStatus.COMPLETED
            db_queue.end_time = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_queue)
        return db_queue

    def _generate_queue_number(self) -> str:
        """Generate a unique queue number"""
        import random
        import string
        
        while True:
            # Generate a 4-character alphanumeric ID
            queue_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            
            # Check if it already exists
            existing = self.db.query(Queue).filter(Queue.queue_number == queue_number).first()
            if not existing:
                return queue_number
