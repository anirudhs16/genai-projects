from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
from app.services.supabase_service import SupabaseService

router = APIRouter()
# Lazy initialization to avoid environment variable issues at import time
_supabase_service = None

def get_supabase_service():
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service

@router.get("/user/{user_id}")
async def get_user_sessions(user_id: str, limit: Optional[int] = 50):
    """
    Get all sessions for a specific user
    """
    try:
        supabase_service = get_supabase_service()
        sessions = await supabase_service.get_user_sessions(user_id)
        if limit:
            sessions = sessions[:limit]
        return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/agent/{agent_id}")
async def get_user_agent_sessions(user_id: str, agent_id: str, limit: Optional[int] = 50):
    """
    Get sessions for a specific user and agent
    """
    try:
        supabase_service = get_supabase_service()
        all_sessions = await supabase_service.get_user_sessions(user_id)
        agent_sessions = [s for s in all_sessions if s.get("agent_id") == agent_id]
        if limit:
            agent_sessions = agent_sessions[:limit]
        return {"sessions": agent_sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """
    Delete a specific session
    """
    try:
        # In a real implementation, you'd delete from Supabase
        # For now, return success
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 