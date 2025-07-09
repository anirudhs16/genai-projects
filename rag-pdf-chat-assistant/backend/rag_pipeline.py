import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from azure.ai.inference import EmbeddingsClient, ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

load_dotenv()

# Embedding config
embedding_client = EmbeddingsClient(
    endpoint="https://models.github.ai/inference",
    credential=AzureKeyCredential(os.environ["GITHUB_EMBEDDING_TOKEN"]),
)
embedding_model = "openai/text-embedding-3-large"

# Chat model config
chat_client = ChatCompletionsClient(
    endpoint="https://models.github.ai/inference",
    credential=AzureKeyCredential(os.environ["GITHUB_CHAT_TOKEN"]),
)
chat_model = "openai/gpt-4.1"

# ✅ Fixed embedding wrapper
class GitHubEmbedding:
    def __init__(self, client, model):
        self.client = client
        self.model = model

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        response = self.client.embed(input=texts, model=self.model)
        return [item.embedding for item in response.data]

    def embed_query(self, text: str) -> list[float]:
        response = self.client.embed(input=[text], model=self.model)
        return response.data[0].embedding

    def __call__(self, text: str) -> list[float]:
        # For backward compatibility with LangChain expectations
        return self.embed_query(text)


def load_and_split_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(pages)
    return chunks

def create_vectorstore(chunks):
    embeddings = GitHubEmbedding(client=embedding_client, model=embedding_model)
    return FAISS.from_documents(chunks, embedding=embeddings)

def get_top_k_docs(vectorstore, query, k=4):
    return vectorstore.similarity_search(query, k=k)

def generate_answer(docs: list[Document], question: str):
    context = "\n\n".join([doc.page_content for doc in docs])
    prompt = f"""Use the following context to answer the question.

Context:
{context}

Question: {question}
Answer:"""

    response = chat_client.complete(
        messages=[
            SystemMessage("You are a helpful assistant."),
            UserMessage(prompt),
        ],
        temperature=0.7,
        top_p=1,
        model=chat_model
    )
    return response.choices[0].message.content
