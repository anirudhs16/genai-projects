from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.agents.personas import AgentPersonas

router = APIRouter()

@router.get("/", response_model=List[Dict])
async def get_all_agents():
    """
    Get all available agent personas
    """
    try:
        return AgentPersonas.get_all_personas()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{agent_id}", response_model=Dict)
async def get_agent_by_id(agent_id: str):
    """
    Get a specific agent persona by ID
    """
    try:
        persona = AgentPersonas.get_persona_by_id(agent_id)
        if not persona:
            raise HTTPException(status_code=404, detail="Agent not found")
        return persona
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{agent_id}/tools")
async def get_agent_tools(agent_id: str):
    """
    Get available tools for a specific agent
    """
    try:
        persona = AgentPersonas.get_persona_by_id(agent_id)
        if not persona:
            raise HTTPException(status_code=404, detail="Agent not found")
        return {"tools": persona.get("tools", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 