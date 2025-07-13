from fastapi import APIRouter

router = APIRouter()

# Import and include all route modules here
from .chat import router as chat_router
from .auth import router as auth_router
from .agents import router as agents_router
from .sessions import router as sessions_router

router.include_router(chat_router, prefix="/chat", tags=["chat"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(agents_router, prefix="/agents", tags=["agents"])
router.include_router(sessions_router, prefix="/sessions", tags=["sessions"]) 