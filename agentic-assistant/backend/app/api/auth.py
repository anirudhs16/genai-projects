from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pydantic.networks import EmailStr
from typing import Optional
from app.services.supabase_service import SupabaseService

router = APIRouter()
# Lazy initialization to avoid environment variable issues at import time
_supabase_service = None

def get_supabase_service():
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    created_at: str

class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str

@router.post("/register", response_model=AuthResponse)
async def register_user(user_data: UserRegister):
    """
    Register a new user
    """
    try:
        supabase_service = get_supabase_service()
        
        # Check if user already exists
        existing_user = await supabase_service.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create new user
        user = await supabase_service.create_user(user_data.email, user_data.password)
        if not user:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        # For now, return mock tokens (in production, you'd get these from Supabase auth)
        return AuthResponse(
            user=UserResponse(
                id=user["id"],
                email=user["email"],
                created_at=user["created_at"]
            ),
            access_token="mock_access_token",
            refresh_token="mock_refresh_token"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login_user(user_data: UserLogin):
    """
    Login user
    """
    try:
        supabase_service = get_supabase_service()
        
        # In a real implementation, you'd use Supabase auth
        # For now, we'll just check if the user exists
        user = await supabase_service.get_user_by_email(user_data.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Mock authentication (in production, verify password with Supabase)
        return AuthResponse(
            user=UserResponse(
                id=user["id"],
                email=user["email"],
                created_at=user["created_at"]
            ),
            access_token="mock_access_token",
            refresh_token="mock_refresh_token"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_current_user():
    """
    Get current user information
    """
    # In a real implementation, you'd verify the JWT token
    # For now, return mock user data
    return {
        "id": "mock_user_id",
        "email": "user@example.com",
        "created_at": "2024-01-01T00:00:00Z"
    } 