import { useState } from "react";
import axios from "axios";
import { PaperClipIcon, ArrowUpTrayIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";


export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [askError, setAskError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a PDF file first.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("http://localhost:8000/upload/", formData);
      setUploadError("");
      alert("PDF uploaded and processed."); // Could replace with toast in future
    } catch (error) {
      setUploadError(error?.response?.data?.detail || error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setAskError("Please enter a question.");
      return;
    }
    setAskError("");
    setAsking(true);
    setAnswer("");
    try {
      const formData = new FormData();
      formData.append("question", question);
      const res = await axios.post("http://localhost:8000/ask/", formData);
      setAnswer(res.data.answer);
      setAskError("");
    } catch (error) {
      setAskError(error?.response?.data?.detail || error.message || "Failed to get answer");
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 flex items-center gap-3">
        <PaperClipIcon className="h-10 w-10 text-blue-600" />
        PDF Chat Assistant
      </h1>

      {/* Upload Section */}
      <section className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 mb-10">
        <label className="block mb-3 text-lg font-semibold text-gray-700 flex items-center gap-2">
            <ArrowUpTrayIcon className="h-6 w-6 text-blue-600" />
            Upload PDF Document
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-gray-700 border border-gray-300 rounded-md p-3 mb-4 cursor-pointer
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
        />
        {uploadError && <p className="text-red-600 mb-3 font-medium">{uploadError}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
            text-white font-semibold py-3 rounded-md transition
          `}
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload PDF"
          )}
        </button>
      </section>

      {/* Question Section */}
      <section className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <label className="block mb-3 text-lg font-semibold text-gray-700 flex items-center gap-2">
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-green-600" />
          Ask a Question
        </label>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question here..."
          className="block w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        {askError && <p className="text-red-600 mb-3 font-medium">{askError}</p>}

        <button
          onClick={handleAsk}
          disabled={asking}
          className={`w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300
            text-white font-semibold py-3 rounded-md transition
          `}
        >
          {asking ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Thinking...
            </>
          ) : (
            "Ask"
          )}
        </button>

        {answer && (
          <div className="mt-8 bg-gray-100 rounded-lg p-6 border border-gray-300 whitespace-pre-wrap shadow-sm">
            <h3 className="font-semibold mb-3 text-gray-800 text-lg">Answer:</h3>
            <p className="text-gray-700">{answer}</p>
          </div>
        )}
      </section>
    </div>
  );
}
