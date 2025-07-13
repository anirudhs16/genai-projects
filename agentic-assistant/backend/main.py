import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Agentic Assistant API",
    description="A FastAPI backend for the persona-driven agentic assistant application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.vercel.app"],  # Add your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Agentic Assistant API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openai_key_configured": bool(os.getenv("OPENAI_API_KEY")),
        "supabase_configured": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_ANON_KEY"))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 