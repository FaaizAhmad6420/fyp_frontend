import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import UploadResume from "./UploadResume";

const Resumes = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/resumes/upload/");
      setResumes(response.data);
    } catch (err) {
      setError("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Resumes</h1>
          <button
            onClick={() => navigate("/upload-resume")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading resumes...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        {!loading && resumes.length === 0 && (
          <p className="text-gray-600">No resumes uploaded yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded shadow p-4 flex flex-col gap-2"
            >
              <a
                href={resume.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                {resume.file.split("/").pop()}
              </a>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(resume.created_at).toLocaleString()}
              </p>
              <p className="text-sm font-medium">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {resume.parsed_data ? (
                <details className="mt-3 text-sm text-gray-700">
                  <summary className="cursor-pointer font-semibold">
                    View Parsed Resume Data
                  </summary>

                  <div className="mt-2 space-y-3">

                    {/* Basic Info */}
                    <div>
                      <p className="font-medium">Contact</p>
                      <p>Name: {resume.parsed_data.name || "N/A"}</p>
                      <p>Email: {resume.parsed_data.email || "N/A"}</p>
                      <p>Phone: {resume.parsed_data.phone || "N/A"}</p>
                    </div>

                    {/* Skills */}
                    {resume.parsed_data.skills?.length > 0 && (
                      <div>
                        <p className="font-medium">Skills</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {resume.parsed_data.skills.map((s, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resume.parsed_data.education?.length > 0 && (
                      <div>
                        <p className="font-medium">Education</p>
                        <ul className="list-disc list-inside">
                          {resume.parsed_data.education.map((edu, i) => (
                            <li key={i}>
                              {edu.name}
                              {edu.date_start && ` (${edu.date_start}`}
                              {edu.date_end && ` - ${edu.date_end})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Experience */}
                    {resume.parsed_data.experience?.length > 0 && (
                      <div>
                        <p className="font-medium">Experience</p>
                        <ul className="list-disc list-inside">
                          {resume.parsed_data.experience.map((exp, i) => (
                            <li key={i}>
                              {exp.title} {exp.organization && `- ${exp.organization}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </details>
              ) : resume.extracted_text ? (
                <details className="mt-3 text-sm text-gray-700">
                  <summary className="cursor-pointer font-semibold">
                    View Extracted Text
                  </summary>
                  <pre className="whitespace-pre-wrap mt-2 bg-gray-100 p-2 rounded">
                    {resume.extracted_text}
                  </pre>
                </details>
              ) : null}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resumes;
