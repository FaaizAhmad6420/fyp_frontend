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

                    {/* AI Analysis */}
                    {resume.ai_analysis && !resume.ai_analysis.error && (
                      <div className="mt-6 border-t pt-4">

                        <h2 className="text-xl font-bold mb-4 text-blue-700">
                          AI Resume Analysis
                        </h2>

                        {/* ATS Score */}
                        <div className="mb-4">
                          <p className="font-semibold mb-1">
                            ATS Score
                          </p>

                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-green-500 h-4 rounded-full"
                              style={{
                                width: `${resume.ats_score}%`,
                              }}
                            ></div>
                          </div>

                          <p className="mt-1 text-sm text-gray-700">
                            {resume.ats_score}%
                          </p>
                        </div>

                        {/* Career Domain */}
                        {resume.ai_analysis.career_domain && (
                          <div className="mb-4">
                            <p className="font-semibold">
                              Career Domain
                            </p>

                            <p className="text-gray-700">
                              {resume.ai_analysis.career_domain}
                            </p>
                          </div>
                        )}

                        {/* Missing Skills */}
                        {resume.ai_analysis.missing_skills?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-semibold mb-2">
                              Missing Skills
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {resume.ai_analysis.missing_skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strengths */}
                        {resume.ai_analysis.strengths?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-semibold mb-2">
                              Strengths
                            </p>

                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {resume.ai_analysis.strengths.map((item, index) => (
                                <li key={index}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggestions */}
                        {resume.ai_analysis.suggestions?.length > 0 && (
                          <div>
                            <p className="font-semibold mb-2">
                              Suggestions
                            </p>

                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                              {resume.ai_analysis.suggestions.map((item, index) => (
                                <li key={index}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* AI Cover Letter */}
                        {resume.cover_letter && (
                          <div className="mt-6 border-t pt-4">

                            <h2 className="text-xl font-bold mb-4 text-purple-700">
                              AI Generated Cover Letter
                            </h2>

                            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                              {resume.cover_letter}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Error */}
                    {resume.ai_analysis?.error && (
                      <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
                        AI Analysis Failed: {resume.ai_analysis.error}
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
