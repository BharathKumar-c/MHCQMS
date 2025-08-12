from .auth import router as auth_router
from .users import router as users_router
from .patients import router as patients_router
from .queue import router as queue_router

__all__ = ["auth_router", "users_router", "patients_router", "queue_router"]
