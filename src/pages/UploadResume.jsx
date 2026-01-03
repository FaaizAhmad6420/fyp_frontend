import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const navigation = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/resumes/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Resume uploaded successfully!");
      setFile(null);
      navigation("/resumes");
    } catch (error) {
      setMessage("❌ Failed to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex justify-center items-center mt-16">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Upload Resume
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">
              {message}
            </p>
          )}

          <p className="mt-4 text-xs text-gray-500 text-center">
            Supported formats: PDF, DOCX
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
