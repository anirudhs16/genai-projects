# Agentic AI Assistant

A modern, persona-driven AI assistant platform with a beautiful React frontend and FastAPI backend. Features robust authentication with Supabase, expert AI agents, and a smooth user experience.

---

## Features
- **Multi-agent AI chat**: Interact with specialized AI personas (Startup Advisor, Content Strategist, etc.)
- **Modern, responsive UI**: Beautiful React + Tailwind design
- **Robust authentication**: Supabase email/password login with clear error handling
- **Session tracking**: User sessions and chat history stored in Supabase
- **Smooth UX**: No flicker, clear error messages, and seamless transitions

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <repo-url>
cd agentic-assistant
```

### 2. Backend Setup
- Go to `backend/`
- Create a `.env` file with your Supabase and GitHub AI credentials:
  ```env
  SUPABASE_URL=your-supabase-url
  SUPABASE_ANON_KEY=your-supabase-anon-key
  GITHUB_CHAT_TOKEN=your-github-ai-token
  ```
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Run the backend:
  ```bash
  uvicorn main:app --reload
  ```

### 3. Frontend Setup
- Go to `frontend/`
- Create a `.env` file:
  ```env
  VITE_SUPABASE_URL=your-supabase-url
  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
  VITE_API_URL=http://localhost:8000/api
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Run the frontend:
  ```bash
  npm run dev
  ```
- Open [http://localhost:3000](http://localhost:3000)

---

## Usage
- **Login** with your Supabase email/password account (sign up in Supabase if needed).
- **Error messages** are always visible and user-friendly.
- **Chat** with any available AI agent after login.
- **Sessions** are tracked in Supabase for analytics and history.

---

## Environment Variables

**Backend (`backend/.env`):**
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: Your Supabase project credentials
- `GITHUB_CHAT_TOKEN`: Your GitHub AI token

**Frontend (`frontend/.env`):**
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: Your Supabase project credentials
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000/api`)

---

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

---

## License
MIT 