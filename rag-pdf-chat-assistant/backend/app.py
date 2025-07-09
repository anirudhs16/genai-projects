import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from rag_pipeline import (
    load_and_split_pdf,
    create_vectorstore,
    get_top_k_docs,
    generate_answer,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vectorstore = None

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    file_location = f"temp/{file.filename}"
    os.makedirs("temp", exist_ok=True)
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    chunks = load_and_split_pdf(file_location)
    global vectorstore
    vectorstore = create_vectorstore(chunks)

    return {"message": "File uploaded and processed"}

@app.post("/ask/")
async def ask_question(question: str = Form(...)):
    if vectorstore is None:
        return {"error": "Please upload a document first."}
    docs = get_top_k_docs(vectorstore, question)
    answer = generate_answer(docs, question)
    return {"answer": answer}
