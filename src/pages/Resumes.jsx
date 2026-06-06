import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

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

  useEffect(() => { fetchResumes(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Your Resumes
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {loading ? "Loading..." : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} uploaded`}
            </p>
          </div>

          <button
            onClick={() => navigate("/upload-resume")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--navy)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload Resume
          </button>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", border: "1px solid #fecaca", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "20px", color: "var(--danger)", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {loading && <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading resumes...</p>}

        {!loading && resumes.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>No resumes uploaded yet.</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {resumes.map((resume) => (
            <div key={resume.id} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}>
              {/* File header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", background: "var(--accent-light)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={resume.file} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {resume.file.split("/").pop()}
                  </a>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {new Date(resume.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* AI Analysis */}
              {resume.ai_analysis && !resume.ai_analysis.error && (
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>
                    AI Analysis
                  </p>

                  {/* ATS Score */}
                  <div style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>ATS Score</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: resume.ats_score >= 75 ? "var(--success)" : resume.ats_score >= 50 ? "var(--warning)" : "var(--danger)" }}>
                        {resume.ats_score}%
                      </span>
                    </div>
                    <div style={{ height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${resume.ats_score}%`, background: resume.ats_score >= 75 ? "#16a34a" : resume.ats_score >= 50 ? "#d97706" : "#dc2626", borderRadius: "99px" }} />
                    </div>
                  </div>

                  {/* Career Domain */}
                  {resume.ai_analysis.career_domain && (
                    <div style={{ marginBottom: "14px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Career Domain</p>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>{resume.ai_analysis.career_domain}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {resume.parsed_data?.skills?.length > 0 && (
                    <div style={{ marginBottom: "14px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Skills</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {resume.parsed_data.skills.map((s, i) => (
                          <span key={i} style={{ padding: "3px 10px", background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", fontSize: "11.5px", fontWeight: 500 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {resume.ai_analysis.missing_skills?.length > 0 && (
                    <div style={{ marginBottom: "14px" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Missing Skills</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {resume.ai_analysis.missing_skills.map((skill, i) => (
                          <span key={i} style={{ padding: "3px 10px", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "99px", fontSize: "11.5px", fontWeight: 500 }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {resume.ai_analysis.strengths?.length > 0 && (
                    <details style={{ marginBottom: "10px" }}>
                      <summary style={{ fontSize: "12px", color: "var(--text-muted)", cursor: "pointer", fontWeight: 500 }}>
                        Strengths ({resume.ai_analysis.strengths.length})
                      </summary>
                      <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
                        {resume.ai_analysis.strengths.map((item, i) => (
                          <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{item}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {/* Suggestions */}
                  {resume.ai_analysis.suggestions?.length > 0 && (
                    <details>
                      <summary style={{ fontSize: "12px", color: "var(--text-muted)", cursor: "pointer", fontWeight: 500 }}>
                        Suggestions ({resume.ai_analysis.suggestions.length})
                      </summary>
                      <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
                        {resume.ai_analysis.suggestions.map((item, i) => (
                          <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>{item}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}

              {resume.ai_analysis?.error && (
                <div style={{ margin: "16px 24px", background: "var(--danger-bg)", border: "1px solid #fecaca", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "var(--danger)", fontSize: "13px" }}>
                  AI Analysis Failed: {resume.ai_analysis.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resumes;
