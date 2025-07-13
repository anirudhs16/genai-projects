from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.chains.agent_workflows import AgentWorkflows
from app.services.supabase_service import SupabaseService
from app.agents.personas import AgentPersonas

router = APIRouter()
# Lazy initialization to avoid environment variable issues at import time
_workflows = None
_supabase_service = None

def get_workflows():
    global _workflows
    if _workflows is None:
        _workflows = AgentWorkflows()
    return _workflows

def get_supabase_service():
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service

class ChatMessage(BaseModel):
    message: str
    agent_id: str
    user_id: Optional[str] = None
    context: Optional[Dict] = None

class ChatResponse(BaseModel):
    response: str
    agent_id: str
    session_id: Optional[str] = None

class MultiAgentRequest(BaseModel):
    message: str
    agent_ids: List[str]
    user_id: Optional[str] = None
    context: Optional[Dict] = None

class MultiAgentResponse(BaseModel):
    responses: Dict[str, str]
    session_ids: Dict[str, str]

@router.post("/", response_model=ChatResponse)
async def chat_with_agent(chat_message: ChatMessage):
    """
    Send a message to an AI agent and get a response
    """
    try:
        # Validate agent ID
        persona = AgentPersonas.get_persona_by_id(chat_message.agent_id)
        if not persona:
            raise HTTPException(status_code=400, detail="Invalid agent ID")
        
        # Get workflows instance
        workflows = get_workflows()
        
        # Process the query through the appropriate workflow
        response = await workflows.process_query(
            chat_message.message,
            chat_message.agent_id,
            chat_message.context
        )
        
        # Save session if user_id is provided
        session_id = None
        if chat_message.user_id:
            supabase_service = get_supabase_service()
            session_data = await supabase_service.create_user_session(
                chat_message.user_id,
                chat_message.agent_id,
                chat_message.message,
                response
            )
            if session_data:
                session_id = session_data.get("id")
        
        return ChatResponse(
            response=response,
            agent_id=chat_message.agent_id,
            session_id=session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multi-agent", response_model=MultiAgentResponse)
async def chat_with_multiple_agents(request: MultiAgentRequest):
    """
    Send a message to multiple agents and get responses from all
    """
    try:
        # Validate agent IDs
        for agent_id in request.agent_ids:
            persona = AgentPersonas.get_persona_by_id(agent_id)
            if not persona:
                raise HTTPException(status_code=400, detail=f"Invalid agent ID: {agent_id}")
        
        # Get workflows instance
        workflows = get_workflows()
        
        # Process the query through multiple workflows
        responses = await workflows.multi_agent_workflow(
            request.message,
            request.agent_ids,
            request.context
        )
        
        # Save sessions if user_id is provided
        session_ids = {}
        if request.user_id:
            supabase_service = get_supabase_service()
            for agent_id, response in responses.items():
                session_data = await supabase_service.create_user_session(
                    request.user_id,
                    agent_id,
                    request.message,
                    response
                )
                if session_data:
                    session_ids[agent_id] = session_data.get("id")
        
        return MultiAgentResponse(
            responses=responses,
            session_ids=session_ids
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents")
async def list_agents():
    """
    Get list of available agents
    """
    try:
        personas = AgentPersonas.get_all_personas()
        return {"agents": personas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 