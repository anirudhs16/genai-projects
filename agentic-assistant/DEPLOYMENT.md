# Deployment Guide: Agentic AI Assistant

This guide explains how to deploy the Agentic AI Assistant to production, including both the FastAPI backend and the React frontend.

---

## Prerequisites
- Supabase project (for auth and session storage)
- GitHub AI token (for backend AI integration)
- Production-ready server for backend (e.g., Heroku, AWS, DigitalOcean, etc.)
- Static hosting for frontend (e.g., Vercel, Netlify, AWS S3, etc.)

---

## 1. Backend Deployment

### Environment Variables
Create a `.env` file in your backend directory with:
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
GITHUB_CHAT_TOKEN=your-github-ai-token
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Backend (Production)
- Use a production server like `gunicorn` or `uvicorn` with workers:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
- Or use a process manager (e.g., systemd, pm2, Docker, etc.)

### CORS
- Update allowed origins in `main.py` to include your frontend production domain.

---

## 2. Frontend Deployment

### Environment Variables
Create a `.env` file in your frontend directory with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=https://your-backend-domain.com/api
```

### Build Frontend
```bash
npm install
npm run build
```

### Deploy
- **Vercel:**
  - Connect your repo, set environment variables in the dashboard, and deploy.
- **Netlify:**
  - Drag-and-drop the `dist/` folder or connect your repo.
- **AWS S3/CloudFront:**
  - Upload the `dist/` folder to your S3 bucket and configure CloudFront for CDN.
- **Other static hosts:**
  - Upload the contents of `dist/` as needed.

---

## 3. Supabase Setup
- Ensure your `user_sessions` table allows `agent_id` to be nullable.
- Enable email/password authentication in Supabase Auth settings.
- Set up any additional tables or policies as needed for your use case.

---

## 4. Domain and HTTPS
- Point your domain to your frontend and backend deployments.
- Ensure HTTPS is enabled for both frontend and backend.

---

## 5. Testing
- Test login, error handling, and chat flows in production.
- Confirm sessions are tracked in Supabase.
- Check CORS and environment variable issues.

---

## 6. Troubleshooting
- **Auth errors:** Check Supabase Auth settings and environment variables.
- **CORS issues:** Update allowed origins in backend CORS config.
- **API errors:** Check backend logs and Supabase table permissions.

---

## 7. Maintenance
- Keep dependencies up to date.
- Monitor Supabase usage and quotas.
- Rotate API keys and tokens as needed.

---

## License
MIT 