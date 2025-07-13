from typing import Dict, List, Optional
from app.services.openai_service import GitHubAIService
from app.agents.personas import AgentPersonas

class AgentWorkflows:
    """Simplified workflows for different agent personas using GitHub AI directly"""
    
    def __init__(self):
        self.ai_service = GitHubAIService()
    
    async def startup_guidance_workflow(self, query: str, context: Dict = None) -> str:
        """Workflow for startup advisor persona"""
        try:
            persona = AgentPersonas.get_startup_advisor()
            
            # Create a structured prompt
            context_str = str(context) if context else "No additional context provided"
            
            system_prompt = persona["system_prompt"]
            user_message = f"""
Context: {context_str}
User Query: {query}

Please provide comprehensive startup guidance including:
1. Immediate actionable steps
2. Strategic considerations
3. Potential challenges and mitigation strategies
4. Recommended next steps
"""
            
            response = await self.ai_service.generate_with_system_prompt(
                system_prompt=system_prompt,
                user_message=user_message
            )
            
            return response.strip() if response else "I apologize, but I encountered an error while processing your startup guidance request. Please try again or rephrase your question."
            
        except Exception as e:
            print(f"Error in startup guidance workflow: {e}")
            return f"I apologize, but I encountered an error while processing your startup guidance request. Please try again or rephrase your question."
    
    async def content_planning_workflow(self, query: str, context: Dict = None) -> str:
        """Workflow for content strategist persona"""
        try:
            persona = AgentPersonas.get_content_strategist()
            
            context_str = str(context) if context else "No additional context provided"
            
            system_prompt = persona["system_prompt"]
            user_message = f"""
Context: {context_str}
User Query: {query}

Please provide comprehensive content strategy guidance including:
1. Content strategy recommendations
2. Channel-specific tactics
3. Content calendar suggestions
4. Performance metrics to track
5. Implementation timeline
"""
            
            response = await self.ai_service.generate_with_system_prompt(
                system_prompt=system_prompt,
                user_message=user_message
            )
            
            return response.strip() if response else "I apologize, but I encountered an error while processing your content strategy request. Please try again or rephrase your question."
            
        except Exception as e:
            print(f"Error in content planning workflow: {e}")
            return f"I apologize, but I encountered an error while processing your content strategy request. Please try again or rephrase your question."
    
    async def recruitment_process_workflow(self, query: str, context: Dict = None) -> str:
        """Workflow for technical recruiter persona"""
        try:
            persona = AgentPersonas.get_technical_recruiter()
            
            context_str = str(context) if context else "No additional context provided"
            
            system_prompt = persona["system_prompt"]
            user_message = f"""
Context: {context_str}
User Query: {query}

Please provide comprehensive recruitment guidance including:
1. Role requirements and job description optimization
2. Sourcing and outreach strategies
3. Assessment and interview process recommendations
4. Compensation and negotiation guidance
5. Timeline and next steps
"""
            
            response = await self.ai_service.generate_with_system_prompt(
                system_prompt=system_prompt,
                user_message=user_message
            )
            
            return response.strip() if response else "I apologize, but I encountered an error while processing your recruitment request. Please try again or rephrase your question."
            
        except Exception as e:
            print(f"Error in recruitment process workflow: {e}")
            return f"I apologize, but I encountered an error while processing your recruitment request. Please try again or rephrase your question."
    
    async def multi_agent_workflow(self, query: str, agent_ids: List[str], context: Dict = None) -> Dict[str, str]:
        """Multi-agent workflow that chains responses across multiple agents"""
        try:
            results = {}
            
            for agent_id in agent_ids:
                if agent_id == "startup_advisor":
                    results[agent_id] = await self.startup_guidance_workflow(query, context)
                elif agent_id == "content_strategist":
                    results[agent_id] = await self.content_planning_workflow(query, context)
                elif agent_id == "technical_recruiter":
                    results[agent_id] = await self.recruitment_process_workflow(query, context)
            
            return results
            
        except Exception as e:
            print(f"Error in multi-agent workflow: {e}")
            return {"error": "Failed to process multi-agent workflow"}
    
    async def process_query(self, query: str, agent_id: str, context: Dict = None) -> str:
        """Main method to process queries with the appropriate workflow"""
        try:
            if agent_id == "startup_advisor":
                return await self.startup_guidance_workflow(query, context)
            elif agent_id == "content_strategist":
                return await self.content_planning_workflow(query, context)
            elif agent_id == "technical_recruiter":
                return await self.recruitment_process_workflow(query, context)
            else:
                return "Invalid agent ID. Please select a valid agent persona."
                
        except Exception as e:
            print(f"Error processing query: {e}")
            return "I apologize, but I encountered an error. Please try again." 