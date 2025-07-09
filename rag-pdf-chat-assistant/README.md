# 📄 PDF Chat Assistant (RAG-based)

A local Retrieval-Augmented Generation (RAG) tool that lets users upload PDF documents and ask questions about them. It uses:

- **GitHub Marketplace GPT-4.1** for completions
- **GitHub Marketplace Text Embedding 3 (large)** for document embeddings
- **LangChain + FAISS**
- **FastAPI** backend
- **React** frontend

---

## 🚀 Features

- Upload a PDF document
- Automatically chunk + embed content
- Ask natural language questions
- Receive answers grounded in the document

---

## 🧩 Tech Stack

- Python FastAPI backend
- LangChain for RAG logic
- FAISS for vector store
- Azure AI SDK for GitHub-hosted models
- Next.js + Tailwind CSS for frontend UI  

## 📁 Project Structure

rag-pdf-chat-assistant/
├── backend/
│ ├── app.py
│ ├── rag_pipeline.py
│ ├── requirements.txt
│ └── .env.example
├── frontend/
│ ├── pages/
│ │ └── index.js
│ ├── styles/
│ │ └── globals.css
│ ├── package.json
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ └── ...
├── .gitignore
└── README.md

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd rag-pdf-chat-assistant

### 2. Backend Setup 

1.Create and activate a Python virtual environment (recommended):
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

2. Install backend dependencies:

pip install -r backend/requirements.txt

3. Create a .env file in the backend/ directory based on .env.example:

GITHUB_EMBEDDING_TOKEN=your_github_embedding_token_here
GITHUB_CHAT_TOKEN=your_github_chat_token_here

Replace with your actual GitHub tokens for embedding and chat.

4. Start the FastAPI backend server:

uvicorn backend.app:app --reload

The backend will run by default at http://localhost:8000.

### 3. Frontend Setup

1. Navigate to the frontend directory:

cd frontend

2.Install frontend dependencies:
npm install
# or
yarn install

3.Run the development server:
npm run dev
# or
yarn dev

The frontend will run at http://localhost:3000.

###4. Usage
Open your browser and go to http://localhost:3000

Upload a PDF document using the upload interface

Wait for the document to be processed (chunked and embedded)

Ask questions about the uploaded PDF

Answers will be generated based on the document content



🛠 Troubleshooting & Notes
Ensure your GitHub tokens have access to the required models (GPT-4.1 and Text Embedding 3 large).

If file upload or question submission fails, errors are displayed on the UI.

Restart backend and frontend servers after making changes.

Make sure ports 8000 (backend) and 3000 (frontend) are free.