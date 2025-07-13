import os
from typing import Optional
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

class GitHubAIService:
    def __init__(self):
        # Check if environment variables are set
        github_chat_token = os.getenv("GITHUB_CHAT_TOKEN")
        if not github_chat_token or github_chat_token == "your_github_chat_token_here":
            raise ValueError(
                "GITHUB_CHAT_TOKEN environment variable is not set or is using placeholder value. "
                "Please set it to your actual GitHub chat token in the .env file."
            )
        
        # Initialize GitHub AI chat client
        self.chat_client = ChatCompletionsClient(
            endpoint="https://models.github.ai/inference",
            credential=AzureKeyCredential(github_chat_token),
        )
        self.chat_model = "openai/gpt-4.1"
    
    async def generate_response(self, prompt: str, model: str = None) -> Optional[str]:
        """
        Generate a response using GitHub AI API
        """
        try:
            response = self.chat_client.complete(
                messages=[
                    SystemMessage("You are a helpful assistant."),
                    UserMessage(prompt),
                ],
                temperature=0.7,
                top_p=1,
                model=self.chat_model
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating response: {e}")
            return None
    
    async def generate_with_system_prompt(self, system_prompt: str, user_message: str, model: str = None) -> Optional[str]:
        """
        Generate a response with a system prompt
        """
        try:
            response = self.chat_client.complete(
                messages=[
                    SystemMessage(system_prompt),
                    UserMessage(user_message),
                ],
                temperature=0.7,
                top_p=1,
                model=self.chat_model
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating response: {e}")
            return None

# For backward compatibility, keep the old class name
OpenAIService = GitHubAIService 