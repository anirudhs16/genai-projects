import os
from typing import Dict, List, Optional
from supabase import create_client, Client
from datetime import datetime

class SupabaseService:
    def __init__(self):
        self.supabase: Client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_ANON_KEY")
        )
    
    async def create_user_session(self, user_id: str, agent_id: str, query: str, response: str) -> Dict:
        """Save a user session with query and response"""
        try:
            data = {
                "user_id": user_id,
                "agent_id": agent_id,
                "query": query,
                "response": response,
                "created_at": datetime.utcnow().isoformat()
            }
            
            result = self.supabase.table("user_sessions").insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating user session: {e}")
            return None
    
    async def get_user_sessions(self, user_id: str) -> List[Dict]:
        """Get all sessions for a user"""
        try:
            result = self.supabase.table("user_sessions")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .execute()
            return result.data
        except Exception as e:
            print(f"Error getting user sessions: {e}")
            return []
    
    async def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email"""
        try:
            result = self.supabase.auth.admin.list_users()
            for user in result.users:
                if user.email == email:
                    return {
                        "id": user.id,
                        "email": user.email,
                        "created_at": user.created_at
                    }
            return None
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None
    
    async def create_user(self, email: str, password: str) -> Optional[Dict]:
        """Create a new user"""
        try:
            result = self.supabase.auth.admin.create_user({
                "email": email,
                "password": password,
                "email_confirm": True
            })
            return {
                "id": result.user.id,
                "email": result.user.email,
                "created_at": result.user.created_at
            }
        except Exception as e:
            print(f"Error creating user: {e}")
            return None 